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
        return [].concat(
            this.getFacetValues(searchResult, 'year_is', 'year', ''),
            this.getFacetValues(searchResult, 'month_is', 'month', 'Monat'),
            this.getFacetValues(searchResult, 'week_is', 'week', 'Woche'));
    }

    getWhereValues(searchResult: SDocSearchResult): any[] {
         return this.getFacetValues(searchResult, 'loc_lochirarchie_txt', '', '');
    }

    getWhatValues(searchResult: SDocSearchResult): any[] {
         return this.getFacetValues(searchResult, 'keywords_txt', '', '');
    }

    getActionTypeValues(searchResult: SDocSearchResult): any[] {
         return this.getFacetValues(searchResult, 'actiontype_ss', '', '');
    }

    getTypeValues(searchResult: SDocSearchResult): any[] {
         return this.getFacetValues(searchResult, 'type_txt', '', '');
    }

    getTypeLimit(searchResult: SDocSearchResult): number {
        if (searchResult === undefined || searchResult.facets === undefined || searchResult.facets.facets.size === 0) {
            return 0;
        }

        return this.searchParameterUtils.extractFacetSelectLimit(searchResult.facets, 'type_txt');
    }

    getPersonalRateOverallValues(searchResult: SDocSearchResult): any[] {
         return this.getFacetValues(searchResult, 'rate_pers_gesamt_is', '', 'filter.sdocratepers.gesamt.');
    }

    getPersonalRateDifficultyValues(searchResult: SDocSearchResult): any[] {
         return this.getFacetValues(searchResult, 'rate_pers_schwierigkeit_is', '',
                'label.sdocratepers.schwierigkeit.');
    }

    getTechRateOverallValues(searchResult: SDocSearchResult): any[] {
         return this.getFacetValues(searchResult, 'rate_tech_overall_ss', '', '');
    }

    getTechDataAscentValues(searchResult: SDocSearchResult): any[] {
         return this.getFacetValues(searchResult, 'data_tech_alt_asc_facet_is', '', '');
    }

    getTechDataAltitudeMaxValues(searchResult: SDocSearchResult): any[] {
         return this.getFacetValues(searchResult, 'data_tech_alt_max_facet_is', '', '');
    }

    getTechDataDistanceValues(searchResult: SDocSearchResult): any[] {
         return this.getFacetValues(searchResult, 'data_tech_dist_facets_fs', '', '');
    }

    getTechDataDurationValues(searchResult: SDocSearchResult): any[] {
         return this.getFacetValues(searchResult, 'data_tech_dur_facet_fs', '', '');
    }

    getPlaylistValues(searchResult: SDocSearchResult): any[] {
         return this.getFacetValues(searchResult, 'playlists_txt', '', '');
    }

    getPersonValues(searchResult: SDocSearchResult): any[] {
         return this.getFacetValues(searchResult, 'persons_txt', '', '');
    }

    getRouteValues(searchResult: SDocSearchResult): any[] {
         return this.getFacetValues(searchResult, 'route_id_is', '', '');
    }

    getTrackValues(searchResult: SDocSearchResult): any[] {
        return this.getFacetValues(searchResult, 'track_id_is', '', '');
    }

    getTripValues(searchResult: SDocSearchResult): any[] {
        return this.getFacetValues(searchResult, 'trip_id_is', '', '');
    }

    getFacetValues(searchResult: SDocSearchResult, facetName: string, valuePrefix: string, labelPrefix: string): any[] {
        if (searchResult === undefined || searchResult.facets === undefined || searchResult.facets.facets.size === 0) {
            return [];
        }

        return [].concat(
            this.searchParameterUtils.extractFacetValues(searchResult.facets, facetName, valuePrefix, labelPrefix));
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

    prepareExtendedSelectValues(src: any[]): any[] {
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
