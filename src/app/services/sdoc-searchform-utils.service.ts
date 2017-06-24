import {Injectable} from '@angular/core';
import {SDocSearchResult} from '../model/container/sdoc-searchresult';
import {IMultiSelectOption} from 'angular-2-dropdown-multiselect';
import {SearchFormUtils} from '../../commons/services/searchform-utils.service';

@Injectable()
export class SDocSearchFormUtils {

    constructor(private searchFormUtils: SearchFormUtils) {
    }

    getWhenValues(searchResult: SDocSearchResult): any[] {
        if (searchResult === undefined || searchResult.facets === undefined || searchResult.facets.facets.size === 0) {
            return [];
        }

        return [].concat(
            this.searchFormUtils.extractFacetValues(searchResult.facets, 'month_is', 'month', 'Monat'),
            this.searchFormUtils.extractFacetValues(searchResult.facets, 'week_is', 'week', 'Woche'));
    }

    getWhereValues(searchResult: SDocSearchResult): any[] {
        if (searchResult === undefined || searchResult.facets === undefined || searchResult.facets.facets.size === 0) {
            return [];
        }

        return [].concat(
            this.searchFormUtils.extractFacetValues(searchResult.facets, 'loc_lochirarchie_txt', '', ''));
    }

    getWhatValues(searchResult: SDocSearchResult): any[] {
        if (searchResult === undefined || searchResult.facets === undefined || searchResult.facets.facets.size === 0) {
            return [];
        }

        return [].concat(
            this.searchFormUtils.extractFacetValues(searchResult.facets, 'keywords_txt', '', ''));
    }

    getTypeValues(searchResult: SDocSearchResult): any[] {
        if (searchResult === undefined || searchResult.facets === undefined || searchResult.facets.facets.size === 0) {
            return [];
        }

        return [].concat(
            this.searchFormUtils.extractFacetValues(searchResult.facets, 'type_txt', '', ''));
    }

    getIMultiSelectOptionsFromExtractedFacetValuesList(values: any[][], withCount: boolean,
                                                       removements: string[], translate: boolean): IMultiSelectOption[] {
        return this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            values, withCount, removements, translate);
    }
}
