import {
    BaseEntityRecordFactory,
    BaseEntityRecordFieldConfig,
    BaseEntityRecordRelationsType,
    BaseEntityRecordValidator
} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {BaseJoinRecord, BaseJoinRecordType} from '@dps/mycms-commons/dist/search-commons/model/records/basejoin-record';
import {
    GenericValidatorDatatypes,
    IdValidationRule,
    NameValidationRule,
    WhiteListValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';

// tslint:disable-next-line:no-empty-interface
export interface TourDocLinkedRouteRecordType extends BaseJoinRecordType {
    full: boolean;
}

export class TourDocLinkedRouteRecord extends BaseJoinRecord implements TourDocLinkedRouteRecordType {
    static routeFields = {...BaseJoinRecord.joinFields,
        full: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME,
            new WhiteListValidationRule(false, [true, false, 'true', 'false'], false)),
        linkedRouteAttr: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME,
            new NameValidationRule(false)),
        tdoc_id: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(false))
    };

    tdoc_id: string;
    full: boolean;
    linkedRouteAttr: string;

    getMediaId(): string {
        return this.tdoc_id;
    }

    toString() {
        return 'TourDocLinkedRouteRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  refId: ' + this.refId + '\n' +
            '  name: ' + this.name + ',\n' +
            '  type: ' + this.type + ',\n' +
            '  full: ' + this.full + '\n' +
            '  linkedRouteAttr: ' + this.linkedRouteAttr + '\n' +
            '  tdoc_id: ' + this.tdoc_id + '' +
            '}';
    }
}

export class TourDocLinkedRouteRecordFactory extends BaseEntityRecordFactory {
    public static instance = new TourDocLinkedRouteRecordFactory();

    static createSanitized(values: {}): TourDocLinkedRouteRecord {
        const sanitizedValues = TourDocLinkedRouteRecordFactory.instance.getSanitizedValues(values, {});
        return new TourDocLinkedRouteRecord(sanitizedValues);
    }

    static cloneSanitized(doc: TourDocLinkedRouteRecord): TourDocLinkedRouteRecord {
        const sanitizedValues = TourDocLinkedRouteRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new TourDocLinkedRouteRecord(sanitizedValues);
    }

    getSanitizedValues(values: {}, result: {}): {} {
        super.getSanitizedValues(values, result);
        this.sanitizeFieldValues(values, TourDocLinkedRouteRecord.routeFields, result, '');
        result['full'] = values['full'] === true || values['full'] === 'true' || values['full'] === '1' || values['full'] === 1;

        return result;
    }
}

export class TourDocLinkedRouteRecordValidator extends BaseEntityRecordValidator {
    public static instance = new TourDocLinkedRouteRecordValidator();

    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        const state = super.validateMyFieldRules(values, errors, fieldPrefix, errFieldPrefix);
        return this.validateFieldRules(values, TourDocLinkedRouteRecord.routeFields, fieldPrefix, errors, errFieldPrefix) && state;
    }
}

export let TourDocLinkedRouteRecordRelation: BaseEntityRecordRelationsType = {
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
