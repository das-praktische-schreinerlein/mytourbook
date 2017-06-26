import {SDocRecord} from '../model/records/sdoc-record';
import {SDocSearchResult} from '../model/container/sdoc-searchresult';
import {GenericSearchService} from '../../search-commons/services/generic-search.service';
import {SDocSearchForm} from '../model/forms/sdoc-searchform';
import {SDocDataStore} from './sdoc-data.store';

export class SDocSearchService extends GenericSearchService <SDocRecord, SDocSearchForm, SDocSearchResult> {
    constructor(dataStore: SDocDataStore) {
        super(dataStore, 'sdoc');
    }

    createDefaultSearchForm(): SDocSearchForm {
        return new SDocSearchForm({ pageNum: 1, perPage: 10});
    }
}
