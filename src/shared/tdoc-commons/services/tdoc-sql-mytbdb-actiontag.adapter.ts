import {ActionTagForm} from '@dps/mycms-commons/dist/commons/utils/actiontag.utils';
import {KeywordValidationRule, NumberValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {utils} from 'js-data';
import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {StringUtils} from '@dps/mycms-commons/dist/commons/utils/string.utils';
import {ObjectDetectionState} from '@dps/mycms-commons/dist/commons/model/objectdetection-model';

export class TourDocSqlMytbDbActionTagAdapter {

    private readonly keywordValidationRule = new KeywordValidationRule(true);
    private readonly rateValidationRule = new NumberValidationRule(true, -1, 15, 0);
    private readonly precisionValidationRule = new NumberValidationRule(true, 0, 1, 1);
    private readonly config: any;
    private readonly knex: any;
    private readonly sqlQueryBuilder: SqlQueryBuilder;

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
        const playlistKeys = StringUtils.uniqueKeywords(playlistKey);

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
            'WHERE ' + joinTableName + '.p_id IN (SELECT playlist.p_id FROM playlist WHERE p_name IN ("' + playlistKeys.join('", "') + '"))' +
            ' AND ' + idName + ' = "' + id + '"';
        const insertSql = 'INSERT INTO ' + joinTableName + ' (p_id, ' + idName + ')' +
            ' SELECT playlist.p_id AS p_id, "' + id + '" AS ' + idName + ' FROM playlist WHERE p_name IN ("' + playlistKeys.join('", "') + '")';
        let updateSql = 'UPDATE ' + baseTableName + ' SET ' + rateName + '=GREATEST(COALESCE(' + rateName + ', 0), ' + ratePersGesamt + '),' +
            ' ' + rateNameMotive + '=GREATEST(COALESCE(' + rateNameMotive + ', 0), ' + ratePersMotive + '),' +
            ' ' + rateNameWichtigkeit + '=GREATEST(COALESCE(' + rateNameWichtigkeit + ', 0), ' + ratePersWichtigkeit + ')' +
            '  WHERE ' + idName + ' = "' + id + '"';
        updateSql = this.sqlQueryBuilder.transformToSqlDialect(updateSql, this.config.knexOpts.client);

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const rawDelete = sqlBuilder.raw(deleteSql);
        const result = new Promise((resolve, reject) => {
            rawDelete.then(dbresults => {
                if (actionTagForm.payload.set) {
                    return sqlBuilder.raw(insertSql).then(dbResult => {
                        return sqlBuilder.raw(updateSql);
                    }).catch(function errorPlaylist(reason) {
                        console.error('_doActionTag update ' + baseTableName + ' failed:', reason);
                        return utils.reject(reason);
                    });
                }

                return utils.resolve(true);
            }).then(dbresults => {
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
        const precision = actionTagForm.payload['precision'] || 1;
        const detector = actionTagForm.payload['detector'] || 'playlist';

        if (!this.keywordValidationRule.isValid(objectKey)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' objectkey not valid');
        }
        if (!this.keywordValidationRule.isValid(detector)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' detector not valid');
        }
        if (!this.precisionValidationRule.isValid(precision)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' precision not valid');
        }

        const objectKeys = StringUtils.uniqueKeywords(objectKey);

        let baseTableName;
        let joinTableName;
        let idName;
        let typeName;
        let stateName;
        let detectorName;
        let precisionName;
        switch (table) {
            case 'image':
                baseTableName = 'image';
                joinTableName = 'image_object';
                idName = 'i_id';
                typeName = 'io_obj_type';
                precisionName = 'io_precision';
                stateName = 'io_state';
                detectorName = 'io_detector';
                break;
            case 'video':
                baseTableName = 'video';
                joinTableName = 'video_object';
                idName = 'v_id';
                typeName = 'vo_obj_type';
                precisionName = 'vo_precision';
                stateName = 'vo_state';
                detectorName = 'vo_detector';
                break;
            default:
                return utils.reject('actiontag ' + actionTagForm.key + ' table not valid');
        }

        const deleteSql = 'DELETE FROM ' + joinTableName + ' ' +
            'WHERE ' + joinTableName + '.' + typeName + ' IN (SELECT objects.o_key FROM objects WHERE o_name IN ("' + objectKeys.join('", "') + '"))' +
            ' AND ' + idName + ' = "' + id + '"';
        const insertSql = 'INSERT INTO ' + joinTableName + ' (' +
            typeName + ', ' + idName + ', ' + precisionName + ', ' + detectorName +  ', ' + stateName + ')' +
            ' SELECT objects.o_key AS ' + typeName + ',' +
            ' "' + id + '" AS ' + idName + ',' +
            ' "' + precision + '" AS ' + precisionName + ',' +
            ' "' + detector + '" AS ' + detectorName + ',' +
            ' "' + ObjectDetectionState.DONE_APPROVAL_PROCESSED + '" AS ' + stateName +
            ' FROM objects WHERE o_name = ("' + objectKeys.join('", "') + '")';
        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const rawDelete = sqlBuilder.raw(deleteSql);
        const result = new Promise((resolve, reject) => {
            rawDelete.then(dbresults => {
                if (actionTagForm.payload.set) {
                    return sqlBuilder.raw(insertSql);
                }

                return utils.resolve(true);
            }).then(dbresults => {
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

        let updateSql = 'UPDATE ' + baseTableName + ' SET ' + fieldName + '=GREATEST(COALESCE(' + fieldName + ', -1), ' + ratePers + ')' +
            ', ' + rateName + '=GREATEST(COALESCE(' + rateNameMotive + ', -1), COALESCE(' + rateNameWichtigkeit + ', -1), ' + ratePers + ')' +
            '  WHERE ' + idName + ' = "' + id + '"';
        updateSql = this.sqlQueryBuilder.transformToSqlDialect(updateSql, this.config.knexOpts.client);

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const rawUpdate = sqlBuilder.raw(updateSql);
        const result = new Promise((resolve, reject) => {
            rawUpdate.then(dbresults => {
                return resolve(true);
            }).catch(function errorPlaylist(reason) {
                console.error('_doActionTag update ' + baseTableName + ' persRate failed:', reason);
                return reject(reason);
            });
        });

        return result;
    }

    public executeActionTagObjectsState(table: string, id: number, actionTagForm: ActionTagForm, opts: any): Promise<any> {
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
            case 'odimgobject':
                fieldName = 'io_state';
                tableName = 'image_object';
                idName = 'io_id';
                break;
            default:
                return utils.reject('actiontag ' + actionTagForm.key + ' table not valid');
        }
        const value = actionTagForm.payload['state'];
        if (!this.keywordValidationRule.isValid(value)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' state not valid');
        }

        let updateSql = 'UPDATE ' + tableName + ' SET ' + fieldName + '="' + value + '"' +
            '  WHERE ' + idName + ' = "' + id + '"';
        updateSql = this.sqlQueryBuilder.transformToSqlDialect(updateSql, this.config.knexOpts.client);

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const rawUpdate = sqlBuilder.raw(updateSql);
        const result = new Promise((resolve, reject) => {
            rawUpdate.then(dbresults => {
                return resolve(true);
            }).catch(function errorPlaylist(reason) {
                console.error('_doActionTag update ' + tableName + ' odobjectstate failed:', reason);
                return reject(reason);
            });
        });

        return result;
    }

    public executeActionTagObjectsKey(table: string, id: number, actionTagForm: ActionTagForm, opts: any): Promise<any> {
        opts = opts || {};

        if (!utils.isInteger(id)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' id not an integer');
        }
        if (actionTagForm.payload === undefined) {
            return utils.reject('actiontag ' + actionTagForm.key + ' playload expected');
        }

        let codeFieldName;
        let tableName;
        let idName;
        let stateName;
        switch (table) {
            case 'odimgobject':
                codeFieldName = 'io_obj_type';
                tableName = 'image_object';
                idName = 'io_id';
                stateName = 'io_state';
                break;
            default:
                return utils.reject('actiontag ' + actionTagForm.key + ' table not valid');
        }
        const detector = actionTagForm.payload['detector'];
        if (!this.keywordValidationRule.isValid(detector)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' detector not valid');
        }
        const objectkey = actionTagForm.payload['objectkey'];
        if (!this.keywordValidationRule.isValid(objectkey)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' objectkey not valid');
        }
        const action = actionTagForm.payload['action'];
        if (!this.keywordValidationRule.isValid(action)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' action not valid');
        }
        const state = actionTagForm.payload['state'];
        if (!this.keywordValidationRule.isValid(state)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' state not valid');
        }
        if (state !== ObjectDetectionState.RUNNING_MANUAL_CORRECTED && state !== ObjectDetectionState.RUNNING_MANUAL_DETAILED) {
            return utils.reject('actiontag ' + actionTagForm.key + ' state not allowed');
        }

        let insertObjectNameSql = '';
        let deleteObjectKeySql = '';
        let insertObjectKeySql = '';
        if (action === 'changeObjectKeyForRecord') {
            // NOOP
        } else if (action === 'changeObjectLabelForObjectKey'
            || action === 'createNewObjectKeyAndObjectLabel'
            || action === 'createObjectLabelForObjectKey') {
            const objectname = actionTagForm.payload['objectname'];
            if (!this.keywordValidationRule.isValid(objectname)) {
                return utils.reject('actiontag ' + actionTagForm.key + ' objectname not valid');
            }

            // update object_key (remove+insert)
            deleteObjectKeySql = 'DELETE FROM objects_key WHERE ok_detector="' + detector + '" ' +
                '                                      AND ok_key="' + objectkey + '"';
            insertObjectKeySql = 'INSERT INTO objects_key(ok_detector, ok_key, o_id) ' +
                '   SELECT "' + detector + '",' +
                '          "' + objectkey + '",' +
                '          (SELECT MAX(o_id) AS newId FROM objects WHERE o_name="' + objectname + '") AS o_id FROM dual ' +
                '   WHERE NOT EXISTS (' +
                '      SELECT 1 FROM objects_key WHERE ok_detector="' + detector + '" ' +
                '                                      AND ok_key="' + objectkey + '")';

            // insert object_name if not exists
            if (action === 'createNewObjectKeyAndObjectLabel' || action === 'createObjectLabelForObjectKey') {
                const objectcategory = actionTagForm.payload['objectcategory'];
                if (!this.keywordValidationRule.isValid(objectcategory)) {
                    return utils.reject('actiontag ' + actionTagForm.key + ' objectcategory not valid');
                }
                insertObjectNameSql = 'INSERT INTO objects (o_name, o_picasa_key, o_key, o_category)' +
                    ' SELECT "' + objectname + '", "' + objectkey + '", "' + objectkey + '", "' + objectcategory + '" FROM dual ' +
                    '  WHERE NOT EXISTS (SELECT 1 FROM objects WHERE o_name="' + objectname + '")';
            }
        } else {
            return utils.reject('actiontag ' + actionTagForm.key + ' action unknown');
        }

        let updateImageObjectObjectKeySql = 'UPDATE ' + tableName +
            '  SET ' + codeFieldName + '="' + objectkey + '", ' + stateName + '="' + state + '"' +
            '  WHERE ' + idName + ' = "' + id + '"';
        updateImageObjectObjectKeySql = this.sqlQueryBuilder.transformToSqlDialect(updateImageObjectObjectKeySql,
            this.config.knexOpts.client);
        if (insertObjectNameSql) {
            insertObjectNameSql = this.sqlQueryBuilder.transformToSqlDialect(insertObjectNameSql, this.config.knexOpts.client);
        }
        if (deleteObjectKeySql) {
            deleteObjectKeySql = this.sqlQueryBuilder.transformToSqlDialect(deleteObjectKeySql, this.config.knexOpts.client);
        }
        if (insertObjectKeySql) {
            insertObjectKeySql = this.sqlQueryBuilder.transformToSqlDialect(insertObjectKeySql, this.config.knexOpts.client);
        }

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        return new Promise((resolve, reject) => {
            sqlBuilder.raw(updateImageObjectObjectKeySql).then(dbresults => {
                if (insertObjectNameSql) {
                    return sqlBuilder.raw(insertObjectNameSql);
                }
                return utils.resolve(true);
            }).then(dbresults => {
                if (deleteObjectKeySql) {
                    return sqlBuilder.raw(deleteObjectKeySql);
                }
                return utils.resolve(true);
            }).then(dbresults => {
                if (insertObjectKeySql) {
                    return sqlBuilder.raw(insertObjectKeySql);
                }
                return utils.resolve(true);
            }).then(dbresults => {
                return resolve(true);
            }).catch(function errorPlaylist(reason) {
                console.error('_doActionTag update ' + tableName + ' odobjectkey failed:', reason);
                return reject(reason);
            });
        });
    }

}
