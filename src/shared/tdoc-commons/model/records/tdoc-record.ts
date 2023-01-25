import {
    BaseEntityRecord,
    BaseEntityRecordFieldConfig,
    BaseEntityRecordRelationsType
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
    IdValidationRule,
    NameValidationRule,
    NumberValidationRule,
    StringNumberValidationRule,
    TextValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {isArray} from 'util';
import {
    CommonDocRecord,
    CommonDocRecordFactory,
    CommonDocRecordType,
    CommonDocRecordValidator
} from '@dps/mycms-commons/dist/search-commons/model/records/cdoc-entity-record';
import {TourDocDataTechRecord, TourDocDataTechRecordFactory, TourDocDataTechRecordValidator} from './tdocdatatech-record';
import {TourDocDataInfoRecord, TourDocDataInfoRecordFactory, TourDocDataInfoRecordValidator} from './tdocdatainfo-record';
import {TourDocImageRecord, TourDocImageRecordFactory, TourDocImageRecordValidator} from './tdocimage-record';
import {TourDocVideoRecord, TourDocVideoRecordFactory, TourDocVideoRecordValidator} from './tdocvideo-record';
import {TourDocRatePersonalRecord, TourDocRatePersonalRecordFactory, TourDocRatePersonalRecordValidator} from './tdocratepers-record';
import {TourDocRateTechRecord, TourDocRateTechRecordFactory, TourDocRateTechRecordValidator} from './tdocratetech-record';
import {
    TourDocObjectDetectionImageObjectRecord,
    TourDocObjectDetectionImageObjectRecordFactory,
    TourDocObjectDetectionImageObjectRecordValidator
} from './tdocobjectdetectectionimageobject-record';
import {
    TourDocNavigationObjectRecord,
    TourDocNavigationObjectRecordFactory,
    TourDocNavigationObjectRecordValidator
} from './tdocnavigationobject-record';
import {
    TourDocExtendedObjectPropertyRecord,
    TourDocExtendedObjectPropertyRecordFactory,
    TourDocExtendedObjectPropertyRecordValidator
} from './tdocextendedobjectproperty-record';
import {TourDocLinkedRouteRecord, TourDocLinkedRouteRecordFactory, TourDocLinkedRouteRecordValidator} from './tdoclinkedroute-record';
import {TourDocInfoRecord, TourDocInfoRecordFactory, TourDocInfoRecordValidator} from './tdocinfo-record';
import {TourDocLinkedInfoRecord, TourDocLinkedInfoRecordFactory, TourDocLinkedInfoRecordValidator} from './tdoclinkedinfo-record';
import {
    TourDocLinkedPlaylistRecord,
    TourDocLinkedPlaylistRecordFactory,
    TourDocLinkedPlaylistRecordValidator
} from './tdoclinkedplaylist-record';
import {TourDocLinkedPoiRecord, TourDocLinkedPoiRecordFactory, TourDocLinkedPoiRecordValidator} from './tdoclinkedpoi-record';
import {TourDocMediaMetaRecord, TourDocMediaMetaRecordFactory, TourDocMediaMetaRecordValidator} from './tdocmediameta-record';

export interface TourDocRecordType extends CommonDocRecordType {
    locId: number;
    locIdParent: number;
    routeId: number;
    trackId: number;
    tripId: number;
    newsId: number;
    imageId: number;
    infoId: number;
    videoId: number;
    destinationId: string;

    datestart: Date;
    dateend: Date;
    geoDistance: number;
    geoLon: string;
    geoLat: string;
    geoLoc: string;
    gpsTrackSrc: string;
    gpsTrackBasefile: string;
    gpsTrackState: number;
    locHirarchie: string;
    locHirarchieIds: string;
    objects: string;
    persons: string;
    linkedRouteAttr: string;
    techName: string;
}


export let TourDocRecordRelation: BaseEntityRecordRelationsType = {
    hasOne: {
        tdocdatatech: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related objects in memory
            localField: 'tdocdatatech',
            mapperKey: 'tdocdatatech',
            factory: TourDocDataTechRecordFactory.instance,
            validator: TourDocDataTechRecordValidator.instance
        },
        tdocdatainfo: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related objects in memory
            localField: 'tdocdatainfo',
            mapperKey: 'tdocdatainfo',
            factory: TourDocDataInfoRecordFactory.instance,
            validator: TourDocDataInfoRecordValidator.instance
        },
        tdocinfo: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related objects in memory
            localField: 'tdocinfo',
            mapperKey: 'tdocinfo',
            factory: TourDocInfoRecordFactory.instance,
            validator: TourDocInfoRecordValidator.instance
        },
        tdocratepers: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related objects in memory
            localField: 'tdocratepers',
            mapperKey: 'tdocratepers',
            factory: TourDocRatePersonalRecordFactory.instance,
            validator: TourDocRatePersonalRecordValidator.instance
        },
        tdocratetech: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related objects in memory
            localField: 'tdocratetech',
            mapperKey: 'tdocratetech',
            factory: TourDocRateTechRecordFactory.instance,
            validator: TourDocRateTechRecordValidator.instance
        },
        tdocmediameta: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related objects in memory
            localField: 'tdocmediameta',
            mapperKey: 'tdocmediameta',
            factory: TourDocMediaMetaRecordFactory.instance,
            validator: TourDocMediaMetaRecordValidator.instance
        },
    },
    hasMany: {
        tdocimage: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related objects in memory
            localField: 'tdocimages',
            mapperKey: 'tdocimage',
            factory: TourDocImageRecordFactory.instance,
            validator: TourDocImageRecordValidator.instance
        },
        tdocvideo: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related objects in memory
            localField: 'tdocvideos',
            mapperKey: 'tdocvideo',
            factory: TourDocVideoRecordFactory.instance,
            validator: TourDocVideoRecordValidator.instance
        },
        tdocodimageobject: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related objects in memory
            localField: 'tdocodimageobjects',
            mapperKey: 'tdocodimageobject',
            factory: TourDocObjectDetectionImageObjectRecordFactory.instance,
            validator: TourDocObjectDetectionImageObjectRecordValidator.instance
        },
        tdocnavigationobject: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related objects in memory
            localField: 'tdocnavigationobjects',
            mapperKey: 'tdocnavigationobject',
            factory: TourDocNavigationObjectRecordFactory.instance,
            validator: TourDocNavigationObjectRecordValidator.instance
        },
        tdocextendedobjectproperty: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related objects in memory
            localField: 'tdocextendedobjectproperties',
            mapperKey: 'tdocextendedobjectproperty',
            factory: TourDocExtendedObjectPropertyRecordFactory.instance,
            validator: TourDocExtendedObjectPropertyRecordValidator.instance
        },
        tdoclinkedroute: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related objects in memory
            localField: 'tdoclinkedroutes',
            mapperKey: 'tdoclinkedroute',
            factory: TourDocLinkedRouteRecordFactory.instance,
            validator: TourDocLinkedRouteRecordValidator.instance
        },
        tdoclinkedinfo: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related objects in memory
            localField: 'tdoclinkedinfos',
            mapperKey: 'tdoclinkedinfo',
            factory: TourDocLinkedInfoRecordFactory.instance,
            validator: TourDocLinkedInfoRecordValidator.instance
        },
        tdoclinkedplaylist: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related objects in memory
            localField: 'tdoclinkedplaylists',
            mapperKey: 'tdoclinkedplaylist',
            factory: TourDocLinkedPlaylistRecordFactory.instance,
            validator: TourDocLinkedPlaylistRecordValidator.instance
        },
        tdoclinkedpoi: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related objects in memory
            localField: 'tdoclinkedpois',
            mapperKey: 'tdoclinkedpoi',
            factory: TourDocLinkedPoiRecordFactory.instance,
            validator: TourDocLinkedPoiRecordValidator.instance
        }
    }
};

