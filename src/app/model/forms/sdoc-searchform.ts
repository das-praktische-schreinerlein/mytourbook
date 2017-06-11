import {GenericSearchForm} from './generic-searchform';
export class SDocSearchForm extends GenericSearchForm {
    when: string;
    where: string;
    what: string;
    type: string;

    constructor(values: {}) {
        super(values);
        this.when = values['when'] || '';
        this.where = values['where'] || '';
        this.what = values['what'] || '';
        this.type = values['type'] || '';
    }

    toString() {
        return 'SDocSearchForm {\n' +
            '  when: ' + this.when + '\n' +
            '  where: ' + this.where + '\n' +
            '  what: ' + this.what + '\n' +
            '  fulltext: ' + this.fulltext + '\n' +
            '  type: ' + this.type + '\n' +
            '  sort: ' + this.sort + '\n' +
            '  perPage: ' + this.perPage + '\n' +
            '  pageNum: ' + this.pageNum + '' +
            '}';
    }
}
