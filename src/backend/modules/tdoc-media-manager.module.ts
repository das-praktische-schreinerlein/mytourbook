import {Router} from 'js-data-express';
import {Mapper, utils} from 'js-data';
import {TourDocImageRecord} from '../shared/tdoc-commons/model/records/tdocimage-record';
import {TourDocRecord} from '../shared/tdoc-commons/model/records/tdoc-record';
import {TourDocDataService} from '../shared/tdoc-commons/services/tdoc-data.service';
import {TourDocSearchForm} from '../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../shared/tdoc-commons/model/container/tdoc-searchresult';
import {BeanUtils} from '../shared/commons/utils/bean.utils';
import * as readdirp from 'readdirp';
import {TourDocAdapterResponseMapper} from '../shared/tdoc-commons/services/tdoc-adapter-response.mapper';
import {DateUtils} from '../shared/commons/utils/date.utils';
import {MediaManagerModule} from '../shared-node/media-commons/modules/media-manager.module';

export class TourDocMediaManagerModule {
    private dataService: TourDocDataService;
    private backendConfig: {};

    constructor(backendConfig, dataService: TourDocDataService, private mediaManager: MediaManagerModule) {
        this.dataService = dataService;
        this.backendConfig = backendConfig;
    }

    public readImageDates(searchForm: TourDocSearchForm): Promise<{}> {
        const me = this;
        const callback = function(tdoc: TourDocRecord) {
            return [me.readAndUpdateDateFormTourDocRecord(tdoc)];
        };

        return this.processSearchForms(searchForm, callback, 1);
    }

    public scaleImages(searchForm: TourDocSearchForm): Promise<{}> {
        const me = this;
        const callback = function(tdoc: TourDocRecord) {
            return [me.scaleTourDocRecord(tdoc, 100), me.scaleTourDocRecord(tdoc, 600)];
        };

        return this.processSearchForms(searchForm, callback, 1);
    }

    public readAndUpdateDateFormTourDocRecord(tdoc: TourDocRecord): Promise<{}> {
        const tdocImages = tdoc.get('tdocimages');
        if (tdocImages === undefined  || tdocImages.length === 0) {
            console.warn('no image found for ' + tdoc.id + ' details:' + tdoc);
            return utils.resolve({});
        }

        const me = this;
        return this.readExifForTourDocImageRecord(tdocImages[0]).then(value => {
            // Exif-dates are not in UTC they are in localtimezone
            if (value === undefined || value === null) {
                console.warn('no exif found for ' + tdoc.id + ' details:' + tdocImages[0]);
                return utils.resolve({});
            }
            const exifDate = BeanUtils.getValue(value, 'exif.DateTimeOriginal');
            if (exifDate === undefined || exifDate === null) {
                console.warn('no exif.DateTimeOriginal found for ' + tdoc.id + ' details:' + tdocImages[0] + ' exif:' + exifDate);
                return utils.resolve({});
            }
            const myDate = new Date();
            myDate.setHours(exifDate.getUTCHours(), exifDate.getUTCMinutes(), exifDate.getUTCSeconds(), exifDate.getUTCMilliseconds());
            myDate.setFullYear(exifDate.getUTCFullYear(), exifDate.getUTCMonth(), exifDate.getUTCDate());
            tdoc.datestart = tdoc.dateshow = tdoc.dateend = myDate;
            return me.dataService.updateById(tdoc.id, tdoc);
        });
    }

