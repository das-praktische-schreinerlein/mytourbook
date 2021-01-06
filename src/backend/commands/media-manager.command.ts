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
import {CommonAdminCommand, SimpleConfigFilePathValidationRule, SimpleFilePathValidationRule} from './common-admin.command';
import {
    KeywordValidationRule,
    NumberValidationRule,
    ValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';

export class MediaManagerCommand extends CommonAdminCommand {
    protected createValidationRules(): {[key: string]: ValidationRule} {
        return {
            action: new KeywordValidationRule(true),
            backend: new SimpleConfigFilePathValidationRule(true),
            importDir: new SimpleFilePathValidationRule(false),
            srcFile: new SimpleFilePathValidationRule(false),
            outputDir: new SimpleFilePathValidationRule(false),
            outputFile: new SimpleFilePathValidationRule(false),
            ignoreErrors: new NumberValidationRule(false, 1, 999999999, 10),
            parallel: new NumberValidationRule(false, 1, 999, 10),
            pageNum: new NumberValidationRule(false, 1, 999999999, 1),
            playlists: new KeywordValidationRule(false),
            personalRateOverall: new KeywordValidationRule(false),
            directoryProfile: new KeywordValidationRule(false),
            fileNameProfile: new KeywordValidationRule(false),
            resolutionProfile: new KeywordValidationRule(false),
            rateMinFilter: new KeywordValidationRule(false),
            showNonBlockedOnly: new KeywordValidationRule(false),
            additionalMappingsFile: new SimpleConfigFilePathValidationRule(false),
            rotate: new NumberValidationRule(false, 1, 360, 0),
            force: new KeywordValidationRule(false)
        };
    }

    protected processCommandArgs(argv: {}): Promise<any> {
        // importDir and outputDir are used in CommonMediaManagerCommand too
        argv['importDir'] = TourDocFileUtils.normalizeCygwinPath(argv['importDir']);
        argv['outputDir'] = TourDocFileUtils.normalizeCygwinPath(argv['outputDir']);
        argv['outputFile'] = TourDocFileUtils.normalizeCygwinPath(argv['outputFile']);

        const filePathConfigJson = argv['backend'];
        if (filePathConfigJson === undefined) {
            return Promise.reject('ERROR - parameters required backendConfig: "--backend"');
        }

        const action = argv['action'];
        const importDir = argv['importDir'];
        const outputFile = argv['outputFile'];
        if (outputFile !== undefined && fs.existsSync(outputFile)) {
            return Promise.reject(action + ' outputFile must not exist');
        }

        const backendConfig = JSON.parse(fs.readFileSync(filePathConfigJson, {encoding: 'utf8'}));
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
        const tourDocMediaFileImportManager = new TourDocMediaFileImportManager(backendConfig, dataService);
        const mediaManagerModule = new MediaManagerModule(backendConfig.imageMagicAppPath, os.tmpdir());
        const tdocManagerModule = new TourDocMediaManagerModule(backendConfig, dataService, mediaManagerModule, tourDocExportManager,
            tourDocMediaFileImportManager, {});
        const commonMediadManagerCommand = new CommonMediaManagerCommand(backendConfig);

        let promise: Promise<any>;
        let searchForm: TourDocSearchForm;
        const processingOptions: ProcessingOptions = {
            ignoreErrors: Number.parseInt(argv['ignoreErrors'], 10) || 0,
            parallel: Number.parseInt(argv['parallel'], 10)
        };
        const pageNum = Number.parseInt(argv['pageNum'], 10);
        const playlists = argv['playlists'];
        const personalRateOverall = argv['personalRateOverall'];
        switch (action) {
            case 'readImageDates':
                processingOptions.parallel = Number.isInteger(processingOptions.parallel) ? processingOptions.parallel : 1;
                searchForm = new TourDocSearchForm({ type: 'image', sort: 'dateAsc',
                    pageNum: Number.isInteger(pageNum) ? pageNum : 1});
                console.log('START processing: readMediaDates', searchForm, processingOptions);

                promise = tdocManagerModule.readAndUpdateMediaDates(searchForm, processingOptions);
                break;
            case 'readVideoDates':
                processingOptions.parallel = Number.isInteger(processingOptions.parallel) ? processingOptions.parallel : 1;
                searchForm = new TourDocSearchForm({ type: 'video', sort: 'dateAsc',
                    pageNum: Number.isInteger(pageNum) ? pageNum : 1});
                console.log('START processing: readMediaDates', searchForm, processingOptions);

                promise = tdocManagerModule.readAndUpdateMediaDates(searchForm, processingOptions);

                break;
            case 'scaleImages':
                processingOptions.parallel = Number.isInteger(processingOptions.parallel) ? processingOptions.parallel : 5;
                searchForm = new TourDocSearchForm({ type: 'image', sort: 'dateAsc',
                    pageNum: Number.isInteger(pageNum) ? pageNum : 1});
                console.log('START processing: scaleImages', searchForm, processingOptions);

                promise = tdocManagerModule.scaleImagesToDefaultWidth(searchForm, processingOptions);

                break;
            case 'exportImageFiles':
            case 'exportVideoFiles':
                const exportDir = argv['exportDir'];
                if (exportDir === undefined) {
                    console.error(action + ' missing parameter - usage: --exportDir EXPORTDIR', argv);
                    promise = utils.reject(action + ' missing parameter - usage: --exportDir EXPORTDIR [-force true/false]');
                    return promise;
                }
                const directoryProfile = argv['directoryProfile'];
                if (directoryProfile === undefined) {
                    console.error(action + ' missing parameter - usage: --directoryProfile directoryProfile', argv);
                    promise = utils.reject(action + ' missing parameter - usage: --directoryProfile directoryProfile');
                    return promise;
                }

                const fileNameProfile = argv['fileNameProfile'];
                if (fileNameProfile === undefined) {
                    console.error(action + ' missing parameter - usage: --fileNameProfile fileNameProfile', argv);
                    promise = utils.reject(action + ' missing parameter - usage: --fileNameProfile fileNameProfile');
                    return promise;
                }

                const resolutionProfile = argv['resolutionProfile'];
                if (resolutionProfile === undefined || !Object.keys(MediaExportResolutionProfiles).includes(resolutionProfile)) {
                    console.error(action + ' missing parameter - usage: --resolutionProfile {' +
                        Object.keys(MediaExportResolutionProfiles).join(', ') + '}', argv);
                    promise = utils.reject(action + ' missing parameter - usage: --resolutionProfile {' +
                        Object.keys(MediaExportResolutionProfiles).join(', ') + '}');
                    return promise;
                }

                const exportName = argv['exportName'];

                processingOptions.parallel = Number.isInteger(processingOptions.parallel) ? processingOptions.parallel : 1;
                searchForm = new TourDocSearchForm({
                    type: action === 'exportVideoFiles' ? 'video' : 'image',
                    playlists: playlists,
                    personalRateOverall: personalRateOverall,
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
                const blockedFilter = argv['showNonBlockedOnly'] + '';
                if (blockedFilter !== undefined && blockedFilter.toLowerCase() !== 'showall') {
                    searchForm.moreFilter = 'blocked_i:null,0';
                }

                console.log('START processing: ' + action, searchForm, exportDir, processingOptions);

                promise = tdocManagerModule.exportMediaFiles(searchForm, <MediaExportProcessingOptions & ProcessingOptions> {
                    ...processingOptions,
                    exportBasePath: exportDir,
                    exportBaseFileName: exportName,
                    directoryProfile: directoryProfile,
                    fileNameProfile: fileNameProfile,
                    resolutionProfile: resolutionProfile
                });
                break;
            case 'generateTourDocsFromMediaDir':
                if (importDir === undefined) {
                    console.error(action + ' missing parameter - usage: --importDir INPUTDIR', argv);
                    promise = utils.reject(action + ' missing parameter - usage: --importDir INPUTDIR --outputFile outputFile [-force true/false]');
                    return promise;
                }
                if (outputFile === undefined) {
                    console.error(action + ' missing parameter - usage: --outputFile OUTPUTFILE', argv);
                    promise = utils.reject(action + ' missing parameter - usage: --importDir INPUTDIR --outputFile outputFile [-force true/false]');
                    return promise;
                }

                console.log('START processing: generateTourDocRecordsFromMediaDir', importDir);

                promise = tdocManagerModule.generateTourDocRecordsFromMediaDir(importDir);
                promise.then(value => {
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
                console.log('START processing: findCorrespondingTourDocRecordsForMedia', additionalMappingsJson);

                let additionalMappings: {[key: string]: FileSystemDBSyncType};
                if (additionalMappingsJson) {
                    const additionalMappingsSrc = JSON.parse(fs.readFileSync(additionalMappingsJson, {encoding: 'utf8'}));
                    additionalMappings = tdocManagerModule.prepareAdditionalMappings(additionalMappingsSrc, false);
                }

                promise = tdocManagerModule.findCorrespondingCommonDocRecordsForMedia(importDir, additionalMappings);
                promise.then(value => {
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
                return commonMediadManagerCommand.process(argv);
        }

        return promise;
    }
}
