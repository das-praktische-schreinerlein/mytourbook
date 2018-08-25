import {BaseRatePersonalRecord} from './baseratepers-record';

export class TourDocRatePersonalRecord extends BaseRatePersonalRecord {
    tdoc_id: string;

    toString() {
        return 'TourDocRatePersonalRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  gesamt: ' + this.gesamt + ',\n' +
            '  tdoc_id: ' + this.tdoc_id + '' +
            '}';
    }
}

export let TourDocRatePersonalRecordRelation: any = {
    belongsTo: {
        tdoc: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related object in memory
            localField: 'tdoc'
        }
    }
};
