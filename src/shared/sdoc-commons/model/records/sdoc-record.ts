import {BaseEntityRecord, BaseEntityRecordFieldConfig} from '../../../search-commons/model/records/base-entity-record';
import {
    DateValidationRule, DbIdValidationRule, DescValidationRule, FilenameValidationRule, GenericValidatorDatatypes, GeoLocValidationRule,
    GpsTrackValidationRule, HierarchyValidationRule, HtmlValidationRule, IdCsvValidationRule, IdValidationRule, KeywordValidationRule,
    MarkdownValidationRule, NameValidationRule, NumberValidationRule, StringNumberValidationRule, TextValidationRule
} from '../../../search-commons/model/forms/generic-validator.util';

export class SDocRecord extends BaseEntityRecord {
    static sdocFields = {
        locId: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new DbIdValidationRule(false)),
        locIdParent: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new DbIdValidationRule(false)),
        routeId: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new DbIdValidationRule(false)),
        trackId: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new DbIdValidationRule(false)),
        tripId: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new DbIdValidationRule(false)),
        newsId: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new DbIdValidationRule(false)),
        imageId: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new DbIdValidationRule(false)),

        blocked: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER, new NumberValidationRule(false, -5, 5, undefined)),

        dateshow: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.DATE, new DateValidationRule(false)),
        datestart: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.DATE, new DateValidationRule(false)),
        dateend: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.DATE, new DateValidationRule(false)),

        descTxt: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.TEXT, new DescValidationRule(false)),
        descMd: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.MARKDOWN, new MarkdownValidationRule(false)),
        descHtml: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.HTML, new HtmlValidationRule(false)),
        geoDistance: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, -99999, 999999, undefined)),
        geoLon: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new StringNumberValidationRule(false, -99999, 999999, undefined)),
        geoLat: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new StringNumberValidationRule(false, -99999, 999999, undefined)),
        geoLoc: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.GEOLOC, new GeoLocValidationRule(false)),
        gpsTrackBasefile: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.FILENAME, new FilenameValidationRule(false)),
        gpsTrackSrc: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.GPSTRACK, new GpsTrackValidationRule(false)),

        keywords: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.WHAT_KEY_CSV, new KeywordValidationRule(false)),
        locHirarchie: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.TEXT, new HierarchyValidationRule(false)),
        locHirarchieIds: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID_CSV, new IdCsvValidationRule(false)),
        name: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(true)),
        persons: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.WHAT_KEY_CSV, new TextValidationRule(false)),
        playlists: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.WHAT_KEY_CSV, new TextValidationRule(false)),
        subtype: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(true)),
        type: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(true))
    };

    locId: number;
    locIdParent: number;
    routeId: number;
    trackId: number;
    tripId: number;
    newsId: number;
    imageId: number;

    blocked: number;
    dateshow: Date;
    datestart: Date;
    dateend: Date;
    descTxt: string;
    descMd: string;
    descHtml: string;
    geoDistance: number;
    geoLon: string;
    geoLat: string;
    geoLoc: string;
    gpsTrackSrc: string;
    gpsTrackBasefile: string;
    keywords: string;
    locHirarchie: string;
    locHirarchieIds: string;
    name: string;
    persons: string;
    playlists: string;
    subtype: string;
    type: string;

    toString() {
        return 'SDocRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  name: ' + this.name + ',\n' +
            '  type: ' + this.type + '' +
            '}';
    }

    toSerializableJsonObj(): {} {
        const record = {};
        const me: SDocRecord = this;
        for (const key in me) {
            record[key] = me[key];
        }
        record['sdocdatatech'] = this.get('sdocdatatech');
        record['sdocdatainfo'] = this.get('sdocdatainfo');
        record['sdocimages'] = this.get('sdocimages');
        record['sdocratepers'] = this.get('sdocratepers');
        record['sdocratetech'] = this.get('sdocratetech');

        return record;
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

        sanitizedValues.blocked = SDocRecord.sdocFields.blocked.validator.sanitize(values['blocked']) || undefined;
        sanitizedValues.dateshow = SDocRecord.sdocFields.dateshow.validator.sanitize(values['dateshow']) || undefined;
        sanitizedValues.datestart = SDocRecord.sdocFields.datestart.validator.sanitize(values['datestart']) || undefined;
        sanitizedValues.dateend = SDocRecord.sdocFields.dateend.validator.sanitize(values['dateend']) || undefined;
        sanitizedValues.descTxt = SDocRecord.sdocFields.descTxt.validator.sanitize(values['descTxt']) || undefined;
        sanitizedValues.descMd = SDocRecord.sdocFields.descMd.validator.sanitize(values['descMd']) || undefined;
        sanitizedValues.descHtml = SDocRecord.sdocFields.descHtml.validator.sanitize(values['descHtml']) || undefined;
        sanitizedValues.geoDistance = SDocRecord.sdocFields.geoDistance.validator.sanitize(values['geoDistance']) || undefined;
        sanitizedValues.geoLon = SDocRecord.sdocFields.geoLon.validator.sanitize(values['geoLon']) || undefined;
        sanitizedValues.geoLat = SDocRecord.sdocFields.geoLat.validator.sanitize(values['geoLat']) || undefined;
        sanitizedValues.geoLoc = SDocRecord.sdocFields.geoLoc.validator.sanitize(values['geoLoc']) || undefined;
        sanitizedValues.gpsTrackSrc = SDocRecord.sdocFields.gpsTrackSrc.validator.sanitize(values['gpsTrackSrc']) || undefined;
        sanitizedValues.gpsTrackBasefile = SDocRecord.sdocFields.gpsTrackBasefile.validator.sanitize(values['gpsTrackBasefile'])
            || undefined;
        sanitizedValues.keywords = SDocRecord.sdocFields.keywords.validator.sanitize(values['keywords']) || undefined;
        sanitizedValues.locHirarchie = SDocRecord.sdocFields.locHirarchie.validator.sanitize(values['locHirarchie']) || undefined;
        sanitizedValues.locHirarchieIds = SDocRecord.sdocFields.locHirarchieIds.validator.sanitize(values['locHirarchieIds']) || undefined;
        sanitizedValues.name = SDocRecord.sdocFields.name.validator.sanitize(values['name']) || undefined;
        sanitizedValues.persons = SDocRecord.sdocFields.persons.validator.sanitize(values['persons']) || undefined;
        sanitizedValues.playlists = SDocRecord.sdocFields.playlists.validator.sanitize(values['playlists']) || undefined;
        sanitizedValues.subtype = SDocRecord.sdocFields.subtype.validator.sanitize(values['subtype']) || undefined;
        sanitizedValues.type = SDocRecord.sdocFields.type.validator.sanitize(values['type']) || undefined;

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

        sanitizedValues.blocked = SDocRecord.sdocFields.blocked.validator.sanitize(sdoc.blocked) || undefined;
        sanitizedValues.dateshow = SDocRecord.sdocFields.dateshow.validator.sanitize(sdoc.dateshow) || undefined;
        sanitizedValues.datestart = SDocRecord.sdocFields.datestart.validator.sanitize(sdoc.datestart) || undefined;
        sanitizedValues.dateend = SDocRecord.sdocFields.dateend.validator.sanitize(sdoc.dateend) || undefined;
        sanitizedValues.descTxt = SDocRecord.sdocFields.descTxt.validator.sanitize(sdoc.descTxt) || undefined;
        sanitizedValues.descMd = SDocRecord.sdocFields.descMd.validator.sanitize(sdoc.descMd) || undefined;
        sanitizedValues.descHtml = SDocRecord.sdocFields.descHtml.validator.sanitize(sdoc.descHtml) || undefined;
        sanitizedValues.geoDistance = SDocRecord.sdocFields.geoDistance.validator.sanitize(sdoc.geoDistance) || undefined;
        sanitizedValues.geoLon = SDocRecord.sdocFields.geoLon.validator.sanitize(sdoc.geoLon) || undefined;
        sanitizedValues.geoLat = SDocRecord.sdocFields.geoLat.validator.sanitize(sdoc.geoLat) || undefined;
        sanitizedValues.geoLoc = SDocRecord.sdocFields.geoLoc.validator.sanitize(sdoc.geoLoc) || undefined;
        sanitizedValues.gpsTrackSrc = SDocRecord.sdocFields.gpsTrackSrc.validator.sanitize(sdoc.gpsTrackSrc) || undefined;
        sanitizedValues.gpsTrackBasefile = SDocRecord.sdocFields.gpsTrackBasefile.validator.sanitize(sdoc.gpsTrackBasefile) || undefined;
        sanitizedValues.keywords = SDocRecord.sdocFields.keywords.validator.sanitize(sdoc.keywords) || undefined;
        sanitizedValues.locHirarchie = SDocRecord.sdocFields.locHirarchie.validator.sanitize(sdoc.locHirarchie) || undefined;
        sanitizedValues.locHirarchieIds = SDocRecord.sdocFields.locHirarchieIds.validator.sanitize(sdoc.locHirarchieIds) || undefined;
        sanitizedValues.name = SDocRecord.sdocFields.name.validator.sanitize(sdoc.name) || undefined;
        sanitizedValues.persons = SDocRecord.sdocFields.persons.validator.sanitize(sdoc.persons) || undefined;
        sanitizedValues.playlists = SDocRecord.sdocFields.playlists.validator.sanitize(sdoc.playlists) || undefined;
        sanitizedValues.subtype = SDocRecord.sdocFields.subtype.validator.sanitize(sdoc.subtype) || undefined;
        sanitizedValues.type = SDocRecord.sdocFields.type.validator.sanitize(sdoc.type) || undefined;

        return new SDocRecord(sanitizedValues);
    }
}

