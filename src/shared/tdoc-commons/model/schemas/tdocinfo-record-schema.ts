import {BaseEntityRecordSchema} from '@dps/mycms-commons/dist/search-commons/model/schemas/base-entity-record-schema';
import {Schema} from 'js-data';

export const TourDocInfoRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'TourDocInfo',
    description: 'Schema for a TourDocInfo Record.',
    extends: BaseEntityRecordSchema,
    type: 'object',
    properties: {
        name: {type: 'string'},
        desc: {type: 'string'},
        shortDesc: {type: 'string'},
        publisher: {type: 'string'},
        reference: {type: 'string'},
        type: {type: 'string'},
        tdoc_id: {type: 'string', indexed: true}
    }
});
