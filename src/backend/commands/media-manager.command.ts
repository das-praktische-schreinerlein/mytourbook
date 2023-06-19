import * as fs from 'fs';
import {TourDocSearchForm} from '../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocDataServiceModule} from '../modules/tdoc-dataservice.module';
import {TourDocMediaManagerModule} from '../modules/tdoc-media-manager.module';
import {utils} from 'js-data';
import {TourDocAdapterResponseMapper} from '../shared/tdoc-commons/services/tdoc-adapter-response.mapper';
import * as os from 'os';
import {MediaManagerModule} from '@dps/mycms-server-commons/dist/media-commons/modules/media-manager.module';
import {CommonMediaManagerCommand} from '@dps/mycms-server-commons/dist/backend-commons/commands/common-media-manager.command';
import {TourDocFileUtils} from '../shared/tdoc-commons/services/tdoc-file.utils';
import {FileSystemDBSyncType} from '@dps/mycms-server-commons/dist/backend-commons/modules/cdoc-media-manager.module';
import {ProcessingOptions} from '@dps/mycms-commons/dist/search-commons/services/cdoc-search.service';
import {TourDocMediaFileExportManager} from '../modules/tdoc-mediafile-export.service';
import {MediaExportResolutionProfiles, TourDocExportService} from '../modules/tdoc-export.service';
import {TourDocServerPlaylistService, TourDocServerPlaylistServiceConfig} from '../modules/tdoc-serverplaylist.service';
import {TourDocMediaFileImportManager} from '../modules/tdoc-mediafile-import.service';
import {MediaExportProcessingOptions} from '@dps/mycms-server-commons/dist/backend-commons/modules/cdoc-mediafile-export.service';
import {CommonAdminCommand} from '@dps/mycms-server-commons/dist/backend-commons/commands/common-admin.command';
import {
    IdCsvValidationRule,
    KeywordValidationRule,
    NumberValidationRule,
    SimpleConfigFilePathValidationRule,
    SimpleFilePathListValidationRule,
    SimpleFilePathValidationRule,
    SolrValidationRule,
    ValidationRule,
    WhiteListValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {DateUtils} from '@dps/mycms-commons/dist/commons/utils/date.utils';
import {FileUtils} from '@dps/mycms-commons/dist/commons/utils/file.utils';
import {ViewerManagerModule} from '@dps/mycms-server-commons/dist/media-commons/modules/viewer-manager.module';
import {BackendConfigType} from '../modules/backend.commons';
import path from 'path';

export class MediaManagerCommand extends CommonAdminCommand {
    protected createValidationRules(): {[key: string]: ValidationRule} {
        return {
            action: new KeywordValidationRule(true),
            backend: new SimpleConfigFilePathValidationRule(true),
            importDir: new SimpleFilePathValidationRule(false),
            srcFile: new SimpleFilePathValidationRule(false),
            srcFiles: new SimpleFilePathListValidationRule(false),
            pdocFile: new SimpleFilePathValidationRule(false),
            exportDir: new SimpleFilePathValidationRule(false),
            exportName: new SimpleFilePathValidationRule(false),
            inlineProfile: new KeywordValidationRule(false),
            outputDir: new SimpleFilePathValidationRule(false),
            outputFile: new SimpleFilePathValidationRule(false),
            ignoreErrors: new NumberValidationRule(false, 1, 999999999, 10),
            parallel: new NumberValidationRule(false, 1, 99, 10),
            pageNum: new NumberValidationRule(false, 1, 999999999, 1),
            actiontype: new IdCsvValidationRule(false),
            fulltext: new SolrValidationRule(false),
            persons: new KeywordValidationRule(false),
            playlists: new KeywordValidationRule(false),
            personalRateOverall: new KeywordValidationRule(false),
            directoryProfile: new KeywordValidationRule(false),
            fileNameProfile: new KeywordValidationRule(false),
            resolutionProfile: new KeywordValidationRule(false),
            rateMinFilter: new NumberValidationRule(false, 0, 15, undefined),
            showNonBlockedOnly: new WhiteListValidationRule(false, [
                'showall',
                'nonblocked_meonly',
                'nonblocked_innerfamily',
                'nonblocked_family',
                'nonblocked_friends',
                'nonblocked_nonpublic',
                'blocked_meonly',
                'blocked_innerfamily',
                'blocked_family',
                'blocked_friends',
                'blocked_nonpublic',
                'nonblocked_public',
                'nonblocked'], undefined),
            additionalMappingsFile: new SimpleConfigFilePathValidationRule(false),
            rotate: new NumberValidationRule(false, 1, 360, 0),
            force: new WhiteListValidationRule(false, [true, false, 'true', 'false'], false),
            createViewer: new WhiteListValidationRule(false, [true, false, 'html', 'htmlWithoutImage'], false),
            skipCheckForExistingFilesInDataBase : new KeywordValidationRule(false),
            renameFileIfExists:  new WhiteListValidationRule(false, [true, false, 'true', 'false'], false)
        };
    }

    protected definePossibleActions(): string[] {
        return ['readImageDates', 'readVideoDates', 'readImageMetaData', 'readVideoMetaData',
            'scaleImages', 'scaleVideos',
            'exportImageFiles', 'exportRouteFiles', 'exportTrackFiles', 'exportVideoFiles',
            'setPDocsInViewerFile', 'generateHtmlViewerFileForExport', 'inlineDataOnViewerFile',
            'generateTourDocsFromMediaDir',
            'findCorrespondingTourDocRecordsForMedia', 'insertSimilarMatchings',
            'convertVideosFromMediaDirToMP4',
            'scaleVideosFromMediaDirToMP4',
            'generateVideoScreenshotFromMediaDir',
            'generateVideoPreviewFromMediaDir',
            'rotateVideo'];
    }

    protected processCommandArgs(argv: {}): Promise<any> {
        const me = this;

        // importDir and outputDir are used in CommonMediaManagerCommand too
        argv['importDir'] = TourDocFileUtils.normalizeCygwinPath(argv['importDir']);
        argv['srcFile'] = TourDocFileUtils.normalizeCygwinPath(argv['srcFile']);
        argv['pdocFile'] = TourDocFileUtils.normalizeCygwinPath(argv['pdocFile']);
        argv['outputDir'] = TourDocFileUtils.normalizeCygwinPath(argv['outputDir']);
        argv['outputFile'] = TourDocFileUtils.normalizeCygwinPath(argv['outputFile']);

        const filePathConfigJson = argv['backend'];
        if (filePathConfigJson === undefined) {
            return Promise.reject('ERROR - parameters required backendConfig: "--backend"');
        }

        const action = argv['action'];
        const importDir = argv['importDir'];
        const outputFile = argv['outputFile'];
        const backendConfig: BackendConfigType = JSON.parse(fs.readFileSync(filePathConfigJson, {encoding: 'utf8'}));

        // @ts-ignore
        const writable = backendConfig.tdocWritable === true || backendConfig.tdocWritable === 'true';
        const dataService = TourDocDataServiceModule.getDataService('tdocSolrReadOnly', backendConfig);
        if (writable) {
            dataService.setWritable(true);
        }

        let promise: Promise<any>;
        let searchForm: TourDocSearchForm;
        const processingOptions: ProcessingOptions = {
            ignoreErrors: Number.parseInt(argv['ignoreErrors'], 10) || 0,
            parallel: Number.parseInt(argv['parallel'], 10),
        };
        const pageNum = Number.parseInt(argv['pageNum'], 10);
        const actiontype = argv['actiontype'];
        const fulltext = argv['fulltext'];
        const persons = argv['persons'];
        const personalRateOverall = argv['personalRateOverall'];
        const playlists = argv['playlists'];
        const skipCheckForExistingFilesInDataBase = argv['skipCheckForExistingFilesInDataBase'] === true
            || argv['skipCheckForExistingFilesInDataBase'] === 'true';
        const renameFileIfExists = !!argv['renameFileIfExists'];

        const srcFile = argv['srcFile'];
        const pdocFile = argv['pdocFile'];
        const srcFiles: string[] = argv['srcFiles']
            ? argv['srcFiles'].split(',')
            : [];
        const createHtml = argv['createHtml'];
        const exportDir = argv['exportDir'];
        const exportName = argv['exportName'];
        const force = argv['force'] === true || argv['force'] === 'true';
        const inlineProfile = argv['inlineProfile'];

        // TODO skipMediaCheck... as option

        const mediaManagerModule = new MediaManagerModule(backendConfig.imageMagicAppPath, os.tmpdir());
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
        const tourDocMediaFileImportManager = new TourDocMediaFileImportManager(backendConfig, dataService, mediaManagerModule,
            skipCheckForExistingFilesInDataBase);
        const tourDocExportManager = new TourDocExportService(backendConfig, dataService, playlistService, tourDocMediaFileExportManager,
            new TourDocAdapterResponseMapper(backendConfig));
        const tdocManagerModule = new TourDocMediaManagerModule(backendConfig, dataService, mediaManagerModule, tourDocExportManager,
            tourDocMediaFileImportManager, {});
        const commonMediadManagerCommand = new CommonMediaManagerCommand(backendConfig);
        const viewerManagerModule = new ViewerManagerModule();

        switch (action) {
            case 'readImageDates':
                processingOptions.parallel = Number.isInteger(processingOptions.parallel) ? processingOptions.parallel : 1;
                searchForm = new TourDocSearchForm({ type: 'image', sort: 'dateAsc',
                    pageNum: Number.isInteger(pageNum) ? pageNum : 1});
                if (!force) {
                    searchForm.moreFilter = 'noMetaOnly:noMetaOnly'
                }
                console.log('START processing: readMediaDates', searchForm, processingOptions);

                promise = tdocManagerModule.readAndUpdateMediaDates(searchForm, processingOptions);
                break;
            case 'readVideoDates':
                processingOptions.parallel = Number.isInteger(processingOptions.parallel) ? processingOptions.parallel : 1;
                searchForm = new TourDocSearchForm({ type: 'video', sort: 'dateAsc',
                    pageNum: Number.isInteger(pageNum) ? pageNum : 1});
                if (!force) {
                    searchForm.moreFilter = 'noMetaOnly:noMetaOnly'
                }
                console.log('START processing: readMediaDates', searchForm, processingOptions);

                promise = tdocManagerModule.readAndUpdateMediaDates(searchForm, processingOptions);

                break;
            case 'readImageMetaData':
                processingOptions.parallel = Number.isInteger(processingOptions.parallel) ? processingOptions.parallel : 1;
                searchForm = new TourDocSearchForm({ type: 'image', sort: 'dateAsc',
                    pageNum: Number.isInteger(pageNum) ? pageNum : 1});
                if (!force) {
                    searchForm.moreFilter = 'noMetaOnly:noMetaOnly'
                }
                console.log('START processing: readMp3MetaData', searchForm, processingOptions);

                promise = tdocManagerModule.syncExistingMetaDataFromFiles(searchForm, processingOptions);
                break;
            case 'readVideoMetaData':
                processingOptions.parallel = Number.isInteger(processingOptions.parallel) ? processingOptions.parallel : 1;
                searchForm = new TourDocSearchForm({ type: 'video', sort: 'dateAsc',
                    pageNum: Number.isInteger(pageNum) ? pageNum : 1});
                if (!force) {
                    searchForm.moreFilter = 'noMetaOnly:noMetaOnly'
                }
                console.log('START processing: readMp3MetaData', searchForm, processingOptions);

                promise = tdocManagerModule.syncExistingMetaDataFromFiles(searchForm, processingOptions);
                break;
            case 'scaleImages':
                processingOptions.parallel = Number.isInteger(processingOptions.parallel) ? processingOptions.parallel : 5;
                searchForm = new TourDocSearchForm({ type: 'image', sort: 'dateAsc',
                    pageNum: Number.isInteger(pageNum) ? pageNum : 1});
                console.log('START processing: scaleImages', searchForm, processingOptions);

                promise = tdocManagerModule.scaleImagesToDefaultWidth(searchForm, processingOptions);

                break;
            case 'scaleVideos':
                processingOptions.parallel = Number.isInteger(processingOptions.parallel) ? processingOptions.parallel : 5;
                searchForm = new TourDocSearchForm({ type: 'video', sort: 'dateAsc',
                    pageNum: Number.isInteger(pageNum) ? pageNum : 1});
                console.log('START processing: scaleVideos', searchForm, processingOptions);

                promise = tdocManagerModule.scaleVideosToDefaultWidth(searchForm, processingOptions);

                break;
            case 'exportImageFiles':
            case 'exportRouteFiles':
            case 'exportTrackFiles':
            case 'exportVideoFiles':
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

                const resolutionProfile = argv['resolutionProfile'];
                if (resolutionProfile === undefined || !Object.keys(MediaExportResolutionProfiles).includes(resolutionProfile)) {
                    console.error(action + ' missing parameter - usage: --resolutionProfile {' +
                        Object.keys(MediaExportResolutionProfiles).join(', ') + '}', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --resolutionProfile {' +
                        Object.keys(MediaExportResolutionProfiles).join(', ') + '}');
                    return promise;
                }

                if (createHtml && !srcFile) {
                    console.error(action + ' missing parameter - usage: --srcFile srcFileForHtmlViewer', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --srcFile srcFileForHtmlViewer');
                    return promise;
                }

                let type = 'UNKNOWN';
                switch (action) {
                    case 'exportImageFiles':
                        type = 'image';
                        break;
                    case 'exportRouteFiles':
                        type = 'route';
                        break;
                    case 'exportTrackFiles':
                        type = 'track';
                        break;
                    case 'exportVideoFiles':
                        type = 'video';
                        break;
                }

                processingOptions.parallel = Number.isInteger(processingOptions.parallel) ? processingOptions.parallel : 1;
                searchForm = new TourDocSearchForm({
                    type: type,
                    actiontype: actiontype,
                    fulltext: fulltext,
                    persons: persons,
                    personalRateOverall: personalRateOverall,
                    playlists: playlists,
                    sort: 'm3uExport',
                    pageNum: Number.isInteger(pageNum) ? pageNum : 1});

                const rateMinFilter = argv['rateMinFilter'];
                if (rateMinFilter !== undefined && Number.isInteger(rateMinFilter)) {
                    const rateFilters = [];
                    for (let i = Number.parseInt(rateMinFilter, 10); i >= 0 && i <= 15; i++) {
                        rateFilters.push(i + '');
                    }
                    if (rateFilters.length > 0) {
                        searchForm.personalRateOverall = rateFilters.join(',');
                    }
                }

                const blockedFilters = argv['showNonBlockedOnly'] + '';
                if (blockedFilters !== undefined && blockedFilters.toLowerCase() !== 'showall') {
                    let blockedValues: string[] = undefined;
                    for (const blockedFilter of blockedFilters.split(',')) {
                        switch (blockedFilter) {
                            case 'nonblocked_meonly':
                                blockedValues = ['null', '0',
                                    '1', '2', '3', '4', '5',
                                    '6', '7', '8', '9', '10',
                                    '11', '12', '13', '14', '15',
                                    '16', '17', '18', '19', '20',
                                    '21', '22', '23', '24', '25'];
                                break;
                            case 'nonblocked_innerfamily':
                                blockedValues = ['null', '0',
                                    '1', '2', '3', '4', '5',
                                    '6', '7', '8', '9', '10',
                                    '11', '12', '13', '14', '15',
                                    '16', '17', '18', '19', '20'];
                                break;
                            case 'nonblocked_family':
                                blockedValues = ['null', '0',
                                    '1', '2', '3', '4', '5',
                                    '6', '7', '8', '9', '10',
                                    '11', '12', '13', '14', '15'];
                                break;
                            case 'nonblocked_friends':
                                blockedValues = ['null', '0',
                                    '1', '2', '3', '4', '5',
                                    '6', '7', '8', '9', '10'];
                                break;
                            case 'nonblocked_nonpublic':
                                blockedValues = ['null', '0',
                                    '1', '2', '3', '4', '5'];
                                break;
                            case 'blocked_meonly':
                                blockedValues.push('21', '22', '23', '24', '25');
                                break;
                            case 'blocked_innerfamily':
                                blockedValues.push('16', '17', '18', '19', '20');
                                break;
                            case 'blocked_family':
                                blockedValues.push('11', '12', '13', '14', '15');
                                break;
                            case 'blocked_friends':
                                blockedValues.push('6', '7', '8', '9', '10');
                                break;
                            case 'blocked_nonpublic':
                                blockedValues.push('1', '2', '3', '4', '5');
                                break;
                            case 'nonblocked_public':
                            case 'nonblocked':
                                blockedValues = ['null', '0'];
                                break
                            default:
                                console.error(action + ' invalid parameter - usage: --showNonBlockedOnly FILTER', argv);
                                promise = Promise.reject(action + ' missing parameter - usage: --showNonBlockedOnly srcFileForHtmlViewer');
                                return promise;
                        }
                    }

                    if (blockedValues && blockedValues.length  > 0) {
                        searchForm.moreFilter = searchForm.moreFilter
                            ? searchForm.moreFilter + '_,_'
                            : '';
                        searchForm.moreFilter = searchForm.moreFilter + 'blocked_i:' + blockedValues.join(',');
                    }
                }
                console.log('START processing: ' + action, searchForm, exportDir, processingOptions);

                promise = tdocManagerModule.exportMediaFiles(searchForm, <MediaExportProcessingOptions & ProcessingOptions> {
                    ...processingOptions,
                    exportBasePath: exportDir,
                    exportBaseFileName: exportName,
                    directoryProfile: directoryProfile,
                    fileNameProfile: fileNameProfile,
                    resolutionProfile: resolutionProfile,
                    jsonBaseElement: 'tdocs'
                }).then((result) => {
                    if (!createHtml || !srcFile) {
                        return Promise.resolve(result);
                    }

                    const exportJsonFile = exportDir + '/' + exportName + '.tdocsexport.json';
                    return viewerManagerModule.generateViewerHtmlFile(srcFile,  [exportJsonFile],
                        exportDir + '/' + exportName + '.html', 100, 'tdocs',
                        function (html: string) {
                            return viewerManagerModule.htmlConfigConverter(html, 'staticTDocsFiles'); },
                        function (html: string, jsonPFileName: string) {
                            return viewerManagerModule.jsonToJsTargetContentConverter(html, jsonPFileName,
                                'importStaticDataTDocsJsonP'); },
                        function (html: string, dataFileConfigName: string) {
                            return viewerManagerModule.htmlInlineFileConverter(html, dataFileConfigName,
                                'staticTDocsFiles'); }
                    );
                });

                break;
            case 'setPDocsInViewerFile':
                if (srcFile === undefined) {
                    console.error(action + ' missing parameter - usage: --srcFile SRCFILE', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --srcFile SRCFILE');
                    return promise;
                }

                if (pdocFile === undefined) {
                    console.error(action + ' missing parameter - usage: --pdocFile PDOCFILE', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --pdocFile PDOCFILE');
                    return promise;
                }

                promise = viewerManagerModule.generateViewerHtmlFile(srcFile, [pdocFile],
                    srcFile, 999999999, 'pdocs',
                    function (html: string) {
                        return html;
                    },
                    function (html: string, jsonPFileName: string) {
                        return viewerManagerModule.jsonToJsTargetContentConverter(html, jsonPFileName,
                            'importStaticDataPDocsJsonP');
                    },
                    function (html: string, jsonPFilePath: string) {
                        return me.htmlPDocInlineFileConverter(html, jsonPFilePath,
                            'staticPDocsFile');
                    }
                );
                break;
            case 'generateHtmlViewerFileForExport':
                if (createHtml && !srcFile) {
                    console.error(action + ' missing parameter - usage: --srcFile srcFileForHtmlViewer', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --srcFile srcFileForHtmlViewer');
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

                if (srcFiles.length < 1) {
                    console.error(action + ' missing parameter - usage: --srcFiles JSONFILE,JSONFILE2...', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --srcFiles JSONFILE,JSONFILE2...');
                    return promise;
                }

                promise = FileUtils.mergeJsonFiles(srcFiles, exportDir + '/' + exportName + '-merged.tdocexport.json', 'id', 'tdocs')
                    .then((resultFile) => {
                        return viewerManagerModule.generateViewerHtmlFile(srcFile, [resultFile],
                            exportDir + '/' + exportName + '.html', 100, 'tdocs',
                            function (html: string) {
                                return viewerManagerModule.htmlConfigConverter(html, 'staticTDocsFiles');
                            },
                            function (html: string, jsonPFileName: string) {
                                return viewerManagerModule.jsonToJsTargetContentConverter(html, jsonPFileName,
                                    'importStaticDataTDocsJsonP');
                            },
                            function (html: string, jsonPFilePath: string) {
                                return viewerManagerModule.htmlInlineFileConverter(html, jsonPFilePath,
                                    'staticTDocsFiles');
                            }
                        );
                });

                break;
            case 'inlineDataOnViewerFile':
                if (!backendConfig.nodejsBinaryPath || !backendConfig.inlineJsPath) {
                    console.error(action + ' missing config - nodejsBinaryPath, inlineJsPath');
                    promise = Promise.reject(action + ' missing config - nodejsBinaryPath, inlineJsPath');
                    return promise;
                }

                if (srcFile === undefined) {
                    console.error(action + ' missing parameter - usage: --srcFile SRCFILE', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --srcFile SRCFILE');
                    return promise;
                }

                const targetFileName = outputFile !== undefined
                    ? outputFile
                    : srcFile

                promise = viewerManagerModule.inlineDataOnViewerFile(
                    backendConfig.nodejsBinaryPath,
                    backendConfig.inlineJsPath,
                    srcFile,
                    targetFileName,
                    inlineProfile);

                break;
            case 'generateTourDocsFromMediaDir':
                if (importDir === undefined) {
                    console.error(action + ' missing parameter - usage: --importDir INPUTDIR', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --importDir INPUTDIR --outputFile outputFile [-force true/false]');
                    return promise;
                }
                if (outputFile === undefined) {
                    console.error(action + ' missing parameter - usage: --outputFile OUTPUTFILE', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --importDir INPUTDIR --outputFile outputFile [-force true/false]');
                    return promise;
                }

                let fileCheckPromise2: Promise<any>;
                if (fs.existsSync(outputFile)) {
                    if (!renameFileIfExists) {
                        console.error(action + ' outputFile must not exist', argv);
                        promise = Promise.reject('outputFile must not exist');
                        return promise;
                    }

                    const newFile = outputFile + '.' + DateUtils.formatToFileNameDate(new Date(), '', '-', '') + '-export.MOVED';
                    fileCheckPromise2 = FileUtils.moveFile(outputFile, newFile, false, true, false);
                } else {
                    fileCheckPromise2 = Promise.resolve();
                }

                promise = fileCheckPromise2.then(() => {
                    console.log('START processing: generateTourDocRecordsFromMediaDir', importDir);
                    return tdocManagerModule.generateTourDocRecordsFromMediaDir(importDir);
                }).then(value => {
                    const responseMapper = new TourDocAdapterResponseMapper(backendConfig);
                    const tdocs = [];
                    for (const tdoc of value) {
                        tdocs.push(responseMapper.mapToAdapterDocument({}, tdoc));
                    }
                    fs.writeFileSync(outputFile, JSON.stringify({ tdocs: tdocs}, undefined, ' '));
                });

                break;
            case 'findCorrespondingTourDocRecordsForMedia':
                if (importDir === undefined) {
                    console.error(action + ' missing parameter - usage: --importDir INPUTDIR', argv);
                    promise = utils.reject(action + ' missing parameter - usage: --importDir INPUTDIR');
                    return promise;
                }
                if (outputFile === undefined) {
                    console.error(action + ' missing parameter - usage: --outputFile OUTPUTFILE', argv);
                    promise = utils.reject(action + ' missing parameter - usage: --importDir INPUTDIR --outputFile outputFile [-force true/false]');
                    return promise;
                }

                const additionalMappingsJson = argv['additionalMappingsFile'];
                let additionalMappings: {[key: string]: FileSystemDBSyncType};
                if (additionalMappingsJson) {
                    const additionalMappingsSrc = JSON.parse(fs.readFileSync(additionalMappingsJson, {encoding: 'utf8'}));
                    additionalMappings = tdocManagerModule.prepareAdditionalMappings(additionalMappingsSrc, false);
                }

                let fileCheckPromise: Promise<any>;
                if (fs.existsSync(outputFile)) {
                    if (!renameFileIfExists) {
                        console.error(action + ' outputFile must not exist', argv);
                        promise = Promise.reject('outputFile must not exist');
                        return promise;
                    }

                    const newFile = outputFile + '.' + DateUtils.formatToFileNameDate(new Date(), '', '-', '') + '-export.MOVED';
                    fileCheckPromise = FileUtils.moveFile(outputFile, newFile, false, true, false);
                } else {
                    fileCheckPromise = Promise.resolve();
                }

                promise = fileCheckPromise.then(() => {
                    console.log('START processing: findCorrespondingTourDocRecordsForMedia', additionalMappingsJson);
                    return tdocManagerModule.findCorrespondingCommonDocRecordsForMedia(importDir, additionalMappings);
                }).then(value => {
                    fs.writeFileSync(outputFile, JSON.stringify({
                        tdocs: value,
                        fileBaseDir: importDir,
                        dbImageBaseDir: backendConfig.apiRoutePicturesStaticDir + '/' +
                            (backendConfig.apiRouteStoredPicturesResolutionPrefix || '') + 'full/',
                        dbVideoBaseDir: backendConfig.apiRouteVideosStaticDir + '/'
                            + (backendConfig.apiRouteStoredVideosResolutionPrefix || '') + 'full/'
                    }, undefined, ' '));
                });

                break;
            case 'insertSimilarMatchings':
                const additionalImportMappingsJson = argv['additionalMappingsFile'];
                if (additionalImportMappingsJson === undefined) {
                    console.error(action + ' missing parameter - usage: --additionalMappingsFile ADDITIONALMAPPINGSFILE', argv);
                    promise = utils.reject(action + ' missing parameter - usage: --additionalMappingsFile additionalMappingsFile [-force true/false]');
                    return promise;
                }

                console.log('START processing: insertSimilarMatchings', additionalImportMappingsJson);
                let additionalImportMappings: {[key: string]: FileSystemDBSyncType};
                if (additionalImportMappingsJson) {
                    const additionalImportMappingsSrc = JSON.parse(fs.readFileSync(additionalImportMappingsJson, {encoding: 'utf8'}));
                    additionalImportMappings = tdocManagerModule.prepareAdditionalMappings(additionalImportMappingsSrc, true);
                }

                console.log('Do insertSimilarMatchings', Object.keys(additionalImportMappings).length);
                promise = tdocManagerModule.insertSimilarMatchings(additionalImportMappings);

                break;
            default:
                if (outputFile !== undefined && fs.existsSync(outputFile)) {
                    return Promise.reject(action + ' outputFile must not exist');
                }

                return commonMediadManagerCommand.process(argv);
        }

        return promise;
    }

    public htmlPDocInlineFileConverter(html: string, jsonPFilePath: string, dataFileConfigName: string): string {
        const fileName = path.basename(jsonPFilePath);
        html = html.replace(/<\/head>/g,
            '\n  <script inlineexport type="text/javascript" src="' + fileName + '"></script>\n</head>');
        const regExp = new RegExp(dataFileConfigName + '": ".*?"', 'g');
        html = html.replace(regExp,
            dataFileConfigName + '": "' + fileName + '"');

        return html;
    }
}
