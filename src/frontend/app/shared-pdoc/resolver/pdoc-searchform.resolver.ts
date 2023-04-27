import {Injectable} from '@angular/core';
import {PDocSearchFormConverter} from '../services/pdoc-searchform-converter.service';
import {PDocSearchForm} from '@dps/mycms-commons/dist/pdoc-commons/model/forms/pdoc-searchform';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {CommonDocSearchFormResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/cdoc-searchform.resolver';

@Injectable()
export class PDocSearchFormResolver extends CommonDocSearchFormResolver<PDocSearchForm> {
    constructor(appService: GenericAppService, searchFormConverter: PDocSearchFormConverter) {
        super(appService, searchFormConverter);
    }
}
