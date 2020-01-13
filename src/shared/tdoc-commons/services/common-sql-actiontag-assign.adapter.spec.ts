/* tslint:disable:no-unused-variable */
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {TestHelperSpec} from './test-helper.spec';
import {ActionTagAssignConfigType, CommonDocSqlActionTagAssignAdapter} from './common-sql-actiontag-assign.adapter';

describe('CommonDocSqlActionTagAssignAdapter', () => {
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
                }};
            return new CommonDocSqlActionTagAssignAdapter(config, knex, sqlQueryBuilder, modelConfigType);
        },
    };


    describe('test defaults', () => {
        const knex = TestHelperSpec.createKnex('mysql', []);
        const service: CommonDocSqlActionTagAssignAdapter = localTestHelper.createService(knex);

        it('should created', done => {
            // WHEN/THEN
            expect(service).toBeTruthy();
            done();
        });

        it('executeActionTagAssign should error on no payload', done => {
            TestHelperSpec.doDefaultTestActionTagInvalidPayload(knex, service, 'executeActionTagAssign', 'assign' , done);
        });

        it('executeActionTagAssign should error on unknown table', done => {
            TestHelperSpec.doDefaultTestActionTagInvalidTable(knex, service, 'executeActionTagAssign', 'assign',
                {
                    newId: '10',
                    newIdSetNull: false,
                    referenceField: 'track_id_is'
                }, undefined, done);
        });

        it('executeActionTagAssign should error on invalid id', done => {
            TestHelperSpec.doDefaultTestActionTagInvalidId(knex, service, 'executeActionTagAssign', 'assign', done);
        });

        it('executeActionTagAssign should reject: invalid newId', done => {
            // WHEN
            knex.resetTestResults([true]);
            const id: any = 5;
            const newId: any = 'a*';
            Observable.fromPromise(service.executeActionTagAssign('image', id, {
                payload: {
                    newId: newId,
                    newIdSetNull: false,
                    referenceField: 'track_id_is'
                },
                deletes: false,
                key: 'assign',
                recordId: id,
                type: 'tag'
            }, {})).subscribe(
                res => {
                    // THEN
                    expect(res).toBeUndefined();
                    done();
                },
                error => {
                    expect(error).toEqual('actiontag assign newId not valid');
                    done();
                },
                () => {
                    done();
                }
            );
        });

        it('executeActionTagAssign should reject: newId must be null if newIdSetNull', done => {
            // WHEN
            knex.resetTestResults([true]);
            const id: any = 5;
            const newId: any = '10';
            Observable.fromPromise(service.executeActionTagAssign('image', id, {
                payload: {
                    newId: newId,
                    newIdSetNull: true,
                    referenceField: 'track_id_is'
                },
                deletes: false,
                key: 'assign',
                recordId: id,
                type: 'tag'
            }, {})).subscribe(
                res => {
                    // THEN
                    expect(res).toBeUndefined();
                    done();
                },
                error => {
                    expect(error).toEqual('actiontag assign newId must be null if newIdSetNull');
                    done();
                },
                () => {
                    done();
                }
            );
        });

        it('executeActionTagAssign should reject: newId must integer', done => {
            // WHEN
            knex.resetTestResults([true]);
            const id: any = 5;
            const newId: any = 'a';
            Observable.fromPromise(service.executeActionTagAssign('image', id, {
                payload: {
                    newId: newId,
                    newIdSetNull: false,
                    referenceField: 'track_id_is'
                },
                deletes: false,
                key: 'assign',
                recordId: id,
                type: 'tag'
            }, {})).subscribe(
                res => {
                    // THEN
                    expect(res).toBeUndefined();
                    done();
                },
                error => {
                    expect(error).toEqual('actiontag assign newId must be integer');
                    done();
                },
                () => {
                    done();
                }
            );
        });

        it('executeActionTagAssign should reject: invalid referenceField', done => {
            // WHEN
            knex.resetTestResults([true]);
            const id: any = 5;
            const newId: any = '10';
            Observable.fromPromise(service.executeActionTagAssign('image', id, {
                payload: {
                    newId: newId,
                    newIdSetNull: false,
                    referenceField: '*unknownReferenceField'
                },
                deletes: false,
                key: 'assign',
                recordId: id,
                type: 'tag'
            }, {})).subscribe(
                res => {
                    // THEN
                    expect(res).toBeUndefined();
                    done();
                },
                error => {
                    expect(error).toEqual('actiontag assign referenceField not valid');
                    done();
                },
                () => {
                    done();
                }
            );
        });

        it('executeActionTagAssign should reject: unknown referenceField', done => {
            // WHEN
            knex.resetTestResults([true]);
            const id: any = 5;
            const newId: any = '10';
            Observable.fromPromise(service.executeActionTagAssign('image', id, {
                payload: {
                    newId: newId,
                    newIdSetNull: false,
                    referenceField: 'unknownReferenceField'
                },
                deletes: false,
                key: 'assign',
                recordId: id,
                type: 'tag'
            }, {})).subscribe(
                res => {
                    // THEN
                    expect(res).toBeUndefined();
                    done();
                },
                error => {
                    expect(error).toEqual('actiontag assign referenceField not exists');
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
