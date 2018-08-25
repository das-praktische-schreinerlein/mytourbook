import {TourDocRecord} from '../model/records/tdoc-record';
import {TourDocSearchResult} from '../model/container/tdoc-searchresult';
import {TourDocSearchForm, TourDocSearchFormFactory} from '../model/forms/tdoc-searchform';
import {TourDocDataStore} from './tdoc-data.store';
import {CommonDocSearchService} from '../../search-commons/services/cdoc-search.service';
import {Facets} from '../../search-commons/model/container/facets';

export class TourDocSearchService extends CommonDocSearchService<TourDocRecord, TourDocSearchForm, TourDocSearchResult> {
    constructor(dataStore: TourDocDataStore) {
        super(dataStore, 'tdoc');
    }

    createDefaultSearchForm(): TourDocSearchForm {
        return new TourDocSearchForm({ pageNum: 1, perPage: 10});
    }

    public getBaseMapperName(): string {
        return 'tdoc';
    }

    public isRecordInstanceOf(record: any): boolean {
        return record instanceof TourDocRecord;
    }

    public createRecord(props, opts): TourDocRecord {
        return <TourDocRecord>this.dataStore.createRecord(this.getBaseMapperName(), props, opts);
    }

    public newRecord(values: {}): TourDocRecord {
        return new TourDocRecord(values);
    }

    public newSearchForm(values: {}): TourDocSearchForm {
        return new TourDocSearchForm(values);
    }

    public newSearchResult(tdocSearchForm: TourDocSearchForm, recordCount: number,
                           currentRecords: TourDocRecord[], facets: Facets): TourDocSearchResult {
        return new TourDocSearchResult(tdocSearchForm, recordCount, currentRecords, facets);
    }

    public cloneSanitizedSearchForm(src: TourDocSearchForm): TourDocSearchForm {
        return TourDocSearchFormFactory.cloneSanitized(src);
    }

    public createSanitizedSearchForm(values: {}): TourDocSearchForm {
        return TourDocSearchFormFactory.createSanitized(values);
    }
}
