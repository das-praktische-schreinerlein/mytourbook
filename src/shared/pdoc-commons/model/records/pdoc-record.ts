import {BaseEntityRecord} from '../../../search-commons/model/records/base-entity-record';

export class PDocRecord extends BaseEntityRecord {
    desc: string;
    flgShowSearch: boolean;
    flgShowTopTen: boolean;
    heading: string;
    image: string;
    keywords: string;
    name: string;
    subSectionIds: string;
    teaser: string;
    theme: string;
    type: string;
    pdoc_parent_id: string;

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
    belongsTo: {
        pdoc: {
            // database column
            foreignKey: 'id',
            // reference to related object in memory
            localField: 'pdoc_parent'
        }
    },
    hasMany: {
        pdoc: {
            // database column
            foreignKey: 'pdoc_parent_id',
            // reference to related objects in memory
            localField: 'pdocs'
        },
    }
};
