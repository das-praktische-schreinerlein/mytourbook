import {GenericSearchForm, GenericSearchFormFieldConfig} from '../../../search-commons/model/forms/generic-searchform';
import {
    GenericValidatorDatatypes,
    IdCsvValidationRule,
    KeyParamsValidationRule
} from '../../../search-commons/model/forms/generic-validator.util';

export class PDocSearchForm extends GenericSearchForm {
    static pdocFields = {
        what: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.WHAT_KEY_CSV, new IdCsvValidationRule(false)),
        moreFilter: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.FILTER_LIST, new KeyParamsValidationRule(false)),
        type: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new IdCsvValidationRule(false))
    };

    what: string;
    moreFilter: string;
    type: string;

    constructor(values: {}) {
        super(values);
        this.what = PDocSearchForm.pdocFields.what.validator.sanitize(values['what']) || '';
        this.moreFilter = PDocSearchForm.pdocFields.moreFilter.validator.sanitize(values['moreFilter']) || '';
        this.type = PDocSearchForm.pdocFields.type.validator.sanitize(values['type']) || '';
    }

    toString() {
        return 'PDocSearchForm {\n' +
            '  what: ' + this.what + '\n' +
            '  fulltext: ' + this.fulltext + '\n' +
            '  type: ' + this.type + '\n' +
            '  sort: ' + this.sort + '\n' +
            '  perPage: ' + this.perPage + '\n' +
            '  pageNum: ' + this.pageNum + '' +
            '}';
    }
}
