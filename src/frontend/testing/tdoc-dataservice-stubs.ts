import {Injectable} from '@angular/core';
import {TourDocSearchForm} from '../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../shared/tdoc-commons/model/container/tdoc-searchresult';
import {Facets} from '@dps/mycms-commons/dist/search-commons/model/container/facets';
import {TourDocRecord} from '../shared/tdoc-commons/model/records/tdoc-record';
import {TourDocObjectDetectionImageObjectRecord} from '../shared/tdoc-commons/model/records/tdocobjectdetectectionimageobject-record';

@Injectable()
export class TourDocDataServiceStub {
    static defaultSearchResult(): TourDocSearchResult {
        return new TourDocSearchResult(
            new TourDocSearchForm({}), 1, [ new TourDocRecord({id: '1', name: 'Test'})], new Facets());
    }

    static defaultRecord(): TourDocRecord {
        const record = new TourDocRecord({id: '1', name: 'Test'});
        record['tdocodimageobjects'] = [new TourDocObjectDetectionImageObjectRecord({})];
        return record;
    }

    cloneSanitizedSearchForm(values: TourDocSearchForm): TourDocSearchForm {
        return new TourDocSearchForm(values);
    }

    newSearchForm(values: {}): TourDocSearchForm {
        return new TourDocSearchForm(values);
    }

    search(searchForm: TourDocSearchForm): Promise<TourDocSearchResult> {
        return Promise.resolve(new TourDocSearchResult(searchForm, 0, [], new Facets()));
    }

    newSearchResult(tdocSearchForm: TourDocSearchForm, recordCount: number,
                    currentRecords: TourDocRecord[], facets: Facets): TourDocSearchResult {
        return new TourDocSearchResult(tdocSearchForm, recordCount, currentRecords, facets);
    }
}
