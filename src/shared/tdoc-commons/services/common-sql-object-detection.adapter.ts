import {utils} from 'js-data';
import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {ObjectDetectionState} from '@dps/mycms-commons/dist/commons/model/objectdetection-model';
import {LogUtils} from '@dps/mycms-commons/dist/commons/utils/log.utils';
import {StringUtils} from '@dps/mycms-commons/dist/commons/utils/string.utils';
import {KeywordValidationRule, NumberValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {ObjectDetectionModelConfigType} from './common-sql-object-detection.model';


export class CommonSqlObjectDetectionAdapter {
    protected readonly config: any;
    protected readonly knex: any;
    protected readonly sqlQueryBuilder: SqlQueryBuilder;
    private readonly objectDetectionModelConfig: ObjectDetectionModelConfigType;
    private readonly keywordValidationRule = new KeywordValidationRule(true);
    private readonly precisionValidationRule = new NumberValidationRule(true, 0, 1, 1);

    constructor(config: any, knex: any, sqlQueryBuilder: SqlQueryBuilder, objectDetectionModelConfig: ObjectDetectionModelConfigType) {
        this.config = config;
        this.knex = knex;
        this.sqlQueryBuilder = sqlQueryBuilder;
        this.objectDetectionModelConfig = objectDetectionModelConfig;
    }

    protected transformToSqlDialect(sql: string): string {
        const client = this.knex.client['config']['client'];
        if (client === 'sqlite3') {
            sql = sql.replace(/ FROM dual /g, ' ');
        }
        return this.sqlQueryBuilder.transformToSqlDialect(sql, client);
    }

    public setObjects(table: string, id: number, objectKey: string, precision: number, detector: string, set: boolean,
                      opts: any): Promise<any> {
        const objectKeys = StringUtils.uniqueKeywords(objectKey);
        const config = this.objectDetectionModelConfig.detectionTables[table];
        if (config === undefined) {
            return utils.reject('unknown table: ' + LogUtils.sanitizeLogMsg(table));
        }

        opts = opts || {};

        if (!utils.isInteger(id)) {
            return utils.reject('actiontag ObjectsKey ' + table + ' id not an integer');
        }
        if (!this.keywordValidationRule.isValid(objectKey)) {
            return utils.reject('actiontag ObjectsKey ' + table + ' objectkey not valid');
        }
        if (!this.keywordValidationRule.isValid(detector)) {
            return utils.reject('actiontag ObjectsKey ' + table + ' detector not valid');
        }
        if (!this.precisionValidationRule.isValid(precision)) {
            return utils.reject('actiontag ObjectsKey ' + table + ' precision not valid');
        }

        const deleteSql = 'DELETE FROM ' + config.detectedTable + ' ' +
            ' WHERE ' + config.detectedTable + '.' + config.detectedFieldKey + ' IN (' +
            '    SELECT ' + this.objectDetectionModelConfig.objectTable.fieldKey +
            '    FROM ' + this.objectDetectionModelConfig.objectTable.table +
            '    WHERE ' + this.objectDetectionModelConfig.objectTable.fieldName + ' IN ("' + objectKeys.join('", "') + '"))' +
            ' AND ' + config.baseFieldId + ' = "' + id + '"';
        const insertSql = 'INSERT INTO ' + config.detectedTable + ' (' +
            [config.detectedFieldKey, config.baseFieldId, config.detectedFieldPrecision, config.detectedFieldDetector,
                config.detectedFieldState].join(', ') + ')' +
            ' SELECT objects.o_key AS ' + config.detectedFieldKey + ',' +
            ' "' + id + '" AS ' + config.baseFieldId + ',' +
            ' "' + precision + '" AS ' + config.detectedFieldPrecision + ',' +
            ' "' + detector + '" AS ' + config.detectedFieldDetector + ',' +
            ' "' + ObjectDetectionState.DONE_APPROVAL_PROCESSED + '" AS ' + config.detectedFieldState +
            ' FROM objects WHERE o_name = ("' + objectKeys.join('", "') + '")';
        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const rawDelete = sqlBuilder.raw(deleteSql);
        const result = new Promise((resolve, reject) => {
            rawDelete.then(() => {
                if (set) {
                    return sqlBuilder.raw(insertSql);
                }

                return utils.resolve(true);
            }).then(() => {
                return resolve(true);
            }).catch(function errorPlaylist(reason) {
                console.error('_doActionTag delete/insert ObjectsKey ' + table + ' failed:', reason);
                return reject(reason);
            });
        });

        return result;
    }

    public setObjectsState(table: string, id: number, state: string, opts: any): Promise<any> {
        const config = this.objectDetectionModelConfig.detectionTables[table];
        if (config === undefined) {
            return utils.reject('unknown table: ' + LogUtils.sanitizeLogMsg(table));
        }

        opts = opts || {};

        if (!utils.isInteger(id)) {
            return utils.reject('actiontag ObjectsState ' + table + ' id not an integer');
        }
        if (!this.keywordValidationRule.isValid(state)) {
            return utils.reject('actiontag ObjectsState ' + table + ' state not valid');
        }

        let updateSql = 'UPDATE ' + config.detectedTable + ' SET ' + config.detectedFieldState + '="' + state + '"' +
            '  WHERE ' + config.baseFieldId + ' = "' + id + '"';
        updateSql = this.sqlQueryBuilder.transformToSqlDialect(updateSql, this.config.knexOpts.client);

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const rawUpdate = sqlBuilder.raw(updateSql);
        const result = new Promise((resolve, reject) => {
            rawUpdate.then(() => {
                return resolve(true);
            }).catch(function errorPlaylist(reason) {
                console.error('_doActionTag update ObjectsState ' + table + ' failed:', reason);
                return reject(reason);
            });
        });

        return result;
    }

    public updateObjectsKey(table: string, id: number, detector: string, objectkey: string, objectname: string,
                            objectcategory: string, action: string, state: string, opts: any): Promise<any> {
        const config = this.objectDetectionModelConfig.detectedObjectsTables[table];
        if (config === undefined) {
            return utils.reject('unknown table: ' + LogUtils.sanitizeLogMsg(table));
        }

        opts = opts || {};

        if (!utils.isInteger(id)) {
            return utils.reject('actiontag updateObjectsKey ' + table + ' id not an integer');
        }
        if (!this.keywordValidationRule.isValid(detector)) {
            return utils.reject('actiontag updateObjectsKey ' + table + ' detector not valid');
        }
        if (!this.keywordValidationRule.isValid(objectkey)) {
            return utils.reject('actiontag updateObjectsKey ' + table + ' objectkey not valid');
        }
        if (!this.keywordValidationRule.isValid(action)) {
            return utils.reject('actiontag updateObjectsKey ' + table + ' action not valid');
        }
        if (!this.keywordValidationRule.isValid(state)) {
            return utils.reject('actiontag updateObjectsKey ' + table + ' state not valid');
        }
        if (state !== ObjectDetectionState.RUNNING_MANUAL_CORRECTED && state !== ObjectDetectionState.RUNNING_MANUAL_DETAILED) {
            return utils.reject('actiontag updateObjectsKey ' + table + ' state not allowed');
        }

        let insertObjectNameSql = '';
        let deleteObjectKeySql = '';
        let insertObjectKeySql = '';
        if (action === 'changeObjectKeyForRecord') {
            // NOOP
        } else if (action === 'changeObjectLabelForObjectKey'
            || action === 'createNewObjectKeyAndObjectLabel'
            || action === 'createObjectLabelForObjectKey') {
            if (!this.keywordValidationRule.isValid(objectname)) {
                return utils.reject('actiontag updateObjectsKey ' + table + ' objectname not valid');
            }

            // update object_key (remove+insert)
            deleteObjectKeySql = 'DELETE FROM ' + this.objectDetectionModelConfig.objectKeyTable.table +
                ' WHERE ' + this.objectDetectionModelConfig.objectKeyTable.fieldDetector + '="' + detector + '" ' +
                ' AND ' + this.objectDetectionModelConfig.objectKeyTable.fieldKey + '="' + objectkey + '"';
            insertObjectKeySql = 'INSERT INTO ' + this.objectDetectionModelConfig.objectKeyTable.table +
                '   (' + [this.objectDetectionModelConfig.objectKeyTable.fieldDetector,
                    this.objectDetectionModelConfig.objectKeyTable.fieldKey,
                    this.objectDetectionModelConfig.objectKeyTable.fieldId].join(', ') + ') ' +
                '   SELECT "' + detector + '",' +
                '          "' + objectkey + '",' +
                '          (SELECT MAX(' + this.objectDetectionModelConfig.objectTable.fieldId + ') AS newId' +
                '           FROM ' + this.objectDetectionModelConfig.objectTable.table +
                '           WHERE ' + this.objectDetectionModelConfig.objectTable.fieldName + '="' + objectname + '") AS newId FROM dual ' +
                '   WHERE NOT EXISTS (' +
                '      SELECT 1 FROM ' + this.objectDetectionModelConfig.objectKeyTable.table +
                '      WHERE ' + this.objectDetectionModelConfig.objectKeyTable.fieldDetector + '="' + detector + '" ' +
                '      AND ' + this.objectDetectionModelConfig.objectKeyTable.fieldKey + '="' + objectkey + '")';

            // insert object_name if not exists
            if (action === 'createNewObjectKeyAndObjectLabel' || action === 'createObjectLabelForObjectKey') {
                if (!this.keywordValidationRule.isValid(objectcategory)) {
                    return utils.reject('actiontag updateObjectsKey ' + table + ' objectcategory not valid');
                }
                insertObjectNameSql = 'INSERT INTO ' + this.objectDetectionModelConfig.objectTable.table +
                    ' (' + [this.objectDetectionModelConfig.objectTable.fieldName,
                        this.objectDetectionModelConfig.objectTable.fieldPicasaKey,
                        this.objectDetectionModelConfig.objectTable.fieldKey,
                        this.objectDetectionModelConfig.objectTable.fieldCategory].join(', ') + ')' +
                    ' SELECT "' + objectname + '", "' + objectkey + '", "' + objectkey + '", "' + objectcategory + '" FROM dual ' +
                    '  WHERE NOT EXISTS (SELECT 1 FROM ' + this.objectDetectionModelConfig.objectTable.table +
                    '                    WHERE ' + this.objectDetectionModelConfig.objectTable.fieldName + '="' + objectname + '")';
            }
        } else {
            return utils.reject('actiontag updateObjectsKey ' + table + ' action unknown');
        }

        let updateImageObjectObjectKeySql = 'UPDATE ' + config.table +
            '  SET ' + config.fieldKey + '="' + objectkey + '", ' + config.fieldState + '="' + state + '"' +
            '  WHERE ' + config.fieldId + ' = "' + id + '"';
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
            sqlBuilder.raw(updateImageObjectObjectKeySql).then(() => {
                if (insertObjectNameSql) {
                    return sqlBuilder.raw(insertObjectNameSql);
                }
                return utils.resolve(true);
            }).then(() => {
                if (deleteObjectKeySql) {
                    return sqlBuilder.raw(deleteObjectKeySql);
                }
                return utils.resolve(true);
            }).then(() => {
                if (insertObjectKeySql) {
                    return sqlBuilder.raw(insertObjectKeySql);
                }
                return utils.resolve(true);
            }).then(() => {
                return resolve(true);
            }).catch(function errorPlaylist(reason) {
                console.error('_doActionTag update updateObjectsKey ' + table + ' odobjectkey failed:', reason);
                return reject(reason);
            });
        });
    }
}
