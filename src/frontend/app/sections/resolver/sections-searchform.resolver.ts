import {Injectable} from '@angular/core';
import {SDocSearchFormConverter} from '../../shared-sdoc/services/sdoc-searchform-converter.service';
import {SDocSearchForm} from '../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {GenericAppService} from '../../../shared/commons/services/generic-app.service';
import {CommonSearchFormResolver} from '../../../shared/frontend-commons/resolver/searchform.resolver';

@Injectable()
export class SectionsSearchFormResolver extends CommonSearchFormResolver<SDocSearchForm> {
    constructor(appService: GenericAppService, searchFormConverter: SDocSearchFormConverter) {
        super(appService, searchFormConverter);
    }
}
