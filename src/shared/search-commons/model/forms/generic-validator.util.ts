export enum GenericValidatorDatatypes {
    'FULLTEXT', 'ID', 'PERPAGE', 'PAGENUM', 'SORT',
    'WHEN_KEY_CSV', 'LOCATION_KEY_CSV', 'ID_CSV', 'NEARBY', 'ADDRESS', 'WHAT_KEY_CSV', 'FILTER_LIST'
}

export abstract class ValidationRule {
    protected _required: boolean;
    abstract isValid(value: any): boolean;
    abstract sanitize(value: any): any;

    constructor(required: boolean) {
        this._required = required;
    }

    isRequiredValid(value: any) {
        return (this._required && !this.isUndefined(value)) || !this._required;
    }

    isUndefined(value: any) {
        return value === undefined;
    }
}

export abstract class ValidationWithDefaultRule extends ValidationRule {
    protected _defaultValue: any;
    constructor(required: boolean, defaultValue: any) {
        super(required);
        this._defaultValue = defaultValue;
    }

    sanitize(value: any): any {
        if (this.isValid(value)) {
            return value;
        }

        // console.error("sanitize value:" + value + " to defaultValue: " + this._defaultValue);
        return this._defaultValue;
    }
}

export abstract class ListValidationRule extends ValidationWithDefaultRule {
    protected _values: any[];
    constructor(required: boolean, values: any[], defaultValue: any) {
        super(required, defaultValue);
        this._values = values;
    }
}

export class WhiteListValidationRule extends ListValidationRule {
    constructor(required: boolean, whiteListValues: any[], defaultValue: any) {
        super(required, whiteListValues, defaultValue);
    }

    isValid(value: any): boolean {
        if (!this.isRequiredValid(value)) {
            return false;
        }
        if (this.isUndefined(value)) {
            return true;
        }
        return this._values.indexOf(value) >= 0;
    }
}

export class BlackListValuesValidationRule extends ListValidationRule {
    constructor(required: boolean, blackListValues: any[], defaultValue: any) {
        super(required, blackListValues, defaultValue);
    }

    isValid(value: any): boolean {
        if (!this.isRequiredValid(value)) {
            return false;
        }
        if (this.isUndefined(value)) {
            return true;
        }
        return this._values.indexOf(value) < 0;
    }
}

export class RegExValidationReplaceRule extends ValidationRule {
    protected _checkRegEx: RegExp;
    protected _replaceRegEx: RegExp;
    protected _replaceMent: string;
    constructor(required: boolean, checkRegEx: RegExp, replaceRegEx: RegExp, replacement: string) {
        super(required);
        this._checkRegEx = checkRegEx;
        this._replaceRegEx = replaceRegEx;
        this._replaceMent = replacement;
    }

    isValid(value: any): boolean {
        if (!this.isRequiredValid(value)) {
            return false;
        }
        if (this.isUndefined(value)) {
            return true;
        }
        if (typeof value !== 'string') {
            return false;
        }
        return value.match(this._checkRegEx) !== null;
    }

    sanitize(value: any): any {
        if (this.isValid(value)) {
            return value;
        }
        if (typeof value !== 'string') {
            return undefined;
        }
        const result = value.replace(this._replaceRegEx, this._replaceMent);
        // console.error("sanitize value:" + value + " to replaceValue: " + result);
        return result;
    }
}

export class IdValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean) {
        super(required, /^[a-zA-Z_0-9.]*$/gi, /[^a-zA-Z_0-9.]*/gi, '');
    }
}

export class IdCsvValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean) {
        super(required, /^[a-zA-Z_0-9,.]*$/gi, /[^a-zA-Z_0-9,.]*/gi, '');
    }
}

export class KeyParamsValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean) {
        super(required, /^[-a-zA-Z_0-9,;: ]*$/gi, /[^-a-zA-Z_0-9,;: ]*/gi, '');
    }
}

export class NearbyParamValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean) {
        super(required, /^[-0-9._]*$/gi, /[^-0-9._]*/gi, '');
    }
}

export class TextValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean) {
        super(required, /^[-A-Za-z0-9äöüßÄÖÜ+;,:._* ]*$/gi, /[^-A-Za-z0-9äöüßÄÖÜ+;,:._* ]*/gi, '');
    }
}

export class SolrValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean) {
        super(required, /^[-A-Za-z0-9äöüßÄÖÜ+;,:._* ]*$/gi, /[^-A-Za-z0-9äöüßÄÖÜ+;,:._* ]*/gi, '');
    }
}

export class RouteValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean) {
        super(required, /^[-A-Za-z0-9äöüßÄÖÜ/+;,:._*]*$/gi, /[^-A-Za-z0-9äöüßÄÖÜ/+;,:._*]*/gi, '');
    }
}

export class ShowRouteValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean) {
        super(required, /^[-A-Za-z0-9/_]*$/gi, /[^-A-Za-z0-9/_]*/gi, '');
    }
}

export class NumberValidationRule extends ValidationWithDefaultRule {
    protected _min: number;
    protected _max: number;

    constructor(required: boolean, min: number, max: number, defaultValue: number) {
        super(required, defaultValue);
        this._min = min;
        this._max = max;
    }

    isValid(value: any): boolean {
        if (!this.isRequiredValid(value)) {
            return false;
        }
        if (this.isUndefined(value)) {
            return true;
        }
        if (typeof value === 'string' && !isNaN(+value)) {
            value = +value;
        }
        if (typeof value !== 'number') {
            return false;
        }

        if (this._min !== undefined && value < this._min) {
            return false;
        }

        if (this._max !== undefined && value > this._max) {
            return false;
        }

        return true;
    }

    sanitize(value: any): any {
        if (this.isValid(value)) {
            return +value;
        }
        // console.error("sanitize value:" + value + " to defaultValue: " + this._defaultValue);
        return this._defaultValue;
    }
}
