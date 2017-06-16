import {Injectable} from '@angular/core';
import {SDocSearchResult} from '../model/container/sdoc-searchresult';
import {TranslateService} from '@ngx-translate/core';
import {IMultiSelectOption} from 'angular-2-dropdown-multiselect';

@Injectable()
export class SDocSearchFormUtils {

    constructor(private translateService: TranslateService) {
    }

    getWhenValues(searchResult: SDocSearchResult): any[] {
        if (searchResult === undefined || searchResult.facets === undefined || searchResult.facets.facets.size === 0) {
            return [];
        }

        const values = [].concat(
            this.extractFacetValues(searchResult, 'month_is', 'month', 'Monat'),
            this.extractFacetValues(searchResult, 'week_is', 'week', 'Woche'));

        return values;
    }

    getWhereValues(searchResult: SDocSearchResult): any[] {
        if (searchResult === undefined || searchResult.facets === undefined || searchResult.facets.facets.size === 0) {
            return [];
        }

        const values = [].concat(
            this.extractFacetValues(searchResult, 'loc_lochirarchie_txt', '', ''));

        return values;
    }

    getWhatValues(searchResult: SDocSearchResult): any[] {
        if (searchResult === undefined || searchResult.facets === undefined || searchResult.facets.facets.size === 0) {
            return [];
        }

        const values = [].concat(
            this.extractFacetValues(searchResult, 'keywords_txt', '', ''));

        return values;
    }

    getTypeValues(searchResult: SDocSearchResult): any[] {
        if (searchResult === undefined || searchResult.facets === undefined || searchResult.facets.facets.size === 0) {
            return [];
        }

        const values = [].concat(
            this.extractFacetValues(searchResult, 'type_txt', '', ''));

        return values;
    }

    getIMultiSelectOptionsFromExtractedFacetValuesList(values: any[][], withCount: boolean,
                                                       removements: string[], translate: boolean): IMultiSelectOption[] {
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

    extractFacetValues(searchResult: SDocSearchResult, facetName: string, valuePrefix: string, labelPrefix: string): any[] {
        const values = [];
        const facet = searchResult.facets.facets.get(facetName);
        if (facet !== undefined &&
            facet.facet !== undefined) {
            for (const idx in searchResult.facets.facets.get(facetName).facet) {
                const facetValue = searchResult.facets.facets.get(facetName).facet[idx];
                values.push([labelPrefix, facetValue[0], valuePrefix, facetValue[1]]);
            }
        }

        return values;
    }
}
