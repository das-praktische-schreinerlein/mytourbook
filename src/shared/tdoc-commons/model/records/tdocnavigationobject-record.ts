import {
    BaseEntityRecordFactory,
    BaseEntityRecordFieldConfig,
    BaseEntityRecordValidator
} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {BaseNavigationObjectRecord} from '@dps/mycms-commons/dist/search-commons/model/records/basenavigationobject-record';
import {GenericValidatorDatatypes, IdValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';

export class TourDocNavigationObjectRecord extends BaseNavigationObjectRecord {
    static navigationObjectFields = {
        ...BaseNavigationObjectRecord.navigationObjectFields,
        tdoc_id: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(false))
    };

    tdoc_id: string;

    toString() {
        return 'TourDocNavigationObjectRecord Record {\n' +
            '  tdoc_id: ' + this.tdoc_id + ',\n' +
            '  id: ' + this.id + ',\n' +
            '  name: ' + this.name + ',\n' +
            '  navid: ' + this.navid + ',\n' +
            '  navtype: ' + this.navtype + ')\n' +
            '}';
    }
}

export class TourDocNavigationObjectRecordFactory extends BaseEntityRecordFactory {
    public static instance = new TourDocNavigationObjectRecordFactory();

    static createSanitized(values: {}): TourDocNavigationObjectRecord {
        const sanitizedValues = TourDocNavigationObjectRecordFactory.instance.getSanitizedValues(values, {});
        return new TourDocNavigationObjectRecord(sanitizedValues);
    }

    static cloneSanitized(doc: TourDocNavigationObjectRecord): TourDocNavigationObjectRecord {
        const sanitizedValues = TourDocNavigationObjectRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new TourDocNavigationObjectRecord(sanitizedValues);
    }

    getSanitizedValues(values: {}, result: {}): {} {
        super.getSanitizedValues(values, result);
        this.sanitizeFieldValues(values, TourDocNavigationObjectRecord.navigationObjectFields, result, '');
        return result;
    }
}

export class TourDocNavigationObjectRecordValidator extends BaseEntityRecordValidator {
    public static instance = new TourDocNavigationObjectRecordValidator();

    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        const state = super.validateMyFieldRules(values, errors, fieldPrefix, errFieldPrefix);

        return this.validateFieldRules(values, TourDocNavigationObjectRecord.navigationObjectFields, fieldPrefix,
            errors, errFieldPrefix) && state;
    }
}

export let TourDocNavigationObjectRecordRelation: any = {
    belongsTo: {
        tdoc: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related object in memory
            localField: 'tdoc'
        }
    }
};
