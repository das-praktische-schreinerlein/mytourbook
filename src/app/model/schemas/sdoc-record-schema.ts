import {BaseEntityRecordSchema} from './base-entity-record-schema';
import {Schema} from 'js-data';

export const SDocRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'SDoc',
    description: 'Schema for a SDoc Record.',
    extends: BaseEntityRecordSchema,
    type: 'object',
    properties: {
        locId: {type: 'number'},
        routeId: {type: 'number'},
        trackId: {type: 'number'},

// TODO
//        datevon: {type: 'Date'},
        desc: {type: 'string'},
        geoLon: {type: 'string'},
        geoLat: {type: 'string'},
        geoLoc: {type: 'string'},
        gpsTrackBasefile: {type: 'string'},
        keywords: {type: 'string'},
        name: {type: 'string', minLength: 4, maxLength: 255},
        type: {type: 'string'}
    }
});
