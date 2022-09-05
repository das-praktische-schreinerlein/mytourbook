import {TourDocRecord, TourDocRecordRelation} from '../model/records/tdoc-record';
import {TourDocSearchForm} from '../model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../model/container/tdoc-searchresult';
import {TourDocAdapterResponseMapper} from './tdoc-adapter-response.mapper';
import {ItemsJsConfig} from '@dps/mycms-commons/dist/search-commons/services/itemsjs-query.builder';
import {GenericItemsJsAdapter} from '@dps/mycms-commons/dist/search-commons/services/generic-itemsjs.adapter';
import {Mapper} from 'js-data';
import {AdapterQuery} from '@dps/mycms-commons/src/search-commons/services/mapper.utils';
import {GenericAdapterResponseMapper} from '@dps/mycms-commons/src/search-commons/services/generic-adapter-response.mapper';
import {isNumeric} from 'rxjs/internal-compatibility';
import {ItemsJsSelectQueryData} from '@dps/mycms-commons/src/search-commons/services/itemsjs-query.builder';

export class TourDocItemsJsAdapter extends GenericItemsJsAdapter<TourDocRecord, TourDocSearchForm, TourDocSearchResult> {
    public static aggregationFields = ['id', 'image_id_i', 'loc_id_i', 'route_id_i', 'track_id_i', 'trip_id_i', 'news_id_i', 'video_id_i', 'info_id_i',
        'image_similar_id_i'];
    public static itemsJsConfig: ItemsJsConfig = {
        spatialField: 'geo_loc_p',
        spatialSortKey: 'distance',
        searchableFields: ['id', 'image_id_i', 'loc_id_i', 'route_id_i', 'track_id_i', 'trip_id_i', 'news_id_i', 'video_id_i', 'info_id_i',
            'image_similar_id_i', 'dateshow_dt', 'desc_txt', 'desc_md_txt', 'desc_html_txt', 'geo_lon_s', 'geo_lat_s', 'geo_loc_p',
            'data_tech_alt_asc_i', 'data_tech_alt_desc_i', 'data_tech_alt_min_i', 'data_tech_alt_max_i',
            'data_tech_dist_f', 'data_tech_dur_f', 'data_tech_sections_s',
            'data_info_guides_s', 'data_info_region_s', 'data_info_baseloc_s', 'data_info_destloc_s', 'data_info_section_details_s',
            'info_name_s', 'info_desc_txt', 'info_shortdesc_txt', 'info_publisher_s', 'info_reference_s', 'info_tif_linked_details_s',
            'info_lif_linked_details_s', 'info_type_s',
            'rate_pers_ausdauer_i', 'rate_pers_bildung_i', 'rate_pers_gesamt_i', 'rate_pers_kraft_i', 'rate_pers_mental_i',
            'rate_pers_motive_i', 'rate_pers_schwierigkeit_i', 'rate_pers_wichtigkeit_i',
            'rate_tech_overall_s', 'rate_tech_ks_s', 'rate_tech_firn_s', 'rate_tech_gletscher_s', 'rate_tech_klettern_s',
            'rate_tech_bergtour_s', 'rate_tech_schneeschuh_s',
            'gpstracks_basefile_s', 'keywords_txt', 'loc_lochirarchie_s', 'loc_lochirarchie_ids_s', 'name_s', 'type_s',
            'objects_txt', 'persons_txt', 'actiontype_ss', 'subtype_s', 'i_fav_url_txt', 'v_fav_url_txt', 'route_attr_ss',
            'navigation_objects_txt', 'extended_object_properties_txt', 'linkedroutes_txt', 'linkedinfos_txt', 'linkedplaylists_txt',
            'html'],
        aggregations: {
            'actiontype_ss': {
                conjunction: false,
                field: 'actiontype_ss',
                sort: ['selected', 'count', 'key'],
                order: ['desc', 'desc', 'asc'],
                size: 1000
            },
            'data_tech_alt_asc_facet_is': {
                field: 'data_tech_alt_asc_i',
                conjunction: false,
                sort: ['selected', 'count', 'key'],
                order: ['desc', 'desc', 'asc'],
                size: 1000
            },
            'data_tech_alt_max_facet_is': {
                field: 'data_tech_alt_max_i',
                conjunction: false,
                sort: ['selected', 'count', 'key'],
                order: ['desc', 'desc', 'asc'],
                size: 1000
            },
            'data_tech_dist_facets_fs': {
                field: 'data_tech_dist_f',
                conjunction: false,
                sort: ['selected', 'count', 'key'],
                order: ['desc', 'desc', 'asc'],
                size: 1000
            },
            'data_tech_dur_facet_fs': {
                field: 'data_tech_dur_f',
                conjunction: false,
                sort: ['selected', 'count', 'key'],
                order: ['desc', 'desc', 'asc'],
                size: 1000
            },
            'keywords_txt': {
                conjunction: false,
                sort: ['selected', 'count', 'key'],
                order: ['desc', 'desc', 'asc'],
                size: 1000
            },
            'month_is': {
                field: 'dateshow_dt',
                conjunction: false,
                sort: ['selected', 'count', 'key'],
                order: ['desc', 'desc', 'asc'],
                size: 1000
            },
            'loc_lochirarchie_txt': {
                field: 'loc_lochirarchie_s',
                conjunction: false,
                sort: ['selected', 'count', 'key'],
                order: ['desc', 'desc', 'asc'],
                size: 1000
            },
            'objects_txt': {
                conjunction: false,
                sort: ['selected', 'count', 'key'],
                order: ['desc', 'desc', 'asc'],
                size: 1000
            },
            'persons_txt': {
                conjunction: false,
                sort: ['selected', 'count', 'key'],
                order: ['desc', 'desc', 'asc'],
                size: 1000
            },
            'playlists_txt': {
                conjunction: false,
                sort: ['selected', 'count', 'key'],
                order: ['desc', 'desc', 'asc'],
                size: 1000
            },
            'rate_pers_gesamt_is': {
                field: 'rate_pers_gesamt_i',
                conjunction: false,
                sort: ['selected', 'count', 'key'],
                order: ['desc', 'desc', 'asc'],
                size: 1000
            },
            'rate_pers_schwierigkeit_is': {
                field: 'rate_pers_schwierigkeit_i',
                conjunction: false,
                sort: ['selected', 'count', 'key'],
                order: ['desc', 'desc', 'asc'],
                size: 1000
            },
            'rate_tech_overall_ss': {
                field: 'rate_tech_overall_s',
                conjunction: false,
                sort: ['selected', 'count', 'key'],
                order: ['desc', 'desc', 'asc'],
                size: 1000
            },
            'subtype_ss': {
                field: 'subtype_s',
                conjunction: false,
                sort: ['selected', 'count', 'key'],
                order: ['desc', 'desc', 'asc'],
                size: 1000
            },
            'type_txt': {
                field: 'type_s',
                conjunction: false,
                sort: ['selected', 'count', 'key'],
                order: ['desc', 'desc', 'asc'],
                size: 1000
            },
            'id': {
                conjunction: false,
                sort: ['selected', 'count', 'key'],
                order: ['desc', 'desc', 'asc'],
                size: 1000
            },
            'week_is': {
                field: 'dateshow_dt',
                conjunction: false,
                sort: ['selected', 'count', 'key'],
                order: ['desc', 'desc', 'asc'],
                size: 1000
            },
            'year_is': {
                field: 'dateshow_dt',
                conjunction: false,
                sort: ['selected', 'count', 'key'],
                order: ['desc', 'desc', 'asc'],
                size: 1000
            }
        },
        sortings: {
            'date': {
                'field': 'dateshow_dt',
                'order:': 'desc'
            },
            'dateAsc': {
                'sort': 'dateshow_dt',
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

    public static createRecordFromJson(responseMapper: GenericAdapterResponseMapper, mapper: Mapper, props: any): any {
        for (const key in TourDocRecordRelation.hasOne) {
            if (props[key]) {
                for (const fieldName in props[key]) {
                    props[key + '.' + fieldName] = props[key][fieldName];
                }
            }
        }

        for (const key in TourDocRecordRelation.hasMany) {
            if (props[key]) {
            }
        }

        return responseMapper.mapValuesToRecord(mapper, props);
    }

    public static extendAdapterDocument(values: {}) {
        for (const aggreationName in TourDocItemsJsAdapter.itemsJsConfig.aggregations) {
            const aggregation = TourDocItemsJsAdapter.itemsJsConfig.aggregations[aggreationName];
            if (aggregation['field']) {
                values[aggreationName] = values[aggregation['field']];
            }
        }

        values['type_txt'] = values['type_txt'] ? values['type_txt'] : values['type_s'];
        values['type_txt'] = values['type_txt'] ? values['type_txt'].toLowerCase() : '';
        values['actiontype_s'] = values['subtype_s'];
        values['html'] = values['name_s'] + ' ' +  values['desc_txt'];
        values['year_is'] = values['dateshow_dt']
            ? new Date(values['dateshow_dt']).getFullYear()
            : undefined;
        values['month_is'] = values['dateshow_dt']
            ? new Date(values['dateshow_dt']).getMonth() + 1
            : undefined;

        for (const fieldName of TourDocItemsJsAdapter.itemsJsConfig.searchableFields) {
            if (fieldName.endsWith('_i') || fieldName.endsWith('_s')) {
                values[fieldName + 's'] = values[fieldName];
            }
        }

        // remap to String because itemjs is string-search-engine ;-)
        for (const key in values) {
            if (isNumeric(values[key])) {
                values[key] = values[key] + '';
            }
        }

        return values;
    }

    constructor(config: any, data: any) {
        for (const fieldName of TourDocItemsJsAdapter.aggregationFields) {
            if (fieldName.endsWith('_i') || fieldName.endsWith('_s')) {
                if (!TourDocItemsJsAdapter.itemsJsConfig.aggregations[fieldName]) {
                    TourDocItemsJsAdapter.itemsJsConfig.aggregations[fieldName] = {
                        conjunction: false,
                        sort: ['selected', 'count', 'key'],
                        order: ['desc', 'desc', 'asc'],
                        size: 9999
                    };
                }

                if (!TourDocItemsJsAdapter.itemsJsConfig.aggregations[fieldName + 's']) {
                    TourDocItemsJsAdapter.itemsJsConfig.aggregations[fieldName + 's'] = {
                        conjunction: false,
                        sort: ['selected', 'count', 'key'],
                        order: ['desc', 'desc', 'asc'],
                        size: 9999
                    };
                }
            }
        }

        const images = {};
        const videos = {};
        for (const record of data) {
            delete record['gpstracks_basefile_s'];

            if (record['type_s'] === 'IMAGE' && record['i_fav_url_txt']) {
                images[record['i_fav_url_txt']] = record['i_fav_url_txt'];
            } else if (!images[record['i_fav_url_txt']]) {
                delete record['i_fav_url_txt'];
            }

            if (record['type_s'] === 'VIDEO' && record['v_fav_url_txt']) {
                videos[record['v_fav_url_txt']] = record['v_fav_url_txt'];
            } else if (!videos[record['v_fav_url_txt']]) {
                delete record['v_fav_url_txt'];
            }
        }

        super(config, new TourDocAdapterResponseMapper(config), data, TourDocItemsJsAdapter.itemsJsConfig);
    }

    mapToAdapterDocument(props: any): any {
        return this.mapper.mapToAdapterDocument({}, props);
    }

    getItemsJsConfig(): ItemsJsConfig {
        return TourDocItemsJsAdapter.itemsJsConfig;
    }

    protected queryTransformToAdapterQueryWithMethod(method: string, mapper: Mapper, params: any, opts: any): ItemsJsSelectQueryData {
        // map html to fulltext
        const adapterQuery = <AdapterQuery> params;
        let fulltextQuery = '';
        if (adapterQuery.where && adapterQuery.where['html']) {
            const action = Object.getOwnPropertyNames(adapterQuery.where['html'])[0];
            fulltextQuery = adapterQuery.where['html'][action];
            delete adapterQuery.where['html'];
        }

        const queryData = super.queryTransformToAdapterQueryWithMethod(method, mapper, adapterQuery, opts);
        queryData.query = fulltextQuery;

        return queryData;
    }

}

