import {GeoEntity, GeoEntityDbMapping, GeoEntityTableDbMapping} from '../shared/tdoc-commons/model/backend-geo.types';
import {AbstractGeoGpxParser} from '@dps/mycms-commons/dist/geo-commons/services/geogpx.parser';
import {FileUtils} from '@dps/mycms-commons/dist/commons/utils/file.utils';
import fs from 'fs';
import {BackendGeoGpxParser, BackendGeoTxtParser} from '../shared/tdoc-commons/services/backend-geo.parser';
import {GeoElementType} from '@dps/mycms-commons/dist/geo-commons/model/geoElementTypes';
import {GeoGpxUtils} from '@dps/mycms-commons/dist/geo-commons/services/geogpx.utils';
import {AbstractBackendGeoService} from '../shared/tdoc-commons/services/abstract-backend-geo.service';
import {BackendConfigType} from './backend.commons';
import {TourDocFileUtils} from '../shared/tdoc-commons/services/tdoc-file.utils';
import {RawSqlQueryData, SqlUtils} from '@dps/mycms-commons/dist/search-commons/services/sql-utils';
import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';

export class BackendGeoService implements AbstractBackendGeoService {
    private readonly sqlQueryBuilder: SqlQueryBuilder;

    public static mapDBResultOnGeoEntity(dbResult: any, records: GeoEntity[]): void {
        for (let i = 0; i <= dbResult.length; i++) {
            if (dbResult[i] !== undefined) {
                const entry: GeoEntity = {
                    gpsTrackBasefile: undefined,
                    gpsTrackSrc: undefined,
                    gpsTrackTxt: undefined,
                    id: undefined,
                    locHirarchie: undefined,
                    name: undefined,
                    type: undefined
                };
                for (const key in dbResult[i]) {
                    if (dbResult[i].hasOwnProperty(key)) {
                        entry[key] = dbResult[i][key];
                    }
                }
                records.push(entry);
            }
        }
    }

    constructor(protected backendConfig: BackendConfigType,
                protected knex,
                protected gpxParser: BackendGeoGpxParser,
                protected txtParser: BackendGeoTxtParser,
                protected gpxUtils: GeoGpxUtils,
                protected geoEntityDbMapping: GeoEntityTableDbMapping) {
        this.sqlQueryBuilder = new SqlQueryBuilder();
    }

    public readGeoEntityForId(entityType: string, id: number): Promise<GeoEntity> {
        const geoEntityDbMapping = this.geoEntityDbMapping.tables[entityType];
        if (!geoEntityDbMapping) {
            return Promise.reject('no valid entityType:' + entityType);
        }

        const readSqlQuery: RawSqlQueryData = {
            sql: this.generateBaseSqlForTable(geoEntityDbMapping) +
                '  WHERE ' + geoEntityDbMapping.fields.id + ' = ?',
            parameters: [id]
        };

        return SqlUtils.executeRawSqlQueryData(this.knex, readSqlQuery).then(dbResults => {
            const records: GeoEntity[] = [];
            BackendGeoService.mapDBResultOnGeoEntity(
                this.sqlQueryBuilder.extractDbResult(dbResults, this.knex.client['config']['client']), records);

            if (records.length === 1) {
                return Promise.resolve(records[0]);
            }

            return Promise.resolve(undefined);
        });
    }

    public updateGeoEntity(entity: GeoEntity, fieldsToUpdate: string[]): Promise<GeoEntity> {
        const geoEntityDbMapping = this.geoEntityDbMapping.tables[entity.type] || this.geoEntityDbMapping.tables[entity.type.toLowerCase()];
        if (!geoEntityDbMapping) {
            return Promise.reject('no valid entityType:' + entity.type);
        }

        // TODO -> do updateGeoEntity
        return Promise.resolve(entity);
    }

