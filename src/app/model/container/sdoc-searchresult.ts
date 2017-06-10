import {SDocSearchForm} from '../forms/sdoc-searchform';
import {SDocRecord} from '../records/sdoc-record';
import {GenericSearchResult} from './generic-searchresult';
import {Facets} from './facets';
export class SDocSearchResult extends GenericSearchResult <SDocRecord, SDocSearchForm> {
    constructor(sdocSearchForm: SDocSearchForm, recordCount: number, currentRecords: SDocRecord[], facets: Facets) {
        super(sdocSearchForm, recordCount, currentRecords, facets);
    }

    toString() {
        return 'SDocSearchResult {\n' +
            '  facets: ' + this.facets + '' +
            '  currentRecords: ' + this.currentRecords + '' +
            '  recordCount: ' + this.recordCount + '' +
            '  searchFormGroup: ' + this.searchForm + '' +
            '}';
    }
}
