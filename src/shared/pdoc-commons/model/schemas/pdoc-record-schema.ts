import {BaseEntityRecordSchema} from '../../../search-commons/model/schemas/base-entity-record-schema';
import {Schema} from 'js-data';

export const PDocRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'PDoc',
    description: 'Schema for a PDoc Record.',
    extends: BaseEntityRecordSchema,
    type: 'object',
    properties: {
        pdoc_parent_id: {type: 'string'},
        desc: {type: 'string'},
        flgShowSearch: {type: 'boolean'},
        flgShowTopTen: {type: 'boolean'},
        heading: {type: 'string'},
        image: {type: 'string'},
        keywords: {type: 'string'},
        name: {type: 'string', minLength: 1, maxLength: 255},
        subSectionIds: {type: 'string'},
        teaser: {type: 'string'},
        theme: {type: 'string'},
        type: {type: 'string'}
    }
});