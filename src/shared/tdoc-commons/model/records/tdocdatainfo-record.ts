import {BaseDataInfoRecord} from './basedatainfo-record';
import {BaseEntityRecord, BaseEntityRecordValidator} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';

export class TourDocDataInfoRecord extends BaseDataInfoRecord {
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

export class TourDocDataInfoRecordFactory {
    static getSanitizedValues(values: {}): any {
        const sanitizedValues: any = {};
        sanitizedValues.id = BaseEntityRecord.genericFields.id.validator.sanitize(values['id']) || undefined;
        sanitizedValues.baseloc = BaseDataInfoRecord.datainfoFields.baseloc.validator.sanitize(values['baseloc']) || undefined;
        sanitizedValues.destloc = BaseDataInfoRecord.datainfoFields.destloc.validator.sanitize(values['destloc']) || undefined;
        sanitizedValues.guides = BaseDataInfoRecord.datainfoFields.guides.validator.sanitize(values['guides']) || undefined;
        sanitizedValues.region = BaseDataInfoRecord.datainfoFields.region.validator.sanitize(values['region']) || undefined;

        return sanitizedValues;
    }

    static getSanitizedValuesFromObj(doc: TourDocDataInfoRecord): any {
        const sanitizedValues = TourDocDataInfoRecordFactory.getSanitizedValues(doc);

        return new TourDocDataInfoRecord(sanitizedValues);
    }

    static createSanitized(values: {}): TourDocDataInfoRecord {
        const sanitizedValues = TourDocDataInfoRecordFactory.getSanitizedValues(values);

        return new TourDocDataInfoRecord(sanitizedValues);
    }

    static cloneSanitized(doc: TourDocDataInfoRecord): TourDocDataInfoRecord {
        const sanitizedValues = TourDocDataInfoRecordFactory.getSanitizedValuesFromObj(doc);

        return new TourDocDataInfoRecord(sanitizedValues);
    }
}

export class TourDocDataInfoRecordValidator extends BaseEntityRecordValidator {
    public static instance = new TourDocDataInfoRecordValidator();

    validateMyRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        let state = super.validateMyRules(values, errors, fieldPrefix, errFieldPrefix);

        state = this.validateRule(values, BaseDataInfoRecord.datainfoFields.baseloc.validator, fieldPrefix + 'baseloc', errors, errFieldPrefix) && state;
        state = this.validateRule(values, BaseDataInfoRecord.datainfoFields.destloc.validator, fieldPrefix + 'destloc', errors, errFieldPrefix) && state;
        state = this.validateRule(values, BaseDataInfoRecord.datainfoFields.guides.validator, fieldPrefix + 'guides', errors, errFieldPrefix) && state;
        state = this.validateRule(values, BaseDataInfoRecord.datainfoFields.region.validator, fieldPrefix + 'region', errors, errFieldPrefix) && state;

        return state;
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
