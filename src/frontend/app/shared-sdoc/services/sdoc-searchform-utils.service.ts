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

    getActionTypeValues(searchResult: SDocSearchResult): any[] {
        if (searchResult === undefined || searchResult.facets === undefined || searchResult.facets.facets.size === 0) {
            return [];
        }

        return [].concat(
            this.searchParameterUtils.extractFacetValues(searchResult.facets, 'actiontype_ss', '', ''));
    }

    getTypeValues(searchResult: SDocSearchResult): any[] {
        if (searchResult === undefined || searchResult.facets === undefined || searchResult.facets.facets.size === 0) {
            return [];
        }

        return [].concat(
            this.searchParameterUtils.extractFacetValues(searchResult.facets, 'type_txt', '', ''));
    }

    getTypeLimit(searchResult: SDocSearchResult): number {
        if (searchResult === undefined || searchResult.facets === undefined || searchResult.facets.facets.size === 0) {
            return 0;
        }

        return this.searchParameterUtils.extractFacetSelectLimit(searchResult.facets, 'type_txt');
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
                                                       removements: RegExp[], translate: boolean): IMultiSelectOption[] {
        return this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            values, withCount, removements, translate);
    }

    moveSelectedToTop(options: IMultiSelectOption[], selected: any[]): IMultiSelectOption[] {
        if (selected === undefined || selected.length < 1) {
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

    public extractNearbyPos(nearby: string): any[] {
        if (!nearby || nearby.length <= 0) {
            return [];
        }

        const [lat, lon, dist] = nearby.split('_');
        if (! (lat && lon && dist)) {
            return [];
        }

        return [lat, lon, dist];
    }

    public joinNearbyPos(rawValues: {}): string {
        const [lat, lon, dist] = this.extractNearbyPos(rawValues['nearby']);
        let nearby = '';
        if (lat && lon && dist && rawValues['nearbyAddress']) {
            nearby = [lat, lon, rawValues['nearbyDistance']].join('_');
        }

        return nearby;
    }
}
