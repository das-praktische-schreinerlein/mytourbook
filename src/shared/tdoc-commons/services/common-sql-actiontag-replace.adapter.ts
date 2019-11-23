import {ActionTagForm} from '@dps/mycms-commons/dist/commons/utils/actiontag.utils';
import {IdValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {utils} from 'js-data';
import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import * as Promise_serial from 'promise-serial';
import {isInteger} from '@ng-bootstrap/ng-bootstrap/util/util';

export interface ActionTagReplaceReferenceTableConfigType {
    table: string;
    referenceField: string;
}

export interface ActionTagReplaceTableConfigType {
    table: string;
    idField: string;
    referenced: ActionTagReplaceReferenceTableConfigType[];
    joins: ActionTagReplaceReferenceTableConfigType[];
}

export interface ActionTagReplaceTableConfigsType {
    [key: string]: ActionTagReplaceTableConfigType;
}

export interface ActionTagReplaceConfigType {
    tables: ActionTagReplaceTableConfigsType;
}

export class CommonDocSqlActionTagReplaceAdapter {

    private idValidator = new IdValidationRule(true);
    private config: any;
    private readonly knex: any;
    private sqlQueryBuilder: SqlQueryBuilder;
    private readonly replaceConfigs: ActionTagReplaceConfigType;

    constructor(config: any, knex: any, sqlQueryBuilder: SqlQueryBuilder, replaceConfigs: ActionTagReplaceConfigType) {
        this.config = config;
        this.knex = knex;
        this.sqlQueryBuilder = sqlQueryBuilder;
        this.replaceConfigs = replaceConfigs;
    }

    public executeActionTagReplace(table: string, id: number, actionTagForm: ActionTagForm, opts: any): Promise<any> {
        opts = opts || {};

        if (!utils.isInteger(id)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' id not an integer');
        }
        if (actionTagForm.payload === undefined) {
            return utils.reject('actiontag ' + actionTagForm.key + ' playload expected');
        }

        const replaceConfig: ActionTagReplaceTableConfigType = this.replaceConfigs.tables[table];
        if (!replaceConfig) {
            return utils.reject('actiontag ' + actionTagForm.key + ' table not valid');
        }

        const referenceConfigs: ActionTagReplaceReferenceTableConfigType[] = replaceConfig.referenced;
        if (!referenceConfigs) {
            return utils.reject('actiontag ' + actionTagForm.key + ' table.referenced not valid');
        }

        const joinConfigs: ActionTagReplaceReferenceTableConfigType[] = replaceConfig.joins;
        if (!joinConfigs) {
            return utils.reject('actiontag ' + actionTagForm.key + ' table.joins not valid');
        }

        let newId = actionTagForm.payload['newId'];
        const newIdSetNull = actionTagForm.payload['newIdSetNull'];
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
            if (!isInteger(newId)) {
                return utils.reject('actiontag ' + actionTagForm.key + ' newId must be integer');
            }
        }

        const checkBaseSql = 'SELECT ' + replaceConfig.idField + ' AS id' +
            ' FROM ' + replaceConfig.table +
            ' WHERE ' + replaceConfig.idField + '="' + id + '"';
        let checkNewValueSql = undefined;
        const updateSqls: string[] = [];
        if (newIdSetNull) {
            checkNewValueSql = 'SELECT null AS id';
            for (const referenceConfig of referenceConfigs) {
                updateSqls.push(
                    'UPDATE ' + referenceConfig.table +
                    ' SET ' + referenceConfig.referenceField + '=null' +
                    ' WHERE ' + referenceConfig.referenceField + '="' + id + '"',
                );
            }
            for (const joinConfig of joinConfigs) {
                updateSqls.push(
                    'DELETE FROM ' + joinConfig.table +
                    ' WHERE ' + joinConfig.referenceField + '="' + id + '"',
                );
            }
        } else {
            checkNewValueSql = 'SELECT ' + replaceConfig.idField + ' AS id' +
                ' FROM ' + replaceConfig.table +
                ' WHERE ' + replaceConfig.idField + '="' + newId + '"';
            for (const referenceConfig of referenceConfigs) {
                updateSqls.push(
                    'UPDATE ' + referenceConfig.table +
                    ' SET ' + referenceConfig.referenceField + '="' + newId + '"' +
                    ' WHERE ' + referenceConfig.referenceField + '="' + id + '"',
                );
            }
            for (const joinConfig of joinConfigs) {
                updateSqls.push(
                    'UPDATE ' + joinConfig.table +
                    ' SET ' + joinConfig.referenceField + '="' + newId + '"' +
                    ' WHERE ' + joinConfig.referenceField + '="' + id + '"',
                );
            }
        }
        const deleteSql = 'DELETE FROM ' + replaceConfig.table +
            ' WHERE ' + replaceConfig.idField + '="' + id + '"';

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const result = new Promise((resolve, reject) => {
            sqlBuilder.raw(checkBaseSql).then(dbresults => {
                const records = this.sqlQueryBuilder.extractDbResult(dbresults, this.knex.client['config']['client']);
                if (records === undefined || records.length !== 1 || records[0]['id'] !== id) {
                    return utils.reject('_doActionTag replace ' + table + ' failed: id not found ' + id);
                }

                return sqlBuilder.raw(checkNewValueSql);
            }).then(dbresults => {
                const records = this.sqlQueryBuilder.extractDbResult(dbresults, this.knex.client['config']['client']);
                if (records === undefined || records.length !== 1 || records[0]['id'] !== newId) {
                    return utils.reject('_doActionTag replace ' + table + ' failed: newId not found ' + newId);
                }

                const updateSqlQueryPromises = [];
                for (const updateSql of updateSqls) {
                    updateSqlQueryPromises.push(function () {
                        return sqlBuilder.raw(updateSql);
                    });
                }
                return Promise_serial(updateSqlQueryPromises, {parallelize: 1});
            }).then(dbresults => {
                return sqlBuilder.raw(deleteSql);
            }).then(dbresults => {
                return resolve(true);
            }).catch(function errorPlaylist(reason) {
                console.error('_doActionTag replace ' + table + ' failed:', reason);
                return reject(reason);
            });
        });

        return result;
    }

}
