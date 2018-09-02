import {Injectable} from '@angular/core';
import {TourDocDataService} from '../../../shared/tdoc-commons/services/tdoc-data.service';
import {TourDocSearchResult} from '../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {TourDocSearchForm} from '../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocRecord} from '../../../shared/tdoc-commons/model/records/tdoc-record';
import {CommonDocDataCacheService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-datacache.service';

@Injectable()
export class TourDocDataCacheService extends CommonDocDataCacheService<TourDocRecord, TourDocSearchForm, TourDocSearchResult,
    TourDocDataService> {
    constructor(private tdocDataService: TourDocDataService) {
        super(tdocDataService);
    }
}
