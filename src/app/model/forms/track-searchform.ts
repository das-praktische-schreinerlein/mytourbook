export class TrackSearchForm {
    fulltext: string;

    constructor(values: {}) {
        this.fulltext = values['fulltext'] || '';
    }

    toString() {
        return 'TrackSearchForm {\n' +
            '  fulltext: ' + this.fulltext + '' +
            '}';
    }
}
