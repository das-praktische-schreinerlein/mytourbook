import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {IMultiSelectOption} from 'angular-2-dropdown-multiselect';
import {Facets} from '../model/container/facets';

@Injectable()
export class SearchFormUtils {

    constructor(private translateService: TranslateService) {
    }

    public getIMultiSelectOptionsFromExtractedFacetValuesList(values: any[][], withCount: boolean,
                                                       removements: string[], translate: boolean): IMultiSelectOption[] {
        if (values === undefined) {
            return [];
        }

        const me = this;
        return values.map(function (value) {
            let name: string = value[1];
            if (translate) {
                name = me.translateService.instant(name) || name;
            }
            if (removements && (Array.isArray(removements))) {
                for (const replacement of removements) {
                    name = name.replace(replacement, '');
                }
            }
            if (translate) {
                name = me.translateService.instant(name) || name;
            }
            let label = value[0] + name;
            if (translate) {
                label = me.translateService.instant(label) || label;
            }

            const result = {id: value[2] + value[1], name: label};
            if (withCount && value[3] > 0) {
                result.name += ' (' + value[3] + ')';
            }
            return result;
        });
    }

    public extractFacetValues(facets: Facets, facetName: string, valuePrefix: string, labelPrefix: string): any[] {
        const values = [];

        const facet = facets.facets.get(facetName);
        if (facet === undefined || facet.facet === undefined) {
            return values;
        }

        for (const idx in facets.facets.get(facetName).facet) {
            const facetValue = facets.facets.get(facetName).facet[idx];
            values.push([labelPrefix, facetValue[0], valuePrefix, facetValue[1]]);
        }

        return values;
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
}
