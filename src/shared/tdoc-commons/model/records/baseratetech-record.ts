import {
    BaseEntityRecord,
    BaseEntityRecordFieldConfig,
    BaseEntityRecordType
} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {GenericValidatorDatatypes, NameValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';

export interface BaseRateTechRecordType extends BaseEntityRecordType {
    bergtour: string;
    firn: string;
    gletscher: string;
    klettern: string;
    ks: string;
    overall: string;
    schneeschuh: string;
}

export class BaseRateTechRecord extends BaseEntityRecord implements BaseRateTechRecordType {
    static ratetechFields = {
        bergtour: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        firn: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        gletscher: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        klettern: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        ks: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        overall: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        schneeschuh: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false))
    };

    bergtour: string;
    firn: string;
    gletscher: string;
    klettern: string;
    ks: string;
    overall: string;
    schneeschuh: string;

    toString() {
        return 'BaseRateTechRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  overall: ' + this.overall + ',\n' +
            '}';
    }
}
