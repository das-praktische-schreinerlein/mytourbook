import {
    BaseEntityRecordFieldConfig,
    BaseEntityRecordRelationsType,
    BaseEntityRecordValidator
} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {GenericValidatorDatatypes, IdValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {BaseMediaMetaRecord, BaseMediaMetaRecordFactory} from '@dps/mycms-commons/dist/search-commons/model/records/basemediameta-record';

export class TourDocMediaMetaRecord extends BaseMediaMetaRecord {
    static mediametaFields = {
        ... BaseMediaMetaRecord.mediametaFields,
        tdoc_id: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(false))
    };

    tdoc_id: string;

    toString() {
        return 'TourDocMediaMetaRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  fileCreated: ' + this.fileCreated + ',\n' +
            '  fileSize: ' + this.fileSize + ',\n' +
            '  dur: ' + this.dur + ',\n' +
            '  tdoc_id: ' + this.tdoc_id + '' +
            '}';
    }
}

export class TourDocMediaMetaRecordFactory extends BaseMediaMetaRecordFactory {
    public static instance = new TourDocMediaMetaRecordFactory();

    static createSanitized(values: {}): TourDocMediaMetaRecord {
        const sanitizedValues = TourDocMediaMetaRecordFactory.instance.getSanitizedValues(values, {});
        return new TourDocMediaMetaRecord(sanitizedValues);
    }

    static cloneSanitized(doc: TourDocMediaMetaRecord): TourDocMediaMetaRecord {
        const sanitizedValues = TourDocMediaMetaRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new TourDocMediaMetaRecord(sanitizedValues);
    }

    getSanitizedValues(values: {}, result: {}): {} {
        super.getSanitizedValues(values, result);
        this.sanitizeFieldValues(values, TourDocMediaMetaRecord.mediametaFields, result, '');
        return result;
    }
}

export class TourDocMediaMetaRecordValidator extends BaseEntityRecordValidator {
    public static instance = new TourDocMediaMetaRecordValidator();

    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        const state = super.validateMyFieldRules(values, errors, fieldPrefix, errFieldPrefix);

        return this.validateFieldRules(values, TourDocMediaMetaRecord.mediametaFields, fieldPrefix, errors, errFieldPrefix) && state;
    }
}

export let TourDocMediaMetaRecordRelation: BaseEntityRecordRelationsType = {
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
