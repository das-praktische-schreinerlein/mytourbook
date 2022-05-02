import {GenericSearchFormFieldConfig} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-searchform';
import {
    GenericValidatorDatatypes,
    IdCsvValidationRule,
    KeyParamsValidationRule,
    NameValidationRule,
    NearbyParamValidationRule,
    TextValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {
    CommonDocSearchForm,
    CommonDocSearchFormFactory,
    CommonDocSearchFormValidator
} from '@dps/mycms-commons/dist/search-commons/model/forms/cdoc-searchform';

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
        techDataSections: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.NAME, new TextValidationRule(false)),
        techRateOverall: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new TextValidationRule(false)),
        personalRateOverall: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new TextValidationRule(false)),
        personalRateDifficulty: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new TextValidationRule(false)),
        actiontype: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new IdCsvValidationRule(false)),
        objectDetectionCategory: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.WHAT_KEY_CSV, new TextValidationRule(false)),
        objectDetectionDetector: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.WHAT_KEY_CSV, new TextValidationRule(false)),
        objectDetectionKey: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.WHAT_KEY_CSV, new TextValidationRule(false)),
        objectDetectionPrecision: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.WHAT_KEY_CSV, new TextValidationRule(false)),
        objectDetectionState: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.WHAT_KEY_CSV, new TextValidationRule(false)),
        routeAttr: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        routeAttrPart: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        persons: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.WHAT_KEY_CSV, new TextValidationRule(false)),
        objects: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.WHAT_KEY_CSV, new TextValidationRule(false)),
        dashboardFilter: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.WHAT_KEY_CSV, new TextValidationRule(false))
    };

    where: string;
    locId: string;
    nearby: string;
    nearbyAddress: string;
    techDataAscent: string;
    techDataAltitudeMax: string;
    techDataDistance: string;
    techDataDuration: string;
    techDataSections: string;
    techRateOverall: string;
    personalRateOverall: string;
    personalRateDifficulty: string;
    actiontype: string;
    objectDetectionCategory: string;
    objectDetectionDetector: string;
    objectDetectionKey: string;
    objectDetectionPrecision: string;
    objectDetectionState: string;
    routeAttr: string;
    routeAttrPart: string;
    objects: string;
    persons: string;
    dashboardFilter: string;

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
        this.techDataSections = values['techDataSections'] || '';
        this.techRateOverall = values['techRateOverall'] || '';
        this.personalRateOverall = values['personalRateOverall'] || '';
        this.personalRateDifficulty = values['personalRateDifficulty'] || '';
        this.actiontype = values['actiontype'] || '';
        this.objectDetectionCategory = values['objectDetectionCategory'] || '';
        this.objectDetectionDetector = values['objectDetectionDetector'] || '';
        this.objectDetectionKey = values['objectDetectionKey'] || '';
        this.objectDetectionPrecision = values['objectDetectionPrecision'] || '';
        this.objectDetectionState = values['objectDetectionState'] || '';
        this.routeAttr = values['routeAttr'] || '';
        this.routeAttrPart = values['routeAttrPart'] || '';
        this.objects = values['objects'] || '';
        this.persons = values['persons'] || '';
        this.dashboardFilter = values['dashboardFilter'] || '';
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
    static getSanitizedValues(values: {}): any  {
        const sanitizedValues = CommonDocSearchFormFactory.getSanitizedValues(values);

        sanitizedValues.where = TourDocSearchForm.tdocFields.where.validator.sanitize(values['where']) || '';
        sanitizedValues.locId = TourDocSearchForm.tdocFields.locId.validator.sanitize(values['locId']) || '';
        sanitizedValues.nearby = TourDocSearchForm.tdocFields.nearby.validator.sanitize(values['nearby']) || '';
        sanitizedValues.nearbyAddress = TourDocSearchForm.tdocFields.nearbyAddress.validator.sanitize(values['nearbyAddress']) || '';
        sanitizedValues.techDataAltitudeMax =
            TourDocSearchForm.tdocFields.techDataAltitudeMax.validator.sanitize(values['techDataAltitudeMax']) || '';
        sanitizedValues.techDataAscent = TourDocSearchForm.tdocFields.techDataAscent.validator.sanitize(values['techDataAscent']) || '';
        sanitizedValues.techDataDistance =
            TourDocSearchForm.tdocFields.techDataDistance.validator.sanitize(values['techDataDistance']) || '';
        sanitizedValues.techDataDuration =
            TourDocSearchForm.tdocFields.techDataDuration.validator.sanitize(values['techDataDuration']) || '';
        sanitizedValues.techDataSections =
            TourDocSearchForm.tdocFields.techDataSections.validator.sanitize(values['techDataSections']) || '';
        sanitizedValues.techRateOverall = TourDocSearchForm.tdocFields.techRateOverall.validator.sanitize(values['techRateOverall']) || '';
        sanitizedValues.personalRateOverall = TourDocSearchForm.tdocFields.personalRateOverall.validator.sanitize(
            values['personalRateOverall']) || '';
        sanitizedValues.personalRateDifficulty = TourDocSearchForm.tdocFields.personalRateDifficulty.validator.sanitize(
            values['personalRateDifficulty']) || '';
        sanitizedValues.actiontype = TourDocSearchForm.tdocFields.actiontype.validator.sanitize(values['actiontype']) || '';
        sanitizedValues.objectDetectionCategory =
            TourDocSearchForm.tdocFields.objectDetectionCategory.validator.sanitize(values['objectDetectionCategory']) || '';
        sanitizedValues.objectDetectionDetector =
            TourDocSearchForm.tdocFields.objectDetectionDetector.validator.sanitize(values['objectDetectionDetector']) || '';
        sanitizedValues.objectDetectionKey =
            TourDocSearchForm.tdocFields.objectDetectionKey.validator.sanitize(values['objectDetectionKey']) || '';
        sanitizedValues.objectDetectionPrecision =
            TourDocSearchForm.tdocFields.objectDetectionPrecision.validator.sanitize(values['objectDetectionPrecision']) || '';
        sanitizedValues.objectDetectionState =
            TourDocSearchForm.tdocFields.objectDetectionState.validator.sanitize(values['objectDetectionState']) || '';
        sanitizedValues.routeAttr = TourDocSearchForm.tdocFields.routeAttr.validator.sanitize(values['routeAttr']) || '';
        sanitizedValues.routeAttrPart = TourDocSearchForm.tdocFields.routeAttrPart.validator.sanitize(values['routeAttrPart']) || '';
        sanitizedValues.objects = TourDocSearchForm.tdocFields.objects.validator.sanitize(values['objects']) || '';
        sanitizedValues.persons = TourDocSearchForm.tdocFields.persons.validator.sanitize(values['persons']) || '';
        sanitizedValues.dashboardFilter = TourDocSearchForm.tdocFields.dashboardFilter.validator.sanitize(values['dashboardFilter']) || '';

        return sanitizedValues;
    }

    static getSanitizedValuesFromForm(searchForm: TourDocSearchForm): any {
        return TourDocSearchFormFactory.getSanitizedValues(searchForm);
    }

    static createSanitized(values: {}): TourDocSearchForm {
        const sanitizedValues = TourDocSearchFormFactory.getSanitizedValues(values);

        return new TourDocSearchForm(sanitizedValues);
    }

    static cloneSanitized(searchForm: TourDocSearchForm): TourDocSearchForm {
        const sanitizedValues = TourDocSearchFormFactory.getSanitizedValuesFromForm(searchForm);

        return new TourDocSearchForm(sanitizedValues);
    }
}

