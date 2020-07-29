import {
    BaseEntityRecord,
    BaseEntityRecordFieldConfig,
    BaseEntityRecordType
} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {
    GenericValidatorDatatypes,
    HtmlValidationRule,
    NameValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';

export interface BaseExtendedObjectPropertyRecordType extends BaseEntityRecordType {
    category: string;
    name: string;
    value: any;
}

export abstract class BaseExtendedObjectPropertyRecord extends BaseEntityRecord implements BaseExtendedObjectPropertyRecordType {
    static extendedObjectPropertyFields = {
        category: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(true)),
        name: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(true)),
        value: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.FULLTEXT, new HtmlValidationRule(false))
    };

    category: string;
    name: string;
    value: any;

    toString() {
        return 'BaseExtendedObjectPropertyRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  category: ' + this.category + ',\n' +
            '  name: ' + this.name + ',\n' +
            '  value: ' + this.value + ')\n' +
            '}';
    }
}
