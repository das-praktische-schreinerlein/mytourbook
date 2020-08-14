import {
    BaseEntityRecord,
    BaseEntityRecordFactory,
    BaseEntityRecordFieldConfig,
    BaseEntityRecordType,
    BaseEntityRecordValidator
} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {
    DescValidationRule,
    GenericValidatorDatatypes, IdValidationRule, KeyParamsValidationRule,
    NameValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {CommonDocRecordRelationsType} from './base-types';

export interface TourDocInfoRecordType extends BaseEntityRecordType {
    name: string;
    desc: string;
    shortDesc: string;
    publisher: string;
    reference: string;
    linkedDetails: string;
    type: string;
}

export class TourDocInfoRecord extends BaseEntityRecord implements TourDocInfoRecordType {
    static infoFields = {
        name: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(true)),
        desc: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.FULLTEXT, new DescValidationRule(false)),
        shortDesc: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.FULLTEXT, new DescValidationRule(false)),
        publisher: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new DescValidationRule(false)),
        reference: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new DescValidationRule(false)),
        linkedDetails: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new DescValidationRule(false)),
        type: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new KeyParamsValidationRule(true)),
        tdoc_id: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(false))
    };

    name: string;
    desc: string;
    shortDesc: string;
    publisher: string;
    reference: string;
    linkedDetails: string;
    type: string;
    tdoc_id: string;

    toString() {
        return 'TourDocInfoRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  name: ' + this.name + ',\n' +
            '  type: ' + this.type + ',\n' +
            '  publisher: ' + this.publisher + ',\n' +
            '  reference: ' + this.reference + ',\n' +
            '  linkedDetails: ' + this.linkedDetails + ',\n' +
            '  shortDesc: ' + this.shortDesc + ',\n' +
            '  desc: ' + this.desc + ',\n' +
            '  tdoc_id: ' + this.tdoc_id + '' +
            '}';
    }
}

export class TourDocInfoRecordFactory extends BaseEntityRecordFactory {
    public static instance = new TourDocInfoRecordFactory();

    static createSanitized(values: {}): TourDocInfoRecord {
        const sanitizedValues = TourDocInfoRecordFactory.instance.getSanitizedValues(values, {});
        return new TourDocInfoRecord(sanitizedValues);
    }

    static cloneSanitized(doc: TourDocInfoRecord): TourDocInfoRecord {
        const sanitizedValues = TourDocInfoRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new TourDocInfoRecord(sanitizedValues);
    }

    getSanitizedValues(values: {}, result: {}): {} {
        super.getSanitizedValues(values, result);
        this.sanitizeFieldValues(values, TourDocInfoRecord.infoFields, result, '');
        return result;
    }
}

export class TourDocInfoRecordValidator extends BaseEntityRecordValidator {
    public static instance = new TourDocInfoRecordValidator();

    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        const state = super.validateMyFieldRules(values, errors, fieldPrefix, errFieldPrefix);

        return this.validateFieldRules(values, TourDocInfoRecord.infoFields, fieldPrefix, errors, errFieldPrefix) && state;
    }
}

export let TourDocInfoRecordRelation: CommonDocRecordRelationsType = {
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
