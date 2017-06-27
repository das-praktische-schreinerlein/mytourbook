import {BaseEntityRecord} from '../../../search-commons/model/records/base-entity-record';

export class PDocRecord extends BaseEntityRecord {
    desc: string;
    keywords: string;
    name: string;
    type: string;
    pdoc_parent_id: string;

    toString() {
        return 'PDocRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  desc: ' + this.desc + ',\n' +
            '  name: ' + this.name + ',\n' +
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
