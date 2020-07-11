import {
    BaseEntityRecord,
    BaseEntityRecordFactory,
    BaseEntityRecordFieldConfig,
    BaseEntityRecordType,
    BaseEntityRecordValidator
} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {
    GenericValidatorDatatypes,
    HtmlValidationRule,
    NameValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';

export interface TourDocFlagObjectRecordType extends BaseEntityRecordType {
    name: string;
    value: any;
}

export class TourDocFlagObjectRecord extends BaseEntityRecord implements TourDocFlagObjectRecordType {
    static flagObjectFields = {
        name: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(true)),
        value: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.FULLTEXT, new HtmlValidationRule(false))
    };

    tdoc_id: string;
    name: string;
    value: any;

    toString() {
        return 'TourDocFlagObjectRecord Record {\n' +
            '  tdoc_id: ' + this.tdoc_id + ',\n' +
            '  id: ' + this.id + ',\n' +
            '  name: ' + this.name + ',\n' +
            '  value: ' + this.value + ')\n' +
            '}';
    }
}

export class TourDocFlagObjectRecordFactory extends BaseEntityRecordFactory {
    public static instance = new TourDocFlagObjectRecordFactory();

    static createSanitized(values: {}): TourDocFlagObjectRecord {
        const sanitizedValues = TourDocFlagObjectRecordFactory.instance.getSanitizedValues(values, {});
        return new TourDocFlagObjectRecord(sanitizedValues);
    }

    static cloneSanitized(doc: TourDocFlagObjectRecord): TourDocFlagObjectRecord {
        const sanitizedValues = TourDocFlagObjectRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new TourDocFlagObjectRecord(sanitizedValues);
    }

    getSanitizedValues(values: {}, result: {}): {} {
        super.getSanitizedValues(values, result);
        this.sanitizeFieldValues(values, TourDocFlagObjectRecord.flagObjectFields, result, '');
        return result;
    }
}

export class TourDocFlagObjectRecordValidator extends BaseEntityRecordValidator {
    public static instance = new TourDocFlagObjectRecordValidator();

    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        const state = super.validateMyFieldRules(values, errors, fieldPrefix, errFieldPrefix);

        return this.validateFieldRules(values, TourDocFlagObjectRecord.flagObjectFields, fieldPrefix,
            errors, errFieldPrefix) && state;
    }
}

export let TourDocFlagObjectRecordRelation: any = {
    belongsTo: {
        tdoc: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related object in memory
            localField: 'tdoc'
        }
    }
};
