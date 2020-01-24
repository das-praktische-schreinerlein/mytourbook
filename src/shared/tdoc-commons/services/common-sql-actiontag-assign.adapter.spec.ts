/* tslint:disable:no-unused-variable */
import 'rxjs/add/observable/fromPromise';
import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {TestHelper} from './test-helper.spec';
import {ActionTagAssignConfigType, CommonSqlActionTagAssignAdapter} from './common-sql-actiontag-assign.adapter';
import {TestActionFormHelper} from './test-actionform-helper.spec';

describe('CommonSqlActionTagAssignAdapter', () => {
    const sqlQueryBuilder: SqlQueryBuilder = new SqlQueryBuilder();
    const modelConfigType: ActionTagAssignConfigType = {
        tables: {
            'image': {
                table: 'image',
                idField: 'i_id',
                references: {
                    'track_id_is': {
                        table: 'kategorie', idField: 'k_id', referenceField: 'k_id'
                    },
                    'loc_lochirarchie_txt': {
                        table: 'location', idField: 'l_id', referenceField: 'l_id'
                    }
                }
            }
        }
    };
    const localTestHelper = {
        createService: function (knex) {
            const config = {
                knexOpts: {
                    client: knex.client.config.client
                }
            };

            return new CommonSqlActionTagAssignAdapter(config, knex, sqlQueryBuilder, modelConfigType);
        }
    };


    describe('test defaults', () => {
        const knex = TestHelper.createKnex('mysql', []);
        const service: CommonSqlActionTagAssignAdapter = localTestHelper.createService(knex);

        it('should created', done => {
            // WHEN/THEN
            expect(service).toBeTruthy();
            done();
        });

        it('executeActionTagAssign should error on no payload', done => {
            TestActionFormHelper.doActionTagTestInvalidPayloadTest(knex, service, 'executeActionTagAssign', 'assign' , done);
        });

        it('executeActionTagAssign should error on unknown table', done => {
            TestActionFormHelper.doActionTagFailInvalidTableTest(knex, service, 'executeActionTagAssign', 'assign',
                {
                    newId: '10',
                    newIdSetNull: false,
                    referenceField: 'track_id_is'
                }, undefined, done);
        });

        it('executeActionTagAssign should error on invalid id', done => {
            TestActionFormHelper.doActionTagTestInvalidIdTest(knex, service, 'executeActionTagAssign', 'assign', done);
        });

        it('executeActionTagAssign should reject: invalid newId', done => {
            const id: any = 5;
            const newId: any = 'a*';
            return TestActionFormHelper.doActionTagFailTest(knex, service, 'executeActionTagAssign', 'image', id, {
                payload: {
                    newId: newId,
                    newIdSetNull: false,
                    referenceField: 'track_id_is'
                },
                deletes: false,
                key: 'assign',
                recordId: id,
                type: 'tag'
            }, 'actiontag assign newId not valid', done);
        });

        it('executeActionTagAssign should reject: newId must be null if newIdSetNull', done => {
            const id: any = 5;
            const newId: any = '10';
            return TestActionFormHelper.doActionTagFailTest(knex, service, 'executeActionTagAssign', 'image', id, {
                payload: {
                    newId: newId,
                    newIdSetNull: true,
                    referenceField: 'track_id_is'
                },
                deletes: false,
                key: 'assign',
                recordId: id,
                type: 'tag'
            }, 'actiontag assign newId must be null if newIdSetNull', done);
        });

        it('executeActionTagAssign should reject: newId must integer', done => {
            const id: any = 5;
            const newId: any = 'a';
            return TestActionFormHelper.doActionTagFailTest(knex, service, 'executeActionTagAssign', 'image', id, {
                payload: {
                    newId: newId,
                    newIdSetNull: false,
                    referenceField: 'track_id_is'
                },
                deletes: false,
                key: 'assign',
                recordId: id,
                type: 'tag'
            }, 'actiontag assign newId must be integer', done);
        });

        it('executeActionTagAssign should reject: invalid referenceField', done => {
            const id: any = 5;
            const newId: any = '10';
            return TestActionFormHelper.doActionTagFailTest(knex, service, 'executeActionTagAssign', 'image', id, {
                payload: {
                    newId: newId,
                    newIdSetNull: false,
                    referenceField: '*unknownReferenceField'
                },
                deletes: false,
                key: 'assign',
                recordId: id,
                type: 'tag'
            }, 'actiontag assign referenceField not valid', done);
        });

        it('executeActionTagAssign should reject: unknown referenceField', done => {
            const id: any = 5;
            const newId: any = '10';
            return TestActionFormHelper.doActionTagFailTest(knex, service, 'executeActionTagAssign', 'image', id, {
                payload: {
                    newId: newId,
                    newIdSetNull: false,
                    referenceField: 'unknownReferenceField'
                },
                deletes: false,
                key: 'assign',
                recordId: id,
                type: 'tag'
            }, 'actiontag assign referenceField not exists', done);
        });

    });

    describe('#executeActionTagAssign()', () => {
        const knex = TestHelper.createKnex('mysql', []);
        const service: CommonSqlActionTagAssignAdapter = localTestHelper.createService(knex);

        it('executeActionTagAssign should set newId', done => {
            const id: any = 5;
            const newId: any = '10';
            TestActionFormHelper.doActionTagTestSuccessTest(knex, service, 'executeActionTagAssign', 'image', id, {
                    payload: {
                        newId: newId,
                        newIdSetNull: false,
                        referenceField: 'track_id_is'
                    },
                    deletes: false,
                    key: 'assign',
                    recordId: id,
                    type: 'tag'
                }, true,
                [
                    'SELECT i_id AS id FROM image WHERE i_id=?',
                    'SELECT k_id AS id FROM kategorie WHERE k_id=?',
                    'UPDATE image SET k_id=? WHERE i_id=?'
                ],
                [
                    [5],
                    [10],
                    [10, 5]],
                done, [
                    [[{id: 5}]],
                    [[{id: 10}]]
                ]);
        });

        it('executeActionTagAssign should set newId null', done => {
            const id: any = 5;
            const newId: any = null;
            TestActionFormHelper.doActionTagTestSuccessTest(knex, service, 'executeActionTagAssign', 'image', id, {
                    payload: {
                        newId: newId,
                        newIdSetNull: true,
                        referenceField: 'track_id_is'
                    },
                    deletes: false,
                    key: 'assign',
                    recordId: id,
                    type: 'tag'
                }, true,
                [
                    'SELECT i_id AS id FROM image WHERE i_id=?',
                    'SELECT null AS id',
                    'UPDATE image SET k_id=null WHERE i_id=?'
                ],
                [
                    [5],
                    [],
                    [5]],
                done, [
                    [[{id: 5}]],
                    [[{id: null}]]
                ]);
        });

        it('executeActionTagAssign should reject: id not exists', done => {
            const id: any = 5;
            const newId: any = '10';
            TestActionFormHelper.doActionTagTestFailWithSqlsTest(knex, service, 'executeActionTagAssign', 'image', id, {
                    payload: {
                        newId: newId,
                        newIdSetNull: false,
                        referenceField: 'track_id_is'
                    },
                    deletes: false,
                    key: 'assign',
                    recordId: id,
                    type: 'tag'
                }, '_doActionTag assign image failed: id not found ' + id,
                [
                    'SELECT i_id AS id FROM image WHERE i_id=?'
                ],
                [
                    [5]],
                done, [
                    [[]]
                ]);
        });

        it('executeActionTagAssign should reject: newId not exists', done => {
            const id: any = 5;
            const newId: any = '10';
            TestActionFormHelper.doActionTagTestFailWithSqlsTest(knex, service, 'executeActionTagAssign', 'image', id, {
                    payload: {
                        newId: newId,
                        newIdSetNull: false,
                        referenceField: 'track_id_is'
                    },
                    deletes: false,
                    key: 'assign',
                    recordId: id,
                    type: 'tag'
                }, '_doActionTag assign image failed: newId not found ' + newId,
                [
                    'SELECT i_id AS id FROM image WHERE i_id=?',
                    'SELECT k_id AS id FROM kategorie WHERE k_id=?'
                ],
                [
                    [5],
                    [10]],
                done, [
                    [[{id: 5}]],
                    [[]]
                ]);
        });

    });
});
