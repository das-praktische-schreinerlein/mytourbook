import {BaseEntityRecordSchema} from '../../../search-commons/model/schemas/base-entity-record-schema';
import {Schema} from 'js-data';

export const TourDocDataTechRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'TourDocDataTech',
    description: 'Schema for a TourDocDataTech Record.',
    extends: BaseEntityRecordSchema,
    type: 'object',
    properties: {
        altAsc: {type: 'number'},
        altDesc: {type: 'number'},
        altMax: {type: 'number'},
        altMin: {type: 'number'},
        dist: {type: 'number'},
        dur: {type: 'number'},
        tdoc_id: {type: 'string', indexed: true}
    }
});
