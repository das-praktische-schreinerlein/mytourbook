import {utils} from 'js-data';
import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {ObjectDetectionState} from '@dps/mycms-commons/dist/commons/model/objectdetection-model';
import {LogUtils} from '@dps/mycms-commons/dist/commons/utils/log.utils';
import {StringUtils} from '@dps/mycms-commons/dist/commons/utils/string.utils';
import {KeywordValidationRule, NumberValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {ObjectDetectionModelConfigType} from './common-sql-object-detection.model';
import {RawSqlQueryData, SqlUtils} from '@dps/mycms-commons/dist/search-commons/services/sql-utils';


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

        const deleteSqlQuery: RawSqlQueryData = {
            sql: 'DELETE FROM ' + config.detectedTable + ' ' +
                ' WHERE ' + config.detectedTable + '.' + config.detectedFieldKey + ' IN (' +
                '    SELECT ' + this.objectDetectionModelConfig.objectTable.fieldKey +
                '    FROM ' + this.objectDetectionModelConfig.objectTable.table +
                '    WHERE ' + this.objectDetectionModelConfig.objectTable.fieldName + ' IN (' +
                SqlUtils.mapParametersToPlaceholderString(objectKeys) + '))' +
                ' AND ' + config.baseFieldId + ' = ' + '?' + '',
            parameters: [].concat(objectKeys).concat([id])
        };
        const insertSqlQuery: RawSqlQueryData = {
            sql: 'INSERT INTO ' + config.detectedTable + ' (' +
                [config.detectedFieldKey, config.baseFieldId, config.detectedFieldPrecision, config.detectedFieldDetector,
                    config.detectedFieldState].join(', ') + ')' +
                ' SELECT objects.o_key AS ' + config.detectedFieldKey + ',' +
                ' ' + '?' + ' AS ' + config.baseFieldId + ',' +
                ' ' + '?' + ' AS ' + config.detectedFieldPrecision + ',' +
                ' ' + '?' + ' AS ' + config.detectedFieldDetector + ',' +
                ' ' + '?' + ' AS ' + config.detectedFieldState +
                ' FROM objects WHERE o_name = (' + SqlUtils.mapParametersToPlaceholderString(objectKeys) + ')',
            parameters: [id, precision, detector, ObjectDetectionState.DONE_APPROVAL_PROCESSED].concat(objectKeys)
        };
        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const rawDelete = SqlUtils.executeRawSqlQueryData(sqlBuilder, deleteSqlQuery);
        const result = new Promise((resolve, reject) => {
            rawDelete.then(() => {
                if (set) {
                    return SqlUtils.executeRawSqlQueryData(sqlBuilder, insertSqlQuery);
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

        const updateSqlQuery: RawSqlQueryData = {
            sql: 'UPDATE ' + config.detectedTable + ' SET ' + config.detectedFieldState + '=' + '?' + '' +
                '  WHERE ' + config.baseFieldId + ' = ' + '?' + '',
            parameters: [state, id]
        };
        updateSqlQuery.sql = this.sqlQueryBuilder.transformToSqlDialect(updateSqlQuery.sql, this.config.knexOpts.client);

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const rawUpdate = SqlUtils.executeRawSqlQueryData(sqlBuilder, updateSqlQuery);
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

        let insertObjectNameSqlQuery: RawSqlQueryData;
        let deleteObjectKeySqlQuery: RawSqlQueryData;
        let insertObjectKeySqlQuery: RawSqlQueryData;
        if (action === 'changeObjectKeyForRecord') {
            // NOOP
        } else if (action === 'changeObjectLabelForObjectKey'
            || action === 'createNewObjectKeyAndObjectLabel'
            || action === 'createObjectLabelForObjectKey') {
            if (!this.keywordValidationRule.isValid(objectname)) {
                return utils.reject('actiontag updateObjectsKey ' + table + ' objectname not valid');
            }

            // update object_key (remove+insert)
            deleteObjectKeySqlQuery = {
                sql: 'DELETE FROM ' + this.objectDetectionModelConfig.objectKeyTable.table +
                    ' WHERE ' + this.objectDetectionModelConfig.objectKeyTable.fieldDetector + '=' + '?' + ' ' +
                    ' AND ' + this.objectDetectionModelConfig.objectKeyTable.fieldKey + '=' + '?' + '',
                parameters: [detector, objectkey]
            };
            insertObjectKeySqlQuery = {
                sql: 'INSERT INTO ' + this.objectDetectionModelConfig.objectKeyTable.table +
                    '   (' + [this.objectDetectionModelConfig.objectKeyTable.fieldDetector,
                        this.objectDetectionModelConfig.objectKeyTable.fieldKey,
                        this.objectDetectionModelConfig.objectKeyTable.fieldId].join(', ') + ') ' +
                    '   SELECT ' + '?' + ',' +
                    '          ' + '?' + ',' +
                    '          (SELECT MAX(' + this.objectDetectionModelConfig.objectTable.fieldId + ') AS newId' +
                    '           FROM ' + this.objectDetectionModelConfig.objectTable.table +
                    '           WHERE ' + this.objectDetectionModelConfig.objectTable.fieldName + '=' + '?' + ')' +
                    ' AS newId FROM dual ' +
                    '   WHERE NOT EXISTS (' +
                    '      SELECT 1 FROM ' + this.objectDetectionModelConfig.objectKeyTable.table +
                    '      WHERE ' + this.objectDetectionModelConfig.objectKeyTable.fieldDetector + '=' + '?' + ' ' +
                    '      AND ' + this.objectDetectionModelConfig.objectKeyTable.fieldKey + '=' + '?' + ')',
                parameters: [detector, objectkey, objectname, detector, objectkey]
            };

            // insert object_name if not exists
            if (action === 'createNewObjectKeyAndObjectLabel' || action === 'createObjectLabelForObjectKey') {
                if (!this.keywordValidationRule.isValid(objectcategory)) {
                    return utils.reject('actiontag updateObjectsKey ' + table + ' objectcategory not valid');
                }
                insertObjectNameSqlQuery = {
                    sql: 'INSERT INTO ' + this.objectDetectionModelConfig.objectTable.table +
                        ' (' + [this.objectDetectionModelConfig.objectTable.fieldName,
                            this.objectDetectionModelConfig.objectTable.fieldPicasaKey,
                            this.objectDetectionModelConfig.objectTable.fieldKey,
                            this.objectDetectionModelConfig.objectTable.fieldCategory].join(', ') + ')' +
                        ' SELECT ' + '?' + ', ' + '?' + ', ' + '?' + ', ' + '?' + ' FROM dual ' +
                        '  WHERE NOT EXISTS (SELECT 1 FROM ' + this.objectDetectionModelConfig.objectTable.table +
                        '                    WHERE ' + this.objectDetectionModelConfig.objectTable.fieldName + '=' + '?' + ')',
                    parameters: [objectname, objectkey, objectkey, objectcategory, objectname]
                };
            }
        } else {
            return utils.reject('actiontag updateObjectsKey ' + table + ' action unknown');
        }

        const updateImageObjectObjectKeySqlQuery: RawSqlQueryData = {
            sql: 'UPDATE ' + config.table +
                '  SET ' + config.fieldKey + '=' + '?' + ', ' + config.fieldState + '=' + '?' + '' +
                '  WHERE ' + config.fieldId + ' = ' + '?' + '',
            parameters: [objectkey, state, id]
        };

        updateImageObjectObjectKeySqlQuery.sql = this.sqlQueryBuilder.transformToSqlDialect(updateImageObjectObjectKeySqlQuery.sql,
            this.config.knexOpts.client);
        if (insertObjectNameSqlQuery) {
            insertObjectNameSqlQuery.sql = this.sqlQueryBuilder.transformToSqlDialect(insertObjectNameSqlQuery.sql,
                this.config.knexOpts.client);
        }
        if (deleteObjectKeySqlQuery) {
            deleteObjectKeySqlQuery.sql = this.sqlQueryBuilder.transformToSqlDialect(deleteObjectKeySqlQuery.sql,
                this.config.knexOpts.client);
        }
        if (insertObjectKeySqlQuery) {
            insertObjectKeySqlQuery.sql = this.sqlQueryBuilder.transformToSqlDialect(insertObjectKeySqlQuery.sql,
                this.config.knexOpts.client);
        }

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        return new Promise((resolve, reject) => {
            SqlUtils.executeRawSqlQueryData(sqlBuilder, updateImageObjectObjectKeySqlQuery).then(() => {
                if (insertObjectNameSqlQuery) {
                    return SqlUtils.executeRawSqlQueryData(sqlBuilder, insertObjectNameSqlQuery);
                }
                return utils.resolve(true);
            }).then(() => {
                if (deleteObjectKeySqlQuery) {
                    return SqlUtils.executeRawSqlQueryData(sqlBuilder, deleteObjectKeySqlQuery);
                }
                return utils.resolve(true);
            }).then(() => {
                if (insertObjectKeySqlQuery) {
                    return SqlUtils.executeRawSqlQueryData(sqlBuilder, insertObjectKeySqlQuery);
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
