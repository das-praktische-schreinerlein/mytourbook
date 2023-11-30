import {TourDocRecord} from '../model/records/tdoc-record';
import {TourDocSearchForm} from '../model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../model/container/tdoc-searchresult';
import {TourDocAdapterResponseMapper} from './tdoc-adapter-response.mapper';
import {ItemsJsConfig} from '@dps/mycms-commons/dist/search-commons/services/itemsjs-query.builder';
import {GenericItemsJsAdapter} from '@dps/mycms-commons/dist/search-commons/services/generic-itemsjs.adapter';
import {ExtendedItemsJsConfig} from '@dps/mycms-commons/dist/search-commons/services/itemsjs.dataimporter';

// tslint:disable:no-console
export class TourDocItemsJsAdapter extends GenericItemsJsAdapter<TourDocRecord, TourDocSearchForm, TourDocSearchResult> {
    public static itemsJsConfig: ExtendedItemsJsConfig = {
        skipMediaCheck: true,
        aggregationFields: ['id', 'image_id_i', 'loc_id_i', 'route_id_i', 'destination_id_s', 'track_id_i',
            'trip_id_i', 'news_id_i', 'video_id_i', 'info_id_i', 'poi_id_i', 'image_similar_id_i', 'loc_parent_id_i'],
        refConfigs: [
            { containerField: 'linkedinfos_clob', refField: 'refId', idPrefix: 'INFO_', filterFields: ['info_id_i', 'info_id_is']},
            { containerField: 'linkedplaylists_clob', refField: 'refId', idPrefix: 'PLAYLIST_', filterFields: ['playlist_id_i', 'playlist_id_is']},
            { containerField: 'linkedpois_clob', refField: 'refId', idPrefix: 'POI_', filterFields: ['poi_id_i', 'poi_id_is']},
            { containerField: 'linkedroutes_clob', refField: 'refId', idPrefix: 'ROUTE_', filterFields: ['route_id_i', 'route_id_is']}
        ],
        spatialField: 'geo_loc_p',
        spatialSortKey: 'distance',
        searchableFields: ['id', 'image_id_i', 'loc_id_i', 'route_id_i', 'destination_id_s', 'track_id_i', 'trip_id_i',
            'news_id_i', 'video_id_i', 'info_id_i', 'poi_id_i',
            'image_similar_id_i', 'dateshow_dt', 'desc_txt', 'desc_md_txt', 'desc_html_txt', 'geo_lon_s', 'geo_lat_s', 'geo_loc_p',
            'data_info_guides_s', 'data_info_region_s', 'data_info_baseloc_s', 'data_info_destloc_s', 'data_info_section_details_s',
            'info_name_s', 'info_desc_txt', 'info_shortdesc_txt', 'info_publisher_s', 'info_reference_s', 'info_tif_linked_details_s',
            'info_lif_linked_details_s', 'info_type_s',
            'rate_tech_overall_s', 'rate_tech_ks_s', 'rate_tech_firn_s', 'rate_tech_gletscher_s', 'rate_tech_klettern_s',
            'rate_tech_bergtour_s', 'rate_tech_schneeschuh_s',
            'keywords_txt', 'loc_lochirarchie_s', 'loc_lochirarchie_ids_s', 'name_s', 'type_s',
            'objects_txt', 'persons_txt', 'actiontype_ss', 'subtype_s', 'i_fav_url_txt', 'v_fav_url_txt', 'route_attr_ss',
            'navigation_objects_clob', 'extended_object_properties_clob',
            'linkedroutes_clob', 'linkedinfos_clob', 'linkedplaylists_clob', 'linkedpois_clob',
            'i_objectdetections_clob', 'v_objectdetections_clob',
            'html'],
        aggregations: {
            'loc_parent_id_i': {
                conjunction: false,
                mapField: 'loc_id_parent_i',
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'actiontype_ss': {
                conjunction: false,
                mapField: 'actiontype_s',
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'data_tech_alt_asc_facet_is': {
                filterFunction: function(record) {
                    return record['data_tech_alt_asc_i']
                        ? (Math.round(record['data_tech_alt_asc_i'] / 500) * 500).toFixed(0)
                        : undefined
                },
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'data_tech_alt_max_facet_is': {
                filterFunction: function(record) {
                    return record['data_tech_alt_max_i']
                        ? (Math.round(record['data_tech_alt_max_i'] / 500) * 500).toFixed(0)
                        : undefined
                },
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'data_tech_dist_facets_fs': {
                filterFunction: function(record) {
                    return record['data_tech_dist_f']
                        ? (Math.round(record['data_tech_dist_f'] / 5) * 5).toFixed(0)
                        : undefined
                },
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'data_tech_dur_facet_fs': {
                filterFunction: function(record) {
                    return record['data_tech_dur_f']
                        ? (Math.round(record['data_tech_dur_f'] * 2) / 2).toFixed(1)
                        : undefined
                },
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'done_ss': {
                mapField: 'dateshow_dt',
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: false,
                size: 1000
            },
            'gpstracks_state_is': {
                mapField: 'gpstracks_state_i',
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: false,
                size: 1000
            },
            'keywords_txt': {
                filterFunction: function(record) {
                    return record['keywords_txt']
                        ? record['keywords_txt'].replace(/,,/g, ',').split(',')
                        : undefined
                },
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'month_is': {
                filterFunction: function(record) {
                    return record['dateshow_dt']
                        ? new Date(record['dateshow_dt']).getMonth() + 1
                        : undefined
                },
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'loc_lochirarchie_txt': {
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'objects_txt': {
                filterFunction: function(record) {
                    return record['objects_txt']
                        ? record['objects_txt'].replace(/,,/g, ',').split(',')
                        : undefined
                },
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'persons_txt': {
                filterFunction: function(record) {
                    return record['persons_txt']
                        ? record['persons_txt'].replace(/,,/g, ',').split(',')
                        : undefined
                },
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'playlists_txt': {
                filterFunction: function(record) {
                    return record['playlists_txt']
                        ? record['playlists_txt'].replace(/,,/g, ',').split(',')
                        : undefined
                },
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'rate_pers_gesamt_is': {
                mapField: 'rate_pers_gesamt_i',
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'rate_pers_schwierigkeit_is': {
                mapField: 'rate_pers_schwierigkeit_i',
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'rate_tech_overall_ss': {
                mapField: 'rate_tech_overall_s',
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'subtype_ss': {
                mapField: 'subtype_s',
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'type_ss': {
                mapField: 'type_s',
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: false,
                size: 1000
            },
            'id': {
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'year_is': {
                filterFunction: function(record) {
                    return record['dateshow_dt']
                        ? new Date(record['dateshow_dt']).getFullYear()
                        : undefined
                },
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'UNDEFINED_FILTER': {
                mapField: 'id',
                field: 'id',
                conjunction: true,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            }
        },
        sortings: {
            'date': {
                field: ['dateshow_dt', 'rate_pers_gesamt_i', 'name_s'],
                order: ['desc', 'desc', 'asc']
            },
            'dateAsc': {
                field: ['dateshow_dt', 'rate_pers_gesamt_i', 'name_s'],
                order: ['asc', 'desc', 'asc']
            },
            'dataTechDurDesc': {
                field: ['data_tech_dur_f', 'rate_pers_gesamt_i', 'name_s'],
                order: ['desc', 'desc', 'asc']
            },
            'dataTechAltDesc': {
                field: ['data_tech_alt_asc_i', 'rate_pers_gesamt_i', 'name_s'],
                order: ['desc', 'desc', 'asc']
            },
            'dataTechMaxDesc': {
                field: ['data_tech_alt_max_i', 'rate_pers_gesamt_i', 'name_s'],
                order: ['desc', 'desc', 'asc']
            },
            'dataTechDistDesc': {
                field: ['data_tech_dist_f', 'rate_pers_gesamt_i', 'name_s'],
                order: ['desc', 'desc', 'asc']
            },
            'dataTechDurAsc': {
                field: ['data_tech_dur_f', 'rate_pers_gesamt_i', 'name_s'],
                order: ['asc', 'desc', 'asc']
            },
            'dataTechAltAsc': {
                field: ['data_tech_alt_asc_i', 'rate_pers_gesamt_i', 'name_s'],
                order: ['asc', 'desc', 'asc']
            },
            'dataTechMaxAsc': {
                field: ['data_tech_alt_max_i', 'rate_pers_gesamt_i', 'name_s'],
                order: ['asc', 'desc', 'asc']
            },
            'dataTechDistAsc': {
                field: ['data_tech_dist_f', 'rate_pers_gesamt_i', 'name_s'],
                order: ['asc', 'desc', 'asc']
            },
            'ratePers': {
                field: ['rate_pers_gesamt_i', 'dateshow_dt', 'name_s'],
                order: ['desc', 'desc', 'asc']
            },
            'location': {
                field: ['loc_lochirarchie_s', 'rate_pers_gesamt_i', 'name_s'],
                order: ['asc', 'desc', 'asc']
            },
            'locationDetails': {
                field: ['loc_lochirarchie_s', 'rate_pers_gesamt_i', 'name_s'],
                order: ['asc', 'desc', 'asc']
            },
            'name': {
                field: ['name_s'],
                order: ['asc']
            },
            'region': {
                field: ['data_info_region_s', 'name_s', 'rate_pers_gesamt_i'],
                order: ['asc', 'asc', 'desc']
            },
            'relevance': {
                field: ['dateshow_dt', 'id'],
                order: ['desc', 'desc']
            },
            'trackDate': {
                field: ['dateshow_dt', 'rate_pers_gesamt_i', 'name_s'],
                order: ['desc', 'desc', 'asc']
            },
            'trackDateAsc': {
                field: ['dateshow_dt', 'rate_pers_gesamt_i', 'name_s'],
                order: ['asc', 'desc', 'asc']
            },
            'tripDate': {
                field: ['dateshow_dt', 'rate_pers_gesamt_i', 'name_s'],
                order: ['desc', 'desc', 'asc']
            },
            'tripDateAsc': {
                field: ['dateshow_dt', 'rate_pers_gesamt_i', 'name_s'],
                order: ['asc', 'desc', 'asc']
            }
        },
        filterMapping: {
            'html': 'html_txt',
            'track_id_is': 'track_id_i'
        },
        fieldMapping: {
        }
    };

    constructor(config: any, records: any, itemsJsConfig: ExtendedItemsJsConfig) {
        console.debug('init itemsjs with config', itemsJsConfig, records ? records.length : 0);
        super(config, new TourDocAdapterResponseMapper(config), records, itemsJsConfig);
    }

    mapToAdapterDocument(props: any): any {
        return this.mapper.mapToAdapterDocument({}, props);
    }

    getItemsJsConfig(): ItemsJsConfig {
        return TourDocItemsJsAdapter.itemsJsConfig;
    }


}

