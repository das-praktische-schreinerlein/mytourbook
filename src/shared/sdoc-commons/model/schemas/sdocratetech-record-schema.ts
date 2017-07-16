import {BaseEntityRecordSchema} from '../../../search-commons/model/schemas/base-entity-record-schema';
import {Schema} from 'js-data';

export const SDocRateTechRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'SDocRateTech',
    description: 'Schema for a SDocRateTech Record.',
    extends: BaseEntityRecordSchema,
    type: 'object',
    properties: {
        bergtour: {type: 'string'},
        firn: {type: 'string'},
        gletscher: {type: 'string'},
        klettern: {type: 'string'},
        ks: {type: 'string'},
        overall: {type: 'string'},
        schneeschuh: {type: 'string'},
        sdoc_id: {type: 'string', indexed: true}
    }
});
