import {PDocRecord} from '../model/records/pdoc-record';
import {PDocSearchForm} from '../model/forms/pdoc-searchform';
import {PDocSearchResult} from '../model/container/pdoc-searchresult';
import {GenericInMemoryAdapter} from '../../search-commons/services/generic-inmemory.adapter';

export class PDocInMemoryAdapter extends GenericInMemoryAdapter<PDocRecord, PDocSearchForm, PDocSearchResult> {
    constructor(config: any) {
        super(config);
    }
}
