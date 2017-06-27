import {PDocSearchForm} from '../forms/pdoc-searchform';
import {PDocRecord} from '../records/pdoc-record';
import {GenericSearchResult} from '../../../search-commons/model/container/generic-searchresult';
import {Facet, Facets} from '../../../search-commons/model/container/facets';

export class PDocSearchResult extends GenericSearchResult <PDocRecord, PDocSearchForm> {
    constructor(pdocSearchForm: PDocSearchForm, recordCount: number, currentRecords: PDocRecord[], facets: Facets) {
        super(pdocSearchForm, recordCount, currentRecords, facets);
    }

    toString() {
        return 'PDocSearchResult {\n' +
            '  facets: ' + this.facets + '' +
            '  currentRecords: ' + this.currentRecords + '' +
            '  recordCount: ' + this.recordCount + '' +
            '  searchFormGroup: ' + this.searchForm + '' +
            '}';
    }

    toSerializableJsonObj(): {} {
        const result = {
            'recordCount': this.recordCount,
            'searchForm': this.searchForm,
            'currentRecords': [],
            'facets': {
                facets: {}
            }
        };
        if (Array.isArray(this.currentRecords)) {
            for (let i = 0; i < this.currentRecords.length; i++) {
                const record = {};
                for (const key in this.currentRecords[i]) {
                    record[key] = this.currentRecords[i][key];
                }
                result.currentRecords.push(record);
            }
        }
        if (this.facets && this.facets.facets) {
            this.facets.facets.forEach((value: Facet, key: string) => {
                result.facets.facets[key] = this.facets.facets.get(key).facet;
            });
        }
        return result;
    }
}
