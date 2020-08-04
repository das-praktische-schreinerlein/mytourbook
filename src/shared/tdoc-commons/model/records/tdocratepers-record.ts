import {
    BaseEntityRecord,
    BaseEntityRecordFactory,
    BaseEntityRecordFieldConfig,
    BaseEntityRecordType,
    BaseEntityRecordValidator
} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {GenericValidatorDatatypes, NumberValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';

export interface TourDocRatePersonalRecordType extends BaseEntityRecordType {
    ausdauer: number;
    bildung: number;
    gesamt: number;
    kraft: number;
    mental: number;
    motive: number;
    schwierigkeit: number;
    wichtigkeit: number;
}

export class TourDocRatePersonalRecord extends BaseEntityRecord implements TourDocRatePersonalRecordType {
    static ratepersonalFields = {
        ausdauer: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, 0, 15, undefined)),
        bildung: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, 0, 15, undefined)),
        gesamt: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, -1, 15, undefined)),
        kraft: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, 0, 15, undefined)),
        mental: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, 0, 15, undefined)),
        motive: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, -1, 15, undefined)),
        schwierigkeit: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, 0, 15, undefined)),
        wichtigkeit: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, -1, 15, undefined))
    };

    ausdauer: number;
    bildung: number;
    gesamt: number;
    kraft: number;
    mental: number;
    motive: number;
    schwierigkeit: number;
    wichtigkeit: number;

    tdoc_id: string;

    toString() {
        return 'TourDocRatePersonalRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  gesamt: ' + this.gesamt + ',\n' +
            '  tdoc_id: ' + this.tdoc_id + '' +
            '}';
    }
}

export class TourDocRatePersonalRecordFactory extends BaseEntityRecordFactory {
    public static instance = new TourDocRatePersonalRecordFactory();

    static createSanitized(values: {}): TourDocRatePersonalRecord {
        const sanitizedValues = TourDocRatePersonalRecordFactory.instance.getSanitizedValues(values, {});
        return new TourDocRatePersonalRecord(sanitizedValues);
    }

    static cloneSanitized(doc: TourDocRatePersonalRecord): TourDocRatePersonalRecord {
        const sanitizedValues = TourDocRatePersonalRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new TourDocRatePersonalRecord(sanitizedValues);
    }

    getSanitizedValues(values: {}, result: {}): {} {
        super.getSanitizedValues(values, result);
        this.sanitizeFieldValues(values, TourDocRatePersonalRecord.ratepersonalFields, result, '');
        return result;
    }
}

export class TourDocRatePersonalRecordValidator extends BaseEntityRecordValidator {
    public static instance = new TourDocRatePersonalRecordValidator();

    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        const state = super.validateMyFieldRules(values, errors, fieldPrefix, errFieldPrefix);
        return this.validateFieldRules(values, TourDocRatePersonalRecord.ratepersonalFields, fieldPrefix, errors, errFieldPrefix) && state;
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
