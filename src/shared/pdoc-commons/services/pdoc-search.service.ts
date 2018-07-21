import {PDocRecord} from '../model/records/pdoc-record';
import {PDocSearchResult} from '../model/container/pdoc-searchresult';
import {GenericSearchService} from '../../search-commons/services/generic-search.service';
import {PDocSearchForm} from '../model/forms/pdoc-searchform';
import {PDocDataStore} from './pdoc-data.store';
import {Facets} from '../../search-commons/model/container/facets';

export class PDocSearchService extends GenericSearchService <PDocRecord, PDocSearchForm, PDocSearchResult> {
    constructor(dataStore: PDocDataStore) {
        super(dataStore, 'pdoc');
    }

    createDefaultSearchForm(): PDocSearchForm {
        return new PDocSearchForm({ pageNum: 1, perPage: 10});
    }

    public getBaseMapperName(): string {
        return 'pdoc';
    }

    public isRecordInstanceOf(record: any): boolean {
        return record instanceof PDocRecord;
    }

    public createRecord(props, opts): PDocRecord {
        return <PDocRecord>this.dataStore.createRecord(this.getBaseMapperName(), props, opts);
    }

    public newRecord(values: {}): PDocRecord {
        return new PDocRecord(values);
    }

    public newSearchForm(values: {}): PDocSearchForm {
        return new PDocSearchForm(values);
    }

    public newSearchResult(sdocSearchForm: PDocSearchForm, recordCount: number,
                           currentRecords: PDocRecord[], facets: Facets): PDocSearchResult {
        return new PDocSearchResult(sdocSearchForm, recordCount, currentRecords, facets);
    }

    public cloneSanitizedSearchForm(src: PDocSearchForm): PDocSearchForm {
        return undefined;
    }

    public createSanitizedSearchForm(values: {}): PDocSearchForm {
        return undefined;
    }

    doMultiSearch(searchForm: PDocSearchForm, ids: string[]): Promise<PDocSearchResult> {
        return undefined;
    }
}
