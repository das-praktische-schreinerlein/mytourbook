import {BaseEntityRecord} from '../../../search-commons/model/records/base-entity-record';

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
    locHirarchieIds: string;
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

    toSerializableJsonObj(): {} {
        const record = {};
        const me: SDocRecord = this;
        for (const key in me) {
            record[key] = me[key];
        }
        record['sdocimages'] = this.get('sdocimages');
        record['sdocratetech'] = this.get('sdocratetech');

        return record;
    }
}

export let SDocRecordRelation: any = {
    hasOne: {
        sdocratetech: {
            // database column
            foreignKey: 'sdoc_id',
            // reference to related objects in memory
            localField: 'sdocratetech'
        },
    },
    hasMany: {
        sdocimage: {
            // database column
            foreignKey: 'sdoc_id',
            // reference to related objects in memory
            localField: 'sdocimages'
        }
    }
};