    public generateTourDocRecordsFromMediaDir(baseDir: string): Promise<TourDocRecord[]> {
        const mapper: Mapper = this.dataService.getMapper('tdoc');
        const responseMapper = new TourDocAdapterResponseMapper(this.backendConfig);
        const mediaTypes = {
            'jpg': 'IMAGE',
            'JPG': 'IMAGE',
            'MP4': 'VIDEO',
            'mp4': 'VIDEO'
        };
        const fileExtensions = [];
        for (const mediaType in mediaTypes) {
            fileExtensions.push('*.' + mediaType);
        }
        const settings = {
            root: baseDir,
            entryType: 'files',
            // Filter files with js and json extension
            fileFilter: fileExtensions,
            // Filter by directory
            directoryFilter: [ '!.git', '!*modules' ],
            // Work with files up to 1 subdirectory deep
            depth: 10
        };

        const tracks = {};
        const locations = {};
        const media = {};
        const records: TourDocRecord[] = [];

        return new Promise<TourDocRecord[]>((resolve, reject) => {
            readdirp(settings, function fileCallBack(fileRes) {
                const path = fileRes['path'].replace(/\\/g, '/');
                const file = fileRes['name'].replace(/\\/g, '/');
                const dir = fileRes['parentDir'].replace(/\\/g, '/');
                const date = fileRes['stat']['mtime'];
                const extension = file.split('.').splice(-1);
                const type = mediaTypes[extension];
                if (type === undefined) {
                    console.warn('SKIP file - unknown extension', path);
                    return;
                }

                if (media[path]) {
                    return;
                }

                const values = {
                    datestart_dt: date,
                    dateend_dt: date,
                    dateshow_dt: date
                };
                let trackName = dir || file;
                let locationName = dir || file;

                // normalize trackName
                let dateStr = '';
                const matcher = trackName.match(/(\d\d\d\d)(\d\d)(\d\d){0,1}-(.*)?/);
                if (matcher) {
                    dateStr = (matcher[3] ? matcher[3] + '.' : '') + matcher[2] + '.' + matcher[1];
                    locationName = (matcher[4] ? matcher[4] : 'Unbekannt');
                }

                // normalize locationName
                const words = locationName.split('-');
                locationName = '';
                for (let word of words) {
                    word = word.substring(0, 1).toUpperCase() + word.substring(1);
                    locationName = locationName.concat(word).concat(' ');
                }
                locationName = locationName.trim();
                trackName = (locationName + ' ' + dateStr).trim();

                let location: TourDocRecord = locations[locationName];
                if (!locations[locationName]) {
                    location = <TourDocRecord>responseMapper.mapResponseDocument(mapper, {
                        type_s: 'LOCATION',
                        id: 'LOCATION_' + (records.length + 1),
                        loc_id_i: records.length + 1,
                        name_s: locationName
                    }, {});
                    records.push(location);
                    locations[locationName] = location;
                }
                values['loc_id_i'] = location.locId;

                let track: TourDocRecord = tracks[trackName];
                if (!tracks[trackName]) {
                    track = <TourDocRecord>responseMapper.mapResponseDocument(mapper, {
                        type_s: 'TRACK',
                        id: 'TRACK_' + (records.length + 1),
                        track_id_i: records.length + 1,
                        loc_id_i: location.locId,
                        name_s: trackName,
                        dateshow_dt: date,
                        datestart_dt: date,
                        dateend_dt: date
                    }, {});
                    records.push(track);
                    tracks[trackName] = track;
                }
                values['track_id_i'] = track.trackId;
                if (DateUtils.parseDate(track.datestart).getTime() > DateUtils.parseDate(date).getTime()) {
                    track.datestart = date;
                }
                if (DateUtils.parseDate(track.dateend).getTime() < DateUtils.parseDate(date).getTime()) {
                    track.dateend = date;
                }

                if (type === 'IMAGE') {
                    values['i_fav_url_txt'] = path;
                    values['image_id_i'] = records.length + 1;
                }
                if (type === 'VIDEO') {
                    values['v_fav_url_txt'] = path;
                    values['video_id_i'] = records.length + 1;
                }
                values['type_s'] = type;
                values['id'] = type + '_' + (records.length + 1);
                values['name_s'] = trackName + ' ' + DateUtils.formatDateTime(date);
                const tdoc = <TourDocRecord>responseMapper.mapResponseDocument(mapper, values, {});
                media[path] = tdoc;
                records.push(tdoc);
            }, function allCallBack(errors, res) {
                if (errors) {
                    errors.forEach(function (err) {
                        return reject(err);
                    });
                }
                resolve(records);
            });
        });
    }

    public readExifForTourDocRecord(tdoc: TourDocRecord): Promise<{}> {
        const tdocImages = tdoc.get('tdocimages');
        if (tdocImages === undefined  || tdocImages.length === 0) {
            console.warn('no image found for ' + tdoc.id);
            return utils.resolve({});
        }

        return this.readExifForTourDocImageRecord(tdocImages[0]);
    }

    public readExifForTourDocImageRecord(tdocImage: TourDocImageRecord): Promise<{}> {
        return this.mediaManager.readExifForImage(this.backendConfig['apiRoutePicturesStaticDir'] + '/'
            + (this.backendConfig['apiRouteStoredPicturesResolutionPrefix'] || '') + 'full/' +  tdocImage.fileName);
    }

    public scaleTourDocRecord(tdoc: TourDocRecord, width: number): Promise<{}> {
        const tdocImages = tdoc.get('tdocimages');
        if (tdocImages === undefined  || tdocImages.length === 0) {
            console.warn('no image found for ' + tdoc.id);
            return utils.resolve({});
        }

        return this.scaleTourDocImageRecord(tdocImages[0], width);
    }

    public scaleTourDocImageRecord(tdocImage: TourDocImageRecord, width: number): Promise<{}> {
        return this.mediaManager.scaleImage(this.backendConfig['apiRoutePicturesStaticDir'] + '/'
                + (this.backendConfig['apiRouteStoredPicturesResolutionPrefix'] || '') + 'full/' +  tdocImage.fileName,
            this.backendConfig['apiRoutePicturesStaticDir'] + '/'
                + (this.backendConfig['apiRouteStoredPicturesResolutionPrefix'] || '') + 'x' + width + '/' +  tdocImage.fileName,
            width);
    }

    private processSearchForms(searchForm: TourDocSearchForm, cb, parallel: number): Promise<{}> {
        searchForm.perPage = parallel;
        searchForm.pageNum = 1;

        const me = this;
        const readNextImage = function(): Promise<any> {
            return me.dataService.search(searchForm).then(
                function searchDone(searchResult: TourDocSearchResult) {
                    let promises: Promise<any>[] = [];
                    for (const tdoc of searchResult.currentRecords) {
                        promises = promises.concat(cb(tdoc));
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
