import {
    BaseEntityRecord,
    BaseEntityRecordFieldConfig,
    BaseEntityRecordType
} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {GenericValidatorDatatypes, NameValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {CommonDocRecordRelationsType} from './base-types';

export interface BaseJoinRecordType extends BaseEntityRecordType {
    name: string;
    refId: string;
    type: string;
}

export abstract class BaseJoinRecord extends BaseEntityRecord implements BaseJoinRecordType {
    static joinFields = {
        name: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(true)),
        type: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(true)),
        refId: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new NameValidationRule(true))
    };

    name: string;
    refId: string;
    type: string;

    toString() {
        return 'BaseJoinRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  refId: ' + this.refId + '\n' +
            '  name: ' + this.name + ',\n' +
            '  type: ' + this.type + ',\n' +
            '}';
    }
}

export let BaseJoinRecordRelation: CommonDocRecordRelationsType = {
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
