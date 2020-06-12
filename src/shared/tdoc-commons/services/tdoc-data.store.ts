import {GenericDataStore} from '@dps/mycms-commons/dist/search-commons/services/generic-data.store';
import {TourDocSearchResult} from '../model/container/tdoc-searchresult';
import {TourDocSearchForm} from '../model/forms/tdoc-searchform';
import {TourDocRecord} from '../model/records/tdoc-record';
import {Facets} from '@dps/mycms-commons/dist/search-commons/model/container/facets';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';

export class TourDocTeamFilterConfig {
    private values = new Map();

    get(key: string): any {
        return this.values.get(key);
    }

    set(key: string, value: any) {
        this.values.set(key, value);
    }
}

export class TourDocDataStore extends GenericDataStore<TourDocRecord, TourDocSearchForm, TourDocSearchResult> {

    static UPDATE_RELATION = ['tdocimage', 'tdocvideo', 'tdocdatatech', 'tdocdatainfo', 'tdocratepers', 'tdocratetech',
        'tdocodimageobject', 'tdocnavigationobject'];
    private validMoreNumberFilterNames = {
        track_id_i: true,
        track_id_is:  true,
        trip_id_i: true,
        trip_id_is: true,
        news_id_i: true,
        news_id_is: true,
        loc_id_i: true,
        loc_lochirarchie_ids_txt: true,
        image_id_i: true,
        video_id_i: true,
        route_id_i: true,
        route_id_is: true,
        unrated: true,
        noLocation: true,
        noRoute: true,
        loc_parent_id_i: true
    };
    private validMoreInFilterNames = {
        id: true,
        id_notin_is: true,
        destination_id_s: true,
        destination_id_ss:  true,
        doublettes: true,
        conflictingRates: true,
        noCoordinates: true,
        noFavoriteChildren: true,
        noMainFavoriteChildren: true,
        noSubType: true,
        objects_txt: true,
        persons_txt: true,
        playlists_txt: true,
        todoDesc: true,
        todoKeywords: true,
        unRatedChildren: true,
    };

    constructor(private searchParameterUtils: SearchParameterUtils, private teamFilterConfig: TourDocTeamFilterConfig) {
        super(TourDocDataStore.UPDATE_RELATION);
    }

