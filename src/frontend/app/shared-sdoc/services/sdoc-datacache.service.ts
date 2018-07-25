import {Injectable} from '@angular/core';
import {SDocDataService} from '../../../shared/sdoc-commons/services/sdoc-data.service';
import {SDocSearchResult} from '../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {SDocSearchForm} from '../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {SDocRecord} from '../../../shared/sdoc-commons/model/records/sdoc-record';
import {CommonDocDataCacheService} from '../../../shared/frontend-cdoc-commons/services/cdoc-datacache.service';

@Injectable()
export class SDocDataCacheService extends CommonDocDataCacheService<SDocRecord, SDocSearchForm, SDocSearchResult,
    SDocDataService> {
    constructor(private sdocDataService: SDocDataService) {
        super(sdocDataService);
    }
}
