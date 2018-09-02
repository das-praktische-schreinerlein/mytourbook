import {BaseEntityRecordSchema} from '@dps/mycms-commons/dist/search-commons/model/schemas/base-entity-record-schema';
import {Schema} from 'js-data';

export const TourDocDataInfoRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'TourDocDataInfo',
    description: 'Schema for a TourDocDataInfo Record.',
    extends: BaseEntityRecordSchema,
    type: 'object',
    properties: {
        baseloc: {type: 'string'},
        destloc: {type: 'string'},
        guides: {type: 'string'},
        region: {type: 'string'},
        tdoc_id: {type: 'string', indexed: true}
    }
});
