import {Injectable} from '@angular/core';
import {SDocSearchResult} from '../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {SearchFormUtils} from '../../../shared/angular-commons/services/searchform-utils.service';
import {SearchParameterUtils} from '../../../shared/search-commons/services/searchparameter.utils';
import {CommonDocSearchFormUtils} from '../../../shared/frontend-commons/services/cdoc-searchform-utils.service';

@Injectable()
export class SDocSearchFormUtils extends CommonDocSearchFormUtils {

    constructor(protected searchFormUtils: SearchFormUtils, protected searchParameterUtils: SearchParameterUtils) {
        super(searchFormUtils, searchParameterUtils);
    }

    getWhereValues(searchResult: SDocSearchResult): any[] {
         return this.searchFormUtils.getFacetValues(searchResult, 'loc_lochirarchie_txt', '', '');
    }

    getActionTypeValues(searchResult: SDocSearchResult): any[] {
         return this.searchFormUtils.getFacetValues(searchResult, 'actiontype_ss', '', '');
    }

    getPersonalRateOverallValues(searchResult: SDocSearchResult): any[] {
         return this.searchFormUtils.getFacetValues(searchResult, 'rate_pers_gesamt_is', '', 'filter.sdocratepers.gesamt.');
    }

    getPersonalRateDifficultyValues(searchResult: SDocSearchResult): any[] {
         return this.searchFormUtils.getFacetValues(searchResult, 'rate_pers_schwierigkeit_is', '',
                'label.sdocratepers.schwierigkeit.');
    }

    getTechRateOverallValues(searchResult: SDocSearchResult): any[] {
         return this.searchFormUtils.getFacetValues(searchResult, 'rate_tech_overall_ss', '', '');
    }

    getTechDataAscentValues(searchResult: SDocSearchResult): any[] {
         return this.searchFormUtils.getFacetValues(searchResult, 'data_tech_alt_asc_facet_is', '', '');
    }

    getTechDataAltitudeMaxValues(searchResult: SDocSearchResult): any[] {
         return this.searchFormUtils.getFacetValues(searchResult, 'data_tech_alt_max_facet_is', '', '');
    }

    getTechDataDistanceValues(searchResult: SDocSearchResult): any[] {
         return this.searchFormUtils.getFacetValues(searchResult, 'data_tech_dist_facets_fs', '', '');
    }

    getTechDataDurationValues(searchResult: SDocSearchResult): any[] {
         return this.searchFormUtils.getFacetValues(searchResult, 'data_tech_dur_facet_fs', '', '');
    }

    getPersonValues(searchResult: SDocSearchResult): any[] {
         return this.searchFormUtils.getFacetValues(searchResult, 'persons_txt', '', '');
    }

    getRouteValues(searchResult: SDocSearchResult): any[] {
         return this.searchFormUtils.getFacetValues(searchResult, 'route_id_is', '', '');
    }

    getTrackValues(searchResult: SDocSearchResult): any[] {
        return this.searchFormUtils.getFacetValues(searchResult, 'track_id_is', '', '');
    }

    getTripValues(searchResult: SDocSearchResult): any[] {
        return this.searchFormUtils.getFacetValues(searchResult, 'trip_id_is', '', '');
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
