import {BaseVideoRecord} from '@dps/mycms-commons/dist/search-commons/model/records/basevideo-record';

export class TourDocVideoRecord extends BaseVideoRecord {
    tdoc_id: string;

    getMediaId(): string {
        return this.tdoc_id;
    }

    toString() {
        return 'TourDocVideoRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  fileName: ' + this.fileName + '\n' +
            '  name: ' + this.name + ',\n' +
            '  tdoc_id: ' + this.tdoc_id + '' +
            '}';
    }
}

export let TourDocVideoRecordRelation: any = {
    belongsTo: {
        tdoc: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related object in memory
            localField: 'tdoc'
        }
    }
};
