import {GenericSearchForm} from '../../../search-commons/model/forms/generic-searchform';
export class SDocSearchForm extends GenericSearchForm {
    when: string;
    where: string;
    locId: string;
    nearby: string;
    nearbyAddress: string;
    what: string;
    moreFilter: string;
    theme: string;
    type: string;

    constructor(values: {}) {
        super(values);
        this.when = values['when'] || '';
        this.where = values['where'] || '';
        this.locId = values['locId'] || '';
        this.nearby = values['nearby'] || '';
        this.nearbyAddress = values['nearbyAddress'] || '';
        this.what = values['what'] || '';
        this.moreFilter = values['moreFilter'] || '';
        this.theme = values['theme'] || '';
        this.type = values['type'] || '';
    }

    toString() {
        return 'SDocSearchForm {\n' +
            '  when: ' + this.when + '\n' +
            '  where: ' + this.where + '\n' +
            '  locId: ' + this.locId + '\n' +
            '  nearby: ' + this.nearby + '\n' +
            '  nearbyAddress: ' + this.nearbyAddress + '\n' +
            '  what: ' + this.what + '\n' +
            '  fulltext: ' + this.fulltext + '\n' +
            '  type: ' + this.type + '\n' +
            '  sort: ' + this.sort + '\n' +
            '  perPage: ' + this.perPage + '\n' +
            '  pageNum: ' + this.pageNum + '' +
            '}';
    }
}
