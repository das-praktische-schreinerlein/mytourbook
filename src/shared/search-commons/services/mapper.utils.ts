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

    public getAdapterValue(adapterDocument: any, adapterFieldName: string, defaultValue: any): string {
        let value = defaultValue;
        if (adapterDocument[adapterFieldName] !== undefined) {
            if (Array.isArray(adapterDocument[adapterFieldName])) {
                value = adapterDocument[adapterFieldName][0];
            } else {
                value = adapterDocument[adapterFieldName];
            }
        }

        return value;
    }

    public getAdapterCoorValue(adapterDocument: any, adapterFieldName: string, defaultValue: any): string {
        let value = defaultValue;
        if (adapterDocument[adapterFieldName] !== undefined) {
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
        value = value.toString().replace(/[%]/g, ' ').replace(/[:\()\[\]\\]/g, ' ').replace(/[ ]+/, ' ').trim();
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

