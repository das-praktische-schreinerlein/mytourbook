import {BaseRateTechRecord} from './baseratetech-record';

export class TourDocRateTechRecord extends BaseRateTechRecord {
    tdoc_id: string;

    toString() {
        return 'TourDocRateTechRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  overall: ' + this.overall + ',\n' +
            '  tdoc_id: ' + this.tdoc_id + '' +
            '}';
    }
}

export let TourDocRateTechRecordRelation: any = {
    belongsTo: {
        tdoc: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related object in memory
            localField: 'tdoc'
        }
    }
};
