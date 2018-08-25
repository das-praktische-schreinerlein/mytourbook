import * as XRegExp from 'xregexp';

export enum GenericValidatorDatatypes {
    'FULLTEXT', 'ID', 'PERPAGE', 'PAGENUM', 'SORT',
    'WHEN_KEY_CSV', 'LOCATION_KEY_CSV', 'ID_CSV', 'NEARBY', 'ADDRESS', 'WHAT_KEY_CSV', 'FILTER_LIST', 'NAME', 'GPSTRACK', 'DATE',
    'TEXT', 'HTML', 'MARKDOWN', 'NUMBER', 'FILENAME', 'GEOLOC'
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
    /**
     + '\\p{Cc}' // Cc 	Other, Control
     + '\\p{Cf}' // Cf 	Other, Format
     + '\\p{Cn}' // Cn 	Other, Not Assigned (no characters in the file have this property)
     + '\\p{Co}' // Co 	Other, Private Use
     + '\\p{Cs}' // Cs 	Other, Surrogate
     + '\\p{LC}' // LC 	Letter, Cased
     + '\\p{Ll}' // Ll 	Letter, Lowercase
     + '\\p{Lm}' // Lm 	Letter, Modifier
     + '\\p{Lo}' // Lo 	Letter, Other
     + '\\p{Lt}' // Lt 	Letter, Titlecase
     + '\\p{Lu}' // Lu 	Letter, Uppercase
     + '\\p{Mc}' // Mc 	Mark, Spacing Combining
     + '\\p{Me}' // Me 	Mark, Enclosing
     + '\\p{Mn}' // Mn 	Mark, Nonspacing
     + '\\p{Nd}' // Nd 	Number, Decimal Digit
     + '\\p{Nl}' // Nl 	Number, Letter
     + '\\p{No}' // No 	Number, Other
     + '\\p{Pc}' // Pc 	Punctuation, Connector
     + '\\p{Pd}' // Pd 	Punctuation, Dash
     + '\\p{Pe}' // Pe 	Punctuation, Close
     + '\\p{Pf}' // Pf 	Punctuation, Final quote (may behave like Ps or Pe depending on usage)
     + '\\p{Pi}' // Pi 	Punctuation, Initial quote (may behave like Ps or Pe depending on usage)
     + '\\p{Po}' // Po 	Punctuation, Other
     + '\\p{Ps}' // Ps 	Punctuation, Open
     + '\\p{Sc}' // Sc 	Symbol, Currency
     + '\\p{Sk}' // Sk 	Symbol, Modifier
     + '\\p{Sm}' // Sm 	Symbol, Math
     + '\\p{So}' // So 	Symbol, Other
     + '\\p{Zl}' // Zl 	Separator, Line
     + '\\p{Zp}' // Zp 	Separator, Paragraph
     + '\\p{Zs}' // Zs 	Separator, Space
     */
    public static textRule = ''
         + '\\p{Cs}' // Cs 	Other, Surrogate
         + '\\p{LC}' // LC 	Letter, Cased
         + '\\p{Ll}' // Ll 	Letter, Lowercase
         + '\\p{Lm}' // Lm 	Letter, Modifier
         + '\\p{Lo}' // Lo 	Letter, Other
         + '\\p{Lt}' // Lt 	Letter, Titlecase
         + '\\p{Lu}' // Lu 	Letter, Uppercase
         + '\\p{Mc}' // Mc 	Mark, Spacing Combining
         + '\\p{Me}' // Me 	Mark, Enclosing
         + '\\p{Mn}' // Mn 	Mark, Nonspacing
         + '\\p{Nd}' // Nd 	Number, Decimal Digit
         + '\\p{Nl}' // Nl 	Number, Letter
         + '\\p{No}' // No 	Number, Other
         + '\\p{Pc}' // Pc 	Punctuation, Connector
         + '\\p{Pd}' // Pd 	Punctuation, Dash
         + '\\p{Pe}' // Pe 	Punctuation, Close
         + '\\p{Pf}' // Pf 	Punctuation, Final quote (may behave like Ps or Pe depending on usage)
         + '\\p{Pi}' // Pi 	Punctuation, Initial quote (may behave like Ps or Pe depending on usage)
         + '\\p{Po}' // Po 	Punctuation, Other
         + '\\p{Ps}' // Ps 	Punctuation, Open
         + '\\p{Sc}' // Sc 	Symbol, Currency
         + '\\p{Sk}' // Sk 	Symbol, Modifier
         + '\\p{Sm}' // Sm 	Symbol, Math
         + '\\p{So}' // So 	Symbol, Other
         + '\\p{Zl}' // Zl 	Separator, Line
         + '\\p{Zp}' // Zp 	Separator, Paragraph
         + ' \r\n\t'
    ;
    public static nameRule = ''
        + XRegExp.escape('-')
        + '@'
        + '\\p{LC}' // LC 	Letter, Cased
        + '\\p{Ll}' // Ll 	Letter, Lowercase
        + '\\p{Lm}' // Lm 	Letter, Modifier
        + '\\p{Lo}' // Lo 	Letter, Other
        + '\\p{Lt}' // Lt 	Letter, Titlecase
        + '\\p{Lu}' // Lu 	Letter, Uppercase
        + '\\p{Nd}' // Nd 	Number, Decimal Digit
        + XRegExp.escape('/+;,:._*()[] ´`\'')
    ;
    public static hierarchyRule = ''
        + XRegExp.escape('-')
        + '\\p{LC}' // LC 	Letter, Cased
        + '\\p{Ll}' // Ll 	Letter, Lowercase
        + '\\p{Lm}' // Lm 	Letter, Modifier
        + '\\p{Lo}' // Lo 	Letter, Other
        + '\\p{Lt}' // Lt 	Letter, Titlecase
        + '\\p{Lu}' // Lu 	Letter, Uppercase
        + '\\p{Nd}' // Nd 	Number, Decimal Digit
        + XRegExp.escape('/+;,:._*() ´`\'>')
    ;
    // @ts-ignore: is functional
    protected _checkRegEx: XRegExp;
    // @ts-ignore: is functional
    protected _replaceRegEx: XRegExp;
    protected _replaceMent: string;
    protected maxLength: number;

