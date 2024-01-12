import * as fs from 'fs';
import {TourDocDataServiceModule} from '../modules/tdoc-dataservice.module';
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

export class PdfManagerCommand extends CommonAdminCommand {
    protected createValidationRules(): {[key: string]: ValidationRule} {
        return {
            action: new KeywordValidationRule(true),
            backend: new SimpleConfigFilePathValidationRule(true),
            baseUrl: new HtmlValidationRule(false),
            ... ExportManagerUtils.createExportValidationRules(),
            ... ExportManagerUtils.createSearchFormValidationRules()
        };
    }

    protected definePossibleActions(): string[] {
        return ['exportImagePdf', 'exportLocationPdf', 'exportRoutePdf', 'exportTrackPdf'];
    }

    protected processCommandArgs(argv: {}): Promise<any> {
        const me = this;

        // importDir and outputDir are used in CommonMediaManagerCommand too
        argv['exportDir'] = TourDocFileUtils.normalizeCygwinPath(argv['exportDir']);

        const filePathConfigJson = argv['backend'];
        if (filePathConfigJson === undefined) {
            return Promise.reject('ERROR - parameters required backendConfig: "--backend"');
        }

        const action = argv['action'];
        const backendConfig: BackendConfigType = JSON.parse(fs.readFileSync(filePathConfigJson, {encoding: 'utf8'}));

        // @ts-ignore
        const writable = backendConfig.tdocWritable === true || backendConfig.tdocWritable === 'true';
        const dataService = TourDocDataServiceModule.getDataService('tdocSolrReadOnly', backendConfig);
        if (writable) {
            dataService.setWritable(true);
        }

        let promise: Promise<any>;
        const processingOptions: ProcessingOptions = {
            ignoreErrors: Number.parseInt(argv['ignoreErrors'], 10) || 0,
            parallel: Number.parseInt(argv['parallel'], 10),
        };
        const force = argv['force'] === true || argv['force'] === 'true';

        switch (action) {
            case 'exportRoutePdf':
                const exportDir = argv['exportDir'];
                const exportName = argv['exportName'];
                const baseUrl = argv['baseUrl'];

                if (baseUrl === undefined || baseUrl === '') {
                    console.error(action + ' missing parameter - usage: --baseUrl BASEURL', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --baseUrl BASEURL [-force true/false]');
                    return promise;
                }

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


                const nodePath = backendConfig.nodejsBinaryPath;
                const webshot2pdfCommandPath = backendConfig.webshot2pdfCommandPath;
                if (!nodePath || !webshot2pdfCommandPath) {
                    console.error(action + ' missing config - nodejsBinaryPath, webshot2pdfCommandPath', nodePath, webshot2pdfCommandPath);
                    promise = Promise.reject(action + ' missing config - nodejsBinaryPath, webshot2pdfCommandPath');
                    return promise;
                }
                console.log(action + ' starting with - nodejsBinaryPath, webshot2pdfCommandPath', nodePath, webshot2pdfCommandPath);

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
                const callback = function(mdoc: TourDocRecord): Promise<{}>[] {
                    const url = baseUrl + '/' + mdoc.id + '?print';
                    const fileName = me.generatePdfFileName(mdoc, TourDocBackendGeoService.hierarchyConfig);
                    const destFile = exportDir
                        + '/'
                        + fileName;

                    return [
                        new Promise<any>((resolve, reject) => {
                            if (!force && fs.existsSync(destFile)) {
                                const msg = 'SKIPPED - webshot2pdf url: "' + url + '" file: "' + destFile + '" file already exists';
                                console.log(msg)

                                exportResults.push({
                                    record: mdoc,
                                    exportFileEntry: fileName,
                                    externalRecordFieldMappings: undefined,
                                    mediaFileMappings: undefined
                                });

                                return resolve(msg);
                            }

                            ProcessUtils.executeCommandAsync(nodePath, ['--max-old-space-size=8192',
                                    webshot2pdfCommandPath,
                                    url,
                                    destFile],
                                function (buffer) {
                                    if (!buffer) {
                                        return;
                                    }
                                    console.log(buffer.toString(), webshot2pdfCommandPath,
                                        url,
                                        destFile);
                                },
                                function (buffer) {
                                    if (!buffer) {
                                        return;
                                    }
                                    console.error(buffer.toString());
                                },
                            ).then(code => {
                                if (code !== 0) {
                                    const errMsg = 'FAILED - webshot2pdf url: "' + url + '"' +
                                        ' file: "' + destFile + '" failed returnCode:' + code;
                                    console.warn(errMsg)
                                    return reject(errMsg);
                                }

                                const msg = 'SUCCESS - webshot2pdf url: "' + url + '"' +
                                    ' file: "' + destFile + '" succeeded returnCode:' + code;
                                console.log(msg)

                                exportResults.push({
                                    record: mdoc,
                                    exportFileEntry: fileName,
                                    externalRecordFieldMappings: undefined,
                                    mediaFileMappings: undefined
                                });

                                return resolve(msg);
                            }).catch(error => {
                                const errMsg = 'FAILED - webshot2pdf url: "' + url + '"' +
                                    ' file: "' + destFile + '" failed returnCode:' + error;
                                console.warn(errMsg)
                                return reject(errMsg);
                            })
                        })
                    ];
                };

                console.log('DO generate searchform for : ' + action, exportDir, processingOptions);
                promise = ExportManagerUtils.createSearchForm(type, argv).then(searchForm => {
                    console.log('START processing: ' + action, searchForm, exportDir, processingOptions);
                    return dataService.batchProcessSearchResult(searchForm, callback, {
                        loadDetailsMode: 'full',
                        loadTrack: false,
                        showFacets: false,
                        showForm: false
                    }, processingOptions);
                }).then(() => {
                    const exportListFile = exportDir + '/' + exportName + '.lst';
                    if (fs.existsSync(exportListFile) && !fs.statSync(exportListFile).isFile()) {
                        return Promise.reject('exportBaseFileName must be file');
                    }

                    const fileList = exportResults.map(value => {
                        return [value.exportFileEntry, value.record.name,  value.record.type, ''].join('\t')
                    }).join('\n')

                    fs.writeFileSync(exportListFile, fileList);
                    console.error('wrote fileList', exportListFile);

                    return Promise.resolve();
                }).then(() => {
                    const exportHtmlFile = exportDir + '/' + exportName + '.html';
                    if (fs.existsSync(exportHtmlFile) && !fs.statSync(exportHtmlFile).isFile()) {
                        return Promise.reject('exportBaseFileName must be file');
                    }

                    const fileList = exportResults.map(value => {
                        const fileName = value.exportFileEntry;
                        const name = value.record.name;
                        const rtype = value.record.type;
                        return `<div class='bookmark_line bookmark_line_$rtype'><div class='bookmark_file'><a href="$fileName" target="_blank">$fileName</a></div><div class='bookmark_name'>$name</div><div class='bookmark_page'></div></div>`
                            .replace(/\$fileName/g, fileName)
                            .replace(/\$name/g, name)
                            .replace(/\$rtype/g, rtype);
                    }).join('\n')

                    fs.writeFileSync(exportHtmlFile, fileList);
                    console.error('wrote htmlFile', exportHtmlFile);

                    return Promise.resolve();
                });

                break;
        }

        return promise;
    }

    public generatePdfFileName(entity: TourDocRecord, hierarchyConfig: HierarchyConfig): string {
        if (!entity) {
            return undefined;
        }

        const locHierarchy = HierarchyUtils.getTxtHierarchy(hierarchyConfig, entity, false,  true, 3);

        return [entity.type,
            StringUtils.generateTechnicalName(locHierarchy.join('-')),
            StringUtils.generateTechnicalName(entity.name),
            entity.id].join('_') + '.pdf';
    }

}
