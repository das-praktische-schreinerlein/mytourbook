/* tslint:disable:no-unused-variable */
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {TestHelperSpec} from './test-helper.spec';
import {ActionTagReplaceConfigType, CommonDocSqlActionTagReplaceAdapter} from './common-sql-actiontag-replace.adapter';

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
            return new CommonDocSqlActionTagReplaceAdapter(config, knex, sqlQueryBuilder, modelConfigType);
        },
    };


    describe('test defaults', () => {
        const knex = TestHelperSpec.createKnex('mysql', []);
        const service: CommonDocSqlActionTagReplaceAdapter = localTestHelper.createService(knex);

        it('should created', done => {
            // WHEN/THEN
            expect(service).toBeTruthy();
            done();
        });

        it('executeActionTagReplace should error on no payload', done => {
            TestHelperSpec.doDefaultTestActionTagInvalidPayload(knex, service, 'executeActionTagReplace', 'replace' , done);
        });

        it('executeActionTagReplace should error on unknown table', done => {
            TestHelperSpec.doDefaultTestActionTagInvalidTable(knex, service, 'executeActionTagReplace', 'replace',
                {
                    newId: '10',
                    newIdSetNull: false
                }, undefined, done);
        });

        it('executeActionTagReplace should error on invalid id', done => {
            TestHelperSpec.doDefaultTestActionTagInvalidId(knex, service, 'executeActionTagReplace', 'replace', done);
        });

        it('executeActionTagReplace should reject: invalid newId', done => {
            // WHEN
            knex.resetTestResults([true]);
            const id: any = 5;
            const newId: any = 'a*';
            Observable.fromPromise(service.executeActionTagReplace('image', id, {
                payload: {
                    newId: newId,
                    newIdSetNull: false
                },
                deletes: false,
                key: 'replace',
                recordId: id,
                type: 'tag'
            }, {})).subscribe(
                res => {
                    // THEN
                    expect(res).toBeUndefined();
                    done();
                },
                error => {
                    expect(error).toEqual('actiontag replace newId not valid');
                    done();
                },
                () => {
                    done();
                }
            );
        });

        it('executeActionTagReplace should reject: newId must be null if newIdSetNull', done => {
            // WHEN
            knex.resetTestResults([true]);
            const id: any = 5;
            const newId: any = '10';
            Observable.fromPromise(service.executeActionTagReplace('image', id, {
                payload: {
                    newId: newId,
                    newIdSetNull: true
                },
                deletes: false,
                key: 'replace',
                recordId: id,
                type: 'tag'
            }, {})).subscribe(
                res => {
                    // THEN
                    expect(res).toBeUndefined();
                    done();
                },
                error => {
                    expect(error).toEqual('actiontag replace newId must be null if newIdSetNull');
                    done();
                },
                () => {
                    done();
                }
            );
        });

        it('executeActionTagReplace should reject: newId must integer', done => {
            // WHEN
            knex.resetTestResults([true]);
            const id: any = 5;
            const newId: any = 'a';
            Observable.fromPromise(service.executeActionTagReplace('image', id, {
                payload: {
                    newId: newId,
                    newIdSetNull: false
                },
                deletes: false,
                key: 'replace',
                recordId: id,
                type: 'tag'
            }, {})).subscribe(
                res => {
                    // THEN
                    expect(res).toBeUndefined();
                    done();
                },
                error => {
                    expect(error).toEqual('actiontag replace newId must be integer');
                    done();
                },
                () => {
                    done();
                }
            );
        });
    });

    // TODO add specs
});
