import {
    BaseEntityRecordFactory,
    BaseEntityRecordFieldConfig,
    BaseEntityRecordValidator
} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {BaseExtendedObjectPropertyRecord, BaseExtendedObjectPropertyRecordType} from './baseextendedobjectproperty-record';
import {GenericValidatorDatatypes, IdValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';

// tslint:disable-next-line:no-empty-interface
export interface TourDocExtendedObjectPropertyRecordType extends BaseExtendedObjectPropertyRecordType {
}

export class TourDocExtendedObjectPropertyRecord extends BaseExtendedObjectPropertyRecord
    implements TourDocExtendedObjectPropertyRecordType {
    static extendedObjectPropertyFields = {
        ... BaseExtendedObjectPropertyRecord.extendedObjectPropertyFields,
        tdoc_id: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(false))
    };

    tdoc_id: string;

    toString() {
        return 'TourDocExtendedObjectPropertyRecord Record {\n' +
            '  tdoc_id: ' + this.tdoc_id + ',\n' +
            '  id: ' + this.id + ',\n' +
            '  category: ' + this.category + ',\n' +
            '  name: ' + this.name + ',\n' +
            '  value: ' + this.value + ')\n' +
            '}';
    }
}

export class TourDocExtendedObjectPropertyRecordFactory extends BaseEntityRecordFactory {
    public static instance = new TourDocExtendedObjectPropertyRecordFactory();

    static createSanitized(values: {}): TourDocExtendedObjectPropertyRecord {
        const sanitizedValues = TourDocExtendedObjectPropertyRecordFactory.instance.getSanitizedValues(values, {});
        return new TourDocExtendedObjectPropertyRecord(sanitizedValues);
    }

    static cloneSanitized(doc: TourDocExtendedObjectPropertyRecord): TourDocExtendedObjectPropertyRecord {
        const sanitizedValues = TourDocExtendedObjectPropertyRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new TourDocExtendedObjectPropertyRecord(sanitizedValues);
    }

    getSanitizedValues(values: {}, result: {}): {} {
        super.getSanitizedValues(values, result);
        this.sanitizeFieldValues(values, TourDocExtendedObjectPropertyRecord.extendedObjectPropertyFields, result, '');
        return result;
    }
}

export class TourDocExtendedObjectPropertyRecordValidator extends BaseEntityRecordValidator {
    public static instance = new TourDocExtendedObjectPropertyRecordValidator();

    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        const state = super.validateMyFieldRules(values, errors, fieldPrefix, errFieldPrefix);

        return this.validateFieldRules(values, TourDocExtendedObjectPropertyRecord.extendedObjectPropertyFields, fieldPrefix,
            errors, errFieldPrefix) && state;
    }
}

export let TourDocExtendedObjectPropertyRecordRelation: any = {
    belongsTo: {
        tdoc: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related object in memory
            localField: 'tdoc'
        }
    }
};
