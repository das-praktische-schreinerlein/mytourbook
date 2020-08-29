import {Mapper, utils} from 'js-data';
import {TourDocImageRecord} from '../shared/tdoc-commons/model/records/tdocimage-record';
import {TourDocRecord} from '../shared/tdoc-commons/model/records/tdoc-record';
import {TourDocDataService} from '../shared/tdoc-commons/services/tdoc-data.service';
import {TourDocSearchForm} from '../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../shared/tdoc-commons/model/container/tdoc-searchresult';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import * as readdirp from 'readdirp';
import {TourDocAdapterResponseMapper} from '../shared/tdoc-commons/services/tdoc-adapter-response.mapper';
import {DateUtils} from '@dps/mycms-commons/dist/commons/utils/date.utils';
import {MediaManagerModule} from '@dps/mycms-server-commons/dist/media-commons/modules/media-manager.module';
import {TourDocVideoRecord} from '../shared/tdoc-commons/model/records/tdocvideo-record';
import * as ffmpeg from 'fluent-ffmpeg';
import {SqlConnectionConfig} from './tdoc-dataservice.module';
import * as knex from 'knex';
import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import * as Promise_serial from 'promise-serial';
import {RawSqlQueryData, SqlUtils} from '@dps/mycms-commons/dist/search-commons/services/sql-utils';
import {GenericSearchOptions} from '@dps/mycms-commons/dist/search-commons/services/generic-search.service';

export interface FileInfoType {
    created: Date;
    lastModified: Date;
    exifDate: Date;
    name: string;
    dir: string;
    size: number;
    type: string;
}
export type FileSystemDBSyncMatchingType = 'EXIFDATE' | 'FILEDATE' | 'FILENAME' | 'FILEDIRANDNAME' | 'FILESIZE' | 'FILENAMEANDDATE'
    | 'SIMILARITY';
export interface DBFileInfoType extends FileInfoType {
    id: string;
    matching: FileSystemDBSyncMatchingType;
    matchingDetails: string;
    matchingScore: number;
}
export interface FileSystemDBSyncType {
    file: FileInfoType;
    records: DBFileInfoType[];
}

export class TourDocMediaManagerModule {
    private readonly dataService: TourDocDataService;
    private readonly backendConfig: {};
    private readonly knex;
    private readonly sqlQueryBuilder: SqlQueryBuilder;

    private static mapDBResultOnFileInfoType(dbResult: any, records: DBFileInfoType[]): void {
        for (let i = 0; i <= dbResult.length; i++) {
            if (dbResult[i] !== undefined) {
                const entry: DBFileInfoType = {
                    dir: undefined,
                    exifDate: undefined,
                    id: undefined,
                    created: undefined,
                    lastModified: undefined,
                    matching: undefined,
                    matchingDetails: undefined,
                    matchingScore: undefined,
                    name: undefined,
                    size: undefined,
                    type: undefined
                };
                for (const key in dbResult[i]) {
                    if (dbResult[i].hasOwnProperty(key)) {
                        entry[key] = dbResult[i][key];
                    }
                }
                records.push(entry);
            }
        }
    }

    constructor(backendConfig, dataService: TourDocDataService, private mediaManager: MediaManagerModule) {
        this.dataService = dataService;
        this.backendConfig = backendConfig;
        this.sqlQueryBuilder = new SqlQueryBuilder();
        this.knex = this.createKnex(backendConfig);
    }

    public readMediaDates(searchForm: TourDocSearchForm): Promise<{}> {
        const me = this;
        const callback = function(tdoc: TourDocRecord) {
            return [me.readAndUpdateDateFromTourDocRecord(tdoc)];
        };

        return this.processSearchForms(searchForm, callback, 1, {
            loadDetailsMode: undefined,
            loadTrack: false,
            showFacets: false,
            showForm: false
        });
    }

