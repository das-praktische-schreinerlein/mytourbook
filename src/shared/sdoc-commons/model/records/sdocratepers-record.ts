import {BaseEntityRecord} from '../../../search-commons/model/records/base-entity-record';

export class SDocRatePersonalRecord extends BaseEntityRecord {
    ausdauer: number;
    bildung: number;
    gesamt: number;
    kraft: number;
    mental: number;
    motive: number;
    schwierigkeit: number;
    wichtigkeit: number;
    sdoc_id: string;

    toString() {
        return 'SDocRatePersonalRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  gesamt: ' + this.gesamt + ',\n' +
            '  sdoc_id: ' + this.sdoc_id + '' +
            '}';
    }
}

export let SDocRatePersonalRecordRelation: any = {
    belongsTo: {
        sdoc: {
            // database column
            foreignKey: 'sdoc_id',
            // reference to related object in memory
            localField: 'sdoc'
        }
    }
};
