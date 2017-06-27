import {SDocSearchForm} from '../forms/sdoc-searchform';
import {SDocRecord} from '../records/sdoc-record';
import {GenericSearchResult} from '../../../search-commons/model/container/generic-searchresult';
import {Facet, Facets} from '../../../search-commons/model/container/facets';
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

    toSerializableJsonObj(): {} {
        const result = {
            'recordCount': this.recordCount,
            'searchForm': this.searchForm,
            'currentRecords': [],
            'facets': {
                facets: {}
            }
        };
        for (let i = 0; i < this.currentRecords.length; i++) {
            const record = {};
            for (const key in this.currentRecords[i]) {
                record[key] = this.currentRecords[i][key];
            }
            record['sdocimages'] = this.currentRecords[i].get('sdocimages');
            result.currentRecords.push(record);
        }
        this.facets.facets.forEach((value: Facet, key: string) => {
            result.facets.facets[key] = this.facets.facets.get(key).facet;
        });
        return result;
    }
}
