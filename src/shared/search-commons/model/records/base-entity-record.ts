import {Record} from 'js-data';
import {GenericValidatorDatatypes, IdValidationRule, ValidationRule} from '../forms/generic-validator.util';
import {GenericSearchFormFieldConfig} from '../forms/generic-searchform';

export class BaseEntityRecordFieldConfig {
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

export interface BaseEntityRecordType {
    id: string;
    toString(useWrapper?, includeId?): string;
    isValid(): boolean;
}

export class BaseEntityRecord extends Record implements BaseEntityRecordType {
    static genericFields = {
        id: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(false))
    };

    id: string;

    toString(useWrapper, includeId): string {
        useWrapper = typeof useWrapper === 'boolean' ? useWrapper : true;
        includeId = typeof includeId === 'boolean' ? includeId : true;
        return (useWrapper ? '{\n' : '') +
            (includeId ? 'id: ' + this.id + ',\n' : '') +
            (useWrapper ? '\n}' : '');
    }

    isValid(): boolean {
        return BaseEntityRecordValidator.isValid(this);
    }
}

export class BaseEntityRecordValidator {
    static isValidValues(values: {}): boolean {
        return BaseEntityRecordValidator.validateValues(values).length > 0;
    }

    static validateValues(values: {}): string[] {
        const errors = [];
        let state = true;
        state = !BaseEntityRecord.genericFields.id.validator.isValid(values['id']) ? errors.push('id') && false : true;

        return errors;
    }

    static isValid(record: BaseEntityRecord): boolean {
        return BaseEntityRecordValidator.validate(record).length > 0;
    }

    static validate(record: BaseEntityRecord): string[] {
        const errors = [];
        const state = !BaseEntityRecord.genericFields.id.validator.isValid(record.id) ? errors.push('id') && false : true;

        return errors;
    }
}
