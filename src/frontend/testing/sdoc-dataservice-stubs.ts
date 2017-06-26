import {Injectable} from '@angular/core';
import {SDocSearchForm} from '../shared/sdoc-commons/model/forms/sdoc-searchform';
import {SDocSearchResult} from '../shared/sdoc-commons/model/container/sdoc-searchresult';
import {Facets} from '../shared/search-commons/model/container/facets';
import {SDocRecord} from '../shared/sdoc-commons/model/records/sdoc-record';

@Injectable()
export class SDocDataServiceStub {
    static defaultSearchResult(): SDocSearchResult {
        return new SDocSearchResult(
            new SDocSearchForm({}), 1, [ new SDocRecord({id: '1', name: 'Test'})], new Facets());
    }

    static defaultRecord(): SDocRecord {
        return new SDocRecord({id: '1', name: 'Test'});
    }

    search(searchForm: SDocSearchForm): Promise<SDocSearchResult> {
        return Promise.resolve(new SDocSearchResult(searchForm, 0, [], new Facets()));
    };
}
