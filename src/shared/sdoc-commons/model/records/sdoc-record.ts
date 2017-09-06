import {BaseEntityRecord} from '../../../search-commons/model/records/base-entity-record';

export class SDocRecord extends BaseEntityRecord {
    locId: number;
    routeId: number;
    trackId: number;
    tripId: number;
    imageId: number;

    actiontypes: string;
    datevon: Date;
    desc: string;
    geoLon: string;
    geoLat: string;
    geoLoc: string;
    gpsTrack: string;
    gpsTrackBasefile: string;
    keywords: string;
    locHirarchie: string;
    locHirarchieIds: string;
    name: string;
    subtype: string;
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
        record['sdocdatatech'] = this.get('sdocdatatech');
        record['sdocdatainfo'] = this.get('sdocdatainfo');
        record['sdocimages'] = this.get('sdocimages');
        record['sdocratepers'] = this.get('sdocratepers');
        record['sdocratetech'] = this.get('sdocratetech');

        return record;
    }
}

export let SDocRecordRelation: any = {
    hasOne: {
        sdocdatatech: {
            // database column
            foreignKey: 'sdoc_id',
            // reference to related objects in memory
            localField: 'sdocdatatech'
        },
        sdocdatainfo: {
            // database column
            foreignKey: 'sdoc_id',
            // reference to related objects in memory
            localField: 'sdocdatainfo'
        },
        sdocratepers: {
            // database column
            foreignKey: 'sdoc_id',
            // reference to related objects in memory
            localField: 'sdocratepers'
        },
        sdocratetech: {
            // database column
            foreignKey: 'sdoc_id',
            // reference to related objects in memory
            localField: 'sdocratetech'
        }
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

