import {BaseEntityRecord} from '../../../search-commons/model/records/base-entity-record';

export class SDocDataInfoRecord extends BaseEntityRecord {
    baseloc: string;
    destloc: string;
    guides: string;
    region: string;
    sdoc_id: string;

    toString() {
        return 'SDocDataTechRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  baseloc: ' + this.baseloc + ',\n' +
            '  destloc: ' + this.destloc + ',\n' +
            '  guides: ' + this.guides + ',\n' +
            '  region: ' + this.region + ',\n' +
            '  sdoc_id: ' + this.sdoc_id + '' +
            '}';
    }
}

export let SDocDataInfoRecordRelation: any = {
    belongsTo: {
        sdoc: {
            // database column
            foreignKey: 'sdoc_id',
            // reference to related object in memory
            localField: 'sdoc'
        }
    }
};
