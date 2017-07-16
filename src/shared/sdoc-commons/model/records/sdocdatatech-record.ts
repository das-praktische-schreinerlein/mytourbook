import {BaseEntityRecord} from '../../../search-commons/model/records/base-entity-record';

export class SDocDataTechRecord extends BaseEntityRecord {
    altAsc: number;
    altDesc: number;
    altMax: number;
    altMin: number;
    dist: number;
    dur: number;
    sdoc_id: string;

    toString() {
        return 'SDocDataTechRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  altAsc: ' + this.altAsc + ',\n' +
            '  altDesc: ' + this.altDesc + ',\n' +
            '  altMax: ' + this.altMax + ',\n' +
            '  altMin: ' + this.altMin + ',\n' +
            '  dist: ' + this.dist + ',\n' +
            '  dur: ' + this.dur + ',\n' +
            '  sdoc_id: ' + this.sdoc_id + '' +
            '}';
    }
}

export let SDocDataTechRecordRelation: any = {
    belongsTo: {
        sdoc: {
            // database column
            foreignKey: 'sdoc_id',
            // reference to related object in memory
            localField: 'sdoc'
        }
    }
};
