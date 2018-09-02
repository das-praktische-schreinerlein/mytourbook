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
import {CommonDocRecord, CommonDocRecordValidator} from '@dps/mycms-commons/dist/search-commons/model/records/cdoc-entity-record';

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
        record['tdocdatatech'] = baseRecord.get('tdocdatatech');
        record['tdocdatainfo'] = baseRecord.get('tdocdatainfo');
        record['tdocimages'] = baseRecord.get('tdocimages');
        record['tdocvideos'] = baseRecord.get('tdocvideos');
        record['tdocratepers'] = baseRecord.get('tdocratepers');
        record['tdocratetech'] = baseRecord.get('tdocratetech');

        if (anonymizeMedia === true) {
            if (isArray(record['tdocimages'])) {
                for (const media of record['tdocimages']) {
                    media.fileName = 'anonymized.JPG';
                }
            }
            if (isArray(record['tdocvideos'])) {
                for (const media of record['tdocvideos']) {
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
        return TourDocRecordValidator.isValid(this);
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
    static createSanitized(values: {}): TourDocRecord {
        const sanitizedValues: any = {};
        sanitizedValues.id = BaseEntityRecord.genericFields.id.validator.sanitize(values['id']) || undefined;

        sanitizedValues.locId = TourDocRecord.tdocFields.locId.validator.sanitize(values['locId']) || undefined;
        sanitizedValues.locIdParent = TourDocRecord.tdocFields.locIdParent.validator.sanitize(values['locIdParent']) || undefined;
        sanitizedValues.routeId = TourDocRecord.tdocFields.routeId.validator.sanitize(values['routeId']) || undefined;
        sanitizedValues.trackId = TourDocRecord.tdocFields.trackId.validator.sanitize(values['trackId']) || undefined;
        sanitizedValues.tripId = TourDocRecord.tdocFields.tripId.validator.sanitize(values['tripId']) || undefined;
        sanitizedValues.newsId = TourDocRecord.tdocFields.newsId.validator.sanitize(values['newsId']) || undefined;
        sanitizedValues.imageId = TourDocRecord.tdocFields.imageId.validator.sanitize(values['imageId']) || undefined;
        sanitizedValues.videoId = TourDocRecord.tdocFields.imageId.validator.sanitize(values['videoId']) || undefined;

        sanitizedValues.blocked = CommonDocRecord.cdocFields.blocked.validator.sanitize(values['blocked']) || undefined;
        sanitizedValues.dateshow = CommonDocRecord.cdocFields.dateshow.validator.sanitize(values['dateshow']) || undefined;
        sanitizedValues.datestart = TourDocRecord.tdocFields.datestart.validator.sanitize(values['datestart']) || undefined;
        sanitizedValues.dateend = TourDocRecord.tdocFields.dateend.validator.sanitize(values['dateend']) || undefined;
        sanitizedValues.descTxt = CommonDocRecord.cdocFields.descTxt.validator.sanitize(values['descTxt']) || undefined;
        sanitizedValues.descMd = CommonDocRecord.cdocFields.descMd.validator.sanitize(values['descMd']) || undefined;
        sanitizedValues.descHtml = CommonDocRecord.cdocFields.descHtml.validator.sanitize(values['descHtml']) || undefined;
        sanitizedValues.geoDistance = TourDocRecord.tdocFields.geoDistance.validator.sanitize(values['geoDistance']) || undefined;
        sanitizedValues.geoLon = TourDocRecord.tdocFields.geoLon.validator.sanitize(values['geoLon']) || undefined;
        sanitizedValues.geoLat = TourDocRecord.tdocFields.geoLat.validator.sanitize(values['geoLat']) || undefined;
        sanitizedValues.geoLoc = TourDocRecord.tdocFields.geoLoc.validator.sanitize(values['geoLoc']) || undefined;
        sanitizedValues.gpsTrackSrc = TourDocRecord.tdocFields.gpsTrackSrc.validator.sanitize(values['gpsTrackSrc']) || undefined;
        sanitizedValues.gpsTrackBasefile = TourDocRecord.tdocFields.gpsTrackBasefile.validator.sanitize(values['gpsTrackBasefile'])
            || undefined;
        sanitizedValues.keywords = CommonDocRecord.cdocFields.keywords.validator.sanitize(values['keywords']) || undefined;
        sanitizedValues.locHirarchie = TourDocRecord.tdocFields.locHirarchie.validator.sanitize(values['locHirarchie']) || undefined;
        sanitizedValues.locHirarchieIds = TourDocRecord.tdocFields.locHirarchieIds.validator.sanitize(values['locHirarchieIds']) || undefined;
        sanitizedValues.name = CommonDocRecord.cdocFields.name.validator.sanitize(values['name']) || undefined;
        sanitizedValues.persons = TourDocRecord.tdocFields.persons.validator.sanitize(values['persons']) || undefined;
        sanitizedValues.playlists = CommonDocRecord.cdocFields.playlists.validator.sanitize(values['playlists']) || undefined;
        sanitizedValues.subtype = CommonDocRecord.cdocFields.subtype.validator.sanitize(values['subtype']) || undefined;
        sanitizedValues.type = CommonDocRecord.cdocFields.type.validator.sanitize(values['type']) || undefined;

        return new TourDocRecord(sanitizedValues);
    }

    static cloneSanitized(tdoc: TourDocRecord): TourDocRecord {
        const sanitizedValues: any = {};
        sanitizedValues.id = BaseEntityRecord.genericFields.id.validator.sanitize(tdoc.id) || undefined;

        sanitizedValues.locId = TourDocRecord.tdocFields.locId.validator.sanitize(tdoc.locId) || undefined;
        sanitizedValues.locIdParent = TourDocRecord.tdocFields.locIdParent.validator.sanitize(tdoc.locIdParent) || undefined;
        sanitizedValues.routeId = TourDocRecord.tdocFields.routeId.validator.sanitize(tdoc.routeId) || undefined;
        sanitizedValues.trackId = TourDocRecord.tdocFields.trackId.validator.sanitize(tdoc.trackId) || undefined;
        sanitizedValues.tripId = TourDocRecord.tdocFields.tripId.validator.sanitize(tdoc.tripId) || undefined;
        sanitizedValues.newsId = TourDocRecord.tdocFields.newsId.validator.sanitize(tdoc.newsId) || undefined;
        sanitizedValues.imageId = TourDocRecord.tdocFields.imageId.validator.sanitize(tdoc.imageId) || undefined;
        sanitizedValues.videoId = TourDocRecord.tdocFields.imageId.validator.sanitize(tdoc.videoId) || undefined;

        sanitizedValues.blocked = CommonDocRecord.cdocFields.blocked.validator.sanitize(tdoc.blocked) || undefined;
        sanitizedValues.dateshow = CommonDocRecord.cdocFields.dateshow.validator.sanitize(tdoc.dateshow) || undefined;
        sanitizedValues.datestart = TourDocRecord.tdocFields.datestart.validator.sanitize(tdoc.datestart) || undefined;
        sanitizedValues.dateend = TourDocRecord.tdocFields.dateend.validator.sanitize(tdoc.dateend) || undefined;
        sanitizedValues.descTxt = CommonDocRecord.cdocFields.descTxt.validator.sanitize(tdoc.descTxt) || undefined;
        sanitizedValues.descMd = CommonDocRecord.cdocFields.descMd.validator.sanitize(tdoc.descMd) || undefined;
        sanitizedValues.descHtml = CommonDocRecord.cdocFields.descHtml.validator.sanitize(tdoc.descHtml) || undefined;
        sanitizedValues.geoDistance = TourDocRecord.tdocFields.geoDistance.validator.sanitize(tdoc.geoDistance) || undefined;
        sanitizedValues.geoLon = TourDocRecord.tdocFields.geoLon.validator.sanitize(tdoc.geoLon) || undefined;
        sanitizedValues.geoLat = TourDocRecord.tdocFields.geoLat.validator.sanitize(tdoc.geoLat) || undefined;
        sanitizedValues.geoLoc = TourDocRecord.tdocFields.geoLoc.validator.sanitize(tdoc.geoLoc) || undefined;
        sanitizedValues.gpsTrackSrc = TourDocRecord.tdocFields.gpsTrackSrc.validator.sanitize(tdoc.gpsTrackSrc) || undefined;
        sanitizedValues.gpsTrackBasefile = TourDocRecord.tdocFields.gpsTrackBasefile.validator.sanitize(tdoc.gpsTrackBasefile) || undefined;
        sanitizedValues.keywords = CommonDocRecord.cdocFields.keywords.validator.sanitize(tdoc.keywords) || undefined;
        sanitizedValues.locHirarchie = TourDocRecord.tdocFields.locHirarchie.validator.sanitize(tdoc.locHirarchie) || undefined;
        sanitizedValues.locHirarchieIds = TourDocRecord.tdocFields.locHirarchieIds.validator.sanitize(tdoc.locHirarchieIds) || undefined;
        sanitizedValues.name = CommonDocRecord.cdocFields.name.validator.sanitize(tdoc.name) || undefined;
        sanitizedValues.persons = TourDocRecord.tdocFields.persons.validator.sanitize(tdoc.persons) || undefined;
        sanitizedValues.playlists = CommonDocRecord.cdocFields.playlists.validator.sanitize(tdoc.playlists) || undefined;
        sanitizedValues.subtype = CommonDocRecord.cdocFields.subtype.validator.sanitize(tdoc.subtype) || undefined;
        sanitizedValues.type = CommonDocRecord.cdocFields.type.validator.sanitize(tdoc.type) || undefined;

        return new TourDocRecord(sanitizedValues);
    }
}

export class TourDocRecordValidator {
    static isValidValues(values: {}): boolean {
        return TourDocRecordValidator.validateValues(values).length > 0;
    }

    static validateValues(values: {}): string[] {
        const errors = CommonDocRecordValidator.validateValues(values);
        let state = true;

        state = !TourDocRecord.tdocFields.locId.validator.isValid(values['locId']) ? errors.push('locId') &&  false : true;
        state = !TourDocRecord.tdocFields.locIdParent.validator.isValid(values['locIdParent']) ? errors.push('locIdParent') &&  false : true;
        state = !TourDocRecord.tdocFields.routeId.validator.isValid(values['routeId']) ? errors.push('routeId') &&  false : true;
        state = !TourDocRecord.tdocFields.trackId.validator.isValid(values['trackId']) ? errors.push('trackId') &&  false : true;
        state = !TourDocRecord.tdocFields.tripId.validator.isValid(values['tripId']) ? errors.push('tripId') &&  false : true;
        state = !TourDocRecord.tdocFields.newsId.validator.isValid(values['newsId']) ? errors.push('newsId') &&  false : true;
        state = !TourDocRecord.tdocFields.imageId.validator.isValid(values['imageId']) ? errors.push('imageId') &&  false : true;
        state = !TourDocRecord.tdocFields.videoId.validator.isValid(values['videoId']) ? errors.push('videoId') &&  false : true;

        state = !TourDocRecord.tdocFields.datestart.validator.isValid(values['datestart']) ? errors.push('datestart') &&  false : true;
        state = !TourDocRecord.tdocFields.dateend.validator.isValid(values['dateend']) ? errors.push('dateend') &&  false : true;
        state = !TourDocRecord.tdocFields.geoDistance.validator.isValid(values['geoDistance']) ? errors.push('geoDistance') &&  false : true;
        state = !TourDocRecord.tdocFields.geoLon.validator.isValid(values['geoLon']) ? errors.push('geoLon') &&  false : true;
        state = !TourDocRecord.tdocFields.geoLat.validator.isValid(values['geoLat']) ? errors.push('geoLat') &&  false : true;
        state = !TourDocRecord.tdocFields.geoLoc.validator.isValid(values['geoLoc']) ? errors.push('geoLoc') &&  false : true;
        state = !TourDocRecord.tdocFields.gpsTrackSrc.validator.isValid(values['gpsTrackSrc']) ? errors.push('gpsTrackSrc') &&  false : true;
        state = !TourDocRecord.tdocFields.gpsTrackBasefile.validator.isValid(values['gpsTrackBasefile'])
            ? errors.push('gpsTrackBasefile') && false : true;
        state = !TourDocRecord.tdocFields.locHirarchie.validator.isValid(values['locHirarchie'])
            ? errors.push('locHirarchie') &&  false : true;
        state = !TourDocRecord.tdocFields.locHirarchieIds.validator.isValid(values['locHirarchieIds'])
            ? errors.push('locHirarchieIds') && false : true;
        state = !TourDocRecord.tdocFields.persons.validator.isValid(values['persons']) ? errors.push('persons') &&  false : true;

        return errors;
    }

    static isValid(tdoc: TourDocRecord): boolean {
        return TourDocRecordValidator.validate(tdoc).length > 0;
    }

    static validate(tdoc: TourDocRecord): string[] {
        const errors = CommonDocRecordValidator.validate(tdoc);
        let state = true;

        state = !TourDocRecord.tdocFields.locId.validator.isValid(tdoc.locId) ? errors.push('locId') &&  false : true;
        state = !TourDocRecord.tdocFields.locIdParent.validator.isValid(tdoc.locIdParent) ? errors.push('locIdParent') &&  false : true;
        state = !TourDocRecord.tdocFields.routeId.validator.isValid(tdoc.routeId) ? errors.push('routeId') &&  false : true;
        state = !TourDocRecord.tdocFields.trackId.validator.isValid(tdoc.trackId) ? errors.push('trackId') &&  false : true;
        state = !TourDocRecord.tdocFields.tripId.validator.isValid(tdoc.tripId) ? errors.push('tripId') &&  false : true;
        state = !TourDocRecord.tdocFields.newsId.validator.isValid(tdoc.newsId) ? errors.push('newsId') &&  false : true;
        state = !TourDocRecord.tdocFields.imageId.validator.isValid(tdoc.imageId) ? errors.push('imageId') &&  false : true;
        state = !TourDocRecord.tdocFields.videoId.validator.isValid(tdoc.videoId) ? errors.push('videoId') &&  false : true;

        state = !TourDocRecord.tdocFields.datestart.validator.isValid(tdoc.datestart) ? errors.push('datestart') &&  false : true;
        state = !TourDocRecord.tdocFields.dateend.validator.isValid(tdoc.dateend) ? errors.push('dateend') &&  false : true;
        state = !TourDocRecord.tdocFields.geoDistance.validator.isValid(tdoc.geoDistance) ? errors.push('geoDistance') &&  false : true;
        state = !TourDocRecord.tdocFields.geoLon.validator.isValid(tdoc.geoLon) ? errors.push('geoLon') &&  false : true;
        state = !TourDocRecord.tdocFields.geoLat.validator.isValid(tdoc.geoLat) ? errors.push('geoLat') &&  false : true;
        state = !TourDocRecord.tdocFields.geoLoc.validator.isValid(tdoc.geoLoc) ? errors.push('geoLoc') &&  false : true;
        state = !TourDocRecord.tdocFields.gpsTrackSrc.validator.isValid(tdoc.gpsTrackSrc) ? errors.push('gpsTrackSrc') &&  false : true;
        state = !TourDocRecord.tdocFields.gpsTrackBasefile.validator.isValid(tdoc.gpsTrackBasefile)
            ? errors.push('gpsTrackBasefile') &&  false : true;
        state = !TourDocRecord.tdocFields.locHirarchie.validator.isValid(tdoc.locHirarchie) ? errors.push('locHirarchie') &&  false : true;
        state = !TourDocRecord.tdocFields.locHirarchieIds.validator.isValid(tdoc.locHirarchieIds)
            ? errors.push('locHirarchieIds') &&  false : true;
        state = !TourDocRecord.tdocFields.persons.validator.isValid(tdoc.persons) ? errors.push('persons') &&  false : true;

        return errors;
    }
}
