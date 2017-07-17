import {GenericSearchForm, GenericSearchFormFieldConfig} from '../../../search-commons/model/forms/generic-searchform';
import {
    GenericValidatorDatatypes,
    IdCsvValidationRule,
    IdValidationRule,
    KeyParamsValidationRule,
    NearbyParamValidationRule,
    NumberValidationRule,
    TextValidationRule
} from '../../../search-commons/model/forms/generic-validator.util';

export class SDocSearchForm extends GenericSearchForm {
    static sdocFields = {
        when: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.WHEN_KEY_CSV, new KeyParamsValidationRule(false)),
        where: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.LOCATION_KEY_CSV, new KeyParamsValidationRule(false)),
        locId: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new IdCsvValidationRule(false)),
        nearby: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.NEARBY, new NearbyParamValidationRule(false)),
        nearbyAddress: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ADDRESS, new TextValidationRule(false)),
        what: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.WHAT_KEY_CSV, new IdCsvValidationRule(false)),
        moreFilter: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.FILTER_LIST, new KeyParamsValidationRule(false)),
        theme: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(false)),
        techDataAscent: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new IdCsvValidationRule(false)),
        techDataAltitudeMax: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new IdCsvValidationRule(false)),
        techDataDistance: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new IdCsvValidationRule(false)),
        techDataDuration: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new IdCsvValidationRule(false)),
        techRateOverall: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new TextValidationRule(false)),
        type: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new IdCsvValidationRule(false))
    };

    when: string;
    where: string;
    locId: string;
    nearby: string;
    nearbyAddress: string;
    what: string;
    moreFilter: string;
    theme: string;
    techDataAscent: string;
    techDataAltitudeMax: string;
    techDataDistance: string;
    techDataDuration: string;
    techRateOverall: string;
    type: string;

    constructor(values: {}) {
        super(values);
        this.when = values['when'] || '';
        this.where = values['where'] || '';
        this.locId = values['locId'] || '';
        this.nearby = values['nearby'] || '';
        this.nearbyAddress = values['nearbyAddress'] || '';
        this.what = values['what'] || '';
        this.moreFilter = values['moreFilter'] || '';
        this.theme = values['theme'] || '';
        this.techDataAscent = values['techDataAscent'] || '';
        this.techDataAltitudeMax = values['techDataAltitudeMax'] || '';
        this.techDataDistance = values['techDataDistance'] || '';
        this.techDataDuration = values['techDataDuration'] || '';
        this.techRateOverall = values['techRateOverall'] || '';
        this.type = values['type'] || '';
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
        sanitizedValues.when = SDocSearchForm.sdocFields.when.validator.sanitize(values['when']) || '';
        sanitizedValues.where = SDocSearchForm.sdocFields.where.validator.sanitize(values['where']) || '';
        sanitizedValues.locId = SDocSearchForm.sdocFields.locId.validator.sanitize(values['locId']) || '';
        sanitizedValues.nearby = SDocSearchForm.sdocFields.nearby.validator.sanitize(values['nearby']) || '';
        sanitizedValues.nearbyAddress = SDocSearchForm.sdocFields.nearbyAddress.validator.sanitize(values['nearbyAddress']) || '';
        sanitizedValues.what = SDocSearchForm.sdocFields.what.validator.sanitize(values['what']) || '';
        sanitizedValues.moreFilter = SDocSearchForm.sdocFields.moreFilter.validator.sanitize(values['moreFilter']) || '';
        sanitizedValues.theme = SDocSearchForm.sdocFields.theme.validator.sanitize(values['theme']) || '';
        sanitizedValues.techDataAltitudeMax = SDocSearchForm.sdocFields.techDataAltitudeMax.validator.sanitize(values['techDataAltitudeMax']) || '';
        sanitizedValues.techDataAscent = SDocSearchForm.sdocFields.techDataAscent.validator.sanitize(values['techDataAscent']) || '';
        sanitizedValues.techDataDistance = SDocSearchForm.sdocFields.techDataDistance.validator.sanitize(values['techDataDistance']) || '';
        sanitizedValues.techDataDuration = SDocSearchForm.sdocFields.techDataDuration.validator.sanitize(values['techDataDuration']) || '';
        sanitizedValues.techRateOverall = SDocSearchForm.sdocFields.techRateOverall.validator.sanitize(values['techRateOverall']) || '';
        sanitizedValues.type = SDocSearchForm.sdocFields.type.validator.sanitize(values['type']) || '';

        return new SDocSearchForm(sanitizedValues);
    }

    static cloneSanitized(searchForm: SDocSearchForm): SDocSearchForm {
        const sanitizedValues: any = {};
        sanitizedValues.fulltext = GenericSearchForm.genericFields.fulltext.validator.sanitize(searchForm.fulltext) || '';
        sanitizedValues.sort = GenericSearchForm.genericFields.sort.validator.sanitize(searchForm.sort) || '';
        sanitizedValues.perPage = GenericSearchForm.genericFields.perPage.validator.sanitize(searchForm.perPage) || 10;
        sanitizedValues.pageNum = GenericSearchForm.genericFields.pageNum.validator.sanitize(searchForm.pageNum) || 1;
        sanitizedValues.when = SDocSearchForm.sdocFields.when.validator.sanitize(searchForm.when) || '';
        sanitizedValues.where = SDocSearchForm.sdocFields.where.validator.sanitize(searchForm.where) || '';
        sanitizedValues.locId = SDocSearchForm.sdocFields.locId.validator.sanitize(searchForm.locId) || '';
        sanitizedValues.nearby = SDocSearchForm.sdocFields.nearby.validator.sanitize(searchForm.nearby) || '';
        sanitizedValues.nearbyAddress = SDocSearchForm.sdocFields.nearbyAddress.validator.sanitize(searchForm.nearbyAddress) || '';
        sanitizedValues.what = SDocSearchForm.sdocFields.what.validator.sanitize(searchForm.what) || '';
        sanitizedValues.moreFilter = SDocSearchForm.sdocFields.moreFilter.validator.sanitize(searchForm.moreFilter) || '';
        sanitizedValues.theme = SDocSearchForm.sdocFields.theme.validator.sanitize(searchForm.theme) || '';
        sanitizedValues.techDataAltitudeMax = SDocSearchForm.sdocFields.techDataAltitudeMax.validator.sanitize(searchForm.techDataAltitudeMax) || '';
        sanitizedValues.techDataAscent = SDocSearchForm.sdocFields.techDataAscent.validator.sanitize(searchForm.techDataAscent) || '';
        sanitizedValues.techDataDistance = SDocSearchForm.sdocFields.techDataDistance.validator.sanitize(searchForm.techDataDistance) || '';
        sanitizedValues.techDataDuration = SDocSearchForm.sdocFields.techDataDuration.validator.sanitize(searchForm.techDataDuration) || '';
        sanitizedValues.techRateOverall = SDocSearchForm.sdocFields.techRateOverall.validator.sanitize(searchForm.techRateOverall) || '';
        sanitizedValues.type = SDocSearchForm.sdocFields.type.validator.sanitize(searchForm.type) || '';

        return new SDocSearchForm(sanitizedValues);
    }
}

