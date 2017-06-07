import {BaseEntityRecord} from './base-entity-record';

export class SDocRecord extends BaseEntityRecord {
    desc: string;
    name: string;
    type: number;
    keywords: string;
    gpssdocsBasefile: string;
    datevon: Date;

    toString() {
        return 'SDocRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  desc: ' + this.desc + ',\n' +
            '  name: ' + this.name + ',\n' +
            '  type: ' + this.type + '' +
            '}';
    }
}

export let SDocRecordRelation: any = {
    hasMany: {
        sdocimage: {
            // database column
            foreignKey: 'sdoc_id',
            // reference to related objects in memory
            localField: 'sdocimages'
        },
    }
};
