import {Schema} from 'js-data';
import {BaseEntityRecord} from '../records/base-entity-record';

export const BaseEntityRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'BaseEntity',
    description: 'Schema for BaseEntity Records.',
    type: 'object',
    properties: {
        id: {
            type: 'string',
        }
    }
});
BaseEntityRecordSchema.apply(BaseEntityRecord.prototype);
