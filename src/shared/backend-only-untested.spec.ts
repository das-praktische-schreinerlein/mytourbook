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


// import untested service for code-coverage
for (const a in [
    CommonQueuedObjectDetectionProcessingService,
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
    console.log('import untested backend-modules for codecoverage');
}
