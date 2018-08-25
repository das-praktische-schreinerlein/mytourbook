import {BaseDataTechRecord} from './basedatatech-record';

export class TourDocDataTechRecord extends BaseDataTechRecord {
    tdoc_id: string;

    toString() {
        return 'TourDocDataTechRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  altAsc: ' + this.altAsc + ',\n' +
            '  altDesc: ' + this.altDesc + ',\n' +
            '  altMax: ' + this.altMax + ',\n' +
            '  altMin: ' + this.altMin + ',\n' +
            '  dist: ' + this.dist + ',\n' +
            '  dur: ' + this.dur + ',\n' +
            '  tdoc_id: ' + this.tdoc_id + '' +
            '}';
    }
}

export let TourDocDataTechRecordRelation: any = {
    belongsTo: {
        tdoc: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related object in memory
            localField: 'tdoc'
        }
    }
};
