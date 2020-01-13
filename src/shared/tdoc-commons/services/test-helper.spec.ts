import {utils} from 'js-data';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';

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
            returnValues: returnValues,
            raw: function (sql, params) {
                this.sqls.push(sql);
                this.params.push(params);
                return utils.resolve(this.returnValues.pop());
            },
            resetTestResults: function (newReturnValues: any[]) {
                this.sqls = [];
                this.params = [];
                this.returnValues = newReturnValues;
            }
        };
    }

    public static doDefaultTestActionTagInvalidPayload(knex, service, functionName, action, done) {
        knex.resetTestResults([true]);

        // WHEN
        const id: any = 7;
        Observable.fromPromise(service[functionName]('table', id, {
            payload: undefined,
            deletes: false,
            key: action,
            recordId: id,
            type: 'tag'
        }, {})).subscribe(
            res => {
                // THEN
                expect(res).toBeUndefined();
                done();
            },
            error => {
                expect(error).toEqual('actiontag ' + action + ' playload expected');
                done();
            },
            () => {
                done();
            }
        );
    }

    public static doDefaultTestActionTagInvalidId(knex, service, functionName, action, done) {
        knex.resetTestResults([true]);

        // WHEN
        const invalidId: any = 'a';
        Observable.fromPromise(service[functionName]('table', invalidId, {
            payload: {
                set: 0
            },
            deletes: false,
            key: action,
            recordId: invalidId,
            type: 'tag'
        }, {})).subscribe(
            res => {
                // THEN
                expect(res).toBeUndefined();
                done();
            },
            error => {
                expect(error).toEqual('actiontag ' + action + ' id not an integer');
                done();
            },
            () => {
                done();
            }
        );
    }

    public static doDefaultTestActionTagInvalidTable(knex, service, functionName, action, payload, altErrorMsg, done) {
        knex.resetTestResults([true]);

        // WHEN
        const id: any = 7;
        Observable.fromPromise(service[functionName]('unknowntable', id, {
            payload: {
                ...payload
            },
            deletes: false,
            key: action,
            recordId: id,
            type: 'tag'
        }, {})).subscribe(
            res => {
                // THEN
                expect(res).toBeUndefined();
                done();
            },
            error => {
                expect(error).toEqual(altErrorMsg !== undefined ? altErrorMsg : 'actiontag ' + action + ' table not valid');
                done();
            },
            () => {
                done();
            }
        );

    }
}