    public scaleImages(searchForm: TourDocSearchForm, parallel: number): Promise<{}> {
        const me = this;
        const callback = function(tdoc: TourDocRecord) {
            return [me.scaleTourDocRecord(tdoc, 100), me.scaleTourDocRecord(tdoc, 300), me.scaleTourDocRecord(tdoc, 600)];
        };

        return this.processSearchForms(searchForm, callback, parallel, {
            loadDetailsMode: undefined,
            loadTrack: false,
            showFacets: false,
            showForm: false
        });
    }

    public readAndUpdateDateFromTourDocRecord(tdoc: TourDocRecord): Promise<{}> {
        const me = this;
        return this.readMetadataForTourDocRecord(tdoc).then(value => {
            // Exif-dates are not in UTC they are in localtimezone
            if (value === undefined || value === null) {
                console.warn('no exif found for ' + tdoc.id + ' details:' + tdoc);
                return utils.resolve({});
            }

            let creationDate = BeanUtils.getValue(value, 'exif.DateTimeOriginal');
            if (creationDate === undefined || creationDate === null) {
                creationDate = new Date(BeanUtils.getValue(value, 'format.tags.creation_time'));
            }

            if (creationDate === undefined || creationDate === null) {
                console.warn('no exif.DateTimeOriginal or format.tags.creation_time found for ' + tdoc.id +
                    ' details:' + tdoc + ' exif:' + creationDate);
                return utils.resolve({});
            }

            const myDate = new Date();
            myDate.setHours(creationDate.getUTCHours(), creationDate.getUTCMinutes(), creationDate.getUTCSeconds(),
                creationDate.getUTCMilliseconds());
            myDate.setFullYear(creationDate.getUTCFullYear(), creationDate.getUTCMonth(), creationDate.getUTCDate());
            const date = DateUtils.dateToLocalISOString(myDate).toString();
            for (const key of ['datestart', 'dateend', 'dateshow']) {
                tdoc[key] = date;
            }

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
                        name_s: locationName,
                        keywords_txt: 'KW_TODOKEYWORDS',
                        desc_txt: 'TODODESC'
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
                        keywords_txt: 'KW_TODOKEYWORDS',
                        desc_txt: 'TODODESC',
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
            }, function allCallBack(errors) {
                if (errors) {
                    errors.forEach(function (err) {
                        return reject(err);
                    });
                }
                resolve(records);
            });
        });
    }

    public findCorrespondingTourDocRecordsForMedia(baseDir: string, additionalMappings: {[key: string]: FileSystemDBSyncType}):
        Promise<FileSystemDBSyncType[]> {
        const me = this;
        const mediaTypes = {
            'jpg': 'IMAGE',
            'jpeg': 'IMAGE',
            'JPG': 'IMAGE',
            'JPEG': 'IMAGE',
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

        const entries: FileSystemDBSyncType[] = [];

        return new Promise<FileSystemDBSyncType[]>((resolve, reject) => {
            readdirp(settings, function fileCallBack(fileRes) {
                const path = fileRes['path'].replace(/\\/g, '/');
                const file = fileRes['name'].replace(/\\/g, '/');
                const dir = fileRes['parentDir'].replace(/\\/g, '/');
                const cdate = fileRes['stat']['ctime'];
                const mdate = fileRes['stat']['mtime'];
                const size = fileRes['stat']['size'];
                const extension = file.split('.').splice(-1);
                const type = mediaTypes[extension];
                if (type === undefined) {
                    console.warn('SKIP file - unknown extension', path);
                    return;
                }

                const fileInfo: FileInfoType = {
                    dir: dir,
                    created: cdate,
                    lastModified: mdate,
                    exifDate: undefined,
                    name: file,
                    size: size,
                    type: type
                };
                const records: DBFileInfoType[] = [];
                entries.push({file: fileInfo, records: records});
            }, function allCallBack(errors) {
                if (errors) {
                    errors.forEach(function (err) {
                        return reject(err);
                    });
                }
                resolve(entries);
            });
        }).then(fileSystemTourDocSyncEntries => {
            const promises = fileSystemTourDocSyncEntries.map(fileSystemTourDocSyncEntry => {
                return function () {
                    return me.findTourDocRecordsForFileInfo(baseDir, fileSystemTourDocSyncEntry.file, additionalMappings).then(records => {
                        if (records !== undefined) {
                            fileSystemTourDocSyncEntry.records = records;
                        }
                        return utils.resolve(true);
                    }).catch(function onError(error) {
                        return utils.reject(error);
                    });
                };
            });
            const results = Promise_serial(promises, {parallelize: 1});

            return results.then(() => {
                return utils.resolve(fileSystemTourDocSyncEntries);
            }).catch(errors => {
                return utils.reject(errors);
            });
        });
    }

    public readMetadataForTourDocRecord(tdoc: TourDocRecord): Promise<{}> {
        const tdocImages = tdoc.get('tdocimages');
        if (tdocImages !== undefined  && tdocImages.length > 0) {
            return this.readExifForTourDocImageRecord(tdocImages[0]);
        }
        const tdocVideos = tdoc.get('tdocvideos');
        if (tdocVideos !== undefined  && tdocVideos.length > 0) {
            return this.readMetadataForTourDocVideoRecord(tdocVideos[0]);
        }

        console.warn('no image or video found for ' + tdoc.id);
        return utils.resolve({});
    }

    public readExifForTourDocImageRecord(tdocImage: TourDocImageRecord): Promise<{}> {
        return this.mediaManager.readExifForImage(this.backendConfig['apiRoutePicturesStaticDir'] + '/'
            + (this.backendConfig['apiRouteStoredPicturesResolutionPrefix'] || '') + 'full/' +  tdocImage.fileName);
    }

    public readMetadataForTourDocVideoRecord(tdocVideo: TourDocVideoRecord): Promise<{}> {
        return new Promise<{}>((resolve, reject) => {
            ffmpeg.ffprobe(this.backendConfig['apiRouteVideosStaticDir'] + '/'
                + (this.backendConfig['apiRouteStoredVideosResolutionPrefix'] || '') + 'full/' +  tdocVideo.fileName,
                function(err, metadata) {
                    if (err) {
                        reject('error while reading video-metadata: ' + err);
                    }

                    resolve(metadata);
                });
        });
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

    public findTourDocRecordsForFileInfo(baseDir: string, fileInfo: FileInfoType,
                                         additionalMappings: {[key: string]: FileSystemDBSyncType}): Promise<DBFileInfoType[]> {
        return new Promise<DBFileInfoType[]>((resolve, reject) => {
            const createdInSecondsSinceEpoch = Math.round(DateUtils.parseDate(fileInfo.created).getTime() / 1000);
            const lastModInSecondsSinceEpoch = Math.round(DateUtils.parseDate(fileInfo.lastModified).getTime() / 1000);
            const filePath = (fileInfo.dir + '/' + fileInfo.name).replace(/[\\\/]+/g, '/');
            const fullPath = (baseDir + '/' + filePath).replace(/[\\\/]+/g, '/');
            const checkPreferredSqlQuery: RawSqlQueryData = {
                sql:
                    'SELECT DISTINCT CONCAT("IMAGE_", i_id) as id, i_file AS name, i_dir AS dir, i_date AS created, i_date AS lastModified,' +
                    '      i_date AS exifDate, "IMAGE" AS type, "FILEDIRANDNAME" AS matching,' +
                    '      ? AS matchingDetails, 0 AS matchingScore' +
                    '  FROM image' +
                    '  WHERE LOWER(CONCAT(I_dir, "_", i_file)) = LOWER(?)',
                parameters: [
                    'filename:' + fileInfo.name,
                    fileInfo.name]
            };
            checkPreferredSqlQuery.sql += ' UNION ' +
                'SELECT DISTINCT CONCAT("IMAGE_", i_id) as id, i_file AS name, i_dir AS dir, i_date AS created, i_date AS lastModified,' +
                '      i_date AS exifDate, "IMAGE" AS type, "FILEDIRANDNAME" AS matching,' +
                '      ? AS matchingDetails, 0 AS matchingScore' +
                '  FROM image' +
                '  WHERE LOWER(CONCAT(I_dir, "/", i_file)) = LOWER(?)';
            checkPreferredSqlQuery.parameters =  checkPreferredSqlQuery.parameters.concat([
                'dir: ' + fileInfo.dir + ' filename:' + fileInfo.name,
                filePath]);
            checkPreferredSqlQuery.sql += ' UNION ' +
                'SELECT DISTINCT CONCAT("IMAGE_", i_id) as id, i_file AS name, i_dir AS dir, i_date AS created, i_date AS lastModified,' +
                '      i_date AS exifDate, "IMAGE" AS type, "FILENAMEANDDATE" AS matching,' +
                '      ? AS matchingDetails,' +
                '      0.25 AS matchingScore' +
                '  FROM image' +
                '  WHERE LOWER(i_file) = LOWER(?)' +
                '      AND (   UNIX_TIMESTAMP(i_date) BETWEEN ? AND ?' +
                '           OR UNIX_TIMESTAMP(i_date) BETWEEN ? AND ?)';
            checkPreferredSqlQuery.parameters =  checkPreferredSqlQuery.parameters.concat([
                'filename:' + fileInfo.name + ' cdate:' + createdInSecondsSinceEpoch + ' mdate:' + lastModInSecondsSinceEpoch,
                fileInfo.name,
                (createdInSecondsSinceEpoch - 1),
                (createdInSecondsSinceEpoch + 1),
                (lastModInSecondsSinceEpoch - 1),
                (lastModInSecondsSinceEpoch + 1)
            ]);
            checkPreferredSqlQuery.sql += ' UNION ' +
                'SELECT DISTINCT CONCAT("VIDEO_", v_id) as id, v_file AS name, v_dir AS dir, v_date AS created, v_date AS lastModified,' +
                '      v_date AS exifDate, "VIDEO" AS type, "FILEDIRANDNAME" AS matching,' +
                '      ? AS matchingDetails, 0 AS matchingScore' +
                '  FROM video' +
                '  WHERE LOWER(CONCAT(V_dir, "_", v_file)) = LOWER(?)';
            checkPreferredSqlQuery.parameters =  checkPreferredSqlQuery.parameters.concat([
                'filename:' + fileInfo.name,
                fileInfo.name
            ]);
            checkPreferredSqlQuery.sql += ' UNION ' +
                'SELECT DISTINCT CONCAT("VIDEO_", v_id) as id, v_file AS name, v_dir AS dir, v_date AS created, v_date AS lastModified,' +
                '      v_date AS exifDate, "VIDEO" AS type, "FILEDIRANDNAME" AS matching,' +
                '      ? AS matchingDetails, 0 AS matchingScore' +
                '  FROM video' +
                '  WHERE LOWER(CONCAT(v_dir, "/", v_file)) = LOWER(?)';
            checkPreferredSqlQuery.parameters =  checkPreferredSqlQuery.parameters.concat([
                'dir: ' + fileInfo.dir + ' filename:' + fileInfo.name,
                filePath
            ]);
            checkPreferredSqlQuery.sql += ' UNION ' +
                'SELECT DISTINCT CONCAT("VIDEO_", v_id) as id, v_file AS name, v_dir AS dir, v_date AS created, v_date AS lastModified,' +
                '      v_date AS exifDate, "VIDEO" AS type, "FILENAMEANDDATE" AS matching,' +
                '      ? AS matchingDetails,' +
                '      0.25 AS matchingScore' +
                '  FROM video' +
                '  WHERE LOWER(v_file) = LOWER(?)' +
                '      AND (   UNIX_TIMESTAMP(v_date) BETWEEN ? AND ?' +
                '           OR UNIX_TIMESTAMP(v_date) BETWEEN ? AND ?)';
            checkPreferredSqlQuery.parameters =  checkPreferredSqlQuery.parameters.concat([
                'filename:' + fileInfo.name + ' cdate:' + createdInSecondsSinceEpoch + ' mdate:' + lastModInSecondsSinceEpoch,
                fileInfo.name,
                (createdInSecondsSinceEpoch - 1),
                (createdInSecondsSinceEpoch + 1),
                (lastModInSecondsSinceEpoch - 1),
                (lastModInSecondsSinceEpoch + 1)
            ]);
            return SqlUtils.executeRawSqlQueryData(this.knex, checkPreferredSqlQuery).then(dbResults => {
                const records: DBFileInfoType[] = [];
                TourDocMediaManagerModule.mapDBResultOnFileInfoType(
                    this.sqlQueryBuilder.extractDbResult(dbResults, this.knex.client['config']['client']), records);

                if (records.length > 0) {
                    resolve(records);
                    return;
                }

                const checkFallBackSqlQuery: RawSqlQueryData = {
                    sql:
                        'SELECT DISTINCT CONCAT("IMAGE_", i_id) as id, i_file AS name, i_dir AS dir, i_date AS created,' +
                        '       i_date AS lastModified, i_date AS exifDate, "IMAGE" AS type, "FILENAME" AS matching,' +
                        '       ? AS matchingDetails, 0.5 AS matchingScore' +
                        '  FROM image' +
                        '  WHERE LOWER(i_file) = LOWER(?)',
                    parameters: [
                        'filename:' + fileInfo.name,
                        fileInfo.name
                    ]
                };
                checkFallBackSqlQuery.sql += ' UNION ' +
                    'SELECT DISTINCT CONCAT("IMAGE_", i_id) as id, i_file AS name, i_dir AS dir, i_date AS created,' +
                    '       i_date AS lastModified, i_date AS exifDate, "IMAGE" AS type, "FILEDATE" AS matching,' +
                    '       ? AS matchingDetails,' +
                    '       0.75 AS matchingScore' +
                    '  FROM image' +
                    '  WHERE (   UNIX_TIMESTAMP(i_date) BETWEEN ? AND ?' +
                    '         OR UNIX_TIMESTAMP(i_date) BETWEEN ? AND ?)';
                checkFallBackSqlQuery.parameters =  checkFallBackSqlQuery.parameters.concat([
                    'cdate:' + createdInSecondsSinceEpoch + ' mdate:' + lastModInSecondsSinceEpoch,
                    (createdInSecondsSinceEpoch - 1),
                    (createdInSecondsSinceEpoch + 1),
                    (lastModInSecondsSinceEpoch - 1),
                    (lastModInSecondsSinceEpoch + 1)
                ]);
                checkFallBackSqlQuery.sql += ' UNION ' +
                    'SELECT DISTINCT CONCAT("VIDEO_", v_id) as id, v_file AS name, v_dir AS dir, v_date AS created,' +
                    '       v_date AS lastModified, v_date AS exifDate, "VIDEO" AS type, "FILENAME" AS matching,' +
                    '       ? AS matchingDetails, 0.5 AS matchingScore' +
                    '  FROM video' +
                    '  WHERE LOWER(v_file) = LOWER(?)';
                checkFallBackSqlQuery.parameters =  checkFallBackSqlQuery.parameters.concat([
                    'filename:' + fileInfo.name,
                    fileInfo.name
                ]);
                checkFallBackSqlQuery.sql += ' UNION ' +
                    'SELECT DISTINCT CONCAT("VIDEO_", v_id) as id, v_file AS name, v_dir AS dir, v_date AS created,' +
                    '       v_date AS lastModified, v_date AS exifDate, "VIDEO" AS type, "FILEDATE" AS matching,' +
                    '       ? AS matchingDetails,' +
                    '       0.75 AS matchingScore' +
                    '  FROM video' +
                    '  WHERE (   UNIX_TIMESTAMP(v_date) BETWEEN ? AND ?' +
                    '         OR UNIX_TIMESTAMP(v_date) BETWEEN ? AND ?)';
                checkFallBackSqlQuery.parameters =  checkFallBackSqlQuery.parameters.concat([
                    'cdate:' + createdInSecondsSinceEpoch + ' mdate:' + lastModInSecondsSinceEpoch,
                    (createdInSecondsSinceEpoch - 1),
                    (createdInSecondsSinceEpoch + 1),
                    (lastModInSecondsSinceEpoch - 1),
                    (lastModInSecondsSinceEpoch + 1)
                ]);

                for (const fileInfoKey of [filePath, fullPath]) {
                    if (additionalMappings && additionalMappings[fileInfoKey.toLowerCase()]) {
                        const additionalMapping = additionalMappings[fileInfoKey.toLowerCase()];
                        additionalMapping.records.forEach(record => {
                            const recordPath = (record.dir + '/' + record.name).replace(/\\/g, '/');
                            checkFallBackSqlQuery.sql +=
                                ' UNION ' +
                                'SELECT DISTINCT CONCAT("IMAGE_", i_id) as id, i_file AS name, i_dir AS dir, i_date AS created,' +
                                '       i_date AS lastModified, i_date AS exifDate, "IMAGE" AS type,' +
                                '       ? AS matching,' +
                                '       ? AS matchingDetails,' +
                                '       ? AS matchingScore' +
                                '  FROM image' +
                                '  WHERE LOWER(CONCAT(I_dir, "/", i_file)) = LOWER(?)';
                            checkFallBackSqlQuery.parameters =  checkFallBackSqlQuery.parameters.concat([
                                record.matching,
                                record.matchingDetails,
                                record.matchingScore,
                                recordPath
                            ]);
                            checkFallBackSqlQuery.sql += ' UNION ' +
                                'SELECT DISTINCT CONCAT("VIDEO_", v_id) as id, v_file AS name, v_dir AS dir, v_date AS created,' +
                                '       v_date AS lastModified, v_date AS exifDate, "VIDEO" AS type,' +
                                '       ? AS matching,' +
                                '       ? AS matchingDetails,' +
                                '       ? AS matchingScore' +
                                '  FROM video' +
                                '  WHERE LOWER(CONCAT(v_dir, "/", v_file)) = LOWER(?)';
                            checkFallBackSqlQuery.parameters = checkFallBackSqlQuery.parameters.concat([
                                record.matching,
                                record.matchingDetails,
                                record.matchingScore,
                                recordPath
                            ]);
                        });
                    }
                }

                return SqlUtils.executeRawSqlQueryData(this.knex, checkFallBackSqlQuery).then(fallBackDbResults => {
                    TourDocMediaManagerModule.mapDBResultOnFileInfoType(
                        this.sqlQueryBuilder.extractDbResult(fallBackDbResults, this.knex.client['config']['client']), records);

                    if (records.length > 0) {
                        resolve(records);
                        return;
                    }
                    if (fileInfo.type !== 'IMAGE') {
                        resolve(records);
                        return;
                    }

                    this.mediaManager.readExifForImage(baseDir + '/' + fileInfo.dir + '/' + fileInfo.name).then(value => {
                        // Exif-dates are not in UTC they are in localtimezone
                        if (value === undefined || value === null) {
                            console.warn('no exif found for ' + fileInfo.name + ' details:' + fileInfo);
                            resolve(records);
                            return;
                        }

                        let creationDate = BeanUtils.getValue(value, 'exif.DateTimeOriginal');
                        if (creationDate === undefined || creationDate === null) {
                            creationDate = new Date(BeanUtils.getValue(value, 'format.tags.creation_time'));
                        }

                        if (creationDate === undefined || creationDate === null) {
                            console.warn('no exif.DateTimeOriginal or format.tags.creation_time found for ' + fileInfo.name +
                                ' details:' + fileInfo + ' exif:' + creationDate);
                            resolve(records);
                            return;
                        }

                        const myDate = new Date();
                        myDate.setHours(creationDate.getUTCHours(), creationDate.getUTCMinutes(), creationDate.getUTCSeconds(), 0);
                        myDate.setFullYear(creationDate.getUTCFullYear(), creationDate.getUTCMonth(), creationDate.getUTCDate());

                        fileInfo.exifDate = myDate;
                        const localExifDate = DateUtils.parseDateStringWithLocaltime(
                            DateUtils.dateToLocalISOString(fileInfo.exifDate));
                        localExifDate.setMilliseconds(0);
                        const exifDateInSSinceEpoch = Math.round(localExifDate.getTime() / 1000);

                        return utils.resolve(exifDateInSSinceEpoch);
                    }).then(exifDateInSSinceEpoch => {
                        if (exifDateInSSinceEpoch === undefined) {
                            resolve(records);
                            return;
                        }

                        const checkDateSqlQuery: RawSqlQueryData = {
                            sql:
                                'SELECT CONCAT("IMAGE_", i_id) as id, i_file AS name, i_dir AS dir, i_date AS created,' +
                                '       i_date AS lastModified, i_date AS exifDate,' +
                                '       "IMAGE" AS type, "EXIFDATE" AS matching,' +
                                '       ? AS matchingDetails, 0.9 AS matchingScore' +
                                '  FROM image' +
                                '  WHERE UNIX_TIMESTAMP(i_date)' +
                                '        BETWEEN ? AND ?',
                            parameters: [
                                'exifdate:' + exifDateInSSinceEpoch,
                                (exifDateInSSinceEpoch - 1),
                                (exifDateInSSinceEpoch + 1)
                            ]
                        };
                        SqlUtils.executeRawSqlQueryData(this.knex, checkDateSqlQuery).then(dateDbResults => {
                            TourDocMediaManagerModule.mapDBResultOnFileInfoType(
                                this.sqlQueryBuilder.extractDbResult(dateDbResults, this.knex.client['config']['client']), records);
                            resolve(records);
                            return;
                        }).catch(reason => {
                            console.error('findTourDocRecordsForFileInfo ' + fileInfo + ' failed:', reason);
                            reject(reason);
                            return;
                        });
                    });

                    return;
                }).catch(reason => {
                    console.error('findTourDocRecordsForFileInfo ' + fileInfo + ' failed:', reason);
                    return reject(reason);
                });
            }).catch(reason => {
                console.error('findTourDocRecordsForFileInfo ' + fileInfo + ' failed:', reason);
                return reject(reason);
            });
        });
    }

    protected createKnex(backendConfig: {}): any {
        // configure adapter
        const sqlConfig: SqlConnectionConfig = backendConfig['TourDocSqlMytbDbAdapter'];
        if (sqlConfig === undefined) {
            throw new Error('config for TourDocSqlMytbDbAdapter not exists');
        }
        const options = {
            knexOpts: {
                client: sqlConfig.client,
                connection: sqlConfig.connection
            }
        };
        return knex(options.knexOpts);
    }

    private processSearchForms(searchForm: TourDocSearchForm, cb, parallel: number, opts: GenericSearchOptions): Promise<{}> {
        searchForm.perPage = parallel;
        searchForm.pageNum = 1;

        const me = this;
        const startTime = (new Date()).getTime();
        const readNextImage = function(): Promise<any> {
            return me.dataService.search(searchForm, opts).then(
                function searchDone(searchResult: TourDocSearchResult) {
                    let promises: Promise<any>[] = [];
                    for (const tdoc of searchResult.currentRecords) {
                        promises = promises.concat(cb(tdoc));
                    }

                    return Promise.all(promises).then(() => {
                        const dur = Math.round(((new Date()).getTime() - startTime) / 1000);
                        const alreadyDone = searchForm.pageNum * searchForm.perPage;
                        const performance = Math.round(alreadyDone / dur + 1);
                        console.log('DONE processed page ' +
                            searchForm.pageNum +
                            ' [' + ((searchForm.pageNum - 1) * searchForm.perPage + 1) +
                            '-' + alreadyDone + ']' +
                            ' / ' + Math.round(searchResult.recordCount / searchForm.perPage + 1) +
                            ' [' + searchResult.recordCount + ']' +
                            ' in ' + dur + 's' +
                            ' with ' + performance + ' per s' +
                            ' approximately ' + Math.round(((searchResult.recordCount - alreadyDone) / performance + 1) / 60) + 'min left'
                    );
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
