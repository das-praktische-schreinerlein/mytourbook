import {ActionTagForm} from '../../commons/utils/actiontag.utils';
import {KeywordValidationRule, NumberValidationRule} from '../../search-commons/model/forms/generic-validator.util';
import {utils} from 'js-data';

export class SDocSqlMediadbActionTagAdapter {

    private keywordValidationRule = new KeywordValidationRule(true);
    private rateValidationRule = new NumberValidationRule(true, 0, 15, 0);
    private config: any;
    private knex: any;

    constructor(config: any, knex: any) {
        this.config = config;
        this.knex = knex;
    }

    public executeActionTagImagePlaylist(id: string, actionTagForm: ActionTagForm, opts: any): Promise<any> {
        opts = opts || {};

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
            'WHERE image_playlist.p_id IN (SELECT playlist.p_id FROM playlist WHERE p_name in ("' + playlistKey + '"))' +
            ' AND i_id = "' + id + '"';
        const insertSql = 'INSERT INTO image_playlist (p_id, i_id)' +
            ' SELECT playlist.p_id AS p_id, "' + id + '" as i_id FROM playlist WHERE p_name = ("' + playlistKey + '")';
        const updateSql = 'UPDATE image SET i_rate=max(coalesce(i_rate, 0), ' + ratePersGesamt + '),' +
            ' i_rate_motive=max(coalesce(i_rate_motive, 0), ' + ratePersMotive + '),' +
            ' i_rate_wichtigkeit=max(coalesce(i_rate_wichtigkeit, 0), ' + ratePersWichtigkeit + ')' +
            '  WHERE i_id = "' + id + '"';

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

    public executeActionTagImageObjects(id: string, actionTagForm: ActionTagForm, opts: any): Promise<any> {
        opts = opts || {};

        if (actionTagForm.payload === undefined) {
            return utils.reject('actiontag ' + actionTagForm.key + ' playload expected');
        }
        const objectKey = actionTagForm.payload['objectkey'];
        if (!this.keywordValidationRule.isValid(objectKey)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' objectkey not valid');
        }

        const deleteSql = 'DELETE FROM image_object ' +
            'WHERE image_object.io_obj_type IN (SELECT objects.o_key FROM objects WHERE o_name in ("' + objectKey + '"))' +
            ' AND i_id = "' + id + '"';
        const insertSql = 'INSERT INTO image_object (io_obj_type, i_id)' +
            ' SELECT objects.o_key AS io_obj_type, "' + id + '" as i_id FROM objects WHERE o_name = ("' + objectKey + '")';

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

    public executeActionTagImagePersRate(id: string, actionTagForm: ActionTagForm, opts: any): Promise<any> {
        opts = opts || {};

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

        const updateSql = 'UPDATE image SET ' + fieldName + '=max(coalesce(' + fieldName + ', 0), ' + ratePers + ')' +
            ', i_rate=max(coalesce(i_rate_motive, 0), coalesce(i_rate_wichtigkeit, 0), ' + ratePers + ')' +
            '  WHERE i_id = "' + id + '"';

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
