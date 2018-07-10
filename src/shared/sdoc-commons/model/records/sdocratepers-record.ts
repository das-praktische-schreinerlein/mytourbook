import {BaseRatePersonalRecord} from './baseratepers-record';

export class SDocRatePersonalRecord extends BaseRatePersonalRecord {
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
