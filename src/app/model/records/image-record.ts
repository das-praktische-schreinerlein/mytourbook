import {BaseEntityRecord} from './base-entity-record';

export class ImageRecord extends BaseEntityRecord {
    desc: string;
    fileName: string;
    name: string;
    track_id: number;

    toString() {
        return 'ImageRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  desc: ' + this.desc + ',\n' +
            '  fileName: ' + this.fileName + '\n' +
            '  name: ' + this.name + ',\n' +
            '  track_id: ' + this.track_id + '' +
            '}';
    }
}

export let ImageRecordRelation: any = {
    belongsTo: {
        track: {
            // database column
            foreignKey: 'track_id',
            // reference to related object in memory
            localField: 'track'
        }
    }
};
