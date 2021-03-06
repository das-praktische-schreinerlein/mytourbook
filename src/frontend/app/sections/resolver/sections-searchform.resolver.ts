import {Injectable} from '@angular/core';
import {TourDocSearchFormConverter} from '../../shared-tdoc/services/tdoc-searchform-converter.service';
import {TourDocSearchForm} from '../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {CommonSectionSearchFormResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/cdoc-section-searchform.resolver';

@Injectable()
export class SectionsSearchFormResolver extends CommonSectionSearchFormResolver<TourDocSearchForm> {
    constructor(appService: GenericAppService, searchFormConverter: TourDocSearchFormConverter) {
        super(appService, searchFormConverter);
    }
}
