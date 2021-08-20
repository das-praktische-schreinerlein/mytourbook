import {Schema} from 'js-data';
import {BaseEntityRecordSchema} from '@dps/mycms-commons/dist/search-commons/model/schemas/base-entity-record-schema';

export const TourDocLinkedRouteRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'TourDocLinkedRoute',
    description: 'Schema for a TourDocLinkedRoute Record.',
    extends: BaseEntityRecordSchema,
    type: 'object',
    properties: {
        type: {type: 'string'},
        name: {type: 'string'},
        full: {type: 'boolean'},
        linkedRouteAttr: {type: 'string'},
        refId: {type: 'string', indexed: true},
        tdoc_id: {type: 'string', indexed: true}
    }
});
