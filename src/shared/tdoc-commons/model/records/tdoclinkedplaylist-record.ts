import {
    BaseEntityRecordFactory,
    BaseEntityRecordFieldConfig,
    BaseEntityRecordRelationsType,
    BaseEntityRecordValidator
} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {GenericValidatorDatatypes, IdValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {
    BaseLinkedPlaylistRecord,
    BaseLinkedPlaylistRecordType
} from '@dps/mycms-commons/dist/search-commons/model/records/baselinkedplaylist-record';

// tslint:disable-next-line:no-empty-interface
export interface TourDocLinkedPlaylistRecordType extends BaseLinkedPlaylistRecordType {
}

export class TourDocLinkedPlaylistRecord extends BaseLinkedPlaylistRecord implements TourDocLinkedPlaylistRecordType {
    static linkedPlaylistFields = {...BaseLinkedPlaylistRecord.baseLinkedPlaylistFields,
        tdoc_id: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(false))
    };

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
        this.sanitizeFieldValues(values, TourDocLinkedPlaylistRecord.linkedPlaylistFields, result, '');

        return result;
    }
}

export class TourDocLinkedPlaylistRecordValidator extends BaseEntityRecordValidator {
    public static instance = new TourDocLinkedPlaylistRecordValidator();

    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        const state = super.validateMyFieldRules(values, errors, fieldPrefix, errFieldPrefix);
        return this.validateFieldRules(values, TourDocLinkedPlaylistRecord.linkedPlaylistFields, fieldPrefix, errors, errFieldPrefix) && state;
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
