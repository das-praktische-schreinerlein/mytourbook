import {SelectQueryData, SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {utils} from 'js-data';
import {LogUtils} from '@dps/mycms-commons/dist/commons/utils/log.utils';
import {
    ObjectDetectionDetectedObjectType,
    ObjectDetectionRequestType,
    ObjectDetectionState
} from '@dps/mycms-commons/dist/commons/model/objectdetection-model';
import {
    ObjectDetectionDataStore,
    ObjectDetectionMaxIdPerDetectorType,
    ObjectDetectionSqlTableConfiguration,
    RequestImageDataType
} from './common-queued-object-detection.service';

export class TourDocSqlMediadbObjectDetectionAdapter implements ObjectDetectionDataStore {

    private config: any;
    private knex: any;
    private sqlQueryBuilder: SqlQueryBuilder;

    constructor(config: any, knex: any, sqlQueryBuilder: SqlQueryBuilder) {
        this.config = config;
        this.knex = knex;
        this.sqlQueryBuilder = sqlQueryBuilder;
    }

    public readMaxIdAlreadyDetectedPerDetector(entityType: string,
                                               detectorFilterNames: string[]): Promise<ObjectDetectionMaxIdPerDetectorType[]> {
        let sqlQuery: SelectQueryData;
        switch (entityType.toUpperCase()) {
            case 'IMAGE':
                sqlQuery = {
                    fields: ['io_detector as detector', 'COALESCE(MAX(i_id), 0) as maxId'],
                    from: 'image_object',
                    where: ['io_detector in ("' + detectorFilterNames.join('", "') + '")'],
                    sort: undefined,
                    limit: undefined,
                    offset: 0,
                    tableConfig: undefined,
                    groupByFields: ['io_detector'],
                    having: undefined
                };
                break;
            case 'VIDEO':
                sqlQuery = {
                    fields: ['vo_detector as detector', 'COALESCE(MAX(v_id), 0) as maxId'],
                    from: 'video_object',
                    where: ['vo_detector in ("' + detectorFilterNames.join('", "') + '")'],
                    sort: undefined,
                    limit: undefined,
                    offset: 0,
                    tableConfig: undefined,
                    groupByFields: ['vo_detector'],
                    having: undefined
                };
                break;
            default:
                return utils.reject('unknown entityType: ' + LogUtils.sanitizeLogMsg(entityType));
        }

        return this.knex.raw(
            this.transformToSqlDialect(this.sqlQueryBuilder.selectQueryTransformToSql(sqlQuery))).then(value => {
            return utils.resolve(this.sqlQueryBuilder.extractDbResult(value, this.knex.client['config']['client']));
        }).catch(reason => {
            return utils.reject(reason);
        });
    }

    public readRequestImageDataType(entityType: string, detector: string, maxIdAlreadyDetected: number,
                                    maxPerRun: number): Promise<RequestImageDataType[]> {
        let sqlQuery: SelectQueryData;
        switch (entityType.toUpperCase()) {
            case 'IMAGE':
                sqlQuery = {
                    fields: ['CONCAT("IMAGE", "_", image.i_id) AS id',
                        'i_id',
                        'CONCAT(image.i_dir, "/", image.i_file) AS filePath',
                        'i_dir as fileDir',
                        'i_file as fileName',
                        '"' + this.sqlQueryBuilder.sanitizeSqlFilterValue(detector) + '" as detector'],
                    from: 'image',
                    where: ['i_id > ' + maxIdAlreadyDetected],
                    sort: ['i_id ASC'],
                    limit: maxPerRun,
                    offset: 0,
                    tableConfig: undefined,
                    groupByFields: undefined,
                    having: undefined
                };
                break;
            case 'VIDEO':
                sqlQuery = {
                    fields: ['CONCAT("VIDEO", "_", video.v_id) AS id',
                        'v_id',
                        'CONCAT(video.v_dir, "/", video.v_file) AS filePath',
                        'v_dir as fileDir',
                        'v_file as fileName',
                        '"' + this.sqlQueryBuilder.sanitizeSqlFilterValue(detector) + '" as detector'],
                    from: 'video',
                    where: ['v_id > ' + maxIdAlreadyDetected],
                    sort: ['v_id ASC'],
                    limit: maxPerRun,
                    offset: 0,
                    tableConfig: undefined,
                    groupByFields: undefined,
                    having: undefined
                };
                break;
            default:
                return utils.reject('unknown entityType: ' + LogUtils.sanitizeLogMsg(entityType));
        }

        return this.knex.raw(
            this.transformToSqlDialect(this.sqlQueryBuilder.selectQueryTransformToSql(sqlQuery))).then(value => {
            return utils.resolve(this.sqlQueryBuilder.extractDbResult(value, this.knex.client['config']['client']));
        }).catch(reason => {
            return utils.reject(reason);
        });
    }

    public getObjectDetectionConfiguration(input: ObjectDetectionRequestType): ObjectDetectionSqlTableConfiguration {
        let table = undefined;
        let id = undefined;
        if (input.refId.startsWith('IMAGE_')) {
            table = 'image';
            id = this.sqlQueryBuilder.sanitizeSqlFilterValue(input.refId.replace('IMAGE_', ''));
        }
        switch (table) {
            case 'image':
                return {
                    table: table,
                    id: id,
                    baseTableName: 'image',
                    joinTableName: 'image_object',
                    idFieldName: 'i_id',
                    stateFieldName: 'io_state',
                    detectorFieldName: 'io_detector',
                    detailFieldNames: ['io_obj_type', 'io_img_width', 'io_img_height',
                        'io_obj_x1', 'io_obj_y1', 'io_obj_width', 'io_obj_height',
                        'io_precision']
                };
            case 'video':
                return {
                    table: table,
                    id: id,
                    baseTableName: 'video',
                    joinTableName: 'video_object',
                    idFieldName: 'v_id',
                    stateFieldName: 'vo_state',
                    detectorFieldName: 'vo_detector',
                    detailFieldNames: ['vo_obj_type', 'vo_img_width', 'vo_img_height',
                        'vo_obj_x1', 'vo_obj_y1', 'vo_obj_width', 'vo_obj_height',
                        'vo_precision']
                };
            default:
                return undefined;
        }
    }

    public deleteOldDetectionRequests(detectionRequest: ObjectDetectionRequestType): Promise<any> {
        const tableConfig = this.getObjectDetectionConfiguration(detectionRequest);
        if (!tableConfig) {
            return utils.reject('detectionRequest table not valid: ' + LogUtils.sanitizeLogMsg(detectionRequest.refId));
        }

        const detectorFilterValues = detectionRequest.detectors.map(detector => {
            return this.sqlQueryBuilder.sanitizeSqlFilterValue(detector);
        });
        const deleteSql = 'DELETE FROM ' + tableConfig.joinTableName + ' ' +
            'WHERE ' + tableConfig.joinTableName + '.' + tableConfig.detectorFieldName +
            ' IN ("' + detectorFilterValues.join('", "') + '") ' +
            ' AND ' + tableConfig.idFieldName + ' = "' + tableConfig.id + '"';
        const sqlBuilder = this.knex;
        return sqlBuilder.raw(this.transformToSqlDialect(deleteSql));
    }

    public createDetectionRequest(detectionRequest: ObjectDetectionRequestType, detector: string): Promise<any> {
        const tableConfig = this.getObjectDetectionConfiguration(detectionRequest);
        if (!tableConfig) {
            return utils.reject('detectionRequest table not valid: ' + LogUtils.sanitizeLogMsg(detectionRequest.refId));
        }

        const sqlBuilder = this.knex;
        const insertSql = 'INSERT INTO ' + tableConfig.joinTableName +
            ' (' + tableConfig.idFieldName + ', ' + tableConfig.stateFieldName + ', ' + tableConfig.detectorFieldName + ')' +
            ' VALUES ("' + tableConfig.id + '",' +
            ' "' + this.sqlQueryBuilder.sanitizeSqlFilterValue(detectionRequest.state) + '",' +
            ' "' + detector + '")';
        return new Promise((resolve, reject) => {
            return sqlBuilder.raw(this.transformToSqlDialect(insertSql)).then(dbresults => {
                return resolve(true);
            }).catch(function errorFunction(reason) {
                console.error('detectionRequest delete/insert ' + tableConfig.joinTableName + ' failed:', reason);
                return reject(reason);
            });
        });
    }

    public createDefaultObject(): Promise<any> {
        const sqlBuilder = this.knex;
        const insertObjectSql = 'INSERT INTO objects (o_name, o_picasa_key, o_key)' +
            ' SELECT "Default", "Default", "Default" FROM dual ' +
            '  WHERE NOT EXISTS (SELECT 1 FROM objects WHERE o_name="Default" AND o_key="Default")';
        return new Promise((resolve, reject) => {
            return sqlBuilder.raw(this.transformToSqlDialect(insertObjectSql)).then(dbresults => {
                return sqlBuilder.raw(this.transformToSqlDialect(insertObjectSql));
            }).then(dbresults => {
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
        const insertObjectKeySql = 'INSERT INTO objects_key(ok_detector, ok_key, o_id) ' +
            '   SELECT "' + detector + '",' +
            '          "' + keySuggestion + '",' +
            '          (SELECT MAX(o_id) AS newId FROM objects WHERE o_name="Default") AS o_id FROM dual ' +
            '   WHERE NOT EXISTS (' +
            '      SELECT 1 FROM objects_key WHERE ok_detector="' + detector + '" ' +
            '                                      AND ok_key="' + keySuggestion + '")';
        const insertImageObject = 'INSERT INTO ' + tableConfig.joinTableName + ' (' +
            tableConfig.idFieldName + ', ' + tableConfig.stateFieldName + ', ' +
            tableConfig.detectorFieldName + ', ' + tableConfig.detailFieldNames.join(', ') + ')' +
            ' VALUES ("' + tableConfig.id + '",' +
            ' "' + this.sqlQueryBuilder.sanitizeSqlFilterValue(detectionResult.state) + '",' +
            ' "' + detector + '", "' + detailValues.join('", "') + '")';
        const sqlBuilder = this.knex;
        return new Promise((resolve, reject) => {
            return sqlBuilder.raw(this.transformToSqlDialect(insertObjectKeySql)).then(dbresults => {
                return sqlBuilder.raw(this.transformToSqlDialect(insertImageObject));
            }).then(dbresults => {
                return resolve(true);
            }).catch(function errorFunction(reason) {
                console.error('detectionRequest delete/insert ' + tableConfig.joinTableName + ' failed:', reason);
                return reject(reason);
            });
        });
    }

    public processDetectionWithoutResult(detector: string, tableConfig: ObjectDetectionSqlTableConfiguration): Promise<any> {
        const sqlBuilder = this.knex;
        const deleteDummySql = 'DELETE FROM ' + tableConfig.joinTableName + ' ' +
            'WHERE ' + tableConfig.joinTableName + '.' + tableConfig.detectorFieldName +
            ' IN ("' + detector + '") ' +
            ' AND ' + tableConfig.stateFieldName + ' = "' + ObjectDetectionState.RUNNING_NO_SUGGESTION + '"';
        const insertImageObject = 'INSERT INTO ' + tableConfig.joinTableName + ' (' +
            tableConfig.idFieldName + ', ' + tableConfig.stateFieldName + ', ' + tableConfig.detectorFieldName + ')' +
            ' VALUES ("' + tableConfig.id + '",' +
            ' "' + ObjectDetectionState.RUNNING_NO_SUGGESTION + '",' +
            ' "' + detector + '")';
        return sqlBuilder.raw(this.transformToSqlDialect(deleteDummySql)).then(dbresults => {
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
}
