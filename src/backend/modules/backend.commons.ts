import {FacetCacheUsageConfigurations} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {FacetCacheConfiguration} from '@dps/mycms-commons/dist/facetcache-commons/model/facetcache.configuration';
import {CacheConfig} from '@dps/mycms-server-commons/dist/server-commons/datacache.module';
import {
    CommonAudioBackendConfigType,
    CommonBackendConfigType,
    CommonImageBackendConfigType,
    CommonKeywordMapperConfigType,
    CommonPdfBackendConfigType,
    CommonSqlConnectionConfigType,
    CommonVideoBackendConfigType
} from '@dps/mycms-server-commons/dist/backend-commons/modules/backend.commons';
import {CommonPDocBackendConfigType} from '@dps/mycms-server-commons/dist/pdoc-backend-commons/modules/pdoc-backend.commons';
import {ObjectDetectionManagerBackendConfig} from '../shared/tdoc-commons/services/common-queued-object-detection-processing.service';
import {PdfManagerConfigType} from '@dps/mycms-server-commons/dist/media-commons/modules/pdf-manager';

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
    CommonPdfBackendConfigType,
    PdfManagerConfigType,
    CommonAudioBackendConfigType<KeywordMapperConfigType, CacheConfig>,
    CommonImageBackendConfigType<KeywordMapperConfigType, CacheConfig>,
    CommonVideoBackendConfigType<KeywordMapperConfigType, CacheConfig>,
    CommonPDocBackendConfigType<SqlConnectionConfigType>,
    ObjectDetectionManagerBackendConfig {
    tdocDataStoreAdapter: string,
    tdocWritable: boolean,
    tdocImportConverterAdditionalKeywords?: string[],
    TourDocSqlMytbDbAdapter: SqlConnectionConfigType
    TourDocSqlMytbExportDbAdapter: SqlConnectionConfigType,
    TourDocItemsJsAdapter: {
        dataFile: string
    },
    TourDocSolrAdapter: {
        solrCoreTourDoc: string,
        solrCoreTourDocReadUsername: string,
        solrCoreTourDocReadPassword: string
    }
}
