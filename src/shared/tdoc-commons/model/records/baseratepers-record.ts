import {
    BaseEntityRecord,
    BaseEntityRecordFieldConfig,
    BaseEntityRecordType
} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {GenericValidatorDatatypes, NumberValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';

export interface BaseRatePersonalRecordType extends BaseEntityRecordType {
    ausdauer: number;
    bildung: number;
    gesamt: number;
    kraft: number;
    mental: number;
    motive: number;
    schwierigkeit: number;
    wichtigkeit: number;
}

export class BaseRatePersonalRecord extends BaseEntityRecord implements BaseRatePersonalRecordType {
    static ratepersonalFields = {
        ausdauer: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, 0, 15, undefined)),
        bildung: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, 0, 15, undefined)),
        gesamt: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, -1, 15, undefined)),
        kraft: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, 0, 15, undefined)),
        mental: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, 0, 15, undefined)),
        motive: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, -1, 15, undefined)),
        schwierigkeit: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, 0, 15, undefined)),
        wichtigkeit: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, -1, 15, undefined))
    };

    ausdauer: number;
    bildung: number;
    gesamt: number;
    kraft: number;
    mental: number;
    motive: number;
    schwierigkeit: number;
    wichtigkeit: number;

    toString() {
        return 'BaseRatePersonalRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  gesamt: ' + this.gesamt + ',\n' +
            '}';
    }
}