    // @ts-ignore: is functional
    constructor(required: boolean, checkRegEx: XRegExp, replaceRegEx: XRegExp, replacement: string, maxLength?: number) {
        super(required);
        this._checkRegEx = checkRegEx;
        this._replaceRegEx = replaceRegEx;
        this._replaceMent = replacement;
        this.maxLength = maxLength;
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
        if (this.maxLength !== undefined && value.length > this.maxLength) {
            return false;
        }

        const res = XRegExp.match(value, this._checkRegEx, 'one');

        /**
        if (res === null) {
            const res2 = XRegExp.match(value, this._replaceRegEx, 'all');
            console.log('values not matching list' + value, res2);
            console.log('code not matching 1' + res2.join(''), res2.join('').charCodeAt(0));
        }
        **/

        return res !== null;
    }

    sanitize(value: any): any {
        if (this.isValid(value)) {
            return value;
        }
        if (typeof value !== 'string') {
            return undefined;
        }
        const result = XRegExp.replace(value, this._replaceRegEx, this._replaceMent);
        // console.error("sanitize value:" + value + " to replaceValue: " + result);
        return result;
    }

    getMaxLength(): number {
        return this.maxLength;
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

export class StringNumberValidationRule extends NumberValidationRule {
    constructor(required: boolean, min: number, max: number, defaultValue: number) {
        super(required, min, max, defaultValue);
    }

    sanitize(value: any): any {
        if (this.isValid(value)) {
            return value ? value  + '' : value;
        }
        // console.error("sanitize value:" + value + " to defaultValue: " + this._defaultValue);
        return this._defaultValue;
    }
}

export class DateValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean) {
        super(required,
            new XRegExp('^[-0-9.: Tt]*$', 'gi'),
            new XRegExp('[^-0-9.: Tt]*', 'gi'), '', 50);
    }
}

export class IdValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean) {
        super(required,
            new XRegExp('^[a-zA-Z_0-9.]*$', 'gi'),
            new XRegExp('[^a-zA-Z_0-9.]*', 'gi'), '', 100);
    }
}

export class IdCsvValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean) {
        super(required,
            new XRegExp('^[a-zA-Z_0-9,.]*$', 'gi'),
            new XRegExp('[^a-zA-Z_0-9,.]*', 'gi'), '', 20000);
    }
}

export class DbIdValidationRule extends NumberValidationRule {
    constructor(required: boolean) {
        super(required, 1, 9999999999999999, undefined);
    }
}

export class DbIdCsvValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean) {
        super(required,
            new XRegExp('^[0-9,]*$', 'gi'),
            new XRegExp('[^0-9,]*', 'gi'), '', 20000);
    }
}

