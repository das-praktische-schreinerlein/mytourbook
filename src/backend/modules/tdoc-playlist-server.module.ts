import {TourDocSearchResult} from '../shared/tdoc-commons/model/container/tdoc-searchresult';
import {TourDocSearchForm, TourDocSearchFormValidator} from '../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocDataService} from '../shared/tdoc-commons/services/tdoc-data.service';
import express from 'express';
import {TourDocRecord} from '../shared/tdoc-commons/model/records/tdoc-record';
import {CommonDocSearchForm} from '@dps/mycms-commons/dist/search-commons/model/forms/cdoc-searchform';
import {CommonDocPlaylistServerModule} from '@dps/mycms-server-commons/dist/backend-commons/modules/cdoc-playlist-server.module';
import {CommonDocPlaylistExporter} from '@dps/mycms-commons/dist/search-commons/services/cdoc-playlist-exporter';
import {TourDocServerPlaylistService, TourDocServerPlaylistServiceConfig} from './tdoc-serverplaylist.service';

export class TourDocPlaylistServerModule extends CommonDocPlaylistServerModule<TourDocRecord, TourDocSearchForm, TourDocSearchResult,
    TourDocDataService> {
    public static configureRoutes(app: express.Application, apiPrefix: string, dataService: TourDocDataService,
                                  backendConfig: {}): TourDocPlaylistServerModule {
        const playlistConfig: TourDocServerPlaylistServiceConfig = {
            audioBaseUrl: backendConfig['playlistExportAudioBaseUrl'],
            imageBaseUrl: backendConfig['playlistExportImageBaseUrl'],
            videoBaseUrl: backendConfig['playlistExportVideoBaseUrl'],
            useAudioAssetStoreUrls: backendConfig['playlistExportUseAudioAssetStoreUrls'],
            useImageAssetStoreUrls: backendConfig['playlistExportUseImageAssetStoreUrls'],
            useVideoAssetStoreUrls: backendConfig['playlistExportUseVideoAssetStoreUrls']
        };
        const playlistService = new TourDocServerPlaylistService(playlistConfig);
        const playlistExporter = new CommonDocPlaylistExporter<TourDocRecord, TourDocSearchForm, TourDocSearchResult,
            TourDocDataService>(dataService, playlistService);
        const tdocPlaylistServerModule = new TourDocPlaylistServerModule(dataService, playlistExporter);
        CommonDocPlaylistServerModule.configurePlaylistServerRoutes(app, apiPrefix, tdocPlaylistServerModule, {
            playlistExportMaxM3uRecordAllowed: backendConfig['playlistExportMaxM3uRecordAllowed']
        });
        return tdocPlaylistServerModule;
    }

    public constructor(protected dataService: TourDocDataService, protected playlistExporter: CommonDocPlaylistExporter<TourDocRecord,
        TourDocSearchForm, TourDocSearchResult, TourDocDataService>) {
        super(dataService, playlistExporter);
    }

    getApiId(): string {
        return 'tdoc';
    }

    isSearchFormValid(searchForm: CommonDocSearchForm): boolean {
        return TourDocSearchFormValidator.isValid(<TourDocSearchForm>searchForm);
    }

}
