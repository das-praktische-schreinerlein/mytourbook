export class TrackSearchForm {
    fulltext: string;
    perPage: number;
    pageNum: number;


    constructor(values: {}) {
        this.fulltext = values['fulltext'] || '';
        this.perPage = values['perPage'] || 10;
        this.pageNum = values['pageNum'] || 1;
    }

    toString() {
        return 'TrackSearchForm {\n' +
            '  fulltext: ' + this.fulltext + '\n' +
            '  perPage: ' + this.perPage + '\n' +
            '  pageNum: ' + this.pageNum + '' +
            '}';
    }
}