    public readGeoEntitiesWithTxtButNoGpx(entityType: string, force: boolean): Promise<GeoEntity[]> {
        const geoEntityDbMapping = this.geoEntityDbMapping.tables[entityType];
        if (!geoEntityDbMapping) {
            return Promise.reject('no valid entityType:' + entityType);
        }

        const readSqlQuery: RawSqlQueryData = {
            sql: this.generateBaseSqlForTable(geoEntityDbMapping) +
                '  WHERE ' + geoEntityDbMapping.fields.gpsTrackSrc + ' IS NULL' +
                (force
                    ? ''
                    : '  AND ' + geoEntityDbMapping.fields.gpsTrackTxt + ' IS NOT NULL'),
            parameters: []
        };

        return SqlUtils.executeRawSqlQueryData(this.knex, readSqlQuery).then(dbResults => {
            const records: GeoEntity[] = [];
            BackendGeoService.mapDBResultOnGeoEntity(
                this.sqlQueryBuilder.extractDbResult(dbResults, this.knex.client['config']['client']), records);

            return Promise.resolve(records);
        });
    }

    public readGeoEntitiesWithGpxButNoPoints(entityType: string, force: boolean): Promise<GeoEntity[]> {
        const geoEntityDbMapping = this.geoEntityDbMapping.tables[entityType];
        if (!geoEntityDbMapping) {
            return Promise.reject('no valid entityType:' + entityType);
        }

        const readSqlQuery: RawSqlQueryData = {
            sql: this.generateBaseSqlForTable(geoEntityDbMapping) +
                '  WHERE ' + geoEntityDbMapping.fields.gpsTrackSrc + ' IS NOT NULL',
            parameters: []
        };

        return SqlUtils.executeRawSqlQueryData(this.knex, readSqlQuery).then(dbResults => {
            const records: GeoEntity[] = [];
            BackendGeoService.mapDBResultOnGeoEntity(
                this.sqlQueryBuilder.extractDbResult(dbResults, this.knex.client['config']['client']), records);

            return Promise.resolve(records);
        });
    }

    public readGeoEntitiesWithGpx(entityType: string): Promise<GeoEntity[]> {
        const geoEntityDbMapping = this.geoEntityDbMapping.tables[entityType];
        if (!geoEntityDbMapping) {
            return Promise.reject('no valid entityType:' + entityType);
        }

        const readSqlQuery: RawSqlQueryData = {
            sql: this.generateBaseSqlForTable(geoEntityDbMapping) +
                '  WHERE ' + geoEntityDbMapping.fields.gpsTrackSrc + ' IS NOT NULL',
            parameters: []
        };

        return SqlUtils.executeRawSqlQueryData(this.knex, readSqlQuery).then(dbResults => {
            const records: GeoEntity[] = [];
            BackendGeoService.mapDBResultOnGeoEntity(
                this.sqlQueryBuilder.extractDbResult(dbResults, this.knex.client['config']['client']), records);

            return Promise.resolve(records);
        });
    }

    public convertTxtLogToGpx(entity: GeoEntity, force: boolean): Promise<GeoEntity> {
        if (entity === undefined) {
            return Promise.reject('no valid entity:' + entity);
        }

        if (entity.gpsTrackTxt === undefined || !this.txtParser.isResponsibleForSrc(entity.gpsTrackTxt)) {
            return Promise.reject('no valid txt:' + entity.id);
        }

        const geoElements = this.txtParser.parse(entity.gpsTrackTxt, {});
        const segments = [];
        let newGpx = '';
        for (const geoElement of geoElements) {
            if (geoElement.type === GeoElementType.TRACK) {
                segments.push(
                    this.gpxParser.createGpxTrackSegment(geoElement.points, undefined));
            } else {
                newGpx += this.gpxParser.createGpxRoute(geoElement.name, 'ROUTE', geoElement.points, undefined);
            }
        }

        newGpx = this.gpxUtils.fixXml(newGpx);
        newGpx = this.gpxUtils.fixXmlExtended(newGpx);
        newGpx = this.gpxUtils.reformatXml(newGpx);
        newGpx = this.gpxUtils.trimXml(newGpx);

        entity.gpsTrackSrc = newGpx;

        console.log('DONE - convertTxtLogToGpx for: ', entity.type, entity.id, entity.name);

        return this.updateGeoEntity(entity, ['gpsTrackSrc']);
    }

