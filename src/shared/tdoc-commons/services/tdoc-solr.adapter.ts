import {GenericSolrAdapter} from '@dps/mycms-commons/dist/search-commons/services/generic-solr.adapter';
import {TourDocRecord} from '../model/records/tdoc-record';
import {TourDocSearchForm} from '../model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../model/container/tdoc-searchresult';
import {TourDocAdapterResponseMapper} from './tdoc-adapter-response.mapper';
import {SolrConfig} from '@dps/mycms-commons/dist/search-commons/services/solr-query.builder';
import {Mapper} from 'js-data';
import {AdapterFilterActions} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';

export class TourDocSolrAdapter extends GenericSolrAdapter<TourDocRecord, TourDocSearchForm, TourDocSearchResult> {

    public static solrConfig: SolrConfig = {
        spatialField: 'geo_loc_p',
        spatialSortKey: 'distance',
        fieldList: ['id', 'image_id_i', 'loc_id_i', 'route_id_i', 'track_id_i', 'trip_id_i', 'news_id_i', 'video_id_i', 'info_id_i',
            'image_similar_id_i', 'dateshow_dt', 'desc_txt', 'desc_md_txt', 'desc_html_txt', 'geo_lon_s', 'geo_lat_s', 'geo_loc_p',
            'data_tech_alt_asc_i', 'data_tech_alt_desc_i', 'data_tech_alt_min_i', 'data_tech_alt_max_i',
            'data_tech_dist_f', 'data_tech_dur_f',
            'data_info_guides_s', 'data_info_region_s', 'data_info_baseloc_s', 'data_info_destloc_s',
            'info_name_s', 'info_desc_txt', 'info_shortdesc_txt', 'info_publisher_s', 'info_reference_s', 'info_tif_linked_details_s',
            'info_lif_linked_details_s', 'info_type_s',
            'rate_pers_ausdauer_i', 'rate_pers_bildung_i', 'rate_pers_gesamt_i', 'rate_pers_kraft_i', 'rate_pers_mental_i',
            'rate_pers_motive_i', 'rate_pers_schwierigkeit_i', 'rate_pers_wichtigkeit_i',
            'rate_tech_overall_s', 'rate_tech_ks_s', 'rate_tech_firn_s', 'rate_tech_gletscher_s', 'rate_tech_klettern_s',
            'rate_tech_bergtour_s', 'rate_tech_schneeschuh_s',
            'gpstracks_basefile_s', 'keywords_txt', 'loc_lochirarchie_s', 'loc_lochirarchie_ids_s', 'name_s', 'type_s',
            'objects_txt', 'persons_txt', 'actiontype_ss', 'subtype_s', 'i_fav_url_txt', 'v_fav_url_txt',
            'navigation_objects_txt', 'extended_object_properties_txt'],
        facetConfigs: {
            'id_notin_is': {
                filterField: 'id',
                action: AdapterFilterActions.NOTIN
            },
            'actiontype_ss': {
                'f.actiontype_ss.facet.limit': '-1',
                'f.actiontype_ss.facet.sort': 'index'
            },
            'data_tech_alt_asc_facet_is': {
                'f.data_tech_alt_asc_facet_is.facet.limit': '-1',
                'f.data_tech_alt_asc_facet_is.facet.sort': 'index'
            },
            'data_tech_alt_max_facet_is': {
                'f.data_tech_alt_max_facet_is.facet.limit': '-1',
                'f.data_tech_alt_max_facet_is.facet.sort': 'index'
            },
            'data_tech_dist_facets_fs': {
                'f.data_tech_dist_facets_fs.facet.limit': '-1',
                'f.data_tech_dist_facets_fs.facet.sort': 'index'
            },
            'data_tech_dur_facet_fs': {
                'f.data_tech_dur_facet_fs.facet.limit': '-1',
                'f.data_tech_dur_facet_fs.facet.sort': 'index'
            },
            'done_ss': {
                'f.done_ss.facet.limit': '-1',
                'f.done_ss.facet.sort': 'index'
            },
            'keywords_txt': {
                'f.keywords_txt.facet.prefix': 'kw_',
                'f.keywords_txt.facet.limit': '-1',
                'f.keywords_txt.facet.sort': 'count'
            },
            'loc_id_i': {},
            'loc_lochirarchie_txt': {},
            'month_is': {
                'f.month_is.facet.limit': '-1',
                'f.month_is.facet.sort': 'index'
            },
            'objects_txt': {
                'f.objects_txt.facet.limit': '-1',
                'f.objects_txt.facet.sort': 'index'
            },
            'odcats_txt': {
                noFacet: true
            },
            'oddetectors_txt': {
                noFacet: true
            },
            'odkeys_txt': {
                noFacet: true
            },
            'odprecision_is': {
                noFacet: true
            },
            'odstates_ss': {
                noFacet: true
            },
            'persons_txt': {
                'f.persons_txt.facet.limit': '-1',
                'f.persons_txt.facet.sort': 'index'
            },
            'playlists_txt': {
            },
            'rate_pers_gesamt_is': {
                'f.rate_pers_gesamt_is.facet.limit': '-1',
                'f.rate_pers_gesamt_is.facet.sort': 'index'
            },
            'rate_pers_schwierigkeit_is': {
                'f.rate_pers_schwierigkeit_is.facet.limit': '-1',
                'f.rate_pers_schwierigkeit_is.facet.sort': 'index'
            },
            'rate_tech_overall_ss': {
                'f.rate_tech_overall_ss.facet.limit': '-1',
                'f.rate_tech_overall_ss.facet.sort': 'index'
            },
            'subtype_ss': {
                'f.subtype_ss.facet.limit': '-1',
                'f.subtype_ss.facet.sort': 'index'
            },
            'type_txt': {},
            'week_is': {
                'f.week_is.facet.limit': '-1',
                'f.week_is.facet.sort': 'index'
            },
            'year_is': {
                'f.year_is.facet.limit': '-1',
                'f.year_is.facet.sort': 'index'
            }
        },
        commonSortOptions: {
            'bq': 'type_s:ROUTE^1.4 type_s:LOCATION^1.3 type_s:TRACK^1.2 type_s:TRIP^1.2 type_s:NEWS^1.1 type_s:INFO^1.1 type_s:VIDEO^1.1 type_s:IMAGE^1' +
            ' _val_:"div(rate_pers_gesamt_i, 10)"',
            'qf': 'html_txt^12.0 name_txt^10.0 desc_txt^8.0 keywords_txt^6.0 loc_lochirarchie_txt^4.0',
            'defType': 'edismax',
            'boost': 'recip(rord(date_dts),1,1000,1000)'
        },
        sortMapping: {
            'date': {
                'sort': 'datesort_dt desc'
            },
            'dateAsc': {
                'sort': 'datesort_dt asc'
            },
            'distance': {
                'sort': 'geodist() asc'
            },
            'dataTechDurDesc': {
                'sort': 'data_tech_dur_f desc'
            },
            'dataTechAltDesc': {
                'sort': 'data_tech_alt_asc_i desc'
            },
            'dataTechMaxDesc': {
                'sort': 'data_tech_alt_max_i desc'
            },
            'dataTechDistDesc': {
                'sort': 'data_tech_dist_f desc'
            },
            'dataTechDurAsc': {
                'sort': 'data_tech_dur_f asc'
            },
            'dataTechAltAsc': {
                'sort': 'data_tech_alt_asc_i asc'
            },
            'dataTechMaxAsc': {
                'sort': 'data_tech_alt_max_i asc'
            },
            'dataTechDistAsc': {
                'sort': 'data_tech_dist_f asc'
            },
            'ratePers': {
                'sort': 'sub(15, rate_pers_gesamt_i) asc, datesort_dt desc',
                'bq':  'type_s:ROUTE^1.4 type_s:LOCATION^1.3 type_s:TRACK^1.2 type_s:TRIP^1.2 type_s:NEWS^1.1 type_s:VIDEO^1.1 type_s:IMAGE^1',
                'boost': 'product( recip( rord(date_dts), 1, 1000, 1000), 1)'
            },
            'location': {
                'sort': 'loc_lochirarchie_s asc'
            },
            'countImages': {
                'sort': 'count_images_i asc'
            },
            'countImagesDesc': {
                'sort': 'count_images_i desc'
            },
            'countImagesTop': {
                'sort': 'count_images_top_i asc'
            },
            'countImagesTopDesc': {
                'sort': 'count_images_top_i desc'
            },
            'countInfos': {
                'sort': 'count_infos_i asc'
            },
            'countInfosDesc': {
                'sort': 'count_infos_i desc'
            },
            'countLocations': {
                'sort': 'count_locations_i asc'
            },
            'countLocationsDesc': {
                'sort': 'count_locations_i desc'
            },
            'countNews': {
                'sort': 'count_news_i asc'
            },
            'countNewsDesc': {
                'sort': 'count_news_i desc'
            },
            'countRoutes': {
                'sort': 'count_routes_i asc'
            },
            'countRoutesDesc': {
                'sort': 'count_routes_i desc'
            },
            'countTracks': {
                'sort': 'count_tracks_i asc'
            },
            'countTracksDesc': {
                'sort': 'count_tracks_i desc'
            },
            'countTrips': {
                'sort': 'count_trips_i asc'
            },
            'countTripsDesc': {
                'sort': 'count_trips_i desc'
            },
            'countVideos': {
                'sort': 'count_videos_i asc'
            },
            'countVideosDesc': {
                'sort': 'count_videos_i desc'
            },
            'relevance': {
            }
        },
        filterMapping: {
            'html': 'html_txt'
        },
        fieldMapping: {}
    };

    constructor(config: any) {
        super(config, new TourDocAdapterResponseMapper(config));
    }

    mapToAdapterDocument(props: any): any {
        return this.mapper.mapToAdapterDocument({}, props);
    }

    create(mapper: Mapper, record: any, opts?: any): Promise<TourDocRecord> {
        opts = opts || {};
        if (opts.realSource) {
            record = opts.realSource;
        }

        return super.create(mapper, record, opts);
    }

    update(mapper: Mapper, id: string | number, record: any, opts?: any): Promise<TourDocRecord> {
        opts = opts || {};
        if (opts.realSource) {
            record = opts.realSource;
        }

        return super.update(mapper, id, record, opts);
    }

    getHttpEndpoint(method: string): string {
        const updateMethods = ['create', 'destroy', 'update'];
        if (updateMethods.indexOf(method.toLowerCase()) >= 0) {
            return 'update?';
        }
        return 'select?';
    }

    getSolrConfig(): SolrConfig {
        return TourDocSolrAdapter.solrConfig;
    }
}

