import {Injectable} from '@angular/core';
import {GenericAppService} from '../../../shared/commons/services/generic-app.service';
import {TourDocDataService} from '../../../shared/tdoc-commons/services/tdoc-data.service';
import {TourDocRecord} from '../../../shared/tdoc-commons/model/records/tdoc-record';
import {CommonDocRecordResolver} from '../../../shared/frontend-cdoc-commons/resolver/cdoc-details.resolver';
import {TourDocSearchForm} from '../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../../../shared/tdoc-commons/model/container/tdoc-searchresult';

@Injectable()
export class TourDocRecordResolver extends CommonDocRecordResolver<TourDocRecord, TourDocSearchForm, TourDocSearchResult,
    TourDocDataService> {
    constructor(appService: GenericAppService, dataService: TourDocDataService) {
        super(appService, dataService);
    }
}
