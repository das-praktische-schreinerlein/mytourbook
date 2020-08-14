import {
    BaseEntityRecord,
    BaseEntityRecordFactory,
    BaseEntityRecordFieldConfig,
    BaseEntityRecordType,
    BaseEntityRecordValidator
} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {
    GenericValidatorDatatypes,
    IdValidationRule,
    NameValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {CommonDocRecordRelationsType} from './base-types';

export interface TourDocRateTechRecordType extends BaseEntityRecordType {
    bergtour: string;
    firn: string;
    gletscher: string;
    klettern: string;
    ks: string;
    overall: string;
    schneeschuh: string;
}

export class TourDocRateTechRecord extends BaseEntityRecord implements TourDocRateTechRecordType {
    static ratetechFields = {
        bergtour: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        firn: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        gletscher: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        klettern: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        ks: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        overall: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        schneeschuh: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        tdoc_id: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(false))
    };

    bergtour: string;
    firn: string;
    gletscher: string;
    klettern: string;
    ks: string;
    overall: string;
    schneeschuh: string;

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

export let TourDocRateTechRecordRelation: CommonDocRecordRelationsType = {
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
