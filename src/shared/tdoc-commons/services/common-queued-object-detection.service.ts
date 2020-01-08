import {LogUtils} from '@dps/mycms-commons/dist/commons/utils/log.utils';
import {
    ObjectDetectionRequest,
    ObjectDetectionRequestType,
    ObjectDetectionResponseType,
    ObjectDetectionState
} from '@dps/mycms-commons/dist/commons/model/objectdetection-model';
import * as RSMQWorker from 'rsmq-worker';
import * as Promise_serial from 'promise-serial';
import {utils} from 'js-data';
import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {ObjectDetectionDataStore, ObjectDetectionMaxIdPerDetectorType, RequestImageDataType} from './common-object-detection-datastore';

export interface RedisQueueConfig {
    host: string;
    port: number;
    pass: string;
    db: string;
    ns: string;
    requestQueue: string;
    responseQueue: string;
    errorQueue: string;
}

export interface ObjectDetectionManagerBackendConfig {
    objectDetectionConfig: {
        redisQueue: RedisQueueConfig;
        availableDetectors: string[];
        defaultDetectors: string[];
    };
}

export abstract class CommonQueuedObjectDetectionService {
    protected sqlQueryBuilder: SqlQueryBuilder;
    protected requestQueueName: string;
    protected requestQueueWorker: RSMQWorker;
    protected responseQueueName: string;
    protected responseQueueWorker: RSMQWorker;
    protected errorQueueName: string;
    protected errorQueueWorker: RSMQWorker;
    protected dataStore: ObjectDetectionDataStore;

    public constructor(dataStore: ObjectDetectionDataStore) {
        this.sqlQueryBuilder = new SqlQueryBuilder();
        this.dataStore = dataStore;
    }

