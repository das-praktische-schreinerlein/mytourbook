import {BaseEntityRecord} from './base-entity-record';

export class SDocRecord extends BaseEntityRecord {
    locId: number;
    routeId: number;
    trackId: number;
    imageId: number;

    datevon: Date;
    desc: string;
    geoLon: string;
    geoLat: string;
    geoLoc: string;
    gpsTrackBasefile: string;
    keywords: string;
    locHirarchie: string;
    name: string;
    type: string;

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
