import {Injectable} from '@angular/core';
import {TourDocSearchFormConverter} from '../services/tdoc-searchform-converter.service';
import {TourDocSearchForm} from '../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {CommonDocSearchFormResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/cdoc-searchform.resolver';

@Injectable()
export class TourDocSearchFormResolver extends CommonDocSearchFormResolver<TourDocSearchForm> {
    constructor(appService: GenericAppService, searchFormConverter: TourDocSearchFormConverter) {
        super(appService, searchFormConverter);
    }
}
