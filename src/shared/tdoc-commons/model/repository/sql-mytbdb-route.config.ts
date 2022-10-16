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

export class SqlMytbDbRouteConfig {
    public static readonly tableConfig: TableConfig = {
        key: 'route',
        tableName: 'tour',
        selectFrom: 'tour LEFT JOIN location_hirarchical as location ON tour.l_id = location.l_id ',
        optionalGroupBy: [
            {
                from: 'LEFT JOIN tour_keyword ON tour.t_id=tour_keyword.t_id ' +
                    'LEFT JOIN keyword ON tour_keyword.kw_id=keyword.kw_id ',
                triggerParams: ['id', 'keywords_txt', 'todoKeywords'],
                groupByFields: ['GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS t_keywords']
            },
            {
                from: 'LEFT JOIN tour_playlist ON tour.t_id=tour_playlist.t_id ' +
                    'LEFT JOIN playlist ON tour_playlist.p_id=playlist.p_id',
                triggerParams: ['playlists_txt', 'playlists_max_txt', 'playlistPos'],
                groupByFields: ['GROUP_CONCAT(DISTINCT playlist.p_name ORDER BY playlist.p_name SEPARATOR ", ") AS t_playlists']
            },
            {
                from: 'LEFT JOIN tour_info ON tour.t_id=tour_info.t_id ' +
                    'LEFT JOIN info tif ON tour_info.if_id=tif.if_id ',
                triggerParams: ['id', 'info_id_i', 'info_id_is'],
                groupByFields: ['GROUP_CONCAT(DISTINCT tif.if_id ORDER BY tif.if_id SEPARATOR ", ") AS t_if_ids']
            },
            {
                from: 'LEFT JOIN kategorie_tour ON tour.t_id=kategorie_tour.t_id ',
                triggerParams: ['id', 'track_id_i', 'track_id_is', 'route_attr_ss', 'route_attr_txt'],
                groupByFields: ['GROUP_CONCAT(DISTINCT kategorie_tour.k_id ORDER BY kategorie_tour.k_id SEPARATOR ", ") AS t_kt_ids',
                    'GROUP_CONCAT(DISTINCT COALESCE(kategorie_tour.kt_route_attr, "") ORDER BY kategorie_tour.kt_route_attr SEPARATOR ";;") AS t_kt_route_attr']
            },
            {
                from: 'LEFT JOIN kategorie ON kategorie.t_id=tour.t_id ',
                triggerParams: ['id', 'track_id_i', 'track_id_is', 'route_attr_ss', 'route_attr_txt'],
                groupByFields: ['GROUP_CONCAT(DISTINCT kategorie.k_id ORDER BY kategorie.k_id SEPARATOR ", ") AS t_k_ids',
                    'GROUP_CONCAT(DISTINCT COALESCE(kategorie.k_route_attr, "") ORDER BY kategorie.k_route_attr SEPARATOR ";;") AS t_k_route_attr']
            },
            {
                from: 'LEFT JOIN destination dt ON dt.d_id in (tour.t_calced_d_id)',
                triggerParams: ['destination_id_s', 'destination_id_ss'],
                groupByFields: []
            },
            {
                from: 'LEFT JOIN kategorie_tour kt_kt ON tour.t_id=kt_kt.t_id ' +
                    'LEFT JOIN kategorie kt_k ON kt_kt.k_id=kt_k.k_id OR kt_k.t_id=tour.t_id ' +
                    'LEFT JOIN news kt_news ON kt_k.k_datevon >= kt_news.n_datevon AND kt_k.k_datevon <= kt_news.n_datebis ',
                triggerParams: ['news_id_i', 'news_id_is'],
                groupByFields: ['kt_news.n_id']
            },
            {
                from: 'LEFT JOIN kategorie_tour kt_kt ON tour.t_id=kt_kt.t_id ' +
                    'LEFT JOIN kategorie kt_k ON kt_kt.k_id=kt_k.k_id OR kt_k.t_id=tour.t_id ' +
                    'LEFT JOIN trip kt_trip ON kt_k.tr_id=kt_trip.tr_id',
                triggerParams: ['trip_id_i', 'trip_id_is'],
                groupByFields: ['kt_trip.tr_id']
            },
            {
                from: 'INNER JOIN (SELECT t_id AS id FROM tour WHERE t_key' +
                    '              IN (SELECT DISTINCT t_key AS name' +
                    '                  FROM tour GROUP BY name HAVING COUNT(*) > 1)' +
                    '             ) doublettes' +
                    '             ON tour.t_id=doublettes.id',
                triggerParams: ['doublettes'],
                groupByFields: []
            },
            {
                from: 'INNER JOIN (SELECT DISTINCT t_id AS id FROM tour WHERE t_id IN ' +
                    '    (SELECT DISTINCT t_id FROM kategorie WHERE t_id IS NOT NULL UNION SELECT DISTINCT t_id FROM kategorie_tour) ' +
                    '   AND t_name NOT IN ("OFFEN", "Keine Tour") AND k_id IS NULL) noMainFavoriteChildren' +
                    ' ON tour.t_id=noMainFavoriteChildren.id',
                triggerParams: ['noMainFavoriteChildren'],
                groupByFields: []
            },
            {
                from: ' ',
                triggerParams: ['id', 'loadTrack'],
                groupByFields: ['t_gpstracks_gpx']
            }
        ],
        groupbBySelectFieldListIgnore: ['t_keywords', 't_playlists'],
        loadDetailData: [
            {
                profile: 'tour_playlist',
                sql: 'SELECT GROUP_CONCAT(DISTINCT playlist.p_name ORDER BY playlist.p_name SEPARATOR ", ") AS t_playlists ' +
                    'FROM tour_playlist' +
                    ' INNER JOIN playlist ON tour_playlist.p_id=playlist.p_id ' +
                    'WHERE tour_playlist.t_id IN (:id)',
                parameterNames: ['id']
            },
            {
                profile: 'image',
                sql: 'SELECT i_calced_path AS i_fav_url_txt ' +
                    'FROM tour INNER JOIN kategorie ON tour.k_id=kategorie.k_id' +
                    ' INNER JOIN image ON kategorie.k_id=image.k_id ' +
                    ' INNER JOIN image_playlist ON image.i_id=image_playlist.i_id ' +
                    'WHERE tour.t_id IN (:id) and p_id in (18) ' +
                    'ORDER BY I_RATE_MOTIVE DESC, I_RATE_WICHTIGKEIT DESC, I_RATE DESC, kategorie.k_rate_gesamt DESC, image.I_ID DESC ' +
                    'LIMIT 1',
                parameterNames: ['id']
            },
            {
                profile: 'linkedinfos',
                sql: 'SELECT CONCAT("type=", COALESCE(if_typ, "null"), ":::name=", COALESCE(if_name, "null"),' +
                    '    ":::refId=", CAST(info.if_id AS CHAR), ":::linkedDetails=", COALESCE(tour_info.tif_linked_details, "null"))' +
                    '  AS linkedinfos' +
                    '  FROM info INNER JOIN tour_info ON tour_info.if_id = info.if_id WHERE tour_info.t_id IN (:id)' +
                    '  ORDER BY if_name',
                parameterNames: ['id']
            },
            {
                profile: 'linkedpois',
                sql: 'SELECT CONCAT("type=", COALESCE(1, "null"), ":::name=", COALESCE(poi_name, "null"),' +
                    '    ":::refId=", CAST(poi.poi_id AS CHAR), ":::poitype=", COALESCE(tour_poi.tpoi_type, "null"),' +
                    '    ":::position=", COALESCE(tour_poi.tpoi_pos, "null"),' +
                    '    ":::geoLoc=", CONCAT(poi_geo_latdeg, ",", poi_geo_longdeg), ":::geoEle=", COALESCE(poi_geo_ele, 0)' +
                    '   )' +
                    '  AS linkedpois' +
                    '  FROM poi INNER JOIN tour_poi ON tour_poi.poi_id = poi.poi_id WHERE tour_poi.t_id IN (:id)' +
                    '  ORDER BY tour_poi.tpoi_pos',
                parameterNames: ['id']
            },
            {
                profile: 'keywords',
                sql: 'select GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS keywords ' +
                    'FROM tour_keyword' +
                    ' INNER JOIN keyword ON tour_keyword.kw_id=keyword.kw_id ' +
                    'WHERE tour_keyword.t_id IN (:id)',
                parameterNames: ['id'],
                modes: ['full']
            },
            {
                profile: 'extended_object_properties',
                sql: 'SELECT CONCAT("category=ENTITYCOUNT:::name=TRIP_COUNT:::value=", CAST(COUNT(DISTINCT trip.tr_id) AS CHAR)) AS extended_object_properties' +
                    '       FROM trip INNER JOIN kategorie ON trip.tr_id=kategorie.tr_id' +
                    '       LEFT JOIN kategorie_tour ON kategorie.k_id = kategorie_tour.k_id' +
                    '       WHERE kategorie_tour.t_id IN (:id) OR kategorie.t_id IN (:id)' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=INFO_COUNT:::value=", CAST(COUNT(DISTINCT tour_info.if_id) AS CHAR)) AS extended_object_properties' +
                    '      FROM tour_info' +
                    '      WHERE tour_info.t_id IN (:id)' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=TRACK_COUNT:::value=", CAST(COUNT(DISTINCT kategorie.k_id) AS CHAR)) AS extended_object_properties' +
                    '       FROM kategorie LEFT JOIN kategorie_tour ON kategorie.k_id = kategorie_tour.k_id' +
                    '       WHERE kategorie_tour.t_id IN (:id) OR kategorie.t_id IN (:id)' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=IMAGE_COUNT:::value=", CAST(COUNT(DISTINCT image.i_id) AS CHAR)) AS extended_object_properties' +
                    '      FROM image INNER JOIN kategorie ON image.k_id = kategorie.k_id' +
                    '      LEFT JOIN kategorie_tour ON kategorie.k_id = kategorie_tour.k_id' +
                    '      WHERE kategorie_tour.t_id IN (:id) OR kategorie.t_id IN (:id)' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=VIDEO_COUNT:::value=", CAST(COUNT(DISTINCT video.v_id) AS CHAR)) AS extended_object_properties' +
                    '       FROM video INNER JOIN kategorie ON video.k_id = kategorie.k_id' +
                    '       LEFT JOIN kategorie_tour ON kategorie.k_id = kategorie_tour.k_id' +
                    '       WHERE kategorie_tour.t_id IN (:id) OR kategorie.t_id IN (:id)',
                parameterNames: ['id']
            },
            {
                profile: 'navigation_objects',
                sql: '(SELECT CONCAT("navid=ROUTE_", t_id, ":::name=", COALESCE(t_name, "null"), ":::navtype=", "PREDECESSOR")' +
                    '  AS navigation_objects' +
                    '  FROM tour LEFT JOIN location_hirarchical as location ON tour.l_id = location.l_id' +
                    '  WHERE CONCAT(l_lochirarchietxt, t_name) <' +
                    '      (SELECT CONCAT(l_lochirarchietxt, t_name) FROM tour ' +
                    '       LEFT JOIN location_hirarchical as location ON tour.l_id = location.l_id WHERE t_id IN (:id))' +
                    '  ORDER BY CONCAT(l_lochirarchietxt, t_name) DESC, t_id DESC LIMIT 1) ' +
                    'UNION ' +
                    ' (SELECT CONCAT("navid=ROUTE_", t_id, ":::name=", COALESCE(t_name, "null"), ":::navtype=", "SUCCESSOR")' +
                    '  AS navigation_objects' +
                    '  FROM tour LEFT JOIN location_hirarchical as location ON tour.l_id = location.l_id' +
                    '   WHERE CONCAT(l_lochirarchietxt, t_name) >' +
                    '      (SELECT CONCAT(l_lochirarchietxt, t_name) FROM tour' +
                    '       LEFT JOIN location_hirarchical as location ON tour.l_id = location.l_id WHERE t_id IN (:id))' +
                    '   ORDER BY CONCAT(l_lochirarchietxt, t_name), t_id LIMIT 1)',
                parameterNames: ['id'],
                modes: ['details']
            },
            {
                profile: 'linkedplaylists',
                sql: 'SELECT CONCAT("type=playlist:::name=", COALESCE(p_name, "null"), ":::refId=", CAST(playlist.p_id AS CHAR),' +
                    '   ":::position=", COALESCE(tour_playlist.tp_pos, "null"),   ":::details=", COALESCE(tour_playlist.tp_details, "null"))' +
                    '  AS linkedplaylists' +
                    '  FROM playlist INNER JOIN tour_playlist ON playlist.p_id = tour_playlist.p_id WHERE tour_playlist.t_id IN (:id)' +
                    '  ORDER BY p_name',
                parameterNames: ['id']
            }
        ],
        selectFieldList: [
            '"ROUTE" AS type',
            't_calced_actiontype AS actiontype',
            't_calced_actiontype AS subtype',
            'CONCAT("ROUTE", "_", tour.t_id) AS id',
            'tour.k_id',
            'tour.t_id',
            'tour.l_id',
            'tour.t_calced_d_id',
            't_name',
            't_datevon AS t_dateshow',
            't_datevon',
            'DATE_FORMAT(t_datevon, GET_FORMAT(DATE, "ISO")) AS dateonly',
            'WEEK(t_datevon) AS week',
            'MONTH(t_datevon) AS month',
            'YEAR(t_datevon) AS year',
            't_gpstracks_basefile',
            't_gpstracks_state',
            't_meta_shortdesc',
            't_meta_shortdesc AS t_meta_shortdesc_md',
            'l_calced_gps_lat AS t_gps_lat',
            'l_calced_gps_lon AS t_gps_lon',
            'l_calced_gps_loc AS t_gps_loc',
            'l_lochirarchietxt AS l_lochirarchietxt',
            'l_lochirarchieids AS l_lochirarchieids',
            't_route_hm',
            't_ele_max',
            't_route_m',
            't_calced_sections',
            't_rate_ausdauer',
            't_rate_bildung',
            't_rate_gesamt',
            't_rate_kraft',
            't_rate_mental',
            't_rate_motive',
            't_rate_schwierigkeit',
            't_rate_wichtigkeit',
            't_rate',
            't_rate_ks',
            't_rate_firn',
            't_rate_gletscher',
            't_rate_klettern',
            't_rate_bergtour',
            't_rate_schneeschuh',
            't_desc_fuehrer',
            't_desc_gebiet',
            't_desc_sectionDetails',
            't_desc_talort',
            't_desc_ziel',
            't_gesperrt',
            't_calced_altAscFacet AS altAscFacet',
            't_calced_altMaxFacet AS altMaxFacet',
            't_calced_distFacet AS distFacet',
            't_route_dauer',
            't_calced_durFacet AS durFacet'],
        facetConfigs: {
            // dashboard
            'doublettes': {
                selectSql: 'SELECT COUNT(tour.t_id) AS count, "doublettes" AS value,' +
                    ' "doublettes" AS label, "true" AS id' +
                    ' FROM tour INNER JOIN (SELECT t_id AS id FROM tour WHERE t_key' +
                    '              IN (SELECT DISTINCT t_key AS name' +
                    '                  FROM tour GROUP BY name HAVING COUNT(*) > 1)' +
                    '             ) doublettes' +
                    '             ON tour.t_id=doublettes.id',
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
                selectSql: 'SELECT COUNT(tour.t_id) AS count, "noLocation" AS value,' +
                    ' "noLocation" AS label, "true" AS id' +
                    ' FROM tour WHERE l_id IS NULL OR l_id IN (0,1 )',
                filterField: 'tour.l_id',
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
                selectSql: 'SELECT COUNT(tour.t_id) AS count, "noSubType" AS value,' +
                    ' "noSubType" AS label, "true" AS id' +
                    ' FROM tour WHERE t_typ IS NULL OR t_typ in (0)',
                filterField: 'tour.t_calced_actiontype',
                action: AdapterFilterActions.IN
            },
            'todoDesc': {
                selectSql: 'SELECT COUNT(tour.t_id) AS count, "todoDesc" AS value,' +
                    ' "todoDesc" AS label, "true" AS id' +
                    ' FROM tour WHERE t_datevon IS NOT NULL AND t_meta_shortdesc LIKE "TODODESC%"',
                filterField: 't_datevon IS NOT NULL AND tour.t_meta_shortdesc',
                action: AdapterFilterActions.LIKE
            },
            'todoKeywords': {
                selectSql: 'SELECT COUNT(tour.t_id) AS count, "todoKeywords" AS value,' +
                    ' "todoKeywords" AS label, "true" AS id' +
                    ' FROM tour INNER JOIN tour_keyword ON tour.t_id=tour_keyword.t_id' +
                    ' INNER JOIN keyword ON tour_keyword.kw_id=keyword.kw_id ' +
                    'WHERE t_datevon IS NOT NULL AND keyword.kw_name IN ("KW_TODOKEYWORDS")',
                filterField: 't_datevon IS NOT NULL AND keyword.kw_name',
                action: AdapterFilterActions.IN
            },
            'unrated': {
                selectSql: 'SELECT COUNT(tour.t_id) AS count, "unrated" AS value,' +
                    ' "unrated" AS label, "true" AS id' +
                    ' FROM tour WHERE t_datevon IS NOT NULL AND (t_rate_gesamt IS NULL OR t_rate_gesamt in (0))',
                filterField: 't_datevon IS NOT NULL AND tour.t_rate_gesamt',
                action: AdapterFilterActions.IN
            },
            'unRatedChildren': {
                constValues: ['unRatedChildren'],
                filterField: '"666dummy999"'
            },
            // common
            'id_notin_is': {
                filterField: 'CONCAT("ROUTE", "_", tour.t_id)',
                action: AdapterFilterActions.NOTIN
            },
            'actiontype_ss': {
                selectField: 'tour.t_calced_actiontype'
            },
            'blocked_is': {
                selectField: 't_gesperrt'
            },
            'data_tech_alt_asc_facet_is': {
                selectField: 't_calced_altAscFacet',
                orderBy: 'value asc'
            },
            'data_tech_alt_max_facet_is': {
                selectField: 't_calced_altMaxFacet',
                orderBy: 'value asc'
            },
            'data_tech_dist_facets_fs': {
                selectField: 't_calced_distFacet',
                orderBy: 'value asc'
            },
            'data_tech_dur_facet_fs': {
                selectField: 't_calced_durFacet',
                orderBy: 'value asc'
            },
            'data_tech_sections_facet_ss': {
                selectField: 'tour.t_calced_sections',
                orderBy: 'value asc'
            },
            'data_info_guides_s': {
                selectField: 'tour.t_desc_fuehrer',
                orderBy: 'value asc'
            },
            'data_info_baseloc_s': {
                selectField: 'tour.t_desc_talort',
                orderBy: 'value asc'
            },
            'data_info_region_s': {
                selectField: 'tour.t_desc_gebiet',
                orderBy: 'value asc'
            },
            'done_ss': {
                selectField: 'CONCAT("DONE", (t_datevon IS NOT NULL))',
                orderBy: 'value asc'
            },
            'gpstracks_state_is': {
                selectField: 'tour.t_gpstracks_state'
            },
            'info_id_is': {
                selectSql: 'SELECT COUNT(tour_info.if_id) AS count, info.if_id AS value,' +
                    ' info.if_name AS label, info.if_id AS id' +
                    ' FROM info LEFT JOIN tour_info ON tour_info.if_id = info.if_id ' +
                    ' GROUP BY value, label, id' +
                    ' ORDER BY label',
                filterFields: ['tif.if_id'],
                action: AdapterFilterActions.IN_NUMBER
            },
            'initial_s': {
                selectSql: 'SELECT COUNT(*) as count, ' +
                    ' SUBSTR(UPPER(t_name), 1, 1) as value ' +
                    'FROM tour ' +
                    'WHERE LENGTH(t_name) > 0 ' +
                    'GROUP BY SUBSTR(UPPER(t_name), 1, 1)' +
                    'ORDER BY value',
            },
            'keywords_txt': {
                selectSql: 'SELECT count(keyword.kw_id) AS count, ' +
                    '  kw_name AS value ' +
                    'FROM' +
                    ' keyword left join tour_keyword on keyword.kw_id=tour_keyword.kw_id' +
                    ' WHERE kw_name like "KW_%"' +
                    ' GROUP BY value' +
                    ' ORDER BY count desc',
                filterField: 'kw_name',
                action: AdapterFilterActions.LIKEIN
            },
            'loc_id_i': {
                noFacet: true
            },
            'loc_lochirarchie_txt': {
                selectSql: 'SELECT COUNT(tour.l_id) AS count, GetTechName(l_name) AS value,' +
                    ' l_lochirarchietxt AS label, location.l_id AS id' +
                    ' FROM location_hirarchical as location LEFT JOIN tour ON tour.l_id = location.l_id ' +
                    ' GROUP BY value, label, id' +
                    ' ORDER BY label ASC',
                triggerTables: ['location', 'tour'],
                filterField: 'GetTechName(l_lochirarchietxt)',
                action: AdapterFilterActions.LIKE
            },
            'month_is': {
                selectField: 'MONTH(t_datevon)',
                orderBy: 'value asc'
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
                selectField: 't_rate_gesamt',
                orderBy: 'value asc'
            },
            'rate_pers_schwierigkeit_is': {
                selectField: 't_rate_schwierigkeit',
                orderBy: 'value asc'
            },
            'rate_tech_klettern_ss': {
                selectField: 't_rate_klettern',
                orderBy: 'value asc'
            },
            'rate_tech_ks_ss': {
                selectField: 't_rate_ks',
                orderBy: 'value asc'
            },
            'rate_tech_schneeschuh_ss': {
                selectField: 't_rate_schneeschuh',
                orderBy: 'value asc'
            },
            'rate_tech_overall_ss': {
                selectField: 't_rate',
                orderBy: 'value asc'
            },
            'route_attr_ss': {
                selectSql: 'SELECT COUNT(DISTINCT t_id) as count, route_attr AS value, route_attr AS label, route_attr AS id' +
                    ' FROM (' +
                    '    SELECT kt.k_id AS k_id, kt.t_id AS t_id, kt_route_attr AS route_attr' +
                    '      FROM tour INNER JOIN kategorie_tour kt ON tour.t_id = kt.t_id' +
                    '      WHERE kt_route_attr IS NOT NULL' +
                    '     UNION ALL' +
                    '    SELECT k.k_id AS k_id, k.t_id AS t_id, k_route_attr AS route_attr' +
                    '      FROM tour INNER JOIN kategorie k ON tour.t_id = k.t_id' +
                    '      WHERE k_route_attr IS NOT NULL' +
                    ' ) routeattrs' +
                    ' GROUP BY value, label, id' +
                    ' ORDER BY label',
                filterFields: ['REGEXP_REPLACE(TRIM(REPLACE(REPLACE(REPLACE(REPLACE(kategorie_tour.kt_route_attr, "(", " "), ")", " "), ",", " "), ";", " ")), "[[:space:]]+", " ")',
                    'REGEXP_REPLACE(TRIM(REPLACE(REPLACE(REPLACE(REPLACE(kategorie.k_route_attr, "(", " "), ")", " "), ",", " "), ";", " ")), "[[:space:]]+", " ")'],
                action: AdapterFilterActions.IN
            },
            'route_attr_txt': {
                filterFields: ['kategorie_tour.kt_route_attr', 'kategorie.k_route_attr'],
                action: AdapterFilterActions.LIKEIN
            },
            'subtype_ss': {
                selectField: 'tour.t_calced_actiontype'
            },
            'track_id_i': {
                filterFields: ['kategorie.k_id', 'kategorie_tour.k_id'],
                action: AdapterFilterActions.IN_NUMBER
            },
            'track_id_is': {
                selectSql: 'SELECT COUNT(kategorie.k_id) AS count, kategorie.k_id AS value,' +
                    ' kategorie.k_name AS label, kategorie.k_id AS id' +
                    ' FROM kategorie LEFT JOIN tour ON kategorie.t_id = tour.t_id ' +
                    ' GROUP BY value, label, id' +
                    ' ORDER BY label',
                filterFields: ['kategorie.k_id', 'kategorie_tour.k_id'],
                action: AdapterFilterActions.IN_NUMBER
            },
            'trip_id_i': {
                filterFields: ['kt_trip.tr_id'],
                action: AdapterFilterActions.IN_NUMBER
            },
            'trip_id_is': {
                filterFields: ['kt_trip.tr_id'],
                action: AdapterFilterActions.IN_NUMBER
            },
            'type_txt': {
                constValues: ['route', 'track', 'image', 'odimgobject', 'video', 'location', 'trip', 'news', 'destination', 'info', 'playlist', 'poi'],
                filterField: '"route"',
                selectLimit: 1
            },
            'week_is': {
                selectField: 'WEEK(t_datevon)',
                orderBy: 'value asc'
            },
            'year_is': {
                selectField: 'YEAR(t_datevon)',
                orderBy: 'value asc'
            },
            // statistics
            'statistics': {
                selectSql: 'select CONCAT(typ, "-", type, "-", year) as value, count' +
                    '         from (' +
                    '                  select distinct \'ROUTE_DONE\' as typ, type, year, count(*) count' +
                    '                  from (' +
                    '                           select distinct t_name          as name,' +
                    '                                           t_calced_actiontype as type,' +
                    '                                           YEAR(K_DATEVON) as year,' +
                    '                                           K_DATEVON' +
                    '                           from kategorie k' +
                    '                                    inner join kategorie_tour kt on k.K_ID = kt.K_ID' +
                    '                                    inner join tour t on kt.t_ID = t.t_ID' +
                    '                           where kt.t_id > 1' +
                    '                             and kt.t_id not in (1, 1681)' +
                    '                             and DATE(k_datevon) > DATE(t_datevon)' +
                    '' +
                    '                           union all' +
                    '' +
                    '                           select distinct t_name          as name,' +
                    '                                           t_calced_actiontype as type,' +
                    '                                           YEAR(K_DATEVON) as year,' +
                    '                                           K_DATEVON' +
                    '                           from kategorie k' +
                    '                                    inner join tour t on k.t_ID = t.t_ID' +
                    '                           where t.t_id > 1' +
                    '                             and t.t_id not in (1, 1681)' +
                    '                             and DATE(k_datevon) > DATE(t_datevon)' +
                    '' +
                    '                           union all' +
                    '' +
                    '                           select distinct t_name          as name,' +
                    '                                           CONCAT("ele_", t_calced_altMaxFacet)   as type,' +
                    '                                           YEAR(K_DATEVON) as year,' +
                    '                                           K_DATEVON' +
                    '                           from kategorie k' +
                    '                                    inner join kategorie_tour kt on k.K_ID = kt.K_ID' +
                    '                                    inner join tour t on kt.t_ID = t.t_ID' +
                    '                           where kt.t_id > 1' +
                    '                             and kt.t_id not in (1, 1681)' +
                    '                             and DATE(k_datevon) > DATE(t_datevon)' +
                    '                             and t_ele_max is not null' +
                    '' +
                    '                           union all' +
                    '' +
                    '                           select distinct t_name          as name,' +
                    '                                           CONCAT("ele_", t_calced_altMaxFacet)  as type,' +
                    '                                           YEAR(K_DATEVON) as year,' +
                    '                                           K_DATEVON' +
                    '                           from kategorie k' +
                    '                                    inner join tour t on k.t_ID = t.t_ID' +
                    '                           where t.t_id > 1' +
                    '                             and t.t_id not in (1, 1681)' +
                    '                             and DATE(k_datevon) > DATE(t_datevon)' +
                    '                             and t_ele_max is not null' +
                    '                       ) x' +
                    '                  where year is not null' +
                    '                  group by type, year' +
                    '' +
                    '                  UNION' +
                    '' +
                    '                  select distinct \'ROUTE_DONE\' as typ, type, \'ALLOVER\' year, count(*) count' +
                    '                  from (' +
                    '                           select distinct t_name as name, t_calced_actiontype as type, K_DATEVON' +
                    '                           from kategorie k' +
                    '                                    inner join kategorie_tour kt on k.K_ID = kt.K_ID' +
                    '                                    inner join tour t on kt.t_ID = t.t_ID' +
                    '                           where kt.t_id > 1' +
                    '                             and kt.t_id not in (1, 1681)' +
                    '                             and DATE(k_datevon) > DATE(t_datevon)' +
                    '' +
                    '                           union all' +
                    '' +
                    '                           select distinct t_name as name, t_calced_actiontype as type, K_DATEVON' +
                    '                           from kategorie k' +
                    '                                    inner join tour t on k.t_ID = t.t_ID' +
                    '                           where t.t_id > 1' +
                    '                             and t.t_id not in (1, 1681)' +
                    '                             and DATE(k_datevon) > DATE(t_datevon)' +
                    '' +
                    '                           union all' +
                    '' +
                    '                           select distinct t_name as name, CONCAT("ele_", t_calced_altMaxFacet) as type, K_DATEVON' +
                    '                           from kategorie k' +
                    '                                    inner join kategorie_tour kt on k.K_ID = kt.K_ID' +
                    '                                    inner join tour t on kt.t_ID = t.t_ID' +
                    '                           where kt.t_id > 1' +
                    '                             and kt.t_id not in (1, 1681)' +
                    '                             and DATE(k_datevon) > DATE(t_datevon)' +
                    '                             and t_ele_max is not null' +
                    '' +
                    '                           union all' +
                    '' +
                    '                           select distinct t_name as name, CONCAT("ele_", t_calced_altMaxFacet) as type, K_DATEVON' +
                    '                           from kategorie k' +
                    '                                    inner join tour t on k.t_ID = t.t_ID' +
                    '                           where t.t_id > 1' +
                    '                             and t.t_id not in (1, 1681)' +
                    '                             and DATE(k_datevon) > DATE(t_datevon)' +
                    '                             and t_ele_max is not null' +
                    '                       ) x' +
                    '                  group by type' +
                    '' +
                    '                  UNION' +
                    '' +
                    '                  select \'ROUTE_NEW\' as typ, type, year, count(*) count' +
                    '                  from (' +
                    '                           select distinct t_name as            name,' +
                    '                                           t_calced_actiontype as type,' +
                    '                                           min(YEAR(t_DATEVON)) year' +
                    '                           from tour t' +
                    '                           where t.t_id > 1' +
                    '                             and t.t_id not in (1, 1681)' +
                    '                             and T_DATEVON is not null' +
                    '                           group by name, type' +
                    '                       ) x' +
                    '                  where year is not null' +
                    '                  group by type, year' +
                    '' +
                    '                  UNION' +
                    '' +
                    '                  select \'ROUTE_NEW\' as typ, type, year, count(*) count' +
                    '                  from (' +
                    '                           select distinct t_name as            name,' +
                    '                                           CONCAT("ele_", t_calced_altMaxFacet)  as         type,' +
                    '                                           min(YEAR(t_DATEVON)) year' +
                    '                           from tour t' +
                    '                           where t.t_id > 1' +
                    '                             and t.t_id not in (1, 1681)' +
                    '                             and T_DATEVON is not null' +
                    '                             and t_ele_max is not null' +
                    '                           group by name, type' +
                    '                       ) x' +
                    '                  where year is not null' +
                    '                  group by type, year' +
                    '' +
                    '                  UNION' +
                    '' +
                    '                  select \'ROUTE_NEW\' as typ, type, \'ALLOVER\' year, count(*) count' +
                    '                  from (' +
                    '                           select distinct t_name as            name,' +
                    '                                           t_calced_actiontype as type,' +
                    '                                           min(YEAR(t_DATEVON)) year' +
                    '                           from tour t' +
                    '                           where t.t_id > 1' +
                    '                             and t.t_id not in (1, 1681)' +
                    '                             and T_DATEVON is not null' +
                    '                           group by name, type' +
                    '                       ) x' +
                    '                  where year is not null' +
                    '                  group by type, type' +
                    '' +
                    '                  UNION' +
                    '' +
                    '                  select \'ROUTE_NEW\' as typ, type, \'ALLOVER\' year, count(*) count' +
                    '                  from (' +
                    '                           select distinct t_name as            name,' +
                    '                                           CONCAT("ele_", t_calced_altMaxFacet) as type,' +
                    '                                           min(YEAR(t_DATEVON)) year' +
                    '                           from tour t' +
                    '                           where t.t_id > 1' +
                    '                             and t.t_id not in (1, 1681)' +
                    '                             and T_DATEVON is not null' +
                    '                             and t_ele_max is not null' +
                    '                           group by name, type' +
                    '                       ) x' +
                    '                  where year is not null' +
                    '                  group by type, type' +
                    '              ) allover' +
                    '        order by value, count'
            }
        },
        sortMapping: {
            'countImages': '(SELECT COUNT(DISTINCT i_sort.i_id) FROM image i_sort' +
                '      INNER JOIN kategorie k_sort ON i_sort.k_id = k_sort.k_id' +
                '      LEFT JOIN kategorie_tour kt_sort ON k_sort.k_id = kt_sort.k_id' +
                '      WHERE kt_sort.t_id = tour.t_id OR k_sort.t_id = tour.t_id) ASC, t_name ASC',
            'countImagesDesc': '(SELECT COUNT(DISTINCT i_sort.i_id) FROM image i_sort' +
                '      INNER JOIN kategorie k_sort ON i_sort.k_id = k_sort.k_id' +
                '      LEFT JOIN kategorie_tour kt_sort ON k_sort.k_id = kt_sort.k_id' +
                '      WHERE kt_sort.t_id = tour.t_id OR k_sort.t_id = tour.t_id) DESC, t_name ASC',
            'countInfos': '(SELECT COUNT(DISTINCT if_sort.if_id) FROM tour_info if_sort WHERE if_sort.t_id = tour.t_id) ASC, t_name ASC',
            'countInfosDesc': '(SELECT COUNT(DISTINCT if_sort.if_id) FROM tour_info if_sort WHERE if_sort.t_id = tour.t_id) DESC, t_name ASC',
            'countTracks': '(SELECT COUNT(DISTINCT k_sort.k_id) FROM kategorie k_sort ' +
                '      LEFT JOIN kategorie_tour kt_sort ON k_sort.k_id = kt_sort.k_id' +
                '      WHERE kt_sort.t_id = tour.t_id OR k_sort.t_id = tour.t_id) ASC, t_name ASC',
            'countTracksDesc': '(SELECT COUNT(DISTINCT k_sort.k_id) FROM kategorie k_sort ' +
                '      LEFT JOIN kategorie_tour kt_sort ON k_sort.k_id = kt_sort.k_id' +
                '      WHERE kt_sort.t_id = tour.t_id OR k_sort.t_id = tour.t_id) DESC, t_name ASC',
            'countTrips': '(SELECT COUNT(DISTINCT tr_sort.tr_id) FROM trip tr_sort' +
                '      INNER JOIN kategorie k_sort ON tr_sort.tr_id = k_sort.tr_id' +
                '      LEFT JOIN kategorie_tour kt_sort ON k_sort.k_id = kt_sort.k_id' +
                '      WHERE kt_sort.t_id = tour.t_id OR k_sort.t_id = tour.t_id) ASC, t_name ASC',
            'countTripsDesc': '(SELECT COUNT(DISTINCT tr_sort.tr_id) FROM trip tr_sort' +
                '      INNER JOIN kategorie k_sort ON tr_sort.tr_id = k_sort.tr_id' +
                '      LEFT JOIN kategorie_tour kt_sort ON k_sort.k_id = kt_sort.k_id' +
                '      WHERE kt_sort.t_id = tour.t_id OR k_sort.t_id = tour.t_id) DESC, t_name ASC',
            'countVideos': '(SELECT COUNT(DISTINCT v_sort.v_id) FROM video v_sort' +
                '      INNER JOIN kategorie k_sort ON v_sort.k_id = k_sort.k_id' +
                '      LEFT JOIN kategorie_tour kt_sort ON k_sort.k_id = kt_sort.k_id' +
                '      WHERE kt_sort.t_id = tour.t_id OR k_sort.t_id = tour.t_id) ASC, t_name ASC',
            'countVideosDesc': '(SELECT COUNT(DISTINCT v_sort.v_id) FROM video v_sort' +
                '      INNER JOIN kategorie k_sort ON v_sort.k_id = k_sort.k_id' +
                '      LEFT JOIN kategorie_tour kt_sort ON k_sort.k_id = kt_sort.k_id' +
                '      WHERE kt_sort.t_id = tour.t_id OR k_sort.t_id = tour.t_id) DESC, t_name ASC',
            'date': 't_datevon DESC, t_name ASC',
            'dateAsc': 't_datevon ASC, t_name ASC',
            'distance': 'geodist ASC, t_name ASC',
            'dataTechDurDesc': 't_route_dauer DESC, t_name ASC',
            'dataTechAltDesc': 't_route_hm DESC, t_name ASC',
            'dataTechMaxDesc': 't_ele_max DESC, t_name ASC',
            'dataTechDistDesc': 't_route_m DESC, t_name ASC',
            'dataTechSectionsDesc': 't_calced_sections DESC, t_name ASC',
            'dataTechDurAsc': 't_route_dauer ASC, t_name ASC',
            'dataTechAltAsc': 't_route_hm ASC, t_name ASC',
            'dataTechMaxAsc': 't_ele_max ASC, t_name ASC',
            'dataTechDistAsc': 't_route_m ASC, t_name ASC',
            'dataTechSectionsAsc': 't_calced_sections ASC, t_name ASC',
            'forExport': 'tour.t_id ASC',
            'name': 't_name ASC',
            'ratePers': 't_rate_gesamt DESC, t_datevon DESC, t_name ASC',
            'playlistPos': 'tour_playlist.tp_pos ASC',
            'location': 'l_lochirarchietxt ASC, t_name ASC',
            'locationDetails': 'l_lochirarchietxt ASC, t_name ASC',
            'region': 't_desc_gebiet ASC, t_name ASC',
            'relevance': 't_datevon DESC, t_name ASC'
        },
        spartialConfig: {
            lat: 'l_geo_latdeg',
            lon: 'l_geo_longdeg',
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
            noLocation: 'tour.l_id',
            noRoute: '"666dummy999"',
            noSubType: 'tour.t_calced_actiontype',
            todoDesc: '"todoDesc"',
            todoKeywords: 'keyword.kw_name',
            unrated: 'tour.t_rate_gesamt',
            unRatedChildren: '"unRatedChildren"',
            // common
            id: 'tour.t_id',
            destination_id_s: 'dt.d_id',
            destination_id_ss: 'dt.d_id',
            image_id_is: '"666dummy999"',
            image_id_i: '"666dummy999"',
            info_id_i: '"666dummy999"',
            info_id_is: '"666dummy999"',
            poi_id_i: '"666dummy999"',
            poi_id_is: '"666dummy999"',
            route_id_i: 'tour.t_id',
            route_id_is: 'tour.t_id',
            video_id_is: '"666dummy999"',
            video_id_i: '"666dummy999"',
            trip_id_is: '"666dummy999"',
            loc_id_i: 'tour.l_id',
            loc_id_is: 'tour.l_id',
            loc_lochirarchie_ids_txt: 'location.l_id',
            l_lochirarchietxt: 'location.l_name',
            initial_s: 'SUBSTR(UPPER(t_name), 1, 1)',
            html: 'CONCAT(t_name, " ", COALESCE(t_desc_gebiet, ""), " ", COALESCE(t_meta_shortdesc, ""), " ", l_lochirarchietxt)'
        },
        writeMapping: {
            'tour.l_id': ':loc_id_i:',
            'tour.k_id': ':track_id_i:',
            'tour.t_datevon': ':datestart_dt:',
            'tour.t_gesperrt': ':blocked_i:',
            'tour.t_datebis': ':dateend_dt:',
            'tour.t_meta_shortdesc': ':desc_txt:',
//                'tour.t_meta_shortdesc_md': ':desc_md_txt:',
//                'tour.t_meta_shortdesc_html': ':desc_html_txt:',
            'tour.t_route_hm': ':data_tech_alt_asc_i:',
            'tour.t_ele_max': ':data_tech_alt_max_i:',
            'tour.t_route_m': ':data_tech_dist_f:',
            'tour.t_route_dauer': ':data_tech_dur_f:',
            'tour.t_desc_fuehrer': ':data_info_guides_s:',
            'tour.t_desc_gebiet': ':data_info_region_s:',
            'tour.t_desc_talort': ':data_info_baseloc_s:',
            'tour.t_desc_ziel': ':data_info_destloc_s:',
            'tour.t_desc_sectionDetails': ':data_info_section_details_s:',
            'tour.t_rate_ausdauer': ':rate_pers_ausdauer_i:',
            'tour.t_rate_bildung': ':rate_pers_bildung_i:',
            'tour.t_rate_gesamt': ':rate_pers_gesamt_i:',
            'tour.t_rate_kraft': ':rate_pers_kraft_i:',
            'tour.t_rate_mental': ':rate_pers_mental_i:',
            'tour.t_rate_motive': ':rate_pers_motive_i:',
            'tour.t_rate_schwierigkeit': ':rate_pers_schwierigkeit_i:',
            'tour.t_rate_wichtigkeit': ':rate_pers_wichtigkeit_i:',
            'tour.t_rate': ':rate_tech_overall_s:',
            'tour.t_rate_ks': ':rate_tech_ks_s:',
            'tour.t_rate_firn': ':rate_tech_firn_s:',
            'tour.t_rate_gletscher': ':rate_tech_gletscher_s:',
            'tour.t_rate_klettern': ':rate_tech_klettern_s:',
            'tour.t_rate_bergtour': ':rate_tech_bergtour_s:',
            'tour.t_rate_schneeschuh': ':rate_tech_schneeschuh_s:',
            'tour.t_gpstracks_basefile': ':gpstracks_basefile_s:',
            'tour.t_gpstracks_gpx': ':gpstrack_src_s:',
            'tour.t_gpstracks_state': ':gpstracks_state_i:',
            'tour.t_key': ':key_s:',
            'tour.t_name': ':name_s:',
            'tour.t_typ': ':subtype_s:'
        },
        fieldMapping: {
            id: 'id',
            destination_id_s: 't_calced_d_id',
            destination_id_ss: 't_calced_d_id',
            image_id_i: 'i_id',
            image_id_is: 'i_id',
            loc_id_i: 'l_id',
            loc_id_is: 'l_id',
            route_id_i: 't_id',
            route_id_is: 't_id',
            track_id_i: 'k_id',
            track_id_is: 'k_id',
            trip_id_i: 'tr_id',
            trip_id_is: 'tr_id',
            news_id_i: 'n_id',
            news_id_is: 'n_id',
            dateshow_dt: 't_dateshow',
            datestart_dt: 't_datevon',
            dateend_dt: 't_datebis',
            desc_txt: 't_meta_shortdesc',
            desc_md_txt: 't_meta_shortdesc_md',
            desc_html_txt: 't_meta_shortdesc_html',
            blocked_i: 't_gesperrt',
            distance: 'geodist',
            geo_lon_s: 't_gps_lon',
            geo_lat_s: 't_gps_lat',
            geo_loc_p: 't_gps_loc',
            data_tech_alt_asc_i: 't_route_hm',
            data_tech_alt_desc_i: 'altDesc',
            data_tech_alt_min_i: 'altMin',
            data_tech_alt_max_i: 't_ele_max',
            data_tech_dist_f: 't_route_m',
            data_tech_dur_f: 't_route_dauer',
            data_tech_sections_s: 't_calced_sections',
            data_info_guides_s: 't_desc_fuehrer',
            data_info_region_s: 't_desc_gebiet',
            data_info_baseloc_s: 't_desc_talort',
            data_info_destloc_s: 't_desc_ziel',
            data_info_section_details_s: 't_desc_sectionDetails',
            rate_pers_ausdauer_i: 't_rate_ausdauer',
            rate_pers_bildung_i: 't_rate_bildung',
            rate_pers_gesamt_i: 't_rate_gesamt',
            rate_pers_kraft_i: 't_rate_kraft',
            rate_pers_mental_i: 't_rate_mental',
            rate_pers_motive_i: 't_rate_motive',
            rate_pers_schwierigkeit_i: 't_rate_schwierigkeit',
            rate_pers_wichtigkeit_i: 't_rate_wichtigkeit',
            rate_tech_overall_s: 't_rate',
            rate_tech_ks_s: 't_rate_ks',
            rate_tech_firn_s: 't_rate_firn',
            rate_tech_gletscher_s: 't_rate_gletscher',
            rate_tech_klettern_s: 't_rate_klettern',
            rate_tech_bergtour_s: 't_rate_bergtour',
            rate_tech_schneeschuh_s: 't_rate_schneeschuh',
            gpstracks_basefile_s: 't_gpstracks_basefile',
            gpstrack_src_s: 't_gpstracks_gpx',
            gpstracks_state_i: 't_gpstracks_state',
            keywords_txt: 't_keywords',
            loc_lochirarchie_s: 'l_lochirarchietxt',
            loc_lochirarchie_ids_s: 'l_lochirarchieids',
            playlists_txt: 't_playlists',
            route_attr_s: 't_k_route_attr',
            linked_route_attr_s: 't_kt_route_attr',
            name_s: 't_name',
            type_s: 'type',
            actiontype_s: 'actionType',
            subtype_s: 'subtype',
            i_fav_url_txt: 'i_fav_url_txt'
        }
    };

