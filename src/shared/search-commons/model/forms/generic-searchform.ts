import {
    GenericValidatorDatatypes,
    IdValidationRule,
    NumberValidationRule,
    TextValidationRule,
    ValidationRule
} from './generic-validator.util';


export class GenericSearchFormFieldConfig {
    private _datatype: GenericValidatorDatatypes;
    private _validator: ValidationRule;

    constructor(datatype: GenericValidatorDatatypes, validator: ValidationRule) {
        this._datatype = datatype;
        this._validator = validator;
    }
    get datatype(): GenericValidatorDatatypes {
        return this._datatype;
    }

    get validator(): ValidationRule {
        return this._validator;
    }
}

export class GenericSearchForm {
    static genericFields = {
        fulltext: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.FULLTEXT, new TextValidationRule(false)),
        sort: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.SORT, new IdValidationRule(false)),
        perPage: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.PERPAGE, new NumberValidationRule(false, 0, 100, 10)),
        pageNum: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.PAGENUM, new NumberValidationRule(false, 1, 999999, 1))
    };

    fulltext: string;
    sort: string;
    perPage: number;
    pageNum: number;


    constructor(values: {}) {
        this.fulltext = GenericSearchForm.genericFields.fulltext.validator.sanitize(values['fulltext']) || '';
        this.sort = GenericSearchForm.genericFields.sort.validator.sanitize(values['sort']) || '';
        this.perPage = GenericSearchForm.genericFields.perPage.validator.sanitize(values['perPage']) || 10;
        this.pageNum = GenericSearchForm.genericFields.pageNum.validator.sanitize(values['pageNum']) || 1;
    }

    toString() {
        return 'GenericSearchForm {\n' +
            '  fulltext: ' + this.fulltext + '\n' +
            '  sort: ' + this.sort + '\n' +
            '  perPage: ' + this.perPage + '\n' +
            '  pageNum: ' + this.pageNum + '' +
            '}';
    }
}
