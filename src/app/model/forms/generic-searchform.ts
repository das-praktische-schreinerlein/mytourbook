export class GenericSearchForm {
    fulltext: string;
    sort: string;
    perPage: number;
    pageNum: number;


    constructor(values: {}) {
        this.fulltext = values['fulltext'] || '';
        this.sort = values['sort'] || '';
        this.perPage = +values['perPage'] || 10;
        this.pageNum = +values['pageNum'] || 1;
    }

    toString() {
        return 'GenericSearchForm {\n' +
            '  fulltext: ' + this.fulltext + '\n' +
            '  sort: ' + this.sort + '\n' +
            '  perPage: ' + this.perPage + '\n' +
            '  pageNum: ' + this.pageNum + '' +
            '}';
    }
}
