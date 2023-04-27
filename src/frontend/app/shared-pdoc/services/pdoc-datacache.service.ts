import {Injectable} from '@angular/core';
import {PDocDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.service';
import {PDocSearchResult} from '@dps/mycms-commons/dist/pdoc-commons/model/container/pdoc-searchresult';
import {PDocSearchForm} from '@dps/mycms-commons/dist/pdoc-commons/model/forms/pdoc-searchform';
import {PDocRecord} from '@dps/mycms-commons/dist/pdoc-commons/model/records/pdoc-record';
import {CommonDocDataCacheService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-datacache.service';

@Injectable()
export class PDocDataCacheService extends CommonDocDataCacheService<PDocRecord, PDocSearchForm, PDocSearchResult,
    PDocDataService> {
    constructor(private pdocDataService: PDocDataService) {
        super(pdocDataService);
    }
}
