import {Schema} from 'js-data';
import {BaseEntityRecordSchema} from '@dps/mycms-commons/dist/search-commons/model/schemas/base-entity-record-schema';

export const TourDocLinkedInfoRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'TourDocLinkedInfo',
    description: 'Schema for a TourDocLinkedInfo Record.',
    extends: BaseEntityRecordSchema,
    type: 'object',
    properties: {
        type: {type: 'string'},
        name: {type: 'string'},
        refId: {type: 'string', indexed: true},
        linkedDetails: {type: 'string'},
        tdoc_id: {type: 'string', indexed: true}
    }
});