export class TourDocRecord extends CommonDocRecord implements TourDocRecordType {
    static tdocRelationNames = []
        .concat(TourDocRecordRelation.hasOne ? Object.keys(TourDocRecordRelation.hasOne).map(key => {
            return TourDocRecordRelation.hasOne[key].localField;
        }) : [])
        .concat(TourDocRecordRelation.hasMany ? Object.keys(TourDocRecordRelation.hasMany).map(key => {
            return TourDocRecordRelation.hasMany[key].localField;
        }) : []);
    static tdocValidationRelationNames = []
        .concat(TourDocRecordRelation.hasOne ? Object.keys(TourDocRecordRelation.hasOne).map(key => {
            return TourDocRecordRelation.hasOne[key].localField;
        }) : []);
    static tdocFields = {
        locId: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new DbIdValidationRule(false)),
        locIdParent: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new DbIdValidationRule(false)),
        routeId: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new DbIdValidationRule(false)),
        trackId: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new DbIdValidationRule(false)),
        tripId: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new DbIdValidationRule(false)),
        newsId: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new DbIdValidationRule(false)),
        infoId: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new DbIdValidationRule(false)),
        imageId: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new DbIdValidationRule(false)),
        videoId: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new DbIdValidationRule(false)),
        destinationId: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(false)),

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
        gpsTrackState: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER, new NumberValidationRule(false, -127, 127, undefined)),
        locHirarchie: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.TEXT, new HierarchyValidationRule(false)),
        locHirarchieIds: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID_CSV, new IdCsvValidationRule(false)),
        objects: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.WHAT_KEY_CSV, new TextValidationRule(false)),
        persons: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.WHAT_KEY_CSV, new TextValidationRule(false)),
        linkedRouteAttr: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        techName: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
    };

    locId: number;
    locIdParent: number;
    routeId: number;
    trackId: number;
    tripId: number;
    newsId: number;
    infoId: number;
    imageId: number;
    videoId: number;
    destinationId: string;

    datestart: Date;
    dateend: Date;
    geoDistance: number;
    geoLon: string;
    geoLat: string;
    geoLoc: string;
    gpsTrackSrc: string;
    gpsTrackBasefile: string;
    gpsTrackState: number;
    locHirarchie: string;
    locHirarchieIds: string;
    objects: string;
    persons: string;
    linkedRouteAttr: string;
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
            case 'tdocmediameta':
                return TourDocMediaMetaRecordFactory.instance.getSanitizedValues(values, {});
            case 'tdocratepers':
                return TourDocRatePersonalRecordFactory.instance.getSanitizedValues(values, {});
            case 'tdocratetech':
                return TourDocRateTechRecordFactory.instance.getSanitizedValues(values, {});

            case 'tdocinfo':
                return TourDocInfoRecordFactory.instance.getSanitizedValues(values, {});
            case 'tdocimages':
                return TourDocImageRecordFactory.instance.getSanitizedValues(values, {});
            case 'tdocvideos':
                return TourDocVideoRecordFactory.instance.getSanitizedValues(values, {});
            case 'tdoclinkedroutes':
                return TourDocLinkedRouteRecordFactory.instance.getSanitizedValues(values, {});
            case 'tdoclinkedinfos':
                return TourDocLinkedInfoRecordFactory.instance.getSanitizedValues(values, {});
            case 'tdoclinkedplaylists':
                return TourDocLinkedPlaylistRecordFactory.instance.getSanitizedValues(values, {});
            case 'tdoclinkedpois':
                return TourDocLinkedPoiRecordFactory.instance.getSanitizedValues(values, {});
            case 'tdocodimageobjects':
                return TourDocObjectDetectionImageObjectRecordFactory.instance.getSanitizedValues(values, {});
            case 'tdocnavigationobjects':
                return TourDocNavigationObjectRecordFactory.instance.getSanitizedValues(values, {});
            case 'tdocextendedobjectproperties':
                return TourDocExtendedObjectPropertyRecordFactory.instance.getSanitizedValues(values, {});
            default:
                return super.getSanitizedRelationValues(relation, values);
        }
    };

}

