import {
    BaseEntityRecord,
    BaseEntityRecordFieldConfig,
    BaseEntityRecordType
} from '../../../search-commons/model/records/base-entity-record';
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
} from '../../../search-commons/model/forms/generic-validator.util';
import {isArray} from 'util';
import {CommonDocRecord, CommonDocRecordValidator} from '../../../search-commons/model/records/cdoc-entity-record';

export interface SDocRecordType extends BaseEntityRecordType {
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

export class SDocRecord extends CommonDocRecord implements SDocRecordType {
    static sdocFields = {
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

    static cloneToSerializeToJsonObj(baseRecord: SDocRecord, anonymizeMedia?: boolean): {}  {
        const record  = {};
        for (const key in baseRecord) {
            record[key] = baseRecord[key];
        }
        record['sdocdatatech'] = baseRecord.get('sdocdatatech');
        record['sdocdatainfo'] = baseRecord.get('sdocdatainfo');
        record['sdocimages'] = baseRecord.get('sdocimages');
        record['sdocvideos'] = baseRecord.get('sdocvideos');
        record['sdocratepers'] = baseRecord.get('sdocratepers');
        record['sdocratetech'] = baseRecord.get('sdocratetech');

        if (anonymizeMedia === true) {
            if (isArray(record['sdocimages'])) {
                for (const media of record['sdocimages']) {
                    media.fileName = 'anonymized.JPG';
                }
            }
            if (isArray(record['sdocvideos'])) {
                for (const media of record['sdocvideos']) {
                    media.fileName = 'anonymized.MP4';
                }
            }
        }

        return record;
    }

    toString() {
        return 'SDocRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  name: ' + this.name + ',\n' +
            '  type: ' + this.type + '' +
            '}';
    }

    toSerializableJsonObj(anonymizeMedia?: boolean): {} {
        return SDocRecord.cloneToSerializeToJsonObj(this, anonymizeMedia);
    }

    isValid(): boolean {
        return SDocRecordValidator.isValid(this);
    }
}

export let SDocRecordRelation: any = {
    hasOne: {
        sdocdatatech: {
            // database column
            foreignKey: 'sdoc_id',
            // reference to related objects in memory
            localField: 'sdocdatatech'
        },
        sdocdatainfo: {
            // database column
            foreignKey: 'sdoc_id',
            // reference to related objects in memory
            localField: 'sdocdatainfo'
        },
        sdocratepers: {
            // database column
            foreignKey: 'sdoc_id',
            // reference to related objects in memory
            localField: 'sdocratepers'
        },
        sdocratetech: {
            // database column
            foreignKey: 'sdoc_id',
            // reference to related objects in memory
            localField: 'sdocratetech'
        }
    },
    hasMany: {
        sdocimage: {
            // database column
            foreignKey: 'sdoc_id',
            // reference to related objects in memory
            localField: 'sdocimages'
        },
        sdocvideo: {
            // database column
            foreignKey: 'sdoc_id',
            // reference to related objects in memory
            localField: 'sdocvideos'
        }
    }
};

export class SDocRecordFactory {
    static createSanitized(values: {}): SDocRecord {
        const sanitizedValues: any = {};
        sanitizedValues.id = BaseEntityRecord.genericFields.id.validator.sanitize(values['id']) || undefined;

        sanitizedValues.locId = SDocRecord.sdocFields.locId.validator.sanitize(values['locId']) || undefined;
        sanitizedValues.locIdParent = SDocRecord.sdocFields.locIdParent.validator.sanitize(values['locIdParent']) || undefined;
        sanitizedValues.routeId = SDocRecord.sdocFields.routeId.validator.sanitize(values['routeId']) || undefined;
        sanitizedValues.trackId = SDocRecord.sdocFields.trackId.validator.sanitize(values['trackId']) || undefined;
        sanitizedValues.tripId = SDocRecord.sdocFields.tripId.validator.sanitize(values['tripId']) || undefined;
        sanitizedValues.newsId = SDocRecord.sdocFields.newsId.validator.sanitize(values['newsId']) || undefined;
        sanitizedValues.imageId = SDocRecord.sdocFields.imageId.validator.sanitize(values['imageId']) || undefined;
        sanitizedValues.videoId = SDocRecord.sdocFields.imageId.validator.sanitize(values['videoId']) || undefined;

        sanitizedValues.blocked = CommonDocRecord.cdocFields.blocked.validator.sanitize(values['blocked']) || undefined;
        sanitizedValues.dateshow = CommonDocRecord.cdocFields.dateshow.validator.sanitize(values['dateshow']) || undefined;
        sanitizedValues.datestart = SDocRecord.sdocFields.datestart.validator.sanitize(values['datestart']) || undefined;
        sanitizedValues.dateend = SDocRecord.sdocFields.dateend.validator.sanitize(values['dateend']) || undefined;
        sanitizedValues.descTxt = CommonDocRecord.cdocFields.descTxt.validator.sanitize(values['descTxt']) || undefined;
        sanitizedValues.descMd = CommonDocRecord.cdocFields.descMd.validator.sanitize(values['descMd']) || undefined;
        sanitizedValues.descHtml = CommonDocRecord.cdocFields.descHtml.validator.sanitize(values['descHtml']) || undefined;
        sanitizedValues.geoDistance = SDocRecord.sdocFields.geoDistance.validator.sanitize(values['geoDistance']) || undefined;
        sanitizedValues.geoLon = SDocRecord.sdocFields.geoLon.validator.sanitize(values['geoLon']) || undefined;
        sanitizedValues.geoLat = SDocRecord.sdocFields.geoLat.validator.sanitize(values['geoLat']) || undefined;
        sanitizedValues.geoLoc = SDocRecord.sdocFields.geoLoc.validator.sanitize(values['geoLoc']) || undefined;
        sanitizedValues.gpsTrackSrc = SDocRecord.sdocFields.gpsTrackSrc.validator.sanitize(values['gpsTrackSrc']) || undefined;
        sanitizedValues.gpsTrackBasefile = SDocRecord.sdocFields.gpsTrackBasefile.validator.sanitize(values['gpsTrackBasefile'])
            || undefined;
        sanitizedValues.keywords = CommonDocRecord.cdocFields.keywords.validator.sanitize(values['keywords']) || undefined;
        sanitizedValues.locHirarchie = SDocRecord.sdocFields.locHirarchie.validator.sanitize(values['locHirarchie']) || undefined;
        sanitizedValues.locHirarchieIds = SDocRecord.sdocFields.locHirarchieIds.validator.sanitize(values['locHirarchieIds']) || undefined;
        sanitizedValues.name = CommonDocRecord.cdocFields.name.validator.sanitize(values['name']) || undefined;
        sanitizedValues.persons = SDocRecord.sdocFields.persons.validator.sanitize(values['persons']) || undefined;
        sanitizedValues.playlists = CommonDocRecord.cdocFields.playlists.validator.sanitize(values['playlists']) || undefined;
        sanitizedValues.subtype = CommonDocRecord.cdocFields.subtype.validator.sanitize(values['subtype']) || undefined;
        sanitizedValues.type = CommonDocRecord.cdocFields.type.validator.sanitize(values['type']) || undefined;

        return new SDocRecord(sanitizedValues);
    }

