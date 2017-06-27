import {PDocRecord} from '../model/records/pdoc-record';
import {PDocSearchResult} from '../model/container/pdoc-searchresult';
import {GenericSearchService} from '../../search-commons/services/generic-search.service';
import {PDocSearchForm} from '../model/forms/pdoc-searchform';
import {PDocDataStore} from './pdoc-data.store';

export class PDocSearchService extends GenericSearchService <PDocRecord, PDocSearchForm, PDocSearchResult> {
    constructor(dataStore: PDocDataStore) {
        super(dataStore, 'pdoc');
    }

    createDefaultSearchForm(): PDocSearchForm {
        return new PDocSearchForm({ pageNum: 1, perPage: 10});
    }
}
