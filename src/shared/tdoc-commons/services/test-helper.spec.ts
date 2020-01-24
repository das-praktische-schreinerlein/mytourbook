import {utils} from 'js-data';

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
}
