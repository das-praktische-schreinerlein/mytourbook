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

interface RequestImageDataType {
    id: string;
    recordId: number;
    fileName: string;
    fileDir: string;
    filePath: string;
}
export class ObjectDetectionManagerModule {
    private dataService: TourDocDataService;
    private backendConfig: {};
    private sqlQueryBuilder: SqlQueryBuilder;
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

        const rsmqOptions = {host: '127.0.0.1', port: 6379, ns: 'rsmq'};
        if (flgRequest) {
            this.requestQueueName = 'mycms-objectdetector-request';
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
            this.responseQueueName = 'mycms-objectdetector-response';
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
            this.errorQueueName = 'mycms-objectdetector-error';
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

    public sendObjectDetectionRequestsToQueue(detector: string, maxPerRun: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const basePath = this.backendConfig['apiRoutePicturesStaticDir'] + '/pics_full';
            const me = this;
            this.requestQueueWorker.start();

            return this.readImageDataToDetect(detector, maxPerRun).then(imageRequestDataList => {
                const detectionRequests: ObjectDetectionRequestType[] = [];
                for (const imageDataRequest of imageRequestDataList) {
                    detectionRequests.push(me.mapImageDataToObjectDetectionRequest(detector, imageDataRequest, basePath));
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
                    console.log('DONE - queued objectDetectionRequests');
                    return resolve('DONE - queued objectDetectionRequests');
                }).catch(reason => {
                    console.error('ERROR - cant queue objectDetectionRequests', reason);
                    return reject(reason);
                });
            }).catch(reason => {
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

    protected readImageDataToDetect(detector: string, maxPerRun: number): Promise<RequestImageDataType[]> {
        const maxIdSqlQuery: SelectQueryData = {
            fields: ['COALESCE(MAX(i_id), 0) as maxid'],
            from: 'image_object',
            where: ['io_detector="' + detector + '"'],
            sort: undefined,
            limit: maxPerRun,
            offset: 0,
            tableConfig: undefined,
            groupByFields: undefined,
            having: undefined
        };
        const sqlBuilder = this.knex;
        const rawSelectMaxId = sqlBuilder.raw(this.sqlQueryBuilder.selectQueryTransformToSql(maxIdSqlQuery));
        const me = this;
        const result = new Promise<RequestImageDataType[]>((resolve, reject) => {
            rawSelectMaxId.then(function doneDelete(maxIdResult: any) {
                const idSqlQuery: SelectQueryData = {
                    fields: ['CONCAT("IMAGE", "_", image.i_id) AS id',
                        'i_id',
                        'CONCAT(image.i_dir, "/", image.i_file) AS filePath',
                        'i_dir as fileDir',
                        'i_file as fileName'],
                    from: 'image',
                    where: ['i_id > ' + maxIdResult[0][0]['maxid']],
                    sort: ['i_id ASC'],
                    limit: maxPerRun,
                    offset: 0,
                    tableConfig: undefined,
                    groupByFields: undefined,
                    having: undefined
                };
                return sqlBuilder.raw(me.sqlQueryBuilder.selectQueryTransformToSql(idSqlQuery));
            }).then(function doneInsert(dbResults: any) {
                const ids: RequestImageDataType[] = [];
                for (const record of dbResults[0]) {
                    ids.push(record);
                }
                return resolve(ids);
            }).catch(function errorPlaylist(reason) {
                console.error('readImageIdsForDetection failed:', reason);
                return reject(reason);
            });
        });

        return result;

    }

    protected mapImageDataToObjectDetectionRequest(detector: string, image: RequestImageDataType,
                                                   basePath: string): ObjectDetectionRequestType {
        return <ObjectDetectionRequest> {
            detectors: [detector],
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
                    return rmsqReject('ERROR - cant send request to queue:' + me.requestQueueName);
                }

                console.debug('DONE - send request to queue:', me.requestQueueName, detectionRequest);
                return rmsqResolve('DONE - send request to queue:' + me.requestQueueName);
            });
        });
    }

    protected createObjectDetectionRequestInDatabase(detectionRequest: ObjectDetectionRequestType): Promise<any> {
        let id;
        let baseTableName;
        let joinTableName;
        let idName;
        let stateName;
        let detectorName;
        let table = undefined;
        if (detectionRequest.refId.startsWith('IMAGE_')) {
            table = 'image';
            id = detectionRequest.refId.replace('IMAGE_', '');
        }

        switch (table) {
            case 'image':
                baseTableName = 'image';
                joinTableName = 'image_object';
                idName = 'i_id';
                stateName = 'io_state';
                detectorName = 'io_detector';
                break;
            case 'video':
                baseTableName = 'video';
                joinTableName = 'video_object';
                idName = 'v_id';
                stateName = 'vo_state';
                detectorName = 'vo_detector';
                break;
            default:
                return utils.reject('detectionRequest ' + detectionRequest + ' table not valid');
        }

        const me = this;
        const deleteSql = 'DELETE FROM ' + joinTableName + ' ' +
            'WHERE ' + joinTableName + '.' + detectorName + ' IN ("' + detectionRequest.detectors.join('", "') + '") ' +
            ' AND ' + idName + ' = "' + id + '"';
        const insertSql = 'INSERT INTO ' + joinTableName + ' (' + idName + ', ' + stateName + ', ' + detectorName + ')' +
            ' VALUES ("' + id + '",' +
            ' "' + detectionRequest.state + '",' +
            ' "' + detectionRequest.detectors[0] + '")';
        const sqlBuilder = this.knex;
        const rawDelete = sqlBuilder.raw(deleteSql);
        return new Promise((resolve, reject) => {
            return rawDelete.then(function doneDelete(dbresults: any) {
                return sqlBuilder.raw(insertSql);
            }).then(function doneInsert(dbresults: any) {
                return resolve(true);
            }).catch(function errorPlaylist(reason) {
                console.error('detectionRequest delete/insert ' + joinTableName + ' failed:', reason);
                return reject(reason);
            });
        });
    }

    protected createObjectDetectionResultsInDatabase(detectionResponse: ObjectDetectionResponseType): Promise<any> {
        let id;
        let baseTableName;
        let joinTableName;
        let idName;
        let stateName;
        let detectorName;
        let detailFields = [];
        let table = undefined;
        if (detectionResponse.request.refId.startsWith('IMAGE_')) {
            table = 'image';
            id = detectionResponse.request.refId.replace('IMAGE_', '');
        }

        switch (table) {
            case 'image':
                baseTableName = 'image';
                joinTableName = 'image_object';
                idName = 'i_id';
                stateName = 'io_state';
                detectorName = 'io_detector';
                detailFields = ['io_obj_type', 'io_img_width', 'io_img_height',
                            'io_obj_x1', 'io_obj_y1', 'io_obj_width', 'io_obj_height',
                            'io_precision'];
                break;
            case 'video':
                baseTableName = 'video';
                joinTableName = 'video_object';
                idName = 'v_id';
                stateName = 'vo_state';
                detectorName = 'vo_detector';
                detailFields = ['vo_obj_type', 'vo_img_width', 'vo_img_height',
                    'vo_obj_x1', 'vo_obj_y1', 'vo_obj_width', 'vo_obj_height',
                    'vo_precision'];
                break;
            default:
                return utils.reject('detectionResponse ' + detectionResponse + ' table not valid');
        }

        const me = this;
        const deleteSql = 'DELETE FROM ' + joinTableName + ' ' +
            'WHERE ' + joinTableName + '.' + detectorName + ' IN ("' + detectionResponse.request.detectors.join('", "') + '") ' +
            ' AND ' + idName + ' = "' + id + '"';
        const insertObjectSql = 'INSERT INTO objects (o_name, o_picasa_key, o_key)' +
            ' SELECT "Default", "Default", "Default" FROM dual ' +
            '  WHERE NOT EXISTS (SELECT 1 FROM objects WHERE o_name="Default" AND o_key="Default")';

        const detectionResultPromises = [];
        for (const detectionResult of detectionResponse.results) {
            detectionResultPromises.push(function () {
                const detailValues = [detectionResult.keySuggestion, detectionResult.imgWidth, detectionResult.imgHeight,
                    detectionResult.objWidth, detectionResult.objHeight, detectionResult.objWidth, detectionResult.objHeight,
                    detectionResult.precision];

                const insertObjectKeySql = 'INSERT INTO objects_key(ok_detector, ok_key, o_id) ' +
                '   SELECT "' + detectionResult.detector + '",' +
                '          "' + detectionResult.keySuggestion + '",' +
                '          (select MAX(o_id) as newId FROM objects WHERE o_name="Default") as o_id from dual ' +
                '   WHERE NOT EXISTS (' +
                '      SELECT 1 FROM objects_key WHERE ok_detector="' + detectionResult.detector + '" ' +
                '                                      AND ok_key="' + detectionResult.keySuggestion + '")';
                const insertImageObject = 'INSERT INTO ' + joinTableName + ' (' +
                    idName + ', ' + stateName + ', ' + detectorName + ', ' + detailFields.join(', ') + ')' +
                    ' VALUES ("' + id + '",' +
                    ' "' + detectionResult.state + '",' +
                    ' "' + detectionResult.detector + '", "' + detailValues.join('", "') + '")';
                const sqlBuilder = me.knex;
                return new Promise((resolve, reject) => {
                    return sqlBuilder.raw(insertObjectKeySql).then(function doneInsert(dbresults: any) {
                        return sqlBuilder.raw(insertImageObject);
                    }).then(function doneInsert(dbresults: any) {
                            return resolve(true);
                    }).catch(function errorPlaylist(reason) {
                        console.error('detectionRequest delete/insert ' + joinTableName + ' failed:', reason);
                        return reject(reason);
                    });
                });
            });
        }

        const sqlBuilder = me.knex;
        const rawDelete = sqlBuilder.raw(deleteSql);
        return new Promise((resolve, reject) => {
            return rawDelete.then(function doneDelete(dbresults: any) {
                return insertObjectSql;
            }).then(function doneInsert(dbresults: any) {
                return Promise_serial(detectionResultPromises, {parallelize: 1}).then(arrayOfResults => {
                    console.log('DONE - saved response to database');
                    return resolve('DONE - saved response to database');
                });
            }).catch(function errorPlaylist(reason) {
                console.error('ERROR - cant save response to database', reason, detectionResponse);
                return reject(reason);
            });
        });
    }
}
