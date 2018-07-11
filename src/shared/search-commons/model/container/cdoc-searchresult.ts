import {GenericSearchResult} from './generic-searchresult';
import {Facet, Facets} from './facets';
import {CommonDocRecord} from '../records/cdoc-entity-record';
import {CommonDocSearchForm} from '../forms/cdoc-searchform';

export class CommonDocSearchResult<R extends CommonDocRecord, F extends CommonDocSearchForm> extends GenericSearchResult<R, F> {
    constructor(sdocSearchForm: F, recordCount: number, currentRecords: R[], facets: Facets) {
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

    toSerializableJsonObj(anonymizeMedia?: boolean): {} {
        const result = {
            'recordCount': this.recordCount,
            'searchForm': this.searchForm,
            'currentRecords': [],
            'facets': {
                facets: {},
                selectLimits: {}
            }
        };
        if (Array.isArray(this.currentRecords)) {
            for (let i = 0; i < this.currentRecords.length; i++) {
                const record = CommonDocRecord.cloneToSerializeToJsonObj(this.currentRecords[i], anonymizeMedia);

                result.currentRecords.push(record);
            }
        }
        if (this.facets && this.facets.facets) {
            this.facets.facets.forEach((value: Facet, key: string) => {
                result.facets.facets[key] = this.facets.facets.get(key).facet;
                result.facets.selectLimits[key] = this.facets.facets.get(key).selectLimit;
            });
        }
        return result;
    }
}
