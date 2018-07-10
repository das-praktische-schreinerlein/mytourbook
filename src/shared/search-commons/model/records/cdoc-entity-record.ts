import {
    DateValidationRule,
    DescValidationRule,
    GenericValidatorDatatypes,
    HtmlValidationRule,
    IdValidationRule,
    KeywordValidationRule,
    MarkdownValidationRule,
    NameValidationRule,
    NumberValidationRule,
    TextValidationRule
} from '../forms/generic-validator.util';
import {BaseEntityRecord, BaseEntityRecordFieldConfig, BaseEntityRecordType} from './base-entity-record';
import {isArray} from 'util';

export interface CommonDocRecordType extends BaseEntityRecordType {
    blocked: number;
    dateshow: Date;
    descTxt: string;
    descMd: string;
    descHtml: string;
    keywords: string;
    name: string;
    playlists: string;
    subtype: string;
    type: string;

    toSerializableJsonObj(anonymizeMedia?: boolean): {};
}

export class CommonDocRecord extends BaseEntityRecord implements CommonDocRecordType {
    static cdocFields = {
        blocked: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER, new NumberValidationRule(false, -5, 5, undefined)),

        dateshow: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.DATE, new DateValidationRule(false)),
        descTxt: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.TEXT, new DescValidationRule(false)),
        descMd: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.MARKDOWN, new MarkdownValidationRule(false)),
        descHtml: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.HTML, new HtmlValidationRule(false)),
        keywords: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.WHAT_KEY_CSV, new KeywordValidationRule(false)),
        name: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(true)),
        playlists: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.WHAT_KEY_CSV, new TextValidationRule(false)),
        subtype: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(true)),
        type: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(true))
    };

    blocked: number;
    dateshow: Date;
    descTxt: string;
    descMd: string;
    descHtml: string;
    keywords: string;
    name: string;
    playlists: string;
    subtype: string;
    type: string;

    static cloneToSerializeToJsonObj(baseRecord: CommonDocRecord, anonymizeMedia?: boolean): {}  {
        const record  = {};
        for (const key in baseRecord) {
            record[key] = baseRecord[key];
        }

        if (anonymizeMedia === true) {
            if (isArray(record['sdocimages'])) {
                for (const media of record['sdocimages']) {
                    media.fileName = 'anonymized.JPG';
                }
            }
            if (isArray(record['sdocvideos'])) {
                for (const media of record['sdocvideos']) {
                    media.fileName = 'anonymized.MP4';
                }
            }
        }

        return record;
    }

    toString() {
        return 'CommonDocRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  name: ' + this.name + ',\n' +
            '  type: ' + this.type + '' +
            '}';
    }

    toSerializableJsonObj(anonymizeMedia?: boolean): {} {
        return CommonDocRecord.cloneToSerializeToJsonObj(this, anonymizeMedia);
    }

    isValid(): boolean {
        return CommonDocRecordValidator.isValid(this);
    }
}

export class CommonDocRecordValidator {
    static isValidValues(values: {}): boolean {
        return CommonDocRecordValidator.validateValues(values).length > 0;
    }

    static validateValues(values: {}): string[] {
        const errors = [];
        let state = true;
        state = !BaseEntityRecord.genericFields.id.validator.isValid(values['id']) ? errors.push('id') &&  false : true;

        state = !CommonDocRecord.cdocFields.blocked.validator.isValid(values['blocked']) ? errors.push('blocked') &&  false : true;
        state = !CommonDocRecord.cdocFields.dateshow.validator.isValid(values['dateshow']) ? errors.push('dateshow') &&  false : true;
        state = !CommonDocRecord.cdocFields.descTxt.validator.isValid(values['descTxt']) ? errors.push('descTxt') &&  false : true;
        state = !CommonDocRecord.cdocFields.descMd.validator.isValid(values['descMd']) ? errors.push('descMd') &&  false : true;
        state = !CommonDocRecord.cdocFields.descHtml.validator.isValid(values['descHtml']) ? errors.push('descHtml') &&  false : true;
        state = !CommonDocRecord.cdocFields.keywords.validator.isValid(values['keywords']) ? errors.push('keywords') &&  false : true;
        state = !CommonDocRecord.cdocFields.name.validator.isValid(values['name']) ? errors.push('name') &&  false : true;
        state = !CommonDocRecord.cdocFields.playlists.validator.isValid(values['playlists']) ? errors.push('playlists') &&  false : true;
        state = !CommonDocRecord.cdocFields.subtype.validator.isValid(values['subtype']) ? errors.push('subtype') &&  false : true;
        state = !CommonDocRecord.cdocFields.type.validator.isValid(values['type']) ? errors.push('type') &&  false : true;

        return errors;
    }

    static isValid(sdoc: CommonDocRecord): boolean {
        return CommonDocRecordValidator.validate(sdoc).length > 0;
    }

    static validate(sdoc: CommonDocRecord): string[] {
        const errors = [];
        let state = BaseEntityRecord.genericFields.id.validator.isValid(sdoc.id) ? errors.push('id') && false : true;

        state = !CommonDocRecord.cdocFields.blocked.validator.isValid(sdoc.blocked) ? errors.push('blocked') &&  false : true;
        state = !CommonDocRecord.cdocFields.dateshow.validator.isValid(sdoc.dateshow) ? errors.push('dateshow') &&  false : true;
        state = !CommonDocRecord.cdocFields.descTxt.validator.isValid(sdoc.descTxt) ? errors.push('descTxt') &&  false : true;
        state = !CommonDocRecord.cdocFields.descMd.validator.isValid(sdoc.descMd) ? errors.push('descMd') &&  false : true;
        state = !CommonDocRecord.cdocFields.descHtml.validator.isValid(sdoc.descHtml) ? errors.push('descHtml') &&  false : true;
        state = !CommonDocRecord.cdocFields.keywords.validator.isValid(sdoc.keywords) ? errors.push('keywords') &&  false : true;
        state = !CommonDocRecord.cdocFields.name.validator.isValid(sdoc.name) ? errors.push('name') &&  false : true;
        state = !CommonDocRecord.cdocFields.playlists.validator.isValid(sdoc.playlists) ? errors.push('playlists') &&  false : true;
        state = !CommonDocRecord.cdocFields.subtype.validator.isValid(sdoc.subtype) ? errors.push('subtype') &&  false : true;
        state = !CommonDocRecord.cdocFields.type.validator.isValid(sdoc.type) ? errors.push('type') &&  false : true;

        return errors;
    }
}
