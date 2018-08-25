import {ActionTagForm} from '../../commons/utils/actiontag.utils';
import {KeywordValidationRule, NumberValidationRule} from '../../search-commons/model/forms/generic-validator.util';
import {utils} from 'js-data';
import {SqlQueryBuilder} from '../../search-commons/services/sql-query.builder';

export class TourDocSqlMediadbActionTagAdapter {

    private keywordValidationRule = new KeywordValidationRule(true);
    private rateValidationRule = new NumberValidationRule(true, 0, 15, 0);
    private config: any;
    private knex: any;
    private sqlQueryBuilder: SqlQueryBuilder;

    constructor(config: any, knex: any, sqlQueryBuilder: SqlQueryBuilder) {
        this.config = config;
        this.knex = knex;
        this.sqlQueryBuilder = sqlQueryBuilder;
    }

    public executeActionTagPlaylist(table: string, id: number, actionTagForm: ActionTagForm, opts: any): Promise<any> {
        opts = opts || {};

        if (!utils.isInteger(id)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' id not an integer');
        }
        if (actionTagForm.payload === undefined) {
            return utils.reject('actiontag ' + actionTagForm.key + ' playload expected');
        }
        const playlistKey = actionTagForm.payload['playlistkey'];
        if (!this.keywordValidationRule.isValid(playlistKey)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' playlistkey not valid');
        }

        const ratePersGesamt = actionTagForm.payload['tdocratepers.gesamt'] || 0;
        if (!this.rateValidationRule.isValid(ratePersGesamt)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' ratePersGesamt not valid');
        }
        const ratePersMotive = actionTagForm.payload['tdocratepers.motive'] || 0;
        if (!this.rateValidationRule.isValid(ratePersMotive)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' ratePersMotive not valid');
        }
        const ratePersWichtigkeit = actionTagForm.payload['tdocratepers.wichtigkeit'] || 0;
        if (!this.rateValidationRule.isValid(ratePersWichtigkeit)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' ratePersWichtigkeit not valid');
        }

        let baseTableName;
        let joinTableName;
        let idName;
        let rateName;
        let rateNameMotive;
        let rateNameWichtigkeit;
        switch (table) {
            case 'image':
                baseTableName = 'image';
                joinTableName = 'image_playlist';
                idName = 'i_id';
                rateName = 'i_rate';
                rateNameMotive = 'i_rate_motive';
                rateNameWichtigkeit = 'i_rate_wichtigkeit';
                break;
            case 'video':
                baseTableName = 'video';
                joinTableName = 'video_playlist';
                idName = 'v_id';
                rateName = 'v_rate';
                rateNameMotive = 'v_rate_motive';
                rateNameWichtigkeit = 'v_rate_wichtigkeit';
                break;
            default:
                return utils.reject('actiontag ' + actionTagForm.key + ' table not valid');
        }

        const deleteSql = 'DELETE FROM ' + joinTableName + ' ' +
            'WHERE ' + joinTableName + '.p_id IN (SELECT playlist.p_id FROM playlist WHERE p_name IN ("' + playlistKey + '"))' +
            ' AND ' + idName + ' = "' + id + '"';
        const insertSql = 'INSERT INTO ' + joinTableName + ' (p_id, ' + idName + ')' +
            ' SELECT playlist.p_id AS p_id, "' + id + '" AS ' + idName + ' FROM playlist WHERE p_name = ("' + playlistKey + '")';
        let updateSql = 'UPDATE ' + baseTableName + ' SET ' + rateName + '=GREATEST(COALESCE(' + rateName + ', 0), ' + ratePersGesamt + '),' +
            ' ' + rateNameMotive + '=GREATEST(COALESCE(' + rateNameMotive + ', 0), ' + ratePersMotive + '),' +
            ' ' + rateNameWichtigkeit + '=GREATEST(COALESCE(' + rateNameWichtigkeit + ', 0), ' + ratePersWichtigkeit + ')' +
            '  WHERE ' + idName + ' = "' + id + '"';
        updateSql = this.sqlQueryBuilder.transformToSqlDialect(updateSql, this.config.knexOpts.client);

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const rawDelete = sqlBuilder.raw(deleteSql);
        const result = new Promise((resolve, reject) => {
            rawDelete.then(function doneDelete(dbresults: any) {
                if (actionTagForm.payload.set) {
                    return sqlBuilder.raw(insertSql).then(function doneInsert() {
                        return sqlBuilder.raw(updateSql);
                    }).catch(function errorPlaylist(reason) {
                        console.error('_doActionTag update ' + baseTableName + ' failed:', reason);
                        return reject(reason);
                    });
                }

                return resolve(true);
            }).then(function doneInsert(dbresults: any) {
                return resolve(true);
            }).catch(function errorPlaylist(reason) {
                console.error('_doActionTag delete/insert ' + joinTableName + ' failed:', reason);
                return reject(reason);
            });
        });

        return result;
    }

    public executeActionTagObjects(table: string, id: number, actionTagForm: ActionTagForm, opts: any): Promise<any> {
        opts = opts || {};

        if (!utils.isInteger(id)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' id not an integer');
        }
        if (actionTagForm.payload === undefined) {
            return utils.reject('actiontag ' + actionTagForm.key + ' playload expected');
        }
        const objectKey = actionTagForm.payload['objectkey'];
        if (!this.keywordValidationRule.isValid(objectKey)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' objectkey not valid');
        }
        let baseTableName;
        let joinTableName;
        let idName;
        let typeName;
        switch (table) {
            case 'image':
                baseTableName = 'image';
                joinTableName = 'image_object';
                idName = 'i_id';
                typeName = 'io_obj_type';
                break;
            case 'video':
                baseTableName = 'video';
                joinTableName = 'video_object';
                idName = 'v_id';
                typeName = 'vo_obj_type';
                break;
            default:
                return utils.reject('actiontag ' + actionTagForm.key + ' table not valid');
        }

        const deleteSql = 'DELETE FROM ' + joinTableName + ' ' +
            'WHERE ' + joinTableName + '.' + typeName + ' IN (SELECT objects.o_key FROM objects WHERE o_name IN ("' + objectKey + '"))' +
            ' AND ' + idName + ' = "' + id + '"';
        const insertSql = 'INSERT INTO ' + joinTableName + ' (' + typeName + ', ' + idName + ')' +
            ' SELECT objects.o_key AS ' + typeName + ', "' + id + '" AS ' + idName + ' FROM objects WHERE o_name = ("' + objectKey + '")';

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const rawDelete = sqlBuilder.raw(deleteSql);
        const result = new Promise((resolve, reject) => {
            rawDelete.then(function doneDelete(dbresults: any) {
                if (actionTagForm.payload.set) {
                    return sqlBuilder.raw(insertSql);
                }

                return resolve(true);
            }).then(function doneInsert(dbresults: any) {
                return resolve(true);
            }).catch(function errorPlaylist(reason) {
                console.error('_doActionTag delete/insert ' + joinTableName + ' failed:', reason);
                return reject(reason);
            });
        });

        return result;
    }

    public executeActionTagPersRate(table: string, id: number, actionTagForm: ActionTagForm, opts: any): Promise<any> {
        opts = opts || {};

        if (!utils.isInteger(id)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' id not an integer');
        }
        if (actionTagForm.payload === undefined) {
            return utils.reject('actiontag ' + actionTagForm.key + ' playload expected');
        }

        const rateKey = actionTagForm.payload['ratekey'];
        if (!this.keywordValidationRule.isValid(rateKey)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' ratekey not valid');
        }

        let baseTableName;
        let idName;
        let rateName;
        let rateNameMotive;
        let rateNameWichtigkeit;
        switch (table) {
            case 'image':
                baseTableName = 'image';
                idName = 'i_id';
                rateName = 'i_rate';
                rateNameMotive = 'i_rate_motive';
                rateNameWichtigkeit = 'i_rate_wichtigkeit';
                break;
            case 'video':
                baseTableName = 'video';
                idName = 'v_id';
                rateName = 'v_rate';
                rateNameMotive = 'v_rate_motive';
                rateNameWichtigkeit = 'v_rate_wichtigkeit';
                break;
            default:
                return utils.reject('actiontag ' + actionTagForm.key + ' table not valid');
        }

        let fieldName;
        switch (rateKey) {
            case 'gesamt':
                fieldName = rateName;
                break;
            case 'motive':
                fieldName = rateNameMotive;
                break;
            case 'wichtigkeit':
                fieldName = rateNameWichtigkeit;
                break;
            default:
                return utils.reject('actiontag ' + actionTagForm.key + ' ratekey not valid');
        }
        const ratePers = actionTagForm.payload['value'] || 0;
        if (!this.rateValidationRule.isValid(ratePers)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' ratePers not valid');
        }

        let updateSql = 'UPDATE ' + baseTableName + ' SET ' + fieldName + '=GREATEST(COALESCE(' + fieldName + ', 0), ' + ratePers + ')' +
            ', ' + rateName + '=GREATEST(COALESCE(' + rateNameMotive + ', 0), COALESCE(' + rateNameWichtigkeit + ', 0), ' + ratePers + ')' +
            '  WHERE ' + idName + ' = "' + id + '"';
        updateSql = this.sqlQueryBuilder.transformToSqlDialect(updateSql, this.config.knexOpts.client);

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const rawUpdate = sqlBuilder.raw(updateSql);
        const result = new Promise((resolve, reject) => {
            rawUpdate.then(function doneDelete(dbresults: any) {
                return resolve(true);
            }).catch(function errorPlaylist(reason) {
                console.error('_doActionTag update ' + baseTableName + ' persRate failed:', reason);
                return reject(reason);
            });
        });

        return result;
    }

    public executeActionTagBlock(table: string, id: number, actionTagForm: ActionTagForm, opts: any): Promise<any> {
        opts = opts || {};

        if (!utils.isInteger(id)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' id not an integer');
        }
        if (actionTagForm.payload === undefined) {
            return utils.reject('actiontag ' + actionTagForm.key + ' playload expected');
        }

        let fieldName;
        let tableName;
        let idName;
        switch (table) {
            case 'image':
                fieldName = 'i_gesperrt';
                tableName = 'image';
                idName = 'i_id';
                break;
            case 'video':
                fieldName = 'v_gesperrt';
                tableName = 'video';
                idName = 'v_id';
                break;
            case 'track':
                fieldName = 'k_gesperrt';
                tableName = 'kategorie';
                idName = 'k_id';
                break;
            default:
                return utils.reject('actiontag ' + actionTagForm.key + ' table not valid');
        }
        const value = actionTagForm.payload.set ? 1 : 0;

        let updateSql = 'UPDATE ' + tableName + ' SET ' + fieldName + '=' + value +
            '  WHERE ' + idName + ' = "' + id + '"';
        updateSql = this.sqlQueryBuilder.transformToSqlDialect(updateSql, this.config.knexOpts.client);

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const rawUpdate = sqlBuilder.raw(updateSql);
        const result = new Promise((resolve, reject) => {
            rawUpdate.then(function doneDelete(dbresults: any) {
                return resolve(true);
            }).catch(function errorPlaylist(reason) {
                console.error('_doActionTag update ' + tableName + ' blocked failed:', reason);
                return reject(reason);
            });
        });

        return result;
    }
}