export class TourDocRecordValidator extends CommonDocRecordValidator {
    public static instance = new TourDocRecordValidator();

    isValid(doc: BaseEntityRecord, errFieldPrefix?: string): boolean {
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
            case 'tdocmediameta':
                return TourDocMediaMetaRecordValidator.instance.validate(<TourDocMediaMetaRecord>doc, errFieldPrefix);
            case 'tdocratepers':
                return TourDocRatePersonalRecordValidator.instance.validate(<TourDocRatePersonalRecord>doc, errFieldPrefix);
            case 'tdocratetech':
                return TourDocRateTechRecordValidator.instance.validate(<TourDocRateTechRecord>doc, errFieldPrefix);

            case 'tdocinfo':
                return TourDocInfoRecordValidator.instance.validate(<TourDocInfoRecord>doc, errFieldPrefix);
            case 'tdocimages':
                return TourDocImageRecordValidator.instance.validate(<TourDocImageRecord>doc, errFieldPrefix);
            case 'tdocvideos':
                return TourDocVideoRecordValidator.instance.validate(<TourDocVideoRecord>doc, errFieldPrefix);
            case 'tdoclinkedroutes':
                return TourDocLinkedRouteRecordValidator.instance.validate(<TourDocLinkedRouteRecord>doc, errFieldPrefix);
            case 'tdoclinkedinfos':
                return TourDocLinkedInfoRecordValidator.instance.validate(<TourDocLinkedInfoRecord>doc, errFieldPrefix);
            case 'tdoclinkedplaylists':
                return TourDocLinkedPlaylistRecordValidator.instance.validate(<TourDocLinkedPlaylistRecord>doc, errFieldPrefix);
            case 'tdoclinkedpois':
                return TourDocLinkedPoiRecordValidator.instance.validate(<TourDocLinkedPoiRecord>doc, errFieldPrefix);
            case 'tdocodimageobjects':
                return TourDocObjectDetectionImageObjectRecordValidator.instance.validate(<TourDocObjectDetectionImageObjectRecord>doc,
                    errFieldPrefix);
            case 'tdocnavigationobjects':
                return TourDocNavigationObjectRecordValidator.instance.validate(<TourDocNavigationObjectRecord>doc, errFieldPrefix);
            case 'tdocextendedobjectproperties':
                return TourDocExtendedObjectPropertyRecordValidator.instance.validate(<TourDocExtendedObjectPropertyRecord>doc, errFieldPrefix);
            default:
                return super.validateRelationDoc(relation, doc, errFieldPrefix);
        }
    };

    protected validateValueRelationDoc(relation: string, values: {}, fieldPrefix?: string, errFieldPrefix?: string): string[] {
        switch (relation) {
            case 'tdocdatatech':
                return TourDocDataTechRecordValidator.instance.validateValues(values, fieldPrefix, errFieldPrefix);
            case 'tdocdatainfo':
                return TourDocDataInfoRecordValidator.instance.validateValues(values, fieldPrefix, errFieldPrefix);
            case 'tdocmediameta':
                return TourDocMediaMetaRecordValidator.instance.validateValues(values, fieldPrefix, errFieldPrefix);
            case 'tdocratepers':
                return TourDocRatePersonalRecordValidator.instance.validateValues(values, fieldPrefix, errFieldPrefix);
            case 'tdocratetech':
                return TourDocRateTechRecordValidator.instance.validateValues(values, fieldPrefix, errFieldPrefix);

            case 'tdocinfo':
                return TourDocInfoRecordValidator.instance.validateValues(values, fieldPrefix, errFieldPrefix);
            case 'tdocimages':
                return TourDocImageRecordValidator.instance.validateValues(values, fieldPrefix, errFieldPrefix);
            case 'tdocvideos':
                return TourDocVideoRecordValidator.instance.validateValues(values, fieldPrefix, errFieldPrefix);
            case 'tdoclinkedroutes':
                return TourDocLinkedRouteRecordValidator.instance.validateValues(values, fieldPrefix, errFieldPrefix);
            case 'tdoclinkedinfos':
                return TourDocLinkedInfoRecordValidator.instance.validateValues(values, fieldPrefix, errFieldPrefix);
            case 'tdoclinkedplaylists':
                return TourDocLinkedPlaylistRecordValidator.instance.validateValues(values, fieldPrefix, errFieldPrefix);
            case 'tdoclinkedpois':
                return TourDocLinkedPoiRecordValidator.instance.validateValues(values, fieldPrefix, errFieldPrefix);
            case 'tdocodimageobjects':
                return TourDocObjectDetectionImageObjectRecordValidator.instance.validateValues(values, fieldPrefix, errFieldPrefix);
            case 'tdocnavigationobjects':
                return TourDocNavigationObjectRecordValidator.instance.validateValues(values, fieldPrefix, errFieldPrefix);
            case 'tdocextendedobjectproperties':
                return TourDocExtendedObjectPropertyRecordValidator.instance.validateValues(values, fieldPrefix, errFieldPrefix);
            default:
                return super.validateValueRelationDoc(relation, values, fieldPrefix, errFieldPrefix);
        }
    };
}
