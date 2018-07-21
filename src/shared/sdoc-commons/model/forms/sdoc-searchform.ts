import {GenericSearchForm, GenericSearchFormFieldConfig} from '../../../search-commons/model/forms/generic-searchform';
import {
    GenericValidatorDatatypes,
    IdCsvValidationRule,
    KeyParamsValidationRule,
    NearbyParamValidationRule,
    TextValidationRule
} from '../../../search-commons/model/forms/generic-validator.util';
import {CommonDocSearchForm, CommonDocSearchFormValidator} from '../../../search-commons/model/forms/cdoc-searchform';

export class SDocSearchForm extends CommonDocSearchForm {
    static sdocFields = {
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
        return 'SDocSearchForm {\n' +
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

export class SDocSearchFormFactory {
    static createSanitized(values: {}): SDocSearchForm {
        const sanitizedValues: any = {};
        sanitizedValues.fulltext = GenericSearchForm.genericFields.fulltext.validator.sanitize(values['fulltext']) || '';
        sanitizedValues.sort = GenericSearchForm.genericFields.sort.validator.sanitize(values['sort']) || '';
        sanitizedValues.perPage = GenericSearchForm.genericFields.perPage.validator.sanitize(values['perPage']) || 10;
        sanitizedValues.pageNum = GenericSearchForm.genericFields.pageNum.validator.sanitize(values['pageNum']) || 1;
        sanitizedValues.when = CommonDocSearchForm.cdocFields.when.validator.sanitize(values['when']) || '';
        sanitizedValues.where = SDocSearchForm.sdocFields.where.validator.sanitize(values['where']) || '';
        sanitizedValues.locId = SDocSearchForm.sdocFields.locId.validator.sanitize(values['locId']) || '';
        sanitizedValues.nearby = SDocSearchForm.sdocFields.nearby.validator.sanitize(values['nearby']) || '';
        sanitizedValues.nearbyAddress = SDocSearchForm.sdocFields.nearbyAddress.validator.sanitize(values['nearbyAddress']) || '';
        sanitizedValues.what = CommonDocSearchForm.cdocFields.what.validator.sanitize(values['what']) || '';
        sanitizedValues.moreFilter = CommonDocSearchForm.cdocFields.moreFilter.validator.sanitize(values['moreFilter']) || '';
        sanitizedValues.theme = CommonDocSearchForm.cdocFields.theme.validator.sanitize(values['theme']) || '';
        sanitizedValues.techDataAltitudeMax =
            SDocSearchForm.sdocFields.techDataAltitudeMax.validator.sanitize(values['techDataAltitudeMax']) || '';
        sanitizedValues.techDataAscent = SDocSearchForm.sdocFields.techDataAscent.validator.sanitize(values['techDataAscent']) || '';
        sanitizedValues.techDataDistance = SDocSearchForm.sdocFields.techDataDistance.validator.sanitize(values['techDataDistance']) || '';
        sanitizedValues.techDataDuration = SDocSearchForm.sdocFields.techDataDuration.validator.sanitize(values['techDataDuration']) || '';
        sanitizedValues.techRateOverall = SDocSearchForm.sdocFields.techRateOverall.validator.sanitize(values['techRateOverall']) || '';
        sanitizedValues.personalRateOverall = SDocSearchForm.sdocFields.personalRateOverall.validator.sanitize(
            values['personalRateOverall']) || '';
        sanitizedValues.personalRateDifficulty = SDocSearchForm.sdocFields.personalRateDifficulty.validator.sanitize(
            values['personalRateDifficulty']) || '';
        sanitizedValues.actiontype = SDocSearchForm.sdocFields.actiontype.validator.sanitize(values['actiontype']) || '';
        sanitizedValues.persons = SDocSearchForm.sdocFields.persons.validator.sanitize(values['persons']) || '';
        sanitizedValues.playlists = CommonDocSearchForm.cdocFields.playlists.validator.sanitize(values['playlists']) || '';
        sanitizedValues.type = CommonDocSearchForm.cdocFields.type.validator.sanitize(values['type']) || '';

        return new SDocSearchForm(sanitizedValues);
    }

    static cloneSanitized(searchForm: SDocSearchForm): SDocSearchForm {
        const sanitizedValues: any = {};
        sanitizedValues.fulltext = GenericSearchForm.genericFields.fulltext.validator.sanitize(searchForm.fulltext) || '';
        sanitizedValues.sort = GenericSearchForm.genericFields.sort.validator.sanitize(searchForm.sort) || '';
        sanitizedValues.perPage = GenericSearchForm.genericFields.perPage.validator.sanitize(searchForm.perPage) || 10;
        sanitizedValues.pageNum = GenericSearchForm.genericFields.pageNum.validator.sanitize(searchForm.pageNum) || 1;
        sanitizedValues.when = CommonDocSearchForm.cdocFields.when.validator.sanitize(searchForm.when) || '';
        sanitizedValues.where = SDocSearchForm.sdocFields.where.validator.sanitize(searchForm.where) || '';
        sanitizedValues.locId = SDocSearchForm.sdocFields.locId.validator.sanitize(searchForm.locId) || '';
        sanitizedValues.nearby = SDocSearchForm.sdocFields.nearby.validator.sanitize(searchForm.nearby) || '';
        sanitizedValues.nearbyAddress = SDocSearchForm.sdocFields.nearbyAddress.validator.sanitize(searchForm.nearbyAddress) || '';
        sanitizedValues.what = CommonDocSearchForm.cdocFields.what.validator.sanitize(searchForm.what) || '';
        sanitizedValues.moreFilter = CommonDocSearchForm.cdocFields.moreFilter.validator.sanitize(searchForm.moreFilter) || '';
        sanitizedValues.theme = CommonDocSearchForm.cdocFields.theme.validator.sanitize(searchForm.theme) || '';
        sanitizedValues.techDataAltitudeMax =
            SDocSearchForm.sdocFields.techDataAltitudeMax.validator.sanitize(searchForm.techDataAltitudeMax) || '';
        sanitizedValues.techDataAscent = SDocSearchForm.sdocFields.techDataAscent.validator.sanitize(searchForm.techDataAscent) || '';
        sanitizedValues.techDataDistance = SDocSearchForm.sdocFields.techDataDistance.validator.sanitize(searchForm.techDataDistance) || '';
        sanitizedValues.techDataDuration = SDocSearchForm.sdocFields.techDataDuration.validator.sanitize(searchForm.techDataDuration) || '';
        sanitizedValues.techRateOverall = SDocSearchForm.sdocFields.techRateOverall.validator.sanitize(searchForm.techRateOverall) || '';
        sanitizedValues.personalRateOverall = SDocSearchForm.sdocFields.personalRateOverall.validator.sanitize(
            searchForm.personalRateOverall) || '';
        sanitizedValues.personalRateDifficulty = SDocSearchForm.sdocFields.personalRateDifficulty.validator.sanitize(
            searchForm.personalRateDifficulty) || '';
        sanitizedValues.actiontype = SDocSearchForm.sdocFields.actiontype.validator.sanitize(searchForm.actiontype) || '';
        sanitizedValues.persons = SDocSearchForm.sdocFields.persons.validator.sanitize(searchForm.persons) || '';
        sanitizedValues.playlists = CommonDocSearchForm.cdocFields.playlists.validator.sanitize(searchForm.playlists) || '';
        sanitizedValues.type = CommonDocSearchForm.cdocFields.type.validator.sanitize(searchForm.type) || '';

        return new SDocSearchForm(sanitizedValues);
    }
}

export class SDocSearchFormValidator {
    static isValidValues(values: {}): boolean {
        let state = CommonDocSearchFormValidator.isValidValues(values);
        state = state && SDocSearchForm.sdocFields.where.validator.isValid(values['where']);
        state = state && SDocSearchForm.sdocFields.locId.validator.isValid(values['locId']);
        state = state && SDocSearchForm.sdocFields.nearby.validator.isValid(values['nearby']);
        state = state && SDocSearchForm.sdocFields.nearbyAddress.validator.isValid(values['nearbyAddress']);
        state = state && SDocSearchForm.sdocFields.techDataAltitudeMax.validator.isValid(values['techDataAltitudeMax']);
        state = state && SDocSearchForm.sdocFields.techDataAscent.validator.isValid(values['techDataAscent']);
        state = state && SDocSearchForm.sdocFields.techDataDistance.validator.isValid(values['techDataDistance']);
        state = state && SDocSearchForm.sdocFields.techDataDuration.validator.isValid(values['techDataDuration']);
        state = state && SDocSearchForm.sdocFields.techRateOverall.validator.isValid(values['techRateOverall']);
        state = state && SDocSearchForm.sdocFields.personalRateOverall.validator.isValid(values['personalRateOverall']);
        state = state && SDocSearchForm.sdocFields.personalRateDifficulty.validator.isValid(values['personalRateDifficulty']);
        state = state && SDocSearchForm.sdocFields.actiontype.validator.isValid(values['actiontype']);
        state = state && SDocSearchForm.sdocFields.persons.validator.isValid(values['persons']);

        return state;
    }

    static isValid(searchForm: SDocSearchForm): boolean {
        let state = CommonDocSearchFormValidator.isValid(searchForm);
        state = state && SDocSearchForm.sdocFields.where.validator.isValid(searchForm.where);
        state = state && SDocSearchForm.sdocFields.locId.validator.isValid(searchForm.locId);
        state = state && SDocSearchForm.sdocFields.nearby.validator.isValid(searchForm.nearby);
        state = state && SDocSearchForm.sdocFields.nearbyAddress.validator.isValid(searchForm.nearbyAddress);
        state = state && SDocSearchForm.sdocFields.persons.validator.isValid(searchForm.persons);
        state = state && SDocSearchForm.sdocFields.techDataAltitudeMax.validator.isValid(searchForm.techDataAltitudeMax);
        state = state && SDocSearchForm.sdocFields.techDataAscent.validator.isValid(searchForm.techDataAscent);
        state = state && SDocSearchForm.sdocFields.techDataDistance.validator.isValid(searchForm.techDataDistance);
        state = state && SDocSearchForm.sdocFields.techDataDuration.validator.isValid(searchForm.techDataDuration);
        state = state && SDocSearchForm.sdocFields.techRateOverall.validator.isValid(searchForm.techRateOverall);
        state = state && SDocSearchForm.sdocFields.personalRateOverall.validator.isValid(searchForm.personalRateOverall);
        state = state && SDocSearchForm.sdocFields.personalRateDifficulty.validator.isValid(searchForm.personalRateDifficulty);
        state = state && SDocSearchForm.sdocFields.actiontype.validator.isValid(searchForm.actiontype);

        return state;
    }
}
