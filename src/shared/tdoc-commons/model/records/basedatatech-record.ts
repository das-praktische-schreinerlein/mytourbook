import {
    BaseEntityRecord,
    BaseEntityRecordFieldConfig,
    BaseEntityRecordType
} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {GenericValidatorDatatypes, NumberValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';

export interface BaseDataTechRecordType extends BaseEntityRecordType {
    altAsc: number;
    altDesc: number;
    altMax: number;
    altMin: number;
    dist: number;
    dur: number;
}

export class BaseDataTechRecord extends BaseEntityRecord implements BaseDataTechRecordType {
    static datatechFields = {
        altAsc: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, 0, 999999, undefined)),
        altDesc: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, 0, 999999, undefined)),
        altMax: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, 0, 8850, undefined)),
        altMin: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, 0, 10500, undefined)),
        dist: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, 0, 99999, undefined)),
        dur: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, 0, 999999, undefined))
    };

    altAsc: number;
    altDesc: number;
    altMax: number;
    altMin: number;
    dist: number;
    dur: number;

    toString() {
        return 'BaseDataTechRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  altAsc: ' + this.altAsc + ',\n' +
            '  altDesc: ' + this.altDesc + ',\n' +
            '  altMax: ' + this.altMax + ',\n' +
            '  altMin: ' + this.altMin + ',\n' +
            '  dist: ' + this.dist + ',\n' +
            '  dur: ' + this.dur + ',\n' +
            '}';
    }
}
