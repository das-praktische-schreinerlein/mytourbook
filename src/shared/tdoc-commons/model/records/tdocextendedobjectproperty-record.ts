import {BaseEntityRecordFactory, BaseEntityRecordValidator} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {BaseExtendedObjectPropertyRecord, BaseExtendedObjectPropertyRecordType} from './baseextendedobjectproperty-record';

// tslint:disable-next-line:no-empty-interface
export interface TourDocExtendedObjectPropertyRecordType extends BaseExtendedObjectPropertyRecordType {
}

export class TourDocExtendedObjectPropertyRecord extends BaseExtendedObjectPropertyRecord
    implements TourDocExtendedObjectPropertyRecordType {
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
        this.sanitizeFieldValues(values, BaseExtendedObjectPropertyRecord.extendedObjectPropertyFields, result, '');
        return result;
    }
}

export class TourDocExtendedObjectPropertyRecordValidator extends BaseEntityRecordValidator {
    public static instance = new TourDocExtendedObjectPropertyRecordValidator();

    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        const state = super.validateMyFieldRules(values, errors, fieldPrefix, errFieldPrefix);

        return this.validateFieldRules(values, BaseExtendedObjectPropertyRecord.extendedObjectPropertyFields, fieldPrefix,
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
