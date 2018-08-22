import {Injectable} from '@angular/core';
import {SDocSearchFormConverter} from '../services/sdoc-searchform-converter.service';
import {SDocSearchForm} from '../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {GenericAppService} from '../../../shared/commons/services/generic-app.service';
import {CommonDocSearchFormResolver} from '../../../shared/frontend-cdoc-commons/resolver/cdoc-searchform.resolver';

@Injectable()
export class SDocSearchFormResolver extends CommonDocSearchFormResolver<SDocSearchForm> {
    constructor(appService: GenericAppService, searchFormConverter: SDocSearchFormConverter) {
        super(appService, searchFormConverter);
    }
}
