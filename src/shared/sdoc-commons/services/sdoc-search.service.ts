import {SDocRecord} from '../model/records/sdoc-record';
import {SDocSearchResult} from '../model/container/sdoc-searchresult';
import {SDocSearchForm, SDocSearchFormFactory} from '../model/forms/sdoc-searchform';
import {SDocDataStore} from './sdoc-data.store';
import {CommonDocSearchService} from '../../search-commons/services/cdoc-search.service';
import {Facets} from '../../search-commons/model/container/facets';

export class SDocSearchService extends CommonDocSearchService<SDocRecord, SDocSearchForm, SDocSearchResult> {
    constructor(dataStore: SDocDataStore) {
        super(dataStore, 'sdoc');
    }

    createDefaultSearchForm(): SDocSearchForm {
        return new SDocSearchForm({ pageNum: 1, perPage: 10});
    }

    public getBaseMapperName(): string {
        return 'sdoc';
    }

    public isRecordInstanceOf(record: any): boolean {
        return record instanceof SDocRecord;
    }

    public createRecord(props, opts): SDocRecord {
        return <SDocRecord>this.dataStore.createRecord(this.getBaseMapperName(), props, opts);
    }

    public newRecord(values: {}): SDocRecord {
        return new SDocRecord(values);
    }

    public newSearchForm(values: {}): SDocSearchForm {
        return new SDocSearchForm(values);
    }

    public newSearchResult(sdocSearchForm: SDocSearchForm, recordCount: number,
                           currentRecords: SDocRecord[], facets: Facets): SDocSearchResult {
        return new SDocSearchResult(sdocSearchForm, recordCount, currentRecords, facets);
    }

    public cloneSanitizedSearchForm(src: SDocSearchForm): SDocSearchForm {
        return SDocSearchFormFactory.cloneSanitized(src);
    }

    public createSanitizedSearchForm(values: {}): SDocSearchForm {
        return SDocSearchFormFactory.createSanitized(values);
    }
}