    static cloneSanitized(sdoc: SDocRecord): SDocRecord {
        const sanitizedValues: any = {};
        sanitizedValues.id = BaseEntityRecord.genericFields.id.validator.sanitize(sdoc.id) || undefined;

        sanitizedValues.locId = SDocRecord.sdocFields.locId.validator.sanitize(sdoc.locId) || undefined;
        sanitizedValues.locIdParent = SDocRecord.sdocFields.locIdParent.validator.sanitize(sdoc.locIdParent) || undefined;
        sanitizedValues.routeId = SDocRecord.sdocFields.routeId.validator.sanitize(sdoc.routeId) || undefined;
        sanitizedValues.trackId = SDocRecord.sdocFields.trackId.validator.sanitize(sdoc.trackId) || undefined;
        sanitizedValues.tripId = SDocRecord.sdocFields.tripId.validator.sanitize(sdoc.tripId) || undefined;
        sanitizedValues.newsId = SDocRecord.sdocFields.newsId.validator.sanitize(sdoc.newsId) || undefined;
        sanitizedValues.imageId = SDocRecord.sdocFields.imageId.validator.sanitize(sdoc.imageId) || undefined;
        sanitizedValues.videoId = SDocRecord.sdocFields.imageId.validator.sanitize(sdoc.videoId) || undefined;

        sanitizedValues.blocked = CommonDocRecord.cdocFields.blocked.validator.sanitize(sdoc.blocked) || undefined;
        sanitizedValues.dateshow = CommonDocRecord.cdocFields.dateshow.validator.sanitize(sdoc.dateshow) || undefined;
        sanitizedValues.datestart = SDocRecord.sdocFields.datestart.validator.sanitize(sdoc.datestart) || undefined;
        sanitizedValues.dateend = SDocRecord.sdocFields.dateend.validator.sanitize(sdoc.dateend) || undefined;
        sanitizedValues.descTxt = CommonDocRecord.cdocFields.descTxt.validator.sanitize(sdoc.descTxt) || undefined;
        sanitizedValues.descMd = CommonDocRecord.cdocFields.descMd.validator.sanitize(sdoc.descMd) || undefined;
        sanitizedValues.descHtml = CommonDocRecord.cdocFields.descHtml.validator.sanitize(sdoc.descHtml) || undefined;
        sanitizedValues.geoDistance = SDocRecord.sdocFields.geoDistance.validator.sanitize(sdoc.geoDistance) || undefined;
        sanitizedValues.geoLon = SDocRecord.sdocFields.geoLon.validator.sanitize(sdoc.geoLon) || undefined;
        sanitizedValues.geoLat = SDocRecord.sdocFields.geoLat.validator.sanitize(sdoc.geoLat) || undefined;
        sanitizedValues.geoLoc = SDocRecord.sdocFields.geoLoc.validator.sanitize(sdoc.geoLoc) || undefined;
        sanitizedValues.gpsTrackSrc = SDocRecord.sdocFields.gpsTrackSrc.validator.sanitize(sdoc.gpsTrackSrc) || undefined;
        sanitizedValues.gpsTrackBasefile = SDocRecord.sdocFields.gpsTrackBasefile.validator.sanitize(sdoc.gpsTrackBasefile) || undefined;
        sanitizedValues.keywords = CommonDocRecord.cdocFields.keywords.validator.sanitize(sdoc.keywords) || undefined;
        sanitizedValues.locHirarchie = SDocRecord.sdocFields.locHirarchie.validator.sanitize(sdoc.locHirarchie) || undefined;
        sanitizedValues.locHirarchieIds = SDocRecord.sdocFields.locHirarchieIds.validator.sanitize(sdoc.locHirarchieIds) || undefined;
        sanitizedValues.name = CommonDocRecord.cdocFields.name.validator.sanitize(sdoc.name) || undefined;
        sanitizedValues.persons = SDocRecord.sdocFields.persons.validator.sanitize(sdoc.persons) || undefined;
        sanitizedValues.playlists = CommonDocRecord.cdocFields.playlists.validator.sanitize(sdoc.playlists) || undefined;
        sanitizedValues.subtype = CommonDocRecord.cdocFields.subtype.validator.sanitize(sdoc.subtype) || undefined;
        sanitizedValues.type = CommonDocRecord.cdocFields.type.validator.sanitize(sdoc.type) || undefined;

        return new SDocRecord(sanitizedValues);
    }
}

export class SDocRecordValidator {
    static isValidValues(values: {}): boolean {
        return SDocRecordValidator.validateValues(values).length > 0;
    }

