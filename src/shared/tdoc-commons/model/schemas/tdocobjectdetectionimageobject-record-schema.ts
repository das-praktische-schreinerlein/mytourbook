import {Schema} from 'js-data';
import {TourDocImageRecordSchema} from './tdocimage-record-schema';

export const TourDocObjectDetectionImageObjectRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'TourDocObjectDetectionImageObject',
    description: 'Schema for a TourDocObjectDetectionImageObject Record.',
    extends: TourDocImageRecordSchema,
    type: 'object',
    properties: {
        descTxt: {type: 'string'},
        descMd: {type: 'string'},
        descHtml: {type: 'string'},
        fileName: {type: 'string'},
        name: {type: 'string'},
        detector: {type: 'string'},
        key: {type: 'string'},
        keySuggestion: {type: 'string'},
        keyCorrection: {type: 'string'},
        state: {type: 'string'},
        imgWidth: {type: 'number'},
        imgHeight: {type: 'number'},
        objX: {type: 'number'},
        objY: {type: 'number'},
        objWidth: {type: 'number'},
        objHeight: {type: 'number'},
        tdoc_id: {type: 'string', indexed: true}
    }
});