    public configureModule(flgRequest: boolean, flgResponse: boolean, flgError: boolean) {
        const queueConfig: RedisQueueConfig = this.getRedisQueueConfiguration();
        if (queueConfig === undefined) {
            throw new Error('config for objectDetectionConfig.redisQueue not exists');
        }

        const rsmqOptions = {
            host: queueConfig.host, port: queueConfig.port, db: queueConfig.db, ns: queueConfig.ns, redisPrefix: queueConfig.ns,
            options: {password: queueConfig.pass,
                host: queueConfig.host, port: queueConfig.port, db: queueConfig.db, ns: queueConfig.ns, redisPrefix: queueConfig.ns}
        };
        if (flgRequest) {
            this.requestQueueName = queueConfig.requestQueue;
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
            this.responseQueueName = queueConfig.responseQueue;
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
            this.errorQueueName = queueConfig.errorQueue;
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

    public sendObjectDetectionRequestsToQueue(entityType: string, requestedDetectors: string, maxPerRun: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const basePath = this.getBasePathForImages();
            const me = this;
            this.requestQueueWorker.start();

            let detectors = [];
            const availableDetectors: string[] = this.getConfiguredAvailableDetectors();
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
                const defaultDetectors: string[] = this.getConfiguredDefaultDetectors();
                if (!defaultDetectors || defaultDetectors.length < 1) {
                    return reject('no default detectors configured in backendConfig');
                }

                detectors = defaultDetectors;
            }

            console.log('start detection for ' + LogUtils.sanitizeLogMsg(entityType)
                + ' with detector:' + detectors + ' maxPerRun:' + maxPerRun);
            return me.processObjectDetectionRequestForDetector(entityType, detectors, maxPerRun, basePath).then(() => {
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
        return new Promise<any>(() => {
            this.responseQueueWorker.on('message', function (msg, next, id) {
                console.debug('RUNNING - processing response message:', id, msg);

                let response: ObjectDetectionResponseType;
                try {
                    response = JSON.parse(msg);
                } catch (error) {
                    console.warn('ERROR - parsing message', msg, error);
                    return next(error);
                }

                if (response && response.results) {
                    const detectedObjects = response.results;
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
                    return me.createObjectDetectionResultsInDatastore(response).then(() => {
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
                    return next(new Error('WARNING - got no result for: ' + id));
                }
            });

            this.errorQueueWorker.on('message', function (msg, next, id) {
                console.debug('RUNNING - processing error message:', id, msg);

                let response: ObjectDetectionResponseType;
                try {
                    response = JSON.parse(msg);
                } catch (error) {
                    console.warn('ERROR - parsing error message', msg, error);
                    return next(error);
                }

                if (response && response.request) {
                    return me.createObjectDetectionErrorInDatastore(response).then(() => {
                        me.errorQueueWorker.del(id, err => {
                            if (err) {
                                console.error('ERROR - while deleting error', err, msg);
                                return next(new Error(err));
                            }
                        });

                        return next();
                    }).catch(reason => {
                        return next(reason);
                    });
                } else {
                    console.warn('WARNING - got no error for: ', msg);
                    return next(new Error('WARNING - got no error for: ' + id));
                }
            });

            console.log('RUNNING - started response worker');
            this.responseQueueWorker.start();
            this.errorQueueWorker.start();
        });
    }

    protected abstract getRedisQueueConfiguration(): RedisQueueConfig;

    protected abstract getBasePathForImages(): string;

    protected abstract getConfiguredAvailableDetectors(): string[];

    protected abstract getConfiguredDefaultDetectors(): string[];

    protected processObjectDetectionRequestForDetector(entityType: string, detectors: string[], maxPerRun: number,
                                                       basePath: string): Promise<any> {
        const me = this;
        return this.readImageDataToDetect(entityType, detectors, maxPerRun).then(imageRequestDataList => {
            const detectionRequests: ObjectDetectionRequestType[] = [];
            for (const imageDataRequest of imageRequestDataList) {
                detectionRequests.push(me.mapImageDataToObjectDetectionRequest(imageDataRequest, basePath));
            }

            const detectionRequestPromises = [];
            for (const detectionRequest of detectionRequests) {
                detectionRequestPromises.push(function () {
                    return me.sendObjectDetectionRequestToQueue(detectionRequest).then(() => {
                        return me.createObjectDetectionRequestInDatastore(detectionRequest);
                    });
                });
            }

            return Promise_serial(detectionRequestPromises, {parallelize: 1}).then(() => {
                return utils.resolve('DONE - queued objectDetectionRequests');
            }).catch(reason => {
                return utils.reject(reason);
            });
        }).catch(reason => {
            return utils.reject(reason);
        });
    }

    protected sendObjectDetectionRequestToQueue(detectionRequest: ObjectDetectionRequestType): Promise<any> {
        const me = this;
        return new Promise<any>((rmsqResolve, rmsqReject) => {
            console.debug('RUNNING - send request to queue:', me.requestQueueName, detectionRequest);
            me.requestQueueWorker.send(JSON.stringify(detectionRequest), 0, function (err) {
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

    protected readImageDataToDetect(entityType: string, detectors: string[], maxPerRun: number): Promise<RequestImageDataType[]> {
        const detectorFilterNames = detectors.map(detector => {
            return this.sqlQueryBuilder.sanitizeSqlFilterValue(detector);
        });
        const me = this;
        const result = new Promise<RequestImageDataType[]>((resolve, reject) => {
            return me.dataStore.readMaxIdAlreadyDetectedPerDetector(entityType, detectorFilterNames).then(maxIdResults => {
                const maxIds = {};
                for (const detector of detectorFilterNames) {
                    maxIds[detector] = <ObjectDetectionMaxIdPerDetectorType>{
                        maxId: 0,
                        detector: detector
                    };
                }
                for (const maxIdResult of maxIdResults) {
                    maxIds[maxIdResult['detector']] = <ObjectDetectionMaxIdPerDetectorType>{
                        maxId: maxIdResult.maxId,
                        detector: maxIdResult.detector
                    };
                }
                const idSqlQueryPromises = [];
                for (const detector of Object.keys(maxIds)) {
                    const maxId = (<ObjectDetectionMaxIdPerDetectorType>maxIds[detector]).maxId;
                    idSqlQueryPromises.push(function () {
                        return me.dataStore.readRequestImageDataType(entityType, detector, maxId, maxPerRun);
                    });
                }
                return Promise_serial(idSqlQueryPromises, {parallelize: 1}).then(arrayOfResults => {
                    const records = {};
                    for (let i = 0; i < arrayOfResults.length; i++) {
                        const dbResults = arrayOfResults[i];
                        for (const record of dbResults) {
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

    protected mapImageDataToObjectDetectionRequest(imageData: RequestImageDataType,
                                                   basePath: string): ObjectDetectionRequestType {
        return <ObjectDetectionRequest>{
            detectors: imageData.detectors,
            fileName: basePath + '/' + imageData.filePath,
            imgHeight: undefined,
            imgWidth: undefined,
            keySuggestions: undefined,
            objHeight: undefined,
            objWidth: undefined,
            objX: undefined,
            objY: undefined,
            precision: undefined,
            refId: imageData.id,
            state: ObjectDetectionState.OPEN
        };
    }

    protected createObjectDetectionErrorInDatastore(detectionResponse: ObjectDetectionResponseType): Promise<any> {
        const tableConfig = this.dataStore.getObjectDetectionConfiguration(detectionResponse.request);
        if (!tableConfig) {
            return utils.reject('detectionError table not valid: ' + LogUtils.sanitizeLogMsg(detectionResponse.request.refId));
        }

        const me = this;
        const detectionErrorPromises = [];
        const detectorFilterValues = detectionResponse.request.detectors.map(detector => {
            return this.sqlQueryBuilder.sanitizeSqlFilterValue(detector);
        });
        for (const detector of detectorFilterValues) {
            detectionErrorPromises.push(function () {
                return me.dataStore.createDetectionError(detectionResponse, detector);
            });
        }

        return new Promise((resolve, reject) => {
            return this.dataStore.deleteOldDetectionRequests(detectionResponse.request, true).then(() => {
                return Promise_serial(detectionErrorPromises, {parallelize: 1});
            }).then(() => {
                console.log('DONE - saved detectionError to database');
                return resolve('DONE - saved detectionError to database');
            }).catch(function errorFunction(reason) {
                console.error('detectionError delete/insert ' + tableConfig.entityType + ' failed:', reason);
                return reject(reason);
            });
        });
    }

    protected createObjectDetectionRequestInDatastore(detectionRequest: ObjectDetectionRequestType): Promise<any> {
        const tableConfig = this.dataStore.getObjectDetectionConfiguration(detectionRequest);
        if (!tableConfig) {
            return utils.reject('detectionRequest table not valid: ' + LogUtils.sanitizeLogMsg(detectionRequest.refId));
        }

        const me = this;
        const detectionRequestPromises = [];
        const detectorFilterValues = detectionRequest.detectors.map(detector => {
            return this.sqlQueryBuilder.sanitizeSqlFilterValue(detector);
        });
        for (const detector of detectorFilterValues) {
            detectionRequestPromises.push(function () {
                return me.dataStore.createDetectionRequest(detectionRequest, detector);
            });
        }

        return new Promise((resolve, reject) => {
            return this.dataStore.deleteOldDetectionRequests(detectionRequest, false).then(() => {
                return Promise_serial(detectionRequestPromises, {parallelize: 1});
            }).then(() => {
                console.log('DONE - saved detectionRequest to database');
                return resolve('DONE - saved detectionRequest to database');
            }).catch(function errorFunction(reason) {
                console.error('detectionRequest delete/insert ' + tableConfig.entityType + ' failed:', reason);
                return reject(reason);
            });
        });
    }

    protected createObjectDetectionResultsInDatastore(detectionResponse: ObjectDetectionResponseType): Promise<any> {
        const tableConfig = this.dataStore.getObjectDetectionConfiguration(detectionResponse.request);
        if (!tableConfig) {
            return utils.reject('detectionResponse table not valid: ' + LogUtils.sanitizeLogMsg(detectionResponse.request.refId));
        }

        const detectorFilterValues = detectionResponse.request.detectors.map(detector => {
            return this.sqlQueryBuilder.sanitizeSqlFilterValue(detector);
        });
        const noSuggestionDetectorNames = [].concat(detectorFilterValues);
        const me = this;
        const detectionResultPromises = [];
        if (detectionResponse.results && detectionResponse.results.length > 0) {
            for (const detectionResult of detectionResponse.results) {
                const detector = me.sqlQueryBuilder.sanitizeSqlFilterValue(detectionResult.detector);
                if (noSuggestionDetectorNames.indexOf(detector) > 0) {
                    noSuggestionDetectorNames.splice(noSuggestionDetectorNames.indexOf(detector), 1);
                }
                detectionResultPromises.push(function () {
                    return me.dataStore.processDetectionWithResult(detector, detectionResult, tableConfig);
                });
            }
        }
        for (const detector of noSuggestionDetectorNames) {
            detectionResultPromises.push(function () {
                return me.dataStore.processDetectionWithoutResult(detector, tableConfig);
            });
        }

        return new Promise((resolve, reject) => {
            return me.dataStore.createDefaultObject().then(() => {
                return me.dataStore.deleteOldDetectionRequests(detectionResponse.request, false);
            }).then(() => {
                return Promise_serial(detectionResultPromises, {parallelize: 1});
            }).then(() => {
                console.log('DONE - saved response to database');
                return resolve('DONE - saved response to database');
            }).catch(function errorFunction(reason) {
                console.error('ERROR - cant save response to database', reason, detectionResponse);
                return reject(reason);
            });
        });
    }
}
