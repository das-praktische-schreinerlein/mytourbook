import {
    BaseEntityRecord,
    BaseEntityRecordFieldConfig,
    BaseEntityRecordType
} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {GenericValidatorDatatypes, NameValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';

export interface BaseDataInfoRecordType extends BaseEntityRecordType {
    baseloc: string;
    destloc: string;
    guides: string;
    region: string;
}

export class BaseDataInfoRecord extends BaseEntityRecord implements BaseDataInfoRecordType {
    static datainfoFields = {
        baseloc: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        destloc: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        guides: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        region: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false))
    };

    baseloc: string;
    destloc: string;
    guides: string;
    region: string;

    toString() {
        return 'BaseDataTechRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  baseloc: ' + this.baseloc + ',\n' +
            '  destloc: ' + this.destloc + ',\n' +
            '  guides: ' + this.guides + ',\n' +
            '  region: ' + this.region + ',\n' +
            '}';
    }
}
