import {
    BaseImageRecord,
    BaseImageRecordFactory,
    BaseImageRecordValidator
} from '@dps/mycms-commons/dist/search-commons/model/records/baseimage-record';
import {BaseEntityRecordFieldConfig} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {GenericValidatorDatatypes, IdValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {CommonDocRecordRelationsType} from './base-types';

export class TourDocImageRecord extends BaseImageRecord {
    static tdocFields = {
        tdoc_id: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(false))
    };

    tdoc_id: string;

    getMediaId(): string {
        return this.tdoc_id;
    }

    toString() {
        return 'TourDocImageRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  fileName: ' + this.fileName + '\n' +
            '  name: ' + this.name + ',\n' +
            '  tdoc_id: ' + this.tdoc_id + '' +
            '}';
    }
}

export class TourDocImageRecordFactory extends BaseImageRecordFactory {
    public static instance = new TourDocImageRecordFactory();

    static createSanitized(values: {}): TourDocImageRecord {
        const sanitizedValues = TourDocImageRecordFactory.instance.getSanitizedValues(values, {});
        return new TourDocImageRecord(sanitizedValues);
    }

    static cloneSanitized(doc: TourDocImageRecord): TourDocImageRecord {
        const sanitizedValues = TourDocImageRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new TourDocImageRecord(sanitizedValues);
    }

    getSanitizedValues(values: {}, result: {}): {} {
        super.getSanitizedValues(values, result);
        this.sanitizeFieldValues(values, TourDocImageRecord.tdocFields, result, '');
        return result;
    }
}

export class TourDocImageRecordValidator extends BaseImageRecordValidator {
    public static instance = new TourDocImageRecordValidator();

    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        const state = super.validateMyFieldRules(values, errors, fieldPrefix, errFieldPrefix);

        return this.validateFieldRules(values, TourDocImageRecord.tdocFields, fieldPrefix,
            errors, errFieldPrefix) && state;
    }
}

export let TourDocImageRecordRelation: CommonDocRecordRelationsType = {
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
