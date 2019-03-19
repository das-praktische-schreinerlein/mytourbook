import {Router} from 'js-data-express';
import {TourDocDataService} from '../shared/tdoc-commons/services/tdoc-data.service';
import {LogUtils} from '@dps/mycms-commons/dist/commons/utils/log.utils';
import {
    ObjectDetectionRequest,
    ObjectDetectionRequestType,
    ObjectDetectionResponseType,
    ObjectDetectionState
} from '@dps/mycms-commons/dist/commons/model/objectdetection-model';
import * as knex from 'knex';
import * as RSMQWorker from 'rsmq-worker';
import {SelectQueryData, SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import * as Promise_serial from 'promise-serial';
import {utils} from 'js-data';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {MapperUtils} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';

interface RequestImageDataType {
    id: string;
    recordId: number;
    fileName: string;
    fileDir: string;
    filePath: string;
    detectors: [string];
}
export class ObjectDetectionManagerModule {
    private dataService: TourDocDataService;
    private backendConfig: {};
    private sqlQueryBuilder: SqlQueryBuilder;
    private mapperUtils: MapperUtils;
    private requestQueueName = 'mycms-objectdetector-request';
    private requestQueueWorker: RSMQWorker;
    private responseQueueName = 'mycms-objectdetector-response';
    private responseQueueWorker: RSMQWorker;
    private errorQueueName = 'mycms-objectdetector-error';
    private errorQueueWorker: RSMQWorker;
    private knex: knex;

    constructor(backendConfig, dataService: TourDocDataService) {
        this.dataService = dataService;
        this.backendConfig = backendConfig;
        this.sqlQueryBuilder = new SqlQueryBuilder();
        this.mapperUtils = new MapperUtils();
    }

    public configureModule(flgRequest: boolean, flgResponse: boolean, flgError: boolean) {
        const sqlConfig = this.backendConfig['TourDocSqlMediadbAdapter'];
        if (sqlConfig === undefined) {
            throw new Error('config for TourDocSqlMediadbAdapter not exists');
        }
        this.knex = knex({
            client: sqlConfig['client'],
            connection: sqlConfig['connection']
        });
        const queueConfig = BeanUtils.getValue(this.backendConfig, 'objectDetectionConfig.redisQueue');
        if (queueConfig === undefined) {
            throw new Error('config for objectDetectionConfig.redisQueue not exists');
        }

        const rsmqOptions = {host: queueConfig['host'], port: queueConfig['port'], ns: queueConfig['ns'],
            options: { password: queueConfig['pass'], db: queueConfig['db']}};
        if (flgRequest) {
            this.requestQueueName = queueConfig['requestQueue'];
            this.requestQueueWorker = new RSMQWorker(this.requestQueueName, rsmqOptions);
            this.requestQueueWorker.on('error', function (err, msg) {
                console.error('ERROR - while reading request', err, msg.id, msg);
            });
            this.requestQueueWorker.on('exceeded', function (msg) {
                console.warn('EXCEEDED - request', msg.id, msg);
            });
            this.requestQueueWorker.on('timeout', function (msg) {
                console.warn('TIMEOUT - request', msg.id, msg.rc, msg);
            });
        }

        if (flgResponse) {
            this.responseQueueName = queueConfig['responseQueue'];
            this.responseQueueWorker = new RSMQWorker(this.responseQueueName, rsmqOptions);
            this.responseQueueWorker.on('error', function (err, msg) {
                console.error('ERROR - while reading response', err, msg.id, msg);
            });
            this.responseQueueWorker.on('exceeded', function (msg) {
                console.warn('EXCEEDED - response', msg.id, msg);
            });
            this.responseQueueWorker.on('timeout', function (msg) {
                console.warn('TIMEOUT - response', msg.id, msg.rc, msg);
            });
        }

        if (flgError) {
            this.errorQueueName = queueConfig['errorQueue'];
            this.errorQueueWorker = new RSMQWorker(this.errorQueueName, rsmqOptions);
            this.errorQueueWorker.on('error', function (err, msg) {
                console.error('ERROR - while reading error', err, msg.id, msg);
            });
            this.errorQueueWorker.on('exceeded', function (msg) {
                console.warn('EXCEEDED - error', msg.id, msg);
            });
            this.errorQueueWorker.on('timeout', function (msg) {
                console.warn('TIMEOUT-  error', msg.id, msg.rc, msg);
            });
        }
    }

    public sendObjectDetectionRequestsToQueue(requestedDetectors: string, maxPerRun: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const basePath = this.backendConfig['apiRoutePicturesStaticDir'] + '/pics_full';
            const me = this;
            this.requestQueueWorker.start();

            let detectors = [];
            const availableDetectors: string[] = BeanUtils.getValue(this.backendConfig, 'objectDetectionConfig.availableDetectors');
            if (!availableDetectors || availableDetectors.length < 1) {
                return reject('no available detector configured in backendConfig');
            }

            if (requestedDetectors) {
                for (const detectorName of requestedDetectors.split(',')) {
                    if (availableDetectors.indexOf(detectorName) >= 0) {
                        detectors.push(detectorName);
                    } else {
                        return reject('unknown detector:' + detectorName);
                    }
                }

            }

            if (detectors.length < 1) {
                const defaultDetectors: string[] = BeanUtils.getValue(this.backendConfig, 'objectDetectionConfig.defaultDetectors');
                if (!defaultDetectors || defaultDetectors.length < 1) {
                    return reject('no default detectors configured in backendConfig');
                }

                detectors = defaultDetectors;
            }

            console.log('start detection with detector:' + detectors + ' maxPerRun:' + maxPerRun);
            return me.processObjectDetectionRequestForDetector(detectors, maxPerRun, basePath).then(value => {
                console.log('DONE - queued objectDetectionRequests');
                return resolve('DONE - queued objectDetectionRequests');
            }).catch(reason => {
                console.error('ERROR - cant queue objectDetectionRequests', reason);
                return reject(reason);
            });
        });
    }

    public receiveObjectDetectionsFromQueue(): Promise<any> {
        const me = this;
        return new Promise<any>((resolve, reject) => {
            this.responseQueueWorker.on('message', function (msg, next, id) {
                console.debug('RUNNING - processing message:', id, msg);

                let response: ObjectDetectionResponseType;
                try {
                    response = JSON.parse(msg);
                } catch (error) {
                    console.warn('ERROR - parsing message', msg, error);
                    return next(error);
                }

                if (response && response.results) {
                    const detectedObjects = response.results;
                    const imageId = response.request.refId;
                    // delete all image_object for image with this detector
                    for (let i = 0; i < detectedObjects.length; i++) {
                        // insert new image_object with image_object.i_id = detectedObj.id
                        console.debug('OK found: ' + LogUtils.sanitizeLogMsg(detectedObjects[i].fileName) +
                            ' detector:' + detectedObjects[i].detector +
                            ' class: ' + LogUtils.sanitizeLogMsg(detectedObjects[i].keySuggestion) +
                            ' score:' + detectedObjects[i].precision +
                            ' x/y/w/h:[', [detectedObjects[i].objX, detectedObjects[i].objY, detectedObjects[i].objWidth,
                            detectedObjects[i].objHeight].join(','), ']' +
                            ' dim:[', [detectedObjects[i].imgWidth, detectedObjects[i].imgHeight].join(','), ']');
                    }
                    return me.createObjectDetectionResultsInDatabase(response).then(value => {
                        me.responseQueueWorker.del(id, err => {
                            if (err) {
                                console.error('ERROR - while deleting response', err, msg);
                                return next(new Error(err));
                            }
                        });

                        return next();
                    }).catch(reason => {
                        return next(reason);
                    });
                } else {
                    console.warn('WARNING - got no result for: ', msg);
                }

                return next();
            });

            console.log('RUNNING - started response worker');
            this.responseQueueWorker.start();
        });
    }

    protected processObjectDetectionRequestForDetector(detectors: string[], maxPerRun: number, basePath: string): Promise<any> {
        const me = this;
        return this.readImageDataToDetect(detectors, maxPerRun).then(imageRequestDataList => {
            const detectionRequests: ObjectDetectionRequestType[] = [];
            for (const imageDataRequest of imageRequestDataList) {
                detectionRequests.push(me.mapImageDataToObjectDetectionRequest(imageDataRequest, basePath));
            }

            const detectionRequestPromises = [];
            for (const detectionRequest of detectionRequests) {
                detectionRequestPromises.push(function () {
                    return me.sendObjectDetectionRequestToQueue(detectionRequest).then(value => {
                        return me.createObjectDetectionRequestInDatabase(detectionRequest);
                    });
                });
            }

            return Promise_serial(detectionRequestPromises, {parallelize: 1}).then(arrayOfResults => {
                return utils.resolve('DONE - queued objectDetectionRequests');
            }).catch(reason => {
                return utils.reject(reason);
            });
        }).catch(reason => {
            return utils.reject(reason);
        });
    }

    protected readImageDataToDetect(detectors: string[], maxPerRun: number): Promise<RequestImageDataType[]> {
        const detectorFilterNames = detectors.map(detector => {
            return this.sqlQueryBuilder.sanitizeSqlFilterValue(detector);
        });
        const maxIdSqlQuery: SelectQueryData = {
            fields: ['io_detector', 'COALESCE(MAX(i_id), 0) as maxid'],
            from: 'image_object',
            where: ['io_detector in ("' + detectorFilterNames.join('", "') + '")'],
            sort: undefined,
            limit: undefined,
            offset: 0,
            tableConfig: undefined,
            groupByFields: ['io_detector'],
            having: undefined
        };
        const sqlBuilder = this.knex;
        const rawSelectMaxId = sqlBuilder.raw(this.sqlQueryBuilder.selectQueryTransformToSql(maxIdSqlQuery));
        const me = this;
        const result = new Promise<RequestImageDataType[]>((resolve, reject) => {
            return rawSelectMaxId.then(function doneDelete(maxIdResults: any) {
                const maxIds = {};
                for (const detector of detectorFilterNames) {
                    maxIds[detector] = {
                        'maxid': 0,
                        'io_detector': detector
                    };
                }
                for (const maxIdResult of maxIdResults[0]) {
                    maxIds[maxIdResult['io_detector']] = {
                        'maxid': maxIdResult['maxid'],
                        'io_detector': maxIdResult['io_detector']
                    };
                }

                const idSqlQueryPromises = [];
                for (const detector of Object.keys(maxIds)) {
                    const maxId = maxIds[detector];
                    const idSqlQuery: SelectQueryData = {
                        fields: ['CONCAT("IMAGE", "_", image.i_id) AS id',
                            'i_id',
                            'CONCAT(image.i_dir, "/", image.i_file) AS filePath',
                            'i_dir as fileDir',
                            'i_file as fileName',
                            '"' + me.sqlQueryBuilder.sanitizeSqlFilterValue(maxId['io_detector']) + '" as detector'],
                        from: 'image',
                        where: ['i_id > ' + maxId['maxid']],
                        sort: ['i_id ASC'],
                        limit: maxPerRun,
                        offset: 0,
                        tableConfig: undefined,
                        groupByFields: undefined,
                        having: undefined
                    };
                    const sql = me.sqlQueryBuilder.selectQueryTransformToSql(idSqlQuery);
                    idSqlQueryPromises.push(function () {
                        return sqlBuilder.raw(sql);
                    });
                }

                return Promise_serial(idSqlQueryPromises, {parallelize: 1}).then(arrayOfResults => {
                    const records = {};
                    for (let i = 0; i < arrayOfResults.length; i++) {
                        const dbResults = arrayOfResults[i];
                        for (const record of dbResults[0]) {
                            if (records[record['id']]) {
                                records[record['id']]['detectors'].push(record['detector']);
                            } else {
                                records[record['id']] = <RequestImageDataType>{
                                    id: record['id'],
                                    fileDir: record['fileDir'],
                                    fileName: record['fileName'],
                                    filePath: record['filePath'],
                                    detectors: [record['detector']]
                                };
                            }
                        }
                    }

                    const imageRequests: RequestImageDataType[] = [];
                    const ids = Object.keys(records).sort();
                    for (let i = 0; i < maxPerRun && i < ids.length; i++) {
                        imageRequests.push(records[ids[i]]);
                    }

                    return resolve(imageRequests);
                }).catch(reason => {
                    return reject(reason);
                });
            }).catch(function errorFunction(reason) {
                console.error('readImageIdsForDetection failed:', reason);
                return reject(reason);
            });
        });

        return result;

    }

    protected mapImageDataToObjectDetectionRequest(image: RequestImageDataType,
                                                   basePath: string): ObjectDetectionRequestType {
        return <ObjectDetectionRequest> {
            detectors: image.detectors,
            fileName: basePath + '/' + image.filePath,
            imgHeight: undefined,
            imgWidth: undefined,
            keySuggestions: undefined,
            objHeight: undefined,
            objWidth: undefined,
            objX: undefined,
            objY: undefined,
            precision: undefined,
            refId: image.id,
            state: ObjectDetectionState.OPEN
        };
    }

    protected sendObjectDetectionRequestToQueue(detectionRequest: ObjectDetectionRequestType): Promise<any> {
        const me = this;
        return new Promise<any>((rmsqResolve, rmsqReject) => {
            console.debug('RUNNING - send request to queue:', me.requestQueueName, detectionRequest);
            me.requestQueueWorker.send( JSON.stringify(detectionRequest), 0, function (err) {
                if (err) {
                    console.error('ERROR - cant send request to queue:', me.requestQueueName, detectionRequest);
                    detectionRequest = undefined;
                    return rmsqReject('ERROR - cant send request to queue:' + me.requestQueueName);
                }

                console.debug('DONE - send request to queue:', me.requestQueueName, detectionRequest);
                detectionRequest = undefined;
                return rmsqResolve('DONE - send request to queue:' + me.requestQueueName);
            });
        });
    }

    protected createObjectDetectionRequestInDatabase(detectionRequest: ObjectDetectionRequestType): Promise<any> {
        let id;
        let baseTableName;
        let joinTableName;
        let idFieldName;
        let stateFieldName;
        let detectorFieldName;
        let table = undefined;
        if (detectionRequest.refId.startsWith('IMAGE_')) {
            table = 'image';
            id = this.sqlQueryBuilder.sanitizeSqlFilterValue(detectionRequest.refId.replace('IMAGE_', ''));
        }

        switch (table) {
            case 'image':
                baseTableName = 'image';
                joinTableName = 'image_object';
                idFieldName = 'i_id';
                stateFieldName = 'io_state';
                detectorFieldName = 'io_detector';
                break;
            case 'video':
                baseTableName = 'video';
                joinTableName = 'video_object';
                idFieldName = 'v_id';
                stateFieldName = 'vo_state';
                detectorFieldName = 'vo_detector';
                break;
            default:
                return utils.reject('detectionReuest table not valid: ' + LogUtils.sanitizeLogMsg(detectionRequest.refId));
        }

        const detectorFilterValues = detectionRequest.detectors.map(detector => {
            return this.sqlQueryBuilder.sanitizeSqlFilterValue(detector);
        });
        const me = this;
        const deleteSql = 'DELETE FROM ' + joinTableName + ' ' +
            'WHERE ' + joinTableName + '.' + detectorFieldName + ' IN ("' + detectorFilterValues.join('", "') + '") ' +
            ' AND ' + idFieldName + ' = "' + id + '"';
        const sqlBuilder = this.knex;
        const rawDelete = sqlBuilder.raw(deleteSql);
        const detectionRequestPromises = [];
        for (const detector of detectorFilterValues) {
            const insertSql = 'INSERT INTO ' + joinTableName + ' (' + idFieldName + ', ' + stateFieldName + ', ' + detectorFieldName + ')' +
                ' VALUES ("' + id + '",' +
                ' "' + me.sqlQueryBuilder.sanitizeSqlFilterValue(detectionRequest.state) + '",' +
                ' "' + detector + '")';
            detectionRequestPromises.push(function () {
                return new Promise((resolve, reject) => {
                    return sqlBuilder.raw(insertSql).then(function doneInsert(dbresults: any) {
                        return sqlBuilder.raw(insertSql);
                    }).then(function doneInsert(dbresults: any) {
                        return resolve(true);
                    }).catch(function errorFunction(reason) {
                        console.error('detectionRequest delete/insert ' + joinTableName + ' failed:', reason);
                        return reject(reason);
                    });
                });
            });
        }

        return new Promise((resolve, reject) => {
            return rawDelete.then(function doneDelete(dbresults: any) {
                return Promise_serial(detectionRequestPromises, {parallelize: 1});
            }).then(arrayOfResults => {
                console.log('DONE - saved detectionRequest to database');
                return resolve('DONE - saved detectionRequest to database');
            }).catch(function errorFunction(reason) {
                console.error('detectionRequest delete/insert ' + joinTableName + ' failed:', reason);
                return reject(reason);
            });
        });
    }

    protected createObjectDetectionResultsInDatabase(detectionResponse: ObjectDetectionResponseType): Promise<any> {
        let id;
        let baseTableName;
        let joinTableName;
        let idFieldName;
        let stateFieldName;
        let detectorFieldName;
        let detailFieldNames = [];
        let table = undefined;
        if (detectionResponse.request.refId.startsWith('IMAGE_')) {
            table = 'image';
            id = this.sqlQueryBuilder.sanitizeSqlFilterValue(detectionResponse.request.refId.replace('IMAGE_', ''));
        }

        switch (table) {
            case 'image':
                baseTableName = 'image';
                joinTableName = 'image_object';
                idFieldName = 'i_id';
                stateFieldName = 'io_state';
                detectorFieldName = 'io_detector';
                detailFieldNames = ['io_obj_type', 'io_img_width', 'io_img_height',
                    'io_obj_x1', 'io_obj_y1', 'io_obj_width', 'io_obj_height',
                    'io_precision'];
                break;
            case 'video':
                baseTableName = 'video';
                joinTableName = 'video_object';
                idFieldName = 'v_id';
                stateFieldName = 'vo_state';
                detectorFieldName = 'vo_detector';
                detailFieldNames = ['vo_obj_type', 'vo_img_width', 'vo_img_height',
                    'vo_obj_x1', 'vo_obj_y1', 'vo_obj_width', 'vo_obj_height',
                    'vo_precision'];
                break;
            default:
                return utils.reject('detectionResponse table not valid: ' + LogUtils.sanitizeLogMsg(detectionResponse.request.refId));
        }

        const detectorFilterValues = detectionResponse.request.detectors.map(detector => {
            return this.sqlQueryBuilder.sanitizeSqlFilterValue(detector);
        });
        const noSuggestionDetectorNames = [].concat(detectorFilterValues);
        const me = this;
        const deleteSql = 'DELETE FROM ' + joinTableName + ' ' +
            'WHERE ' + joinTableName + '.' + detectorFieldName + ' IN ("' + detectorFilterValues.join('", "') + '") ' +
            ' AND ' + idFieldName + ' = "' + id + '"';
        const insertObjectSql = 'INSERT INTO objects (o_name, o_picasa_key, o_key)' +
            ' SELECT "Default", "Default", "Default" FROM dual ' +
            '  WHERE NOT EXISTS (SELECT 1 FROM objects WHERE o_name="Default" AND o_key="Default")';

        const detectionResultPromises = [];
        if (detectionResponse.results && detectionResponse.results.length > 0) {
            for (const detectionResult of detectionResponse.results) {
                const detector = me.sqlQueryBuilder.sanitizeSqlFilterValue(detectionResult.detector);
                if (noSuggestionDetectorNames.indexOf(detector) > 0) {
                    noSuggestionDetectorNames.splice(noSuggestionDetectorNames.indexOf(detector), 1);
                }

                detectionResultPromises.push(function () {
                    const keySuggestion = me.sqlQueryBuilder.sanitizeSqlFilterValue(
                        detectionResult.keySuggestion.split(',')[0]
                            .trim()
                            .replace(/[^a-zA-Z0-9]/g, '_'));
                    const detailValues = [keySuggestion, detectionResult.imgWidth, detectionResult.imgHeight,
                        detectionResult.objX, detectionResult.objY, detectionResult.objWidth, detectionResult.objHeight,
                        detectionResult.precision]
                        .map(value => {
                            return me.sqlQueryBuilder.sanitizeSqlFilterValue(value);
                        });

                    const insertObjectKeySql = 'INSERT INTO objects_key(ok_detector, ok_key, o_id) ' +
                        '   SELECT "' + detector + '",' +
                        '          "' + keySuggestion + '",' +
                        '          (select MAX(o_id) as newId FROM objects WHERE o_name="Default") as o_id from dual ' +
                        '   WHERE NOT EXISTS (' +
                        '      SELECT 1 FROM objects_key WHERE ok_detector="' + detector + '" ' +
                        '                                      AND ok_key="' + keySuggestion + '")';
                    const insertImageObject = 'INSERT INTO ' + joinTableName + ' (' +
                        idFieldName + ', ' + stateFieldName + ', ' + detectorFieldName + ', ' + detailFieldNames.join(', ') + ')' +
                        ' VALUES ("' + id + '",' +
                        ' "' + me.sqlQueryBuilder.sanitizeSqlFilterValue(detectionResult.state) + '",' +
                        ' "' + detector + '", "' + detailValues.join('", "') + '")';

                    const sqlBuilder = me.knex;
                    return new Promise((resolve, reject) => {
                        return sqlBuilder.raw(insertObjectKeySql).then(function doneInsert(dbresults: any) {
                            return sqlBuilder.raw(insertImageObject);
                        }).then(function doneInsert(dbresults: any) {
                            return resolve(true);
                        }).catch(function errorFunction(reason) {
                            console.error('detectionRequest delete/insert ' + joinTableName + ' failed:', reason);
                            return reject(reason);
                        });
                    });
                });
            }
        }

        for (const detector of noSuggestionDetectorNames) {
            detectionResultPromises.push(function () {
                const sqlBuilder = me.knex;
                const deleteDummySql = 'DELETE FROM ' + joinTableName + ' ' +
                    'WHERE ' + joinTableName + '.' + detectorFieldName + ' IN ("' + detectorFilterValues.join('", "') + '") ' +
                    ' AND ' + stateFieldName + ' = "' + ObjectDetectionState.RUNNING_NO_SUGGESTION + '"';
                return sqlBuilder.raw(deleteDummySql);
            });
            detectionResultPromises.push(function () {
                const sqlBuilder = me.knex;
                const insertImageObject = 'INSERT INTO ' + joinTableName + ' (' +
                    idFieldName + ', ' + stateFieldName + ', ' + detectorFieldName + ')' +
                    ' VALUES ("' + id + '",' +
                    ' "' + ObjectDetectionState.RUNNING_NO_SUGGESTION + '",' +
                    ' "' + detector + '")';
                return sqlBuilder.raw(insertImageObject);
            });
        }

        const sqlBuilder = me.knex;
        const rawDelete = sqlBuilder.raw(deleteSql);
        return new Promise((resolve, reject) => {
            return rawDelete.then(function doneDelete(dbresults: any) {
                return Promise_serial(detectionResultPromises, {parallelize: 1});
            }).then(arrayOfResults => {
                console.log('DONE - saved response to database');
                return resolve('DONE - saved response to database');
            }).catch(function errorFunction(reason) {
                console.error('ERROR - cant save response to database', reason, detectionResponse);
                return reject(reason);
            });
        });
    }
}
