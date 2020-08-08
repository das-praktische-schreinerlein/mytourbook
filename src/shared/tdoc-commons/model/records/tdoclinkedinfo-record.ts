import {
    BaseEntityRecordFactory,
    BaseEntityRecordFieldConfig,
    BaseEntityRecordValidator
} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {BaseJoinRecord, BaseJoinRecordType} from './basejoin-record';
import {
    DescValidationRule,
    GenericValidatorDatatypes,
    IdValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';

export interface TourDocLinkedInfoRecordType extends BaseJoinRecordType {
    linkedDetails: string;
}

export class TourDocLinkedInfoRecord extends BaseJoinRecord implements TourDocLinkedInfoRecordType {
    static infoFields = {...BaseJoinRecord.joinFields,
        linkedDetails: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new DescValidationRule(false)),
        tdoc_id: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(false))
    };

    linkedDetails: string;
    tdoc_id: string;

    getMediaId(): string {
        return this.tdoc_id;
    }

    toString() {
        return 'TourDocLinkedInfoRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  refId: ' + this.refId + '\n' +
            '  name: ' + this.name + ',\n' +
            '  type: ' + this.type + ',\n' +
            '  linkedDetails: ' + this.linkedDetails + ',\n' +
            '  tdoc_id: ' + this.tdoc_id + '' +
            '}';
    }
}

export class TourDocLinkedInfoRecordFactory extends BaseEntityRecordFactory {
    public static instance = new TourDocLinkedInfoRecordFactory();

    static createSanitized(values: {}): TourDocLinkedInfoRecord {
        const sanitizedValues = TourDocLinkedInfoRecordFactory.instance.getSanitizedValues(values, {});
        return new TourDocLinkedInfoRecord(sanitizedValues);
    }

    static cloneSanitized(doc: TourDocLinkedInfoRecord): TourDocLinkedInfoRecord {
        const sanitizedValues = TourDocLinkedInfoRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new TourDocLinkedInfoRecord(sanitizedValues);
    }

    getSanitizedValues(values: {}, result: {}): {} {
        super.getSanitizedValues(values, result);
        this.sanitizeFieldValues(values, TourDocLinkedInfoRecord.infoFields, result, '');

        return result;
    }
}

export class TourDocLinkedInfoRecordValidator extends BaseEntityRecordValidator {
    public static instance = new TourDocLinkedInfoRecordValidator();

    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        const state = super.validateMyFieldRules(values, errors, fieldPrefix, errFieldPrefix);
        return this.validateFieldRules(values, TourDocLinkedInfoRecord.joinFields, fieldPrefix, errors, errFieldPrefix) && state;
    }
}

export let TourDocLinkedInfoRecordRelation: any = {
    belongsTo: {
        tdoc: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related object in memory
            localField: 'tdoc'
        }
    }
};
