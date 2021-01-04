import {FacetCacheUsageConfigurations} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {FacetCacheConfiguration} from '@dps/mycms-commons/dist/facetcache-commons/model/facetcache.configuration';
import {CacheConfig} from '@dps/mycms-server-commons/dist/server-commons/datacache.module';
import {
    CommonAudioBackendConfigType,
    CommonBackendConfigType,
    CommonImageBackendConfigType,
    CommonKeywordMapperConfigType,
    CommonSqlConnectionConfigType,
    CommonVideoBackendConfigType
} from '@dps/mycms-server-commons/dist/backend-commons/modules/backend.commons';
import {ObjectDetectionManagerBackendConfig} from '../shared/tdoc-commons/services/common-queued-object-detection-processing.service';

// tslint:disable-next-line:no-empty-interface
export interface KeywordMapperConfigType extends CommonKeywordMapperConfigType {
}

export interface SqlConnectionConfigType extends CommonSqlConnectionConfigType<FacetCacheUsageConfigurations, FacetCacheConfiguration> {
}

export interface CommonTrackBackendConfigType {
    apiRouteTracks: string;
    apiRouteTracksStaticDir: string;
    apiRouteTracksStaticEnabled: boolean;
    apiRouteStoredTracks: string;
    proxyTrackRouteToUrl: string;
}

export interface BackendConfigType extends CommonBackendConfigType<KeywordMapperConfigType, CacheConfig>,
    CommonTrackBackendConfigType,
    CommonAudioBackendConfigType<KeywordMapperConfigType, CacheConfig>,
    CommonImageBackendConfigType<KeywordMapperConfigType, CacheConfig>,
    CommonVideoBackendConfigType<KeywordMapperConfigType, CacheConfig>,
    ObjectDetectionManagerBackendConfig {
    tdocDataStoreAdapter: string,
    tdocWritable: boolean,
    TourDocSqlMytbDbAdapter: SqlConnectionConfigType
    TourDocSqlMytbExportDbAdapter: SqlConnectionConfigType,
    // TODO
    TourDocItemsJsAdapter: {
        dataFile: string
    },
    TourDocSolrAdapter: {
        solrCoreTourDoc: string,
        solrCoreTourDocReadUsername: string,
        solrCoreTourDocReadPassword: string
    },
    bindIp: string,  // TODO move to CommonBackendConfigType
    tcpBacklog: number
}
