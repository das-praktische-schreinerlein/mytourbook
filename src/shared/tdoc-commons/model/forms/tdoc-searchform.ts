import {GenericSearchForm, GenericSearchFormFieldConfig} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-searchform';
import {
    GenericValidatorDatatypes,
    IdCsvValidationRule,
    KeyParamsValidationRule,
    NearbyParamValidationRule,
    TextValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {CommonDocSearchForm, CommonDocSearchFormValidator} from '@dps/mycms-commons/dist/search-commons/model/forms/cdoc-searchform';

export class TourDocSearchForm extends CommonDocSearchForm {
    static tdocFields = {
        where: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.LOCATION_KEY_CSV, new KeyParamsValidationRule(false)),
        locId: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new IdCsvValidationRule(false)),
        nearby: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.NEARBY, new NearbyParamValidationRule(false)),
        nearbyAddress: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ADDRESS, new TextValidationRule(false)),
        techDataAscent: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new IdCsvValidationRule(false)),
        techDataAltitudeMax: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new IdCsvValidationRule(false)),
        techDataDistance: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new IdCsvValidationRule(false)),
        techDataDuration: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new IdCsvValidationRule(false)),
        techRateOverall: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new TextValidationRule(false)),
        personalRateOverall: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new TextValidationRule(false)),
        personalRateDifficulty: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new TextValidationRule(false)),
        actiontype: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new IdCsvValidationRule(false)),
        persons: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.WHAT_KEY_CSV, new TextValidationRule(false)),
    };

    where: string;
    locId: string;
    nearby: string;
    nearbyAddress: string;
    techDataAscent: string;
    techDataAltitudeMax: string;
    techDataDistance: string;
    techDataDuration: string;
    techRateOverall: string;
    personalRateOverall: string;
    personalRateDifficulty: string;
    actiontype: string;
    persons: string;

    constructor(values: {}) {
        super(values);
        this.where = values['where'] || '';
        this.locId = values['locId'] || '';
        this.nearby = values['nearby'] || '';
        this.nearbyAddress = values['nearbyAddress'] || '';
        this.techDataAscent = values['techDataAscent'] || '';
        this.techDataAltitudeMax = values['techDataAltitudeMax'] || '';
        this.techDataDistance = values['techDataDistance'] || '';
        this.techDataDuration = values['techDataDuration'] || '';
        this.techRateOverall = values['techRateOverall'] || '';
        this.personalRateOverall = values['personalRateOverall'] || '';
        this.personalRateDifficulty = values['personalRateDifficulty'] || '';
        this.actiontype = values['actiontype'] || '';
        this.persons = values['persons'] || '';
    }

    toString() {
        return 'TourDocSearchForm {\n' +
            '  when: ' + this.when + '\n' +
            '  where: ' + this.where + '\n' +
            '  locId: ' + this.locId + '\n' +
            '  nearby: ' + this.nearby + '\n' +
            '  nearbyAddress: ' + this.nearbyAddress + '\n' +
            '  what: ' + this.what + '\n' +
            '  fulltext: ' + this.fulltext + '\n' +
            '  actiontype: ' + this.actiontype + '\n' +
            '  type: ' + this.type + '\n' +
            '  sort: ' + this.sort + '\n' +
            '  perPage: ' + this.perPage + '\n' +
            '  pageNum: ' + this.pageNum + '' +
            '}';
    }
}

