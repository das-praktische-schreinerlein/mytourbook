import {
    BaseEntityRecord,
    BaseEntityRecordFieldConfig,
    BaseEntityRecordType
} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {
    DateValidationRule,
    DbIdValidationRule,
    FilenameValidationRule,
    GenericValidatorDatatypes,
    GeoLocValidationRule,
    GpsTrackValidationRule,
    HierarchyValidationRule,
    IdCsvValidationRule,
    NumberValidationRule,
    StringNumberValidationRule,
    TextValidationRule,
    NameValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {isArray} from 'util';
import {
    CommonDocRecord,
    CommonDocRecordFactory,
    CommonDocRecordValidator
} from '@dps/mycms-commons/dist/search-commons/model/records/cdoc-entity-record';
import {TourDocDataTechRecord, TourDocDataTechRecordFactory, TourDocDataTechRecordValidator} from './tdocdatatech-record';
import {TourDocDataInfoRecord, TourDocDataInfoRecordFactory, TourDocDataInfoRecordValidator} from './tdocdatainfo-record';
import {TourDocImageRecord, TourDocImageRecordFactory, TourDocImageRecordValidator} from './tdocimage-record';
import {TourDocVideoRecord, TourDocVideoRecordFactory, TourDocVideoRecordValidator} from './tdocvideo-record';
import {TourDocRatePersonalRecord, TourDocRatePersonalRecordFactory, TourDocRatePersonalRecordValidator} from './tdocratepers-record';
import {TourDocRateTechRecord, TourDocRateTechRecordFactory, TourDocRateTechRecordValidator} from './tdocratetech-record';
import {TourDocObjectDetectionImageObjectRecordFactory} from './tdocobjectdetectectionimageobject-record';

export interface TourDocRecordType extends BaseEntityRecordType {
    locId: number;
    locIdParent: number;
    routeId: number;
    trackId: number;
    tripId: number;
    newsId: number;
    imageId: number;
    videoId: number;

    datestart: Date;
    dateend: Date;
    geoDistance: number;
    geoLon: string;
    geoLat: string;
    geoLoc: string;
    gpsTrackSrc: string;
    gpsTrackBasefile: string;
    locHirarchie: string;
    locHirarchieIds: string;
    persons: string;
    techName: string;
}

export class TourDocRecord extends CommonDocRecord implements TourDocRecordType {
    static tdocRelationNames = ['tdocdatatech', 'tdocdatainfo', 'tdocimages', 'tdocvideos', 'tdocratepers', 'tdocratetech', 'tdocodimageobjects'];
    static tdocValidationRelationNames = ['tdocdatatech', 'tdocdatainfo', 'tdocratepers', 'tdocratetech'];
    static tdocFields = {
        locId: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new DbIdValidationRule(false)),
        locIdParent: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new DbIdValidationRule(false)),
        routeId: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new DbIdValidationRule(false)),
        trackId: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new DbIdValidationRule(false)),
        tripId: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new DbIdValidationRule(false)),
        newsId: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new DbIdValidationRule(false)),
        imageId: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new DbIdValidationRule(false)),
        videoId: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new DbIdValidationRule(false)),

        // TODO: DateValidationRule must check if Date or String with regexp
        datestart: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.DATE, new DateValidationRule(false)),
        dateend: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.DATE, new DateValidationRule(false)),

        geoDistance: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, -99999, 999999, undefined)),
        geoLon: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new StringNumberValidationRule(false, -99999, 999999, undefined)),
        geoLat: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new StringNumberValidationRule(false, -99999, 999999, undefined)),
        geoLoc: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.GEOLOC, new GeoLocValidationRule(false)),
        gpsTrackBasefile: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.FILENAME, new FilenameValidationRule(false)),
        gpsTrackSrc: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.GPSTRACK, new GpsTrackValidationRule(false)),

        locHirarchie: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.TEXT, new HierarchyValidationRule(false)),
        locHirarchieIds: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID_CSV, new IdCsvValidationRule(false)),
        persons: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.WHAT_KEY_CSV, new TextValidationRule(false)),
        techName: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
    };

    locId: number;
    locIdParent: number;
    routeId: number;
    trackId: number;
    tripId: number;
    newsId: number;
    imageId: number;
    videoId: number;

    datestart: Date;
    dateend: Date;
    geoDistance: number;
    geoLon: string;
    geoLat: string;
    geoLoc: string;
    gpsTrackSrc: string;
    gpsTrackBasefile: string;
    locHirarchie: string;
    locHirarchieIds: string;
    persons: string;
    techName: string;

    static cloneToSerializeToJsonObj(baseRecord: TourDocRecord, anonymizeMedia?: boolean): {}  {
        const record  = {};
        for (const key in baseRecord) {
            record[key] = baseRecord[key];
        }
        for (const relationName of TourDocRecord.tdocRelationNames) {
            record[relationName] = baseRecord.get(relationName);
        }

        if (anonymizeMedia === true) {
            let relationName = 'tdocimages';
            if (isArray(record[relationName])) {
                for (const media of record[relationName]) {
                    media.fileName = 'anonymized.JPG';
                }
            }
            relationName = 'tdocvideos';
            if (isArray(record[relationName])) {
                for (const media of record[relationName]) {
                    media.fileName = 'anonymized.MP4';
                }
            }
        }

        return record;
    }

    toString() {
        return 'TourDocRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  name: ' + this.name + ',\n' +
            '  type: ' + this.type + '' +
            '}';
    }

    toSerializableJsonObj(anonymizeMedia?: boolean): {} {
        return TourDocRecord.cloneToSerializeToJsonObj(this, anonymizeMedia);
    }

    isValid(): boolean {
        return TourDocRecordValidator.instance.isValid(this);
    }
}

