import {
    BaseEntityRecordFactory,
    BaseEntityRecordFieldConfig,
    BaseEntityRecordValidator
} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {BaseJoinRecord, BaseJoinRecordType} from './basejoin-record';
import {
    GenericValidatorDatatypes,
    WhiteListValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';

// tslint:disable-next-line:no-empty-interface
export interface TourDocRouteRecordType extends BaseJoinRecordType {
    full: boolean;
}

export class TourDocRouteRecord extends BaseJoinRecord implements TourDocRouteRecordType {
    static routeFields = {...BaseJoinRecord.routeFields,
        full: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME,
            new WhiteListValidationRule(false, [true, false, 'true', 'false'], false)),
    };

    tdoc_id: string;
    full: boolean;

    getMediaId(): string {
        return this.tdoc_id;
    }

    toString() {
        return 'TourDocRouteRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  refId: ' + this.refId + '\n' +
            '  name: ' + this.name + ',\n' +
            '  type: ' + this.type + ',\n' +
            '  full: ' + this.full + '\n' +
            '  tdoc_id: ' + this.tdoc_id + '' +
            '}';
    }
}

export class TourDocRouteRecordFactory extends BaseEntityRecordFactory {
    public static instance = new TourDocRouteRecordFactory();

    static createSanitized(values: {}): TourDocRouteRecord {
        const sanitizedValues = TourDocRouteRecordFactory.instance.getSanitizedValues(values, {});
        return new TourDocRouteRecord(sanitizedValues);
    }

    static cloneSanitized(doc: TourDocRouteRecord): TourDocRouteRecord {
        const sanitizedValues = TourDocRouteRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new TourDocRouteRecord(sanitizedValues);
    }

    getSanitizedValues(values: {}, result: {}): {} {
        super.getSanitizedValues(values, result);
        this.sanitizeFieldValues(values, TourDocRouteRecord.routeFields, result, '');
        result['full'] = result['full'] === true || result['full'] === 'true';

        return result;
    }
}

export class TourDocRouteRecordValidator extends BaseEntityRecordValidator {
    public static instance = new TourDocRouteRecordValidator();

    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        const state = super.validateMyFieldRules(values, errors, fieldPrefix, errFieldPrefix);
        return this.validateFieldRules(values, TourDocRouteRecord.routeFields, fieldPrefix, errors, errFieldPrefix) && state;
    }
}

export let TourDocRouteRecordRelation: any = {
    belongsTo: {
        tdoc: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related object in memory
            localField: 'tdoc'
        }
    }
};
