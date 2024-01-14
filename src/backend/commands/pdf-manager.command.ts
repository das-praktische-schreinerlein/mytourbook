import * as fs from 'fs';
import {SqlConnectionConfig, TourDocDataServiceModule} from '../modules/tdoc-dataservice.module';
import {TourDocFileUtils} from '../shared/tdoc-commons/services/tdoc-file.utils';
import {ProcessingOptions} from '@dps/mycms-commons/dist/search-commons/services/cdoc-search.service';
import {CommonAdminCommand} from '@dps/mycms-server-commons/dist/backend-commons/commands/common-admin.command';
import {
    HtmlValidationRule,
    KeywordValidationRule,
    SimpleConfigFilePathValidationRule,
    ValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {BackendConfigType} from '../modules/backend.commons';
import {ExportProcessingResult} from '@dps/mycms-commons/dist/search-commons/services/cdoc-export.service';
import {TourDocRecord} from '../shared/tdoc-commons/model/records/tdoc-record';
import {ProcessUtils} from '@dps/mycms-commons/dist/commons/utils/process.utils';
import {HierarchyConfig, HierarchyUtils} from '@dps/mycms-commons/dist/commons/utils/hierarchy.utils';
import {StringUtils} from '@dps/mycms-commons/dist/commons/utils/string.utils';
import {TourDocBackendGeoService} from '../modules/tdoc-backend-geo.service';
import {ExportManagerUtils} from './export-manager.utils';
import {TourDocExportService} from '../modules/tdoc-export.service';
import {TourDocAdapterResponseMapper} from '../shared/tdoc-commons/services/tdoc-adapter-response.mapper';
import {TourDocServerPlaylistService, TourDocServerPlaylistServiceConfig} from '../modules/tdoc-serverplaylist.service';
import {TourDocMediaExportProcessingOptions, TourDocMediaFileExportManager} from '../modules/tdoc-mediafile-export.service';
import {SitemapConfig} from '@dps/mycms-server-commons/dist/backend-commons/modules/sitemap-generator.module';
import {RawSqlQueryData, SqlUtils} from '@dps/mycms-commons/dist/search-commons/services/sql-utils';
import {TourDocSqlMytbDbConfig} from '../shared/tdoc-commons/services/tdoc-sql-mytbdb.config';
import * as knex from 'knex';

export class PdfManagerCommand extends CommonAdminCommand {

    protected pdfEntityDbMapping = TourDocSqlMytbDbConfig.pdfEntityDbMapping;

    protected createValidationRules(): {[key: string]: ValidationRule} {
        return {
            action: new KeywordValidationRule(true),
            backend: new SimpleConfigFilePathValidationRule(true),
            sitemap: new SimpleConfigFilePathValidationRule(true),
            baseUrl: new HtmlValidationRule(false),
            ... ExportManagerUtils.createExportValidationRules(),
            ... ExportManagerUtils.createSearchFormValidationRules()
        };
    }

    protected definePossibleActions(): string[] {
        return ['exportImagePdf', 'exportLocationPdf', 'exportRoutePdf', 'exportTrackPdf',
            'generateImagePdf', 'generateLocationPdf', 'generateRoutePdf', 'generateTrackPdf'];
    }

    protected processCommandArgs(argv: {}): Promise<any> {
        const me = this;

        // importDir and outputDir are used in CommonMediaManagerCommand too
        argv['exportDir'] = TourDocFileUtils.normalizeCygwinPath(argv['exportDir']);

        const filePathConfigJson = argv['backend'];
        if (filePathConfigJson === undefined) {
            return Promise.reject('ERROR - parameters required backendConfig: "--backend"');
        }

        const filePathSitemapConfigJson = argv['sitemap'];
        if (filePathSitemapConfigJson === undefined) {
            return Promise.reject('ERROR - parameters required sitemapConfig: "--sitemap"');
        }

        const action = argv['action'];
        const backendConfig: BackendConfigType = JSON.parse(fs.readFileSync(filePathConfigJson, {encoding: 'utf8'}));
        const sitemapConfig: SitemapConfig = JSON.parse(fs.readFileSync(filePathSitemapConfigJson, {encoding: 'utf8'}));

        // @ts-ignore
        const writable = backendConfig.tdocWritable === true || backendConfig.tdocWritable === 'true';
        const dataService = TourDocDataServiceModule.getDataService('tdocSolrReadOnly', backendConfig);
        if (writable) {
            dataService.setWritable(true);
        }

        const playlistConfig: TourDocServerPlaylistServiceConfig = {
            audioBaseUrl: backendConfig.playlistExportAudioBaseUrl,
            imageBaseUrl: backendConfig.playlistExportImageBaseUrl,
            videoBaseUrl: backendConfig.playlistExportVideoBaseUrl,
            useAudioAssetStoreUrls: backendConfig.playlistExportUseAudioAssetStoreUrls,
            useImageAssetStoreUrls: backendConfig.playlistExportUseImageAssetStoreUrls,
            useVideoAssetStoreUrls: backendConfig.playlistExportUseVideoAssetStoreUrls
        };
        const playlistService = new TourDocServerPlaylistService(playlistConfig);
        const tourDocMediaFileExportManager = new TourDocMediaFileExportManager(backendConfig.apiRoutePicturesStaticDir, playlistService);
        const tourDocExportManager = new TourDocExportService(backendConfig, dataService, playlistService, tourDocMediaFileExportManager,
            new TourDocAdapterResponseMapper(backendConfig));

        let promise: Promise<any>;
        const processingOptions: ProcessingOptions = {
            ignoreErrors: Number.parseInt(argv['ignoreErrors'], 10) || 0,
            parallel: Number.parseInt(argv['parallel'], 10),
        };
        const force = argv['force'] === true || argv['force'] === 'true';

        switch (action) {
            case 'generateImagePdf':
            case 'generateLocationPdf':
            case 'generateRoutePdf':
            case 'generateTrackPdf':
                const generateDir = backendConfig.apiRoutePdfsStaticDir;
                const baseUrl = sitemapConfig.showBaseUrl;

                if (baseUrl === undefined || baseUrl === '') {
                    console.error(action + ' missing config - baseUrl', baseUrl);
                    promise = Promise.reject(action + ' missing config - baseUrl: ' +  baseUrl);
                    return promise;
                }

                if (generateDir === undefined) {
                    console.error(action + ' missing config - apiRoutePdfsStaticDir', generateDir);
                    promise = Promise.reject(action + ' missing config - apiRoutePdfsStaticDir: ' +  generateDir);
                    return promise;
                }

                if (!fs.existsSync(generateDir)) {
                    return Promise.reject('apiRoutePdfsStaticDir not exists: ' + generateDir);
                }
                if (!fs.lstatSync(generateDir).isDirectory()) {
                    return Promise.reject('apiRoutePdfsStaticDir is no directory: ' + generateDir);
                }

                const nodePath = backendConfig.nodejsBinaryPath;
                const webshot2pdfCommandPath = backendConfig.webshot2pdfCommandPath;
                if (!nodePath || !webshot2pdfCommandPath) {
                    console.error(action + ' missing config - nodejsBinaryPath, webshot2pdfCommandPath', nodePath, webshot2pdfCommandPath);
                    promise = Promise.reject(action + ' missing config - nodejsBinaryPath, webshot2pdfCommandPath');
                    return promise;
                }
                console.log(action + ' starting with - nodejsBinaryPath, webshot2pdfCommandPath', nodePath, webshot2pdfCommandPath);

                const sqlConfig: SqlConnectionConfig = backendConfig.TourDocSqlMytbDbAdapter;
                if (sqlConfig === undefined) {
                    throw new Error('config for TourDocSqlMytbDbAdapter not exists');
                }
                const options = {
                    knexOpts: {
                        client: sqlConfig.client,
                        connection: sqlConfig.connection
                    }
                };
                const knexRef = knex(options.knexOpts);

                let generateType = 'UNKNOWN';
                switch (action) {
                    case 'generateImagePdf':
                        generateType = 'image';
                        break;
                    case 'generateLocationPdf':
                        generateType = 'location';
                        break;
                    case 'generateRoutePdf':
                        generateType = 'route';
                        break;
                    case 'generateTrackPdf':
                        generateType = 'track';
                        break;
                }

                const generateName = generateType;

                processingOptions.parallel = Number.isInteger(processingOptions.parallel) ? processingOptions.parallel : 1;
                const generateResults: ExportProcessingResult<TourDocRecord>[]  = [];
                const generateCallback = function(mdoc: TourDocRecord): Promise<{}>[] {
                    const url = baseUrl + '/' + mdoc.id + '?print';
                    const fileName = mdoc.pdfFile !== undefined && mdoc.pdfFile.length > 5
                        ? mdoc.pdfFile
                        : me.generatePdfFileName(mdoc, TourDocBackendGeoService.hierarchyConfig);
                    const relDestPath = mdoc.type
                        + '/'
                        + fileName;
                    const absDestPath =  generateDir
                        + '/'
                        + relDestPath;

                    return [
                        new Promise<any>((resolve, reject) => {
                            if (!force && fs.existsSync(absDestPath)) {
                                const msg = 'SKIPPED - webshot2pdf url: "' + url + '" file: "' + absDestPath + '" file already exists';
                                console.log(msg)

                                generateResults.push({
                                    record: mdoc,
                                    exportFileEntry: relDestPath,
                                    externalRecordFieldMappings: undefined,
                                    mediaFileMappings: undefined
                                });

                                if (mdoc.pdfFile !== fileName) {
                                    return me.updatePdfEntity(knexRef, mdoc, fileName).then(() => {
                                        resolve();
                                    }).catch(err => {
                                        reject(err);
                                    });
                                }

                                return resolve(msg);
                            }

                            return ProcessUtils.executeCommandAsync(nodePath, ['--max-old-space-size=8192',
                                    webshot2pdfCommandPath,
                                    url,
                                    absDestPath],
                                function (buffer) {
                                    if (!buffer) {
                                        return;
                                    }
                                    console.log(buffer.toString(), webshot2pdfCommandPath,
                                        url,
                                        absDestPath);
                                },
                                function (buffer) {
                                    if (!buffer) {
                                        return;
                                    }
                                    console.error(buffer.toString());
                                }
                            ).then(code => {
                                if (code !== 0) {
                                    const errMsg = 'FAILED - webshot2pdf url: "' + url + '"' +
                                        ' file: "' + absDestPath + '" failed returnCode:' + code;
                                    console.warn(errMsg)
                                    return reject(errMsg);
                                }

                                const msg = 'SUCCESS - webshot2pdf url: "' + url + '"' +
                                    ' file: "' + absDestPath + '" succeeded returnCode:' + code;
                                console.log(msg)

                                generateResults.push({
                                    record: mdoc,
                                    exportFileEntry: relDestPath,
                                    externalRecordFieldMappings: undefined,
                                    mediaFileMappings: undefined
                                });

                                if (mdoc.pdfFile !== fileName) {
                                    return me.updatePdfEntity(knexRef, mdoc, fileName).then(() => {
                                        resolve();
                                    }).catch(err => {
                                        reject(err);
                                    });
                                }

                                return resolve(msg);
                            }).catch(error => {
                                const errMsg = 'FAILED - webshot2pdf url: "' + url + '"' +
                                    ' file: "' + absDestPath + '" failed returnCode:' + error;
                                console.warn(errMsg)
                                return reject(errMsg);
                            })
                        })
                    ];
                };

                console.log('DO generate searchform for : ' + action, generateDir, processingOptions);
                promise = ExportManagerUtils.createSearchForm(generateType, argv).then(searchForm => {
                    console.log('START processing: ' + action, searchForm, generateDir, processingOptions);
                    return dataService.batchProcessSearchResult(searchForm, generateCallback, {
                        loadDetailsMode: undefined,
                        loadTrack: false,
                        showFacets: false,
                        showForm: false
                    }, processingOptions);
                }).then(() => {
                    return tourDocExportManager.generatePdfResultListFile(generateDir, generateName, generateResults);
                });

                break;
            case 'exportImagePdf':
            case 'exportLocationPdf':
            case 'exportRoutePdf':
            case 'exportTrackPdf':
                const exportDir = argv['exportDir'];
                const exportName = argv['exportName'];

                if (exportDir === undefined) {
                    console.error(action + ' missing parameter - usage: --exportDir EXPORTDIR', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --exportDir EXPORTDIR [-force true/false]');
                    return promise;
                }

                if (exportName === undefined) {
                    console.error(action + ' missing parameter - usage: --exportName EXPORTNAME', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --exportName EXPORTNAME');
                    return promise;
                }

                if (!fs.existsSync(exportDir)) {
                    return Promise.reject('exportDir not exists');
                }
                if (!fs.lstatSync(exportDir).isDirectory()) {
                    return Promise.reject('exportBasePath is no directory');
                }

                let type = 'UNKNOWN';
                switch (action) {
                    case 'exportImagePdf':
                        type = 'image';
                        break;
                    case 'exportLocationPdf':
                        type = 'location';
                        break;
                    case 'exportRoutePdf':
                        type = 'route';
                        break;
                    case 'exportTrackPdf':
                        type = 'track';
                        break;
                }

                processingOptions.parallel = Number.isInteger(processingOptions.parallel) ? processingOptions.parallel : 1;
                const exportResults: ExportProcessingResult<TourDocRecord>[]  = [];
                const exportCallback = function(mdoc: TourDocRecord): Promise<{}>[] {
                    return [
                        tourDocMediaFileExportManager.exportMediaRecordPdfFiles(mdoc,
                            <TourDocMediaExportProcessingOptions & ProcessingOptions> {
                                ...processingOptions,
                                pdfBase: backendConfig.apiRoutePdfsStaticDir,
                                exportBasePath: exportDir,
                                exportBaseFileName: exportName,
                                directoryProfile: 'default',
                                fileNameProfile: 'default',
                                resolutionProfile: 'default',
                                jsonBaseElement: 'tdocs'
                            })
                    ];
                };

                console.log('DO generate searchform for : ' + action, exportDir, processingOptions);
                promise = ExportManagerUtils.createSearchForm(type, argv).then(searchForm => {
                    console.log('START processing: ' + action, searchForm, exportDir, processingOptions);
                    return dataService.batchProcessSearchResult(searchForm, exportCallback, {
                        loadDetailsMode: 'full',
                        loadTrack: false,
                        showFacets: false,
                        showForm: false
                    }, processingOptions);
                }).then(() => {
                    return tourDocExportManager.generatePdfResultListFile(exportDir, exportName, exportResults);
                });
        }

        return promise;
    }

    protected generatePdfFileName(entity: TourDocRecord, hierarchyConfig: HierarchyConfig): string {
        if (!entity) {
            return undefined;
        }

        const locHierarchy = HierarchyUtils.getTxtHierarchy(hierarchyConfig, entity, false,  true, 3);
        const locName = StringUtils.generateTechnicalName(locHierarchy.join('-'));
        let name = StringUtils.generateTechnicalName(entity.name);

        if ((locName.length + name.length) > 160) {
            name = name.substring(0, 160 - locName.length);
        }

        return [entity.type,
            locName,
            name,
            entity.id].join('_') + '.pdf';
    }

    protected updatePdfEntity(knexRef, entity: TourDocRecord, fileName: string): Promise<TourDocRecord> {
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
                ' SET ' + dbFields.map( field => field + '=?').join(', ') +
                ' WHERE ' + pdfEntityDbMapping.fieldId + ' = ?',
            parameters: dbValues.concat([id])
        };

        // console.log('call updatePdfEntity sql', updateSqlQuery, entity);
        return SqlUtils.executeRawSqlQueryData(knexRef, updateSqlQuery).then( () => {
            console.log('DONE - updatePdfEntity for: ', entity.type, entity.id, entity.name, pdfEntityDbMapping.fieldFilename);
            return Promise.resolve(entity);
        }).catch(reason => {
            console.error('ERROR - call updatePdfEntity sql', updateSqlQuery, entity, reason);
            return Promise.reject(reason);
        });
    }
}
