import {BaseEntityRecord} from '../../../search-commons/model/records/base-entity-record';

export class SDocVideoRecord extends BaseEntityRecord {
    descTxt: string;
    descMd: string;
    descHtml: string;
    fileName: string;
    name: string;
    sdoc_id: string;

    toString() {
        return 'SDocVideoRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  fileName: ' + this.fileName + '\n' +
            '  name: ' + this.name + ',\n' +
            '  sdoc_id: ' + this.sdoc_id + '' +
            '}';
    }
}

export let SDocVideoRecordRelation: any = {
    belongsTo: {
        sdoc: {
            // database column
            foreignKey: 'sdoc_id',
            // reference to related object in memory
            localField: 'sdoc'
        }
    }
};
