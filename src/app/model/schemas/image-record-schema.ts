import {BaseEntityRecordSchema} from './base-entity-record-schema';
import {Schema} from 'js-data';

export const ImageRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'Image',
    description: 'Schema for a Image Record.',
    extends: BaseEntityRecordSchema,
    type: 'object',
    properties: {
        desc: {type: 'string'},
        fileName: {type: 'string'},
        name: {type: 'string'},
        track_id: {type: 'number', indexed: true}
    }
});
