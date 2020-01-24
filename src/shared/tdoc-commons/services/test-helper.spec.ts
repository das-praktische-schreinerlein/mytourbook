import {utils} from 'js-data';
import {Observable} from 'rxjs/Observable';

export class TestHelper {
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

    public static doTestSuccessWithSqlsTest(knex, promiseFunction, result: any, sqls: string[], parameters: any[], done,
                                            newReturnValue?: any[]) {
        knex.resetTestResults(newReturnValue ? newReturnValue : [true]);

        // WHEN
        return Observable.fromPromise(promiseFunction()).subscribe(
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

    public static doTestFailWithSqlsTest(knex, promiseFunction, errorMsg: string, sqls: string[], parameters: any[], done,
                                         newReturnValue?: any[]) {
        knex.resetTestResults(newReturnValue ? newReturnValue : [true]);

        // WHEN
        return Observable.fromPromise(promiseFunction()).subscribe(
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

}
