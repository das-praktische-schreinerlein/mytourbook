import {Schema} from 'js-data';
import {BaseEntityRecordSchema} from '@dps/mycms-commons/dist/search-commons/model/schemas/base-entity-record-schema';

export const TourDocFlagObjectRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'TourDocFlagObject',
    description: 'Schema for a TourDocFlagObject Record.',
    extends: BaseEntityRecordSchema,
    type: 'object',
    properties: {
        name: {type: 'string'},
        value: {type: 'string'},
        tdoc_id: {type: 'string', indexed: true}
    }
});
