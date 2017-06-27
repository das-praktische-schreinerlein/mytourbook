import {GenericSearchForm} from '../../../search-commons/model/forms/generic-searchform';

export class PDocSearchForm extends GenericSearchForm {
    what: string;
    moreFilter: string;
    type: string;

    constructor(values: {}) {
        super(values);
        this.what = values['what'] || '';
        this.moreFilter = values['moreFilter'] || '';
        this.type = values['type'] || '';
    }

    toString() {
        return 'PDocSearchForm {\n' +
            '  what: ' + this.what + '\n' +
            '  fulltext: ' + this.fulltext + '\n' +
            '  type: ' + this.type + '\n' +
            '  sort: ' + this.sort + '\n' +
            '  perPage: ' + this.perPage + '\n' +
            '  pageNum: ' + this.pageNum + '' +
            '}';
    }
}
