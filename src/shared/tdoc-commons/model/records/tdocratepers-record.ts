import {BaseRatePersonalRecord} from './baseratepers-record';
import {BaseEntityRecord, BaseEntityRecordValidator} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';

export class TourDocRatePersonalRecord extends BaseRatePersonalRecord {
    tdoc_id: string;

    toString() {
        return 'TourDocRatePersonalRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  gesamt: ' + this.gesamt + ',\n' +
            '  tdoc_id: ' + this.tdoc_id + '' +
            '}';
    }
}

export class TourDocRatePersonalRecordFactory {
    static getSanitizedValues(values: {}): any {
        const sanitizedValues: any = {};
        sanitizedValues.id = BaseEntityRecord.genericFields.id.validator.sanitize(values['id']) || undefined;
        sanitizedValues.ausdauer = BaseRatePersonalRecord.ratepersonalFields.ausdauer.validator.sanitize(values['ausdauer']) || undefined;
        sanitizedValues.bildung = BaseRatePersonalRecord.ratepersonalFields.bildung.validator.sanitize(values['bildung']) || undefined;
        sanitizedValues.gesamt = BaseRatePersonalRecord.ratepersonalFields.gesamt.validator.sanitize(values['gesamt']) || undefined;
        sanitizedValues.kraft = BaseRatePersonalRecord.ratepersonalFields.kraft.validator.sanitize(values['kraft']) || undefined;
        sanitizedValues.mental = BaseRatePersonalRecord.ratepersonalFields.mental.validator.sanitize(values['mental']) || undefined;
        sanitizedValues.motive = BaseRatePersonalRecord.ratepersonalFields.motive.validator.sanitize(values['motive']) || undefined;
        sanitizedValues.schwierigkeit = BaseRatePersonalRecord.ratepersonalFields.schwierigkeit.validator.sanitize(values['schwierigkeit']) || undefined;
        sanitizedValues.wichtigkeit = BaseRatePersonalRecord.ratepersonalFields.wichtigkeit.validator.sanitize(values['wichtigkeit']) || undefined;

        return sanitizedValues;
    }

    static getSanitizedValuesFromObj(doc: TourDocRatePersonalRecord): any {
        return TourDocRatePersonalRecordFactory.getSanitizedValues(doc);
    }

    static createSanitized(values: {}): TourDocRatePersonalRecord {
        const sanitizedValues = TourDocRatePersonalRecordFactory.getSanitizedValues(values);

        return new TourDocRatePersonalRecord(sanitizedValues);
    }

    static cloneSanitized(doc: TourDocRatePersonalRecord): TourDocRatePersonalRecord {
        const sanitizedValues = TourDocRatePersonalRecordFactory.getSanitizedValuesFromObj(doc);

        return new TourDocRatePersonalRecord(sanitizedValues);
    }
}

export class TourDocRatePersonalRecordValidator extends BaseEntityRecordValidator {
    public static instance = new TourDocRatePersonalRecordValidator();

    validateMyRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        let state = super.validateMyRules(values, errors, fieldPrefix, errFieldPrefix);
        state = this.validateRule(values, BaseRatePersonalRecord.ratepersonalFields.ausdauer.validator, fieldPrefix + 'ausdauer', errors, errFieldPrefix) && state;
        state = this.validateRule(values, BaseRatePersonalRecord.ratepersonalFields.bildung.validator, fieldPrefix + 'bildung', errors, errFieldPrefix) && state;
        state = this.validateRule(values, BaseRatePersonalRecord.ratepersonalFields.gesamt.validator, fieldPrefix + 'gesamt', errors, errFieldPrefix) && state;
        state = this.validateRule(values, BaseRatePersonalRecord.ratepersonalFields.kraft.validator, fieldPrefix + 'kraft', errors, errFieldPrefix) && state;
        state = this.validateRule(values, BaseRatePersonalRecord.ratepersonalFields.mental.validator, fieldPrefix + 'mental', errors, errFieldPrefix) && state;
        state = this.validateRule(values, BaseRatePersonalRecord.ratepersonalFields.motive.validator, fieldPrefix + 'motive', errors, errFieldPrefix) && state;
        state = this.validateRule(values, BaseRatePersonalRecord.ratepersonalFields.schwierigkeit.validator, fieldPrefix + 'schwierigkeit', errors, errFieldPrefix) && state;
        state = this.validateRule(values, BaseRatePersonalRecord.ratepersonalFields.wichtigkeit.validator, fieldPrefix + 'wichtigkeit', errors, errFieldPrefix) && state;

        return state;
    }
}


export let TourDocRatePersonalRecordRelation: any = {
    belongsTo: {
        tdoc: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related object in memory
            localField: 'tdoc'
        }
    }
};