export class SDocRecordValidator {
    static isValidValues(values: {}): boolean {
        return SDocRecordValidator.validateValues(values).length > 0;
    }

    static validateValues(values: {}): string[] {
        const errors = [];
        let state = true;
        state = !BaseEntityRecord.genericFields.id.validator.isValid(values['id']) ? errors.push('id') &&  false : true;

        state = !SDocRecord.sdocFields.locId.validator.isValid(values['locId']) ? errors.push('locId') &&  false : true;
        state = !SDocRecord.sdocFields.locIdParent.validator.isValid(values['locIdParent']) ? errors.push('locIdParent') &&  false : true;
        state = !SDocRecord.sdocFields.routeId.validator.isValid(values['routeId']) ? errors.push('routeId') &&  false : true;
        state = !SDocRecord.sdocFields.trackId.validator.isValid(values['trackId']) ? errors.push('trackId') &&  false : true;
        state = !SDocRecord.sdocFields.tripId.validator.isValid(values['tripId']) ? errors.push('tripId') &&  false : true;
        state = !SDocRecord.sdocFields.newsId.validator.isValid(values['newsId']) ? errors.push('newsId') &&  false : true;
        state = !SDocRecord.sdocFields.imageId.validator.isValid(values['imageId']) ? errors.push('imageId') &&  false : true;

        state = !SDocRecord.sdocFields.blocked.validator.isValid(values['blocked']) ? errors.push('blocked') &&  false : true;
        state = !SDocRecord.sdocFields.dateshow.validator.isValid(values['dateshow']) ? errors.push('dateshow') &&  false : true;
        state = !SDocRecord.sdocFields.datestart.validator.isValid(values['datestart']) ? errors.push('datestart') &&  false : true;
        state = !SDocRecord.sdocFields.dateend.validator.isValid(values['dateend']) ? errors.push('dateend') &&  false : true;
        state = !SDocRecord.sdocFields.descTxt.validator.isValid(values['descTxt']) ? errors.push('descTxt') &&  false : true;
        state = !SDocRecord.sdocFields.descMd.validator.isValid(values['descMd']) ? errors.push('descMd') &&  false : true;
        state = !SDocRecord.sdocFields.descHtml.validator.isValid(values['descHtml']) ? errors.push('descHtml') &&  false : true;
        state = !SDocRecord.sdocFields.geoDistance.validator.isValid(values['geoDistance']) ? errors.push('geoDistance') &&  false : true;
        state = !SDocRecord.sdocFields.geoLon.validator.isValid(values['geoLon']) ? errors.push('geoLon') &&  false : true;
        state = !SDocRecord.sdocFields.geoLat.validator.isValid(values['geoLat']) ? errors.push('geoLat') &&  false : true;
        state = !SDocRecord.sdocFields.geoLoc.validator.isValid(values['geoLoc']) ? errors.push('geoLoc') &&  false : true;
        state = !SDocRecord.sdocFields.gpsTrackSrc.validator.isValid(values['gpsTrackSrc']) ? errors.push('gpsTrackSrc') &&  false : true;
        state = !SDocRecord.sdocFields.gpsTrackBasefile.validator.isValid(values['gpsTrackBasefile'])
            ? errors.push('gpsTrackBasefile') && false : true;
        state = !SDocRecord.sdocFields.keywords.validator.isValid(values['keywords']) ? errors.push('keywords') &&  false : true;
        state = !SDocRecord.sdocFields.locHirarchie.validator.isValid(values['locHirarchie'])
            ? errors.push('locHirarchie') &&  false : true;
        state = !SDocRecord.sdocFields.locHirarchieIds.validator.isValid(values['locHirarchieIds'])
            ? errors.push('locHirarchieIds') && false : true;
        state = !SDocRecord.sdocFields.name.validator.isValid(values['name']) ? errors.push('name') &&  false : true;
        state = !SDocRecord.sdocFields.persons.validator.isValid(values['persons']) ? errors.push('persons') &&  false : true;
        state = !SDocRecord.sdocFields.playlists.validator.isValid(values['playlists']) ? errors.push('playlists') &&  false : true;
        state = !SDocRecord.sdocFields.subtype.validator.isValid(values['subtype']) ? errors.push('subtype') &&  false : true;
        state = !SDocRecord.sdocFields.type.validator.isValid(values['type']) ? errors.push('type') &&  false : true;

        return errors;
    }

