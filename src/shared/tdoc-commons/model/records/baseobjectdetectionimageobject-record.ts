import {BaseEntityRecordFieldConfig} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {
    GenericValidatorDatatypes,
    NameValidationRule,
    NumberValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {BaseImageRecord, BaseImageRecordType} from '@dps/mycms-commons/dist/search-commons/model/records/baseimage-record';

export enum BaseObjectDetectionState {
    'UNKNOWN', 'OPEN', 'ERROR',
    'RUNNING_SUGGESTED',
    'RUNNING_MANUAL_APPROVED', 'RUNNING_MANUAL_REJECTED', 'RUNNING_MANUAL_CORRECTION_NEEDED', 'RUNNING_MANUAL_CORRECTED',
    'DONE_APPROVAL_PROCESSED', 'DONE_REJECTION_PROCESSED', 'DONE_CORRECTION_PROCESSED'
}
export interface BaseObjectDetectionImageObjectRecordType extends BaseImageRecordType {
    detector: string;
    key: string;
    keySuggestion: string;
    keyCorrection: string;
    state: string;
    imgWidth: number;
    imgHeight: number;
    objX: number;
    objY: number;
    objWidth: number;
    objHeight: number;
}

export class BaseObjectDetectionImageObjectRecord extends BaseImageRecord implements BaseObjectDetectionImageObjectRecordType {
    static objectDetectionImageObjectFields = {
        detector: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(true)),
        key: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(true)),
        keySuggestion: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        keyCorrection: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        state: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(true)),
        imgWidth: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER, new NumberValidationRule(false, 0, 999999, 0)),
        imgHeight: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER, new NumberValidationRule(false, 0, 999999, 0)),
        objX: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER, new NumberValidationRule(false, 0, 999999, 0)),
        objY: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER, new NumberValidationRule(false, 0, 999999, 0)),
        objWidth: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER, new NumberValidationRule(false, 0, 999999, 0)),
        objHeight: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER, new NumberValidationRule(false, 0, 999999, 0))
    };

    detector: string;
    key: string;
    keySuggestion: string;
    keyCorrection: string;
    state: string;
    imgWidth: number;
    imgHeight: number;
    objX: number;
    objY: number;
    objWidth: number;
    objHeight: number;

    toString() {
        return 'BaseObjectDetectionImageObjectRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  class: ' + this.detector + ',\n' +
            '  key: ' + this.key + ',\n' +
            '  pos: ' + this.objX + ',' + this.objY + '(' + this.objWidth + ',' + this.objHeight + ')\n' +
            '}';
    }
}
