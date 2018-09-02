import {BaseEntityRecordSchema} from '@dps/mycms-commons/dist/search-commons/model/schemas/base-entity-record-schema';
import {Schema} from 'js-data';

export const TourDocRatePersonalRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'TourDocRatePersonal',
    description: 'Schema for a TourDocRatePersonal Record.',
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
        tdoc_id: {type: 'string', indexed: true}
    }
});
