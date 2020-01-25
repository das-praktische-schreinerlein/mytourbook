/* tslint:disable:no-unused-variable */
import 'rxjs/add/observable/fromPromise';
import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {TestHelper} from './test-helper.spec';
import {CommonSqlObjectDetectionAdapter} from './common-sql-object-detection.adapter';
import {ObjectDetectionModelConfigType} from './common-sql-object-detection.model';
import {CommonSqlActionTagObjectDetectionAdapter} from './common-sql-actiontag-object-detection.adapter';
import {TestActionFormHelper} from './test-actionform-helper.spec';

describe('CommonSqlActionTagObjectDetectionAdapter', () => {
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

            return new CommonSqlActionTagObjectDetectionAdapter(
                new CommonSqlObjectDetectionAdapter(config, knex, sqlQueryBuilder, modelConfigType));
        }
    };


    describe('test executeActionTagObjects defaults', () => {
        const knex = TestHelper.createKnex('mysql', []);
        const service: CommonSqlActionTagObjectDetectionAdapter = localTestHelper.createService(knex);

        it('should created', done => {
            // WHEN/THEN
            expect(service).toBeTruthy();
            done();
        });

        it('executeActionTagObjects should error on no payload', done => {
            TestActionFormHelper.doActionTagTestInvalidPayloadTest(knex, service, 'executeActionTagObjects', 'objects' , done);
        });

        it('executeActionTagObjects should error on invalid id', done => {
            TestActionFormHelper.doActionTagTestInvalidIdTest(knex, service, 'executeActionTagObjects', 'objects', done);
        });

        it('executeActionTagObjects should error on unknown table', done => {
            TestActionFormHelper.doActionTagFailInvalidTableTest(knex, service, 'executeActionTagObjects', 'objects',
                {
                    detector: 'bla',
                    objectkey: 'bla',
                    precision: 1,
                    set: true
                }, 'unknown table: unknowntable', done);
        });


        it('executeActionTagObjects should reject objectkey', done => {
            const id: any = 5;
            return TestActionFormHelper.doActionTagFailTest(knex, service, 'executeActionTagObjects', 'image', id, {
                payload: {
                    detector: 'bla',
                    objectkey: 'bla"',
                    precision: 1,
                    set: true
                },
                deletes: false,
                key: 'objects',
                recordId: id,
                type: 'tag'
            }, 'actiontag objects objectkey not valid', done);
        });

        it('executeActionTagObjects should reject precision', done => {
            const id: any = 5;
            return TestActionFormHelper.doActionTagFailTest(knex, service, 'executeActionTagObjects', 'image', id, {
                payload: {
                    detector: 'bla',
                    objectkey: 'bla',
                    precision: 'a',
                    set: true
                },
                deletes: false,
                key: 'objects',
                recordId: id,
                type: 'tag'
            }, 'actiontag objects precision not valid', done);
        });
    });

    describe('#executeActionTagObjects()', () => {
        const knex = TestHelper.createKnex('mysql', []);
        const service: CommonSqlActionTagObjectDetectionAdapter = localTestHelper.createService(knex);

        it('executeActionTagObjects should set objects', done => {
            const id: any = 5;
            TestActionFormHelper.doActionTagTestSuccessTest(knex, service, 'executeActionTagObjects', 'image', id, {
                    payload: {
                        detector: 'detectorBla',
                        objectkey: 'objectkeyBlum,objectkeyBlimm',
                        precision: 1,
                        set: true
                    },
                    deletes: false,
                    key: 'objects',
                    recordId: id,
                    type: 'tag'
                },
                true,
                [
                    'DELETE FROM image_object  WHERE image_object.io_obj_type IN ('
                    + '    SELECT o_key    FROM objects    WHERE o_name IN (?, ?)) AND i_id = ?',
                    'INSERT INTO image_object (io_obj_type, i_id, io_precision, io_detector, io_state)'
                    + ' SELECT objects.o_key AS io_obj_type, ? AS i_id, ? AS io_precision, ? AS io_detector, ? AS io_state'
                    + ' FROM objects WHERE o_name = (?, ?)'
                ],
                [
                    ['objectkeyBlum', 'objectkeyBlimm', 5],
                    [5, 1, 'detectorBla', 'DONE_APPROVAL_PROCESSED', 'objectkeyBlum', 'objectkeyBlimm']
                ],
                done,
                []);
        });

    });

    describe('test executeActionTagObjectsState defaults', () => {
        const knex = TestHelper.createKnex('mysql', []);
        const service: CommonSqlActionTagObjectDetectionAdapter = localTestHelper.createService(knex);

        it('should created', done => {
            // WHEN/THEN
            expect(service).toBeTruthy();
            done();
        });

        it('executeActionTagObjectsState should error on no payload', done => {
            TestActionFormHelper.doActionTagTestInvalidPayloadTest(knex, service, 'executeActionTagObjectsState', 'objectsState' , done);
        });

        it('executeActionTagObjectsState should error on invalid id', done => {
            TestActionFormHelper.doActionTagTestInvalidIdTest(knex, service, 'executeActionTagObjectsState', 'objectsState', done);
        });

        it('executeActionTagObjectsState should error on unknown table', done => {
            TestActionFormHelper.doActionTagFailInvalidTableTest(knex, service, 'executeActionTagObjectsState', 'objectsState',
                {
                    state: 'blaState'
                }, 'unknown table: unknowntable', done);
        });


        it('executeActionTagObjectsState should reject state', done => {
            const id: any = 5;
            return TestActionFormHelper.doActionTagFailTest(knex, service, 'executeActionTagObjectsState', 'image', id, {
                payload: {
                    state: '"'
                },
                deletes: false,
                key: 'objectsState',
                recordId: id,
                type: 'tag'
            }, 'actiontag objectsState state not valid', done);
        });
    });

    describe('#executeActionTagObjectsState()', () => {
        const knex = TestHelper.createKnex('mysql', []);
        const service: CommonSqlActionTagObjectDetectionAdapter = localTestHelper.createService(knex);

        it('executeActionTagObjectsState should set state', done => {
            const id: any = 5;
            TestActionFormHelper.doActionTagTestSuccessTest(knex, service, 'executeActionTagObjectsState', 'image', id, {
                    payload: {
                        state: 'stateBla'
                    },
                    deletes: false,
                    key: 'objectsState',
                    recordId: id,
                    type: 'tag'
                },
                true,
                [
                    'UPDATE image_object SET io_state=?  WHERE i_id = ?'
                ],
                [
                    ['stateBla', 5]
                ],
                done,
                []);
        });
    });

    describe('test executeActionTagObjectsKey defaults', () => {
        const knex = TestHelper.createKnex('mysql', []);
        const service: CommonSqlActionTagObjectDetectionAdapter = localTestHelper.createService(knex);

        it('should created', done => {
            // WHEN/THEN
            expect(service).toBeTruthy();
            done();
        });

        it('executeActionTagObjectsKey should error on no payload', done => {
            TestActionFormHelper.doActionTagTestInvalidPayloadTest(knex, service, 'executeActionTagObjectsKey', 'objectsKey' , done);
        });

        it('executeActionTagObjectsKey should error on invalid id', done => {
            TestActionFormHelper.doActionTagTestInvalidIdTest(knex, service, 'executeActionTagObjectsKey', 'objectsKey', done);
        });

        it('executeActionTagObjectsKey should error on unknown table', done => {
            TestActionFormHelper.doActionTagFailInvalidTableTest(knex, service, 'executeActionTagObjectsState', 'objectsKey',
                {
                    objectname: 'objectNameBlim',
                    objectcategory: 'objectcategoryBluuuum',
                    state: 'stateBlom',
                    action: 'set',
                    objectkey: 'objectkeyBlim',
                    detector: 'detectorBlum'
                }, 'unknown table: unknowntable', done);
        });


        it('executeActionTagObjectsKey should reject detector', done => {
            const id: any = 5;
            return TestActionFormHelper.doActionTagFailTest(knex, service, 'executeActionTagObjectsKey', 'image', id, {
                payload: {
                    objectname: '"objectNameBlim',
                    objectcategory: '"objectcategoryBluuuum',
                    state: '"stateBlm',
                    action: '"set',
                    objectkey: '"objectkeyBlim',
                    detector: '"detectorBlum'
                },
                deletes: false,
                key: 'objectsKey',
                recordId: id,
                type: 'tag'
            }, 'actiontag objectsKey detector not valid', done);
        });

        it('executeActionTagObjectsKey should reject state', done => {
            const id: any = 5;
            return TestActionFormHelper.doActionTagFailTest(knex, service, 'executeActionTagObjectsKey', 'image', id, {
                payload: {
                    objectname: 'objectNameBlim',
                    objectcategory: 'objectcategoryBluuuum',
                    state: 'stateBl"m',
                    action: 'changeObjectKeyForRecord',
                    objectkey: 'objectkeyBlim',
                    detector: 'detectorBlum'
                },
                deletes: false,
                key: 'objectsKey',
                recordId: id,
                type: 'tag'
            }, 'actiontag objectsKey state not valid', done);
        });
    });

    describe('#executeActionTagObjectsKey()', () => {
        const knex = TestHelper.createKnex('mysql', []);
        const service: CommonSqlActionTagObjectDetectionAdapter = localTestHelper.createService(knex);

        it('executeActionTagObjectsKey should changeObjectKeyForRecord', done => {
            const id: any = 5;
            TestActionFormHelper.doActionTagTestSuccessTest(knex, service, 'executeActionTagObjectsKey', 'odimgobject', id, {
                    payload: {
                        objectname: 'objectNameBlim',
                        objectcategory: 'objectcategoryBluuuum',
                        state: 'RUNNING_MANUAL_CORRECTED',
                        action: 'changeObjectKeyForRecord',
                        objectkey: 'objectkeyBlim',
                        detector: 'detectorBlum'
                    },
                    deletes: false,
                    key: 'objectsKey',
                    recordId: id,
                    type: 'tag'
                },
                true,
                [
                    'UPDATE image_object  SET io_obj_type=?, io_state=?  WHERE io_id = ?'
                ],
                [
                    ['objectkeyBlim', 'RUNNING_MANUAL_CORRECTED', 5]
                ],
                done,
                []);
        });

        it('executeActionTagObjectsKey should changeObjectLabelForObjectKey', done => {
            const id: any = 5;
            TestActionFormHelper.doActionTagTestSuccessTest(knex, service, 'executeActionTagObjectsKey', 'odimgobject', id, {
                    payload: {
                        objectname: 'objectNameBlim',
                        objectcategory: 'objectcategoryBluuuum',
                        state: 'RUNNING_MANUAL_CORRECTED',
                        action: 'changeObjectLabelForObjectKey',
                        objectkey: 'objectkeyBlim',
                        detector: 'detectorBlum'
                    },
                    deletes: false,
                    key: 'objectsKey',
                    recordId: id,
                    type: 'tag'
                },
                true,
                [
                    'UPDATE image_object  SET io_obj_type=?, io_state=?  WHERE io_id = ?',
                    'DELETE FROM objects_key WHERE ok_detector=?  AND ok_key=?',
                    'INSERT INTO objects_key   (ok_detector, ok_key, o_id)'
                    + '    SELECT ?,          ?,'
                    + '          (SELECT MAX(o_id) AS newId           FROM objects'
                    + '           WHERE o_name=?) AS newId FROM dual'
                    + '    WHERE NOT EXISTS ('
                    + '      SELECT 1 FROM objects_key      WHERE ok_detector=?       AND ok_key=?)'
                ],
                [
                    ['objectkeyBlim', 'RUNNING_MANUAL_CORRECTED', 5],
                    ['detectorBlum', 'objectkeyBlim'],
                    ['detectorBlum', 'objectkeyBlim', 'objectNameBlim', 'detectorBlum', 'objectkeyBlim'],
                ],
                done,
                []);
        });

        it('executeActionTagObjectsKey should createNewObjectKeyAndObjectLabel', done => {
            const id: any = 5;
            TestActionFormHelper.doActionTagTestSuccessTest(knex, service, 'executeActionTagObjectsKey', 'odimgobject', id, {
                    payload: {
                        objectname: 'objectNameBlim',
                        objectcategory: 'objectcategoryBluuuum',
                        state: 'RUNNING_MANUAL_CORRECTED',
                        action: 'createNewObjectKeyAndObjectLabel',
                        objectkey: 'objectkeyBlim',
                        detector: 'detectorBlum'
                    },
                    deletes: false,
                    key: 'objectsKey',
                    recordId: id,
                    type: 'tag'
                },
                true,
                [
                    'UPDATE image_object  SET io_obj_type=?, io_state=?  WHERE io_id = ?',
                    'INSERT INTO objects (o_name, o_picasa_key, o_key, o_category)'
                    + ' SELECT ?, ?, ?, ? FROM dual'
                    + '   WHERE NOT EXISTS (SELECT 1 FROM objects                    WHERE o_name=?)',
                    'DELETE FROM objects_key WHERE ok_detector=?  AND ok_key=?',
                    'INSERT INTO objects_key   (ok_detector, ok_key, o_id)'
                    + '    SELECT ?,          ?,'
                    + '          (SELECT MAX(o_id) AS newId           FROM objects           WHERE o_name=?)'
                    + ' AS newId FROM dual'
                    + '    WHERE NOT EXISTS ('
                    + '      SELECT 1 FROM objects_key      WHERE ok_detector=?       AND ok_key=?)'
                ],
                [
                    ['objectkeyBlim', 'RUNNING_MANUAL_CORRECTED', 5],
                    ['objectNameBlim', 'objectkeyBlim', 'objectkeyBlim', 'objectcategoryBluuuum', 'objectNameBlim'],
                    ['detectorBlum', 'objectkeyBlim'],
                    ['detectorBlum', 'objectkeyBlim', 'objectNameBlim', 'detectorBlum', 'objectkeyBlim']
                ],
                done,
                []);
        });

        it('executeActionTagObjectsKey should createObjectLabelForObjectKey', done => {
            const id: any = 5;
            TestActionFormHelper.doActionTagTestSuccessTest(knex, service, 'executeActionTagObjectsKey', 'odimgobject', id, {
                    payload: {
                        objectname: 'objectNameBlim',
                        objectcategory: 'objectcategoryBluuuum',
                        state: 'RUNNING_MANUAL_CORRECTED',
                        action: 'createObjectLabelForObjectKey',
                        objectkey: 'objectkeyBlim',
                        detector: 'detectorBlum'
                    },
                    deletes: false,
                    key: 'objectsKey',
                    recordId: id,
                    type: 'tag'
                },
                true,
                [
                    'UPDATE image_object  SET io_obj_type=?, io_state=?  WHERE io_id = ?',
                    'INSERT INTO objects (o_name, o_picasa_key, o_key, o_category)'
                    + ' SELECT ?, ?, ?, ? FROM dual'
                    + '   WHERE NOT EXISTS (SELECT 1 FROM objects                    WHERE o_name=?)',
                    'DELETE FROM objects_key WHERE ok_detector=?  AND ok_key=?',
                    'INSERT INTO objects_key   (ok_detector, ok_key, o_id)'
                    + '    SELECT ?,          ?,'
                    + '          (SELECT MAX(o_id) AS newId           FROM objects'
                    + '           WHERE o_name=?) AS newId FROM dual'
                    + '    WHERE NOT EXISTS ('
                    + '      SELECT 1 FROM objects_key      WHERE ok_detector=?       AND ok_key=?)'
                ],
                [
                    ['objectkeyBlim', 'RUNNING_MANUAL_CORRECTED', 5],
                    ['objectNameBlim', 'objectkeyBlim', 'objectkeyBlim', 'objectcategoryBluuuum', 'objectNameBlim'],
                    ['detectorBlum', 'objectkeyBlim'],
                    ['detectorBlum', 'objectkeyBlim', 'objectNameBlim', 'detectorBlum', 'objectkeyBlim']
                ],
                done,
                []);
        });
    });
});
