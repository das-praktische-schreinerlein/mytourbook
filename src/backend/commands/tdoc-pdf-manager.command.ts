import * as fs from 'fs';
import {TourDocDataServiceModule} from '../modules/tdoc-dataservice.module';
import {TourDocFileUtils} from '../shared/tdoc-commons/services/tdoc-file.utils';
import {CommonAdminCommand} from '@dps/mycms-server-commons/dist/backend-commons/commands/common-admin.command';
import {
    HtmlValidationRule,
    KeywordValidationRule,
    NumberValidationRule,
    SimpleConfigFilePathValidationRule,
    SimpleFilePathValidationRule,
    ValidationRule,
    WhiteListValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {BackendConfigType} from '../modules/backend.commons';
import {TourDocExportManagerUtils} from '../modules/tdoc-export-manager.utils';
import {TourDocServerPlaylistService, TourDocServerPlaylistServiceConfig} from '../modules/tdoc-serverplaylist.service';
import {TourDocMediaFileExportManager} from '../modules/tdoc-mediafile-export.service';
import {SitemapConfig} from '@dps/mycms-server-commons/dist/backend-commons/modules/sitemap-generator.module';
import {TourPdfManagerModule} from '../modules/tdoc-pdf-manager-module';
import {PdfExportProcessingOptions} from '@dps/mycms-server-commons/dist/backend-commons/modules/cdoc-pdf-manager-module';
import {ProcessingOptions} from '@dps/mycms-commons/dist/search-commons/services/cdoc-search.service';
import {PdfManager} from '@dps/mycms-server-commons/dist/media-commons/modules/pdf-manager';

export class TourDocPdfManagerCommand extends CommonAdminCommand {

    protected createValidationRules(): {[key: string]: ValidationRule} {
        return {
            action: new KeywordValidationRule(true),
            backend: new SimpleConfigFilePathValidationRule(true),
            sitemap: new SimpleConfigFilePathValidationRule(true),
            baseUrl: new HtmlValidationRule(false),
            queryParams: new HtmlValidationRule(false),
            generateMergedPdf:  new WhiteListValidationRule(false, [true, false, 'true', 'false'], false),
            addPageNumsStartingWith: new NumberValidationRule(false, -1, 99999, 0),
            trimEmptyPages: new WhiteListValidationRule(false, [true, false, 'true', 'false'], true),
            tocTemplate: new SimpleFilePathValidationRule(false),
            ... TourDocExportManagerUtils.createExportValidationRules(),
            ... TourDocExportManagerUtils.createTourDocSearchFormValidationRules()
        };
    }

    protected definePossibleActions(): string[] {
        return [
            'exportImagePdfs', 'exportLocationPdfs', 'exportRoutePdfs', 'exportTrackPdfs',
            'generateDefaultImagePdfs', 'generateLocationPdfs', 'generateRoutePdfs', 'generateTrackPdfs',
            'generateExternalImagePdfs', 'generateExternalLocationPdfs', 'generateExternalRoutePdfs', 'generateExternalTrackPdfs',
            'generatePlaylistAsPdfs'];
    }

    protected processCommandArgs(argv: {}): Promise<any> {
        argv['exportDir'] = TourDocFileUtils.normalizeCygwinPath(argv['exportDir']);
        argv['tocTemplate'] = TourDocFileUtils.normalizeCygwinPath(argv['tocTemplate']);

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
        const mediaFileExportManager = new TourDocMediaFileExportManager(backendConfig.apiRoutePicturesStaticDir, playlistService);
        const pdfManager = new PdfManager(backendConfig);
        const pdfManagerModule = new TourPdfManagerModule(dataService, mediaFileExportManager, pdfManager, backendConfig);

        let promise: Promise<any>;
        const processingOptions: PdfExportProcessingOptions & ProcessingOptions = {
            ignoreErrors: Number.parseInt(argv['ignoreErrors'], 10) || 0,
            parallel: Number.parseInt(argv['parallel'], 10),
            updatePdfEntity: false,
            generateMergedPdf: argv['generateMergedPdf'] !== undefined && argv['generateMergedPdf'] !== false,
            addPageNumsStartingWith: argv['addPageNumsStartingWith'] !== undefined && Number(argv['addPageNumsStartingWith'])
                ? Number(argv['addPageNumsStartingWith'])
                : undefined,
            trimEmptyPages: argv['trimEmptyPages'] !== undefined && argv['trimEmptyPages'] !== false,
            tocTemplate: argv['tocTemplate'] !== undefined && argv['tocTemplate'].length > 1
                ? argv['tocTemplate'] + ''
                : undefined
        };
        const force = argv['force'] === true || argv['force'] === 'true';

        const generatePdfsType = this.getGenerateTypeFromAction(action);
        const generateName = generatePdfsType;
        const generateQueryParams = argv['queryParams'] !== undefined
            ? argv['queryParams']
            : '';
        const baseUrl = argv['baseUrl'];

        const exportPdfsType = this.getExportTypeFromAction(action);
        const exportDir = argv['exportDir'];
        const exportName = argv['exportName'];

        switch (action) {
            case 'generateDefaultImagePdfs':
            case 'generateDefaultLocationPdfs':
            case 'generateDefaultRoutePdfs':
            case 'generateDefaultTrackPdfs':
                processingOptions.updatePdfEntity = true;
                console.log('DO generate searchform for : ' + action, processingOptions);
                promise = TourDocExportManagerUtils.createTourDocSearchForm(generatePdfsType, argv).then(searchForm => {
                    console.log('START processing: ' + action, backendConfig.apiRoutePdfsStaticDir, searchForm, processingOptions);
                    return pdfManagerModule.generatePdfs(action,
                        backendConfig.apiRoutePdfsStaticDir, generateName, sitemapConfig.showBaseUrl,
                        generateQueryParams, processingOptions, searchForm, force);
                });

                break;
            case 'generateExternalImagePdfs':
            case 'generateExternalLocationPdfs':
            case 'generateExternalRoutePdfs':
            case 'generateExternalTrackPdfs':
                console.log('DO generate searchform for : ' + action, processingOptions);
                promise = TourDocExportManagerUtils.createTourDocSearchForm(generatePdfsType, argv).then(searchForm => {
                    console.log('START processing: ' + action, exportDir, searchForm, processingOptions);
                    return pdfManagerModule.generatePdfs(action, exportDir, exportName, baseUrl, generateQueryParams,
                        processingOptions, searchForm, force);
                });
                break;
            case 'generatePlaylistAsPdfs':
                console.log('DO generate searchform for : ' + action, processingOptions);
                if (argv['playlists'] === undefined || argv['playlists'].trim === '') {
                    console.error('ERROR - generatePlaylistAsPdfs requires playlists');
                    return Promise.reject('generatePlaylistAsPdfs requires playlists');
                }

                const playlistPdfType = 'image,info,location,route,track,trip';
                processingOptions.generateMergedPdf = true;
                promise = TourDocExportManagerUtils.createTourDocSearchForm(playlistPdfType, argv).then(searchForm => {
                    searchForm.sort = 'playlistPos';
                    console.log('START processing: ' + action, exportDir, searchForm, processingOptions);
                    return pdfManagerModule.generatePdfs(action, exportDir, exportName, baseUrl, generateQueryParams,
                        processingOptions, searchForm, force);
                });
                break;
            case 'exportImagePdfs':
            case 'exportLocationPdfs':
            case 'exportRoutePdfs':
            case 'exportTrackPdfs':
                console.log('DO generate searchform for : ' + action, processingOptions);
                promise = TourDocExportManagerUtils.createTourDocSearchForm(exportPdfsType, argv).then(searchForm => {
                    console.log('START processing: ' + action, exportDir , searchForm, processingOptions);
                    return pdfManagerModule.exportPdfs(action, exportDir, exportName, processingOptions, searchForm, force);
                });

                break;
        }

        return promise;
    }

    protected getGenerateTypeFromAction(action: string) {
        let generateType = 'UNKNOWN';
        switch (action) {
            case 'generateDefaultImagePdfs':
            case 'generateExternalImagePdfs':
                generateType = 'image';
                break;
            case 'generateDefaultLocationPdfs':
            case 'generateExternalLocationPdfs':
                generateType = 'location';
                break;
            case 'generateDefaultRoutePdfs':
            case 'generateExternalRoutePdfs':
                generateType = 'route';
                break;
            case 'generateDefaultTrackPdfs':
            case 'generateExternalTrackPdfs':
                generateType = 'track';
                break;
        }

        return generateType;
    }

    protected getExportTypeFromAction(action: string) {
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

        return type;
    }

}
