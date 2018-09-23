import {BaseDataTechRecord} from './basedatatech-record';
import {BaseEntityRecord, BaseEntityRecordValidator} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';

export class TourDocDataTechRecord extends BaseDataTechRecord {
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

export class TourDocDataTechRecordFactory {
    static getSanitizedValues(values: {}): any {
        const sanitizedValues: any = {};
        sanitizedValues.id = BaseEntityRecord.genericFields.id.validator.sanitize(values['id']) || undefined;
        sanitizedValues.altAsc = BaseDataTechRecord.datatechFields.altAsc.validator.sanitize(values['altAsc']) || undefined;
        sanitizedValues.altDesc = BaseDataTechRecord.datatechFields.altDesc.validator.sanitize(values['altDesc']) || undefined;
        sanitizedValues.altMin = BaseDataTechRecord.datatechFields.altMin.validator.sanitize(values['altMin']) || undefined;
        sanitizedValues.altMax = BaseDataTechRecord.datatechFields.altMax.validator.sanitize(values['altMax']) || undefined;
        sanitizedValues.dist = BaseDataTechRecord.datatechFields.dist.validator.sanitize(values['dist']) || undefined;
        sanitizedValues.dur = BaseDataTechRecord.datatechFields.dur.validator.sanitize(values['dur']) || undefined;

        return sanitizedValues;
    }

    static getSanitizedValuesFromObj(doc: TourDocDataTechRecord): any {
        return TourDocDataTechRecordFactory.getSanitizedValues(doc);
    }

    static createSanitized(values: {}): TourDocDataTechRecord {
        const sanitizedValues = TourDocDataTechRecordFactory.getSanitizedValues(values);

        return new TourDocDataTechRecord(sanitizedValues);
    }

    static cloneSanitized(doc: TourDocDataTechRecord): TourDocDataTechRecord {
        const sanitizedValues = TourDocDataTechRecordFactory.getSanitizedValuesFromObj(doc);

        return new TourDocDataTechRecord(sanitizedValues);
    }
}

export class TourDocDataTechRecordValidator extends BaseEntityRecordValidator {
    public static instance = new TourDocDataTechRecordValidator();

    validateMyRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        let state = super.validateMyRules(values, errors, fieldPrefix, errFieldPrefix);

        state = this.validateRule(values, BaseDataTechRecord.datatechFields.altAsc.validator, fieldPrefix + 'altAsc', errors, errFieldPrefix) && state;
        state = this.validateRule(values, BaseDataTechRecord.datatechFields.altDesc.validator, fieldPrefix + 'altDesc', errors, errFieldPrefix) && state;
        state = this.validateRule(values, BaseDataTechRecord.datatechFields.altMin.validator, fieldPrefix + 'altMin', errors, errFieldPrefix) && state;
        state = this.validateRule(values, BaseDataTechRecord.datatechFields.altMax.validator, fieldPrefix + 'altMax', errors, errFieldPrefix) && state;
        state = this.validateRule(values, BaseDataTechRecord.datatechFields.dist.validator, fieldPrefix + 'dist', errors, errFieldPrefix) && state;
        state = this.validateRule(values, BaseDataTechRecord.datatechFields.dur.validator, fieldPrefix + 'dur', errors, errFieldPrefix) && state;

        return state;
    }
}

export let TourDocDataTechRecordRelation: any = {
    belongsTo: {
        tdoc: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related object in memory
            localField: 'tdoc'
        }
    }
};
