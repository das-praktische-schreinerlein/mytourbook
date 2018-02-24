import {Facets} from '../model/container/facets';

export class SearchParameterUtils {
    constructor() {
    }

    public extractFacetValues(facets: Facets, facetName: string, valuePrefix: string, labelPrefix: string): any[] {
        const values = [];
        if (facetName === undefined || facetName.length <= 0) {
            return values;
        }
        const facet = facets.facets.get(facetName);
        if (facet === undefined || facet.facet === undefined) {
            return values;
        }

        for (const idx in facet.facet) {
            const facetValue = facet.facet[idx];
            if (facetValue[0] === undefined || facetValue[0].toString().length <= 0) {
                continue;
            }

            const convertedValue = [labelPrefix, facetValue[0], valuePrefix, facetValue[1]];
            if (facetValue.length > 2 && facetValue[2] !== null && facetValue[2] !== 'null') {
                // label
                convertedValue.push(facetValue[2]);
            } else {
                // no label
                convertedValue.push(undefined);
            }
            if (facetValue.length > 3 && facetValue[3] !== null && facetValue[3] !== 'null') {
                // id
                convertedValue.push(facetValue[3]);
            } else {
                // no id
                convertedValue.push(undefined);
            }

            values.push(convertedValue);
        }

        return values;
    }

    public extractFacetSelectLimit(facets: Facets, facetName: string): number {
        if (facetName === undefined || facetName.length <= 0) {
            return 0;
        }
        const facet = facets.facets.get(facetName);
        if (facet === undefined || facet.selectLimit === undefined) {
            return 0;
        }

        return facet.selectLimit;
    }

    public splitValuesByPrefixes(src: string, splitter: string, prefixes: string[]): Map<string, string[]> {
        const result = new Map<string, string[]>();
        if (src === undefined) {
            return result;
        }

        const values = src.split(splitter);
        for (const value of values) {
            let found = false;
            for (const prefix of prefixes) {
                if (value.startsWith(prefix)) {
                    let list: string[];
                    if (result.has(prefix)) {
                        list = result.get(prefix);
                    } else {
                        list = [];
                    }
                    list.push(value);
                    result.set(prefix, list);
                    found = true;
                    continue;
                }
            }

            if (!found) {
                const prefix = 'unknown';
                let list: string[];
                if (result.has(prefix)) {
                    list = result.get(prefix);
                } else {
                    list = [];
                }
                list.push(value);
                result.set(prefix, list);
            }
        }

        return result;
    }

    public joinValuesAndReplacePrefix(values: string[], prefix: string, joiner: string): string {
        if (values === undefined) {
            return '';
        }
        return values.map(function (value) {
            return value.replace(prefix, '');
        }).join(joiner);
    }

    public replacePlaceHolder(value: any, regEx: RegExp, replacement: string) {
        if (value === undefined || !(typeof value === 'string')) {
            return value;
        }

        return value.replace(regEx, replacement);
    }

    public useValueDefaultOrFallback(value: any, defaultValue: any, fallback: any) {
        return this.useValueOrDefault(value, (defaultValue ? defaultValue : fallback));
    }

    public useValueOrDefault(value: any, defaultValue: any) {
        if (value === undefined || value === null || value === '') {
            return defaultValue;
        }
        if (Array.isArray(value) && (value.length === 0 || (value.length === 1 && value[0] === ''))) {
            return defaultValue;
        }

        return value;
    }

    public joinParamsToOneRouteParameter(paramsToJoin: Map<string, string>, joiner: string): string {
        if (paramsToJoin === undefined) {
            return '';
        }

        const resultsParams = [];
        paramsToJoin.forEach((value: string, key: string) => {
            if (this.useValueOrDefault(value, undefined) !== undefined) {
                resultsParams.push(key + ':' + value);
            }
        });

        return resultsParams.join(joiner).replace(/[,]+/g, ',').replace(/(^,)|(,$)/g, '');
    }

    public escapeHtml(unsafe): string {
        return unsafe.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/'/g, '&quot;').replace(/'/g, '&#039;');
    }
}
