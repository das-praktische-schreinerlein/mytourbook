import {BaseEntityRecord} from '../../../search-commons/model/records/base-entity-record';

export class SDocImageRecord extends BaseEntityRecord {
    desc: string;
    fileName: string;
    name: string;
    sdoc_id: string;

    toString() {
        return 'SDocImageRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  desc: ' + this.desc + ',\n' +
            '  fileName: ' + this.fileName + '\n' +
            '  name: ' + this.name + ',\n' +
            '  sdoc_id: ' + this.sdoc_id + '' +
            '}';
    }
}

export let SDocImageRecordRelation: any = {
    belongsTo: {
        sdoc: {
            // database column
            foreignKey: 'sdoc_id',
            // reference to related object in memory
            localField: 'sdoc'
        }
    }
};
