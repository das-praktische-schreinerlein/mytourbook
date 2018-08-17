import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {IMultiSelectOption} from 'angular-2-dropdown-multiselect';
import {SearchParameterUtils} from '../../search-commons/services/searchparameter.utils';
import {GenericSearchResult} from '../../search-commons/model/container/generic-searchresult';
import {GenericSearchForm} from '../../search-commons/model/forms/generic-searchform';
import {BaseEntityRecord} from '../../search-commons/model/records/base-entity-record';

export interface HumanReadableFilter {
    id: string;
    prefix: string;
    values: string[];
}

@Injectable()
export class SearchFormUtils {

    constructor(private translateService: TranslateService, private searchParameterUtils: SearchParameterUtils) {
    }

    public getIMultiSelectOptionsFromExtractedFacetValuesList(values: any[][], withCount: boolean,
                                                              removements: RegExp[], translate: boolean): IMultiSelectOption[] {
        if (values === undefined) {
            return [];
        }

        const me = this;
        return values.map(function (value) {
            let name: string = value[1];
            if (value.length >= 5 && value[4] !== undefined) {
                name = value[4];
            } else {
                if (name && translate) {
                    name = me.translateService.instant(name) || name;
                }
                if (name && removements && (Array.isArray(removements))) {
                    for (const replacement of removements) {
                        name = name.replace(replacement, '');
                    }
                }
                if (name && translate) {
                    name = me.translateService.instant(name) || name;
                }
            }
            let label = value[0] + name;
            if (label && translate) {
                label = me.translateService.instant(label) || label;
            }

            const result = {id: value[2] + value[1], name: label, count: value[3]};
            if (withCount && value[3] > 0) {
                result.name += ' (' + value[3] + ')';
            }

            return result;
        });
    }

    getFacetValues(searchResult: GenericSearchResult<BaseEntityRecord, GenericSearchForm>, facetName: string, valuePrefix: string,
                   labelPrefix: string): any[] {
        if (searchResult === undefined || searchResult.facets === undefined || searchResult.facets.facets.size === 0) {
            return [];
        }

        return [].concat(
            this.searchParameterUtils.extractFacetValues(searchResult.facets, facetName, valuePrefix, labelPrefix));
    }

    public moveSelectedToTop(options: IMultiSelectOption[], selected: any[]): IMultiSelectOption[] {
        if (selected === undefined || selected === null || selected.length < 1) {
            return options;
        }

        const selectedOptions: IMultiSelectOption[] = [];
        const otherOptions: IMultiSelectOption[] = [];
        for (const option of options) {
            if (selected.indexOf(option.id) >= 0) {
                selectedOptions.push(option);
            } else {
                otherOptions.push(option);
            }
        }

        return [].concat(selectedOptions, otherOptions);
    }

    public extractSelected(options: IMultiSelectOption[], selected: any[]): IMultiSelectOption[] {
        if (selected === undefined || selected === null || selected.length < 1) {
            return [];
        }

        const selectedOptions: IMultiSelectOption[] = [];
        for (const option of options) {
            if (selected.indexOf(option.id) >= 0) {
                selectedOptions.push(option);
            }
        }

        return selectedOptions;
    }

    public prepareExtendedSelectValues(src: any[]): any[] {
        const values = [];
        for (const value of src) {
            // use value as label if not set
            if (!value[4]) {
                value[4] = value[1];
            }
            // use id as value instead of name
            if (value[5]) {
                value[1] = value[5];
            }
            values.push(value);
        }

        return values;
    }

    searchFormToHumanReadableMarkup(filters: HumanReadableFilter[], textOnly: boolean, objCache: Map<string, string>, hrdIds: {}): string {
        const str = [];

        for (const filter of filters) {
            if (filter && filter.values && filter.values.length > 0) {
                let resolvedValues = [];
                if (objCache) {
                    for (const value of filter.values) {
                        const resolvedValue = objCache.get(hrdIds[filter.id.replace('hrt_', '')] + '_' + value);
                        resolvedValues.push(resolvedValue ? resolvedValue : value);
                    }
                } else {
                    resolvedValues = filter.values;
                }
                if (textOnly) {
                    str.push([(filter.prefix ? filter.prefix + ' ' : ''), '"', resolvedValues.join(','), '"'].join(' '));
                } else {
                    str.push(['<div class="filter filter_' + filter.id + '">',
                        '<span class="filterPrefix filterPrefix_' + filter.id + '">', (filter.prefix ? filter.prefix + ' ' : ''), '</span>',
                        '<span class="filterValue filterValue_' + filter.id + '">', '"', resolvedValues.join(','), '"', '</span>', '</div>'
                    ].join(''));
                }
            }
        }

        return str.join(' ');
    }

    extractResolvableFilters(filters: HumanReadableFilter[], hrdIds: {}): HumanReadableFilter[] {
        const res: HumanReadableFilter[] = [];
        for (const filter of filters) {
            if (!filter || !filter.values || filter.values.length <= 0 || !hrdIds[filter.id.replace('hrt_', '')]) {
                continue;
            }
            res.push(filter);
        }

        return res;
    }

    extractResolvableIds(filters: HumanReadableFilter[], hrdIds: {}): Map<string, string> {
        const obJCache = new Map<string, string>();

        for (const filter of filters) {
            if (!filter || !filter.values || filter.values.length <= 0) {
                continue;
            }

            for (const value of filter.values) {
                obJCache.set(hrdIds[filter.id.replace('hrt_', '')] + '_' + value, undefined);
            }
        }

        return obJCache;
    }

    valueToHumanReadableText(valueString: any, prefix: string, defaultValue: string, translate: boolean): HumanReadableFilter {
        let res: HumanReadableFilter;
        if (valueString && valueString.toString() !== '') {
            res = {
                id: prefix,
                prefix: undefined,
                values: []
            };
            if (prefix) {
                res.prefix = (translate ? this.translateService.instant(prefix) : prefix);
            }
            const values = valueString.toString().split(',');
            for (const value of values) {
                const safeValue = this.searchParameterUtils.escapeHtml(value);
                if (safeValue) {
                    res.values.push((translate ? this.translateService.instant(safeValue) || safeValue : safeValue));
                }
            }
        } else if (defaultValue) {
            res = {
                id: prefix,
                prefix: undefined,
                values: []
            };
            if (prefix) {
                res.prefix = (translate ? this.translateService.instant(prefix) : prefix);
            }
            res.values.push((translate ? this.translateService.instant(defaultValue) : defaultValue));
        }

        return res;
    }
}
