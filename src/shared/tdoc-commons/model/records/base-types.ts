import {BaseEntityRecordFactory, BaseEntityRecordValidator} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';

export interface CommonDocRecordRelationType {
    foreignKey: string;
    localField: string;
    mapperKey: string;
    factory?: BaseEntityRecordFactory;
    validator?: BaseEntityRecordValidator;
}

export interface CommonDocRecordRelationsType {
    belongsTo?: {
        [key: string]: CommonDocRecordRelationType;
    }
    hasOne?: {
        [key: string]: CommonDocRecordRelationType;
    }
    hasMany?: {
        [key: string]: CommonDocRecordRelationType;
    }
}