    static isValid(sdoc: SDocRecord): boolean {
        return SDocRecordValidator.validate(sdoc).length > 0;
    }

    static validate(sdoc: SDocRecord): string[] {
        const errors = [];
        let state = BaseEntityRecord.genericFields.id.validator.isValid(sdoc.id) ? errors.push('id') && false : true;

        state = !SDocRecord.sdocFields.locId.validator.isValid(sdoc.locId) ? errors.push('locId') &&  false : true;
        state = !SDocRecord.sdocFields.locIdParent.validator.isValid(sdoc.locIdParent) ? errors.push('locIdParent') &&  false : true;
        state = !SDocRecord.sdocFields.routeId.validator.isValid(sdoc.routeId) ? errors.push('routeId') &&  false : true;
        state = !SDocRecord.sdocFields.trackId.validator.isValid(sdoc.trackId) ? errors.push('trackId') &&  false : true;
        state = !SDocRecord.sdocFields.tripId.validator.isValid(sdoc.tripId) ? errors.push('tripId') &&  false : true;
        state = !SDocRecord.sdocFields.newsId.validator.isValid(sdoc.newsId) ? errors.push('newsId') &&  false : true;
        state = !SDocRecord.sdocFields.imageId.validator.isValid(sdoc.imageId) ? errors.push('imageId') &&  false : true;

        state = !SDocRecord.sdocFields.blocked.validator.isValid(sdoc.blocked) ? errors.push('blocked') &&  false : true;
        state = !SDocRecord.sdocFields.dateshow.validator.isValid(sdoc.dateshow) ? errors.push('dateshow') &&  false : true;
        state = !SDocRecord.sdocFields.datestart.validator.isValid(sdoc.datestart) ? errors.push('datestart') &&  false : true;
        state = !SDocRecord.sdocFields.dateend.validator.isValid(sdoc.dateend) ? errors.push('dateend') &&  false : true;
        state = !SDocRecord.sdocFields.descTxt.validator.isValid(sdoc.descTxt) ? errors.push('descTxt') &&  false : true;
        state = !SDocRecord.sdocFields.descMd.validator.isValid(sdoc.descMd) ? errors.push('descMd') &&  false : true;
        state = !SDocRecord.sdocFields.descHtml.validator.isValid(sdoc.descHtml) ? errors.push('descHtml') &&  false : true;
        state = !SDocRecord.sdocFields.geoDistance.validator.isValid(sdoc.geoDistance) ? errors.push('geoDistance') &&  false : true;
        state = !SDocRecord.sdocFields.geoLon.validator.isValid(sdoc.geoLon) ? errors.push('geoLon') &&  false : true;
        state = !SDocRecord.sdocFields.geoLat.validator.isValid(sdoc.geoLat) ? errors.push('geoLat') &&  false : true;
        state = !SDocRecord.sdocFields.geoLoc.validator.isValid(sdoc.geoLoc) ? errors.push('geoLoc') &&  false : true;
        state = !SDocRecord.sdocFields.gpsTrackSrc.validator.isValid(sdoc.gpsTrackSrc) ? errors.push('gpsTrackSrc') &&  false : true;
        state = !SDocRecord.sdocFields.gpsTrackBasefile.validator.isValid(sdoc.gpsTrackBasefile)
            ? errors.push('gpsTrackBasefile') &&  false : true;
        state = !SDocRecord.sdocFields.keywords.validator.isValid(sdoc.keywords) ? errors.push('keywords') &&  false : true;
        state = !SDocRecord.sdocFields.locHirarchie.validator.isValid(sdoc.locHirarchie) ? errors.push('locHirarchie') &&  false : true;
        state = !SDocRecord.sdocFields.locHirarchieIds.validator.isValid(sdoc.locHirarchieIds)
            ? errors.push('locHirarchieIds') &&  false : true;
        state = !SDocRecord.sdocFields.name.validator.isValid(sdoc.name) ? errors.push('name') &&  false : true;
        state = !SDocRecord.sdocFields.persons.validator.isValid(sdoc.persons) ? errors.push('persons') &&  false : true;
        state = !SDocRecord.sdocFields.playlists.validator.isValid(sdoc.playlists) ? errors.push('playlists') &&  false : true;
        state = !SDocRecord.sdocFields.subtype.validator.isValid(sdoc.subtype) ? errors.push('subtype') &&  false : true;
        state = !SDocRecord.sdocFields.type.validator.isValid(sdoc.type) ? errors.push('type') &&  false : true;

        return errors;
    }
}
