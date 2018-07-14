import {Router} from 'js-data-express';
import {Mapper, utils} from 'js-data';
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
import * as fsExtra from 'fs-extra';
import * as readdirp from 'readdirp';
import * as ffmpeg from 'fluent-ffmpeg';
import {FfmpegCommand} from 'fluent-ffmpeg';
import * as Promise_serial from 'promise-serial';
import {SDocAdapterResponseMapper} from '../shared/sdoc-commons/services/sdoc-adapter-response.mapper';
import {DateUtils} from '../shared/commons/utils/date.utils';

export class MediaManagerModule {
    private dataService: SDocDataService;
    private backendConfig: {};
    private gm;

    constructor(backendConfig, dataService: SDocDataService, private tmpDir: string) {
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
            console.warn('no image found for ' + sdoc.id + ' details:' + sdoc);
            return utils.resolve({});
        }

        const me = this;
        return this.readExifForSDocImageRecord(sdocImages[0]).then(value => {
            // Exif-dates are not in UTC they are in localtimezone
            if (value === undefined || value === null) {
                console.warn('no exif found for ' + sdoc.id + ' details:' + sdocImages[0]);
                return utils.resolve({});
            }
            const exifDate = BeanUtils.getValue(value, 'exif.DateTimeOriginal');
            if (exifDate === undefined || exifDate === null) {
                console.warn('no exif.DateTimeOriginal found for ' + sdoc.id + ' details:' + sdocImages[0] + ' exif:' + exifDate);
                return utils.resolve({});
            }
            const myDate = new Date();
            myDate.setHours(exifDate.getUTCHours(), exifDate.getUTCMinutes(), exifDate.getUTCSeconds(), exifDate.getUTCMilliseconds());
            myDate.setFullYear(exifDate.getUTCFullYear(), exifDate.getUTCMonth(), exifDate.getUTCDate());
            sdoc.datestart = sdoc.dateshow = sdoc.dateend = myDate;
            return me.dataService.updateById(sdoc.id, sdoc);
        });
    }

    public rotateVideo(srcPath: string, rotate: number): Promise<string> {
        const me = this;
        return new Promise<string>((processorResolve, processorReject) => {
            const patterns = srcPath.split(/[\/\\]/);
            const tmpFileNameBase = 'tmpfile-' + (new Date().getTime()) + '-';
            const fileName = patterns.splice(-1)[0];
            const destPath = me.tmpDir + '/' + tmpFileNameBase + fileName;
            const command = ffmpeg()
                .on('error', function (err) {
                    console.error('An error occurred:', srcPath, destPath, err);
                    processorReject(err);
                })
                .on('progress', function (progress) {
                    console.log('Processing ' + srcPath + ': ' + progress.percent + '% done @ '
                        + progress.currentFps + ' fps');
                })
                .on('end', function (err, stdout, stderr) {
                    const srcFileTimeMp4 = fs.statSync(srcPath).mtime;
                    fsExtra.copy(destPath, srcPath)
                        .then(() => {
                            console.log('Finished processing:', srcPath, destPath, err);
                            fs.utimesSync(destPath, srcFileTimeMp4, srcFileTimeMp4);
                            processorResolve(srcPath);
                        })
                        .catch(err2 => {
                            console.error('An error occurred:', srcPath, destPath, err2);
                            processorReject(err2);
                        });
                });
            command
                .input(srcPath)
                .audioCodec('copy')
                .videoCodec('copy')
                .outputOption('-map_metadata 0')
                .outputOption('-metadata:s:v:0 rotate=' + rotate)
                .output(destPath)
                .run();
        });
    }
    public convertVideosFromMediaDirToMP4(baseDir: string, destDir: string, flgIgnoreIfExists: boolean): Promise<{}> {
        const mediaTypes = {
            'MOV': 'VIDEO',
            'mov': 'VIDEO',
            'AVI': 'VIDEO',
            'avi': 'VIDEO'
        };
        return this.doFfmegActionOnVideosFromMediaDir(baseDir, destDir, '.MP4', mediaTypes, flgIgnoreIfExists,
            function (command: FfmpegCommand) {
                return command.outputFormat('mp4')
                    .outputOption('-map_metadata 0')
                    .outputOption('-pix_fmt yuv420p');
            });
    }

    public scaleVideosFromMediaDirToMP4(baseDir: string, destDir: string, width: number, flgIgnoreIfExists: boolean): Promise<{}> {
        const mediaTypes = {
            'MP4': 'VIDEO',
            'mp4': 'VIDEO'
        };
        return this.doFfmegActionOnVideosFromMediaDir(baseDir, destDir, '', mediaTypes, flgIgnoreIfExists,
            function (command: FfmpegCommand) {
                return command.outputFormat('mp4')
                    .size(width + 'x?')
                    .autopad(true, 'black')
                    .keepDisplayAspectRatio()
                    .outputOptions('-pix_fmt yuv420p');
            });
    }

    public generateVideoScreenshotFromMediaDir(baseDir: string, destDir: string, width: number, flgIgnoreIfExists: boolean): Promise<{}> {
        const mediaTypes = {
            'MP4': 'VIDEO',
            'mp4': 'VIDEO'
        };

        return this.doActionOnVideosFromMediaDir(baseDir, destDir, '.jpg', mediaTypes,
            function (srcPath, destPath, processorResolve, processorReject) {
            if (flgIgnoreIfExists && fs.existsSync(destPath)) {
                console.log('SKIP - already exists', destPath);
                return processorResolve(destPath);
            }

            const patterns = destPath.split(/[\/\\]/);
            const fileName = patterns.splice(-1)[0];
            const fileDir = patterns.join('/');
            return ffmpeg(srcPath)
                    .on('error', function (err) {
                        console.error('An error occurred:', srcPath, destPath, err);
                        processorReject(err);
                    })
                    .on('progress', function (progress) {
//                        console.log('Processing ' + srcPath + ': ' + progress.percent + '% done @ '
//                            + progress.currentFps + ' fps');
                    })
                    .on('end', function (err, stdout, stderr) {
                        console.log('Finished processing:', srcPath, destPath, err);
                        const srcFileTime = fs.statSync(srcPath).mtime;
                        fs.utimesSync(destPath, srcFileTime, srcFileTime);
                        processorResolve(destPath);
                    })
                    .screenshots({
                        count: 1,
                        filename: fileName,
                        folder: fileDir,
                        size: width + 'x?'
                    });
        });
    }

    public generateVideoPreviewFromMediaDir(baseDir: string, destDir: string, width: number, flgIgnoreIfExists: boolean): Promise<{}> {
        const mediaTypes = {
            'MP4': 'VIDEO',
            'mp4': 'VIDEO'
        };
        const me = this;

        return this.doActionOnVideosFromMediaDir(baseDir, destDir, '.gif', mediaTypes,
            function (srcPath, destPath, processorResolve, processorReject) {
                if (flgIgnoreIfExists && fs.existsSync(destPath) && fs.existsSync(destPath + '.mp4')) {
                    console.log('SKIP - already exists', destPath);
                    return processorResolve(destPath);
                }

                const patterns = destPath.split(/[\/\\]/);
                patterns.splice(-1)[0];
                const fileDir = patterns.join('/');
                let files = [];
                const tmpFileNameBase = 'tmpfile-' + (new Date().getTime()) + '-';
                ffmpeg(srcPath)
                    .on('filenames', function(filenames) {
                        files = filenames;
                    })
                    .on('error', function (err) {
                        console.error('An error occurred:', srcPath, destPath, err);
                        processorReject(err);
                    })
                    .on('progress', function (progress) {
//                        console.log('Processing ' + srcPath + ': ' + progress.percent + '% done @ '
//                            + progress.currentFps + ' fps');
                    })
                    .on('end', function (err, stdout, stderr) {
                        let gmCommand = me.gm();
                        for (const file of files) {
                            gmCommand = gmCommand.in(me.tmpDir + '/' + file).quality(80).delay(1000);
                        }
                        gmCommand.write(destPath, function(err2){
                            if (err2) {
                                console.error('An error occurred:', srcPath, destPath, err2);
                                return processorReject(err);
                            }

                            const srcFileTime = fs.statSync(srcPath).mtime;
                            fs.utimesSync(destPath, srcFileTime, srcFileTime);

                            destPath = destPath + '.mp4';
                            const command = ffmpeg()
                                .on('error', function (err3) {
                                    console.error('An error occurred:', srcPath, destPath, err3);
                                    processorReject(err);
                                })
                                .on('progress', function (progress2) {
//                                    console.log('Processing ' + srcPath + ': ' + progress2.percent + '% done @ '
//                                        + progress2.currentFps + ' fps');
                                })
                                .on('end', function (err3, stdout2, stderr2) {
                                    console.log('Finished processing:', srcPath, destPath, err3);
                                    const srcFileTimeMp4 = fs.statSync(srcPath).mtime;
                                    fs.utimesSync(destPath, srcFileTimeMp4, srcFileTimeMp4);
                                    processorResolve(destPath);
                                });
                            command
                                .input(me.tmpDir + '/' + tmpFileNameBase + '%1d.png')
                                .inputFPS(3)
                                .output(destPath)
                                .size(width + 'x?')
                                .outputOptions('-pix_fmt yuv420p')
                                .run();
                        });
                    })
                    .screenshots({
                        count: 10,
                        filename: tmpFileNameBase + '%i.png',
                        folder: me.tmpDir,
                        size: width + 'x?'
                    });
            });
    }

    public generateSDocRecordsFromMediaDir(baseDir: string): Promise<SDocRecord[]> {
        const mapper: Mapper = this.dataService.getMapper('sdoc');
        const responseMapper = new SDocAdapterResponseMapper(this.backendConfig);
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
        const records: SDocRecord[] = [];

        return new Promise<SDocRecord[]>((resolve, reject) => {
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

                let location: SDocRecord = locations[locationName];
                if (!locations[locationName]) {
                    location = <SDocRecord>responseMapper.mapResponseDocument(mapper, {
                        type_s: 'LOCATION',
                        id: 'LOCATION_' + (records.length + 1),
                        loc_id_i: records.length + 1,
                        name_s: locationName
                    }, {});
                    records.push(location);
                    locations[locationName] = location;
                }
                values['loc_id_i'] = location.locId;

                let track: SDocRecord = tracks[trackName];
                if (!tracks[trackName]) {
                    track = <SDocRecord>responseMapper.mapResponseDocument(mapper, {
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
                const sdoc = <SDocRecord>responseMapper.mapResponseDocument(mapper, values, {});
                media[path] = sdoc;
                records.push(sdoc);
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

    public scaleImageJimp(imagePath: string, resultPath: string, width: number, flgIgnoreIfExists?: boolean): Promise<{}> {
        if (flgIgnoreIfExists && fs.existsSync(resultPath)) {
            console.log('SKIP - already exists', resultPath);
            return utils.resolve(resultPath);
        }

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

    public scaleImageGm(imagePath: string, resultPath: string, width: number, flgIgnoreIfExists?: boolean): Promise<{}> {
        return new Promise<{}>((resolve, reject) => {
            // options seen on https://stackoverflow.com/questions/7261855/recommendation-for-compressing-jpg-files-with-imagemagick
            if (flgIgnoreIfExists && fs.existsSync(resultPath)) {
                console.log('SKIP - already exists', resultPath);
                return resolve(resultPath);
            }

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

    private doFfmegActionOnVideosFromMediaDir(baseDir: string, destDir: string, destSuffix: string, mediaTypes: {},
                                              flgIgnoreIfExists: boolean, ffmegCommandExtender: any): Promise<{}> {
        return this.doActionOnVideosFromMediaDir(baseDir, destDir, destSuffix, mediaTypes,
            function (srcPath, destPath, processorResolve, processorReject) {
                if (flgIgnoreIfExists && fs.existsSync(destPath)) {
                    console.log('SKIP - already exists', srcPath, destPath);
                    return processorResolve(destPath);
                }

                let command = ffmpeg(srcPath)
                    .on('error', function (err) {
                        console.error('An error occurred:', srcPath, destPath, err);
                        processorReject(err);
                    })
                    .on('progress', function (progress) {
//                        console.log('Processing ' + srcPath + ': ' + progress.percent + '% done @ '
//                            + progress.currentFps + ' fps');
                    })
                    .on('end', function (err, stdout, stderr) {
                        console.log('Finished processing:', srcPath, destPath, err);
                        const srcFileTime = fs.statSync(srcPath).mtime;
                        fs.utimesSync(destPath, srcFileTime, srcFileTime);
                        processorResolve(destPath);
                    })
                    .output(destPath);
                command = ffmegCommandExtender(command);
                command.run();
        });
    }

    private doActionOnVideosFromMediaDir(baseDir: string, destDir: string, destSuffix: string, mediaTypes: {},
                                         commandExtender: any): Promise<{}> {
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

        const media = {};

        return new Promise<{}>((resolve, reject) => {
            readdirp(settings, function fileCallBack(fileRes) {
                const srcPath = baseDir + fileRes['path'];
                const destPath = destDir + fileRes['path'] + destSuffix;
                const extension = srcPath.split('.').splice(-1)[0];
                const type = mediaTypes[extension];
                if (type === undefined) {
                    console.warn('SKIP file - unknown extension', srcPath);
                    return;
                }

                if (media[destPath]) {
                    return;
                }

                media[destPath] = srcPath;
            }, function allCallBack(errors, res) {
                if (errors) {
                    errors.forEach(function (err) {
                        return reject(err);
                    });
                }

                const funcs = [];
                for (const destPath in media) {
                    funcs.push(function () { return new Promise<string>((processorResolve, processorReject) => {
                            const patterns = destPath.split(/[\/\\]/);
                            patterns.splice(-1)[0];
                            const fileDir = patterns.join('/');
                            mkdirp.sync(fileDir);
                            commandExtender(media[destPath], destPath, processorResolve, processorReject);
                        });
                    });
                }

                Promise_serial(funcs, {parallelize: 1}).then(arrayOfResults => {
                    resolve(media);
                }).catch(reason => {
                    reject(reason);
                });
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
