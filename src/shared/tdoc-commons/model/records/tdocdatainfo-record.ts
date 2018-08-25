import {BaseDataInfoRecord} from './basedatainfo-record';

export class TourDocDataInfoRecord extends BaseDataInfoRecord {
    tdoc_id: string;

    toString() {
        return 'TourDocDataTechRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  baseloc: ' + this.baseloc + ',\n' +
            '  destloc: ' + this.destloc + ',\n' +
            '  guides: ' + this.guides + ',\n' +
            '  region: ' + this.region + ',\n' +
            '  tdoc_id: ' + this.tdoc_id + '' +
            '}';
    }
}

export let TourDocDataInfoRecordRelation: any = {
    belongsTo: {
        tdoc: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related object in memory
            localField: 'tdoc'
        }
    }
};
