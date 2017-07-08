import {Injectable} from '@angular/core';
import {PDocSearchForm} from '../shared/pdoc-commons/model/forms/pdoc-searchform';
import {PDocSearchResult} from '../shared/pdoc-commons/model/container/pdoc-searchresult';
import {Facets} from '../shared/search-commons/model/container/facets';
import {PDocRecord} from '../shared/pdoc-commons/model/records/pdoc-record';

@Injectable()
export class PDocDataServiceStub {
    static defaultSearchResult(): PDocSearchResult {
        return new PDocSearchResult(
            new PDocSearchForm({}), 1, [ new PDocRecord({id: '1', name: 'Test'})], new Facets());
    }

    static defaultRecord(): PDocRecord {
        return new PDocRecord({id: '1', name: 'Test'});
    }

    search(searchForm: PDocSearchForm): Promise<PDocSearchResult> {
        return Promise.resolve(new PDocSearchResult(searchForm, 0, [], new Facets()));
    };

    getById(id: any): Promise<PDocRecord> {
        return Promise.resolve(new PDocRecord({id: '1'}));
    };

    getSubDocuments(pdoc: any): PDocRecord[] {
        return [];
    }
}
