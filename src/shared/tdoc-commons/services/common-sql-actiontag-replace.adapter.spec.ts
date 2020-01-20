/* tslint:disable:no-unused-variable */
import 'rxjs/add/observable/fromPromise';
import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {TestHelperSpec} from './test-helper.spec';
import {ActionTagReplaceConfigType, CommonSqlActionTagReplaceAdapter} from './common-sql-actiontag-replace.adapter';

describe('CommonDocSqlActionTagReplaceAdapter', () => {
    const sqlQueryBuilder: SqlQueryBuilder = new SqlQueryBuilder();
    const modelConfigType: ActionTagReplaceConfigType = {
        tables: {
            'image': {
                table: 'image',
                fieldId: 'i_id',
                referenced: [],
                joins: [
                    {table: 'image_object', fieldReference: 'i_id'},
                    {table: 'image_playlist', fieldReference: 'i_id'},
                    {table: 'image_keyword', fieldReference: 'i_id'}
                ]
            }
        }
    };
    const localTestHelper = {
        createService: function (knex) {
            const config = {
                knexOpts: {
                    client: knex.client.config.client
                }};
            return new CommonSqlActionTagReplaceAdapter(config, knex, sqlQueryBuilder, modelConfigType);
        },
    };


    describe('test defaults', () => {
        const knex = TestHelperSpec.createKnex('mysql', []);
        const service: CommonSqlActionTagReplaceAdapter = localTestHelper.createService(knex);

        it('should created', done => {
            // WHEN/THEN
            expect(service).toBeTruthy();
            done();
        });

        it('executeActionTagReplace should error on no payload', done => {
            TestHelperSpec.doActionTagTestInvalidPayloadTest(knex, service, 'executeActionTagReplace', 'replace' , done);
        });

        it('executeActionTagReplace should error on unknown table', done => {
            TestHelperSpec.doActionTagFailInvalidTableTest(knex, service, 'executeActionTagReplace', 'replace',
                {
                    newId: '10',
                    newIdSetNull: false
                }, undefined, done);
        });

        it('executeActionTagReplace should error on invalid id', done => {
            TestHelperSpec.doActionTagTestInvalidIdTest(knex, service, 'executeActionTagReplace', 'replace', done);
        });

        it('executeActionTagReplace should reject: invalid newId', done => {
            const id: any = 5;
            const newId: any = 'a*';
            return TestHelperSpec.doActionTagFailTest(knex, service, 'executeActionTagReplace', 'image', id, {
                payload: {
                    newId: newId,
                    newIdSetNull: false
                },
                deletes: false,
                key: 'replace',
                recordId: id,
                type: 'tag'
            }, 'actiontag replace newId not valid', done);
        });

        it('executeActionTagReplace should reject: newId must be null if newIdSetNull', done => {
            const id: any = 5;
            const newId: any = '10';
            return TestHelperSpec.doActionTagFailTest(knex, service, 'executeActionTagReplace', 'image', id, {
                payload: {
                    newId: newId,
                    newIdSetNull: true
                },
                deletes: false,
                key: 'replace',
                recordId: id,
                type: 'tag'
            }, 'actiontag replace newId must be null if newIdSetNull', done);
        });

        it('executeActionTagReplace should reject: newId must integer', done => {
            const id: any = 5;
            const newId: any = 'a';
            return TestHelperSpec.doActionTagFailTest(knex, service, 'executeActionTagReplace', 'image', id, {
                payload: {
                    newId: newId,
                    newIdSetNull: false
                },
                deletes: false,
                key: 'replace',
                recordId: id,
                type: 'tag'
            }, 'actiontag replace newId must be integer', done);
        });
    });

    describe('#executeActionTagReplace()', () => {
        const knex = TestHelperSpec.createKnex('mysql', []);
        const service: CommonSqlActionTagReplaceAdapter = localTestHelper.createService(knex);

        it('executeActionTagReplace should set newId', done => {
            const id: any = 5;
            const newId: any = '10';
            TestHelperSpec.doActionTagTestSuccessTest(knex, service, 'executeActionTagReplace', 'image', id, {
                    payload: {
                        newId: newId,
                        newIdSetNull: false
                    },
                    deletes: false,
                    key: 'replace',
                    recordId: id,
                    type: 'tag'
                }, true,
                [
                    'SELECT i_id AS id FROM image WHERE i_id=?',
                    'SELECT i_id AS id FROM image WHERE i_id=?',
                    'UPDATE image_object SET i_id=? WHERE i_id=?',
                    'UPDATE image_playlist SET i_id=? WHERE i_id=?',
                    'UPDATE image_keyword SET i_id=? WHERE i_id=?',
                    'DELETE FROM image WHERE i_id=?'
                ],
                [
                    [5],
                    [10],
                    [10, 5],
                    [10, 5],
                    [10, 5],
                    [5]],
                done, [
                    [[{id: 5}]],
                    [[{id: 10}]]
                ]);
        });

        it('executeActionTagReplace should set newId null', done => {
            const id: any = 5;
            const newId: any = null;
            TestHelperSpec.doActionTagTestSuccessTest(knex, service, 'executeActionTagReplace', 'image', id, {
                    payload: {
                        newId: newId,
                        newIdSetNull: true
                    },
                    deletes: false,
                    key: 'replace',
                    recordId: id,
                    type: 'tag'
                }, true,
                [
                    'SELECT i_id AS id FROM image WHERE i_id=?',
                    'SELECT null AS id',
                    'DELETE FROM image_object WHERE i_id=?',
                    'DELETE FROM image_playlist WHERE i_id=?',
                    'DELETE FROM image_keyword WHERE i_id=?',
                    'DELETE FROM image WHERE i_id=?'
                ],
                [
                    [5],
                    [],
                    [5],
                    [5],
                    [5],
                    [5]],
                done, [
                    [[{id: 5}]],
                    [[{id: null}]]
                ]);
        });

        it('executeActionTagReplace should reject: id not exists', done => {
            const id: any = 5;
            const newId: any = '10';
            TestHelperSpec.doActionTagTestFailWithSqlsTest(knex, service, 'executeActionTagReplace', 'image', id, {
                    payload: {
                        newId: newId,
                        newIdSetNull: false
                    },
                    deletes: false,
                    key: 'replace',
                    recordId: id,
                    type: 'tag'
                }, '_doActionTag replace image failed: id not found ' + id,
                [
                    'SELECT i_id AS id FROM image WHERE i_id=?'
                ],
                [
                    [5]],
                done, [
                    [[]]
                ]);
        });

        it('executeActionTagReplace should reject: newId not exists', done => {
            const id: any = 5;
            const newId: any = '10';
            TestHelperSpec.doActionTagTestFailWithSqlsTest(knex, service, 'executeActionTagReplace', 'image', id, {
                    payload: {
                        newId: newId,
                        newIdSetNull: false
                    },
                    deletes: false,
                    key: 'replace',
                    recordId: id,
                    type: 'tag'
                }, '_doActionTag replace image failed: newId not found ' + newId,
                [
                    'SELECT i_id AS id FROM image WHERE i_id=?',
                    'SELECT i_id AS id FROM image WHERE i_id=?'
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
