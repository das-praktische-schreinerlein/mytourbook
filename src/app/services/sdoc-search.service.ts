import {Injectable} from '@angular/core';
import {SDocRecord} from '../model/records/sdoc-record';
import {GenericDataStore} from './generic-data.store';
import {SDocSearchResult} from '../model/container/sdoc-searchresult';
import {GenericSearchService} from './generic-search.service';
import {SDocSearchForm} from '../model/forms/sdoc-searchform';

@Injectable()
export class SDocSearchService extends GenericSearchService <SDocRecord, SDocSearchForm, SDocSearchResult> {
    constructor(dataStore: GenericDataStore) {
        super(dataStore, 'sdoc');
    }

    createQueryFromForm(searchForm: SDocSearchForm): Object {
        const query = {};

        if (searchForm === undefined) {
            searchForm = new SDocSearchForm({});
        }
        if (searchForm.fulltext !== undefined && searchForm.fulltext.length > 0) {
            query['where'] = {
                html: {
                    'likei': '%' + searchForm.fulltext + '%'
                }
            };
        }

        return query;
    }

    createDefaultSearchForm(): SDocSearchForm {
        return new SDocSearchForm({ pageNum: 1, perPage: 10});
    }

    createSearchResult(searchForm: SDocSearchForm, recordCount: number, records: SDocRecord[]): SDocSearchResult {
        return new SDocSearchResult(searchForm, recordCount, records);
    }
}
