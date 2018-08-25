import {TourDocSearchForm} from '../forms/tdoc-searchform';
import {TourDocRecord} from '../records/tdoc-record';
import {Facet, Facets} from '../../../search-commons/model/container/facets';
import {CommonDocSearchResult} from '../../../search-commons/model/container/cdoc-searchresult';

export class TourDocSearchResult extends CommonDocSearchResult <TourDocRecord, TourDocSearchForm> {
    constructor(tdocSearchForm: TourDocSearchForm, recordCount: number, currentRecords: TourDocRecord[], facets: Facets) {
        super(tdocSearchForm, recordCount, currentRecords, facets);
    }

    toString() {
        return 'TourDocSearchResult {\n' +
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
                const record = TourDocRecord.cloneToSerializeToJsonObj(this.currentRecords[i], anonymizeMedia);

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
