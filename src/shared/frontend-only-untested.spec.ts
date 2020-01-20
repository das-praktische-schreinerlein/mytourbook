import {TourDocAdapterResponseMapper} from './tdoc-commons/services/tdoc-adapter-response.mapper';
import {TourDocDataStore} from './tdoc-commons/services/tdoc-data.store';
import {TourDocFileUtils} from './tdoc-commons/services/tdoc-file.utils';
import {TourDocHttpAdapter} from './tdoc-commons/services/tdoc-http.adapter';
import {TourDocItemsJsAdapter} from './tdoc-commons/services/tdoc-itemsjs.adapter';
import {TourDocRoutingService} from './tdoc-commons/services/tdoc-routing.service';
import {TourDocSearchService} from './tdoc-commons/services/tdoc-search.service';


// import untested service for code-coverage
for (const a in [
    TourDocAdapterResponseMapper,
    TourDocDataStore,
    TourDocFileUtils,
    TourDocHttpAdapter,
    TourDocItemsJsAdapter,
    TourDocRoutingService,
    TourDocSearchService,
]) {
    console.log('import unused modules for codecoverage');
}
