import {BaseEntityRecordSchema} from '@dps/mycms-commons/dist/search-commons/model/schemas/base-entity-record-schema';
import {Schema} from 'js-data';

export const TourDocMediaMetaRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'TourDocMediaMeta',
    description: 'Schema for a TourDocMediaMeta Record.',
    extends: BaseEntityRecordSchema,
    type: 'object',
    properties: {
        dur: {type: 'number'},
        // TODO: add type validation for date in later version -> but date-values can be string|Date
        fileCreated: {},
        fileName: {type: 'string'},
        fileSize: {type: 'number'},
        metadata: {type: 'string'},
        recordingDate: {},
        resolution: {type: 'string'},
        tdoc_id: {type: 'string', indexed: true}
    }
});
