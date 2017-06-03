export class TrackSearchForm {
    when: string;
    where: string;
    what: string;
    fulltext: string;
    sort: string;
    perPage: number;
    pageNum: number;


    constructor(values: {}) {
        this.when = values['when'] || '';
        this.where = values['where'] || '';
        this.what = values['what'] || '';
        this.fulltext = values['fulltext'] || '';
        this.sort = values['sort'] || '';
        this.perPage = +values['perPage'] || 10;
        this.pageNum = +values['pageNum'] || 1;
    }

    toString() {
        return 'TrackSearchForm {\n' +
            '  when: ' + this.when + '\n' +
            '  where: ' + this.where + '\n' +
            '  what: ' + this.what + '\n' +
            '  fulltext: ' + this.fulltext + '\n' +
            '  sort: ' + this.sort + '\n' +
            '  perPage: ' + this.perPage + '\n' +
            '  pageNum: ' + this.pageNum + '' +
            '}';
    }
}
