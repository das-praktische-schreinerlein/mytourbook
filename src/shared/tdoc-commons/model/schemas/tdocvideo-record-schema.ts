import {BaseEntityRecordSchema} from '../../../search-commons/model/schemas/base-entity-record-schema';
import {Schema} from 'js-data';

export const TourDocVideoRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'TourDocVideo',
    description: 'Schema for a TourDocImage Record.',
    extends: BaseEntityRecordSchema,
    type: 'object',
    properties: {
        descTxt: {type: 'string'},
        descMd: {type: 'string'},
        descHtml: {type: 'string'},
        fileName: {type: 'string'},
        name: {type: 'string'},
        tdoc_id: {type: 'string', indexed: true}
    }
});
