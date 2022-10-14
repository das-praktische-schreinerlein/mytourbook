import {Schema} from 'js-data';
import {BaseEntityRecordSchema} from '@dps/mycms-commons/dist/search-commons/model/schemas/base-entity-record-schema';

export const TourDocLinkedPoiRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'TourDocLinkedPoi',
    description: 'Schema for a TourDocLinkedPoi Record.',
    extends: BaseEntityRecordSchema,
    type: 'object',
    properties: {
        type: {type: 'string'},
        name: {type: 'string'},
        refId: {type: 'string', indexed: true},
        position: {type: 'number'},
        poitype: {type: 'number'},
        geoLoc: {type: 'string'},
        geoEle: {type: 'number'},
        tdoc_id: {type: 'string', indexed: true}
    }
});