export let TourDocRecordRelation: any = {
    hasOne: {
        tdocdatatech: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related objects in memory
            localField: 'tdocdatatech'
        },
        tdocdatainfo: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related objects in memory
            localField: 'tdocdatainfo'
        },
        tdocratepers: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related objects in memory
            localField: 'tdocratepers'
        },
        tdocratetech: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related objects in memory
            localField: 'tdocratetech'
        }
    },
    hasMany: {
        tdocimage: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related objects in memory
            localField: 'tdocimages'
        },
        tdocvideo: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related objects in memory
            localField: 'tdocvideos'
        },
        tdocodimageobject: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related objects in memory
            localField: 'tdocodimageobjects'
        },
    }
};

export class TourDocRecordFactory extends CommonDocRecordFactory {
    public static instance = new TourDocRecordFactory();

    static createSanitized(values: {}): TourDocRecord {
        const sanitizedValues = TourDocRecordFactory.instance.getSanitizedValues(values, {});
        return new TourDocRecord(sanitizedValues);
    }

    static cloneSanitized(doc: TourDocRecord): TourDocRecord {
        const sanitizedValues = TourDocRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new TourDocRecord(sanitizedValues);
    }

    getSanitizedValues(values: {}, result: {}): {} {
        super.getSanitizedValues(values, result);
        this.sanitizeFieldValues(values, TourDocRecord.tdocFields, result, '');
        return result;
    }

    getSanitizedRelationValues(relation: string, values: {}): {} {
        switch (relation) {
            case 'tdocdatatech':
                return TourDocDataTechRecordFactory.instance.getSanitizedValues(values, {});
            case 'tdocdatainfo':
                return TourDocDataInfoRecordFactory.instance.getSanitizedValues(values, {});
            case 'tdocimages':
                return TourDocImageRecordFactory.instance.getSanitizedValues(values, {});
            case 'tdocvideos':
                return TourDocVideoRecordFactory.instance.getSanitizedValues(values, {});
            case 'tdocratepers':
                return TourDocRatePersonalRecordFactory.instance.getSanitizedValues(values, {});
            case 'tdocratetech':
                return TourDocRateTechRecordFactory.instance.getSanitizedValues(values, {});
            case 'tdocodimageobjects':
                return TourDocObjectDetectionImageObjectRecordFactory.instance.getSanitizedValues(values, {});
            default:
                return super.getSanitizedRelationValues(relation, values);
        }
    };

}

export class TourDocRecordValidator extends CommonDocRecordValidator {
    public static instance = new TourDocRecordValidator();

    isValid(doc: BaseEntityRecord, errFieldPrefix?: string): boolean {
        console.warn('TourDocRecordValidator: validation-errors', this.validate(doc, errFieldPrefix));
        // TODO: validate subtype requitred for TRACK, ROUTE, LOCATION
        return this.validate(doc, errFieldPrefix).length === 0;
    }

    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        const state = super.validateMyFieldRules(values, errors, fieldPrefix, errFieldPrefix);
        return this.validateFieldRules(values, TourDocRecord.tdocFields, fieldPrefix, errors, errFieldPrefix) && state;
    }

    validateMyValueRelationRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        return this.validateValueRelationRules(values, TourDocRecord.tdocValidationRelationNames, errors, fieldPrefix, errFieldPrefix);
    }

    validateMyRelationRules(doc: BaseEntityRecord, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        return this.validateRelationRules(doc, TourDocRecord.tdocRelationNames, errors, fieldPrefix, errFieldPrefix);
    }

    protected validateRelationDoc(relation: string, doc: BaseEntityRecord, errFieldPrefix?: string): string[] {
        switch (relation) {
            case 'tdocdatatech':
                return TourDocDataTechRecordValidator.instance.validate(<TourDocDataTechRecord>doc, errFieldPrefix);
            case 'tdocdatainfo':
                return TourDocDataInfoRecordValidator.instance.validate(<TourDocDataInfoRecord>doc, errFieldPrefix);
            case 'tdocimages':
                return TourDocImageRecordValidator.instance.validate(<TourDocImageRecord>doc, errFieldPrefix);
            case 'tdocvideos':
                return TourDocVideoRecordValidator.instance.validate(<TourDocVideoRecord>doc, errFieldPrefix);
            case 'tdocratepers':
                return TourDocRatePersonalRecordValidator.instance.validate(<TourDocRatePersonalRecord>doc, errFieldPrefix);
            case 'tdocratetech':
                return TourDocRateTechRecordValidator.instance.validate(<TourDocRateTechRecord>doc, errFieldPrefix);
            default:
                super.validateRelationDoc(relation, doc, errFieldPrefix);
        }
    };

    protected validateValueRelationDoc(relation: string, values: {}, fieldPrefix?: string, errFieldPrefix?: string): string[] {
        switch (relation) {
            case 'tdocdatatech':
                return TourDocDataTechRecordValidator.instance.validateValues(values, fieldPrefix, errFieldPrefix);
            case 'tdocdatainfo':
                return TourDocDataInfoRecordValidator.instance.validateValues(values, fieldPrefix, errFieldPrefix);
            case 'tdocimages':
                return TourDocImageRecordValidator.instance.validateValues(values, fieldPrefix, errFieldPrefix);
            case 'tdocvideos':
                return TourDocVideoRecordValidator.instance.validateValues(values, fieldPrefix, errFieldPrefix);
            case 'tdocratepers':
                return TourDocRatePersonalRecordValidator.instance.validateValues(values, fieldPrefix, errFieldPrefix);
            case 'tdocratetech':
                return TourDocRateTechRecordValidator.instance.validateValues(values, fieldPrefix, errFieldPrefix);
            default:
                super.validateValueRelationDoc(relation, values, fieldPrefix, errFieldPrefix);
        }
    };
}