export class SDocSearchFormValidator {
    static isValidValues(values: {}): boolean {
        let state = true;
        state = state && GenericSearchForm.genericFields.fulltext.validator.isValid(values['fulltext']);
        state = state && GenericSearchForm.genericFields.sort.validator.isValid(values['sort']);
        state = state && GenericSearchForm.genericFields.perPage.validator.isValid(values['perPage']);
        state = state && GenericSearchForm.genericFields.pageNum.validator.isValid(values['pageNum']);
        state = state && SDocSearchForm.sdocFields.when.validator.isValid(values['when']);
        state = state && SDocSearchForm.sdocFields.where.validator.isValid(values['where']);
        state = state && SDocSearchForm.sdocFields.locId.validator.isValid(values['locId']);
        state = state && SDocSearchForm.sdocFields.nearby.validator.isValid(values['nearby']);
        state = state && SDocSearchForm.sdocFields.nearbyAddress.validator.isValid(values['nearbyAddress']);
        state = state && SDocSearchForm.sdocFields.what.validator.isValid(values['what']);
        state = state && SDocSearchForm.sdocFields.moreFilter.validator.isValid(values['moreFilter']);
        state = state && SDocSearchForm.sdocFields.theme.validator.isValid(values['theme']);
        state = state && SDocSearchForm.sdocFields.techDataAltitudeMax.validator.isValid(values['techDataAltitudeMax']);
        state = state && SDocSearchForm.sdocFields.techDataAscent.validator.isValid(values['techDataAscent']);
        state = state && SDocSearchForm.sdocFields.techDataDistance.validator.isValid(values['techDataDistance']);
        state = state && SDocSearchForm.sdocFields.techDataDuration.validator.isValid(values['techDataDuration']);
        state = state && SDocSearchForm.sdocFields.techRateOverall.validator.isValid(values['techRateOverall']);
        state = state && SDocSearchForm.sdocFields.type.validator.isValid(values['type']);

        return state;
    }

    static isValid(searchForm: SDocSearchForm): boolean {
        let state = true;
        state = state && GenericSearchForm.genericFields.fulltext.validator.isValid(searchForm.fulltext);
        state = state && GenericSearchForm.genericFields.sort.validator.isValid(searchForm.sort);
        state = state && GenericSearchForm.genericFields.perPage.validator.isValid(searchForm.perPage);
        state = state && GenericSearchForm.genericFields.pageNum.validator.isValid(searchForm.pageNum);
        state = state && SDocSearchForm.sdocFields.when.validator.isValid(searchForm.when);
        state = state && SDocSearchForm.sdocFields.where.validator.isValid(searchForm.where);
        state = state && SDocSearchForm.sdocFields.locId.validator.isValid(searchForm.locId);
        state = state && SDocSearchForm.sdocFields.nearby.validator.isValid(searchForm.nearby);
        state = state && SDocSearchForm.sdocFields.nearbyAddress.validator.isValid(searchForm.nearbyAddress);
        state = state && SDocSearchForm.sdocFields.what.validator.isValid(searchForm.what);
        state = state && SDocSearchForm.sdocFields.moreFilter.validator.isValid(searchForm.moreFilter);
        state = state && SDocSearchForm.sdocFields.theme.validator.isValid(searchForm.theme);
        state = state && SDocSearchForm.sdocFields.techDataAltitudeMax.validator.isValid(searchForm.techDataAltitudeMax);
        state = state && SDocSearchForm.sdocFields.techDataAscent.validator.isValid(searchForm.techDataAscent);
        state = state && SDocSearchForm.sdocFields.techDataDistance.validator.isValid(searchForm.techDataDistance);
        state = state && SDocSearchForm.sdocFields.techDataDuration.validator.isValid(searchForm.techDataDuration);
        state = state && SDocSearchForm.sdocFields.techRateOverall.validator.isValid(searchForm.techRateOverall);
        state = state && SDocSearchForm.sdocFields.type.validator.isValid(searchForm.type);

        return state;
    }
}
