import {BaseImageRecordFactory, BaseImageRecordValidator} from '@dps/mycms-commons/dist/search-commons/model/records/baseimage-record';
import {BaseObjectDetectionImageObjectRecord} from '@dps/mycms-commons/dist/search-commons/model/records/baseobjectdetectionimageobject-record';
import {BaseEntityRecordFieldConfig} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {GenericValidatorDatatypes, IdValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {CommonDocRecordRelationsType} from './base-types';

export class TourDocObjectDetectionImageObjectRecord extends BaseObjectDetectionImageObjectRecord {
    static objectDetectionImageObjectFields = {
        ...BaseObjectDetectionImageObjectRecord.objectDetectionImageObjectFields,
        tdoc_id: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(false))
    }

    tdoc_id: string;

    toString() {
        return 'TourDocObjectDetectionImageObjectRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  detector: ' + this.detector + ',\n' +
            '  category: ' + this.category + ',\n' +
            '  key: ' + this.key + ',\n' +
            '  pos: ' + this.objX + ',' + this.objY + '(' + this.objWidth + ',' + this.objHeight + ')\n' +
            '}';
    }
}

export class TourDocObjectDetectionImageObjectRecordFactory extends BaseImageRecordFactory {
    public static instance = new TourDocObjectDetectionImageObjectRecordFactory();

    static createSanitized(values: {}): TourDocObjectDetectionImageObjectRecord {
        const sanitizedValues = TourDocObjectDetectionImageObjectRecordFactory.instance.getSanitizedValues(values, {});
        return new TourDocObjectDetectionImageObjectRecord(sanitizedValues);
    }

    static cloneSanitized(doc: TourDocObjectDetectionImageObjectRecord): TourDocObjectDetectionImageObjectRecord {
        const sanitizedValues = TourDocObjectDetectionImageObjectRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new TourDocObjectDetectionImageObjectRecord(sanitizedValues);
    }

    getSanitizedValues(values: {}, result: {}): {} {
        super.getSanitizedValues(values, result);
        this.sanitizeFieldValues(values, TourDocObjectDetectionImageObjectRecord.objectDetectionImageObjectFields, result, '');
        return result;
    }
}

export class TourDocObjectDetectionImageObjectRecordValidator extends BaseImageRecordValidator {
    public static instance = new TourDocObjectDetectionImageObjectRecordValidator();

    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        const state = super.validateMyFieldRules(values, errors, fieldPrefix, errFieldPrefix);

        return this.validateFieldRules(values, TourDocObjectDetectionImageObjectRecord.objectDetectionImageObjectFields, fieldPrefix,
            errors, errFieldPrefix) && state;
    }
}

export let TourDocObjectDetectionImageObjectRecordRelation: CommonDocRecordRelationsType = {
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