export class TourDocSearchFormFactory {
    static createSanitized(values: {}): TourDocSearchForm {
        const sanitizedValues: any = {};
        sanitizedValues.fulltext = GenericSearchForm.genericFields.fulltext.validator.sanitize(values['fulltext']) || '';
        sanitizedValues.sort = GenericSearchForm.genericFields.sort.validator.sanitize(values['sort']) || '';
        sanitizedValues.perPage = GenericSearchForm.genericFields.perPage.validator.sanitize(values['perPage']) || 10;
        sanitizedValues.pageNum = GenericSearchForm.genericFields.pageNum.validator.sanitize(values['pageNum']) || 1;
        sanitizedValues.when = CommonDocSearchForm.cdocFields.when.validator.sanitize(values['when']) || '';
        sanitizedValues.where = TourDocSearchForm.tdocFields.where.validator.sanitize(values['where']) || '';
        sanitizedValues.locId = TourDocSearchForm.tdocFields.locId.validator.sanitize(values['locId']) || '';
        sanitizedValues.nearby = TourDocSearchForm.tdocFields.nearby.validator.sanitize(values['nearby']) || '';
        sanitizedValues.nearbyAddress = TourDocSearchForm.tdocFields.nearbyAddress.validator.sanitize(values['nearbyAddress']) || '';
        sanitizedValues.what = CommonDocSearchForm.cdocFields.what.validator.sanitize(values['what']) || '';
        sanitizedValues.moreFilter = CommonDocSearchForm.cdocFields.moreFilter.validator.sanitize(values['moreFilter']) || '';
        sanitizedValues.theme = CommonDocSearchForm.cdocFields.theme.validator.sanitize(values['theme']) || '';
        sanitizedValues.techDataAltitudeMax =
            TourDocSearchForm.tdocFields.techDataAltitudeMax.validator.sanitize(values['techDataAltitudeMax']) || '';
        sanitizedValues.techDataAscent = TourDocSearchForm.tdocFields.techDataAscent.validator.sanitize(values['techDataAscent']) || '';
        sanitizedValues.techDataDistance = TourDocSearchForm.tdocFields.techDataDistance.validator.sanitize(values['techDataDistance']) || '';
        sanitizedValues.techDataDuration = TourDocSearchForm.tdocFields.techDataDuration.validator.sanitize(values['techDataDuration']) || '';
        sanitizedValues.techRateOverall = TourDocSearchForm.tdocFields.techRateOverall.validator.sanitize(values['techRateOverall']) || '';
        sanitizedValues.personalRateOverall = TourDocSearchForm.tdocFields.personalRateOverall.validator.sanitize(
            values['personalRateOverall']) || '';
        sanitizedValues.personalRateDifficulty = TourDocSearchForm.tdocFields.personalRateDifficulty.validator.sanitize(
            values['personalRateDifficulty']) || '';
        sanitizedValues.actiontype = TourDocSearchForm.tdocFields.actiontype.validator.sanitize(values['actiontype']) || '';
        sanitizedValues.persons = TourDocSearchForm.tdocFields.persons.validator.sanitize(values['persons']) || '';
        sanitizedValues.playlists = CommonDocSearchForm.cdocFields.playlists.validator.sanitize(values['playlists']) || '';
        sanitizedValues.type = CommonDocSearchForm.cdocFields.type.validator.sanitize(values['type']) || '';

        return new TourDocSearchForm(sanitizedValues);
    }

    static cloneSanitized(searchForm: TourDocSearchForm): TourDocSearchForm {
        const sanitizedValues: any = {};
        sanitizedValues.fulltext = GenericSearchForm.genericFields.fulltext.validator.sanitize(searchForm.fulltext) || '';
        sanitizedValues.sort = GenericSearchForm.genericFields.sort.validator.sanitize(searchForm.sort) || '';
        sanitizedValues.perPage = GenericSearchForm.genericFields.perPage.validator.sanitize(searchForm.perPage) || 10;
        sanitizedValues.pageNum = GenericSearchForm.genericFields.pageNum.validator.sanitize(searchForm.pageNum) || 1;
        sanitizedValues.when = CommonDocSearchForm.cdocFields.when.validator.sanitize(searchForm.when) || '';
        sanitizedValues.where = TourDocSearchForm.tdocFields.where.validator.sanitize(searchForm.where) || '';
        sanitizedValues.locId = TourDocSearchForm.tdocFields.locId.validator.sanitize(searchForm.locId) || '';
        sanitizedValues.nearby = TourDocSearchForm.tdocFields.nearby.validator.sanitize(searchForm.nearby) || '';
        sanitizedValues.nearbyAddress = TourDocSearchForm.tdocFields.nearbyAddress.validator.sanitize(searchForm.nearbyAddress) || '';
        sanitizedValues.what = CommonDocSearchForm.cdocFields.what.validator.sanitize(searchForm.what) || '';
        sanitizedValues.moreFilter = CommonDocSearchForm.cdocFields.moreFilter.validator.sanitize(searchForm.moreFilter) || '';
        sanitizedValues.theme = CommonDocSearchForm.cdocFields.theme.validator.sanitize(searchForm.theme) || '';
        sanitizedValues.techDataAltitudeMax =
            TourDocSearchForm.tdocFields.techDataAltitudeMax.validator.sanitize(searchForm.techDataAltitudeMax) || '';
        sanitizedValues.techDataAscent = TourDocSearchForm.tdocFields.techDataAscent.validator.sanitize(searchForm.techDataAscent) || '';
        sanitizedValues.techDataDistance = TourDocSearchForm.tdocFields.techDataDistance.validator.sanitize(searchForm.techDataDistance) || '';
        sanitizedValues.techDataDuration = TourDocSearchForm.tdocFields.techDataDuration.validator.sanitize(searchForm.techDataDuration) || '';
        sanitizedValues.techRateOverall = TourDocSearchForm.tdocFields.techRateOverall.validator.sanitize(searchForm.techRateOverall) || '';
        sanitizedValues.personalRateOverall = TourDocSearchForm.tdocFields.personalRateOverall.validator.sanitize(
            searchForm.personalRateOverall) || '';
        sanitizedValues.personalRateDifficulty = TourDocSearchForm.tdocFields.personalRateDifficulty.validator.sanitize(
            searchForm.personalRateDifficulty) || '';
        sanitizedValues.actiontype = TourDocSearchForm.tdocFields.actiontype.validator.sanitize(searchForm.actiontype) || '';
        sanitizedValues.persons = TourDocSearchForm.tdocFields.persons.validator.sanitize(searchForm.persons) || '';
        sanitizedValues.playlists = CommonDocSearchForm.cdocFields.playlists.validator.sanitize(searchForm.playlists) || '';
        sanitizedValues.type = CommonDocSearchForm.cdocFields.type.validator.sanitize(searchForm.type) || '';

        return new TourDocSearchForm(sanitizedValues);
    }
}

