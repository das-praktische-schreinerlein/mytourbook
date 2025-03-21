import {TableConfig} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {ActionTagBlockTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-block.adapter';
import {ActionTagReplaceTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-replace.adapter';
import {ActionTagAssignTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-assign.adapter';
import {AdapterFilterActions} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';
import {KeywordModelConfigJoinType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-keyword.adapter';
import {PlaylistModelConfigJoinType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-playlist.adapter';
import {PdfEntityDbMapping} from '../../services/tdoc-sql-mytbdb.config';

export class SqlMytbDbInfoConfig {
    public static readonly tableConfig: TableConfig = {
        key: 'info',
        tableName: 'info',
        selectFrom: 'info LEFT JOIN location_hirarchical as location ON location.l_id = info.l_id',
        optionalGroupBy: [
            {
                from: 'LEFT JOIN location lifl ON info.l_id=lifl.l_id ',
                triggerParams: ['loc_id_i', 'loc_id_is', 'loc_lochirarchie_txt'],
                groupByFields: ['lifl.l_id', 'lifl.l_name']
            },
            {
                from: 'LEFT JOIN info_playlist ON info.if_id=info_playlist.if_id ' +
                    'LEFT JOIN playlist ON info_playlist.p_id=playlist.p_id',
                triggerParams: ['playlists_txt', 'playlists_max_txt', 'playlistPos'],
                groupByFields: ['GROUP_CONCAT(DISTINCT playlist.p_name ORDER BY playlist.p_name SEPARATOR ", ") AS if_playlists']
            },
            {
                from: 'LEFT JOIN tour_info tift ON info.if_id = tift.if_id ' +
                    'LEFT JOIN tour tiftour ON tift.t_id = tiftour.t_id',
                triggerParams: ['route_id_i', 'route_id_is', 'destination_id_s', 'destination_id_ss'],
                groupByFields: ['GROUP_CONCAT(DISTINCT COALESCE(tift.tif_linked_details, "") ORDER BY tift.tif_linked_details SEPARATOR ", ") AS tif_ref_details']
            },
            {
                from: 'LEFT JOIN poi_info poiift ON info.if_id = poiift.if_id ' +
                    'LEFT JOIN poi poiifpoi ON poiift.poi_id = poiifpoi.poi_id',
                triggerParams: ['poi_id_i', 'poi_id_is'],
                groupByFields: ['GROUP_CONCAT(DISTINCT COALESCE(poiift.poiif_linked_details, "") ORDER BY poiift.poiif_linked_details SEPARATOR ", ") AS poiif_ref_details']
            },
            {
                from: 'LEFT JOIN destination dt ON dt.d_id in (tiftour.t_calced_d_id)',
                triggerParams: ['destination_id_s', 'destination_id_ss'],
                groupByFields: []
            },
            {
                from:
                    'LEFT JOIN tour_info kift ON info.if_id = kift.if_id ' +
                    'LEFT JOIN kategorie_tour kt ON kt.t_id=kift.t_id ' +
                    'LEFT JOIN kategorie k ON k.k_id=kt.k_id OR k.t_id=kift.t_id ',
                triggerParams: ['track_id_i', 'track_id_is'],
                groupByFields: []
            },
            {
                from: 'LEFT JOIN tour_info nift ON info.if_id = nift.if_id ' +
                    'LEFT JOIN kategorie_tour kt_kt ON nift.t_id=kt_kt.t_id ' +
                    'LEFT JOIN kategorie kt_k ON kt_kt.k_id=kt_k.k_id OR nift.t_id=kt_k.t_id ' +
                    'LEFT JOIN news kt_news ON kt_k.k_datevon >= kt_news.n_datevon AND kt_k.k_datevon <= kt_news.n_datebis ',
                triggerParams: ['news_id_i', 'news_id_is'],
                groupByFields: ['kt_news.n_id']
            },
            {
                from: 'LEFT JOIN tour_info trift ON info.if_id = trift.if_id ' +
                    'LEFT JOIN kategorie_tour kt_kt ON trift.t_id=kt_kt.t_id ' +
                    'LEFT JOIN kategorie kt_k ON kt_kt.k_id=kt_k.k_id OR kt_k.t_id=trift.t_id ' +
                    'LEFT JOIN trip kt_trip ON kt_k.tr_id=kt_trip.tr_id',
                triggerParams: ['trip_id_i', 'trip_id_is'],
                groupByFields: ['kt_trip.tr_id']
            },
            {
                from: 'LEFT JOIN info_keyword ON info.if_id=info_keyword.if_id ' +
                    'LEFT JOIN keyword ON info_keyword.kw_id=keyword.kw_id',
                triggerParams: ['id', 'keywords_txt', 'todoKeywords'],
                groupByFields: ['GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS if_keywords']
            },
            {
                from: 'INNER JOIN (SELECT if_id AS id FROM info WHERE if_key' +
                    '              IN (SELECT DISTINCT if_key AS name' +
                    '                  FROM info GROUP BY name HAVING COUNT(*) > 1)' +
                    '             ) doublettes' +
                    '             ON info.if_id=doublettes.id',
                triggerParams: ['doublettes'],
                groupByFields: []
            },
            {
                from: 'INNER JOIN (SELECT if_id AS id FROM info WHERE l_id IS NULL OR l_id IN (0)) noLocation' +
                    '             ON info.if_id=noLocation.id',
                triggerParams: ['noLocation'],
                groupByFields: []
            },
        ],
        groupbBySelectFieldList: true,
        groupbBySelectFieldListIgnore: ['if_keywords', 'if_playlists'],
        loadDetailData: [
            {
                profile: 'info_playlist',
                sql: 'SELECT GROUP_CONCAT(DISTINCT playlist.p_name ORDER BY playlist.p_name SEPARATOR ", ") AS tr_playlists ' +
                    'FROM info_playlist' +
                    ' INNER JOIN playlist ON info_playlist.p_id=playlist.p_id ' +
                    'WHERE info_playlist.if_id IN (:id)',
                parameterNames: ['id'],
                modes: ['details', 'full', 'commonsearch', 'commoninlinesearch']
            },
            {
                profile: 'extended_object_properties',
                sql: 'SELECT CONCAT("category=ENTITYCOUNT:::name=ROUTE_COUNT:::value=", CAST(COUNT(DISTINCT tour_info.t_id) AS CHAR)) AS extended_object_properties' +
                    '      FROM tour_info' +
                    '      WHERE tour_info.if_id IN (:id)' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=POI_COUNT:::value=", CAST(COUNT(DISTINCT poi_info.poi_id) AS CHAR)) AS extended_object_properties' +
                    '      FROM poi_info' +
                    '      WHERE poi_info.if_id IN (:id)' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=LOCATION_COUNT:::value=", CAST(COUNT(DISTINCT location.l_id) AS CHAR)) AS extended_object_properties' +
                    '      FROM info' +
                    '      LEFT JOIN location_info ON info.if_id = location_info.if_id' +
                    '      INNER JOIN location ON location.l_id = info.l_id OR location.l_id = location_info.l_id' +
                    '      WHERE info.if_id IN (:id)',
                parameterNames: ['id'],
                modes: ['details', 'full', 'commonsearch', 'commoninlinesearch']
            },
            {
                profile: 'navigation_objects',
                sql: '(SELECT CONCAT("navid=INFO_", if_id, ":::name=", COALESCE(if_name, "null"), ":::navtype=", "PREDECESSOR")' +
                    '  AS navigation_objects' +
                    '  FROM info WHERE if_id < (SELECT if_id FROM info WHERE if_id IN (:id))' +
                    '  ORDER BY if_id DESC, if_id DESC LIMIT 1) ' +
                    'UNION ' +
                    ' (SELECT CONCAT("navid=INFO_", if_id, ":::name=", COALESCE(if_name, "null"), ":::navtype=", "SUCCESSOR")' +
                    '  AS navigation_objects' +
                    '  FROM info WHERE if_id > (SELECT if_id FROM info WHERE if_id IN (:id))' +
                    '   ORDER BY if_id, if_id LIMIT 1)',
                parameterNames: ['id'],
                modes: ['details']
            },
            {
                profile: 'linkedplaylists',
                sql: 'SELECT CONCAT("type=playlist:::name=", COALESCE(p_name, "null"), ":::refId=", CAST(playlist.p_id AS CHAR),' +
                    '   ":::position=", COALESCE(info_playlist.ifp_pos, "null"),   ":::details=", COALESCE(info_playlist.ifp_details, "null"))' +
                    '  AS linkedplaylists' +
                    '  FROM playlist INNER JOIN info_playlist ON playlist.p_id = info_playlist.p_id WHERE info_playlist.if_id IN (:id)' +
                    '  ORDER BY p_name',
                parameterNames: ['id'],
                modes: ['details', 'full', 'playlist_view']
            }
        ],
        selectFieldList: [
            '"INFO" AS type',
            'CONCAT("INFO", "_", info.if_id) AS id',
            'info.if_calced_subtype AS subtype',
            'info.if_id',
            'info.l_id',
            'info.l_id as if_l_id',
            'info.if_name',
            'if_publisher',
            'info.if_url as if_reference',
            'location.l_calced_gps_lat AS if_gps_lat',
            'location.l_calced_gps_lon AS if_gps_lon',
            'location.l_calced_gps_loc AS if_gps_loc',
            'location.l_lochirarchietxt AS l_lochirarchietxt',
            'location.l_lochirarchieids AS l_lochirarchieids',
            'if_pdffile',
            'if_gesperrt',
            'if_meta_desc',
            'if_meta_shortdesc',
            // changelog
            'if_createdat',
            'if_updatedat',
            'if_updateversion'
        ],
        facetConfigs: {
            // dashboard
            'doublettes': {
                selectSql: 'SELECT COUNT(info.if_id) AS count, "doublettes" AS value,' +
                    ' "doublettes" AS label, "true" AS id' +
                    ' FROM info INNER JOIN (SELECT if_id AS id FROM info WHERE if_key' +
                    '              IN (SELECT DISTINCT if_key AS name' +
                    '                  FROM info GROUP BY name HAVING COUNT(*) > 1)' +
                    '             ) doublettes' +
                    '             ON info.if_id=doublettes.id',
                cache: {
                    useCache: false
                }
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
                selectSql: 'SELECT COUNT(info.if_id) AS count, "noLocation" AS value,' +
                    ' "noLocation" AS label, "true" AS id' +
                    ' FROM info WHERE l_id IS NULL OR l_id IN (0)',
                filterField: 'info.l_id',
                action: AdapterFilterActions.IN
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
                selectSql: 'SELECT COUNT(info.if_id) AS count, "todoDesc" AS value,' +
                    ' "todoDesc" AS label, "true" AS id' +
                    ' FROM info WHERE if_meta_shortdesc LIKE "TODODESC%" OR if_meta_desc LIKE "TODODESC%"',
                filterField: 'info.if_meta_shortdesc',
                action: AdapterFilterActions.LIKE
            },
            'todoKeywords': {
                selectSql: 'SELECT COUNT(info.if_id) AS count, "todoKeywords" AS value,' +
                    ' "todoKeywords" AS label, "true" AS id' +
                    ' FROM info INNER JOIN info_keyword ON info.if_id=info_keyword.if_id' +
                    ' INNER JOIN keyword ON info_keyword.kw_id=keyword.kw_id ' +
                    'WHERE keyword.kw_name IN ("KW_TODOKEYWORDS")',
                filterField: 'keyword.kw_name',
                action: AdapterFilterActions.IN
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
                filterField: 'CONCAT("INFO", "_", info.if_id)',
                action: AdapterFilterActions.NOTIN
            },
            'actiontype_ss': {
                noFacet: true
            },
            'blocked_is': {
                selectField: 'if_gesperrt'
            },
            'data_tech_alt_asc_facet_is': {
                noFacet: true
            },
            'data_tech_alt_max_facet_is': {
                noFacet: true
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
                selectSql: 'SELECT COUNT(*) as count, ' +
                    ' SUBSTR(UPPER(if_name), 1, 1) as value ' +
                    'FROM info ' +
                    'WHERE LENGTH(if_name) > 0 ' +
                    'GROUP BY SUBSTR(UPPER(if_name), 1, 1)' +
                    'ORDER BY value',
            },
            'keywords_txt': {
                selectSql: 'SELECT count(keyword.kw_id) AS count, ' +
                    '  kw_name AS value ' +
                    'FROM' +
                    ' keyword left join info_keyword on keyword.kw_id=info_keyword.kw_id' +
                    ' WHERE kw_name like "KW_%" or  kw_name like "SOURCE_%"' +
                    ' GROUP BY value' +
                    ' ORDER BY count desc',
                filterField: 'kw_name',
                action: AdapterFilterActions.LIKEIN
            },
            'loc_id_i': {
                noFacet: true
            },
            'loc_lochirarchie_txt': {
                selectSql: 'SELECT COUNT(info.l_id) AS count, GetTechName(l_name) AS value,' +
                    ' l_lochirarchietxt AS label, location.l_id AS id' +
                    ' FROM location_hirarchical as location LEFT JOIN info ON info.l_id = location.l_id ' +
                    ' GROUP BY value, label, id' +
                    ' ORDER BY label ASC',
                triggerTables: ['location', 'info'],
                filterField: 'GetTechName(GetLocationNameAncestry(lifl.l_id, lifl.l_name, " -> "))',
                action: AdapterFilterActions.LIKE
            },
            'month_is': {
                noFacet: true
            },
            'news_id_i': {
                filterFields: ['kt_news.n_id'],
                action: AdapterFilterActions.IN_NUMBER
            },
            'news_id_is': {
                filterFields: ['kt_news.n_id'],
                action: AdapterFilterActions.IN_NUMBER
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
            'playlists_txt': {
                selectSql: 'SELECT 0 AS count, ' +
                    '  p_name AS value ' +
                    'FROM' +
                    ' playlist' +
                    ' GROUP BY count, value' +
                    ' ORDER BY value',
                filterField: 'p_name',
                action: AdapterFilterActions.IN
            },
            'playlists_max_txt': {
                selectSql: 'SELECT max(pos) AS count, ' +
                    '  p_name AS value ' +
                    'FROM' +
                    ' playlist LEFT OUTER JOIN all_entries_playlist_max ON playlist.p_id = all_entries_playlist_max.p_id' +
                    ' GROUP BY value' +
                    ' ORDER BY value',
                cache: {
                    useCache: false
                },
                filterField: 'p_name',
                action: AdapterFilterActions.IN
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
                selectField: 'info.if_calced_subtype'
            },
            'trip_id_i': {
                filterFields: ['kt_trip.tr_id'],
                action: AdapterFilterActions.IN_NUMBER
            },
            'trip_id_is': {
                filterFields: ['kt_trip.tr_id'],
                action: AdapterFilterActions.IN_NUMBER
            },
            'type_ss': {
                constValues: ['info', 'trip', 'location', 'track', 'route', 'image', 'odimgobject', 'video', 'news', 'destination', 'playlist', 'poi'],
                filterField: '"info"',
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
            'countPois': '(SELECT COUNT(DISTINCT poi_sort.poi_id) FROM poi_info poi_sort WHERE poi_sort.if_id = info.if_id) ASC, if_name ASC',
            'countPoisDesc': '(SELECT COUNT(DISTINCT poi_sort.poi_id) FROM poi_info poi_sort WHERE poi_sort.if_id = info.if_id) DESC, if_name ASC',
            'countRoutes': '(SELECT COUNT(DISTINCT t_sort.t_id) FROM tour_info t_sort WHERE t_sort.if_id = info.if_id) ASC, if_name ASC',
            'countRoutesDesc': '(SELECT COUNT(DISTINCT t_sort.t_id) FROM tour_info t_sort WHERE t_sort.if_id = info.if_id) DESC, if_name ASC',
            'countLocations': '(SELECT COUNT(DISTINCT location.l_id) FROM location' +
                ' LEFT JOIN location_info ON location.l_id = location_info.l_id' +
                ' WHERE location_info.if_id = info.if_id OR location.l_id = info.l_id) ASC, if_name ASC',
            'countLocationsDesc': '(SELECT COUNT(DISTINCT location.l_id) FROM location' +
                ' LEFT JOIN location_info ON location.l_id = location_info.l_id' +
                ' WHERE location_info.if_id = info.if_id OR location.l_id = info.l_id) DESC, if_name ASC',
            'name': 'if_name ASC',
            'playlistPos': 'info_playlist.ifp_pos ASC',
            'type': 'if_typ ASC, if_name ASC',
            'forExport': 'info.if_id ASC, if_name ASC',
            'location': 'l_lochirarchietxt ASC, if_name ASC, if_name ASC',
            'locationDetails': 'l_lochirarchietxt ASC, if_name ASC, if_name ASC',
            'relevance': 'info.if_id DESC, if_name ASC',
            'createdAt': 'if_createdat DESC, info.if_id DESC',
            'updatedAt': 'if_updatedat DESC, info.if_id DESC'
        },
        spartialConfig: {
            lat: 'location.l_geo_latdeg',
            lon: 'location.l_geo_longdeg',
            spatialField: 'geodist',
            spatialSortKey: 'distance'
        },
        changelogConfig: {
            createDateField: 'if_createdat',
            updateDateField: 'if_updatedat',
            updateVersionField: 'if_updateversion',
            table: 'info',
            fieldId: 'if_id'
        },
        filterMapping: {
            // dashboard
            doublettes: '"doublettes"',
            conflictingRates: '"666dummy999"',
            noFavoriteChildren: '"666dummy999"',
            noMainFavoriteChildren: '"666dummy999"',
            noMetaOnly: '"666dummy999"',
            noCoordinates: '"666dummy999"',
            noLocation: 'info.l_id',
            noRoute: '"666dummy999"',
            noSubType: '"666dummy999"',
            todoDesc: '"todoDesc"',
            todoKeywords: 'keyword.kw_name',
            unrated: '"666dummy999"',
            unRatedChildren: '"666dummy999"',
            // changelog
            createdafter_dt: 'if_createdat',
            updatedafter_dt: 'if_updatedat',
            // common
            id: 'info.if_id',
            destination_id_s: 'dt.d_id',
            destination_id_ss: 'dt.d_id',
            info_id_i: 'info.if_id',
            info_id_is: 'info.if_id',
            route_id_i: 'tift.t_id',
            route_id_is: 'tift.t_id',
            poi_id_i: 'poiift.poi_id',
            poi_id_is: 'poiift.poi_id',
            track_id_i: 'k.k_id',
            track_id_is: 'k.k_id',
            video_id_is: '"666dummy999"',
            video_id_i: '"666dummy999"',
            image_id_is: '"666dummy999"',
            image_id_i: '"666dummy999"',
            trip_id_is: 'kt_trip.tr_id',
            trip_id_i: 'kt_trip.tr_id',
            loc_id_i: 'info.l_id',
            loc_id_is: 'info.l_id',
            loc_lochirarchie_ids_txt: 'lifl.l_id',
            l_lochirarchietxt: 'lifl.l_name',
            gpstracks_state_is: '"666dummy999"',
            initial_s: 'SUBSTR(UPPER(if_name), 1, 1)',
            html: 'CONCAT(if_name, " ", COALESCE(if_meta_shortdesc,""), " ", COALESCE(if_meta_desc,""), " ", COALESCE(if_publisher,""), " ", COALESCE(if_url,""))',
            htmlNameOnly: 'if_name'
        },
        writeMapping: {
            'info.l_id': ':loc_id_i:',
            'info.if_meta_desc': ':desc_md_txt:',
            'info.if_meta_shortdesc': ':info_shortdesc_txt:',
            'info.if_gesperrt': ':blocked_i:',
            'info.if_publisher': ':info_publisher_s:',
            'info.if_typ': ':subtype_s:',
            'info.if_url': ':info_reference_s:',
            'info.if_key': ':key_s:',
            'info.if_name': ':name_s:'
        },
        fieldMapping: {
            id: 'id',
            info_id_i: 'if_id',
            info_id_is: 'if_id',
            loc_id_i: 'if_l_id',
            loc_id_is: 'if_l_id',
            loc_lochirarchie_s: 'l_lochirarchietxt',
            loc_lochirarchie_ids_s: 'l_lochirarchieids',
            playlists_txt: 'if_playlists',
            geo_lon_s: 'if_gps_lon',
            geo_lat_s: 'if_gps_lat',
            geo_loc_p: 'if_gps_loc',
            blocked_i: 'if_gesperrt',
            desc_md_txt: 'if_meta_desc',
            info_name_s: 'if_name',
            info_desc_txt: 'if_meta_desc',
            info_shortdesc_txt: 'if_meta_shortdesc',
            info_reference_s: 'if_reference',
            info_tif_linked_details_s: 'tif_ref_details',
            info_lif_linked_details_s: 'lif_ref_details',
            info_publisher_s: 'if_publisher',
            info_type_s: 'subtype',
            keywords_txt: 'if_keywords',
            pdffile_s: 'if_pdffile',
            name_s: 'if_name',
            subtype_s: 'subtype',
            type_s: 'type',
            // changelog
            createdat_dt: 'if_createdat',
            updatedat_dt: 'if_updatedat',
            updateversion_i: 'if_updateversion'
        }
    };

    public static readonly playlistModelConfigType: PlaylistModelConfigJoinType = {
        table: 'info', joinTable: 'info_playlist', fieldReference: 'if_id', positionField: 'ifp_pos',
        detailsField: 'ifp_details',
        changelogConfig: SqlMytbDbInfoConfig.tableConfig.changelogConfig
    };

    public static readonly keywordModelConfigType: KeywordModelConfigJoinType = {
        table: 'info', joinTable: 'info_keyword', fieldReference: 'if_id',
        changelogConfig: SqlMytbDbInfoConfig.tableConfig.changelogConfig
    };

    public static readonly actionTagAssignConfig: ActionTagAssignTableConfigType = {
        table: 'info',
        idField: 'if_id',
        references: {
            'loc_lochirarchie_txt': {
                table: 'location', idField: 'l_id', referenceField: 'l_id'
            }
        },
        changelogConfig: SqlMytbDbInfoConfig.tableConfig.changelogConfig
    };

    public static readonly actionTagBlockConfig: ActionTagBlockTableConfigType = {
        table: 'info', idField: 'if_id', blockField: 'if_gesperrt',
        changelogConfig: SqlMytbDbInfoConfig.tableConfig.changelogConfig
    };

    public static readonly actionTagReplaceConfig: ActionTagReplaceTableConfigType = {
        table: 'info',
        fieldId: 'if_id',
        referenced: [],
        joins: [
            { table: 'info_keyword', fieldReference: 'if_id' },
            { table: 'poi_info', fieldReference: 'if_id' },
            { table: 'tour_info', fieldReference: 'if_id' },
            { table: 'location_info', fieldReference: 'if_id' }
        ],
        changelogConfig: SqlMytbDbInfoConfig.tableConfig.changelogConfig
    };

    public static readonly pdfEntityDbMapping: PdfEntityDbMapping = {
        table: 'info',
        fieldId: 'if_id',
        fieldFilename: 'if_pdffile'
    };
}

