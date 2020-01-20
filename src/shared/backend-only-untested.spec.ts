import {CommonSqlObjectDetectionAdapter} from './tdoc-commons/services/common-sql-object-detection.adapter';
import {CommonSqlKeywordAdapter} from './tdoc-commons/services/common-sql-keyword.adapter';
import {CommonSqlPlaylistAdapter} from './tdoc-commons/services/common-sql-playlist.adapter';
import {CommonSqlRateAdapter} from './tdoc-commons/services/common-sql-rate.adapter';
import {TourDocAdapterResponseMapper} from './tdoc-commons/services/tdoc-adapter-response.mapper';
import {TourDocDataStore} from './tdoc-commons/services/tdoc-data.store';
import {TourDocFileUtils} from './tdoc-commons/services/tdoc-file.utils';
import {TourDocHttpAdapter} from './tdoc-commons/services/tdoc-http.adapter';
import {TourDocItemsJsAdapter} from './tdoc-commons/services/tdoc-itemsjs.adapter';
import {TourDocSearchService} from './tdoc-commons/services/tdoc-search.service';
import {TourDocSolrAdapter} from './tdoc-commons/services/tdoc-solr.adapter';
import {TourDocSqlUtils} from './tdoc-commons/services/tdoc-sql.utils';
import {TourDocSqlMytbDbAdapter} from './tdoc-commons/services/tdoc-sql-mytbdb.adapter';
import {TourDocSqlMytbDbConfig} from './tdoc-commons/services/tdoc-sql-mytbdb.config';
import {TourDocSqlMytbDbKeywordAdapter} from './tdoc-commons/services/tdoc-sql-mytbdb-keyword.adapter';
import {TourDocSqlMytbDbObjectDetectionAdapter} from './tdoc-commons/services/tdoc-sql-mytbdb-objectdetection.adapter';
import {TourDocSqlMytbExportDbAdapter} from './tdoc-commons/services/tdoc-sql-mytbexportdb.adapter';
import {TourDocSqlMytbExportDbConfig} from './tdoc-commons/services/tdoc-sql-mytbexportdb.config';
import {CommonQueuedObjectDetectionProcessingService} from './tdoc-commons/services/common-queued-object-detection-processing.service';
import {CommonSqlObjectDetectionProcessingAdapter} from './tdoc-commons/services/common-sql-object-detection-processing.adapter';


// import untested service for code-coverage
for (const a in [
    CommonQueuedObjectDetectionProcessingService,
    CommonSqlKeywordAdapter,
    CommonSqlObjectDetectionAdapter,
    CommonSqlObjectDetectionProcessingAdapter,
    CommonSqlPlaylistAdapter,
    CommonSqlRateAdapter,
    TourDocAdapterResponseMapper,
    TourDocDataStore,
    TourDocFileUtils,
    TourDocHttpAdapter,
    TourDocItemsJsAdapter,
    TourDocSearchService,
    TourDocSolrAdapter,
    TourDocSqlUtils,
    TourDocSqlMytbDbAdapter,
    TourDocSqlMytbDbConfig,
    TourDocSqlMytbDbKeywordAdapter,
    TourDocSqlMytbDbObjectDetectionAdapter,
    TourDocSqlMytbExportDbAdapter,
    TourDocSqlMytbExportDbConfig
]) {
    console.log('import unused modules for codecoverage');
}