export class KeyParamsValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean) {
        super(required,
            new XRegExp('^[-a-zA-Z_0-9äöüßÄÖÜ,;:. ]*$', 'gi'),
            new XRegExp('[^-a-zA-Z_0-9äöüßÄÖÜ,;:. ]*', 'gi'), '', 1500);
    }
}

export class ExtendedKeyParamsValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean) {
        super(required,
            new XRegExp('^[-a-zA-Z_0-9äöüßÄÖÜ,;:. ]*$', 'gi'),
            new XRegExp('[^-a-zA-Z_0-9äöüßÄÖÜ,;:. ]*', 'gi'), '', 2000);
    }
}

export class KeywordValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean) {
        super(required,
            new XRegExp('^[-a-zA-Z_0-9äöüßÄÖÜ,;:. ]*$', 'gi'),
            new XRegExp('[^-a-zA-Z_0-9äöüßÄÖÜ,;:. ]*', 'gi'), '', 1500);
    }
}

export class NearbyParamValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean) {
        super(required,
            new XRegExp('^[-0-9._]*$', 'gi'),
            new XRegExp('[^-0-9._]*', 'gi'), '', 100);
    }
}

export class TextValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean) {
        super(required,
            new XRegExp('^[-A-Za-z0-9äöüßÄÖÜ+;,:._* ]*$', 'gi'),
            new XRegExp('[^-A-Za-z0-9äöüßÄÖÜ+;,:._* ]*', 'gi'), '', 1500);
    }
}

export class NameValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean) {
        super(required,
            new XRegExp('^[' + RegExValidationReplaceRule.nameRule + ']*$', 'gi'),
            new XRegExp('[^' + RegExValidationReplaceRule.nameRule + ']*', 'gi'), '', 200);
    }
}

export class SolrValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean) {
        super(required,
            new XRegExp('^[-A-Za-z0-9äöüßÄÖÜ+;,:._* ]*$', 'gi'),
            new XRegExp('[^-A-Za-z0-9äöüßÄÖÜ+;,:._* ]*', 'gi'), '', 100);
    }
}

export class GeoLocValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean) {
        super(required,
            new XRegExp('^[-0-9,.]*$', 'gi'),
            new XRegExp('[^-0-9,.]*', 'gi'), '', 50);
    }
}

export class HierarchyValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean) {
        super(required,
            new XRegExp('^[' + RegExValidationReplaceRule.hierarchyRule + ']*$', 'gi'),
            new XRegExp('[^' + RegExValidationReplaceRule.hierarchyRule + ']*', 'gi'), '', 400);
    }
}

export class GpsTrackValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean) {
        const characters = '-A-Za-z0-9' + XRegExp.escape('äöüßÄÖÜ/"+=;,:._*?!<>()[] ');
        super(required,
            new XRegExp('^[' + characters + '\t\r\n]*$', 'gi'),
            new XRegExp('[^' + characters + '\t\r\n]*', 'gi'), '', 1000000);
    }
}

export class RouteValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean) {
        super(required,
            new XRegExp('^[-A-Za-z0-9äöüßÄÖÜ/+;,:._*]*$', 'gi'),
            new XRegExp('[^-A-Za-z0-9äöüßÄÖÜ/+;,:._*]*', 'gi'), '', 2000);
    }
}

export class ShowRouteValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean) {
        super(required,
            new XRegExp('^[-A-Za-z0-9/_]*$', 'gi'),
            new XRegExp('[^-A-Za-z0-9/_]*', 'gi'), '', 2000);
    }
}

export class HtmlValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean) {
        super(required,
            new XRegExp('^[' + RegExValidationReplaceRule.textRule + ']*$', 'gi'),
            new XRegExp('[^' + RegExValidationReplaceRule.textRule + ']*', 'gi'), '', 10000);
    }
}

export class MarkdownValidationRule extends HtmlValidationRule {
    constructor(required: boolean) {
        super(required);
    }
}

export class DescValidationRule extends MarkdownValidationRule {
    constructor(required: boolean) {
        super(required);
    }
}

export class FilenameValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean) {
        super(required,
            new XRegExp('^[-A-Za-z0-9_]*$', 'gi'),
            new XRegExp('[^-A-Za-z0-9_]*', 'gi'), '', 250);
    }
}
