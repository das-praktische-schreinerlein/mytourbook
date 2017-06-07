import {BaseEntityRecordSchema} from './base-entity-record-schema';
import {Schema} from 'js-data';

export const SDocRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'SDoc',
    description: 'Schema for a SDoc Record.',
    extends: BaseEntityRecordSchema,
    type: 'object',
    properties: {
        desc: {type: 'string'},
        name: {type: 'string'},
        type: {type: 'number'}
    }
});
