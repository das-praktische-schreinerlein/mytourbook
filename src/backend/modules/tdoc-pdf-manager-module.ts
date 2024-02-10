import {SqlConnectionConfig} from './tdoc-dataservice.module';
import * as knex from 'knex';
import {TourDocRecord} from '../shared/tdoc-commons/model/records/tdoc-record';
import {TourDocBackendGeoService} from './tdoc-backend-geo.service';
import {ProcessingOptions} from '@dps/mycms-commons/dist/search-commons/services/cdoc-search.service';
import {BackendConfigType} from './backend.commons';
import {TourDocDataService} from '../shared/tdoc-commons/services/tdoc-data.service';
import {HierarchyConfig, HierarchyUtils} from '@dps/mycms-commons/dist/commons/utils/hierarchy.utils';
import {StringUtils} from '@dps/mycms-commons/dist/commons/utils/string.utils';
import {RawSqlQueryData, SqlUtils} from '@dps/mycms-commons/dist/search-commons/services/sql-utils';
import {TourDocSqlMytbDbConfig} from '../shared/tdoc-commons/services/tdoc-sql-mytbdb.config';
import {TourDocMediaExportProcessingOptions, TourDocMediaFileExportManager} from './tdoc-mediafile-export.service';
import {CommonDocRecord} from '@dps/mycms-commons/dist/search-commons/model/records/cdoc-entity-record';
import {CommonDocPdfManagerModule} from '@dps/mycms-server-commons/dist/backend-commons/modules/cdoc-pdf-manager-module';
import {PdfManager} from '@dps/mycms-server-commons/dist/media-commons/modules/pdf-manager';

export class TourPdfManagerModule extends CommonDocPdfManagerModule<TourDocDataService> {

    protected pdfEntityDbMapping = TourDocSqlMytbDbConfig.pdfEntityDbMapping;
    protected backendConfig: BackendConfigType;

    private mediaFileExportManager: TourDocMediaFileExportManager;
    private knexRef;

    constructor(dataService: TourDocDataService, mediaFileExportManager: TourDocMediaFileExportManager,
                pdfManager: PdfManager, backendConfig: BackendConfigType) {
        super(dataService, pdfManager);
        this.mediaFileExportManager = mediaFileExportManager;
        this.backendConfig = backendConfig;

        const sqlConfig: SqlConnectionConfig = this.backendConfig.TourDocSqlMytbDbAdapter;
        if (sqlConfig === undefined) {
            throw new Error('config for TourDocSqlMytbDbAdapter not exists');
        }
        const options = {
            knexOpts: {
                client: sqlConfig.client,
                connection: sqlConfig.connection
            }
        };
        this.knexRef = knex(options.knexOpts);
    }

    protected exportCommonDocRecordPdfFile(mdoc: CommonDocRecord, action: string, exportDir: string, exportName: string,
                                           processingOptions: ProcessingOptions) {
        return this.mediaFileExportManager.exportMediaRecordPdfFile(<TourDocRecord>mdoc,
            <TourDocMediaExportProcessingOptions & ProcessingOptions>{
                ...processingOptions,
                pdfBase: this.backendConfig.apiRoutePdfsStaticDir,
                exportBasePath: exportDir,
                exportBaseFileName: exportName,
                directoryProfile: 'default',
                fileNameProfile: 'default',
                resolutionProfile: 'default',
                jsonBaseElement: 'tdocs'
            });
    }

    protected generatePdfFileName(entity: CommonDocRecord): string {
        return this.generatePdfFileNameForHirarchy(entity, TourDocBackendGeoService.hierarchyConfig);
    }

    protected updatePdfEntity(entity: CommonDocRecord, fileName: string): Promise<CommonDocRecord> {
        const pdfEntityDbMapping = this.pdfEntityDbMapping.tables[entity.type]
            || this.pdfEntityDbMapping.tables[entity.type.toLowerCase()];
        if (!pdfEntityDbMapping) {
            return Promise.reject('no valid entityType:' + entity.type);
        }

        const dbFields = [];
        const dbValues = [];
        if (!pdfEntityDbMapping.fieldFilename) {
            return Promise.reject('no valid entityType:' + entity.type + ' missing fieldFilename');
        }

        dbFields.push(pdfEntityDbMapping.fieldFilename);
        dbValues.push(fileName !== undefined && fileName !== ''
            ? fileName
            : null);
        const arr = entity.id.split('_');
        if (arr.length !== 2) {
            return Promise.reject('invalid id: ' + entity.id);
        }

        const id = arr[1];
        const updateSqlQuery: RawSqlQueryData = {
            sql: 'UPDATE ' + pdfEntityDbMapping.table +
                ' SET ' + dbFields.map(field => field + '=?').join(', ') +
                ' WHERE ' + pdfEntityDbMapping.fieldId + ' = ?',
            parameters: dbValues.concat([id])
        };

        // console.log('call updatePdfEntity sql', updateSqlQuery, entity);
        return SqlUtils.executeRawSqlQueryData(this.knexRef, updateSqlQuery).then(() => {
            console.log('DONE - updatePdfEntity for: ', entity.type, entity.id, entity.name, pdfEntityDbMapping.fieldFilename);
            return Promise.resolve(entity);
        }).catch(reason => {
            console.error('ERROR - call updatePdfEntity sql', updateSqlQuery, entity, reason);
            return Promise.reject(reason);
        });
    }

    protected generateWebShotUrl(action: string, baseUrl: string, mdoc: CommonDocRecord, queryParams: string) {
        // TODO extract details from mdoc and addd to url
        return baseUrl + '/' + mdoc.id + '?print&' + queryParams;
    }

    protected generatePdfFileNameForHirarchy(entity: CommonDocRecord, hierarchyConfig: HierarchyConfig): string {
        if (!entity) {
            return undefined;
        }

        const locHierarchy = HierarchyUtils.getTxtHierarchy(hierarchyConfig, entity, false,  true, 3);
        const locName = StringUtils.generateTechnicalName(locHierarchy.join('-'));
        let name = StringUtils.generateTechnicalName(entity.name);

        const baseName = [entity.type, locName, entity.id].join('_') + '.pdf';
        if ([baseName, name].join('_').length > 140) {
            name = name.substring(0, 135 - baseName.length);
        }

        return [entity.type,
            locName,
            name,
            entity.id].join('_') + '.pdf';
    }

}
