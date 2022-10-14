import {
    BaseEntityRecordFactory,
    BaseEntityRecordFieldConfig,
    BaseEntityRecordRelationsType,
    BaseEntityRecordValidator
} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {
    GenericValidatorDatatypes,
    GeoLocValidationRule,
    IdValidationRule,
    NumberValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {BaseJoinRecord, BaseJoinRecordType} from '@dps/mycms-commons/dist/search-commons/model/records/basejoin-record';

// tslint:disable-next-line:no-empty-interface
export interface TourDocLinkedPoiRecordType extends BaseJoinRecordType {
    position: number;
    poitype: number;
    geoEle: number;
    geoLoc: string;
}

export class TourDocLinkedPoiRecord extends BaseJoinRecord implements TourDocLinkedPoiRecordType {
    static linkedPoiFields = {...BaseJoinRecord.joinFields,
        tdoc_id: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(true)),
        position: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(true, 1, 999999999999, undefined)),
        poitype: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(true, 1, 999999999999, undefined)),
        geoEle: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, -99999, 999999, undefined)),
        geoLoc: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.GEOLOC, new GeoLocValidationRule(false))
    };

    tdoc_id: string;
    position: number;
    poitype: number;
    geoEle: number;
    geoLoc: string;

    getMediaId(): string {
        return this.tdoc_id;
    }

    toString() {
        return 'TourDocLinkedPoiRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  refId: ' + this.refId + '\n' +
            '  name: ' + this.name + ',\n' +
            '  position: ' + this.position + ',\n' +
            '  tdoc_id: ' + this.tdoc_id + '' +
            '}';
    }
}

export class TourDocLinkedPoiRecordFactory extends BaseEntityRecordFactory {
    public static instance = new TourDocLinkedPoiRecordFactory();

    static createSanitized(values: {}): TourDocLinkedPoiRecord {
        const sanitizedValues = TourDocLinkedPoiRecordFactory.instance.getSanitizedValues(values, {});
        return new TourDocLinkedPoiRecord(sanitizedValues);
    }

    static cloneSanitized(doc: TourDocLinkedPoiRecord): TourDocLinkedPoiRecord {
        const sanitizedValues = TourDocLinkedPoiRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new TourDocLinkedPoiRecord(sanitizedValues);
    }

    getSanitizedValues(values: {}, result: {}): {} {
        super.getSanitizedValues(values, result);
        this.sanitizeFieldValues(values, TourDocLinkedPoiRecord.linkedPoiFields, result, '');
        return result;
    }
}

export class TourDocLinkedPoiRecordValidator extends BaseEntityRecordValidator {
    public static instance = new TourDocLinkedPoiRecordValidator();

    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        const state = super.validateMyFieldRules(values, errors, fieldPrefix, errFieldPrefix);
        return this.validateFieldRules(values, TourDocLinkedPoiRecord.linkedPoiFields, fieldPrefix, errors, errFieldPrefix) && state;
    }
}

export let TourDocLinkedPoiRecordRelation: BaseEntityRecordRelationsType = {
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
