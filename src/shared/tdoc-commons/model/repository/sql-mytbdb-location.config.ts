import {TableConfig} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {ActionTagBlockTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-block.adapter';
import {ActionTagReplaceTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-replace.adapter';
import {ActionTagAssignTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-assign.adapter';
import {
    ActionTagAssignJoinTableConfigType
} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-assignjoin.adapter';
import {AdapterFilterActions} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';
import {KeywordModelConfigJoinType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-keyword.adapter';
import {JoinModelConfigTableType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-join.adapter';
import {PlaylistModelConfigJoinType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-playlist.adapter';

export class SqlMytbDbLocationConfig {
    public static readonly tableConfig: TableConfig = {
        key: 'location',
        tableName: 'location',
        selectFrom: 'location left join location_hirarchical lh on location.l_id = lh.l_id',
        optionalGroupBy: [
            {
                from: 'LEFT JOIN location_keyword ON location.l_id=location_keyword.l_id ' +
                    'LEFT JOIN keyword ON location_keyword.kw_id=keyword.kw_id',
                triggerParams: ['id', 'keywords_txt', 'todoKeywords'],
                groupByFields: ['GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS l_keywords']
            },
            {
                from: 'LEFT JOIN location_playlist ON location.l_id=location_playlist.l_id ' +
                    'LEFT JOIN playlist ON location_playlist.p_id=playlist.p_id',
                triggerParams: ['playlists_txt', 'playlists_max_txt', 'playlistPos'],
                groupByFields: ['GROUP_CONCAT(DISTINCT playlist.p_name ORDER BY playlist.p_name SEPARATOR ", ") AS l_playlists']
            },
            {
                from: 'LEFT JOIN location_info ON location.l_id=location_info.l_id ' +
                    'LEFT JOIN info lif ON location_info.if_id=lif.if_id OR location.l_id=lif.l_id ',
                triggerParams: ['id', 'info_id_i', 'info_id_is'],
                groupByFields: ['GROUP_CONCAT(DISTINCT lif.if_id ORDER BY lif.if_id SEPARATOR ", ") AS l_if_ids']
            },
            {
                from: 'INNER JOIN (SELECT l_id AS id FROM location WHERE l_key' +
                    '              IN (SELECT DISTINCT l_key AS name' +
                    '                  FROM location GROUP BY name HAVING COUNT(*) > 1)' +
                    '             ) doublettes' +
                    '             ON location.l_id=doublettes.id',
                triggerParams: ['doublettes'],
                groupByFields: []
            },
            {
                from: 'INNER JOIN (SELECT l_id AS id FROM location WHERE ' +
                    '                 (l_typ IN (1,2,3,4) AND l_geo_area IS NULL) ' +
                    '              OR (l_typ > 4 AND (l_geo_latdeg IS NULL OR l_geo_longdeg IS NULL))' +
                    '             ) noCoordinates' +
                    '             ON location.l_id=noCoordinates.id',
                triggerParams: ['noCoordinates'],
                groupByFields: []
            },
            {
                from: 'INNER JOIN (SELECT l_id AS id FROM location WHERE ' +
                    '               (l_parent_id IS NULL OR l_parent_id IN (0,1)) AND (l_typ IS NULL OR l_typ > 2)' +
                    '             ) noLocation' +
                    '             ON location.l_id=noLocation.id',
                triggerParams: ['noLocation'],
                groupByFields: []
            },
            {
                from: ' ',
                triggerParams: ['id', 'loadTrack'],
                groupByFields: ['location.l_geo_area']
            }
        ],
        groupbBySelectFieldListIgnore: ['l_keywords', 'l_playlists'],
        loadDetailData: [
            {
                profile: 'location_playlist',
                sql: 'SELECT GROUP_CONCAT(DISTINCT playlist.p_name ORDER BY playlist.p_name SEPARATOR ", ") AS l_playlists ' +
                    'FROM location_playlist' +
                    ' INNER JOIN playlist ON location_playlist.p_id=playlist.p_id ' +
                    'WHERE location_playlist.l_id IN (:id)',
                parameterNames: ['id']
            },
            {
                profile: 'image',
                sql: 'SELECT i_calced_path AS i_fav_url_txt ' +
                    'FROM kategorie' +
                    ' INNER JOIN image ON kategorie.k_id=image.k_id ' +
                    'WHERE kategorie.l_id IN (:id) ' +
                    'ORDER BY I_RATE_MOTIVE DESC, I_RATE_WICHTIGKEIT DESC, I_RATE DESC, kategorie.k_rate_gesamt DESC, image.I_ID DESC ' +
                    'LIMIT 1',
                parameterNames: ['id']
            },
            {
                profile: 'keywords',
                sql: 'select GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS keywords ' +
                    'FROM location_keyword' +
                    ' INNER JOIN keyword ON location_keyword.kw_id=keyword.kw_id ' +
                    'WHERE location_keyword.l_id IN (:id)',
                parameterNames: ['id'],
                modes: ['full']
            },
            {
                profile: 'linkedinfos',
                sql: 'SELECT CONCAT("type=", COALESCE(if_typ, "null"), ":::name=", COALESCE(if_name, "null"),' +
                    '    ":::refId=", CAST(info.if_id AS CHAR),' +
                    '    ":::linkedDetails=", COALESCE(location_info.lif_linked_details, "null"))' +
                    '  AS linkedinfos' +
                    '  FROM info INNER JOIN location_info ON location_info.if_id = info.if_id WHERE location_info.l_id IN (:id)' +
                    '  ORDER BY if_name',
                parameterNames: ['id']
            },
            {
                profile: 'extended_object_properties',
                sql: 'SELECT CONCAT("category=ENTITYCOUNT:::name=ROUTE_COUNT:::value=", CAST(COUNT(DISTINCT tour.t_id) AS CHAR)) AS extended_object_properties' +
                    '       FROM tour ' +
                    '       WHERE tour.l_id IN (:id)' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=INFO_COUNT:::value=", CAST(COUNT(DISTINCT info.if_id) AS CHAR)) AS extended_object_properties' +
                    '      FROM info' +
                    '      LEFT JOIN location_info ON info.if_id = location_info.if_id' +
                    '      INNER JOIN location ON location.l_id = info.l_id OR location.l_id = location_info.l_id' +
                    '      WHERE location.l_id IN (:id)' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=TRACK_COUNT:::value=", CAST(COUNT(DISTINCT kategorie.k_id) AS CHAR)) AS extended_object_properties' +
                    '      FROM kategorie' +
                    '      WHERE kategorie.l_id IN (:id)' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=IMAGE_COUNT:::value=", CAST(COUNT(DISTINCT image.i_id) AS CHAR)) AS extended_object_properties' +
                    '      FROM image INNER JOIN kategorie ON image.k_id = kategorie.k_id' +
                    '      WHERE kategorie.l_id IN (:id)' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=IMAGE_TOP_COUNT:::value=", CAST(COUNT(DISTINCT image.i_id) AS CHAR)) AS extended_object_properties' +
                    '      FROM image INNER JOIN kategorie ON image.k_id = kategorie.k_id' +
                    '      WHERE kategorie.l_id IN (:id) AND i_rate >= 6' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=VIDEO_COUNT:::value=", CAST(COUNT(DISTINCT video.v_id) AS CHAR)) AS extended_object_properties' +
                    '      FROM video INNER JOIN kategorie ON video.k_id = kategorie.k_id' +
                    '      WHERE kategorie.l_id IN (:id)',
                parameterNames: ['id']
            },
            {
                profile: 'navigation_objects',
                sql: '(SELECT CONCAT("navid=LOCATION_", l_id, ":::name=", COALESCE(l_name, "null"), ":::navtype=", "PREDECESSOR")' +
                    '  AS navigation_objects, l_lochirarchietxt AS l_lochirarchietxt' +
                    '  FROM location_hirarchical as location WHERE l_lochirarchietxt <' +
                    '      (SELECT l_lochirarchietxt FROM location_hirarchical as location WHERE l_id IN (:id))' +
                    '  ORDER BY l_lochirarchietxt DESC, l_id DESC LIMIT 1) ' +
                    'UNION ' +
                    ' (SELECT CONCAT("navid=LOCATION_", l_id, ":::name=", COALESCE(l_name, "null"), ":::navtype=", "SUCCESSOR")' +
                    '  AS navigation_objects, l_lochirarchietxt AS l_lochirarchietxt' +
                    '  FROM location_hirarchical as location WHERE l_lochirarchietxt >' +
                    '      (SELECT l_lochirarchietxt FROM location_hirarchical as location WHERE l_id IN (:id))' +
                    '  ORDER BY l_lochirarchietxt, l_id LIMIT 1)',
                parameterNames: ['id'],
                modes: ['details']
            },
            {
                profile: 'linkedplaylists',
                sql: 'SELECT CONCAT("type=playlist:::name=", COALESCE(p_name, "null"), ":::refId=", CAST(playlist.p_id AS CHAR),' +
                    '   ":::position=", COALESCE(location_playlist.lp_pos, "null"),   ":::details=", COALESCE(location_playlist.lp_details, "null"))' +
                    '  AS linkedplaylists' +
                    '  FROM playlist INNER JOIN location_playlist ON playlist.p_id = location_playlist.p_id WHERE location_playlist.l_id IN (:id)' +
                    '  ORDER BY p_name',
                parameterNames: ['id']
            }
        ],
        selectFieldList: [
            '"LOCATION" AS type',
            'location.l_typ',
            'location.l_calced_subtype AS subtype',
            'CONCAT("LOCATION", "_", location.l_id) AS id',
            'location.l_id',
            'location.l_parent_id',
            'location.l_name',
            'location.l_datefirst AS l_dateshow',
            'location.l_datefirst',
            'location.l_datelast',
            'DATE_FORMAT(location.l_datefirst, GET_FORMAT(DATE, "ISO")) AS dateonly',
            'MONTH(location.l_datefirst) AS month',
            'YEAR(location.l_datefirst) AS year',
            'location.l_gesperrt',
            'location.l_geo_state',
            'location.l_meta_shortdesc',
            'location.l_meta_shortdesc AS l_meta_shortdesc_md',
            'location.l_calced_gps_lat',
            'location.l_calced_gps_lon',
            'location.l_calced_gps_loc',
            'location.l_geo_ele',
            'location.l_calced_altMaxFacet AS altMaxFacet',
            'lh.l_lochirarchietxt AS l_lochirarchietxt',
            'lh.l_lochirarchieids AS l_lochirarchieids'],
        facetConfigs: {
            // dashboard
            'doublettes': {
                selectSql: 'SELECT COUNT(location.l_id) AS count, "doublettes" AS value,' +
                    ' "doublettes" AS label, "true" AS id' +
                    ' FROM location INNER JOIN (SELECT l_id AS id FROM location WHERE l_key' +
                    '              IN (SELECT DISTINCT l_key AS name' +
                    '                  FROM location GROUP BY name HAVING COUNT(*) > 1)' +
                    '             ) doublettes' +
                    '             ON location.l_id=doublettes.id',
                cache: {
                    useCache: false
                }
            },
            'conflictingRates': {
                constValues: ['conflictingRates'],
                filterField: '"666dummy999"'
            },
            'noCoordinates': {
                selectSql: 'SELECT COUNT(location.l_id) AS count, "noCoordinates" AS value,' +
                    ' "noCoordinates" AS label, "true" AS id' +
                    ' FROM location INNER JOIN (SELECT l_id AS id FROM location WHERE ' +
                    '                 (l_typ IN (1,2,3,4) AND l_geo_area IS NULL) ' +
                    '              OR (l_typ > 4 AND (l_geo_latdeg IS NULL OR l_geo_longdeg IS NULL))' +
                    '             ) noCoordinates' +
                    '             ON location.l_id=noCoordinates.id',
            },
            'noFavoriteChildren': {
                constValues: ['noFavoriteChildren'],
                filterField: '"666dummy999"'
            },
            'noLocation': {
                selectSql: 'SELECT COUNT(location.l_id) AS count, "noLocation" AS value,' +
                    ' "noLocation" AS label, "true" AS id' +
                    ' FROM location INNER JOIN (SELECT l_id AS id FROM location WHERE ' +
                    '               (l_parent_id IS NULL OR l_parent_id IN (0,1)) AND (l_typ IS NULL OR l_typ > 2)' +
                    '             ) noLocation' +
                    '             ON location.l_id=noLocation.id',
                filterField: 'location.l_parent_id',
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
                selectSql: 'SELECT COUNT(location.l_id) AS count, "noSubType" AS value,' +
                    ' "noSubType" AS label, "true" AS id' +
                    ' FROM location WHERE l_typ IS NULL OR l_typ in (0)',
                filterField: 'location.l_calced_subtype',
                action: AdapterFilterActions.IN
            },
            'todoDesc': {
                selectSql: 'SELECT COUNT(location.l_id) AS count, "todoDesc" AS value,' +
                    ' "todoDesc" AS label, "true" AS id' +
                    ' FROM location WHERE l_meta_shortdesc LIKE "TODODESC%"',
                filterField: 'location.l_meta_shortdesc',
                action: AdapterFilterActions.LIKE
            },
            'todoKeywords': {
                selectSql: 'SELECT COUNT(location.l_id) AS count, "todoKeywords" AS value,' +
                    ' "todoKeywords" AS label, "true" AS id' +
                    ' FROM location INNER JOIN location_keyword ON location.l_id=location_keyword.l_id' +
                    ' INNER JOIN keyword ON location_keyword.kw_id=keyword.kw_id ' +
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
                filterField: 'CONCAT("LOCATION", "_", location.l_id)',
                action: AdapterFilterActions.NOTIN
            },
            'actiontype_ss': {
                selectField: 'location.l_calced_subtype'
            },
            'blocked_is': {
                selectField: 'location.l_gesperrt'
            },
            'data_tech_alt_asc_facet_is': {
                noFacet: true
            },
            'data_tech_alt_max_facet_is': {
                selectField: 'location.l_calced_altMaxFacet',
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
                selectField: 'location.l_geo_state'
            },
            'info_id_is': {
                selectSql: 'SELECT COUNT(location_info.if_id) AS count, info.if_id AS value,' +
                    ' info.if_name AS label, info.if_id AS id' +
                    ' FROM info LEFT JOIN location_info ON location_info.if_id = info.if_id ' +
                    ' GROUP BY value, label, id' +
                    ' ORDER BY label',
                filterFields: ['lif.if_id'],
                action: AdapterFilterActions.IN_NUMBER
            },
            'initial_s': {
                selectSql: 'SELECT COUNT(*) as count, ' +
                    ' SUBSTR(UPPER(l_name), 1, 1) as value ' +
                    'FROM location ' +
                    'WHERE LENGTH(l_name) > 0 ' +
                    'GROUP BY SUBSTR(UPPER(l_name), 1, 1)' +
                    'ORDER BY value',
            },
            'keywords_txt': {
                selectSql: 'SELECT count(keyword.kw_id) AS count, ' +
                    '  kw_name AS value ' +
                    'FROM' +
                    ' keyword left join location_keyword on keyword.kw_id=location_keyword.kw_id' +
                    ' WHERE kw_name like "KW_%"' +
                    ' GROUP BY value' +
                    ' ORDER BY count desc',
                filterField: 'kw_name',
                action: AdapterFilterActions.LIKEIN
            },
            'loc_id_i': {
            },
            'loc_lochirarchie_txt': {
                selectSql: 'SELECT COUNT(*) AS count, GetTechName(l_name) AS value,' +
                    ' l_lochirarchietxt AS label, l_id AS id' +
                    ' FROM location_hirarchical as lh' +
                    ' GROUP BY value, label, id' +
                    ' ORDER BY label ASC',
                triggerTables: ['location'],
                filterField: 'GetTechName(lh.l_lochirarchietxt)',
                action: AdapterFilterActions.LIKE
            },
            'month_is': {
                noFacet: true
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
                noFacet: true
            },
            'type_txt': {
                constValues: ['location', 'track', 'route', 'trip', 'image', 'odimgobject', 'video', 'news', 'destination', 'info', 'playlist', 'poi'],
                filterField: '"location"',
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
            'countImages': '(SELECT COUNT(DISTINCT i_sort.i_id) FROM image i_sort WHERE i_sort.l_id = location.l_id) ASC, location.l_name ASC',
            'countImagesDesc': '(SELECT COUNT(DISTINCT i_sort.i_id) FROM image i_sort WHERE i_sort.l_id = location.l_id) DESC, location.l_name ASC',
            'countImagesTop': '(SELECT COUNT(DISTINCT i_sort.i_id) FROM image i_sort' +
                ' WHERE i_sort.l_id = location.l_id AND i_sort.i_rate >= 6) ASC, location.l_name ASC',
            'countImagesTopDesc': '(SELECT COUNT(DISTINCT i_sort.i_id) FROM image i_sort' +
                ' WHERE i_sort.l_id = location.l_id AND i_sort.i_rate >= 6) DESC, location.l_name ASC',
            'countVideos': '(SELECT COUNT(DISTINCT v_sort.v_id) FROM video v_sort WHERE v_sort.l_id = location.l_id) ASC, location.l_name ASC',
            'countVideosDesc': '(SELECT COUNT(DISTINCT v_sort.v_id) FROM video v_sort WHERE v_sort.l_id = location.l_id) DESC, location.l_name ASC',
            'countInfos': '(SELECT COUNT(DISTINCT info.if_id) FROM info LEFT JOIN location_info ON info.if_id = location_info.if_id ' +
                ' INNER JOIN location ON location.l_id = info.l_id OR location.l_id = location_info.l_id) ASC, location.l_name ASC',
            'countInfosDesc': '(SELECT COUNT(DISTINCT info.if_id) FROM info LEFT JOIN location_info ON info.if_id = location_info.if_id ' +
                ' INNER JOIN location ON location.l_id = info.l_id OR location.l_id = location_info.l_id) DESC, location.l_name ASC',
            'countRoutes': '(SELECT COUNT(DISTINCT t_sort.t_id)  tour t_sort WHERE t_sort.l_id = location.l_id) ASC, location.l_name ASC',
            'countRoutesDesc': '(SELECT COUNT(DISTINCT t_sort.t_id) FROM tour t_sort WHERE t_sort.l_id = location.l_id) DESC, location.l_name ASC',
            'date': 'location.l_datefirst DESC, lh.l_lochirarchietxt ASC, location.l_name ASC',
            'dateAsc': 'location.l_datefirst ASC, lh.l_lochirarchietxt ASC, location.l_name ASC',
            'dataTechMaxDesc': 'location.l_geo_ele DESC',
            'dataTechMaxAsc': 'location.l_geo_ele ASC',
            'distance': 'geodist ASC, location.l_name ASC',
            'forExport': 'location.l_typ ASC, location.l_parent_id ASC,location.l_id ASC, location.l_name ASC',
            'name': 'location.l_name ASC',
            'playlistPos': 'location_playlist.lp_pos ASC',
            'location': 'lh.l_lochirarchietxt ASC, location.l_name ASC',
            'locationDetails': 'lh.l_lochirarchietxt ASC, location.l_name ASC',
            'relevance': 'location.l_id ASC, location.l_name ASC'
        },
        spartialConfig: {
            lat: 'location.l_geo_latdeg',
            lon: 'location.l_geo_longdeg',
            spatialField: 'geodist',
            spatialSortKey: 'distance'
        },
        filterMapping: {
            // dashboard
            doublettes: '"doublettes"',
            noFavoriteChildren: '"666dummy999"',
            noMainFavoriteChildren: '"666dummy999"',
            noMetaOnly: '"666dummy999"',
            noCoordinates: '"noCoordinates"',
            noLocation: 'location.l_parent_id',
            noRoute: '"666dummy999"',
            noSubType: '"666dummy999"',
            todoDesc: '"todoDesc"',
            todoKeywords: 'keyword.kw_name',
            unrated: '"666dummy999"',
            unRatedChildren: '"666dummy999"',
            // specific to prevent ambiguous fields
            loc_id_parent_i: 'location.l_parent_id',
            data_tech_alt_min_i: 'location.l_geo_ele',
            data_tech_alt_max_i: 'location.l_geo_ele',
            desc_txt: 'location.l_meta_shortdesc',
            desc_md_txt: 'location.l_meta_shortdesc_md',
            desc_html_txt: 'location.l_meta_shortdesc_html',
            geo_lon_s: 'location.l_calced_gps_lon',
            geo_lat_s: 'location.l_calced_gps_lat',
            geo_loc_p: 'location.l_calced_gps_loc',
            loc_lochirarchie_s: 'lh.l_lochirarchietxt',
            loc_lochirarchie_ids_s: 'lh.l_lochirarchieids',
            name_s: 'location.l_name',
            // common
            id: 'location.l_id',
            loc_id_i: 'location.l_id',
            loc_id_is: 'location.l_id',
            loc_parent_id_i: 'location.l_parent_id',
            image_id_is: '"666dummy999"',
            image_id_i: '"666dummy999"',
            info_id_i: '"666dummy999"',
            info_id_is: '"666dummy999"',
            poi_id_i: '"666dummy999"',
            poi_id_is: '"666dummy999"',
            trip_id_is: '"666dummy999"',
            initial_s: 'SUBSTR(UPPER(location.l_name), 1, 1)',
            html: 'CONCAT(location.l_name, " ", COALESCE(location.l_meta_shortdesc,""), " ", lh.l_lochirarchietxt)'
        },
        writeMapping: {
            'location.l_meta_shortdesc': ':desc_txt:',
            'location.l_parent_id': ':loc_id_parent_i:',
            // 'location.l_meta_shortdesc_md': ':desc_md_txt:',
            // 'location.l_meta_shortdesc_html': ':desc_html_txt:',
            'location.l_gesperrt': ':blocked_i:',
            'location.l_geo_ele': ':data_tech_alt_max_i:',
            'location.l_geo_longdeg': ':geo_lon_s:',
            'location.l_geo_latdeg': ':geo_lat_s:',
            'location.l_geo_poly': ':geo_loc_p:',
            'location.l_geo_area': ':gpstrack_src_s:',
            'location.l_geo_state': ':gpstracks_state_i:',
            'location.l_key': ':key_s:',
            'location.l_name': ':name_s:',
            'location.l_typ': ':subtype_s:'
        },
        fieldMapping: {
            id: 'id',
            loc_id_i: 'l_id',
            loc_id_is: 'l_id',
            loc_id_parent_i: 'l_parent_id',
            dateshow_dt: 'l_dateshow',
            datestart_dt: 'l_datefirst',
            dateend_dt: 'l_datelast',
            data_tech_alt_min_i: 'l_geo_ele',
            data_tech_alt_max_i: 'l_geo_ele',
            desc_txt: 'l_meta_shortdesc',
            desc_md_txt: 'l_meta_shortdesc_md',
            desc_html_txt: 'l_meta_shortdesc_html',
            blocked_i: 'l_gesperrt',
            distance: 'geodist',
            geo_lon_s: 'l_calced_gps_lon',
            geo_lat_s: 'l_calced_gps_lat',
            geo_loc_p: 'l_calced_gps_loc',
            gpstrack_src_s: 'l_geo_area',
            gpstracks_state_i: 'l_geo_state',
            keywords_txt: 'l_keywords',
            loc_lochirarchie_s: 'l_lochirarchietxt',
            loc_lochirarchie_ids_s: 'l_lochirarchieids',
            playlists_txt: 'l_playlists',
            name_s: 'l_name',
            type_s: 'type',
            subtype_s: 'subtype'
        }
    };

    public static readonly keywordModelConfigType: KeywordModelConfigJoinType = {
        table: 'location', joinTable: 'location_keyword', fieldReference: 'l_id'
    };

    public static readonly playlistModelConfigType: PlaylistModelConfigJoinType = {
        table: 'location', joinTable: 'location_playlist', fieldReference: 'l_id', positionField: 'lp_pos',
        detailsField: 'lp_details'
    };

    public static readonly joinModelConfigTypeLinkedInfos: JoinModelConfigTableType = {
        baseTableIdField: 'l_id',
        joinTable: 'location_info',
        joinFieldMappings: {
            'if_id': 'refId',
            'lif_linked_details': 'linkedDetails'
        }
    };

    public static readonly actionTagAssignConfig: ActionTagAssignTableConfigType = {
        table: 'location',
        idField: 'l_id',
        references: {
            'loc_lochirarchie_txt': {
                table: 'location', idField: 'l_id', referenceField: 'l_parent_id'
            }
        }
    };

    public static readonly actionTagAssignJoinConfig: ActionTagAssignJoinTableConfigType = {
        table: 'location',
        idField: 'l_id',
        references: {
            'info_id_is': {
                joinedTable: 'info',
                joinedIdField: 'if_id',
                joinTable: 'location_info',
                joinBaseIdField: 'l_id',
                joinReferenceField: 'if_id'
            }
        }
    };

    public static readonly actionTagBlockConfig: ActionTagBlockTableConfigType = {
        table: 'location', idField: 'l_id', blockField: 'l_gesperrt'
    };

    public static readonly actionTagReplaceConfig: ActionTagReplaceTableConfigType = {
        table: 'location',
        fieldId: 'l_id',
        referenced: [
            { table: 'image', fieldReference: 'l_id' },
            { table: 'info', fieldReference: 'l_id' },
            { table: 'kategorie', fieldReference: 'l_id' },
            { table: 'location', fieldReference: 'l_parent_id' },
            { table: 'poi', fieldReference: 'l_id' },
            { table: 'tour', fieldReference: 'l_id' },
            { table: 'trip', fieldReference: 'l_id' },
            { table: 'video', fieldReference: 'l_id' }
        ],
        joins: [
            { table: 'location_keyword', fieldReference: 'l_id' },
            { table: 'location_info', fieldReference: 'l_id' },
        ]
    };
}

