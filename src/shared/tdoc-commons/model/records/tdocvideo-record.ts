import {
    BaseVideoRecord,
    BaseVideoRecordFactory,
    BaseVideoRecordValidator
} from '@dps/mycms-commons/dist/search-commons/model/records/basevideo-record';
import {BaseEntityRecordFieldConfig} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {GenericValidatorDatatypes, IdValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {CommonDocRecordRelationsType} from './base-types';

export class TourDocVideoRecord extends BaseVideoRecord {
    static tdocFields = {
        tdoc_id: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(false))
    };

    tdoc_id: string;

    getMediaId(): string {
        return this.tdoc_id;
    }

    toString() {
        return 'TourDocVideoRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  fileName: ' + this.fileName + '\n' +
            '  name: ' + this.name + ',\n' +
            '  tdoc_id: ' + this.tdoc_id + '' +
            '}';
    }
}

export class TourDocVideoRecordFactory extends BaseVideoRecordFactory {
    public static instance = new TourDocVideoRecordFactory();

    static createSanitized(values: {}): TourDocVideoRecord {
        const sanitizedValues = TourDocVideoRecordFactory.instance.getSanitizedValues(values, {});
        return new TourDocVideoRecord(sanitizedValues);
    }

    static cloneSanitized(doc: TourDocVideoRecord): TourDocVideoRecord {
        const sanitizedValues = TourDocVideoRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new TourDocVideoRecord(sanitizedValues);
    }

    getSanitizedValues(values: {}, result: {}): {} {
        super.getSanitizedValues(values, result);
        this.sanitizeFieldValues(values, TourDocVideoRecord.tdocFields, result, '');
        return result;
    }
}

export class TourDocVideoRecordValidator extends BaseVideoRecordValidator {
    public static instance = new TourDocVideoRecordValidator();

    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        const state = super.validateMyFieldRules(values, errors, fieldPrefix, errFieldPrefix);

        return this.validateFieldRules(values, TourDocVideoRecord.tdocFields, fieldPrefix,
            errors, errFieldPrefix) && state;
    }
}

export let TourDocVideoRecordRelation: CommonDocRecordRelationsType = {
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
