import {Injectable} from '@angular/core';
import {TourDocSearchResult} from '../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {CommonDocSearchFormUtils} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-searchform-utils.service';

@Injectable()
export class TourDocSearchFormUtils extends CommonDocSearchFormUtils {

    constructor(protected searchFormUtils: SearchFormUtils, protected searchParameterUtils: SearchParameterUtils) {
        super(searchFormUtils, searchParameterUtils);
    }

    getWhereValues(searchResult: TourDocSearchResult): any[] {
         return this.searchFormUtils.getFacetValues(searchResult, 'loc_lochirarchie_txt', '', '');
    }

    getActionTypeValues(searchResult: TourDocSearchResult): any[] {
         return this.searchFormUtils.getFacetValues(searchResult, 'actiontype_ss', '', '');
    }

    getPersonalRateOverallValues(searchResult: TourDocSearchResult): any[] {
         return this.searchFormUtils.getFacetValues(searchResult, 'rate_pers_gesamt_is', '', 'filter.tdocratepers.gesamt.');
    }

    getPersonalRateDifficultyValues(searchResult: TourDocSearchResult): any[] {
         return this.searchFormUtils.getFacetValues(searchResult, 'rate_pers_schwierigkeit_is', '',
                'label.tdocratepers.schwierigkeit.');
    }

    getTechRateOverallValues(searchResult: TourDocSearchResult): any[] {
         return this.searchFormUtils.getFacetValues(searchResult, 'rate_tech_overall_ss', '', '');
    }

    getTechDataAscentValues(searchResult: TourDocSearchResult): any[] {
         return this.searchFormUtils.getFacetValues(searchResult, 'data_tech_alt_asc_facet_is', '', '');
    }

    getTechDataAltitudeMaxValues(searchResult: TourDocSearchResult): any[] {
         return this.searchFormUtils.getFacetValues(searchResult, 'data_tech_alt_max_facet_is', '', '');
    }

    getTechDataDistanceValues(searchResult: TourDocSearchResult): any[] {
         return this.searchFormUtils.getFacetValues(searchResult, 'data_tech_dist_facets_fs', '', '');
    }

    getTechDataDurationValues(searchResult: TourDocSearchResult): any[] {
         return this.searchFormUtils.getFacetValues(searchResult, 'data_tech_dur_facet_fs', '', '');
    }

    getObjectsValues(searchResult: TourDocSearchResult): any[] {
        return this.searchFormUtils.getFacetValues(searchResult, 'objects_txt', '', '');
    }

    getObjectDetectionCategoryValues(searchResult: TourDocSearchResult): any[] {
        return this.searchFormUtils.getFacetValues(searchResult, 'odcats_txt', '', '');
    }

    getObjectDetectionDetectorValues(searchResult: TourDocSearchResult): any[] {
        return this.searchFormUtils.getFacetValues(searchResult, 'oddetectors_txt', '', '');
    }

    getObjectDetectionKeyValues(searchResult: TourDocSearchResult): any[] {
        return this.searchFormUtils.getFacetValues(searchResult, 'odkeys_txt', '', '');
    }

    getObjectDetectionPrecisionValues(searchResult: TourDocSearchResult): any[] {
        return this.searchFormUtils.getFacetValues(searchResult, 'odprecision_is', '', '');
    }

    getObjectDetectionStateValues(searchResult: TourDocSearchResult): any[] {
        return this.searchFormUtils.getFacetValues(searchResult, 'odstates_ss', '', 'label.odimgobject.state.');
    }

    getPersonValues(searchResult: TourDocSearchResult): any[] {
         return this.searchFormUtils.getFacetValues(searchResult, 'persons_txt', '', '');
    }

    getRouteValues(searchResult: TourDocSearchResult): any[] {
         return this.searchFormUtils.getFacetValues(searchResult, 'route_id_is', '', '');
    }

    getTrackValues(searchResult: TourDocSearchResult): any[] {
        return this.searchFormUtils.getFacetValues(searchResult, 'track_id_is', '', '');
    }

    getTripValues(searchResult: TourDocSearchResult): any[] {
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
