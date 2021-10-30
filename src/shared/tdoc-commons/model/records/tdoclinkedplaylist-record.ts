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
    NumberValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';

export interface TourDocLinkedPlaylistRecordType extends BaseJoinRecordType {
    position: number;
}

export class TourDocLinkedPlaylistRecord extends BaseJoinRecord implements TourDocLinkedPlaylistRecordType {
    static playlistFields = {...BaseJoinRecord.joinFields,
        position: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, 1, 999999999999, undefined)),
        tdoc_id: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(false))
    };

    position: number;
    tdoc_id: string;

    getMediaId(): string {
        return this.tdoc_id;
    }

    toString() {
        return 'TourDocLinkedPlaylistRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  refId: ' + this.refId + '\n' +
            '  name: ' + this.name + ',\n' +
            '  position: ' + this.position + ',\n' +
            '  tdoc_id: ' + this.tdoc_id + '' +
            '}';
    }
}

export class TourDocLinkedPlaylistRecordFactory extends BaseEntityRecordFactory {
    public static instance = new TourDocLinkedPlaylistRecordFactory();

    static createSanitized(values: {}): TourDocLinkedPlaylistRecord {
        const sanitizedValues = TourDocLinkedPlaylistRecordFactory.instance.getSanitizedValues(values, {});
        return new TourDocLinkedPlaylistRecord(sanitizedValues);
    }

    static cloneSanitized(doc: TourDocLinkedPlaylistRecord): TourDocLinkedPlaylistRecord {
        const sanitizedValues = TourDocLinkedPlaylistRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new TourDocLinkedPlaylistRecord(sanitizedValues);
    }

    getSanitizedValues(values: {}, result: {}): {} {
        super.getSanitizedValues(values, result);
        this.sanitizeFieldValues(values, TourDocLinkedPlaylistRecord.playlistFields, result, '');

        return result;
    }
}

export class TourDocLinkedPlaylistRecordValidator extends BaseEntityRecordValidator {
    public static instance = new TourDocLinkedPlaylistRecordValidator();

    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        const state = super.validateMyFieldRules(values, errors, fieldPrefix, errFieldPrefix);
        return this.validateFieldRules(values, TourDocLinkedPlaylistRecord.playlistFields, fieldPrefix, errors, errFieldPrefix) && state;
    }
}

export let TourDocLinkedPlaylistRecordRelation: BaseEntityRecordRelationsType = {
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
