import {BaseDataTechRecord} from './basedatatech-record';
import {BaseEntityRecordFactory, BaseEntityRecordValidator} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';

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
