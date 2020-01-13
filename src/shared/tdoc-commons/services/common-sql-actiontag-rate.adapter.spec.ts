/* tslint:disable:no-unused-variable */
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {TestHelperSpec} from './test-helper.spec';
import {CommonDocSqlActionTagRateAdapter} from './common-sql-actiontag-rate.adapter';
import {CommonSqlRateAdapter, RateModelConfigType} from './common-sql-rate.adapter';

describe('CommonDocSqlActionTagRateAdapter', () => {
    const modelConfigType: RateModelConfigType = {
        tables: {
            'image': {
                fieldId: 'i_id',
                table: 'image',
                rateFields: {
                    'gesamt': 'i_rate',
                    'motive': 'i_rate_motive',
                    'wichtigkeit': 'i_rate_wichtigkeit'
                },
                fieldSum: 'i_rate'
            }
        }
    };

    const sqlQueryBuilder: SqlQueryBuilder = new SqlQueryBuilder();
    const localTestHelper = {
        createService: function (knex) {
            const config = {
                knexOpts: {
                    client: knex.client.config.client
                }};
            return new CommonDocSqlActionTagRateAdapter(
                new CommonSqlRateAdapter(config, knex, sqlQueryBuilder, modelConfigType));
        },
    };


    describe('test defaults', () => {
        const knex = TestHelperSpec.createKnex('mysql', []);
        const service: CommonDocSqlActionTagRateAdapter = localTestHelper.createService(knex);

        it('should created', done => {
            // WHEN/THEN
            expect(service).toBeTruthy();
            done();
        });

        it('executeActionTagBlock should error on no payload', done => {
            TestHelperSpec.doDefaultTestActionTagInvalidPayload(knex, service, 'executeActionTagRate', 'rate' , done);
        });

        it('executeActionTagBlock should error on invalid id', done => {
            TestHelperSpec.doDefaultTestActionTagInvalidId(knex, service, 'executeActionTagRate', 'rate', done);
        });

        it('executeActionTagBlock should error on unknown table', done => {
            TestHelperSpec.doDefaultTestActionTagInvalidTable(knex, service, 'executeActionTagRate', 'rate',
                {
                    ratekey: 'gesamt',
                    value: 1,
                }, 'setRates: unknowntable - table not valid', done);
        });

        it('executeActionTagRate should reject ratekey', done => {
            // WHEN
            knex.resetTestResults([true]);
            const id: any = 5;
            Observable.fromPromise(service.executeActionTagRate('image', id, {
                payload: {
                    ratekey: 'unknownRateKey',
                    value: 15,
                },
                deletes: false,
                key: 'rate',
                recordId: id,
                type: 'tag'
            }, {})).subscribe(
                res => {
                    // THEN
                    expect(res).toBeUndefined();
                    done();
                },
                error => {
                    expect(error).toEqual('setRates: image - rateKey not valid');
                    done();
                },
                () => {
                    done();
                }
            );
        });

        it('executeActionTagRate should reject rate', done => {
            // WHEN
            knex.resetTestResults([true]);
            const id: any = 5;
            const rate: any = 'a';
            Observable.fromPromise(service.executeActionTagRate('image', id, {
                payload: {
                    ratekey: 'gesamt',
                    value: rate,
                },
                deletes: false,
                key: 'rate',
                recordId: id,
                type: 'tag'
            }, {})).subscribe(
                res => {
                    // THEN
                    expect(res).toBeUndefined();
                    done();
                },
                error => {
                    expect(error).toEqual('actiontag rate rate not valid');
                    done();
                },
                () => {
                    done();
                }
            );
        });
    });

    describe('#executeActionTagRate()', () => {
        const knex = TestHelperSpec.createKnex('mysql', []);
        const service: CommonDocSqlActionTagRateAdapter = localTestHelper.createService(knex);

        it('executeActionTagRate should set gesamt', done => {
            // WHEN
            knex.resetTestResults([true]);
            const id: any = 5;
            Observable.fromPromise(service.executeActionTagRate('image', id, {
                payload: {
                    ratekey: 'gesamt',
                    value: 15,
                },
                deletes: false,
                key: 'rate',
                recordId: id,
                type: 'tag'
            }, {})).subscribe(
                res => {
                    // THEN
                    expect(res).toEqual(true);
                    expect(knex.sqls).toEqual(['UPDATE image SET' +
                    ' i_rate=GREATEST(COALESCE(?, -1)),' +
                    ' i_rate=GREATEST(COALESCE(i_rate, -1), COALESCE(i_rate_motive, -1), COALESCE(i_rate_wichtigkeit, -1))' +
                    '  WHERE i_id = ?']);
                    expect(knex.params).toEqual([[15, 5]]);
                    done();
                },
                error => {
                    expect(error).toBeUndefined();
                    done();
                },
                () => {
                    done();
                }
            );
        });

        it('executeActionTagRate should set gesamt', done => {
            // WHEN
            knex.resetTestResults([true]);
            const id: any = 5;
            Observable.fromPromise(service.executeActionTagRate('image', id, {
                payload: {
                    ratekey: 'motive',
                    value: 15,
                },
                deletes: false,
                key: 'rate',
                recordId: id,
                type: 'tag'
            }, {})).subscribe(
                res => {
                    // THEN
                    expect(res).toEqual(true);
                    expect(knex.sqls).toEqual(['UPDATE image SET' +
                    ' i_rate_motive=GREATEST(COALESCE(?, -1)),' +
                    ' i_rate=GREATEST(COALESCE(i_rate, -1), COALESCE(i_rate_motive, -1), COALESCE(i_rate_wichtigkeit, -1))' +
                    '  WHERE i_id = ?']);
                    expect(knex.params).toEqual([[15, 5]]);
                    done();
                },
                error => {
                    expect(error).toBeUndefined();
                    done();
                },
                () => {
                    done();
                }
            );
        });
    });
});
