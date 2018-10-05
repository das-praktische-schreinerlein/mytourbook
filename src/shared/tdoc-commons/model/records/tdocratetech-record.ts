import {BaseRateTechRecord} from './baseratetech-record';
import {BaseEntityRecordFactory, BaseEntityRecordValidator} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';

export class TourDocRateTechRecord extends BaseRateTechRecord {
    tdoc_id: string;

    toString() {
        return 'TourDocRateTechRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  overall: ' + this.overall + ',\n' +
            '  tdoc_id: ' + this.tdoc_id + '' +
            '}';
    }
}

export class TourDocRateTechRecordFactory extends BaseEntityRecordFactory {
    public static instance = new TourDocRateTechRecordFactory();

    static createSanitized(values: {}): TourDocRateTechRecord {
        const sanitizedValues = TourDocRateTechRecordFactory.instance.getSanitizedValues(values, {});
        return new TourDocRateTechRecord(sanitizedValues);
    }

    static cloneSanitized(doc: TourDocRateTechRecord): TourDocRateTechRecord {
        const sanitizedValues = TourDocRateTechRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new TourDocRateTechRecord(sanitizedValues);
    }

    getSanitizedValues(values: {}, result: {}): {} {
        super.getSanitizedValues(values, result);
        this.sanitizeFieldValues(values, TourDocRateTechRecord.ratetechFields, result, '');
        return result;
    }
}

export class TourDocRateTechRecordValidator extends BaseEntityRecordValidator {
    public static instance = new TourDocRateTechRecordValidator();

    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        const state = super.validateMyFieldRules(values, errors, fieldPrefix, errFieldPrefix);
        return this.validateFieldRules(values, TourDocRateTechRecord.ratetechFields, fieldPrefix, errors, errFieldPrefix) && state;
    }
}

export let TourDocRateTechRecordRelation: any = {
    belongsTo: {
        tdoc: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related object in memory
            localField: 'tdoc'
        }
    }
};
