import {utils} from 'js-data';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import {ActionTagForm} from '@dps/mycms-commons/dist/commons/utils/actiontag.utils';

export class TestHelperSpec {
    public static createKnex(client: string, returnValues: any[]) {
        return {
            client: {
                config: {
                    client: client
                }
            },
            sqls: [],
            params: [],
            returnValues: returnValues.reverse(),
            raw: function (sql, params) {
                this.sqls.push(sql);
                this.params.push(params);
                const result = this.returnValues.pop();
                return utils.resolve(result);
            },
            resetTestResults: function (newReturnValues: any[]) {
                this.sqls = [];
                this.params = [];
                this.returnValues = newReturnValues.reverse();
            }
        };
    }

    public static doActionTagTestSuccessTest(knex, service, functionName: string, table: string, id: any, actionForm: ActionTagForm,
                                             result: any, sqls: string[], parameters: any[], done, newReturnValue?: any[]) {
        knex.resetTestResults(newReturnValue ? newReturnValue : [true]);

        // WHEN
        return Observable.fromPromise(service[functionName](table, id, actionForm, {})).subscribe(
            res => {
                // THEN
                expect(res).toEqual(result);
                expect(knex.sqls).toEqual(sqls);
                expect(knex.params).toEqual(parameters);
                done();
            },
            error => {
                expect(error).toBeUndefined();
                expect(false).toBeTruthy('should not fail');
                done();
            },
            () => {
                done();
            }
        );
    }

    public static doActionTagTestFailWithSqlsTest(knex, service, functionName: string, table: string, id: any, actionForm: ActionTagForm,
                                                  errorMsg: string, sqls: string[], parameters: any[], done, newReturnValue?: any[]) {
        knex.resetTestResults(newReturnValue ? newReturnValue : [true]);

        // WHEN
        return Observable.fromPromise(service[functionName](table, id, actionForm, {})).subscribe(
            res => {
                // THEN
                expect(res).toBeUndefined();
                expect(false).toBeTruthy('should fail');
                done();
            },
            error => {
                expect(error).toEqual(errorMsg);
                expect(knex.sqls).toEqual(sqls);
                expect(knex.params).toEqual(parameters);
                done();
            },
            () => {
                done();
            }
        );
    }

    public static doActionTagFailTest(knex, service, functionName: string, table: string, id: any, actionForm: ActionTagForm,
                                      errorMsg: string, done, newReturnValue?: any[]) {
        knex.resetTestResults(newReturnValue ? newReturnValue : [true]);

        // WHEN
        return Observable.fromPromise(service[functionName](table, id, actionForm, {})).subscribe(
            res => {
                // THEN
                expect(res).toBeUndefined();
                expect(false).toBeTruthy('should fail');
                done();
            },
            error => {
                expect(error).toEqual(errorMsg);
                done();
            },
            () => {
                done();
            }
        );
    }

    public static doActionTagTestInvalidPayloadTest(knex, service, functionName, action, done) {
        const id: any = 7;
        return TestHelperSpec.doActionTagFailTest(knex, service, functionName, 'table', id, {
            payload: undefined,
            deletes: false,
            key: action,
            recordId: id,
            type: 'tag'
        }, 'actiontag ' + action + ' playload expected', done);
    }

    public static doActionTagTestInvalidIdTest(knex, service, functionName, action, done) {
        const id: any = 'a';
        return TestHelperSpec.doActionTagFailTest(knex, service, functionName, 'table', id, {
            payload: {
                set: 0
            },
            deletes: false,
            key: action,
            recordId: id,
            type: 'tag'
        }, 'actiontag ' + action + ' id not an integer', done);
    }

    public static doActionTagFailInvalidTableTest(knex, service, functionName, action, payload, altErrorMsg, done) {
        const id: any = 7;
        return TestHelperSpec.doActionTagFailTest(knex, service, functionName, 'unknowntable', id, {
            payload: {
                ...payload
            },
            deletes: false,
            key: action,
            recordId: id,
            type: 'tag'
        }, altErrorMsg !== undefined ? altErrorMsg : 'actiontag ' + action + ' table not valid', done);
    }
}
