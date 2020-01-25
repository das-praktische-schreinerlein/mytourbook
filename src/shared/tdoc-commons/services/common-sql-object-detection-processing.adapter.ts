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
import {
    CommonObjectDetectionProcessingDatastore,
    ObjectDetectionMaxIdPerDetectorType,
    RequestImageDataType
} from './common-object-detection-processing-datastore';
import {
    OBJECTDETECTION_KEY_DEFAULT,
    OBJECTDETECTION_NAME_DEFAULT,
    ObjectDetectionModelConfigType,
    ObjectDetectionSqlTableConfiguration
} from './common-sql-object-detection.model';
import {RawSqlQueryData, SqlUtils} from '@dps/mycms-commons/dist/search-commons/services/sql-utils';


export class CommonSqlObjectDetectionProcessingAdapter implements CommonObjectDetectionProcessingDatastore {
    protected readonly config: any;
    protected readonly knex: any;
    protected readonly sqlQueryBuilder: SqlQueryBuilder;
    private readonly objectDetectionModelConfig: ObjectDetectionModelConfigType;

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
        const deleteSqlQuery: RawSqlQueryData = {
            sql: 'DELETE FROM ' + tableConfig.detectedTable + ' ' +
                'WHERE ' + tableConfig.detectedTable + '.' + tableConfig.detectedFieldDetector +
                ' IN (' + SqlUtils.mapParametersToPlaceholderString(detectorFilterValues) + ') ' +
                ' AND ' + tableConfig.baseFieldId + ' = ' + '?' + '' +
                (onlyNotSucceeded
                    ? ' AND ' + tableConfig.detectedFieldState +
                    ' IN (' + SqlUtils.mapParametersToPlaceholderString(onlyNotSucceededStates) + ')'
                    : ''),
            parameters: [].concat(detectorFilterValues).concat([tableConfig.id]
                .concat(onlyNotSucceeded ? onlyNotSucceededStates : []))
        };

