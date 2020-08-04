import {
    BaseEntityRecord,
    BaseEntityRecordFactory,
    BaseEntityRecordFieldConfig,
    BaseEntityRecordType,
    BaseEntityRecordValidator
} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {GenericValidatorDatatypes, NameValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';

export interface TourDocDataInfoRecordType extends BaseEntityRecordType {
    baseloc: string;
    destloc: string;
    guides: string;
    region: string;
}

export class TourDocDataInfoRecord extends BaseEntityRecord implements TourDocDataInfoRecordType {
    static datainfoFields = {
        baseloc: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        destloc: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        guides: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        region: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false))
    };

    baseloc: string;
    destloc: string;
    guides: string;
    region: string;
    tdoc_id: string;

    toString() {
        return 'TourDocDataInfoRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  baseloc: ' + this.baseloc + ',\n' +
            '  destloc: ' + this.destloc + ',\n' +
            '  guides: ' + this.guides + ',\n' +
            '  region: ' + this.region + ',\n' +
            '  tdoc_id: ' + this.tdoc_id + '' +
            '}';
    }
}

export class TourDocDataInfoRecordFactory extends BaseEntityRecordFactory {
    public static instance = new TourDocDataInfoRecordFactory();

    static createSanitized(values: {}): TourDocDataInfoRecord {
        const sanitizedValues = TourDocDataInfoRecordFactory.instance.getSanitizedValues(values, {});
        return new TourDocDataInfoRecord(sanitizedValues);
    }

    static cloneSanitized(doc: TourDocDataInfoRecord): TourDocDataInfoRecord {
        const sanitizedValues = TourDocDataInfoRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new TourDocDataInfoRecord(sanitizedValues);
    }

    getSanitizedValues(values: {}, result: {}): {} {
        super.getSanitizedValues(values, result);
        this.sanitizeFieldValues(values, TourDocDataInfoRecord.datainfoFields, result, '');
        return result;
    }
}

export class TourDocDataInfoRecordValidator extends BaseEntityRecordValidator {
    public static instance = new TourDocDataInfoRecordValidator();

    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        const state = super.validateMyFieldRules(values, errors, fieldPrefix, errFieldPrefix);

        return this.validateFieldRules(values, TourDocDataInfoRecord.datainfoFields, fieldPrefix, errors, errFieldPrefix) && state;
    }
}

export let TourDocDataInfoRecordRelation: any = {
    belongsTo: {
        tdoc: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related object in memory
            localField: 'tdoc'
        }
    }
};
