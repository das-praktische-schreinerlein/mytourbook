import {utils} from 'js-data';
import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {BaseJoinRecordType} from '../model/records/basejoin-record';
import {RawSqlQueryData, SqlUtils} from '@dps/mycms-commons/dist/search-commons/services/sql-utils';


export interface JoinFieldMappingConfigJoinType {
    [key: string]: string;
}

export interface JoinModelConfigTableType {
    baseTableIdField: string;
    joinTable: string;
    joinFieldMappings: JoinFieldMappingConfigJoinType;
}

export interface JoinModelConfigTablesType {
    [key: string]: JoinModelConfigTableType;
}

export interface JoinModelConfigType {
    tables: JoinModelConfigTablesType;
}

export class CommonSqlJoinAdapter {

    private config: any;
    private readonly knex: any;
    private sqlQueryBuilder: SqlQueryBuilder;
    private readonly joinModelConfig: JoinModelConfigType;

    constructor(config: any, knex: any, sqlQueryBuilder: SqlQueryBuilder, joinModelConfig: JoinModelConfigType) {
        this.config = config;
        this.knex = knex;
        this.sqlQueryBuilder = sqlQueryBuilder;
        this.joinModelConfig = joinModelConfig;
    }

    public saveJoins(joinTableKey: string, dbId: number, joinRecords: BaseJoinRecordType[], opts: any):
        Promise<any> {
        if (!utils.isInteger(dbId)) {
            return utils.reject('setJoins ' + joinTableKey + ' id not an integer');
        }
        if (!this.joinModelConfig.tables[joinTableKey]) {
            return utils.reject('setJoins: ' + joinTableKey + ' - table not valid');
        }
        const joinConfig = this.joinModelConfig.tables[joinTableKey];
        const baseTableIdField = joinConfig.baseTableIdField;
        const joinTable = joinConfig.joinTable;
        const joinFields = joinConfig.joinFieldMappings;

        const deleteSqlQuery: RawSqlQueryData = {
            sql: 'DELETE FROM ' + joinTable + ' ' +
                'WHERE ' + baseTableIdField + ' = ' + '?' + '',
            parameters: [].concat([dbId])};
        const promises = [];

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const rawDelete = SqlUtils.executeRawSqlQueryData(sqlBuilder, deleteSqlQuery);

        for (const joinRecord of joinRecords) {
            const fields = [baseTableIdField];
            const values = [dbId];
            for (const destField in joinFields) {
                fields.push(destField);
                values.push(joinRecord[joinFields[destField]]);
            }
            const insertSqlQuery: RawSqlQueryData = {
                sql: 'INSERT INTO ' + joinTable + ' (' + fields.join(', ') + ') ' +
                    'VALUES(' + SqlUtils.mapParametersToPlaceholderString(values) + ')',
                parameters: [].concat(values)};
            promises.push(SqlUtils.executeRawSqlQueryData(sqlBuilder, insertSqlQuery));
        }

        const result = new Promise((resolve, reject) => {
            rawDelete.then(() => {
                return Promise.all(promises).then(() => {
                    return resolve(true);
                }).catch(function errorJoinDetails(reason) {
                    console.error('_doJoin delete/insert ' + joinTable + ' failed:', reason);
                    return reject(reason);
                });
            }).then(() => {
                return resolve(true);
            }).catch(function errorJoin(reason) {
                console.error('_doJoin delete/insert ' + joinTable + ' failed:', reason);
                return reject(reason);
            });
        });

        return result;
    }
}
