import {GenericSearchForm, GenericSearchFormFieldConfig} from './generic-searchform';
import {
    ExtendedKeyParamsValidationRule,
    GenericValidatorDatatypes,
    IdCsvValidationRule,
    IdValidationRule,
    KeyParamsValidationRule,
    TextValidationRule
} from './generic-validator.util';

export class CommonDocSearchForm extends GenericSearchForm {
    static cdocFields = {
        when: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.WHEN_KEY_CSV, new KeyParamsValidationRule(false)),
        what: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.WHAT_KEY_CSV, new IdCsvValidationRule(false)),
        moreFilter: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.FILTER_LIST, new ExtendedKeyParamsValidationRule(false)),
        playlists: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.WHAT_KEY_CSV, new TextValidationRule(false)),
        theme: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(false)),
        type: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new IdCsvValidationRule(false))
    };

    when: string;
    what: string;
    moreFilter: string;
    playlists: string;
    theme: string;
    type: string;

    constructor(values: {}) {
        super(values);
        this.when = values['when'] || '';
        this.what = values['what'] || '';
        this.moreFilter = values['moreFilter'] || '';
        this.playlists = values['playlists'] || '';
        this.theme = values['theme'] || '';
        this.type = values['type'] || '';
    }

    toString() {
        return 'CommonDocSearchForm {\n' +
            '  when: ' + this.when + '\n' +
            '  what: ' + this.what + '\n' +
            '  fulltext: ' + this.fulltext + '\n' +
            '  type: ' + this.type + '\n' +
            '  sort: ' + this.sort + '\n' +
            '  perPage: ' + this.perPage + '\n' +
            '  pageNum: ' + this.pageNum + '' +
            '}';
    }
}

export class CommonDocSearchFormFactory {
    static createSanitized(values: {}): CommonDocSearchForm {
        const sanitizedValues: any = {};
        sanitizedValues.fulltext = GenericSearchForm.genericFields.fulltext.validator.sanitize(values['fulltext']) || '';
        sanitizedValues.sort = GenericSearchForm.genericFields.sort.validator.sanitize(values['sort']) || '';
        sanitizedValues.perPage = GenericSearchForm.genericFields.perPage.validator.sanitize(values['perPage']) || 10;
        sanitizedValues.pageNum = GenericSearchForm.genericFields.pageNum.validator.sanitize(values['pageNum']) || 1;
        sanitizedValues.when = CommonDocSearchForm.cdocFields.when.validator.sanitize(values['when']) || '';
        sanitizedValues.what = CommonDocSearchForm.cdocFields.what.validator.sanitize(values['what']) || '';
        sanitizedValues.moreFilter = CommonDocSearchForm.cdocFields.moreFilter.validator.sanitize(values['moreFilter']) || '';
        sanitizedValues.playlists = CommonDocSearchForm.cdocFields.playlists.validator.sanitize(values['playlists']) || '';
        sanitizedValues.theme = CommonDocSearchForm.cdocFields.theme.validator.sanitize(values['theme']) || '';
        sanitizedValues.type = CommonDocSearchForm.cdocFields.type.validator.sanitize(values['type']) || '';

        return new CommonDocSearchForm(sanitizedValues);
    }

    static cloneSanitized(searchForm: CommonDocSearchForm): CommonDocSearchForm {
        const sanitizedValues: any = {};
        sanitizedValues.fulltext = GenericSearchForm.genericFields.fulltext.validator.sanitize(searchForm.fulltext) || '';
        sanitizedValues.sort = GenericSearchForm.genericFields.sort.validator.sanitize(searchForm.sort) || '';
        sanitizedValues.perPage = GenericSearchForm.genericFields.perPage.validator.sanitize(searchForm.perPage) || 10;
        sanitizedValues.pageNum = GenericSearchForm.genericFields.pageNum.validator.sanitize(searchForm.pageNum) || 1;
        sanitizedValues.when = CommonDocSearchForm.cdocFields.when.validator.sanitize(searchForm.when) || '';
        sanitizedValues.what = CommonDocSearchForm.cdocFields.what.validator.sanitize(searchForm.what) || '';
        sanitizedValues.moreFilter = CommonDocSearchForm.cdocFields.moreFilter.validator.sanitize(searchForm.moreFilter) || '';
        sanitizedValues.playlists = CommonDocSearchForm.cdocFields.playlists.validator.sanitize(searchForm.playlists) || '';
        sanitizedValues.theme = CommonDocSearchForm.cdocFields.theme.validator.sanitize(searchForm.theme) || '';
        sanitizedValues.type = CommonDocSearchForm.cdocFields.type.validator.sanitize(searchForm.type) || '';

        return new CommonDocSearchForm(sanitizedValues);
    }
}

export class CommonDocSearchFormValidator {
    static isValidValues(values: {}): boolean {
        let state = true;
        state = state && GenericSearchForm.genericFields.fulltext.validator.isValid(values['fulltext']);
        state = state && GenericSearchForm.genericFields.sort.validator.isValid(values['sort']);
        state = state && GenericSearchForm.genericFields.perPage.validator.isValid(values['perPage']);
        state = state && GenericSearchForm.genericFields.pageNum.validator.isValid(values['pageNum']);
        state = state && CommonDocSearchForm.cdocFields.when.validator.isValid(values['when']);
        state = state && CommonDocSearchForm.cdocFields.what.validator.isValid(values['what']);
        state = state && CommonDocSearchForm.cdocFields.moreFilter.validator.isValid(values['moreFilter']);
        state = state && CommonDocSearchForm.cdocFields.playlists.validator.isValid(values['playlists']);
        state = state && CommonDocSearchForm.cdocFields.theme.validator.isValid(values['theme']);
        state = state && CommonDocSearchForm.cdocFields.type.validator.isValid(values['type']);

        return state;
    }

    static isValid(searchForm: CommonDocSearchForm): boolean {
        let state = true;
        state = state && GenericSearchForm.genericFields.fulltext.validator.isValid(searchForm.fulltext);
        state = state && GenericSearchForm.genericFields.sort.validator.isValid(searchForm.sort);
        state = state && GenericSearchForm.genericFields.perPage.validator.isValid(searchForm.perPage);
        state = state && GenericSearchForm.genericFields.pageNum.validator.isValid(searchForm.pageNum);
        state = state && CommonDocSearchForm.cdocFields.when.validator.isValid(searchForm.when);
        state = state && CommonDocSearchForm.cdocFields.what.validator.isValid(searchForm.what);
        state = state && CommonDocSearchForm.cdocFields.moreFilter.validator.isValid(searchForm.moreFilter);
        state = state && CommonDocSearchForm.cdocFields.playlists.validator.isValid(searchForm.playlists);
        state = state && CommonDocSearchForm.cdocFields.theme.validator.isValid(searchForm.theme);
        state = state && CommonDocSearchForm.cdocFields.type.validator.isValid(searchForm.type);

        return state;
    }
}
