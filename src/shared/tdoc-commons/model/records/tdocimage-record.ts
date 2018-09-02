import {BaseImageRecord} from '@dps/mycms-commons/dist/search-commons/model/records/baseimage-record';

export class TourDocImageRecord extends BaseImageRecord {
    tdoc_id: string;

    getMediaId(): string {
        return this.tdoc_id;
    }
    toString() {
        return 'TourDocImageRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  fileName: ' + this.fileName + '\n' +
            '  name: ' + this.name + ',\n' +
            '  tdoc_id: ' + this.tdoc_id + '' +
            '}';
    }
}

export let TourDocImageRecordRelation: any = {
    belongsTo: {
        tdoc: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related object in memory
            localField: 'tdoc'
        }
    }
};
