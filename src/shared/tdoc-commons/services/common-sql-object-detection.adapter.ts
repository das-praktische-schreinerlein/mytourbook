import {utils} from 'js-data';
import {SelectQueryData, SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {
    ObjectDetectionDetectedObjectType,
    ObjectDetectionRequestType,
    ObjectDetectionResponseCode,
    ObjectDetectionResponseType,
    ObjectDetectionState
} from '@dps/mycms-commons/dist/commons/model/objectdetection-model';
import {LogUtils} from '@dps/mycms-commons/dist/commons/utils/log.utils';
import {StringUtils} from '@dps/mycms-commons/dist/commons/utils/string.utils';
import {KeywordValidationRule, NumberValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {
    ObjectDetectionDataStore,
    ObjectDetectionEntityDatastoreConfiguration,
    ObjectDetectionMaxIdPerDetectorType, RequestImageDataType
} from './common-object-detection-datastore';


export interface ObjectDetectionSqlTableConfiguration extends ObjectDetectionEntityDatastoreConfiguration {
    baseTable: string;
    baseFieldFileDir: string;
    baseFieldFileName: string;
    baseFieldFilePath: string;
    baseFieldId: string;
    detailFieldNames: string[];
    id: string;
    detectedFieldDetector: string;
    detectedFieldKey: string;
    detectedFieldPrecision: string;
    detectedFieldState: string;
    detectedTable: string;
    table: string;
}

export interface ObjectDetectionModelObjectTableConfigType {
    fieldCategory: string;
    fieldId: string;
    fieldKey: string;
    fieldName: string;
    fieldPicasaKey: string;
    table: string;
}

export interface ObjectDetectionModelDetectedObjectTableConfigType {
    fieldDetector: string;
    fieldKey: string;
    fieldId: string;
    fieldPrecision: string;
    fieldState: string;
    table: string;
}

export interface ObjectDetectionModelDetectedObjectsTablesConfigType {
    [key: string]: ObjectDetectionModelDetectedObjectTableConfigType;
}

export interface ObjectDetectionModelConfigJoinsType {
    [key: string]: ObjectDetectionSqlTableConfiguration;
}

export interface ObjectDetectionModelObjectKeyTableConfigType {
    fieldId: string;
    fieldKey: string;
    fieldDetector: string;
    table: string;
}

export interface ObjectDetectionModelConfigType {
    objectTable: ObjectDetectionModelObjectTableConfigType;
    objectKeyTable: ObjectDetectionModelObjectKeyTableConfigType;
    detectionTables: ObjectDetectionModelConfigJoinsType;
    detectedObjectsTables: ObjectDetectionModelDetectedObjectsTablesConfigType;
}

export class CommonSqlObjectDetectionAdapter implements ObjectDetectionDataStore {
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

    public getObjectDetectionConfiguration(input: ObjectDetectionRequestType): ObjectDetectionSqlTableConfiguration {
        const arr = input.refId.split('_');
        if (arr.length !== 2) {
            return undefined;
        }

        const table = arr[0].toLowerCase();
        const id = arr[1];
        if (table === undefined || id === undefined) {
            return undefined;
        }

        const config = this.objectDetectionModelConfig.detectionTables[table];
        if (config === undefined) {
            return undefined;
        }

        return {...config, id: id};
    }

    public readMaxIdAlreadyDetectedPerDetector(entityType: string, detectorFilterNames: string[]):
        Promise<ObjectDetectionMaxIdPerDetectorType[]> {
        const table = entityType.toLowerCase();
        const config = this.objectDetectionModelConfig.detectionTables[table];
        if (config === undefined) {
            return utils.reject('unknown entityType: ' + LogUtils.sanitizeLogMsg(entityType));
        }

        const sqlQuery: SelectQueryData = {
            fields: [config.detectedFieldDetector + ' as detector', 'COALESCE(MAX(' + config.baseFieldId + '), 0) as maxId'],
            from: config.detectedTable,
            where: [config.detectedFieldDetector + ' in ("' + detectorFilterNames.join('", "') + '")'],
            sort: undefined,
            limit: undefined,
            offset: 0,
            tableConfig: undefined,
            groupByFields: [config.detectedFieldDetector],
            having: undefined
        };

        return this.knex.raw(
            this.transformToSqlDialect(this.sqlQueryBuilder.selectQueryTransformToSql(sqlQuery))).then(value => {
            return utils.resolve(this.sqlQueryBuilder.extractDbResult(value, this.knex.client['config']['client']));
        }).catch(reason => {
            return utils.reject(reason);
        });
    }

    public readRequestImageDataType(entityType: string, detector: string, maxIdAlreadyDetected: number, maxPerRun: number):
        Promise<RequestImageDataType[]> {
        const table = entityType.toLowerCase();
        const config = this.objectDetectionModelConfig.detectionTables[table];
        if (config === undefined) {
            return utils.reject('unknown entityType: ' + LogUtils.sanitizeLogMsg(entityType));
        }

        const sqlQuery: SelectQueryData = {
            fields: ['CONCAT("' + table.toUpperCase() + '", "_", ' + config.baseFieldId + ') AS id',
                config.baseFieldId,
                config.baseFieldFilePath + ' AS filePath',
                config.baseFieldFileDir + ' as fileDir',
                config.baseFieldFileName + ' as fileName',
                '"' + this.sqlQueryBuilder.sanitizeSqlFilterValue(detector) + '" as detector'],
            from: config.baseTable,
            where: [config.baseFieldId + ' > ' + maxIdAlreadyDetected +
            ' OR ' + config.baseFieldId + ' IN (SELECT ' + config.baseFieldId +
            '        FROM ' + config.detectedTable + ' WHERE ' + config.detectedFieldState + ' in ("' + ObjectDetectionState.RETRY + '"))'],
            sort: [config.baseFieldId + ' ASC'],
            limit: maxPerRun,
            offset: 0,
            tableConfig: undefined,
            groupByFields: undefined,
            having: undefined
        };

        return this.knex.raw(
            this.transformToSqlDialect(this.sqlQueryBuilder.selectQueryTransformToSql(sqlQuery))).then(value => {
            return utils.resolve(this.sqlQueryBuilder.extractDbResult(value, this.knex.client['config']['client']));
        }).catch(reason => {
            return utils.reject(reason);
        });
    }

    public deleteOldDetectionRequests(detectionRequest: ObjectDetectionRequestType, onlyNotSucceeded: boolean): Promise<any> {
        const tableConfig = this.getObjectDetectionConfiguration(detectionRequest);
        if (!tableConfig) {
            return utils.reject('detectionRequest table not valid: ' + LogUtils.sanitizeLogMsg(detectionRequest.refId));
        }

        const detectorFilterValues = detectionRequest.detectors.map(detector => {
            return this.sqlQueryBuilder.sanitizeSqlFilterValue(detector);
        });
        const onlyNotSucceededStates = [ObjectDetectionState.ERROR, ObjectDetectionState.OPEN, ObjectDetectionState.RETRY,
            ObjectDetectionState.UNKNOWN];
        const deleteSql = 'DELETE FROM ' + tableConfig.detectedTable + ' ' +
            'WHERE ' + tableConfig.detectedTable + '.' + tableConfig.detectedFieldDetector +
            ' IN ("' + detectorFilterValues.join('", "') + '") ' +
            ' AND ' + tableConfig.baseFieldId + ' = "' + tableConfig.id + '"' +
            (onlyNotSucceeded ? ' AND ' + tableConfig.detectedFieldState + ' IN ("' + onlyNotSucceededStates.join('", "') + '")' : '');
        const sqlBuilder = this.knex;
        return sqlBuilder.raw(this.transformToSqlDialect(deleteSql));
    }

    public createDetectionRequest(detectionRequest: ObjectDetectionRequestType, detector: string): Promise<any> {
        const tableConfig = this.getObjectDetectionConfiguration(detectionRequest);
        if (!tableConfig) {
            return utils.reject('detectionRequest table not valid: ' + LogUtils.sanitizeLogMsg(detectionRequest.refId));
        }

        const sqlBuilder = this.knex;
        const insertSql = 'INSERT INTO ' + tableConfig.detectedTable +
            ' (' + tableConfig.baseFieldId + ', ' + tableConfig.detectedFieldState + ', ' + tableConfig.detectedFieldDetector + ')' +
            ' VALUES ("' + tableConfig.id + '",' +
            ' "' + this.sqlQueryBuilder.sanitizeSqlFilterValue(detectionRequest.state) + '",' +
            ' "' + detector + '")';
        return new Promise((resolve, reject) => {
            sqlBuilder.raw(this.transformToSqlDialect(insertSql)).then(() => {
                return resolve(true);
            }).catch(function errorFunction(reason) {
                console.error('detectionRequest delete/insert ' + tableConfig.detectedTable + ' failed:', reason);
                return reject(reason);
            });
        });
    }

    public createDetectionError(detectionResponse: ObjectDetectionResponseType, detector: string): Promise<any> {
        const tableConfig = this.getObjectDetectionConfiguration(detectionResponse.request);
        if (!tableConfig) {
            return utils.reject('detectionError table not valid: ' + LogUtils.sanitizeLogMsg(detectionResponse.request.refId));
        }

        const sqlBuilder = this.knex;
        const newState = detectionResponse.responseCode === undefined
        || detectionResponse.responseCode === ObjectDetectionResponseCode.NONRECOVERABLE_ERROR
            ? ObjectDetectionState.ERROR
            : ObjectDetectionState.RETRY;
        const insertSql = 'INSERT INTO ' + tableConfig.detectedTable +
            ' (' + tableConfig.baseFieldId + ', ' + tableConfig.detectedFieldState + ', ' + tableConfig.detectedFieldDetector + ')' +
            ' VALUES ("' + tableConfig.id + '",' +
            ' "' + this.sqlQueryBuilder.sanitizeSqlFilterValue(newState) + '",' +
            ' "' + detector + '")';
        return new Promise((resolve, reject) => {
            sqlBuilder.raw(this.transformToSqlDialect(insertSql)).then(() => {
                return resolve(true);
            }).catch(function errorFunction(reason) {
                console.error('detectionError delete/insert ' + tableConfig.detectedTable + ' failed:', reason);
                return reject(reason);
            });
        });
    }

    public createDefaultObject(): Promise<any> {
        const sqlBuilder = this.knex;
        const insertObjectSql = 'INSERT INTO ' + this.objectDetectionModelConfig.objectTable.table +
            ' (' + [this.objectDetectionModelConfig.objectTable.fieldName,
                this.objectDetectionModelConfig.objectTable.fieldPicasaKey,
                this.objectDetectionModelConfig.objectTable.fieldKey,
                this.objectDetectionModelConfig.objectTable.fieldCategory].join(',') + ')' +
            ' SELECT "Default", "Default", "Default", "Default" FROM dual ' +
            '  WHERE NOT EXISTS (SELECT 1 FROM ' + this.objectDetectionModelConfig.objectTable.table +
            '        WHERE ' + this.objectDetectionModelConfig.objectTable.fieldKey + '="Default")';
        return new Promise((resolve, reject) => {
            sqlBuilder.raw(this.transformToSqlDialect(insertObjectSql)).then(() => {
                return sqlBuilder.raw(this.transformToSqlDialect(insertObjectSql));
            }).then(() => {
                return resolve(true);
            }).catch(function errorFunction(reason) {
                console.error('detectionRequest insert default-object failed:', reason);
                return reject(reason);
            });
        });
    }

    public processDetectionWithResult(detector: string, detectionResult: ObjectDetectionDetectedObjectType,
                                      tableConfig: ObjectDetectionSqlTableConfiguration): Promise<any> {
        const keySuggestion = this.sqlQueryBuilder.sanitizeSqlFilterValue(
            detectionResult.keySuggestion.split(',')[0]
                .trim()
                .replace(/[^a-zA-Z0-9]/g, '_'));
        const detailValues = [keySuggestion, detectionResult.imgWidth, detectionResult.imgHeight,
            detectionResult.objX, detectionResult.objY, detectionResult.objWidth, detectionResult.objHeight,
            detectionResult.precision]
            .map(value => {
                return this.sqlQueryBuilder.sanitizeSqlFilterValue(value);
            });
        const insertObjectKeySql = 'INSERT INTO ' + this.objectDetectionModelConfig.objectKeyTable.table +
            '   (' + [this.objectDetectionModelConfig.objectKeyTable.fieldDetector,
                this.objectDetectionModelConfig.objectKeyTable.fieldKey,
                this.objectDetectionModelConfig.objectKeyTable.fieldId].join(',') + ') ' +
            '   SELECT "' + detector + '",' +
            '          "' + keySuggestion + '",' +
            '          (SELECT MAX(' + this.objectDetectionModelConfig.objectTable.fieldId + ') AS newId ' +
            '           FROM ' + this.objectDetectionModelConfig.objectTable.table +
            '           WHERE ' + this.objectDetectionModelConfig.objectTable.fieldKey + '="Default" ' +
            '                 OR ' + this.objectDetectionModelConfig.objectTable.fieldKey + '="' + keySuggestion + '")' +
            '   AS newId FROM dual ' +
            '   WHERE NOT EXISTS (' +
            '      SELECT 1 FROM ' + this.objectDetectionModelConfig.objectKeyTable.table +
            '      WHERE ' + this.objectDetectionModelConfig.objectKeyTable.fieldDetector + '="' + detector + '" ' +
            '      AND ' + this.objectDetectionModelConfig.objectKeyTable.fieldKey + '="' + keySuggestion + '")';
        const insertImageObject = 'INSERT INTO ' + tableConfig.detectedTable + ' (' +
            tableConfig.baseFieldId + ', ' + tableConfig.detectedFieldState + ', ' +
            tableConfig.detectedFieldDetector + ', ' + tableConfig.detailFieldNames.join(', ') + ')' +
            ' VALUES ("' + tableConfig.id + '",' +
            ' "' + this.sqlQueryBuilder.sanitizeSqlFilterValue(detectionResult.state) + '",' +
            ' "' + detector + '", "' + detailValues.join('", "') + '")';
        const sqlBuilder = this.knex;
        return new Promise((resolve, reject) => {
            sqlBuilder.raw(this.transformToSqlDialect(insertObjectKeySql)).then(() => {
                return sqlBuilder.raw(this.transformToSqlDialect(insertImageObject));
            }).then(() => {
                return resolve(true);
            }).catch(function errorFunction(reason) {
                console.error('detectionRequest delete/insert ' + tableConfig.detectedTable + ' failed:', reason);
                return reject(reason);
            });
        });
    }

    public processDetectionWithoutResult(detector: string, tableConfig: ObjectDetectionSqlTableConfiguration): Promise<any> {
        const sqlBuilder = this.knex;
        const deleteDummySql = 'DELETE FROM ' + tableConfig.detectedTable + ' ' +
            'WHERE ' + tableConfig.detectedTable + '.' + tableConfig.detectedFieldDetector +
            ' IN ("' + detector + '") ' +
            ' AND ' + tableConfig.detectedFieldState + ' = "' + ObjectDetectionState.RUNNING_NO_SUGGESTION + '"';
        const insertImageObject = 'INSERT INTO ' + tableConfig.detectedTable + ' (' +
            tableConfig.baseFieldId + ', ' + tableConfig.detectedFieldState + ', ' + tableConfig.detectedFieldDetector + ')' +
            ' VALUES ("' + tableConfig.id + '",' +
            ' "' + ObjectDetectionState.RUNNING_NO_SUGGESTION + '",' +
            ' "' + detector + '")';
        return sqlBuilder.raw(this.transformToSqlDialect(deleteDummySql)).then(() => {
            return sqlBuilder.raw(this.transformToSqlDialect(insertImageObject));
        });
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
