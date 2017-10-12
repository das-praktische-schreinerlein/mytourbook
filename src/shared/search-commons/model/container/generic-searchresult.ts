import {Record} from 'js-data';
import {GenericSearchForm} from '../forms/generic-searchform';
import {Facets} from './facets';

export class GenericSearchResult<R extends Record, F extends GenericSearchForm> {
    currentRecords: R[];
    recordCount: number;
    searchForm: F;
    facets: Facets;

    constructor(searchForm: F, recordCount: number, currentRecords: R[], facets: Facets) {
        this.currentRecords = currentRecords;
        this.recordCount = recordCount;
        this.searchForm = searchForm;
        this.facets = facets;
    }

    toString() {
        return 'GenericSearchResult {\n' +
            '  facets: ' + this.facets + '' +
            '  currentRecords: ' + this.currentRecords + '' +
            '  recordCount: ' + this.recordCount + '' +
            '  searchFormGroup: ' + this.searchForm + '' +
            '}';
    }
}
