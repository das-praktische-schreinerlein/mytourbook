import {Injectable} from '@angular/core';
import {SDocSearchResult} from '../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {IMultiSelectOption} from 'angular-2-dropdown-multiselect';
import {SearchFormUtils} from '../../../shared/angular-commons/services/searchform-utils.service';
import {SearchParameterUtils} from '../../../shared/search-commons/services/searchparameter.utils';

@Injectable()
export class SDocSearchFormUtils {

    constructor(private searchFormUtils: SearchFormUtils, private searchParameterUtils: SearchParameterUtils) {
    }

    getWhenValues(searchResult: SDocSearchResult): any[] {
        if (searchResult === undefined || searchResult.facets === undefined || searchResult.facets.facets.size === 0) {
            return [];
        }

        return [].concat(
            this.searchParameterUtils.extractFacetValues(searchResult.facets, 'month_is', 'month', 'Monat'),
            this.searchParameterUtils.extractFacetValues(searchResult.facets, 'week_is', 'week', 'Woche'));
    }

    getWhereValues(searchResult: SDocSearchResult): any[] {
        if (searchResult === undefined || searchResult.facets === undefined || searchResult.facets.facets.size === 0) {
            return [];
        }

        return [].concat(
            this.searchParameterUtils.extractFacetValues(searchResult.facets, 'loc_lochirarchie_txt', '', ''));
    }

    getWhatValues(searchResult: SDocSearchResult): any[] {
        if (searchResult === undefined || searchResult.facets === undefined || searchResult.facets.facets.size === 0) {
            return [];
        }

        return [].concat(
            this.searchParameterUtils.extractFacetValues(searchResult.facets, 'keywords_txt', '', ''));
    }

    getTypeValues(searchResult: SDocSearchResult): any[] {
        if (searchResult === undefined || searchResult.facets === undefined || searchResult.facets.facets.size === 0) {
            return [];
        }

        return [].concat(
            this.searchParameterUtils.extractFacetValues(searchResult.facets, 'type_txt', '', ''));
    }

    getPersonalRateOverallValues(searchResult: SDocSearchResult): any[] {
        if (searchResult === undefined || searchResult.facets === undefined || searchResult.facets.facets.size === 0) {
            return [];
        }

        return [].concat(
            this.searchParameterUtils.extractFacetValues(searchResult.facets, 'rate_pers_gesamt_is', '', ''));
    }

    getPersonalRateDifficultyValues(searchResult: SDocSearchResult): any[] {
        if (searchResult === undefined || searchResult.facets === undefined || searchResult.facets.facets.size === 0) {
            return [];
        }

        return [].concat(
            this.searchParameterUtils.extractFacetValues(searchResult.facets, 'rate_pers_schwierigkeit_is', '', ''));
    }

    getTechRateOverallValues(searchResult: SDocSearchResult): any[] {
        if (searchResult === undefined || searchResult.facets === undefined || searchResult.facets.facets.size === 0) {
            return [];
        }

        return [].concat(
            this.searchParameterUtils.extractFacetValues(searchResult.facets, 'rate_tech_overall_ss', '', ''));
    }

    getTechDataAscentValues(searchResult: SDocSearchResult): any[] {
        if (searchResult === undefined || searchResult.facets === undefined || searchResult.facets.facets.size === 0) {
            return [];
        }

        return [].concat(
            this.searchParameterUtils.extractFacetValues(searchResult.facets, 'data_tech_alt_asc_facet_is', '', ''));
    }

    getTechDataAltitudeMaxValues(searchResult: SDocSearchResult): any[] {
        if (searchResult === undefined || searchResult.facets === undefined || searchResult.facets.facets.size === 0) {
            return [];
        }

        return [].concat(
            this.searchParameterUtils.extractFacetValues(searchResult.facets, 'data_tech_alt_max_facet_is', '', ''));
    }

    getTechDataDistanceValues(searchResult: SDocSearchResult): any[] {
        if (searchResult === undefined || searchResult.facets === undefined || searchResult.facets.facets.size === 0) {
            return [];
        }

        return [].concat(
            this.searchParameterUtils.extractFacetValues(searchResult.facets, 'data_tech_dist_facets_fs', '', ''));
    }

    getTechDataDurationValues(searchResult: SDocSearchResult): any[] {
        if (searchResult === undefined || searchResult.facets === undefined || searchResult.facets.facets.size === 0) {
            return [];
        }

        return [].concat(
            this.searchParameterUtils.extractFacetValues(searchResult.facets, 'data_tech_dur_facet_fs', '', ''));
    }

    getIMultiSelectOptionsFromExtractedFacetValuesList(values: any[][], withCount: boolean,
                                                       removements: string[], translate: boolean): IMultiSelectOption[] {
        return this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            values, withCount, removements, translate);
    }
}