export class TourDocSearchFormValidator {
    static isValidValues(values: {}): boolean {
        let state = CommonDocSearchFormValidator.isValidValues(values);
        state = TourDocSearchForm.tdocFields.where.validator.isValid(values['where']) && state;
        state = TourDocSearchForm.tdocFields.locId.validator.isValid(values['locId']) && state;
        state = TourDocSearchForm.tdocFields.nearby.validator.isValid(values['nearby']) && state;
        state = TourDocSearchForm.tdocFields.nearbyAddress.validator.isValid(values['nearbyAddress']) && state;
        state = TourDocSearchForm.tdocFields.techDataAltitudeMax.validator.isValid(values['techDataAltitudeMax']) && state;
        state = TourDocSearchForm.tdocFields.techDataAscent.validator.isValid(values['techDataAscent']) && state;
        state = TourDocSearchForm.tdocFields.techDataDistance.validator.isValid(values['techDataDistance']) && state;
        state = TourDocSearchForm.tdocFields.techDataDuration.validator.isValid(values['techDataDuration']) && state;
        state = TourDocSearchForm.tdocFields.techDataSections.validator.isValid(values['techDataSections']) && state;
        state = TourDocSearchForm.tdocFields.techRateOverall.validator.isValid(values['techRateOverall']) && state;
        state = TourDocSearchForm.tdocFields.personalRateOverall.validator.isValid(values['personalRateOverall']) && state;
        state = TourDocSearchForm.tdocFields.personalRateDifficulty.validator.isValid(values['personalRateDifficulty']) && state;
        state = TourDocSearchForm.tdocFields.actiontype.validator.isValid(values['actiontype']) && state;
        state = TourDocSearchForm.tdocFields.objectDetectionCategory.validator.isValid(values['objectDetectionCategory']) && state;
        state = TourDocSearchForm.tdocFields.objectDetectionDetector.validator.isValid(values['objectDetectionDetector']) && state;
        state = TourDocSearchForm.tdocFields.objectDetectionKey.validator.isValid(values['objectDetectionKey']) && state;
        state = TourDocSearchForm.tdocFields.objectDetectionPrecision.validator.isValid(values['objectDetectionPrecision']) && state;
        state = TourDocSearchForm.tdocFields.objectDetectionState.validator.isValid(values['objectDetectionState']) && state;
        state = TourDocSearchForm.tdocFields.routeAttr.validator.isValid(values['routeAttr']) && state;
        state = TourDocSearchForm.tdocFields.routeAttrPart.validator.isValid(values['routeAttrPart']) && state;
        state = TourDocSearchForm.tdocFields.objects.validator.isValid(values['objects']) && state;
        state = TourDocSearchForm.tdocFields.persons.validator.isValid(values['persons']) && state;
        state = TourDocSearchForm.tdocFields.dashboardFilter.validator.isValid(values['dashboardFilter']) && state;

        return state;
    }

    static isValid(searchForm: TourDocSearchForm): boolean {
        return TourDocSearchFormValidator.isValidValues(searchForm);
    }
}
