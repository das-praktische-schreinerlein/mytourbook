import {utils} from 'js-data';
import {TourDocRecord} from '../shared/tdoc-commons/model/records/tdoc-record';
import {TourDocDataService} from '../shared/tdoc-commons/services/tdoc-data.service';
import {TourDocSearchForm} from '../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../shared/tdoc-commons/model/container/tdoc-searchresult';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {DateUtils} from '@dps/mycms-commons/dist/commons/utils/date.utils';
import {MediaManagerModule} from '@dps/mycms-server-commons/dist/media-commons/modules/media-manager.module';
import {SqlConnectionConfig} from './tdoc-dataservice.module';
import * as knex from 'knex';
import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {RawSqlQueryData, SqlUtils} from '@dps/mycms-commons/dist/search-commons/services/sql-utils';
import {
    CommonDocMediaManagerModule,
    DBFileInfoType,
    FileInfoType,
    FileSystemDBSyncType
} from '@dps/mycms-server-commons/dist/backend-commons/modules/cdoc-media-manager.module';
import {BackendConfigType} from './backend.commons';
import {TourDocServerPlaylistService} from './tdoc-serverplaylist.service';
import {TourDocExportService} from './tdoc-export.service';
import {TourDocMediaFileImportManager} from './tdoc-mediafile-import.service';
import * as Promise_serial from 'promise-serial';

