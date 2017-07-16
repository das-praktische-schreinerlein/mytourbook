import {BaseEntityRecordSchema} from '../../../search-commons/model/schemas/base-entity-record-schema';
import {Schema} from 'js-data';

export const SDocDataTechRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'SDocDataTech',
    description: 'Schema for a SDocDataTech Record.',
    extends: BaseEntityRecordSchema,
    type: 'object',
    properties: {
        altAsc: {type: 'number'},
        altDesc: {type: 'number'},
        altMax: {type: 'number'},
        altMin: {type: 'number'},
        dist: {type: 'number'},
        dur: {type: 'number'},
        sdoc_id: {type: 'string', indexed: true}
    }
});
