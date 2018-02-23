import {Router} from 'js-data-express';
import {utils} from 'js-data';
import {SDocImageRecord} from '../shared/sdoc-commons/model/records/sdocimage-record';
import {SDocRecord} from '../shared/sdoc-commons/model/records/sdoc-record';
import {SDocDataService} from '../shared/sdoc-commons/services/sdoc-data.service';
import {SDocSearchForm} from '../shared/sdoc-commons/model/forms/sdoc-searchform';
import {SDocSearchResult} from '../shared/sdoc-commons/model/container/sdoc-searchresult';
import {BeanUtils} from '../shared/commons/utils/bean.utils';
import * as exif from 'fast-exif';
import * as Jimp from 'jimp';
import * as gm from 'gm';
import * as mkdirp from 'mkdirp';
import * as fs from 'fs';

export class ImageManagerModule {
    private dataService: SDocDataService;
    private backendConfig: {};
    private gm;

    constructor(backendConfig, dataService: SDocDataService) {
        this.dataService = dataService;
        this.backendConfig = backendConfig;
        this.gm = gm.subClass({imageMagick: true, appPath: backendConfig['imageMagicAppPath']});
    }

    public readImageDates(searchForm: SDocSearchForm): Promise<{}> {
        const me = this;
        const callback = function(sdoc: SDocRecord) {
            return [me.readAndUpdateDateFormSDocRecord(sdoc)];
        };

        return this.processSearchForms(searchForm, callback, 1);
    }

    public scaleImages(searchForm: SDocSearchForm): Promise<{}> {
        const me = this;
        const callback = function(sdoc: SDocRecord) {
            return [me.scaleSDocRecord(sdoc, 100), me.scaleSDocRecord(sdoc, 600)];
        };

        return this.processSearchForms(searchForm, callback, 1);
    }

    public readAndUpdateDateFormSDocRecord(sdoc: SDocRecord): Promise<{}> {
        const sdocImages = sdoc.get('sdocimages');
        if (sdocImages === undefined  || sdocImages.length === 0) {
            console.warn('no image found for ' + sdoc.id);
            return utils.resolve({});
        }

        const me = this;
        return this.readExifForSDocImageRecord(sdocImages[0]).then(value => {
            // Exif-dates are not in UTC they are in localtimezone
            const exifDate = BeanUtils.getValue(value, 'exif.DateTimeOriginal');
            const myDate = new Date();
            myDate.setHours(exifDate.getUTCHours(), exifDate.getUTCMinutes(), exifDate.getUTCSeconds(), exifDate.getUTCMilliseconds());
            myDate.setFullYear(exifDate.getUTCFullYear(), exifDate.getUTCMonth(), exifDate.getUTCDate());
            sdoc.datestart = sdoc.dateshow = sdoc.dateend = myDate;
            return me.dataService.updateById(sdoc.id, sdoc);
        });
    }

    public readExifForSDocRecord(sdoc: SDocRecord): Promise<{}> {
        const sdocImages = sdoc.get('sdocimages');
        if (sdocImages === undefined  || sdocImages.length === 0) {
            console.warn('no image found for ' + sdoc.id);
            return utils.resolve({});
        }

        return this.readExifForSDocImageRecord(sdocImages[0]);
    }

    public readExifForSDocImageRecord(sdocImage: SDocImageRecord): Promise<{}> {
        return this.readExifForImage(this.backendConfig['apiRoutePicturesStaticDir'] + '/'
            + (this.backendConfig['apiRouteStoredPicturesResolutionPrefix'] || '') + 'full/' +  sdocImage.fileName);
    }

    public readExifForImage(imagePath: string): Promise<{}> {
        return exif.read(imagePath);
    }

    public scaleSDocRecord(sdoc: SDocRecord, width: number): Promise<{}> {
        const sdocImages = sdoc.get('sdocimages');
        if (sdocImages === undefined  || sdocImages.length === 0) {
            console.warn('no image found for ' + sdoc.id);
            return utils.resolve({});
        }

        return this.scaleSDocImageRecord(sdocImages[0], width);
    }

    public scaleSDocImageRecord(sdocImage: SDocImageRecord, width: number): Promise<{}> {
        return this.scaleImage(this.backendConfig['apiRoutePicturesStaticDir'] + '/'
                + (this.backendConfig['apiRouteStoredPicturesResolutionPrefix'] || '') + 'full/' +  sdocImage.fileName,
            this.backendConfig['apiRoutePicturesStaticDir'] + '/'
                + (this.backendConfig['apiRouteStoredPicturesResolutionPrefix'] || '') + 'x' + width + '/' +  sdocImage.fileName,
            width);
    }

    public scaleImage(imagePath: string, resultPath: string, width: number): Promise<{}> {
        if (fs.existsSync(resultPath)) {
            return utils.resolve(imagePath);
        }

        const resultDir = resultPath.replace(/[\\\/]+(?=[^\/\\]*$).*$/, '');
        mkdirp.sync(resultDir);

        return this.scaleImageGm(imagePath, resultPath, width);
    }

    public scaleImageJimp(imagePath: string, resultPath: string, width: number): Promise<{}> {
        return Jimp.read(imagePath).then(function (image) {
            image.resize(width, Jimp.AUTO)
                .quality(90)
                .write(resultPath, function(err){
                    if (err) {
                        console.error(imagePath + ' FAILED:', err);
                        return utils.reject(err);
                    }

                    console.log(imagePath + ' OK:' + err);
                    return utils.resolve(resultPath);
                });
        }).catch(function (err) {
            console.error(imagePath + ' FAILED:', err);
            return utils.reject(err);
        });
    }

    public scaleImageGm(imagePath: string, resultPath: string, width: number): Promise<{}> {
        return new Promise<{}>((resolve, reject) => {
            // options seen on https://stackoverflow.com/questions/7261855/recommendation-for-compressing-jpg-files-with-imagemagick
            this.gm(imagePath)
                .autoOrient()
                .gaussian(0.05)
                .interlace('Plane')
                .quality(85)
                .resize(width)
                .noProfile()
                .write(resultPath, function (err) {
                    if (err) {
                        console.error(imagePath + ' FAILED:', err);
                        return reject(err);
                    }

                    console.log(imagePath + ' OK');
                    return resolve(resultPath);
                });
        });
    }

    private processSearchForms(searchForm: SDocSearchForm, cb, parallel: number): Promise<{}> {
        searchForm.perPage = parallel;
        searchForm.pageNum = 1;

        const me = this;
        const readNextImage = function(): Promise<any> {
            return me.dataService.search(searchForm).then(
                function searchDone(searchResult: SDocSearchResult) {
                    let promises: Promise<any>[] = [];
                    for (const sdoc of searchResult.currentRecords) {
                        promises = promises.concat(cb(sdoc));
                    }

                    return Promise.all(promises).then(value => {
                        searchForm.pageNum++;

                        if (searchForm.pageNum < (searchResult.recordCount / searchForm.perPage + 1)) {
                            return readNextImage();
                        } else {
                            return utils.resolve('WELL DONE');
                        }
                    });
                }
            ).catch(function searchError(error) {
                console.error('error thrown: ', error);
                return utils.reject(error);
            });
        };

        return readNextImage();
    }
}
