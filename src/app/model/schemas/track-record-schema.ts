import {BaseEntityRecordSchema} from './base-entity-record-schema';
import {Schema} from 'js-data';

export const TrackRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'Track',
    description: 'Schema for a Track Record.',
    extends: BaseEntityRecordSchema,
    type: 'object',
    properties: {
        desc: {
            type: 'string'
        },
        name: {
            type: 'string'
        },
        persons: {
            type: 'string'
        },
        type: {
            type: 'number'
        }
    }
});
