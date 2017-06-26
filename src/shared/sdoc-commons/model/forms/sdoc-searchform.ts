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
        this.nearby = values['nearby'] || '';
        this.nearbyAddress = values['nearbyAddress'] || '';
        this.locId = values['locId'] || '';
        this.what = values['what'] || '';
        this.type = values['type'] || '';
        this.theme = values['theme'] || '';
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
