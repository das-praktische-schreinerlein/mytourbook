import {TourDocRecord} from '../model/records/tdoc-record';
import {TourDocSearchForm} from '../model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../model/container/tdoc-searchresult';
import {TourDocAdapterResponseMapper} from './tdoc-adapter-response.mapper';
import {ItemsJsConfig} from '@dps/mycms-commons/dist/search-commons/services/itemsjs-query.builder';
import {GenericItemsJsAdapter} from '@dps/mycms-commons/dist/search-commons/services/generic-itemsjs.adapter';

export class TourDocItemsJsAdapter extends GenericItemsJsAdapter<TourDocRecord, TourDocSearchForm, TourDocSearchResult> {
    public static itemsJsConfig: ItemsJsConfig = {
        spatialField: 'geo_loc_p',
        spatialSortKey: 'distance',
        searchableFields: ['id', 'image_id_i', 'video_id_i', 'loc_id_i', 'route_id_i', 'track_id_i', 'trip_id_i', 'news_id_i',
            'dateshow_dt', 'datestart_dt', 'dateend_dt', 'desc_txt', 'desc_md_txt', 'desc_html_txt', 'geo_lon_s', 'geo_lat_s', 'geo_loc_p',
            'data_tech_alt_asc_i', 'data_tech_alt_desc_i', 'data_tech_alt_min_i', 'data_tech_alt_max_i',
            'data_tech_dist_f', 'data_tech_dur_f',
            'data_info_guides_s', 'data_info_region_s', 'data_info_baseloc_s', 'data_info_destloc_s',
            'rate_pers_ausdauer_i', 'rate_pers_bildung_i', 'rate_pers_gesamt_i', 'rate_pers_kraft_i', 'rate_pers_mental_i',
            'rate_pers_motive_i', 'rate_pers_schwierigkeit_i', 'rate_pers_wichtigkeit_i',
            'rate_tech_overall_s', 'rate_tech_ks_s', 'rate_tech_firn_s', 'rate_tech_gletscher_s', 'rate_tech_klettern_s',
            'rate_tech_bergtour_s', 'rate_tech_schneeschuh_s',
            'gpstracks_basefile_s', 'keywords_txt', 'loc_lochirarchie_s', 'loc_lochirarchie_ids_s', 'name_s', 'type_s',
            'objects_txt', 'playlists_txt', 'persons_txt',
            'actiontype_ss', 'subtype_s', 'i_fav_url_txt'],
        aggregations: {
            'actiontype_ss': {
            },
            'data_tech_alt_asc_facet_is': {
            },
            'data_tech_alt_max_facet_is': {
            },
            'data_tech_dist_facets_fs': {
            },
            'data_tech_dur_facet_fs': {
            },
            'keywords_txt': {
            },
            'month_is': {
            },
            'loc_lochirarchie_txt': {},
            'objects_txt': {
            },
            'persons_txt': {
            },
            'playlists_txt': {
            },
            'rate_pers_gesamt_is': {
            },
            'rate_pers_schwierigkeit_is': {
            },
            'rate_tech_overall_ss': {
            },
            'subtype_ss': {
            },
            'type_txt': {},
            'id': {},
            'track_id_i': {},
            'track_id_is': {},
            'week_is': {
            }
        },
        sortings: {
            'date': {
                'field': 'dateonly_s',
                'order:': 'desc'
            },
            'dateAsc': {
                'sort': 'date_dt',
                'order:': 'asc'
            },
            'distance': {
                'sort': 'geodist()',
                'order:': 'asc'
            },
            'dataTechDurDesc': {
                'sort': 'data_tech_dur_f',
                'order:': 'desc'
            },
            'dataTechAltDesc': {
                'sort': 'data_tech_alt_asc_i',
                'order:': 'desc'
            },
            'dataTechMaxDesc': {
                'sort': 'data_tech_alt_max_i',
                'order:': 'desc'
            },
            'dataTechDistDesc': {
                'sort': 'data_tech_dist_f',
                'order:': 'desc'
            },
            'dataTechDurAsc': {
                'sort': 'data_tech_dur_f',
                'order:': 'asc'
            },
            'dataTechAltAsc': {
                'sort': 'data_tech_alt_asc_i',
                'order:': 'asc'
            },
            'dataTechMaxAsc': {
                'sort': 'data_tech_alt_max_i',
                'order:': 'asc'
            },
            'dataTechDistAsc': {
                'sort': 'data_tech_dist_f',
                'order:': 'asc'
            },
            'ratePers': {
                'sort': 'rate_pers_gesamt_i',
                'order:': 'desc'
            },
            'location': {
                'sort': 'loc_lochirarchie_s',
                'order:': 'asc'
            },
            'relevance': {
            }
        },
        filterMapping: {
            'html': 'html_txt',
            'track_id_is': 'track_id_i'
        },
        fieldMapping: {
        }
    };

    constructor(config: any, data: any) {
        super(config, new TourDocAdapterResponseMapper(config), data, TourDocItemsJsAdapter.itemsJsConfig);
    }

    mapToAdapterDocument(props: any): any {
        const values = {
            id: props.id,
            image_id_i: props.imageId,
            video_id_i: props.videoId,
            loc_id_i: props.locId,
            route_id_i: props.routeId,
            track_id_i: props.trackId,
            trip_id_i: props.tripId,
            news_id_i: props.newsId,
            dateshow_dt: props.dateshow,
            datestart_dt: props.datestart,
            dateend_dt: props.dateend,
            desc_txt: props.descTxt,
            desc_md_txt: props.descMd,
            desc_html_txt: props.descHtml,
            geo_lon_s: props.geoLon,
            geo_lat_s: props.geoLat,
            geo_loc_p: props.geoLoc,
            gpstracks_basefile_s: props.gpsTrackBasefile,
            keywords_txt: (props.keywords ? props.keywords.split(', ').join(',,KW_') : ''),
            loc_lochirarchie_s: (props.locHirarchie ? props.locHirarchie
                .toLowerCase()
                .replace(/[ ]*->[ ]*/g, ',,')
                .replace(/ /g, '_') : ''),
            loc_lochirarchie_ids_s: (props.locHirarchieIds ? props.locHirarchieIds
                .toLowerCase()
                .replace(/,/g, ',,')
                .replace(/ /g, '_') : ''),
            name_s: props.name,
            objects_txt: (props.objects ? props.objects.split(', ').join(',,') : ''),
            persons_txt: (props.persons ? props.persons.split(', ').join(',,') : ''),
            playlists_txt: (props.playlists ? props.playlists.split(', ').join(',,') : ''),
            type_s: props.type,

        };

        values['html_txt'] = [values.desc_txt, values.name_s, values.keywords_txt, values.type_s].join(' ');

        return values;
    }

    getItemsJsConfig(): ItemsJsConfig {
        return TourDocItemsJsAdapter.itemsJsConfig;
    }
}