export class TourDocMediaManagerModule extends CommonDocMediaManagerModule<TourDocRecord, TourDocSearchForm,
    TourDocSearchResult, TourDocDataService, TourDocServerPlaylistService, TourDocExportService> {
    private knex;
    private readonly sqlQueryBuilder: SqlQueryBuilder;

    constructor(protected backendConfig, dataService: TourDocDataService, mediaManager: MediaManagerModule,
                exportService: TourDocExportService, protected mediaFileImportManager: TourDocMediaFileImportManager) {
        super(backendConfig, dataService, mediaManager, exportService);
        this.sqlQueryBuilder = new SqlQueryBuilder();
    }

    public updateDateOfCommonDocRecord(tdoc: TourDocRecord, myDate: Date): Promise<{}> {
        const date = DateUtils.dateToLocalISOString(myDate).toString();

        for (const key of ['datestart', 'dateend', 'dateshow']) {
            tdoc[key] = date;
        }

        return this.dataService.updateById(tdoc.id, tdoc);
    }

    public generateTourDocRecordsFromMediaDir(baseDir: string): Promise<TourDocRecord[]> {
        return this.mediaFileImportManager.generateTourDocRecordsFromMediaDir(baseDir,
            this.getFileExtensionToTypeMappings());
    }

    public readMetadataForCommonDocRecord(tdoc: TourDocRecord): Promise<{}> {
        const tdocImages = tdoc.get('tdocimages');
        if (tdocImages !== undefined  && tdocImages.length > 0) {
            return this.readExifForCommonDocImageRecord(tdocImages[0]);
        }
        const tdocVideos = tdoc.get('tdocvideos');
        if (tdocVideos !== undefined  && tdocVideos.length > 0) {
            return this.readMetadataForCommonDocVideoRecord(tdocVideos[0]);
        }

        console.warn('no image or video found for ' + tdoc.id);
        return utils.resolve({});
    }

    public scaleCommonDocRecordMediaWidth(tdoc: TourDocRecord, width: number): Promise<{}> {
        const tdocImages = tdoc.get('tdocimages');
        if (tdocImages === undefined  || tdocImages.length === 0) {
            console.warn('no image found for ' + tdoc.id);
            return utils.resolve({});
        }

        return this.scaleCommonDocImageRecord(tdocImages[0], width);
    }

    public prepareAdditionalMappings(additionalMappingsSrc: string, mapKeyTo: boolean): {[key: string]: FileSystemDBSyncType} {
        if (!additionalMappingsSrc['files']) {
            return {};
        }

        const additionalMappings: {[key: string]: FileSystemDBSyncType} = {};
        const possibleLocalPaths = [];
        ['full', 'x100', 'x300', 'x600', 'x1400'].forEach(resolution => {
            const path = this.backendConfig.apiRoutePicturesStaticDir + '/' +
                (this.backendConfig.apiRouteStoredPicturesResolutionPrefix || '') + resolution + '/';
            possibleLocalPaths.push(path);
            possibleLocalPaths.push(path.replace(/[\\\/]+/g, '/'));
            possibleLocalPaths.push(path.toLowerCase());
            possibleLocalPaths.push(path.replace(/[\\\/]+/g, '/').toLowerCase());
        });
        const fileRecords: FileSystemDBSyncType[] = additionalMappingsSrc['files'];
        fileRecords.forEach(fileRecord => {
            fileRecord.records.forEach(record => {
                record.dir = record.dir.replace(/[\\\/]+/g, '/');
                possibleLocalPaths.forEach(possibleLocalPath => {
                    record.dir = record.dir.replace(possibleLocalPath, '');
                });
            });

            if (mapKeyTo) {
                fileRecord.file.dir = fileRecord.file.dir.replace(/[\\\/]+/g, '/');
                possibleLocalPaths.forEach(possibleLocalPath => {
                    fileRecord.file.dir = fileRecord.file.dir.replace(possibleLocalPath, '');
                });
            }
            const fileInfoKey = (fileRecord.file.dir + '/' + fileRecord.file.name).replace(/[\\\/]+/g, '/');
            additionalMappings[fileInfoKey.toLowerCase()] = fileRecord;
        });

        return additionalMappings;
    }

    public findCommonDocRecordsForFileInfo(baseDir: string, fileInfo: FileInfoType,
                                           additionalMappings: {[key: string]: FileSystemDBSyncType}): Promise<DBFileInfoType[]> {
        this.initKnex();
        return new Promise<DBFileInfoType[]>((resolve, reject) => {
            const createdInSecondsSinceEpoch = Math.round(DateUtils.parseDate(fileInfo.created).getTime() / 1000);
            const lastModInSecondsSinceEpoch = Math.round(DateUtils.parseDate(fileInfo.lastModified).getTime() / 1000);
            const filePath = (fileInfo.dir + '/' + fileInfo.name).replace(/[\\\/]+/g, '/');
            const fullPath = (baseDir + '/' + filePath).replace(/[\\\/]+/g, '/');
            const checkPreferredSqlQuery: RawSqlQueryData = {
                sql:
                    'SELECT DISTINCT CONCAT("IMAGE_", i_id) as id, i_file AS name, i_dir AS dir, i_date AS created,' +
                    '      i_date AS lastModified, i_date AS exifDate, "IMAGE" AS type, "FILEDIRANDNAME" AS matching,' +
                    '      ? AS matchingDetails, 0 AS matchingScore' +
                    '  FROM image' +
                    '  WHERE BINARY LOWER(CONCAT(I_dir, "_", i_file)) = BINARY LOWER(?)',
                parameters: [
                    'filename:' + fileInfo.name,
                    fileInfo.name]
            };
            checkPreferredSqlQuery.sql += ' UNION ' +
                'SELECT DISTINCT CONCAT("IMAGE_", i_id) as id, i_file AS name, i_dir AS dir, i_date AS created,' +
                '      i_date AS lastModified, i_date AS exifDate, "IMAGE" AS type, "FILEDIRANDNAME" AS matching,' +
                '      ? AS matchingDetails, 0 AS matchingScore' +
                '  FROM image' +
                '  WHERE BINARY LOWER(CONCAT(I_dir, "/", i_file)) = BINARY LOWER(?)';
            checkPreferredSqlQuery.parameters =  checkPreferredSqlQuery.parameters.concat([
                'dir: ' + fileInfo.dir + ' filename:' + fileInfo.name,
                filePath]);
            checkPreferredSqlQuery.sql += ' UNION ' +
                'SELECT DISTINCT CONCAT("IMAGE_", i_id) as id, i_file AS name, i_dir AS dir, i_date AS created,' +
                '      i_date AS lastModified, i_date AS exifDate, "IMAGE" AS type, "FILENAMEANDDATE" AS matching,' +
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
                                '  WHERE BINARY LOWER(CONCAT(I_dir, "/", i_file)) = BINARY LOWER(?)';
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

    public insertSimilarMatchings(additionalMappings: {[key: string]: FileSystemDBSyncType}): Promise<{}> {
        const me = this;
        return new Promise<{}>((allResolve, allReject) => {
            const promises = [];
            for (const fileInfoKey in additionalMappings) {
                if (!additionalMappings.hasOwnProperty(fileInfoKey)) {
                    console.warn('SKIP - non existing fileInfoKey', fileInfoKey);
                    continue;
                }

                promises.push(function () {
                    return me.insertSimilarMatching(fileInfoKey, additionalMappings[fileInfoKey.toLowerCase()]);
                });
            }

            return Promise_serial(promises, {parallelize: 1}).then(() => {
                return allResolve('DONE - insertSimilarMatchings');
            }).catch(reason => {
                return allReject(reason);
            });
        });
    }

    public insertSimilarMatching(fileInfoKey: string, additionalMapping: FileSystemDBSyncType): Promise<any> {
        this.initKnex();
        const me = this;
        // first read baseFile
        const checkBaseFileSqlQuery: RawSqlQueryData = {
            sql:
                'SELECT DISTINCT i_id as id' +
                '  FROM image' +
                '  WHERE BINARY LOWER(CONCAT(I_dir, "/", i_file)) = BINARY LOWER(?)',
            parameters: [
                fileInfoKey.toLowerCase()
            ]
        };

        return SqlUtils.executeRawSqlQueryData(me.knex, checkBaseFileSqlQuery).then(readDbResults => {
            // delete refs for basefile
            const readResult = me.sqlQueryBuilder.extractDbResult(readDbResults, me.knex.client['config']['client']);
            if (readResult === undefined || readResult.length < 1) {
                console.warn('NOT FOUND fileInfoKey in database', fileInfoKey);
                return Promise.resolve();
            }

            console.log('DO import fileInfoKey in database', fileInfoKey, additionalMapping.records.length + 1);

            const id = readResult[0]['id'];
            const deleteSqlQuery: RawSqlQueryData = {
                sql:
                    'DELETE FROM IMAGE_SIMILAR WHERE i_id in (?)',
                parameters: [id]
            };
            return SqlUtils.executeRawSqlQueryData(me.knex, deleteSqlQuery).then(() => {
                const updatePromises = [];
                additionalMapping.records.forEach(record => {
                    const recordPath = (record.dir + '/' + record.name).replace(/\\/g, '/');
                    const checkSimilarFileSqlQuery: RawSqlQueryData = {
                        sql:
                            'SELECT DISTINCT i_id as id' +
                            '  FROM image' +
                            '  WHERE BINARY LOWER(CONCAT(I_dir, "/", i_file)) = BINARY LOWER(?)',
                        parameters: [
                            recordPath.toLowerCase()
                        ]
                    };

                    const promise = SqlUtils.executeRawSqlQueryData(me.knex, checkSimilarFileSqlQuery).then(readSimilarDbResults => {
                        // delete refs for basefile
                        const readSimilarResult = me.sqlQueryBuilder.extractDbResult(readSimilarDbResults,
                            me.knex.client['config']['client']);
                        if (readSimilarResult === undefined || readSimilarResult.length < 1) {
                            console.warn('NOT FOUND similar fileInfoKey in database', fileInfoKey, recordPath);
                            return Promise.resolve();
                        }

                        const linkId = readSimilarResult[0]['id'];
                        if (linkId === id) {
                            console.log('SAME ID similar fileInfoKey in database', fileInfoKey, recordPath);
                            return Promise.resolve();
                        }

                        console.log('DO import similar fileInfoKey in database', fileInfoKey, recordPath);
                        const insertSqlQuery: RawSqlQueryData = {
                            sql:
                                'INSERT INTO IMAGE_SIMILAR (I_ID, I_SIMILAR_ID, IS_MATCHING, IS_MATCHINGDETAILS, IS_MATCHINGSCORE)' +
                                '  VALUES (?, ?, ?, ?, ?)',
                            parameters: [
                                id,
                                linkId,
                                record.matching,
                                record.matchingDetails,
                                record.matchingScore
                            ]
                        };
                        return SqlUtils.executeRawSqlQueryData(me.knex, insertSqlQuery);
                    });
                    updatePromises.push(promise);
                });

                return Promise.all(updatePromises).then(() => {
                    return utils.resolve(true);
                }).catch(function errorSearch(reason) {
                    console.error('insertSimilarMatchings failed:', reason);
                    return utils.reject(reason);
                });
            })
        });
    }

    protected initKnex(): void {
        if (this.knex === undefined) {
            this.knex = this.createKnex(this.backendConfig);
        }
    }

    protected createKnex(backendConfig: BackendConfigType): any {
        // configure adapter
        const sqlConfig: SqlConnectionConfig = backendConfig.TourDocSqlMytbDbAdapter;
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

}
