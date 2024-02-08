import {BaseEntityRecordSchema} from '@dps/mycms-commons/dist/search-commons/model/schemas/base-entity-record-schema';
import {Schema} from 'js-data';

export const TourDocRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'TourDoc',
    description: 'Schema for a TourDoc Record.',
    extends: BaseEntityRecordSchema,
    type: 'object',
    properties: {
        imageId: {type: 'number'},
        locId: {type: 'number'},
        locIdParent: {type: 'number'},
        routeId: {type: 'number'},
        trackId: {type: 'number'},
        tripId: {type: 'number'},
        newsId: {type: 'number'},
        videoId: {type: 'number'},
        destinationId: {type: 'string'},

        blocked: {type: 'number'},

        // TODO: add type validation for date in later version -> but date-values can be string|Date
        dateshow: {},
        datestart: {},
        dateend: {},

        // TODO: add type validation for date in later version -> but date-values can be string|Date
        createdAt: {},
        updatedAt: {},
        updateVersion: {type: 'number'},

        descTxt: {type: 'string'},
        descMd: {type: 'string'},
        descHtml: {type: 'string'},
        geoDistance: {type: 'number'},
        geoLon: {type: 'string'},
        geoLat: {type: 'string'},
        geoLoc: {type: 'string'},
        gpsTrackSrc: {type: 'string'},
        gpsTrackState: {type: 'number'},
        gpsTrackBasefile: {type: 'string'},
        keywords: {type: 'string'},
        locHirarchie: {type: 'string'},
        locHirarchieIds: {type: 'string'},
        name: {type: 'string', minLength: 1, maxLength: 255},
        objects: {type: 'string'},
        persons: {type: 'string'},
        pdfFile: {type: 'string'},
        linkedRouteAttr: {type: 'string'},
        playlists: {type: 'string'},
        subtype: {type: 'string'},
        type: {type: 'string', minLength: 1, maxLength: 255}
    }
});
