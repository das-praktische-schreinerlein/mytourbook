import {Jsonp} from '@angular/http';
import {SDocRecord} from '../model/records/sdoc-record';
import {SDocSearchForm} from '../model/forms/sdoc-searchform';
import {SDocSearchResult} from '../model/container/sdoc-searchresult';
import {GenericSearchHttpAdapter} from '../../search-commons/services/generic-search-http.adapter';

export class SDocHttpAdapter extends GenericSearchHttpAdapter<SDocRecord, SDocSearchForm, SDocSearchResult> {
    constructor(config: any, jsonP: Jsonp) {
        super(config, jsonP);
    }

    getHttpEndpoint(method: string): string {
        const updateMethods = ['create', 'destroy', 'update'];
        if (updateMethods.indexOf(method.toLowerCase()) >= 0) {
            return 'sdocs';
        }
        return 'sdocs';
    }
}

