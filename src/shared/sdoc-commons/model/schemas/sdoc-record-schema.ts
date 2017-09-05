import {BaseEntityRecordSchema} from '../../../search-commons/model/schemas/base-entity-record-schema';
import {Schema} from 'js-data';

export const SDocRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'SDoc',
    description: 'Schema for a SDoc Record.',
    extends: BaseEntityRecordSchema,
    type: 'object',
    properties: {
        imageId: {type: 'number'},
        locId: {type: 'number'},
        routeId: {type: 'number'},
        trackId: {type: 'number'},
        tripId: {type: 'number'},

// TODO
//        datevon: {type: 'Date'},
        actiontypes: {type: 'string'},
        desc: {type: 'string'},
        geoLon: {type: 'string'},
        geoLat: {type: 'string'},
        geoLoc: {type: 'string'},
        gpsTrack: {type: 'string'},
        gpsTrackBasefile: {type: 'string'},
        keywords: {type: 'string'},
        locHirarchie: {type: 'string'},
        locHirarchieIds: {type: 'string'},
        name: {type: 'string', minLength: 1, maxLength: 255},
        subtype: {type: 'string'},
        type: {type: 'string'}
    }
});
