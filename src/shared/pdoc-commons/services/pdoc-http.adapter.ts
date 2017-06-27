import {PDocRecord} from '../model/records/pdoc-record';
import {PDocSearchForm} from '../model/forms/pdoc-searchform';
import {PDocSearchResult} from '../model/container/pdoc-searchresult';
import {GenericSearchHttpAdapter} from '../../search-commons/services/generic-search-http.adapter';

export class PDocHttpAdapter extends GenericSearchHttpAdapter<PDocRecord, PDocSearchForm, PDocSearchResult> {
    constructor(config: any) {
        super(config);
    }

    getHttpEndpoint(method: string): string {
        const updateMethods = ['create', 'destroy', 'update'];
        if (updateMethods.indexOf(method.toLowerCase()) >= 0) {
            return 'pdoc';
        }
        return 'pdocsearch';
    }
}
