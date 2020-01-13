import {ActionTagForm} from '@dps/mycms-commons/dist/commons/utils/actiontag.utils';
import {utils} from 'js-data';
import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {RawSqlQueryData, SqlUtils} from '@dps/mycms-commons/dist/search-commons/services/sql-utils';

export interface ActionTagBlockTableConfigType {
    table: string;
    idField: string;
    blockField: string;
}

export interface ActionTagBlockTableConfigsType {
    [key: string]: ActionTagBlockTableConfigType;
}

export interface ActionTagBlockConfigType {
    tables: ActionTagBlockTableConfigsType;
}

export class CommonDocSqlActionTagBlockAdapter {

    private config: any;
    private readonly knex: any;
    private sqlQueryBuilder: SqlQueryBuilder;
    private readonly blockConfigs: ActionTagBlockConfigType;

    constructor(config: any, knex: any, sqlQueryBuilder: SqlQueryBuilder, blockConfigs: ActionTagBlockConfigType) {
        this.config = config;
        this.knex = knex;
        this.sqlQueryBuilder = sqlQueryBuilder;
        this.blockConfigs = blockConfigs;
    }

    public executeActionTagBlock(table: string, id: number, actionTagForm: ActionTagForm, opts: any): Promise<any> {
        opts = opts || {};

        if (!utils.isInteger(id)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' id not an integer');
        }
        if (actionTagForm.payload === undefined) {
            return utils.reject('actiontag ' + actionTagForm.key + ' playload expected');
        }

        const value = actionTagForm.payload.set ? 1 : 0;

        const blockConfig: ActionTagBlockTableConfigType = this.blockConfigs.tables[table];
        if (!blockConfig) {
            return utils.reject('actiontag ' + actionTagForm.key + ' table not valid');
        }

        const fieldName = blockConfig.blockField;
        const tableName = blockConfig.table;
        const idName = blockConfig.idField;

        let updateSql = 'UPDATE ' + tableName + ' SET ' + fieldName + '=' + '?' +
            '  WHERE ' + idName + ' = ' + '?' + '';
        updateSql = this.sqlQueryBuilder.transformToSqlDialect(updateSql, this.config.knexOpts.client);
        const updateSqlQuery: RawSqlQueryData = {
            sql: updateSql,
            parameters: [value, id]
        };

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const rawUpdate = SqlUtils.executeRawSqlQueryData(sqlBuilder, updateSqlQuery);
        const result = new Promise((resolve, reject) => {
            rawUpdate.then(() => {
                return resolve(true);
            }).catch(function errorPlaylist(reason) {
                console.error('_doActionTag update ' + tableName + ' blocked failed:', reason);
                return reject(reason);
            });
        });

        return result;
    }

}