    static validateValues(values: {}): string[] {
        const errors = CommonDocRecordValidator.validateValues(values);
        let state = true;

        state = !SDocRecord.sdocFields.locId.validator.isValid(values['locId']) ? errors.push('locId') &&  false : true;
        state = !SDocRecord.sdocFields.locIdParent.validator.isValid(values['locIdParent']) ? errors.push('locIdParent') &&  false : true;
        state = !SDocRecord.sdocFields.routeId.validator.isValid(values['routeId']) ? errors.push('routeId') &&  false : true;
        state = !SDocRecord.sdocFields.trackId.validator.isValid(values['trackId']) ? errors.push('trackId') &&  false : true;
        state = !SDocRecord.sdocFields.tripId.validator.isValid(values['tripId']) ? errors.push('tripId') &&  false : true;
        state = !SDocRecord.sdocFields.newsId.validator.isValid(values['newsId']) ? errors.push('newsId') &&  false : true;
        state = !SDocRecord.sdocFields.imageId.validator.isValid(values['imageId']) ? errors.push('imageId') &&  false : true;
        state = !SDocRecord.sdocFields.videoId.validator.isValid(values['videoId']) ? errors.push('videoId') &&  false : true;

        state = !SDocRecord.sdocFields.datestart.validator.isValid(values['datestart']) ? errors.push('datestart') &&  false : true;
        state = !SDocRecord.sdocFields.dateend.validator.isValid(values['dateend']) ? errors.push('dateend') &&  false : true;
        state = !SDocRecord.sdocFields.geoDistance.validator.isValid(values['geoDistance']) ? errors.push('geoDistance') &&  false : true;
        state = !SDocRecord.sdocFields.geoLon.validator.isValid(values['geoLon']) ? errors.push('geoLon') &&  false : true;
        state = !SDocRecord.sdocFields.geoLat.validator.isValid(values['geoLat']) ? errors.push('geoLat') &&  false : true;
        state = !SDocRecord.sdocFields.geoLoc.validator.isValid(values['geoLoc']) ? errors.push('geoLoc') &&  false : true;
        state = !SDocRecord.sdocFields.gpsTrackSrc.validator.isValid(values['gpsTrackSrc']) ? errors.push('gpsTrackSrc') &&  false : true;
        state = !SDocRecord.sdocFields.gpsTrackBasefile.validator.isValid(values['gpsTrackBasefile'])
            ? errors.push('gpsTrackBasefile') && false : true;
        state = !SDocRecord.sdocFields.locHirarchie.validator.isValid(values['locHirarchie'])
            ? errors.push('locHirarchie') &&  false : true;
        state = !SDocRecord.sdocFields.locHirarchieIds.validator.isValid(values['locHirarchieIds'])
            ? errors.push('locHirarchieIds') && false : true;
        state = !SDocRecord.sdocFields.persons.validator.isValid(values['persons']) ? errors.push('persons') &&  false : true;

        return errors;
    }

