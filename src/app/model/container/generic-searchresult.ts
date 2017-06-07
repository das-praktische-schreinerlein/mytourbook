import {Record} from 'js-data';
import {GenericSearchForm} from '../forms/generic-searchform';
export class GenericSearchResult<R extends Record, F extends GenericSearchForm> {
    currentRecords: R[];
    recordCount: number;
    searchForm: F;

    constructor(searchForm: F, recordCount: number, currentRecords: R[]) {
        this.currentRecords = currentRecords;
        this.recordCount = recordCount;
        this.searchForm = searchForm;
    }

    toString() {
        return 'GenericSearchResult {\n' +
            '  currentRecords: ' + this.currentRecords + '' +
            '  recordCount: ' + this.recordCount + '' +
            '  searchFormGroup: ' + this.searchForm + '' +
            '}';
    }
}
