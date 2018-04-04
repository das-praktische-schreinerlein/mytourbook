import {GenericSearchForm} from '../model/forms/generic-searchform';
import {DateUtils} from '../../commons/utils/date.utils';

export interface AdapterQuery {
    where?: {};
    additionalWhere?: {};
    spatial?: {
        geo_loc_p: {
            nearby: string;
        };
    };
    loadTrack: any;
}
export interface AdapterOpts {
    limit?: number;
    offset?: number;
    originalSearchForm?: GenericSearchForm;
    showFacets?: any;
}

export class AdapterFilterActions {
    static LIKEI = 'likei';
    static LIKE = 'like';
    static EQ1 = '==';
    static EQ2 = 'eq';
    static GT = '>';
    static GE = '>=';
    static LT = '<';
    static LE = '<=';
    static IN = 'in';
    static IN_NUMBER = 'in_number';
    static IN_CSV = 'in_csv';
    static LIKEIN = 'likein';
    static NOTIN = 'notin';
}

export class MapperUtils {
    public mapToAdapterFieldName(mapping: {}, fieldName: string): string {
        if (mapping.hasOwnProperty(fieldName)) {
            return mapping[fieldName];
        }

        return fieldName;
    }

    public getMappedAdapterValue(mapping: {}, adapterDocument: any, adapterFieldName: string, defaultValue: any): string {
        return this.getAdapterValue(adapterDocument, this.mapToAdapterFieldName(mapping, adapterFieldName), defaultValue);
    }

    public getMappedAdapterNumberValue(mapping: {}, adapterDocument: any, adapterFieldName: string, defaultValue: any): number {
        return this.getAdapterNumberValue(adapterDocument, this.mapToAdapterFieldName(mapping, adapterFieldName), defaultValue);
    }

    public getMappedAdapterDateTimeValue(mapping: {}, adapterDocument: any, adapterFieldName: string, defaultValue: any): number {
        return this.getAdapterDateTimeValue(adapterDocument, this.mapToAdapterFieldName(mapping, adapterFieldName), defaultValue);
    }

    public getAdapterValue(adapterDocument: any, adapterFieldName: string, defaultValue: any): string {
        let value = defaultValue;
        if (adapterDocument[adapterFieldName] !== undefined && adapterDocument[adapterFieldName] !== null) {
            if (Array.isArray(adapterDocument[adapterFieldName])) {
                value = adapterDocument[adapterFieldName][0];
            } else {
                value = adapterDocument[adapterFieldName];
            }
        }

        return value;
    }

    public getAdapterNumberValue(adapterDocument: any, adapterFieldName: string, defaultValue: any): number {
        let value = defaultValue;
        if (adapterDocument[adapterFieldName] !== undefined && adapterDocument[adapterFieldName] !== null) {
            if (Array.isArray(adapterDocument[adapterFieldName])) {
                value = adapterDocument[adapterFieldName][0];
            } else {
                value = adapterDocument[adapterFieldName];
            }
            if (value === undefined) {
                return undefined;
            }
            if (typeof value === 'string') {
                value = Number.parseFloat(value);
            }
            value = Number(value);
        }

        return value;
    }

    public getAdapterDateTimeValue(adapterDocument: any, adapterFieldName: string, defaultValue: any): number {
        let value = defaultValue;
        if (adapterDocument[adapterFieldName] !== undefined && adapterDocument[adapterFieldName] !== null) {
            if (Array.isArray(adapterDocument[adapterFieldName])) {
                value = adapterDocument[adapterFieldName][0];
            } else {
                value = adapterDocument[adapterFieldName];
            }
            if (value === undefined) {
                return undefined;
            }

            value =  DateUtils.dateToLocalISOString(value);
        }

        return value;
    }

    public getAdapterCoorValue(adapterDocument: any, adapterFieldName: string, defaultValue: any): string {
        let value = defaultValue;
        if (adapterDocument[adapterFieldName] !== undefined && adapterDocument[adapterFieldName] !== null) {
            if (Array.isArray(adapterDocument[adapterFieldName])) {
                value = adapterDocument[adapterFieldName][0];
            } else if (adapterDocument[adapterFieldName] !== '0' && adapterDocument[adapterFieldName] !== '0,0') {
                value = adapterDocument[adapterFieldName];
            }
        }

        return value;
    }

    public prepareEscapedSingleValue(value: any, splitter: string, joiner: string): string {
        value = this.prepareSingleValue(value, ' ');
        value = this.escapeAdapterValue(value);
        const values = this.prepareValueToArray(value, splitter);
        value = values.map(inValue => this.escapeAdapterValue(inValue)).join(joiner);
        return value;
    }

    public prepareSingleValue(value: any, joiner: string): string {
        switch (typeof value) {
            case 'string':
                return value.toString();
            case 'number':
                return '' + value;
            default:
        }
        if (Array.isArray(value)) {
            return value.join(joiner);
        }

        return value.toString();
    }

    public prepareValueToArray(value: any, splitter: string): string[] {
        return value.toString().split(splitter);
    }

    public escapeAdapterValue(value: any): string {
        value = value.toString().replace(/[%]/g, ' ')
            .replace(/[\"\':\()\[\]\x00\n\r\x1a\\]/g, ' ')
            .replace(/[ ]+/g, ' ')
            .trim();
        return value;
    }

    public splitPairs(arr: Array<any>): Array<Array<any>> {
        const pairs = [];
        for (let i = 0; i < arr.length; i += 2) {
            if (arr[i + 1] !== undefined) {
                pairs.push([arr[i], arr[i + 1]]);
            } else {
                pairs.push([arr[i]]);
            }
        }
        return pairs;
    }
}

