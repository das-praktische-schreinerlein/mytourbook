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
    TextValidationRule
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
}

export class TourDocRecord extends CommonDocRecord implements TourDocRecordType {
    static tdocRelationNames = ['tdocdatatech', 'tdocdatainfo', 'tdocimages', 'tdocvideos', 'tdocratepers', 'tdocratetech'];
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
        }
    }
};

export class TourDocRecordFactory {
    static getSanitizedRelationValues(relation: string, values: {}): {} {
        switch (relation) {
            case 'tdocdatatech':
                return TourDocDataTechRecordFactory.getSanitizedValues(values);
            case 'tdocdatainfo':
                return TourDocDataInfoRecordFactory.getSanitizedValues(values);
            case 'tdocimages':
                return TourDocImageRecordFactory.getSanitizedValues(values);
            case 'tdocvideos':
                return TourDocVideoRecordFactory.getSanitizedValues(values);
            case 'tdocratepers':
                return TourDocRatePersonalRecordFactory.getSanitizedValues(values);
            case 'tdocratetech':
                return TourDocRateTechRecordFactory.getSanitizedValues(values);
            default:
                throw new Error('unknown relation:' + relation);
        }
    };

    static getSanitizedValues(values: {}): any {
        const sanitizedValues = CommonDocRecordFactory.getSanitizedValues(values);

        sanitizedValues.locId = TourDocRecord.tdocFields.locId.validator.sanitize(values['locId']) || undefined;
        sanitizedValues.locIdParent = TourDocRecord.tdocFields.locIdParent.validator.sanitize(values['locIdParent']) || undefined;
        sanitizedValues.routeId = TourDocRecord.tdocFields.routeId.validator.sanitize(values['routeId']) || undefined;
        sanitizedValues.trackId = TourDocRecord.tdocFields.trackId.validator.sanitize(values['trackId']) || undefined;
        sanitizedValues.tripId = TourDocRecord.tdocFields.tripId.validator.sanitize(values['tripId']) || undefined;
        sanitizedValues.newsId = TourDocRecord.tdocFields.newsId.validator.sanitize(values['newsId']) || undefined;
        sanitizedValues.imageId = TourDocRecord.tdocFields.imageId.validator.sanitize(values['imageId']) || undefined;
        sanitizedValues.videoId = TourDocRecord.tdocFields.imageId.validator.sanitize(values['videoId']) || undefined;

        sanitizedValues.datestart = TourDocRecord.tdocFields.datestart.validator.sanitize(values['datestart']) || undefined;
        sanitizedValues.dateend = TourDocRecord.tdocFields.dateend.validator.sanitize(values['dateend']) || undefined;
        sanitizedValues.geoDistance = TourDocRecord.tdocFields.geoDistance.validator.sanitize(values['geoDistance']) || undefined;
        sanitizedValues.geoLon = TourDocRecord.tdocFields.geoLon.validator.sanitize(values['geoLon']) || undefined;
        sanitizedValues.geoLat = TourDocRecord.tdocFields.geoLat.validator.sanitize(values['geoLat']) || undefined;
        sanitizedValues.geoLoc = TourDocRecord.tdocFields.geoLoc.validator.sanitize(values['geoLoc']) || undefined;
        sanitizedValues.gpsTrackSrc = TourDocRecord.tdocFields.gpsTrackSrc.validator.sanitize(values['gpsTrackSrc']) || undefined;
        sanitizedValues.gpsTrackBasefile = TourDocRecord.tdocFields.gpsTrackBasefile.validator.sanitize(values['gpsTrackBasefile'])
            || undefined;
        sanitizedValues.locHirarchie = TourDocRecord.tdocFields.locHirarchie.validator.sanitize(values['locHirarchie']) || undefined;
        sanitizedValues.locHirarchieIds = TourDocRecord.tdocFields.locHirarchieIds.validator.sanitize(values['locHirarchieIds']) || undefined;
        sanitizedValues.persons = TourDocRecord.tdocFields.persons.validator.sanitize(values['persons']) || undefined;

        return sanitizedValues;
    }

    static getSanitizedValuesFromObj(doc: TourDocRecord): any {
        return TourDocRecordFactory.getSanitizedValues(doc);
    }

    static cloneSanitized(doc: TourDocRecord): TourDocRecord {
        const sanitizedValues = TourDocRecordFactory.getSanitizedValuesFromObj(doc);

        return new TourDocRecord(sanitizedValues);
    }

    static createSanitized(values: {}): TourDocRecord {
        const sanitizedValues = TourDocRecordFactory.getSanitizedValues(values);

        return new TourDocRecord(sanitizedValues);
    }
}

export class TourDocRecordValidator extends CommonDocRecordValidator {
    public static instance = new TourDocRecordValidator();

    validateMyRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        let state = super.validateMyRules(values, errors, fieldPrefix, errFieldPrefix);

        state = this.validateRule(values, TourDocRecord.tdocFields.locId.validator, fieldPrefix + 'locId', errors, errFieldPrefix) && state;
        state = this.validateRule(values, TourDocRecord.tdocFields.locIdParent.validator, fieldPrefix + 'locIdParent', errors, errFieldPrefix) && state;
        state = this.validateRule(values, TourDocRecord.tdocFields.routeId.validator, fieldPrefix + 'routeId', errors, errFieldPrefix) && state;
        state = this.validateRule(values, TourDocRecord.tdocFields.trackId.validator, fieldPrefix + 'trackId', errors, errFieldPrefix) && state;
        state = this.validateRule(values, TourDocRecord.tdocFields.tripId.validator, fieldPrefix + 'tripId', errors, errFieldPrefix) && state;
        state = this.validateRule(values, TourDocRecord.tdocFields.newsId.validator, fieldPrefix + 'newsId', errors, errFieldPrefix) && state;
        state = this.validateRule(values, TourDocRecord.tdocFields.imageId.validator, fieldPrefix + 'imageId', errors, errFieldPrefix) && state;
        state = this.validateRule(values, TourDocRecord.tdocFields.videoId.validator, fieldPrefix + 'videoId', errors, errFieldPrefix) && state;

        state = this.validateRule(values, TourDocRecord.tdocFields.datestart.validator, fieldPrefix + 'datestart', errors, errFieldPrefix) && state;
        state = this.validateRule(values, TourDocRecord.tdocFields.dateend.validator, fieldPrefix + 'dateend', errors, errFieldPrefix) && state;
        state = this.validateRule(values, TourDocRecord.tdocFields.geoDistance.validator, fieldPrefix + 'geoDistance', errors, errFieldPrefix) && state;
        state = this.validateRule(values, TourDocRecord.tdocFields.geoLon.validator, fieldPrefix + 'geoLon', errors, errFieldPrefix) && state;
        state = this.validateRule(values, TourDocRecord.tdocFields.geoLat.validator, fieldPrefix + 'geoLat', errors, errFieldPrefix) && state;
        state = this.validateRule(values, TourDocRecord.tdocFields.geoLoc.validator, fieldPrefix + 'geoLoc', errors, errFieldPrefix) && state;
        state = this.validateRule(values, TourDocRecord.tdocFields.gpsTrackSrc.validator, fieldPrefix + 'gpsTrackSrc', errors, errFieldPrefix) && state;
        state = this.validateRule(values, TourDocRecord.tdocFields.gpsTrackBasefile.validator, fieldPrefix + 'gpsTrackBasefile', errors, errFieldPrefix) && state;
        state = this.validateRule(values, TourDocRecord.tdocFields.locHirarchie.validator, fieldPrefix + 'locHirarchie', errors, errFieldPrefix) && state;
        state = this.validateRule(values, TourDocRecord.tdocFields.locHirarchieIds.validator, fieldPrefix + 'locHirarchieIds', errors, errFieldPrefix) && state;
        state = this.validateRule(values, TourDocRecord.tdocFields.persons.validator, fieldPrefix + 'persons', errors, errFieldPrefix) && state;

        return state;
    }

    validateMyValueRelationRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        const relErrors = [];
        for (const relation of TourDocRecord.tdocValidationRelationNames) {
            relErrors.push(...this.validateValueRelationDoc(relation, values,
                fieldPrefix + relation + '.', errFieldPrefix));
        }
        errors.push(...relErrors);

        return relErrors.length === 0;
    }

    validateMyRelationRules(doc: BaseEntityRecord, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        const relErrors = [];
        for (const relation of TourDocRecord.tdocRelationNames) {
            const subRecords = doc.get(relation) || doc[relation];
            if (isArray(subRecords)) {
                for (const subRecord of subRecords) {
                    relErrors.push(...this.validateRelationDoc(relation, subRecord, errFieldPrefix + relation + '.'));
                }
            } else if (subRecords) {
                relErrors.push(...this.validateRelationDoc(relation, subRecords, errFieldPrefix + relation + '.'));
            }
        }
        errors.push(...relErrors);

        return relErrors.length === 0;
    }

    validateRelationDoc(relation: string, doc: BaseEntityRecord, errFieldPrefix?: string): string[] {
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
                throw new Error('unknown relation:' + relation);
        }
    };

    validateValueRelationDoc(relation: string, values: {}, fieldPrefix?: string, errFieldPrefix?: string): string[] {
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
                throw new Error('unknown relation:' + relation);
        }
    };
}