    public static readonly keywordModelConfigType: KeywordModelConfigJoinType = {
        table: 'tour', joinTable: 'tour_keyword', fieldReference: 't_id'
    };

    public static readonly playlistModelConfigType: PlaylistModelConfigJoinType = {
        table: 'tour', joinTable: 'tour_playlist', fieldReference: 't_id', positionField: 'tp_pos',
        detailsField: 'tp_details'
    };

    public static readonly joinModelConfigTypeLinkedInfos: JoinModelConfigTableType = {
        baseTableIdField: 't_id',
        joinTable: 'tour_info',
        joinFieldMappings: {
            'if_id': 'refId',
            'tif_linked_details': 'linkedDetails'
        }
    };

    public static readonly joinModelConfigTypeLinkedPois: JoinModelConfigTableType = {
        baseTableIdField: 't_id',
        joinTable: 'tour_poi',
        joinFieldMappings: {
            'poi_id': 'refId',
            'tpoi_pos': 'position',
            'tpoi_type': 'poitype'
        }
    };

    public static readonly actionTagAssignConfig: ActionTagAssignTableConfigType = {
        table: 'tour',
        idField: 't_id',
        references: {
            'loc_lochirarchie_txt': {
                table: 'location', idField: 'l_id', referenceField: 'l_id'
            },
            'track_id_is': {
                table: 'kategorie', idField: 'k_id', referenceField: 'k_id'
            }
        }
    };

    public static readonly actionTagAssignJoinConfig: ActionTagAssignJoinTableConfigType = {
        table: 'tour',
        idField: 't_id',
        references: {
            'info_id_is': {
                joinedTable: 'info',
                joinedIdField: 'if_id',
                joinTable: 'tour_info',
                joinBaseIdField: 't_id',
                joinReferenceField: 'if_id'
            }
        }
    };

    public static readonly actionTagBlockConfig: ActionTagBlockTableConfigType = {
        table: 'tour', idField: 't_id', blockField: 't_gesperrt'
    };

    public static readonly actionTagReplaceConfig: ActionTagReplaceTableConfigType = {
        table: 'tour',
        fieldId: 't_id',
        referenced: [
            { table: 'kategorie', fieldReference: 't_id' },
        ],
        joins: [
            { table: 'kategorie_tour', fieldReference: 't_id' },
            { table: 'tour_keyword', fieldReference: 't_id' },
            { table: 'tour_info', fieldReference: 't_id' }
        ]
    };
}

