import {ActionTagForm} from '../../commons/utils/actiontag.utils';
import {KeywordValidationRule, NumberValidationRule} from '../../search-commons/model/forms/generic-validator.util';
import {utils} from 'js-data';
import {SqlQueryBuilder} from '../../search-commons/services/sql-query.builder';

export class SDocSqlMediadbActionTagAdapter {

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

    public executeActionTagImagePlaylist(id: number, actionTagForm: ActionTagForm, opts: any): Promise<any> {
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

        const ratePersGesamt = actionTagForm.payload['sdocratepers.gesamt'] || 0;
        if (!this.rateValidationRule.isValid(ratePersGesamt)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' ratePersGesamt not valid');
        }
        const ratePersMotive = actionTagForm.payload['sdocratepers.motive'] || 0;
        if (!this.rateValidationRule.isValid(ratePersMotive)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' ratePersMotive not valid');
        }
        const ratePersWichtigkeit = actionTagForm.payload['sdocratepers.wichtigkeit'] || 0;
        if (!this.rateValidationRule.isValid(ratePersWichtigkeit)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' ratePersWichtigkeit not valid');
        }

        const deleteSql = 'DELETE FROM image_playlist ' +
            'WHERE image_playlist.p_id IN (SELECT playlist.p_id FROM playlist WHERE p_name IN ("' + playlistKey + '"))' +
            ' AND i_id = "' + id + '"';
        const insertSql = 'INSERT INTO image_playlist (p_id, i_id)' +
            ' SELECT playlist.p_id AS p_id, "' + id + '" AS i_id FROM playlist WHERE p_name = ("' + playlistKey + '")';
        let updateSql = 'UPDATE image SET i_rate=GREATEST(COALESCE(i_rate, 0), ' + ratePersGesamt + '),' +
            ' i_rate_motive=GREATEST(COALESCE(i_rate_motive, 0), ' + ratePersMotive + '),' +
            ' i_rate_wichtigkeit=GREATEST(COALESCE(i_rate_wichtigkeit, 0), ' + ratePersWichtigkeit + ')' +
            '  WHERE i_id = "' + id + '"';
        updateSql = this.sqlQueryBuilder.transformToSqlDialect(updateSql, this.config.knexOpts.client);

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const rawDelete = sqlBuilder.raw(deleteSql);
        const result = new Promise((resolve, reject) => {
            rawDelete.then(function doneDelete(dbresults: any) {
                if (actionTagForm.payload.set) {
                    return sqlBuilder.raw(insertSql).then(function doneInsert() {
                        return sqlBuilder.raw(updateSql);
                    }).catch(function errorPlaylist(reason) {
                        console.error('_doActionTag update image failed:', reason);
                        return reject(reason);
                    });
                }

                return resolve(true);
            }).then(function doneInsert(dbresults: any) {
                return resolve(true);
            }).catch(function errorPlaylist(reason) {
                console.error('_doActionTag delete/insert image_playlist failed:', reason);
                return reject(reason);
            });
        });

        return result;
    }

    public executeActionTagImageObjects(id: number, actionTagForm: ActionTagForm, opts: any): Promise<any> {
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

        const deleteSql = 'DELETE FROM image_object ' +
            'WHERE image_object.io_obj_type IN (SELECT objects.o_key FROM objects WHERE o_name IN ("' + objectKey + '"))' +
            ' AND i_id = "' + id + '"';
        const insertSql = 'INSERT INTO image_object (io_obj_type, i_id)' +
            ' SELECT objects.o_key AS io_obj_type, "' + id + '" AS i_id FROM objects WHERE o_name = ("' + objectKey + '")';

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
                console.error('_doActionTag delete/insert image_object failed:', reason);
                return reject(reason);
            });
        });

        return result;
    }

    public executeActionTagImagePersRate(id: number, actionTagForm: ActionTagForm, opts: any): Promise<any> {
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
        let fieldName;
        switch (rateKey) {
            case 'gesamt':
                fieldName = 'i_rate';
                break;
            case 'motive':
                fieldName = 'i_rate_motive';
                break;
            case 'wichtigkeit':
                fieldName = 'i_rate_wichtigkeit';
                break;
            default:
                return utils.reject('actiontag ' + actionTagForm.key + ' ratekey not valid');
        }
        const ratePers = actionTagForm.payload['value'] || 0;
        if (!this.rateValidationRule.isValid(ratePers)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' ratePers not valid');
        }

        let updateSql = 'UPDATE image SET ' + fieldName + '=GREATEST(COALESCE(' + fieldName + ', 0), ' + ratePers + ')' +
            ', i_rate=GREATEST(COALESCE(i_rate_motive, 0), COALESCE(i_rate_wichtigkeit, 0), ' + ratePers + ')' +
            '  WHERE i_id = "' + id + '"';
        updateSql = this.sqlQueryBuilder.transformToSqlDialect(updateSql, this.config.knexOpts.client);

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const rawUpdate = sqlBuilder.raw(updateSql);
        const result = new Promise((resolve, reject) => {
            rawUpdate.then(function doneDelete(dbresults: any) {
                return resolve(true);
            }).catch(function errorPlaylist(reason) {
                console.error('_doActionTag update image persRate failed:', reason);
                return reject(reason);
            });
        });

        return result;
    }
}
