import {GenericSearchForm, GenericSearchFormFieldConfig} from '../../../search-commons/model/forms/generic-searchform';
import {
    GenericValidatorDatatypes,
    IdCsvValidationRule,
    IdValidationRule,
    KeyParamsValidationRule,
    TextValidationRule
} from '../../../search-commons/model/forms/generic-validator.util';

export class SDocSearchForm extends GenericSearchForm {
    static sdocFields = {
        when: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.WHEN_KEY_CSV, new KeyParamsValidationRule(false)),
        where: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.LOCATION_KEY_CSV, new KeyParamsValidationRule(false)),
        locId: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new IdCsvValidationRule(false)),
        nearby: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.NEARBY, new TextValidationRule(false)),
        nearbyAddress: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ADDRESS, new TextValidationRule(false)),
        what: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.WHAT_KEY_CSV, new IdCsvValidationRule(false)),
        moreFilter: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.FILTER_LIST, new KeyParamsValidationRule(false)),
        theme: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(false)),
        type: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new IdValidationRule(false))
    };

    when: string;
    where: string;
    locId: string;
    nearby: string;
    nearbyAddress: string;
    what: string;
    moreFilter: string;
    theme: string;
    type: string;

    constructor(values: {}) {
        super(values);
        this.when = SDocSearchForm.sdocFields.when.validator.sanitize(values['when']) || '';
        this.where = SDocSearchForm.sdocFields.where.validator.sanitize(values['where']) || '';
        this.locId = SDocSearchForm.sdocFields.locId.validator.sanitize(values['locId']) || '';
        this.nearby = SDocSearchForm.sdocFields.nearby.validator.sanitize(values['nearby']) || '';
        this.nearbyAddress = SDocSearchForm.sdocFields.nearbyAddress.validator.sanitize(values['nearbyAddress']) || '';
        this.what = SDocSearchForm.sdocFields.what.validator.sanitize(values['what']) || '';
        this.moreFilter = SDocSearchForm.sdocFields.moreFilter.validator.sanitize(values['moreFilter']) || '';
        this.theme = SDocSearchForm.sdocFields.theme.validator.sanitize(values['theme']) || '';
        this.type = SDocSearchForm.sdocFields.type.validator.sanitize(values['type']) || '';
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
