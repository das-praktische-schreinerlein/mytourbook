import * as fs from 'fs';
import {TourDocFileUtils} from '../shared/tdoc-commons/services/tdoc-file.utils';
import {ProcessingOptions} from '@dps/mycms-commons/dist/search-commons/services/cdoc-search.service';
import {MediaExportProcessingOptions} from '@dps/mycms-server-commons/dist/backend-commons/modules/cdoc-mediafile-export.service';
import {CommonAdminCommand} from '@dps/mycms-server-commons/dist/backend-commons/commands/common-admin.command';
import {
    KeywordValidationRule,
    NumberValidationRule,
    SimpleConfigFilePathValidationRule,
    SimpleFilePathValidationRule,
    SolrValidationRule,
    ValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {BackendConfigType} from '../modules/backend.commons';
import {PDocExportService} from '../modules/pdoc-export.service';
import {PDocServerPlaylistService} from '../modules/pdoc-serverplaylist.service';
import {PDocAdapterResponseMapper} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-adapter-response.mapper';
import {PDocDataServiceModule} from '@dps/mycms-server-commons/dist/pdoc-backend-commons/modules/pdoc-dataservice.module';
import {utils} from 'js-data';
import {PDocSearchForm} from '@dps/mycms-commons/dist/pdoc-commons/model/forms/pdoc-searchform';

export class PageManagerCommand extends CommonAdminCommand {
    protected createValidationRules(): {[key: string]: ValidationRule} {
        return {
            action: new KeywordValidationRule(true),
            backend: new SimpleConfigFilePathValidationRule(true),
            exportDir: new SimpleFilePathValidationRule(false),
            exportName: new SimpleFilePathValidationRule(false),
            outputDir: new SimpleFilePathValidationRule(false),
            outputFile: new SimpleFilePathValidationRule(false),
            ignoreErrors: new NumberValidationRule(false, 1, 999999999, 10),
            parallel: new NumberValidationRule(false, 1, 99, 10),
            pageNum: new NumberValidationRule(false, 1, 999999999, 1),
            fulltext: new SolrValidationRule(false),
            playlists: new KeywordValidationRule(false),
            directoryProfile: new KeywordValidationRule(false),
            fileNameProfile: new KeywordValidationRule(false)
        };
    }

    protected definePossibleActions(): string[] {
        return [
            'exportPageFiles'
        ];
    }

    protected processCommandArgs(argv: {}): Promise<any> {
        // importDir and outputDir are used in CommonMediaManagerCommand too
        argv['outputDir'] = TourDocFileUtils.normalizeCygwinPath(argv['outputDir']);
        argv['outputFile'] = TourDocFileUtils.normalizeCygwinPath(argv['outputFile']);

        const filePathConfigJson = argv['backend'];
        if (filePathConfigJson === undefined) {
            return Promise.reject('ERROR - parameters required backendConfig: "--backend"');
        }

        const action = argv['action'];
        const backendConfig: BackendConfigType = JSON.parse(fs.readFileSync(filePathConfigJson, {encoding: 'utf8'}));

        const dataService = PDocDataServiceModule.getDataService('tdocSolrReadOnly', backendConfig);

        let promise: Promise<any>;
        let searchForm: PDocSearchForm;
        const processingOptions: ProcessingOptions = {
            ignoreErrors: Number.parseInt(argv['ignoreErrors'], 10) || 0,
            parallel: Number.parseInt(argv['parallel'], 10),
        };
        const pageNum = Number.parseInt(argv['pageNum'], 10);
        const fulltext = argv['fulltext'];
        const playlists = argv['playlists'];

        const exportDir = argv['exportDir'];
        const exportName = argv['exportName'];

        const playlistService = new PDocServerPlaylistService();
        const responseMapper = new PDocAdapterResponseMapper(backendConfig);
        const pdocExportService: PDocExportService = new PDocExportService(backendConfig, dataService, playlistService, responseMapper);

        switch (action) {
            case 'exportPageFiles':
                if (exportDir === undefined) {
                    console.error(action + ' missing parameter - usage: --exportDir EXPORTDIR', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --exportDir EXPORTDIR');
                    return promise;
                }

                if (exportName === undefined) {
                    console.error(action + ' missing parameter - usage: --exportName EXPORTNAME', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --exportName EXPORTNAME');
                    return promise;
                }

                const directoryProfile = argv['directoryProfile'];
                if (directoryProfile === undefined) {
                    console.error(action + ' missing parameter - usage: --directoryProfile directoryProfile', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --directoryProfile directoryProfile');
                    return promise;
                }

                const fileNameProfile = argv['fileNameProfile'];
                if (fileNameProfile === undefined) {
                    console.error(action + ' missing parameter - usage: --fileNameProfile fileNameProfile', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --fileNameProfile fileNameProfile');
                    return promise;
                }

                let type = 'UNKNOWN';
                switch (action) {
                    case 'exportPageFiles':
                        type = 'page';
                        break;
                }

                processingOptions.parallel = Number.isInteger(processingOptions.parallel) ? processingOptions.parallel : 1;
                searchForm = new PDocSearchForm({
                    type: type,
                    fulltext: fulltext,
                    playlists: playlists,
                    sort: 'm3uExport',
                    pageNum: Number.isInteger(pageNum) ? pageNum : 1});
                console.log('START processing: ' + action, searchForm, exportDir, processingOptions);

                promise = pdocExportService.exportMediaFiles(searchForm, <MediaExportProcessingOptions & ProcessingOptions> {
                    ...processingOptions,
                    exportBasePath: exportDir,
                    exportBaseFileName: exportName,
                    directoryProfile: directoryProfile,
                    fileNameProfile: fileNameProfile,
                    jsonBaseElement: 'pdocs'
                });

                break;
            default:
                console.error('unknown action:', argv);
                promise = utils.reject('unknown action');
        }

        return promise;
    }
}
