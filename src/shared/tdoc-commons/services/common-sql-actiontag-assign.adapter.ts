import {ActionTagForm} from '@dps/mycms-commons/dist/commons/utils/actiontag.utils';
import {IdValidationRule, KeywordValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {utils} from 'js-data';
import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import * as Promise_serial from 'promise-serial';
import {RawSqlQueryData, SqlUtils} from '@dps/mycms-commons/dist/search-commons/services/sql-utils';

export interface ActionTagAssignReferenceTableConfigType {
    table: string;
    idField: string;
    referenceField: string;
}

export interface ActionTagAssignReferenceTableConfigsType {
    [key: string]: ActionTagAssignReferenceTableConfigType;
}

export interface ActionTagAssignTableConfigType {
    table: string;
    idField: string;
    references: ActionTagAssignReferenceTableConfigsType;
}

export interface ActionTagAssignTableConfigsType {
    [key: string]: ActionTagAssignTableConfigType;
}

export interface ActionTagAssignConfigType {
    tables: ActionTagAssignTableConfigsType;
}

export interface AssignActionTagForm extends ActionTagForm {
    payload: {
        newId: string;
        newIdSetNull: boolean;
        referenceField: string;
    };
}

export class CommonSqlActionTagAssignAdapter {

    private keywordValidationRule = new KeywordValidationRule(true);
    private idValidator = new IdValidationRule(true);
    private config: any;
    private readonly knex: any;
    private sqlQueryBuilder: SqlQueryBuilder;
    private readonly assignConfigs: ActionTagAssignConfigType;

    constructor(config: any, knex: any, sqlQueryBuilder: SqlQueryBuilder, assignConfigs: ActionTagAssignConfigType) {
        this.config = config;
        this.knex = knex;
        this.sqlQueryBuilder = sqlQueryBuilder;
        this.assignConfigs = assignConfigs;
    }

    public executeActionTagAssign(table: string, id: number, actionTagForm: AssignActionTagForm, opts: any): Promise<any> {
        opts = opts || {};

        if (!utils.isInteger(id)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' id not an integer');
        }
        if (actionTagForm.payload === undefined) {
            return utils.reject('actiontag ' + actionTagForm.key + ' playload expected');
        }
        const referenceField = actionTagForm.payload.referenceField;
        if (!this.keywordValidationRule.isValid(referenceField)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' referenceField not valid');
        }

        let newId: any = actionTagForm.payload.newId;
        const newIdSetNull = actionTagForm.payload.newIdSetNull;
        if (newIdSetNull) {
            if (newId !== null && newId !== 'null') {
                return utils.reject('actiontag ' + actionTagForm.key + ' newId must be null if newIdSetNull');
            }
        } else {
            if (!this.idValidator.isValid(newId)) {
                return utils.reject('actiontag ' + actionTagForm.key + ' newId not valid');
            }
            if ((id + '') === (newId + '')) {
                return utils.reject('actiontag ' + actionTagForm.key + ' newId must not equal id');
            }
            newId = parseInt(newId, 10);
            if (!utils.isInteger(newId)) {
                return utils.reject('actiontag ' + actionTagForm.key + ' newId must be integer');
            }
        }

        const assignConfig: ActionTagAssignTableConfigType = this.assignConfigs.tables[table];
        if (!assignConfig) {
            return utils.reject('actiontag ' + actionTagForm.key + ' table not valid');
        }

        const referenceConfig: ActionTagAssignReferenceTableConfigType = assignConfig.references[referenceField];
        if (!referenceConfig) {
            return utils.reject('actiontag ' + actionTagForm.key + ' referenceField not exists');
        }

        const checkBaseSqlQuery: RawSqlQueryData = {
            sql: 'SELECT ' + assignConfig.idField + ' AS id' +
                ' FROM ' + assignConfig.table +
                ' WHERE ' + assignConfig.idField + '=' + '?' + '',
            parameters: [id]};
        let checkNewValueSqlQuery: RawSqlQueryData = undefined;
        const updateSqlQueries: RawSqlQueryData[] = [];
        if (newIdSetNull) {
            checkNewValueSqlQuery = {
                sql: 'SELECT null AS id',
                parameters: []};
            updateSqlQueries.push({
                sql: 'UPDATE ' + assignConfig.table +
                    ' SET ' + referenceConfig.referenceField + '=null' +
                    ' WHERE ' + assignConfig.idField + '=' + '?' + '',
                parameters: [id]}
            );
        } else {
            checkNewValueSqlQuery = {sql: 'SELECT ' + referenceConfig.idField + ' AS id' +
                    ' FROM ' + referenceConfig.table +
                    ' WHERE ' + referenceConfig.idField + '=' + '?' + '',
                parameters: [newId]};
            updateSqlQueries.push({sql:
                    'UPDATE ' + assignConfig.table +
                    ' SET ' + referenceConfig.referenceField + '=' + '?' + '' +
                    ' WHERE ' + assignConfig.idField + '=' + '?' + '',
                parameters: [newId, id]}
            );
        }

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const result = new Promise((resolve, reject) => {
            SqlUtils.executeRawSqlQueryData(sqlBuilder, checkBaseSqlQuery).then(dbresults => {
                const records = this.sqlQueryBuilder.extractDbResult(dbresults, this.knex.client['config']['client']);
                if (records === undefined || records.length !== 1 || records[0]['id'] !== id) {
                    return utils.reject('_doActionTag assign ' + table + ' failed: id not found ' + id);
                }

                return SqlUtils.executeRawSqlQueryData(sqlBuilder, checkNewValueSqlQuery);
            }).then(dbresults => {
                const records = this.sqlQueryBuilder.extractDbResult(dbresults, this.knex.client['config']['client']);
                if (records === undefined || records.length !== 1 || records[0]['id'] !== newId) {
                    return utils.reject('_doActionTag assign ' + table + ' failed: newId not found ' + newId);
                }

                const updateSqlQueryPromises = [];
                for (const updateSql of updateSqlQueries) {
                    updateSqlQueryPromises.push(function () {
                        return SqlUtils.executeRawSqlQueryData(sqlBuilder, updateSql);
                    });
                }
                return Promise_serial(updateSqlQueryPromises, {parallelize: 1});
            }).then(() => {
                return resolve(true);
            }).catch(function errorPlaylist(reason) {
                console.error('_doActionTag assign ' + table + ' failed:', reason);
                return reject(reason);
            });
        });

        return result;
    }

}