    static isValid(sdoc: SDocRecord): boolean {
        return SDocRecordValidator.validate(sdoc).length > 0;
    }

    static validate(sdoc: SDocRecord): string[] {
        const errors = CommonDocRecordValidator.validate(sdoc);
        let state = true;

        state = !SDocRecord.sdocFields.locId.validator.isValid(sdoc.locId) ? errors.push('locId') &&  false : true;
        state = !SDocRecord.sdocFields.locIdParent.validator.isValid(sdoc.locIdParent) ? errors.push('locIdParent') &&  false : true;
        state = !SDocRecord.sdocFields.routeId.validator.isValid(sdoc.routeId) ? errors.push('routeId') &&  false : true;
        state = !SDocRecord.sdocFields.trackId.validator.isValid(sdoc.trackId) ? errors.push('trackId') &&  false : true;
        state = !SDocRecord.sdocFields.tripId.validator.isValid(sdoc.tripId) ? errors.push('tripId') &&  false : true;
        state = !SDocRecord.sdocFields.newsId.validator.isValid(sdoc.newsId) ? errors.push('newsId') &&  false : true;
        state = !SDocRecord.sdocFields.imageId.validator.isValid(sdoc.imageId) ? errors.push('imageId') &&  false : true;
        state = !SDocRecord.sdocFields.videoId.validator.isValid(sdoc.videoId) ? errors.push('videoId') &&  false : true;

        state = !SDocRecord.sdocFields.datestart.validator.isValid(sdoc.datestart) ? errors.push('datestart') &&  false : true;
        state = !SDocRecord.sdocFields.dateend.validator.isValid(sdoc.dateend) ? errors.push('dateend') &&  false : true;
        state = !SDocRecord.sdocFields.geoDistance.validator.isValid(sdoc.geoDistance) ? errors.push('geoDistance') &&  false : true;
        state = !SDocRecord.sdocFields.geoLon.validator.isValid(sdoc.geoLon) ? errors.push('geoLon') &&  false : true;
        state = !SDocRecord.sdocFields.geoLat.validator.isValid(sdoc.geoLat) ? errors.push('geoLat') &&  false : true;
        state = !SDocRecord.sdocFields.geoLoc.validator.isValid(sdoc.geoLoc) ? errors.push('geoLoc') &&  false : true;
        state = !SDocRecord.sdocFields.gpsTrackSrc.validator.isValid(sdoc.gpsTrackSrc) ? errors.push('gpsTrackSrc') &&  false : true;
        state = !SDocRecord.sdocFields.gpsTrackBasefile.validator.isValid(sdoc.gpsTrackBasefile)
            ? errors.push('gpsTrackBasefile') &&  false : true;
        state = !SDocRecord.sdocFields.locHirarchie.validator.isValid(sdoc.locHirarchie) ? errors.push('locHirarchie') &&  false : true;
        state = !SDocRecord.sdocFields.locHirarchieIds.validator.isValid(sdoc.locHirarchieIds)
            ? errors.push('locHirarchieIds') &&  false : true;
        state = !SDocRecord.sdocFields.persons.validator.isValid(sdoc.persons) ? errors.push('persons') &&  false : true;

        return errors;
    }
}