    createQueryFromForm(searchForm: TourDocSearchForm): Object {
        const query = {};

        if (searchForm === undefined) {
            return query;
        }

        let filter: {} = undefined;
        let spatial: {} = undefined;
        if (searchForm.fulltext !== undefined && searchForm.fulltext.length > 0) {
            filter = filter || {};
            filter['html'] = {
                'likei': '%' + searchForm.fulltext + '%'
            };
        }
        if (searchForm.when !== undefined && searchForm.when.length > 0) {
            const keys = ['week', 'month', 'year'];
            const whenValues = this.searchParameterUtils.splitValuesByPrefixes(searchForm.when, ',', keys);
            for (const key of keys) {
                if (whenValues.has(key)) {
                    filter = filter || {};
                    filter[key + '_is'] = {
                        'in_number': this.searchParameterUtils.joinValuesAndReplacePrefix(whenValues.get(key), key, ',').split(/,/)
                    };
                }
            }
            const stringKeys = ['done'];
            const whenStringValues = this.searchParameterUtils.splitValuesByPrefixes(searchForm.when, ',', stringKeys);
            for (const key of stringKeys) {
                if (whenStringValues.has(key)) {
                    filter = filter || {};
                    filter[key + '_ss'] = {
                        'in': this.searchParameterUtils.joinValuesAndReplacePrefix(whenStringValues.get(key), key, ',').split(/,/)
                    };
                }
            }
        }

        if (searchForm.locId !== undefined && searchForm.locId.length > 0) {
            filter = filter || {};
            filter['loc_id_i'] = {
                'in_number': searchForm.locId.split(/,/)
            };
        }
        if (searchForm.nearby !== undefined && searchForm.nearby.length > 0) {
            if (searchForm.nearby) {
                spatial = spatial || {};
                spatial['geo_loc_p'] = {
                    'nearby': searchForm.nearby
                };
            }
        }
        if (searchForm.where !== undefined && searchForm.where.length > 0) {
            const whereValues = this.searchParameterUtils.splitValuesByPrefixes(searchForm.where, ',', ['locId', 'nearby']);
            if (whereValues.has('locId')) {
                filter = filter || {};
                filter['loc_id_i'] = {
                    'in_number': this.searchParameterUtils.joinValuesAndReplacePrefix(whereValues.get('locId'), 'locId', ',').split(/,/)
                };
            }
            if (whereValues.has('nearby')) {
                spatial = spatial || {};
                spatial['geo_loc_p'] = {
                    'nearby': this.searchParameterUtils.joinValuesAndReplacePrefix(whereValues.get('nearby'), 'nearby:', ',')
                };
            }
            if (whereValues.has('unknown')) {
                filter = filter || {};
                filter['loc_lochirarchie_txt'] = {
                    'in': this.searchParameterUtils.joinValuesAndReplacePrefix(whereValues.get('unknown'), '', ',').split(/,/)
                };
            }
        }
        if (searchForm.what !== undefined && searchForm.what.length > 0) {
            filter = filter || {};
            filter['keywords_txt'] = {
                'in': searchForm.what.split(/,/)
            };
        }
        if (searchForm.type !== undefined && searchForm.type.length > 0) {
            filter = filter || {};
            filter['type_txt'] = {
                'in': searchForm.type.split(/,/)
            };
        }
        if (searchForm.actiontype !== undefined && searchForm.actiontype.length > 0) {
            filter = filter || {};
            filter['actiontype_ss'] = {
                'in': searchForm.actiontype.split(/,/)
            };
        }
        if (searchForm.playlists !== undefined && searchForm.playlists.length > 0) {
            filter = filter || {};
            filter['playlists_txt'] = {
                'in': searchForm.playlists.split(/,/)
            };
        }
        if (searchForm.persons !== undefined && searchForm.persons.length > 0) {
            filter = filter || {};
            filter['persons_txt'] = {
                'in': searchForm.persons.split(/,/)
            };
        }
        if (searchForm.objects !== undefined && searchForm.objects.length > 0) {
            filter = filter || {};
            filter['objects_txt'] = {
                'in': searchForm.objects.split(/,/)
            };
        }
        if (searchForm.objectDetectionCategory !== undefined && searchForm.objectDetectionCategory.length > 0) {
            filter = filter || {};
            filter['odcats_txt'] = {
                'in': searchForm.objectDetectionCategory.split(/,/)
            };
        }
        if (searchForm.objectDetectionDetector !== undefined && searchForm.objectDetectionDetector.length > 0) {
            filter = filter || {};
            filter['oddetectors_txt'] = {
                'in': searchForm.objectDetectionDetector.split(/,/)
            };
        }
        if (searchForm.objectDetectionKey !== undefined && searchForm.objectDetectionKey.length > 0) {
            filter = filter || {};
            filter['odkeys_txt'] = {
                'in': searchForm.objectDetectionKey.split(/,/)
            };
        }
        if (searchForm.objectDetectionPrecision !== undefined && searchForm.objectDetectionPrecision.length > 0) {
            filter = filter || {};
            filter['odprecision_is'] = {
                'in': searchForm.objectDetectionPrecision.split(/,/)
            };
        } else {
        }
        if (searchForm.objectDetectionState !== undefined && searchForm.objectDetectionState.length > 0) {
            filter = filter || {};
            filter['odstates_ss'] = {
                'in': searchForm.objectDetectionState.split(/,/)
            };
        }

        if (searchForm.moreFilter !== undefined && searchForm.moreFilter.length > 0) {
            filter = filter || {};
            const moreFilters = searchForm.moreFilter.split(/;/);
            for (const index in moreFilters) {
                const moreFilter = moreFilters[index];
                const [filterName, values] = moreFilter.split(/:/);
                if (filterName && values && this.validMoreNumberFilterNames[filterName] === true) {
                    filter[filterName] = {
                        'in_number': values.split(/,/)
                    };
                } else if (filterName && values && this.validMoreInFilterNames[filterName] === true) {
                    filter[filterName] = {
                        'in': values.split(/,/)
                    };
                }

            }
        }

        if (searchForm.dashboardFilter !== undefined && searchForm.dashboardFilter.length > 0) {
            filter = filter || {};
            const moreFilters = searchForm.dashboardFilter.split(/;/);
            for (const index in moreFilters) {
                const moreFilter = moreFilters[index];
                let [filterName, values] = moreFilter.split(/:/);
                if (values === undefined && (filterName === 'noRoute' || filterName === 'noLocation')) {
                    values = 'null,0,1';
                }
                if (values === undefined && (filterName === 'noSubType')) {
                    values = 'null,ac_,ac_null,ac_0';
                }
                if (values === undefined && (filterName === 'todoDesc')) {
                    values = 'TODODESC';
                }
                if (values === undefined && (filterName === 'todoKeywords')) {
                    values = 'KW_TODOKEYWORDS';
                }
                if (values === undefined && (filterName === 'unrated')) {
                    values = 'null,0';
                }

                if (filterName && values && this.validMoreNumberFilterNames[filterName] === true) {
                    filter[filterName] = {
                        'in_number': values.split(/,/)
                    };
                } else if (filterName && this.validMoreInFilterNames[filterName] === true) {
                    filter[filterName] = {
                        'in': values ? values.split(/,/) : [filterName]
                    };
                }
            }
        }

        if (searchForm.techDataAltitudeMax !== undefined && searchForm.techDataAltitudeMax.length > 0) {
            filter = filter || {};
            filter['data_tech_alt_max_facet_is'] = {
                'in_number': searchForm.techDataAltitudeMax.split(/,/)
            };
        }
        if (searchForm.techDataAscent !== undefined && searchForm.techDataAscent.length > 0) {
            filter = filter || {};
            filter['data_tech_alt_asc_facet_is'] = {
                'in_number': searchForm.techDataAscent.split(/,/)
            };
        }
        if (searchForm.techDataDistance !== undefined && searchForm.techDataDistance.length > 0) {
            filter = filter || {};
            filter['data_tech_dist_facets_fs'] = {
                'in_number': searchForm.techDataDistance.split(/,/)
            };
        }
        if (searchForm.techDataDuration !== undefined && searchForm.techDataDuration.length > 0) {
            filter = filter || {};
            filter['data_tech_dur_facet_fs'] = {
                'in_number': searchForm.techDataDuration.split(/,/)
            };
        }
        if (searchForm.techRateOverall !== undefined && searchForm.techRateOverall.length > 0) {
            filter = filter || {};
            filter['rate_tech_overall_ss'] = {
                'in': searchForm.techRateOverall.split(/,/)
            };
        }
        if (searchForm.personalRateOverall !== undefined && searchForm.personalRateOverall.length > 0) {
            filter = filter || {};
            filter['rate_pers_gesamt_is'] = {
                'in': searchForm.personalRateOverall.split(/,/)
            };
        }
        if (searchForm.personalRateDifficulty !== undefined && searchForm.personalRateDifficulty.length > 0) {
            filter = filter || {};
            filter['rate_pers_schwierigkeit_is'] = {
                'in': searchForm.personalRateDifficulty.split(/,/)
            };
        }

        if (filter !== undefined) {
            query['where'] = filter;
        }
        if (spatial !== undefined) {
            query['spatial'] = spatial;
        }

        const additionalFilter = this.createThemeFilterQueryFromForm(searchForm);
        if (additionalFilter !== undefined) {
            query['additionalWhere'] = additionalFilter;
        }

        return query;
    }

    createThemeFilterQueryFromForm(searchForm: TourDocSearchForm): Object {
        let queryFilter: {} = undefined;
        if (searchForm === undefined) {
            return queryFilter;
        }

        let filter: {} = undefined;
        if (searchForm.theme !== undefined && searchForm.theme.length > 0 && this.teamFilterConfig.get(searchForm.theme)) {
            filter = filter || {};
            const themeFilter = this.teamFilterConfig.get(searchForm.theme);
            for (const filterProp in themeFilter) {
                filter[filterProp] = themeFilter[filterProp];
            }
        }

        if (filter !== undefined) {
            queryFilter = filter;
        }

        return queryFilter;
    }

    createSearchResult(searchForm: TourDocSearchForm, recordCount: number, records: TourDocRecord[], facets: Facets): TourDocSearchResult {
        return new TourDocSearchResult(searchForm, recordCount, records, facets);
    }

}
