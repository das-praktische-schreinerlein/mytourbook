import {Injectable} from '@angular/core';
import {GenericAppService} from '../../../shared/commons/services/generic-app.service';
import {SDocDataService} from '../../../shared/sdoc-commons/services/sdoc-data.service';
import {SDocRecord} from '../../../shared/sdoc-commons/model/records/sdoc-record';
import {AbstractCommonDocRecordResolver} from '../../../shared/frontend-cdoc-commons/resolver/abstract-cdoc-details.resolver';
import {SDocSearchForm} from '../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {SDocSearchResult} from '../../../shared/sdoc-commons/model/container/sdoc-searchresult';

@Injectable()
export class SDocRecordResolver extends AbstractCommonDocRecordResolver<SDocRecord, SDocSearchForm, SDocSearchResult,
    SDocDataService> {
    constructor(appService: GenericAppService, dataService: SDocDataService) {
        super(appService, dataService);
    }
}
