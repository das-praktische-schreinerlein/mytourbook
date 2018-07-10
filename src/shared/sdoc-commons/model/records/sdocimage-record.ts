import {BaseImageRecord} from '../../../search-commons/model/records/baseimage-record';

export class SDocImageRecord extends BaseImageRecord {
    sdoc_id: string;

    getMediaId(): string {
        return this.sdoc_id;
    }
    toString() {
        return 'SDocImageRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
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
