import {BaseEntityRecordSchema} from '../../../search-commons/model/schemas/base-entity-record-schema';
import {Schema} from 'js-data';

export const SDocRatePersonalRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'SDocRatePersonal',
    description: 'Schema for a SDocRatePersonal Record.',
    extends: BaseEntityRecordSchema,
    type: 'object',
    properties: {
        ausdauer: {type: 'number'},
        bildung: {type: 'number'},
        gesamt: {type: 'number'},
        kraft: {type: 'number'},
        mental: {type: 'number'},
        motive: {type: 'number'},
        schwierigkeit: {type: 'number'},
        wichtigkeit: {type: 'number'},
        sdoc_id: {type: 'string', indexed: true}
    }
});
