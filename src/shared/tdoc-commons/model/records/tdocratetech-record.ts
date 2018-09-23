import {BaseRateTechRecord} from './baseratetech-record';
import {BaseEntityRecord, BaseEntityRecordValidator} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';

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

export class TourDocRateTechRecordFactory {
    static getSanitizedValues(values: {}): any {
        const sanitizedValues: any = {};
        sanitizedValues.id = BaseEntityRecord.genericFields.id.validator.sanitize(values['id']) || undefined;
        sanitizedValues.bergtour = BaseRateTechRecord.ratetechFields.bergtour.validator.sanitize(values['bergtour']) || undefined;
        sanitizedValues.firn = BaseRateTechRecord.ratetechFields.firn.validator.sanitize(values['firn']) || undefined;
        sanitizedValues.gletscher = BaseRateTechRecord.ratetechFields.gletscher.validator.sanitize(values['gletscher']) || undefined;
        sanitizedValues.klettern = BaseRateTechRecord.ratetechFields.klettern.validator.sanitize(values['klettern']) || undefined;
        sanitizedValues.ks = BaseRateTechRecord.ratetechFields.ks.validator.sanitize(values['ks']) || undefined;
        sanitizedValues.overall = BaseRateTechRecord.ratetechFields.overall.validator.sanitize(values['overall']) || undefined;
        sanitizedValues.schneeschuh = BaseRateTechRecord.ratetechFields.schneeschuh.validator.sanitize(values['schneeschuh']) || undefined;

        return sanitizedValues;
    }

    static getSanitizedValuesFromObj(doc: TourDocRateTechRecord): any {
        return TourDocRateTechRecordFactory.getSanitizedValues(doc);
    }

    static createSanitized(values: {}): TourDocRateTechRecord {
        const sanitizedValues = TourDocRateTechRecordFactory.getSanitizedValues(values);

        return new TourDocRateTechRecord(sanitizedValues);
    }

    static cloneSanitized(doc: TourDocRateTechRecord): TourDocRateTechRecord {
        const sanitizedValues = TourDocRateTechRecordFactory.getSanitizedValuesFromObj(doc);

        return new TourDocRateTechRecord(sanitizedValues);
    }
}

export class TourDocRateTechRecordValidator extends BaseEntityRecordValidator {
    public static instance = new TourDocRateTechRecordValidator();

    validateMyRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        let state = super.validateMyRules(values, errors, fieldPrefix, errFieldPrefix);
        state = this.validateRule(values, BaseEntityRecord.genericFields.id.validator, fieldPrefix + 'id', errors, errFieldPrefix) && state;
        state = this.validateRule(values, BaseRateTechRecord.ratetechFields.bergtour.validator, fieldPrefix + 'bergtour', errors, errFieldPrefix) && state;
        state = this.validateRule(values, BaseRateTechRecord.ratetechFields.firn.validator, fieldPrefix + 'firn', errors, errFieldPrefix) && state;
        state = this.validateRule(values, BaseRateTechRecord.ratetechFields.gletscher.validator, fieldPrefix + 'gletscher', errors, errFieldPrefix) && state;
        state = this.validateRule(values, BaseRateTechRecord.ratetechFields.klettern.validator, fieldPrefix + 'klettern', errors, errFieldPrefix) && state;
        state = this.validateRule(values, BaseRateTechRecord.ratetechFields.ks.validator, fieldPrefix + 'ks', errors, errFieldPrefix) && state;
        state = this.validateRule(values, BaseRateTechRecord.ratetechFields.overall.validator, fieldPrefix + 'overall', errors, errFieldPrefix) && state;
        state = this.validateRule(values, BaseRateTechRecord.ratetechFields.schneeschuh.validator, fieldPrefix + 'schneeschuh', errors, errFieldPrefix) && state;

        return state;
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