        deleteSqlQuery.sql = this.transformToSqlDialect(deleteSqlQuery.sql);
        return SqlUtils.executeRawSqlQueryData(this.knex, deleteSqlQuery);
    }

    public createDetectionRequest(detectionRequest: ObjectDetectionRequestType, detector: string): Promise<any> {
        const tableConfig = this.getObjectDetectionConfiguration(detectionRequest);
        if (!tableConfig) {
            return utils.reject('detectionRequest table not valid: ' + LogUtils.sanitizeLogMsg(detectionRequest.refId));
        }

        const insertSqlQuery: RawSqlQueryData = {
            sql: 'INSERT INTO ' + tableConfig.detectedTable +
                ' (' + tableConfig.baseFieldId + ', ' + tableConfig.detectedFieldState + ', ' + tableConfig.detectedFieldDetector + ')' +
                ' VALUES (' + '?' + ',' +
                ' ' + '?' + ',' +
                ' ' + '?' + ')',
            parameters: [tableConfig.id, this.sqlQueryBuilder.sanitizeSqlFilterValue(detectionRequest.state), detector]
        };
        insertSqlQuery.sql = this.transformToSqlDialect(insertSqlQuery.sql);

        return new Promise((resolve, reject) => {
            SqlUtils.executeRawSqlQueryData(this.knex, insertSqlQuery).then(() => {
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

        const newState = detectionResponse.responseCode === undefined
        || detectionResponse.responseCode === ObjectDetectionResponseCode.NONRECOVERABLE_ERROR
            ? ObjectDetectionState.ERROR
            : ObjectDetectionState.RETRY;
        const insertSqlQuery: RawSqlQueryData = {
            sql: 'INSERT INTO ' + tableConfig.detectedTable +
                ' (' + tableConfig.baseFieldId + ', ' + tableConfig.detectedFieldState + ', ' + tableConfig.detectedFieldDetector + ')' +
                ' VALUES (' + '?' + ',' +
                ' ' + '?' + ',' +
                ' ' + '?' + ')',
            parameters: [tableConfig.id, this.sqlQueryBuilder.sanitizeSqlFilterValue(newState), detector]
        };
        insertSqlQuery.sql = this.transformToSqlDialect(insertSqlQuery.sql);

        return new Promise((resolve, reject) => {
            SqlUtils.executeRawSqlQueryData(this.knex, insertSqlQuery).then(() => {
                return resolve(true);
            }).catch(function errorFunction(reason) {
                console.error('detectionError delete/insert ' + tableConfig.detectedTable + ' failed:', reason);
                return reject(reason);
            });
        });
    }

    public createDefaultObject(): Promise<any> {
        const insertObjectSqlQuery: RawSqlQueryData = {
            sql: 'INSERT INTO ' + this.objectDetectionModelConfig.objectTable.table +
                ' (' + [this.objectDetectionModelConfig.objectTable.fieldName,
                    this.objectDetectionModelConfig.objectTable.fieldPicasaKey,
                    this.objectDetectionModelConfig.objectTable.fieldKey,
                    this.objectDetectionModelConfig.objectTable.fieldCategory].join(',') + ')' +
                ' SELECT ?, ?, ?, ? FROM dual ' +
                '  WHERE NOT EXISTS (SELECT 1 FROM ' + this.objectDetectionModelConfig.objectTable.table +
                '        WHERE ' + this.objectDetectionModelConfig.objectTable.fieldKey + '=?)',
            parameters: [OBJECTDETECTION_NAME_DEFAULT, OBJECTDETECTION_KEY_DEFAULT, OBJECTDETECTION_KEY_DEFAULT,
                OBJECTDETECTION_NAME_DEFAULT, OBJECTDETECTION_KEY_DEFAULT]
        };
        insertObjectSqlQuery.sql = this.transformToSqlDialect(insertObjectSqlQuery.sql);

        return new Promise((resolve, reject) => {
            SqlUtils.executeRawSqlQueryData(this.knex, insertObjectSqlQuery).then(() => {
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
        const insertObjectKeySqlQuery: RawSqlQueryData = {
            sql: 'INSERT INTO ' + this.objectDetectionModelConfig.objectKeyTable.table +
                '   (' + [this.objectDetectionModelConfig.objectKeyTable.fieldDetector,
                    this.objectDetectionModelConfig.objectKeyTable.fieldKey,
                    this.objectDetectionModelConfig.objectKeyTable.fieldId].join(',') + ') ' +
                '   SELECT ' + '?' + ',' +
                '          ' + '?' + ',' +
                '          (SELECT MAX(' + this.objectDetectionModelConfig.objectTable.fieldId + ') AS newId ' +
                '           FROM ' + this.objectDetectionModelConfig.objectTable.table +
                '           WHERE ' + this.objectDetectionModelConfig.objectTable.fieldKey + '=? ' +
                '                 OR ' + this.objectDetectionModelConfig.objectTable.fieldKey + '=' + '?' + ')' +
                '   AS newId FROM dual ' +
                '   WHERE NOT EXISTS (' +
                '      SELECT 1 FROM ' + this.objectDetectionModelConfig.objectKeyTable.table +
                '      WHERE ' + this.objectDetectionModelConfig.objectKeyTable.fieldDetector + '=' + '?' + ' ' +
                '      AND ' + this.objectDetectionModelConfig.objectKeyTable.fieldKey + '=' + '?' + ')',
            parameters: [ detector, keySuggestion, OBJECTDETECTION_KEY_DEFAULT, keySuggestion, detector, keySuggestion]
        };
        const insertImageObjectQuery: RawSqlQueryData = {
            sql: 'INSERT INTO ' + tableConfig.detectedTable + ' (' +
                tableConfig.baseFieldId + ', ' + tableConfig.detectedFieldState + ', ' +
                tableConfig.detectedFieldDetector + ', ' + tableConfig.detailFieldNames.join(', ') + ')' +
                ' VALUES (' + '?' + ',' +
                ' ' + '?' + ',' +
                ' ' + '?' + ', ' + SqlUtils.mapParametersToPlaceholderString(detailValues) + ')',
            parameters: [tableConfig.id, this.sqlQueryBuilder.sanitizeSqlFilterValue(detectionResult.state), detector]
                .concat(detailValues)
        };
        insertObjectKeySqlQuery.sql = this.transformToSqlDialect(insertObjectKeySqlQuery.sql);
        insertImageObjectQuery.sql = this.transformToSqlDialect(insertImageObjectQuery.sql);

        return new Promise((resolve, reject) => {
            SqlUtils.executeRawSqlQueryData(this.knex, insertObjectKeySqlQuery).then(() => {
                return SqlUtils.executeRawSqlQueryData(this.knex, insertImageObjectQuery);
            }).then(() => {
                return resolve(true);
            }).catch(function errorFunction(reason) {
                console.error('detectionRequest delete/insert ' + tableConfig.detectedTable + ' failed:', reason);
                return reject(reason);
            });
        });
    }

    public processDetectionWithoutResult(detector: string, tableConfig: ObjectDetectionSqlTableConfiguration): Promise<any> {
        const deleteDummySqlQuery: RawSqlQueryData = {
            sql: 'DELETE FROM ' + tableConfig.detectedTable + ' ' +
                'WHERE ' + tableConfig.detectedTable + '.' + tableConfig.detectedFieldDetector +
                ' IN (' + '?' + ') ' +
                ' AND ' + tableConfig.detectedFieldState + ' = ' + '?' + '',
            parameters: [detector, ObjectDetectionState.RUNNING_NO_SUGGESTION]
        };
        const insertImageObjectQuery: RawSqlQueryData = {
            sql: 'INSERT INTO ' + tableConfig.detectedTable + ' (' +
                tableConfig.baseFieldId + ', ' + tableConfig.detectedFieldState + ', ' + tableConfig.detectedFieldDetector + ')' +
                ' VALUES (' + '?' + ',' +
                ' ' + '?' + ',' +
                ' ' + '?' + ')',
            parameters: [tableConfig.id, ObjectDetectionState.RUNNING_NO_SUGGESTION, detector]
        };
        deleteDummySqlQuery.sql = this.transformToSqlDialect(deleteDummySqlQuery.sql);
        insertImageObjectQuery.sql = this.transformToSqlDialect(insertImageObjectQuery.sql);

        return SqlUtils.executeRawSqlQueryData(this.knex, deleteDummySqlQuery).then(() => {
            return SqlUtils.executeRawSqlQueryData(this.knex, insertImageObjectQuery);
        });
    }

    protected transformToSqlDialect(sql: string): string {
        const client = this.knex.client['config']['client'];
        if (client === 'sqlite3') {
            sql = sql.replace(/ FROM dual /g, ' ');
        }
        return this.sqlQueryBuilder.transformToSqlDialect(sql, client);
    }
}
