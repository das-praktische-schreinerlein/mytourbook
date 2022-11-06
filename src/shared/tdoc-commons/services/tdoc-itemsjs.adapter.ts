import {TourDocRecord, TourDocRecordRelation} from '../model/records/tdoc-record';
import {TourDocSearchForm} from '../model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../model/container/tdoc-searchresult';
import {TourDocAdapterResponseMapper} from './tdoc-adapter-response.mapper';
import {ItemsJsConfig, ItemsJsSelectQueryData} from '@dps/mycms-commons/dist/search-commons/services/itemsjs-query.builder';
import {GenericItemsJsAdapter, ItemJsResult} from '@dps/mycms-commons/dist/search-commons/services/generic-itemsjs.adapter';
import {Mapper} from 'js-data';
import {AdapterQuery} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';
import {GenericAdapterResponseMapper} from '@dps/mycms-commons/dist/search-commons/services/generic-adapter-response.mapper';
import {isNumeric} from 'rxjs/internal-compatibility';
import {Facet, Facets} from '@dps/mycms-commons/dist/search-commons/model/container/facets';

export class TourDocItemsJsAdapter extends GenericItemsJsAdapter<TourDocRecord, TourDocSearchForm, TourDocSearchResult> {
    public static aggregationFields = ['id', 'image_id_i', 'loc_id_i', 'route_id_i', 'destination_id_s', 'track_id_i', 'trip_id_i', 'news_id_i', 'video_id_i', 'info_id_i',
        'image_similar_id_i', 'loc_parent_id_i'];
    public static itemsJsConfig: ItemsJsConfig = {
        spatialField: 'geo_loc_p',
        spatialSortKey: 'distance',
        searchableFields: ['id', 'image_id_i', 'loc_id_i', 'route_id_i', 'destination_id_s', 'track_id_i', 'trip_id_i', 'news_id_i', 'video_id_i', 'info_id_i',
            'image_similar_id_i', 'dateshow_dt', 'desc_txt', 'desc_md_txt', 'desc_html_txt', 'geo_lon_s', 'geo_lat_s', 'geo_loc_p',
            'data_info_guides_s', 'data_info_region_s', 'data_info_baseloc_s', 'data_info_destloc_s', 'data_info_section_details_s',
            'info_name_s', 'info_desc_txt', 'info_shortdesc_txt', 'info_publisher_s', 'info_reference_s', 'info_tif_linked_details_s',
            'info_lif_linked_details_s', 'info_type_s',
            'rate_tech_overall_s', 'rate_tech_ks_s', 'rate_tech_firn_s', 'rate_tech_gletscher_s', 'rate_tech_klettern_s',
            'rate_tech_bergtour_s', 'rate_tech_schneeschuh_s',
            'keywords_txt', 'loc_lochirarchie_s', 'loc_lochirarchie_ids_s', 'name_s', 'type_s',
            'objects_txt', 'persons_txt', 'actiontype_ss', 'subtype_s', 'i_fav_url_txt', 'v_fav_url_txt', 'route_attr_ss',
            'navigation_objects_txt', 'extended_object_properties_txt',
            'linkedroutes_txt', 'linkedinfos_txt', 'linkedplaylists_txt', 'linkedpois_txt',
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
                        ? record['keywords_txt'].replace(',,', ',').split(',')
                        : undefined
                },
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'month_is': {
                mapField: 'dateshow_dt',
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
                        ? record['objects_txt'].replace(',,', ',').split(',')
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
                        ? record['persons_txt'].replace(',,', ',').split(',')
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
                        ? record['playlists_txt'].replace(',,', ',').split(',')
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
            'type_txt': {
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
                mapField: 'dateshow_dt',
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
                field: ['dateshow_dt', 'rate_pers_gesamt_i'],
                order: ['desc', 'desc']
            },
            'dateAsc': {
                field: ['dateshow_dt', 'rate_pers_gesamt_i'],
                order: ['asc', 'desc']
            },
            'dataTechDurDesc': {
                field: ['data_tech_dur_f', 'rate_pers_gesamt_i'],
                order: ['desc', 'desc']
            },
            'dataTechAltDesc': {
                field: ['data_tech_alt_asc_i', 'rate_pers_gesamt_i'],
                order: ['desc', 'desc']
            },
            'dataTechMaxDesc': {
                field: ['data_tech_alt_max_i', 'rate_pers_gesamt_i'],
                order: ['desc', 'desc']
            },
            'dataTechDistDesc': {
                field: ['data_tech_dist_f', 'rate_pers_gesamt_i'],
                order: ['desc', 'desc']
            },
            'dataTechDurAsc': {
                field: ['data_tech_dur_f', 'rate_pers_gesamt_i'],
                order: ['asc', 'desc']
            },
            'dataTechAltAsc': {
                field: ['data_tech_alt_asc_i', 'rate_pers_gesamt_i'],
                order: ['asc', 'desc']
            },
            'dataTechMaxAsc': {
                field: ['data_tech_alt_max_i', 'rate_pers_gesamt_i'],
                order: ['asc', 'desc']
            },
            'dataTechDistAsc': {
                field: ['data_tech_dist_f', 'rate_pers_gesamt_i'],
                order: ['asc', 'desc']
            },
            'ratePers': {
                field: ['rate_pers_gesamt_i', 'dateshow_dt'],
                order: ['desc', 'desc']
            },
            'location': {
                field: ['loc_lochirarchie_s', 'rate_pers_gesamt_i'],
                order: ['asc', 'desc']
            },
            'locationDetails': {
                field: ['loc_lochirarchie_s', 'rate_pers_gesamt_i'],
                order: ['asc', 'desc']
            },
            'region': {
                field: ['data_info_region_s', 'name_s', 'rate_pers_gesamt_i'],
                order: ['asc', 'asc', 'desc']
            },
            'relevance': {
                field: ['id', 'dateshow_dt'],
                order: ['asc', 'desc']
            },
            'trackDate': {
                field: ['dateshow_dt', 'rate_pers_gesamt_i'],
                order: ['desc', 'desc']
            },
            'trackDateAsc': {
                field: ['dateshow_dt', 'rate_pers_gesamt_i'],
                order: ['asc', 'desc']
            },
            'tripDate': {
                field: ['dateshow_dt', 'rate_pers_gesamt_i'],
                order: ['desc', 'desc']
            },
            'tripDateAsc': {
                field: ['dateshow_dt', 'rate_pers_gesamt_i'],
                order: ['asc', 'desc']
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
        // remap fields with fallbacks
        values['actiontype_s'] = values['actiontype_s'] || values['subtype_s'];
        values['dateshow_dt'] = values['dateshow_dt'] || values['datestart_dt']
        values['html'] = values['name_s'] + ' ' +  values['desc_txt'];

        // prepare aggregations
        for (const filterBase of ['keywords', 'objects', 'persons', 'playlists']) {
            values[filterBase + '_ss'] = values[filterBase + '_txt'];
        }

        for (const aggreationName in TourDocItemsJsAdapter.itemsJsConfig.aggregations) {
            const aggregation = TourDocItemsJsAdapter.itemsJsConfig.aggregations[aggreationName];
            if (aggregation.filterFunction) {
                values[aggreationName] = aggregation.filterFunction.call(this, values);
            } else if (aggregation['mapField']) {
                values[aggreationName] = values[aggregation['mapField']];
            }
        }

        // override some aggregations
        values['type_txt'] = values['type_txt'] ? values['type_txt'] : values['type_s'];
        values['type_txt'] = values['type_txt'] ? values['type_txt'].toLowerCase() : '';

        values['year_is'] = values['dateshow_dt']
            ? new Date(values['dateshow_dt']).getFullYear()
            : undefined;
        values['month_is'] = values['dateshow_dt']
            ? new Date(values['dateshow_dt']).getMonth() + 1
            : undefined;
        values['done_ss'] = values['dateshow_dt']
            ? 'DONE1'
            : 'DONE0';

        if (values['loc_lochirarchie_s']) {
            values['loc_lochirarchie_txt'] = values['loc_lochirarchie_s'].split(',,');
        }

        // add aggregations for searchableFields
        for (const fieldName of TourDocItemsJsAdapter.itemsJsConfig.searchableFields) {
            if (fieldName.endsWith('_i') || fieldName.endsWith('_s')) {
                values[fieldName + 's'] = values[fieldName];
            }
        }

        // remap to String because itemjs is string-search-engine ;-)
        for (const fieldName of [].concat(TourDocItemsJsAdapter.aggregationFields).concat()) {
            if (isNumeric(values[fieldName])) {
                values[fieldName] = values[fieldName] + '';
            }
        }

        for (const key in values) {
            if ((key.endsWith('_ss') || key.endsWith('_is') || key.endsWith('_fs')) && isNumeric(values[key])) {
                values[key] = values[key] + '';
            }
        }

        return values;
    }

    public static lazyCheckForFilePath(pathes: {}, needle: string): string {
        const normalizedTries = [];
        if (!needle) {
            return undefined;
        }

        normalizedTries.push(needle);
        if (pathes[needle]) {
            return needle;
        }

        let normalized = needle.replace(/^\//, '');
        normalizedTries.push(normalized);
        if (pathes[normalized]) {
            return normalized;
        }

        normalized = needle.replace('/', '_');
        normalizedTries.push(normalized);
        if (pathes[normalized]) {
            return normalized;
        }

        normalized = '/' + needle;
        normalizedTries.push(normalized);
        if (pathes[normalized]) {
            return normalized;
        }

        normalized = '/' + needle.replace('/', '_');
        normalizedTries.push(normalized);
        if (pathes[normalized]) {
            return normalized;
        }

        if (needle.length === 1) {
            // console.debug('no matching path found - checked normalized pathes', normalizedTries);
            return undefined;
        }

        normalized = needle.substr(0, 1)
            + needle.substr(1, needle.length).replace('/', '_');
        normalizedTries.push(normalized);
        if (pathes[normalized]) {
            return normalized;
        }

        // console.debug('no matching path found - checked normalized pathes', normalizedTries);

        return undefined;
    }

    public static clearNotExistingMediaPathes(records: any[], imagePathes: {}, videoPathes: {}) {
        // delete reference if media-path not exists in media-container
        for (const record of records) {
            let mediaUrl: string = record['i_fav_url_txt'];
            if (mediaUrl && record['type_s'] !== 'IMAGE' && !imagePathes[mediaUrl]) {
                const normalizedUrl = TourDocItemsJsAdapter.lazyCheckForFilePath(imagePathes, mediaUrl);
                if (normalizedUrl && imagePathes[normalizedUrl]) {
                    // console.debug('FavImage REMAPPED i_fav_url_txt remapped:', mediaUrl, normalizedUrl);
                    record['i_fav_url_txt'] = normalizedUrl;
                } else {
                    // console.debug('FavImage NOT FOUND i_fav_url_txt:', mediaUrl);
                    delete record['i_fav_url_txt'];
                }
            }

            mediaUrl = record['v_fav_url_txt'];
            if (mediaUrl && record['type_s'] !== 'VIDEO' && !imagePathes[mediaUrl]) {
                const normalizedUrl = TourDocItemsJsAdapter.lazyCheckForFilePath(videoPathes, mediaUrl);
                if (normalizedUrl && videoPathes[normalizedUrl]) {
                    // console.debug('FavVideo REMAPPED v_fav_url_txt remapped:', mediaUrl, normalizedUrl);
                    record['v_fav_url_txt'] = normalizedUrl;
                } else {
                    // console.debug('FavVideo RESET v_fav_url_txt:', mediaUrl);
                    delete record['v_fav_url_txt'];
                }
            }
        }
    }

    constructor(config: any, data: any) {
        for (const aggreationName in TourDocItemsJsAdapter.itemsJsConfig.aggregations) {
            const aggregation = TourDocItemsJsAdapter.itemsJsConfig.aggregations[aggreationName];
            if (!aggregation['field']) {
                aggregation['field'] = aggreationName;
            }
        }

        for (const fieldName of TourDocItemsJsAdapter.aggregationFields) {
            if (fieldName.endsWith('_i') || fieldName.endsWith('_s')) {
                if (!TourDocItemsJsAdapter.itemsJsConfig.aggregations[fieldName]) {
                    TourDocItemsJsAdapter.itemsJsConfig.aggregations[fieldName] = {
                        conjunction: false,
                        sort: 'term',
                        order: 'asc',
                        hide_zero_doc_count: true,
                        size: 9999
                    };
                }

                if (!TourDocItemsJsAdapter.itemsJsConfig.aggregations[fieldName + 's']) {
                    TourDocItemsJsAdapter.itemsJsConfig.aggregations[fieldName + 's'] = {
                        conjunction: false,
                        sort: 'term',
                        order: 'asc',
                        hide_zero_doc_count: true,
                        size: 9999
                    };
                }
            }
        }

        const recordIds = {};
        const records = [];
        const imagePathes = {};
        const videoPathes = {};
        // check for duplicates and fill media-container
        for (const record of data) {
            if (!record['id'] || record['id'] === '') {
                console.warn('SKIPPED record - no id', record['id'], record);
                continue;
            }

            if (recordIds[record['id']]) {
                console.warn('SKIPPED record - id already exists id/existing/skipped', record['id'], recordIds[record['id']], record);
                continue;
            }

            records.push(record);
            recordIds[record['id']] = records.length - 1;

            delete record['gpstracks_basefile_s'];

            let mediaUrl: string = record['i_fav_url_txt'];
            if (mediaUrl && record['type_s'] === 'IMAGE') {
                imagePathes[mediaUrl] = mediaUrl;
            }

            mediaUrl = record['v_fav_url_txt'];
            if (mediaUrl && record['type_s'] === 'VIDEO') {
                videoPathes[mediaUrl] = mediaUrl;
            }
        }

        if (!config['skipMediaCheck']) {
            TourDocItemsJsAdapter.clearNotExistingMediaPathes(records, imagePathes, videoPathes);
        }

        console.debug('init itemsjs with config', TourDocItemsJsAdapter.itemsJsConfig, records);

        super(config, new TourDocAdapterResponseMapper(config), records, TourDocItemsJsAdapter.itemsJsConfig);
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
        const specialAggregations = {};
        if (adapterQuery.where) {
            if (adapterQuery.where['html']) {
                const action = Object.getOwnPropertyNames(adapterQuery.where['html'])[0];
                fulltextQuery = adapterQuery.where['html'][action];
                delete adapterQuery.where['html'];
            }

            for (const filterBase of []) {
                if (adapterQuery.where[filterBase + '_txt']) {
                    const action = Object.getOwnPropertyNames(adapterQuery.where[filterBase + '_txt'])[0];
                    specialAggregations[filterBase + '_ss'] = adapterQuery.where[filterBase + '_txt'][action];
                    delete adapterQuery.where[filterBase + '_txt'];
                }
            }
        }

        const queryData = super.queryTransformToAdapterQueryWithMethod(method, mapper, adapterQuery, opts);
        queryData.query = fulltextQuery;

        if (!queryData.filters) {
            queryData.filters = {};
        }
        queryData.filters = {...queryData.filters, ...specialAggregations};

        console.log('itemsjs query:', queryData);

        return queryData;
    }

    extractRecordsFromRequestResult(mapper: Mapper, result: ItemJsResult): TourDocRecord[] {
        // got documents
        const docs = result.data.items;
        const recordIds = {};
        const afterRecordIds = {};
        const records = [];
        for (const doc of docs) {
            if (recordIds[doc['id']]) {
                console.error('DUPLICATION id not unique on itemsjs-result', doc['id'], doc);
                continue;
            }

            recordIds[doc['id']] = true;

            // remap fields
            const docCopy = {...doc};
            for (const filterBase of ['keywords', 'objects', 'persons', 'playlists']) {
                docCopy[filterBase + '_txt'] = docCopy[filterBase + '_ss'];
            }

            const record = this.mapResponseDocument(mapper, docCopy, this.getItemsJsConfig());
            if (afterRecordIds[record['id']]) {
                console.error('DUPLICATION id not unique after itemsjs-mapping', record['id'], record);
                continue;
            }

            afterRecordIds[record['id']] = true;

            records.push(record);
        }
        // console.log('extractRecordsFromRequestResult:', records);

        return records;
    }

}

