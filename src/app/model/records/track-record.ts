import {BaseEntityRecord} from './base-entity-record';

export class TrackRecord extends BaseEntityRecord {
    desc: string;
    name: string;
    persons: string;
    type: number;
    html: string;
    keywords: string;
    gpstracksBasefile: string;
    datevon: Date;

    toString() {
        return 'TrackRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  desc: ' + this.desc + ',\n' +
            '  name: ' + this.name + ',\n' +
            '  persons: ' + this.persons + ',\n' +
            '  type: ' + this.type + '' +
            '}';
    }
}

export let TrackRecordRelation: any = {
    hasMany: {
        image: {
            // database column
            foreignKey: 'track_id',
            // reference to related objects in memory
            localField: 'images'
        },
    }
};
