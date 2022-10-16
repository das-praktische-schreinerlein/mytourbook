import {TableConfig} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {ActionTagReplaceTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-replace.adapter';
import {AdapterFilterActions} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';
import {KeywordModelConfigJoinType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-keyword.adapter';
import {JoinModelConfigTableType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-join.adapter';

export class SqlMytbDbPoiConfig {
    public static readonly tableConfig: TableConfig = {
        key: 'poi',
        tableName: 'poi',
        selectFrom: 'poi',
        optionalGroupBy: [
            {
                from: 'LEFT JOIN poi_keyword ON poi.poi_id=poi_keyword.poi_id ' +
                    'LEFT JOIN keyword ON poi_keyword.kw_id=keyword.kw_id',
                triggerParams: ['id', 'keywords_txt', 'todoKeywords'],
                groupByFields: ['GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS poi_keywords']
            },
            {
                from: 'LEFT JOIN poi_info ON poi.poi_id=poi_info.poi_id ' +
                    'LEFT JOIN info poiif ON poi_info.if_id=poiif.if_id ',
                triggerParams: ['id', 'info_id_i', 'info_id_is'],
                groupByFields: ['GROUP_CONCAT(DISTINCT poiif.if_id ORDER BY poiif.if_id SEPARATOR ", ") AS poi_if_ids']
            },
            {
                from: 'LEFT JOIN tour_poi ON poi.poi_id=tour_poi.poi_id',
                triggerParams: ['route_id_i', 'route_id_is'],
                groupByFields: ['tour_poi.t_id']
            },
        ],
        groupbBySelectFieldList: true,
        groupbBySelectFieldListIgnore: ['poi_keywords'],
        loadDetailData: [
            {
                profile: 'keywords',
                sql: 'select GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS keywords ' +
                    'FROM poi_keyword' +
                    ' INNER JOIN keyword ON poi_keyword.kw_id=keyword.kw_id ' +
                    'WHERE poi_keyword.poi_id IN (:id)',
                parameterNames: ['id'],
                modes: ['full']
            },
            {
                profile: 'linkedinfos',
                sql: 'SELECT CONCAT("type=", COALESCE(if_typ, "null"), ":::name=", COALESCE(if_name, "null"),' +
                    '    ":::refId=", CAST(info.if_id AS CHAR), ":::linkedDetails=", COALESCE(poi_info.poiif_linked_details, "null"))' +
                    '  AS linkedinfos' +
                    '  FROM info INNER JOIN poi_info ON poi_info.if_id = info.if_id WHERE poi_info.poi_id IN (:id)' +
                    '  ORDER BY if_name',
                parameterNames: ['id']
            },
            {
                profile: 'extended_object_properties',
                sql: 'SELECT CONCAT("category=ENTITYCOUNT:::name=TRACK_COUNT:::value=", CAST(COUNT(DISTINCT kategorie_poi.k_id) AS CHAR)) AS extended_object_properties' +
                    '      FROM kategorie_poi' +
                    '      WHERE kategorie_poi.poi_id IN (:id)' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=ROUTE_COUNT:::value=", CAST(COUNT(DISTINCT tour_poi.t_id) AS CHAR)) AS extended_object_properties' +
                    '       FROM tour_poi ' +
                    '       WHERE tour_poi.poi_id IN (:id)',
                parameterNames: ['id']
            },
            {
                profile: 'navigation_objects',
                sql: '(SELECT CONCAT("navid=POI_", poi_id, ":::name=", COALESCE(poi_name, "null"), ":::navtype=", "PREDECESSOR")' +
                    '  AS navigation_objects' +
                    '  FROM poi WHERE poi_id < (SELECT poi_id FROM poi WHERE poi_id IN (:id))' +
                    '  ORDER BY poi_id DESC, poi_id DESC LIMIT 1) ' +
                    'UNION ' +
                    ' (SELECT CONCAT("navid=POI_", poi_id, ":::name=", COALESCE(poi_name, "null"), ":::navtype=", "SUCCESSOR")' +
                    '  AS navigation_objects' +
                    '  FROM poi WHERE poi_id > (SELECT poi_id FROM poi WHERE poi_id IN (:id))' +
                    '   ORDER BY poi_id, poi_id LIMIT 1)',
                parameterNames: ['id'],
                modes: ['details']
            }
        ],
        selectFieldList: [
            '"POI" AS type',
            'CONCAT("POI", "_", poi.poi_id) AS id',
            'poi.poi_id',
            'poi.poi_name',
            'poi.poi_calced_gps_lat',
            'poi.poi_calced_gps_lon',
            'poi.poi_calced_gps_loc',
            'poi.poi_geo_ele',
            'poi.poi_calced_altMaxFacet AS altMaxFacet',
            'poi_reference',
            'poi_meta_desc',
            'poi_meta_desc AS poi_meta_desc_md',
            'poi_meta_desc AS poi_meta_desc_html'],
        facetConfigs: {
            // dashboard
            'doublettes': {
                constValues: ['doublettes'],
                filterField: '"666dummy999"'
            },
            'conflictingRates': {
                constValues: ['conflictingRates'],
                filterField: '"666dummy999"'
            },
            'noCoordinates': {
                constValues: ['noCoordinates'],
                filterField: '"666dummy999"'
            },
            'noFavoriteChildren': {
                constValues: ['noFavoriteChildren'],
                filterField: '"666dummy999"'
            },
            'noLocation': {
                constValues: ['noLocation'],
                filterField: '"666dummy999"'
            },
            'noMainFavoriteChildren': {
                constValues: ['noMainFavoriteChildren'],
                filterField: '"666dummy999"'
            },
            'noRoute': {
                constValues: ['noRoute'],
                filterField: '"666dummy999"'
            },
            'noSubType': {
                constValues: ['noSubType'],
                filterField: '"666dummy999"'
            },
            'todoDesc': {
                constValues: ['todoDesc'],
                filterField: '"666dummy999"'
            },
            'todoKeywords': {
                constValues: ['todoKeywords'],
                filterField: '"666dummy999"'
            },
            'unrated': {
                constValues: ['unrated'],
                filterField: '"666dummy999"'
            },
            'unRatedChildren': {
                constValues: ['unRatedChildren'],
                filterField: '"666dummy999"'
            },
            // common
            'id_notin_is': {
                filterField: 'CONCAT("POI", "_", poi.poi_id)',
                action: AdapterFilterActions.NOTIN
            },
            'actiontype_ss': {
                noFacet: true
            },
            'blocked_is': {
                noFacet: true
            },
            'data_tech_alt_asc_facet_is': {
                noFacet: true
            },
            'data_tech_alt_max_facet_is': {
                selectField: 'poi_calced_altMaxFacet',
                orderBy: 'value asc'
            },
            'data_tech_dist_facets_fs': {
                noFacet: true
            },
            'data_tech_dur_facet_fs': {
                noFacet: true
            },
            'data_tech_sections_facet_ss': {
                noFacet: true
            },
            'done_ss': {
                noFacet: true
            },
            'gpstracks_state_is': {
                noFacet: true
            },
            'initial_s': {
                noFacet: true
            },
            'keywords_txt': {
                selectSql: 'SELECT count(keyword.kw_id) AS count, ' +
                    '  kw_name AS value ' +
                    'FROM' +
                    ' keyword inner join poi_keyword on keyword.kw_id=poi_keyword.kw_id' +
                    ' GROUP BY value' +
                    ' ORDER BY count desc',
                filterField: 'kw_name',
                action: AdapterFilterActions.LIKEIN
            },
            'loc_id_i': {
                noFacet: true
            },
            'loc_lochirarchie_txt': {
                noFacet: true
            },
            'month_is': {
                noFacet: true
            },
            'news_id_i': {
                constValues: ['news_id_i'],
                filterField: '"666dummy999"'
            },
            'news_id_is': {
                constValues: ['news_id_is'],
                filterField: '"666dummy999"'
            },
            'objects_txt': {
                noFacet: true
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
                noFacet: true
            },
            'playlist_txt': {
                noFacet: true
            },
            'rate_pers_gesamt_is': {
                noFacet: true
            },
            'rate_pers_schwierigkeit_is': {
                noFacet: true
            },
            'rate_tech_overall_ss': {
                noFacet: true
            },
            'route_attr_ss': {
                noFacet: true
            },
            'route_attr_txt': {
                noFacet: true
            },
            'subtype_ss': {
                constValues: ['subtype_ss'],
                filterField: '"666dummy999"'
            },
            'trip_id_i': {
                constValues: ['trip_id_i'],
                filterField: '"666dummy999"'
            },
            'trip_id_is': {
                constValues: ['trip_id_is'],
                filterField: '"666dummy999"'
            },
            'type_txt': {
                constValues: ['poi', 'trip', 'location', 'track', 'route', 'image', 'odimgobject', 'video', 'news', 'destination', 'info'],
                filterField: '"poi"',
                selectLimit: 1
            },
            'week_is': {
                noFacet: true
            },
            'year_is': {
                noFacet: true
            }
        },
        sortMapping: {
            'countRoutes': '(SELECT COUNT(DISTINCT poi_sort.t_id) FROM tour_poi poi_sort WHERE poi_sort.poi_id = poi.poi_id) ASC, poi_name ASC',
            'countRoutesDesc': '(SELECT COUNT(DISTINCT poi_sort.t_id) FROM tour_poi poi_sort WHERE poi_sort.poi_id = poi.poi_id) DESC, poi_name ASC',
            'countTracks': '(SELECT COUNT(DISTINCT poi_sort.k_id) FROM kategorie_poi poi_sort WHERE poi_sort.poi_id = poi.poi_id) ASC, poi_name ASC',
            'countTracksDesc': '(SELECT COUNT(DISTINCT poi_sort.k_id) FROM kategorie_poi poi_sort WHERE poi_sort.poi_id = poi.poi_id) DESC, poi_name ASC',
            'name': 'poi_name ASC',
            'forExport': 'poi.poi_id ASC, poi_name ASC',
            'relevance': 'poi.poi_id DESC, poi_name ASC'
        },
        spartialConfig: {
            lat: 'poi.poi_geo_latdeg',
            lon: 'poi.poi_geo_longdeg',
            spatialField: 'geodist',
            spatialSortKey: 'distance'
        },
        filterMapping: {
            // dashboard
            doublettes: '"doublettes"',
            conflictingRates: '"666dummy999"',
            noFavoriteChildren: '"666dummy999"',
            noMainFavoriteChildren: '"666dummy999"',
            noCoordinates: '"666dummy999"',
            noLocation: '"666dummy999"',
            noRoute: '"666dummy999"',
            noSubType: '"666dummy999"',
            todoDesc: '"todoDesc"',
            todoKeywords: '"666dummy999"',
            unrated: '"666dummy999"',
            unRatedChildren: '"666dummy999"',
            data_tech_alt_min_i: 'poi.poi_geo_ele',
            data_tech_alt_max_i: 'poi.poi_geo_ele',
            data_info_guides_s: 'poi.poi_reference',
            desc_txt: 'poi.poi_meta_shortdesc',
            desc_md_txt: 'poi.poi_meta_shortdesc_md',
            desc_html_txt: 'poi.poi_meta_shortdesc_html',
            geo_lon_s: 'poi.poi_calced_gps_lon',
            geo_lat_s: 'poi.poi_calced_gps_lat',
            geo_loc_p: 'poi.poi_calced_gps_loc',
            // common
            id: 'poi.poi_id',
            destination_id_s: '"666dummy999"',
            destination_id_ss: '"666dummy999"',
            info_id_i: 'poiif.if_id',
            info_id_is: 'poiif.if_id',
            poi_id_i: 'poi.poi_id',
            poi_id_is: 'poi.poi_id',
            route_id_i: 'tour_poi.t_id',
            route_id_is: 'tour_poi.t_id',
            track_id_i: '"666dummy999"',
            track_id_is: '"666dummy999"',
            video_id_is: '"666dummy999"',
            video_id_i: '"666dummy999"',
            image_id_is: '"666dummy999"',
            image_id_i: '"666dummy999"',
            trip_id_is: '"666dummy999"',
            trip_id_i: '"666dummy999"',
            loc_id_i: '"666dummy999"',
            loc_id_is: '"666dummy999"',
            loc_lochirarchie_ids_txt: '"666dummy999"',
            l_lochirarchietxt: '"666dummy999"',
            gpstracks_state_is: '"666dummy999"',
            name_s: 'poi_name',
            initial_s: 'SUBSTR(UPPER(poi_name), 1, 1)',
            html: 'CONCAT(poi_name, " ", COALESCE(poi_meta_desc,""))'
        },
        writeMapping: {
            'poi.poi_geo_ele': ':data_tech_alt_max_i:',
            'poi.poi_geo_longdeg': ':geo_lon_s:',
            'poi.poi_geo_latdeg': ':geo_lat_s:',
            'poi.poi_reference': ':data_info_guides_s:',
            'poi.poi_meta_desc': ':desc_txt:',
            'poi.poi_name': ':name_s:'
        },
        fieldMapping: {
            id: 'id',
            poi_id_i: 'poi_id',
            poi_id_is: 'poi_id',
            desc_txt: 'poi_meta_desc',
            desc_md_txt: 'poi_meta_desc_md',
            desc_html_txt: 'poi_meta_desc_html',
            keywords_txt: 'poi_keywords',
            data_info_guides_s: 'poi_reference',
            data_tech_alt_max_i: 'poi_geo_ele',
            distance: 'geodist',
            geo_lon_s: 'poi_calced_gps_lon',
            geo_lat_s: 'poi_calced_gps_lat',
            geo_loc_p: 'poi_calced_gps_loc',
            poi_name_s: 'poi_name',
            poi_desc_txt: 'poi_meta_desc',
            name_s: 'poi_name',
            type_s: 'type'
        }
    };

    public static readonly keywordModelConfigType: KeywordModelConfigJoinType = {
        table: 'poi', joinTable: 'poi_keyword', fieldReference: 'poi_id'
    };

    public static readonly joinModelConfigTypeLinkedInfos: JoinModelConfigTableType = {
        baseTableIdField: 'poi_id',
        joinTable: 'poi_info',
        joinFieldMappings: {
            'if_id': 'refId',
            'poiif_linked_details': 'linkedDetails'
        }
    };

    public static readonly actionTagReplaceConfig: ActionTagReplaceTableConfigType = {
        table: 'poi',
        fieldId: 'poi_id',
        referenced: [],
        joins: [
            { table: 'poi_keyword', fieldReference: 'poi_id' },
            { table: 'poi_info', fieldReference: 'poi_id' },
            { table: 'kategorie_poi', fieldReference: 'poi_id' },
            { table: 'tour_poi', fieldReference: 'poi_id' }
        ]
    };
}

