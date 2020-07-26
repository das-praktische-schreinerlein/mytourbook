import {Schema} from 'js-data';
import {BaseEntityRecordSchema} from '@dps/mycms-commons/dist/search-commons/model/schemas/base-entity-record-schema';

export const TourDocExtendedObjectPropertyRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'TourDocExtendedObjectProperty',
    description: 'Schema for a TourDocExtendedObjectProperty Record.',
    extends: BaseEntityRecordSchema,
    type: 'object',
    properties: {
        name: {type: 'string'},
        value: {type: 'string'},
        tdoc_id: {type: 'string', indexed: true}
    }
});