    public saveGpxPointsToDatabase(entity: GeoEntity, force: boolean): Promise<GeoEntity> {
        if (entity === undefined) {
            return Promise.reject('no valid entity:' + entity);
        }

        if (entity.gpsTrackSrc === undefined || !AbstractGeoGpxParser.isResponsibleForSrc(entity.gpsTrackSrc)) {
            return Promise.reject('no valid gpx:' + entity.id);
        }

        const geoElements = this.gpxParser.parse(entity.gpsTrackSrc, {});
        for (const geoElement of geoElements) {
            for (const point of geoElement.points) {
                // TODO save point to database
                if (true) {
                    return Promise.reject('no implemented yet - save entity:' + entity)
                }
            }
        }

        console.log('DONE - saveGpxPointsToDatabase for: ', entity.type, entity.id, entity.name);

        return Promise.resolve(entity);
    }

    public exportGpxToFile(entity: GeoEntity, force: boolean): Promise<GeoEntity> {
        if (entity === undefined) {
            return Promise.reject('no valid entity:' + entity);
        }

        if (entity.gpsTrackSrc === undefined || !AbstractGeoGpxParser.isResponsibleForSrc(entity.gpsTrackSrc)) {
            return Promise.reject('no valid gpx:' + entity.id);
        }

        let flagUpdateName = false;
        if (entity.gpsTrackBasefile === undefined || entity.gpsTrackBasefile === null
            || entity.gpsTrackBasefile.length < 10) {
            entity.gpsTrackBasefile = TourDocFileUtils.generateGeoFileName(entity);
            flagUpdateName = true;
        }

        const filePath = this.backendConfig.apiRouteTracksStaticDir + '/' + entity.gpsTrackBasefile + '.gpx';
        const errFileCheck = FileUtils.checkFilePath(filePath, false, false, false, true, false);
        if (errFileCheck) {
            return Promise.reject('no valid gpx-filePath:' + filePath);
        }

        const existsFileCheck = FileUtils.checkFilePath(filePath, false, false, true, true, false);
        if (force || existsFileCheck) {
            try {
                fs.writeFileSync(filePath, entity.gpsTrackSrc);
            } catch (err) {
                console.error('error while writing gpx-file: ' + filePath, err);
                return Promise.reject('error while writing gpx-file: ' + err);
            }

            console.log('DONE - exportGpxToFile for: ', entity.type, entity.id, entity.name, filePath);
            if (flagUpdateName) {
                return this.updateGeoEntity(entity, ['gpsTrackBasefile']);
            }
        }

        console.log('SKIPPED already exists - exportGpxToFile for: ', entity.type, entity.id, entity.name, filePath);

        return Promise.resolve(entity);
    }

    protected generateBaseSqlForTable(geoEntityDbMapping: GeoEntityDbMapping): string {
        return 'SELECT DISTINCT ' +
            geoEntityDbMapping.fields.id + ' as id, ' +
            geoEntityDbMapping.fields.type + ' as type, ' +
            geoEntityDbMapping.fields.name + ' as name, ' +
            geoEntityDbMapping.fields.gpsTrackBasefile + ' as gpsTrackBasefile, ' +
            geoEntityDbMapping.fields.gpsTrackSrc + ' as gpsTrackSrc, ' +
            (geoEntityDbMapping.fields.gpsTrackTxt
                ? geoEntityDbMapping.fields.gpsTrackTxt + ' as gpsTrackTxt, '
                : '') +
            geoEntityDbMapping.fields.locHirarchie + ' as locHirarchie ' +
            '  FROM ' + geoEntityDbMapping.selectFrom +
            ' ';
    }
}