export class TourDocSearchFormValidator {
    static isValidValues(values: {}): boolean {
        let state = CommonDocSearchFormValidator.isValidValues(values);
        state = state && TourDocSearchForm.tdocFields.where.validator.isValid(values['where']);
        state = state && TourDocSearchForm.tdocFields.locId.validator.isValid(values['locId']);
        state = state && TourDocSearchForm.tdocFields.nearby.validator.isValid(values['nearby']);
        state = state && TourDocSearchForm.tdocFields.nearbyAddress.validator.isValid(values['nearbyAddress']);
        state = state && TourDocSearchForm.tdocFields.techDataAltitudeMax.validator.isValid(values['techDataAltitudeMax']);
        state = state && TourDocSearchForm.tdocFields.techDataAscent.validator.isValid(values['techDataAscent']);
        state = state && TourDocSearchForm.tdocFields.techDataDistance.validator.isValid(values['techDataDistance']);
        state = state && TourDocSearchForm.tdocFields.techDataDuration.validator.isValid(values['techDataDuration']);
        state = state && TourDocSearchForm.tdocFields.techRateOverall.validator.isValid(values['techRateOverall']);
        state = state && TourDocSearchForm.tdocFields.personalRateOverall.validator.isValid(values['personalRateOverall']);
        state = state && TourDocSearchForm.tdocFields.personalRateDifficulty.validator.isValid(values['personalRateDifficulty']);
        state = state && TourDocSearchForm.tdocFields.actiontype.validator.isValid(values['actiontype']);
        state = state && TourDocSearchForm.tdocFields.persons.validator.isValid(values['persons']);

        return state;
    }

    static isValid(searchForm: TourDocSearchForm): boolean {
        let state = CommonDocSearchFormValidator.isValid(searchForm);
        state = state && TourDocSearchForm.tdocFields.where.validator.isValid(searchForm.where);
        state = state && TourDocSearchForm.tdocFields.locId.validator.isValid(searchForm.locId);
        state = state && TourDocSearchForm.tdocFields.nearby.validator.isValid(searchForm.nearby);
        state = state && TourDocSearchForm.tdocFields.nearbyAddress.validator.isValid(searchForm.nearbyAddress);
        state = state && TourDocSearchForm.tdocFields.persons.validator.isValid(searchForm.persons);
        state = state && TourDocSearchForm.tdocFields.techDataAltitudeMax.validator.isValid(searchForm.techDataAltitudeMax);
        state = state && TourDocSearchForm.tdocFields.techDataAscent.validator.isValid(searchForm.techDataAscent);
        state = state && TourDocSearchForm.tdocFields.techDataDistance.validator.isValid(searchForm.techDataDistance);
        state = state && TourDocSearchForm.tdocFields.techDataDuration.validator.isValid(searchForm.techDataDuration);
        state = state && TourDocSearchForm.tdocFields.techRateOverall.validator.isValid(searchForm.techRateOverall);
        state = state && TourDocSearchForm.tdocFields.personalRateOverall.validator.isValid(searchForm.personalRateOverall);
        state = state && TourDocSearchForm.tdocFields.personalRateDifficulty.validator.isValid(searchForm.personalRateDifficulty);
        state = state && TourDocSearchForm.tdocFields.actiontype.validator.isValid(searchForm.actiontype);

        return state;
    }
}
