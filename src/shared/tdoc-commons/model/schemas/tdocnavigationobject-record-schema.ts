import {Schema} from 'js-data';
import {BaseEntityRecordSchema} from '@dps/mycms-commons/dist/search-commons/model/schemas/base-entity-record-schema';

export const TourDocNavigationObjectRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'TourDocObjectDetectionImageObject',
    description: 'Schema for a TourDocNavigationObject Record.',
    extends: BaseEntityRecordSchema,
    type: 'object',
    properties: {
        name: {type: 'string'},
        navid: {type: 'string'},
        navtype: {type: 'string'},
        tdoc_id: {type: 'string', indexed: true}
    }
});
