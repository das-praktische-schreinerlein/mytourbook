import {BaseEntityRecordSchema} from '@dps/mycms-commons/dist/search-commons/model/schemas/base-entity-record-schema';
import {Schema} from 'js-data';

export const TourDocRateTechRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'TourDocRateTech',
    description: 'Schema for a TourDocRateTech Record.',
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
        tdoc_id: {type: 'string', indexed: true}
    }
});
