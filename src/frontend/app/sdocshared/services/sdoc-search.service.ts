import {Injectable} from '@angular/core';
import {SDocRecord} from '../model/records/sdoc-record';
import {SDocSearchResult} from '../model/container/sdoc-searchresult';
import {GenericSearchService} from '../../../commons/services/generic-search.service';
import {SDocSearchForm} from '../model/forms/sdoc-searchform';
import {SDocDataStore} from '../../sdocbackend/services/sdoc-data.store';

@Injectable()
export class SDocSearchService extends GenericSearchService <SDocRecord, SDocSearchForm, SDocSearchResult> {
    constructor(dataStore: SDocDataStore) {
        super(dataStore, 'sdoc');
    }

    createDefaultSearchForm(): SDocSearchForm {
        return new SDocSearchForm({ pageNum: 1, perPage: 10});
    }
}
