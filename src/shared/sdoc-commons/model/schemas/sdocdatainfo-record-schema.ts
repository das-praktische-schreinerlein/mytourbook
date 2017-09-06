import {BaseEntityRecordSchema} from '../../../search-commons/model/schemas/base-entity-record-schema';
import {Schema} from 'js-data';

export const SDocDataInfoRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'SDocDataInfo',
    description: 'Schema for a SDocDataInfo Record.',
    extends: BaseEntityRecordSchema,
    type: 'object',
    properties: {
        baseloc: {type: 'string'},
        destloc: {type: 'string'},
        guides: {type: 'string'},
        region: {type: 'string'},
        sdoc_id: {type: 'string', indexed: true}
    }
});
