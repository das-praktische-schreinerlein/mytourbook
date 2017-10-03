import {BaseEntityRecord} from '../../../search-commons/model/records/base-entity-record';

export class PDocRecord extends BaseEntityRecord {
    css: string;
    descTxt: string;
    descMd: string;
    descHtml: string;
    flgShowSearch: boolean;
    flgShowNews: boolean;
    flgShowTopTen: boolean;
    heading: string;
    image: string;
    keywords: string;
    name: string;
    subSectionIds: string;
    teaser: string;
    theme: string;
    type: string;

    toString() {
        return 'PDocRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  heading: ' + this.name + ',\n' +
            '  name: ' + this.name + ',\n' +
            '  theme: ' + this.theme + '' +
            '  type: ' + this.type + '' +
            '}';
    }
}

export let PDocRecordRelation: any = {
};
