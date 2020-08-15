import {
    BaseEntityRecord,
    BaseEntityRecordFactory,
    BaseEntityRecordFieldConfig,
    BaseEntityRecordRelationsType,
    BaseEntityRecordType,
    BaseEntityRecordValidator
} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {
    GenericValidatorDatatypes,
    IdValidationRule,
    NumberValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';

export interface TourDocDataTechRecordType extends BaseEntityRecordType {
    altAsc: number;
    altDesc: number;
    altMax: number;
    altMin: number;
    dist: number;
    dur: number;
}

export class TourDocDataTechRecord extends BaseEntityRecord implements TourDocDataTechRecordType {
    static datatechFields = {
        altAsc: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, 0, 999999, undefined)),
        altDesc: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, 0, 999999, undefined)),
        altMax: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, 0, 8850, undefined)),
        altMin: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, 0, 10500, undefined)),
        dist: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, 0, 99999, undefined)),
        dur: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, 0, 999999, undefined)),
        tdoc_id: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(false))
    };

    altAsc: number;
    altDesc: number;
    altMax: number;
    altMin: number;
    dist: number;
    dur: number;
    tdoc_id: string;

    toString() {
        return 'TourDocDataTechRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  altAsc: ' + this.altAsc + ',\n' +
            '  altDesc: ' + this.altDesc + ',\n' +
            '  altMax: ' + this.altMax + ',\n' +
            '  altMin: ' + this.altMin + ',\n' +
            '  dist: ' + this.dist + ',\n' +
            '  dur: ' + this.dur + ',\n' +
            '  tdoc_id: ' + this.tdoc_id + '' +
            '}';
    }
}

export class TourDocDataTechRecordFactory extends BaseEntityRecordFactory {
    public static instance = new TourDocDataTechRecordFactory();

    static createSanitized(values: {}): TourDocDataTechRecord {
        const sanitizedValues = TourDocDataTechRecordFactory.instance.getSanitizedValues(values, {});
        return new TourDocDataTechRecord(sanitizedValues);
    }

    static cloneSanitized(doc: TourDocDataTechRecord): TourDocDataTechRecord {
        const sanitizedValues = TourDocDataTechRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new TourDocDataTechRecord(sanitizedValues);
    }

    getSanitizedValues(values: {}, result: {}): {} {
        super.getSanitizedValues(values, result);
        this.sanitizeFieldValues(values, TourDocDataTechRecord.datatechFields, result, '');
        return result;
    }
}

export class TourDocDataTechRecordValidator extends BaseEntityRecordValidator {
    public static instance = new TourDocDataTechRecordValidator();

    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        const state = super.validateMyFieldRules(values, errors, fieldPrefix, errFieldPrefix);

        return this.validateFieldRules(values, TourDocDataTechRecord.datatechFields, fieldPrefix, errors, errFieldPrefix) && state;
    }
}

export let TourDocDataTechRecordRelation: BaseEntityRecordRelationsType = {
    belongsTo: {
        tdoc: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related object in memory
            localField: 'tdoc',
            mapperKey: 'tdoc'
        }
    }
};
