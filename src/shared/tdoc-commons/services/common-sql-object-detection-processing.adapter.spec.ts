/* tslint:disable:no-unused-variable */
import 'rxjs/add/observable/fromPromise';
import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {TestHelper} from './test-helper.spec';
import {ObjectDetectionModelConfigType} from './common-sql-object-detection.model';
import {CommonSqlObjectDetectionProcessingAdapter} from './common-sql-object-detection-processing.adapter';
import {
    ObjectDetectionRequestType,
    ObjectDetectionResponseCode,
    ObjectDetectionResponseType,
    ObjectDetectionState
} from '@dps/mycms-commons/dist/commons/model/objectdetection-model';
import {ObjectDetectionDetectedObjectType} from '@dps/mycms-commons/src/commons/model/objectdetection-model';

describe('CommonSqlObjectDetectionProcessingAdapter', () => {
    const modelConfigType: ObjectDetectionModelConfigType = {
        objectTable: {
            fieldCategory: 'o_category',
            fieldId: 'o_id',
            fieldKey: 'o_key',
            fieldName: 'o_name',
            fieldPicasaKey: 'o_picasa_key',
            table: 'objects'
        },
        objectKeyTable: {
            fieldDetector: 'ok_detector',
            fieldId: 'o_id',
            fieldKey: 'ok_key',
            table: 'objects_key'
        },
        detectionTables: {
            'image': {
                entityType: 'image',
                table: 'image',
                id: undefined,
                baseTable: 'image',
                baseFieldId: 'i_id',
                baseFieldFileDir: 'i_dir',
                baseFieldFileName: 'i_file',
                baseFieldFilePath: 'CONCAT(i_dir, "/", i_file)',
                detectedTable: 'image_object',
                detectedFieldDetector: 'io_detector',
                detectedFieldPrecision: 'io_precision',
                detectedFieldState: 'io_state',
                detectedFieldKey: 'io_obj_type',
                detailFieldNames: ['io_obj_type', 'io_img_width', 'io_img_height',
                    'io_obj_x1', 'io_obj_y1', 'io_obj_width', 'io_obj_height',
                    'io_precision']
            }
        },
        detectedObjectsTables: {
            'odimgobject': {
                fieldDetector: 'io_detector',
                fieldId: 'io_id',
                fieldPrecision: 'io_precision',
                fieldState: 'io_state',
                table: 'image_object',
                fieldKey: 'io_obj_type'
            }
        }
    };

    const sqlQueryBuilder: SqlQueryBuilder = new SqlQueryBuilder();
    const localTestHelper = {
        createService: function (knex) {
            const config = {
                knexOpts: {
                    client: knex.client.config.client
                }
            };

            return new CommonSqlObjectDetectionProcessingAdapter(config, knex, sqlQueryBuilder, modelConfigType);
        }
    };


    describe('test executeActionTagObjects defaults', () => {
        const knex = TestHelper.createKnex('mysql', []);
        const service: CommonSqlObjectDetectionProcessingAdapter = localTestHelper.createService(knex);

        it('should created', done => {
            // WHEN/THEN
            expect(service).toBeTruthy();
            done();
        });

    });

    describe('#getObjectDetectionConfiguration()', () => {
        const knex = TestHelper.createKnex('mysql', []);
        const service: CommonSqlObjectDetectionProcessingAdapter = localTestHelper.createService(knex);

        it('get correct configuration for request', done => {
            // WHEN/THEN
            const config = service.getObjectDetectionConfiguration(<ObjectDetectionRequestType>{ refId: 'IMAGE_12345'});
            expect(config.table).toEqual('image');
            expect(config.id).toEqual('12345');
            done();
        });

        it('get no configuration for incorrect request', done => {
            // WHEN/THEN
            const config = service.getObjectDetectionConfiguration(<ObjectDetectionRequestType>{ refId: 'BLA_12345'});
            expect(config).toBeUndefined();
            done();
        });
    });

    describe('#readMaxIdAlreadyDetectedPerDetector()', () => {
        const knex = TestHelper.createKnex('mysql', []);
        const service: CommonSqlObjectDetectionProcessingAdapter = localTestHelper.createService(knex);

        it('readMaxIdAlreadyDetectedPerDetector success for request', done => {
            // WHEN/THEN
            TestHelper.doTestSuccessWithSqlsTest(knex,
                function () {
                    return service.readMaxIdAlreadyDetectedPerDetector('image', ['detector1', 'detector2']);
                },
                [{detector: 'detector1', maxId: 10}],
                [
                    'select io_detector as detector, COALESCE(MAX(i_id), 0) as maxId from image_object'
                    + ' where io_detector in ("detector1", "detector2")  group by io_detector  '
                ],
                [
                    undefined
                ],
                done,
                [
                    [[{detector: 'detector1', maxId: 10}]]
                ]);
        });

        it('readMaxIdAlreadyDetectedPerDetector failed for request', done => {
            // WHEN/THEN
            TestHelper.doTestFailWithSqlsTest(knex,
                function () {
                    return service.readMaxIdAlreadyDetectedPerDetector('UnknownEntity', ['detector1', 'detector2']);
                },
                'unknown entityType: UnknownEntity',
                [],
                [],
                done,
                []);
        });
    });

    describe('#readRequestImageDataType()', () => {
        const knex = TestHelper.createKnex('mysql', []);
        const service: CommonSqlObjectDetectionProcessingAdapter = localTestHelper.createService(knex);

        it('readRequestImageDataType success for request', done => {
            // WHEN/THEN
            TestHelper.doTestSuccessWithSqlsTest(knex,
                function () {
                    return service.readRequestImageDataType('image', 'detector1', 10, 10);
                },
                [],
                [
                    'select CONCAT("IMAGE", "_", i_id) AS id, i_id, CONCAT(i_dir, "/", i_file) AS filePath, i_dir as fileDir,'
                    + ' i_file as fileName, "detector1" as detector from image'
                    + ' where i_id > 10'
                    + ' OR i_id IN (SELECT i_id        FROM image_object WHERE io_state in ("RETRY"))   order by i_id ASC limit 0, 10'
                ],
                [
                    undefined
                ],
                done,
                [
                    [[]]
                ]);
        });

        it('readRequestImageDataType failed for request', done => {
            // WHEN/THEN
            TestHelper.doTestFailWithSqlsTest(knex,
                function () {
                    return service.readRequestImageDataType('UnknownEntity', 'detector1', 10, 10);
                },
                'unknown entityType: UnknownEntity',
                [],
                [],
                done,
                []);
        });
    });

    describe('#deleteOldDetectionRequests()', () => {
        const knex = TestHelper.createKnex('mysql', []);
        const service: CommonSqlObjectDetectionProcessingAdapter = localTestHelper.createService(knex);

        it('deleteOldDetectionRequests success for request onlyNotSucceeded=true', done => {
            // WHEN/THEN
            TestHelper.doTestSuccessWithSqlsTest(knex,
                function () {
                    return service.deleteOldDetectionRequests(
                        <ObjectDetectionRequestType>{refId: 'IMAGE_12345', detectors: ['detector1', 'detector2']}, true);
                },
                [[]],
                [
                    'DELETE FROM image_object WHERE image_object.io_detector IN (?, ?)  AND i_id = ? AND io_state IN (?, ?, ?, ?)'
                ],
                [
                    ['detector1', 'detector2', '12345', 'ERROR', 'OPEN', 'RETRY', 'UNKNOWN']
                ],
                done,
                [
                    [[]]
                ]);
        });

        it('deleteOldDetectionRequests success for request onlyNotSucceeded=false ', done => {
            // WHEN/THEN
            TestHelper.doTestSuccessWithSqlsTest(knex,
                function () {
                    return service.deleteOldDetectionRequests(
                        <ObjectDetectionRequestType>{refId: 'IMAGE_12345', detectors: ['detector1', 'detector2']}, false);
                },
                [[]],
                [
                    'DELETE FROM image_object WHERE image_object.io_detector IN (?, ?)  AND i_id = ?'
                ],
                [
                    ['detector1', 'detector2', '12345']
                ],
                done,
                [
                    [[]]
                ]);
        });

        it('deleteOldDetectionRequests failed for request', done => {
            // WHEN/THEN
            TestHelper.doTestFailWithSqlsTest(knex,
                function () {
                    return service.deleteOldDetectionRequests(
                        <ObjectDetectionRequestType>{refId: 'DUMMY_12345', detectors: ['detector1', 'detector2']}, false);
                },
                'detectionRequest table not valid: DUMMY_12345',
                [],
                [],
                done,
                []);
        });
    });

    describe('#createDetectionRequest()', () => {
        const knex = TestHelper.createKnex('mysql', []);
        const service: CommonSqlObjectDetectionProcessingAdapter = localTestHelper.createService(knex);

        it('createDetectionRequest success for request', done => {
            // WHEN/THEN
            TestHelper.doTestSuccessWithSqlsTest(knex,
                function () {
                    return service.createDetectionRequest(
                        <ObjectDetectionRequestType>{
                            refId: 'IMAGE_12345', detectors: ['detector1', 'detector2'],
                            state: ObjectDetectionState.UNKNOWN
                        },
                        'detector1');
                },
                true,
                [
                    'INSERT INTO image_object (i_id, io_state, io_detector) VALUES (?, ?, ?)'
                ],
                [
                    ['12345', 'UNKNOWN', 'detector1']
                ],
                done,
                [
                    [[]]
                ]);
        });

        it('createDetectionRequest failed for request', done => {
            // WHEN/THEN
            TestHelper.doTestFailWithSqlsTest(knex,
                function () {
                    return service.createDetectionRequest(
                        <ObjectDetectionRequestType>{refId: 'DUMMY_12345', detectors: ['detector1', 'detector2']}, 'detector1');
                },
                'detectionRequest table not valid: DUMMY_12345',
                [],
                [],
                done,
                []);
        });
    });

    describe('#createDetectionError()', () => {
        const knex = TestHelper.createKnex('mysql', []);
        const service: CommonSqlObjectDetectionProcessingAdapter = localTestHelper.createService(knex);

        it('createDetectionError success for request with NONRECOVERABLE_ERROR', done => {
            // WHEN/THEN
            TestHelper.doTestSuccessWithSqlsTest(knex,
                function () {
                    return service.createDetectionError(
                        <ObjectDetectionResponseType> {
                            request: <ObjectDetectionRequestType>{refId: 'IMAGE_12345', detectors: ['detector1', 'detector2']},
                            responseCode: ObjectDetectionResponseCode.NONRECOVERABLE_ERROR,
                            responseMessages: ['bla', 'blum'],
                            results: [
                                <ObjectDetectionDetectedObjectType>{detector: 'detector1', state: ObjectDetectionState.ERROR}
                            ]
                        }
                        , 'detector1');
                },
                true,
                [
                    'INSERT INTO image_object (i_id, io_state, io_detector) VALUES (?, ?, ?)'
                ],
                [
                    ['12345', 'ERROR', 'detector1']
                ],
                done,
                [
                    [[]]
                ]);
        });

        it('createDetectionError success for request with ordinary error', done => {
            // WHEN/THEN
            TestHelper.doTestSuccessWithSqlsTest(knex,
                function () {
                    return service.createDetectionError(
                        <ObjectDetectionResponseType> {
                            request: <ObjectDetectionRequestType>{refId: 'IMAGE_12345', detectors: ['detector1', 'detector2']},
                            responseCode: ObjectDetectionResponseCode.RECOVERABLE_ERROR,
                            responseMessages: ['bla', 'blum'],
                            results: [
                                <ObjectDetectionDetectedObjectType>{detector: 'detector1', state: ObjectDetectionState.ERROR}
                            ]
                        }
                        , 'detector1');
                },
                true,
                [
                    'INSERT INTO image_object (i_id, io_state, io_detector) VALUES (?, ?, ?)'
                ],
                [
                    ['12345', 'RETRY', 'detector1']
                ],
                done,
                [
                    [[]]
                ]);
        });

        it('createDetectionError failed for request', done => {
            // WHEN/THEN
            TestHelper.doTestFailWithSqlsTest(knex,
                function () {
                    return service.createDetectionError(
                        <ObjectDetectionResponseType> {
                            request: <ObjectDetectionRequestType>{refId: 'DUMMY_12345', detectors: ['detector1', 'detector2']},
                            responseCode: ObjectDetectionResponseCode.RECOVERABLE_ERROR,
                            responseMessages: ['bla', 'blum'],
                            results: [
                                <ObjectDetectionDetectedObjectType>{detector: 'detector1', state: ObjectDetectionState.ERROR}
                            ]
                        }
                        , 'detector1');
                },
                'detectionError table not valid: DUMMY_12345',
                [],
                [],
                done,
                []);
        });
    });

    describe('#createDefaultObject()', () => {
        const knex = TestHelper.createKnex('mysql', []);
        const service: CommonSqlObjectDetectionProcessingAdapter = localTestHelper.createService(knex);

        it('createDefaultObject success', done => {
            // WHEN/THEN
            TestHelper.doTestSuccessWithSqlsTest(knex,
                function () {
                    return service.createDefaultObject();
                },
                true,
                [
                    'INSERT INTO objects (o_name,o_picasa_key,o_key,o_category)'
                    + ' SELECT ?, ?, ?, ? FROM dual'
                    + '   WHERE NOT EXISTS (SELECT 1 FROM objects        WHERE o_key=?)'
                ],
                [
                    ['Default', 'Default', 'Default', 'Default', 'Default']
                ],
                done,
                [
                    [[]]
                ]);
        });
    });

    describe('#processDetectionWithResult()', () => {
        const knex = TestHelper.createKnex('mysql', []);
        const service: CommonSqlObjectDetectionProcessingAdapter = localTestHelper.createService(knex);

        it('processDetectionWithResult success for result', done => {
            // WHEN/THEN
            TestHelper.doTestSuccessWithSqlsTest(knex,
                function () {
                    return service.processDetectionWithResult(
                        'detector1',
                        {
                            key: 'keyBlam',
                            keySuggestion: 'keySuggestionBlam',
                            keyCorrection: 'keyCorrectionBlam',
                            imgWidth: 100,
                            imgHeight: 200,
                            objX: 1,
                            objY: 2,
                            objWidth: 10,
                            objHeight: 10,
                            precision: 0.6,
                            detector: 'detector1',
                            state: ObjectDetectionState.DONE_CORRECTION_PROCESSED,
                            fileName: 'fileNameBlib'
                        },
                        modelConfigType.detectionTables['image']);
                },
                true,
                [
                    'INSERT INTO objects_key   (ok_detector,ok_key,o_id)'
                    + '    SELECT ?,          ?,          (SELECT MAX(o_id) AS newId            FROM objects'
                    + '           WHERE o_key=?                  OR o_key=?)   AS newId FROM dual'
                    + '    WHERE NOT EXISTS (      SELECT 1 FROM objects_key      WHERE ok_detector=?       AND ok_key=?)',
                    'INSERT INTO image_object (i_id, io_state, io_detector, io_obj_type, io_img_width, io_img_height, io_obj_x1,'
                    + ' io_obj_y1, io_obj_width, io_obj_height, io_precision) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
                ],
                [
                    ['detector1', 'keySuggestionBlam', 'Default', 'keySuggestionBlam', 'detector1', 'keySuggestionBlam'],
                    [undefined, 'DONE_CORRECTION_PROCESSED', 'detector1', 'keySuggestionBlam', '100', '200', '1', '2', '10', '10', '0.6']
                ],
                done,
                [
                    [[]]
                ]);
        });
    });

    describe('#processDetectionWithoutResult()', () => {
        const knex = TestHelper.createKnex('mysql', []);
        const service: CommonSqlObjectDetectionProcessingAdapter = localTestHelper.createService(knex);

        it('processDetectionWithoutResult success for rresult', done => {
            // WHEN/THEN
            TestHelper.doTestSuccessWithSqlsTest(knex,
                function () {
                    return service.processDetectionWithoutResult('detector1', modelConfigType.detectionTables['image']);
                },
                undefined,
                [
                    'DELETE FROM image_object WHERE image_object.io_detector IN (?)  AND io_state = ?',
                    'INSERT INTO image_object (i_id, io_state, io_detector) VALUES (?, ?, ?)'
                ],
                [
                    ['detector1', 'RUNNING_NO_SUGGESTION'],
                    [undefined, 'RUNNING_NO_SUGGESTION', 'detector1']
                ],
                done,
                [
                    [[]]
                ]);
        });
    });
});
