import {SDocRecord} from '../model/records/sdoc-record';
import {SDocSearchForm} from '../model/forms/sdoc-searchform';
import {SDocSearchResult} from '../model/container/sdoc-searchresult';
import {GenericSearchHttpAdapter} from '../../search-commons/services/generic-search-http.adapter';

export class SDocHttpAdapter extends GenericSearchHttpAdapter<SDocRecord, SDocSearchForm, SDocSearchResult> {
    constructor(config: any) {
        super(config);
    }

    getHttpEndpoint(method: string): string {
        const updateMethods = ['find', 'findAll', 'create', 'destroy', 'update'];
        if (updateMethods.indexOf(method.toLowerCase()) >= 0) {
            return 'sdoc';
        }
        return 'sdocsearch';
    }
}

