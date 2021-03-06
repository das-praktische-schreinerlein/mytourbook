import {TableConfig} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {AdapterFilterActions} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';
import {ActionTagBlockTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-block.adapter';
import {ActionTagReplaceTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-replace.adapter';
import {ActionTagAssignTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-assign.adapter';
import {KeywordModelConfigJoinType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-keyword.adapter';
import {JoinModelConfigTableType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-join.adapter';

export class SqlMytbDbTrackConfig {
    public static readonly tableConfig: TableConfig = {
        key: 'track',
        tableName: 'kategorie',
        selectFrom: 'kategorie LEFT JOIN location ON location.l_id = kategorie.l_id ',
//                        'LEFT JOIN image ON kategorie.i_id=image.i_id ' +
        optionalGroupBy: [
            {
                from: 'LEFT JOIN kategorie_keyword ON kategorie.k_id=kategorie_keyword.k_id ' +
                    'LEFT JOIN keyword ON kategorie_keyword.kw_id=keyword.kw_id ',
                triggerParams: ['id', 'keywords_txt', 'todoKeywords'],
                groupByFields: ['GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS k_keywords']
            },
            {
                from: 'LEFT JOIN kategorie_tour ON kategorie.k_id=kategorie_tour.k_id ' +
                    'LEFT JOIN tour kt ON kategorie_tour.t_id=kt.t_id OR kategorie.t_id=kt.t_id ',
                triggerParams: ['route_id_i', 'route_id_is', 'destination_id_s', 'destination_id_ss'],
                groupByFields: ['GROUP_CONCAT(DISTINCT kt.t_id ORDER BY kt.t_id SEPARATOR ", ") AS k_kt_ids']
            },
            {
                from: 'LEFT JOIN tour kt2 ON kategorie.t_id=kt2.t_id ' +
                    'LEFT JOIN destination dt ON dt.d_id in (MD5(CONCAT(kt.l_id, "_", kt.t_desc_gebiet, "_", kt.t_desc_ziel, "_", kt.t_typ)), ' +
                    '                                          MD5(CONCAT(kt2.l_id, "_", kt2.t_desc_gebiet, "_", kt2.t_desc_ziel, "_", kt2.t_typ)))',
                triggerParams: ['destination_id_s', 'destination_id_ss'],
                groupByFields: []
            },
            {
                from: 'LEFT JOIN news ON kategorie.k_datevon >= news.n_datevon AND kategorie.k_datevon <= news.n_datebis',
                triggerParams: ['news_id_i', 'news_id_is'],
                groupByFields: ['news.n_id']
            },
            {
                from: 'INNER JOIN (SELECT k_id AS id FROM kategorie WHERE k_name IN' +
                    '                (SELECT DISTINCT k_name AS name FROM kategorie GROUP BY name HAVING COUNT(*) > 1)' +
                    '             ) doublettes' +
                    '             ON kategorie.k_id=doublettes.id',
                triggerParams: ['doublettes'],
                groupByFields: []
            },
            {
                from: 'INNER JOIN (SELECT DISTINCT k_id AS id FROM kategorie' +
                    '      WHERE k_rate_motive > 0' +
                    '       AND k_id NOT IN  (SELECT DISTINCT k_ID FROM image' +
                    '            WHERE i_rate >= k_rate_motive OR i_rate >= 9 OR i_rate = 6 AND kategorie.k_id=image.k_id)' +
                    '       AND EXISTS (SELECT DISTINCT k_ID FROM image WHERE kategorie.k_id=image.k_id AND i_rate>0)' +
                    '  ) conflictingRates' +
                    '  ON kategorie.k_id=conflictingRates.id',
                triggerParams: ['conflictingRates'],
                groupByFields: []
            },
            {
                from: 'INNER JOIN' +
                    '      (SELECT DISTINCT k_id AS id FROM kategorie' +
                    '       WHERE k_id IN (SELECT DISTINCT k_ID FROM image WHERE i_rate = 0 OR i_rate IS NULL)' +
                    '       AND k_id NOT IN (SELECT DISTINCT k_ID FROM image WHERE i_rate <> 0 AND i_rate IS NOT NULL)' +
                    '      ) noFavoriteChildren' +
                    '  ON kategorie.k_id=noFavoriteChildren.id',
                triggerParams: ['noFavoriteChildren'],
                groupByFields: []
            },
            {
                from: 'INNER JOIN (SELECT DISTINCT k_id AS id FROM kategorie WHERE k_id IN' +
                    '      (SELECT DISTINCT k_ID FROM image WHERE i_rate = 0 OR i_rate IS NULL)) unRatedChildren' +
                    '   ON kategorie.k_id=unRatedChildren.id',
                triggerParams: ['unRatedChildren'],
                groupByFields: []
            },
            {
                from: 'INNER JOIN (SELECT DISTINCT k_id AS id FROM kategorie WHERE k_id NOT IN ' +
                    '     (SELECT DISTINCT k_ID FROM image INNER JOIN image_playlist ON image.i_id=image_playlist.I_ID WHERE p_id IN ' +
                    '          (SELECT DISTINCT p_id FROM playlist WHERE p_name like "%kategorie_favorites%"))' +
                    '      AND k_id IN (SELECT DISTINCT k_ID FROM image WHERE i_rate = 0 OR i_rate IS NULL)) noMainFavoriteChildren' +
                    ' ON kategorie.k_id=noMainFavoriteChildren.id',
                triggerParams: ['noMainFavoriteChildren'],
                groupByFields: []
            },
            {
                from: ' ',
                triggerParams: ['id', 'loadTrack'],
                groupByFields: ['k_gpstracks_gpx_source']
            }
        ],
        groupbBySelectFieldListIgnore: ['k_keywords'],
        loadDetailData: [
            {
                profile: 'image',
                sql: 'SELECT CONCAT(image.i_dir, "/", image.i_file) AS i_fav_url_txt ' +
                    'FROM image INNER JOIN image_playlist ON image.i_id=image_playlist.i_id ' +
                    'WHERE image.k_id IN (:id) and p_id in (18)',
                parameterNames: ['id']
            },
            {
                profile: 'linkedroutes',
                sql: '(SELECT CONCAT("type=subroute:::name=", COALESCE(t_name, "null"), ":::refId=", CAST(tour.t_id AS CHAR),' +
                    '   ":::full=", CAST(COALESCE(kt_full, "false") AS CHAR))' +
                    '  AS linkedroutes' +
                    '  FROM tour INNER JOIN kategorie_tour ON kategorie_tour.t_id = tour.t_id WHERE kategorie_tour.k_id IN (:id)' +
                    '  ORDER BY t_name) ',
                parameterNames: ['id']
            },
            {
                profile: 'keywords',
                sql: 'SELECT GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS keywords ' +
                    'FROM kategorie INNER JOIN kategorie_keyword ON kategorie.k_id=kategorie_keyword.k_id' +
                    ' INNER JOIN keyword ON kategorie_keyword.kw_id=keyword.kw_id ' +
                    'WHERE kategorie.k_id IN (:id)',
                parameterNames: ['id'],
                modes: ['full']
            },
            {
                profile: 'extended_object_properties',
                sql: 'SELECT CONCAT("category=ENTITYCOUNT:::name=ROUTE_COUNT:::value=", CAST(COUNT(DISTINCT tour.t_id) AS CHAR)) AS extended_object_properties' +
                    '      FROM kategorie' +
                    '      LEFT JOIN kategorie_tour ON kategorie_tour.k_id = kategorie.k_id' +
                    '      INNER JOIN tour ON tour.t_id = kategorie.t_id OR tour.t_id = kategorie_tour.t_id' +
                    '      WHERE kategorie.k_id IN (:id)' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=ADDITIONAL_ROUTE_COUNT:::value=", CAST(COUNT(DISTINCT kategorie_tour.t_id) AS CHAR))' +
                    '        AS extended_object_properties' +
                    '    FROM kategorie_tour WHERE kategorie_tour.k_id IN (:id)' +
                    '   UNION ' +
                    /**
                     'SELECT CONCAT("category=ENTITYCOUNT:::name=ADDITIONAL_ROUTE_IDS:::value=",' +
                     '     GROUP_CONCAT(DISTINCT kategorie_tour.t_id ORDER BY CAST(kategorie_tour.t_id AS CHAR) SEPARATOR ", "))' +
                     '         AS extended_object_properties' +
                     '    FROM kategorie_tour WHERE kategorie_tour.k_id IN (:id)' +
                     '   UNION ' +
                     **/
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=IMAGE_COUNT:::value=", CAST(COUNT(DISTINCT image.i_id) AS CHAR)) AS extended_object_properties' +
                    '      FROM image WHERE image.k_id IN (:id)' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=VIDEO_COUNT:::value=", CAST(COUNT(DISTINCT video.v_id) AS CHAR)) AS extended_object_properties' +
                    '       FROM video WHERE video.k_id IN (:id)',
                parameterNames: ['id']
            },
            {
                profile: 'navigation_objects',
                sql: '(SELECT CONCAT("navid=TRACK_", k_id, ":::name=", COALESCE(k_name, "null"), ":::navtype=", "PREDECESSOR")' +
                    '  AS navigation_objects' +
                    '  FROM kategorie WHERE k_datevon < (SELECT k_datevon FROM kategorie WHERE k_id IN (:id))' +
                    '  ORDER BY k_datevon DESC, k_id DESC LIMIT 1) ' +
                    'UNION ' +
                    ' (SELECT CONCAT("navid=TRACK_", k_id, ":::name=", COALESCE(k_name, "null"), ":::navtype=", "SUCCESSOR")' +
                    '  AS navigation_objects' +
                    '  FROM kategorie WHERE k_datevon > (SELECT k_datevon FROM kategorie WHERE k_id IN (:id))' +
                    '   ORDER BY k_datevon, k_id LIMIT 1)',
                parameterNames: ['id'],
                modes: ['details']
            }
        ],
        selectFieldList: [
            '"TRACK" AS type',
            'kategorie.k_type',
            'CONCAT("ac_", kategorie.k_type) AS actiontype',
            'CONCAT("ac_", kategorie.k_type) AS subtype',
            'CONCAT("TRACK", "_", kategorie.k_id) AS id',
//                'kategorie.i_id',
            'kategorie.k_id',
            'kategorie.t_id',
            'kategorie.tr_id',
            'kategorie.l_id',
//                'n_id',
            'k_name',
//                'k_html',
            'CONCAT(k_name, " ", COALESCE(k_meta_shortdesc,""), " ", l_name) AS html',
            'k_gesperrt',
            'k_datevon AS k_dateshow',
            'k_datevon',
            'k_datebis',
            'DATE_FORMAT(k_datevon, GET_FORMAT(DATE, "ISO")) AS dateonly',
            'WEEK(k_datevon) AS week',
            'MONTH(k_datevon) AS month',
            'YEAR(k_datevon) AS year',
            'k_gpstracks_basefile',
            'k_meta_shortdesc',
            'k_meta_shortdesc AS k_meta_shortdesc_md',
            'CAST(l_geo_latdeg AS CHAR(50)) AS k_gps_lat',
            'CAST(l_geo_longdeg AS CHAR(50)) AS k_gps_lon',
            'CONCAT(l_geo_latdeg, ",", l_geo_longdeg) AS k_gps_loc',
            'GetLocationNameAncestry(location.l_id, location.l_name, " -> ") AS l_lochirarchietxt',
            'GetLocationIdAncestry(location.l_id, ",") AS l_lochirarchieids',
//                'CONCAT(image.i_dir, "/", image.i_file) AS i_fav_url_txt',
            'k_altitude_asc',
            'k_altitude_desc',
            'k_altitude_min',
            'k_altitude_max',
            'k_distance',
            'k_rate_ausdauer',
            'k_rate_bildung',
            'k_rate_gesamt',
            'k_rate_kraft',
            'k_rate_mental',
            'k_rate_motive',
            'k_rate_schwierigkeit',
            'k_rate_wichtigkeit',
            'ROUND((k_altitude_asc / 500))*500 AS altAscFacet',
            'ROUND((k_altitude_max / 500))*500 AS altMaxFacet',
            'ROUND((k_distance / 5))*5 AS distFacet',
            'TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 AS dur',
            'ROUND(ROUND(TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 * 2) / 2, 1) AS durFacet'],
        facetConfigs: {
            // dashboard
            'doublettes': {
                selectSql: 'SELECT COUNT(kategorie.k_id) AS count, "doublettes" AS value,' +
                    ' "doublettes" AS label, "true" AS id' +
                    ' FROM kategorie INNER JOIN (SELECT k_id AS id FROM kategorie WHERE k_name IN' +
                    '                (SELECT DISTINCT k_name AS name FROM kategorie GROUP BY name HAVING COUNT(*) > 1)' +
                    '             ) doublettes' +
                    '             ON kategorie.k_id=doublettes.id',
                cache: {
                    useCache: false
                }
            },
            'conflictingRates': {
                selectSql: 'SELECT COUNT(kategorie.k_id) AS count, "conflictingRates" AS value,' +
                    ' "conflictingRates" AS label, "true" AS id' +
                    ' FROM kategorie INNER JOIN (SELECT DISTINCT k_id AS id FROM kategorie' +
                    '      WHERE k_rate_motive > 0' +
                    '       AND k_id NOT IN  (SELECT DISTINCT k_ID FROM image' +
                    '            WHERE i_rate >= k_rate_motive OR i_rate >= 9 OR i_rate = 6 AND kategorie.k_id=image.k_id)' +
                    '       AND EXISTS (SELECT DISTINCT k_ID FROM image WHERE kategorie.k_id=image.k_id AND i_rate > 0)' +
                    '  ) conflictingRates' +
                    '  ON kategorie.k_id=conflictingRates.id',
                cache: {
                    useCache: false
                }
            },
            'noCoordinates': {
                constValues: ['noCoordinates'],
                filterField: '"666dummy999"'
            },
            'noFavoriteChildren': {
                selectSql: 'SELECT COUNT(kategorie.k_id) AS count, "noFavoriteChildren" AS value,' +
                    ' "noFavoriteChildren" AS label, "true" AS id' +
                    ' FROM kategorie INNER JOIN' +
                    '      (SELECT DISTINCT k_id AS id FROM kategorie' +
                    '       WHERE k_id IN (SELECT DISTINCT k_ID FROM image WHERE i_rate = 0 OR i_rate IS NULL)' +
                    '       AND k_id NOT IN (SELECT DISTINCT k_ID FROM image WHERE i_rate <> 0 AND i_rate IS NOT NULL)' +
                    '      ) noFavoriteChildren' +
                    '  ON kategorie.k_id=noFavoriteChildren.id',
                cache: {
                    useCache: false
                }
            },
            'noLocation': {
                selectSql: 'SELECT COUNT(kategorie.k_id) AS count, "noLocation" AS value,' +
                    ' "noLocation" AS label, "true" AS id' +
                    ' FROM kategorie WHERE l_id IS NULL OR l_id IN (0,1 )',
                filterField: 'kategorie.l_id',
                action: AdapterFilterActions.IN
            },
            'noMainFavoriteChildren': {
                selectSql: 'SELECT COUNT(kategorie.k_id) AS count, "noMainFavoriteChildren" AS value,' +
                    ' "noMainFavoriteChildren" AS label, "true" AS id' +
                    ' FROM kategorie INNER JOIN (SELECT DISTINCT k_id AS id FROM kategorie WHERE k_id NOT IN ' +
                    '     (SELECT DISTINCT k_ID FROM image INNER JOIN image_playlist ON image.i_id=image_playlist.I_ID WHERE p_id IN ' +
                    '          (SELECT DISTINCT p_id FROM playlist WHERE p_name like "%kategorie_favorites%"))' +
                    '      AND k_id IN (SELECT DISTINCT k_ID FROM image WHERE i_rate = 0 OR i_rate IS NULL)) noMainFavoriteChildren' +
                    ' ON kategorie.k_id=noMainFavoriteChildren.id',
                cache: {
                    useCache: false
                }
            },
            'noRoute': {
                selectSql: 'SELECT COUNT(kategorie.k_id) AS count, "noRoute" AS value,' +
                    ' "noRoute" AS label, "true" AS id' +
                    ' FROM kategorie WHERE t_id IS NULL OR t_id IN (0,1 )',
                filterField: 'kategorie.t_id',
                action: AdapterFilterActions.IN
            },
            'noSubType': {
                selectSql: 'SELECT COUNT(kategorie.k_id) AS count, "noSubType" AS value,' +
                    ' "noSubType" AS label, "true" AS id' +
                    ' FROM kategorie WHERE k_type IS NULL OR k_type in (0)',
                filterField: 'CONCAT("ac_", kategorie.k_type)',
                action: AdapterFilterActions.IN
            },
            'todoDesc': {
                selectSql: 'SELECT COUNT(kategorie.k_id) AS count, "todoDesc" AS value,' +
                    ' "todoDesc" AS label, "true" AS id' +
                    ' FROM kategorie WHERE k_meta_shortdesc LIKE "TODODESC%"',
                filterField: 'kategorie.k_meta_shortdesc',
                action: AdapterFilterActions.LIKE
            },
            'todoKeywords': {
                selectSql: 'SELECT COUNT(kategorie.k_id) AS count, "todoKeywords" AS value,' +
                    ' "todoKeywords" AS label, "true" AS id' +
                    ' FROM kategorie INNER JOIN kategorie_keyword ON kategorie.k_id=kategorie_keyword.k_id' +
                    ' INNER JOIN keyword ON kategorie_keyword.kw_id=keyword.kw_id ' +
                    'WHERE keyword.kw_name IN ("KW_TODOKEYWORDS")',
                filterField: 'keyword.kw_name',
                action: AdapterFilterActions.IN
            },
            'unrated': {
                selectSql: 'SELECT COUNT(kategorie.k_id) AS count, "unrated" AS value,' +
                    ' "unrated" AS label, "true" AS id' +
                    ' FROM kategorie WHERE k_rate_gesamt IS NULL OR k_rate_gesamt in (0)',
                filterField: 'kategorie.k_rate_gesamt',
                action: AdapterFilterActions.IN
            },
            'unRatedChildren': {
                selectSql: 'SELECT COUNT(kategorie.k_id) AS count, "unRatedChildren" AS value,' +
                    ' "unRatedChildren" AS label, "true" AS id' +
                    ' FROM kategorie INNER JOIN (SELECT DISTINCT k_id AS id FROM kategorie WHERE k_id IN' +
                    '      (SELECT DISTINCT k_ID FROM image WHERE i_rate = 0 OR i_rate IS NULL)) unRatedChildren' +
                    '   ON kategorie.k_id=unRatedChildren.id',
                cache: {
                    useCache: false
                }
            },
            // common
            'id_notin_is': {
                filterField: 'CONCAT("TRACK", "_", kategorie.k_id)',
                action: AdapterFilterActions.NOTIN
            },
            'actiontype_ss': {
                selectField: 'CONCAT("ac_", kategorie.k_type)'
            },
            'blocked_is': {
                selectField: 'k_gesperrt'
            },
            'data_tech_alt_asc_facet_is': {
                selectField: 'ROUND((k_altitude_asc / 500))*500',
                orderBy: 'value ASC'
            },
            'data_tech_alt_max_facet_is': {
                selectField: 'ROUND((k_altitude_max / 500))*500',
                orderBy: 'value asc'
            },
            'data_tech_dist_facets_fs': {
                selectField: 'ROUND((k_distance / 5))*5',
                orderBy: 'value asc'
            },
            'data_tech_dur_facet_fs': {
                selectField: 'ROUND(ROUND(TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 * 2) / 2, 1)',
                orderBy: 'value asc'
            },
            'done_ss': {
                selectField: 'CONCAT("DONE", (k_datevon IS NOT NULL))',
                orderBy: 'value asc'
            },
            'keywords_txt': {
                selectSql: 'SELECT 0 AS count, ' +
                    '  kw_name AS value ' +
                    'FROM' +
                    ' keyword' +
                    ' WHERE kw_name like "KW_%"' +
                    ' GROUP BY count, value' +
                    ' ORDER BY value',
                filterField: 'kw_name',
                action: AdapterFilterActions.LIKEIN
            },
            'loc_id_i': {
                noFacet: true
            },
            'loc_lochirarchie_txt': {
                selectSql: 'SELECT COUNT(kategorie.l_id) AS count, GetTechName(l_name) AS value,' +
                    ' GetLocationNameAncestry(location.l_id, location.l_name, " -> ") AS label, location.l_id AS id' +
                    ' FROM location LEFT JOIN kategorie ON kategorie.l_id = location.l_id ' +
                    ' GROUP BY value, label, id' +
                    ' ORDER BY label',
                filterField: 'GetTechName(GetLocationNameAncestry(location.l_id, location.l_name, " -> "))',
                action: AdapterFilterActions.LIKE
            },
            'month_is': {
                selectField: 'MONTH(k_datevon)',
                orderBy: 'value asc'
            },
            'news_id_i': {
                filterFields: ['news.n_id'],
                action: AdapterFilterActions.IN_NUMBER
            },
            'news_id_is': {
                filterFields: ['news.n_id'],
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
                noFacet: true
            },
            'rate_pers_gesamt_is': {
                selectField: 'k_rate_gesamt',
                orderBy: 'value asc'
            },
            'rate_pers_schwierigkeit_is': {
                selectField: 'k_rate_schwierigkeit',
                orderBy: 'value asc'
            },
            'rate_tech_overall_ss': {
                noFacet: true
            },
            'subtype_ss': {
                selectField: 'CONCAT("ac_", kategorie.k_type)'
            },
            'route_id_i': {
                filterFields: ['kt.t_id'],
                action: AdapterFilterActions.IN_NUMBER
            },
            'route_id_is': {
                selectSql: 'SELECT COUNT(kategorie.t_id) AS count, tour.t_id AS value,' +
                    ' tour.t_name AS label, tour.t_id AS id' +
                    ' FROM tour LEFT JOIN kategorie ON kategorie.t_id = tour.t_id ' +
                    ' GROUP BY value, label, id' +
                    ' ORDER BY label',
                filterFields: ['kt.t_id'],
                action: AdapterFilterActions.IN_NUMBER
            },
            'trip_id_is': {
                selectSql: 'SELECT COUNT(kategorie.tr_id) AS count, trip.tr_id AS value,' +
                    ' trip.tr_name AS label, trip.tr_id AS id' +
                    ' FROM trip LEFT JOIN kategorie ON kategorie.tr_id = trip.tr_id ' +
                    ' GROUP BY value, label, id' +
                    ' ORDER BY label',
                filterField: 'tr_id',
                action: AdapterFilterActions.IN_NUMBER
            },
            'type_txt': {
                constValues: ['track', 'route', 'image', 'odimgobject', 'video', 'location', 'trip', 'news', 'destination', 'info'],
                filterField: '"track"',
                selectLimit: 1
            },
            'week_is': {
                selectField: 'WEEK(k_datevon)',
                orderBy: 'value asc'
            },
            'year_is': {
                selectField: 'YEAR(k_datevon)',
                orderBy: 'value asc'
            }
        },
        sortMapping: {
            'countImages': '(SELECT COUNT(DISTINCT i_sort.i_id) FROM image i_sort WHERE i_sort.k_id = kategorie.k_id) ASC',
            'countImagesDesc': '(SELECT COUNT(DISTINCT i_sort.i_id) FROM image i_sort WHERE i_sort.k_id = kategorie.k_id) DESC',
            'countRoutes': '(SELECT COUNT(DISTINCT t_sort.t_id) FROM kategorie k_sort' +
                '      LEFT JOIN kategorie_tour kt_sort ON kt_sort.k_id = k_sort.k_id' +
                '      INNER JOIN tour t_sort ON t_sort.t_id = k_sort.t_id OR t_sort.t_id = kt_sort.t_id' +
                '      WHERE k_sort.k_id = kategorie.k_id) ASC',
            'countRoutesDesc': '(SELECT COUNT(DISTINCT t_sort.t_id) FROM kategorie k_sort' +
                '      LEFT JOIN kategorie_tour kt_sort ON kt_sort.k_id = k_sort.k_id' +
                '      INNER JOIN tour t_sort ON t_sort.t_id = k_sort.t_id OR t_sort.t_id = kt_sort.t_id' +
                '      WHERE k_sort.k_id = kategorie.k_id) DESC',
            'countVideos': '(SELECT COUNT(DISTINCT v_sort.v_id) FROM video v_sort WHERE v_sort.k_id = kategorie.k_id) ASC',
            'countVideosDesc': '(SELECT COUNT(DISTINCT v_sort.v_id) FROM video v_sort WHERE v_sort.k_id = kategorie.k_id) DESC',
            'date': 'k_datevon DESC',
            'dateAsc': 'k_datevon ASC',
            'distance': 'geodist ASC',
            'dataTechDurDesc': 'TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevON))/3600 DESC',
            'dataTechAltDesc': 'k_altitude_asc DESC',
            'dataTechMaxDesc': 'k_altitude_max DESC',
            'dataTechDistDesc': 'k_distance DESC',
            'dataTechDurAsc': 'TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 ASC',
            'dataTechAltAsc': 'k_altitude_asc ASC',
            'dataTechMaxAsc': 'k_altitude_max ASC',
            'dataTechDistAsc': 'k_distance ASC',
            'forExport': 'k_datevon ASC',
            'ratePers': 'k_rate_gesamt DESC, k_datevon DESC',
            'location': 'l_lochirarchietxt ASC',
            'relevance': 'k_datevon DESC'
        },
        filterMapping: {
            // dashboard
            doublettes: '"doublettes"',
            conflictingRates: '"conflictingRates"',
            noFavoriteChildren: '"noFavoriteChildren"',
            noMainFavoriteChildren: '"noMainFavoriteChildren"',
            noCoordinates: '"666dummy999"',
            noLocation: 'kategorie.l_id',
            noRoute: 'kategorie.t_id',
            noSubType: 'CONCAT("ac_", kategorie.k_type)',
            todoDesc: '"todoDesc"',
            todoKeywords: 'keyword.kw_name',
            unrated: 'kategorie.k_rate_gesamt',
            unRatedChildren: '"unRatedChildren"',
            // common
            id: 'kategorie.k_id',
            destination_id_s: 'dt.d_id',
            destination_id_ss: 'dt.d_id',
            image_id_is: '"666dummy999"',
            image_id_i: '"666dummy999"',
            info_id_i: '"666dummy999"',
            info_id_is: '"666dummy999"',
            loc_id_i: 'kategorie.l_id',
            loc_id_is: 'kategorie.l_id',
            route_id_i: 'kategorie.t_id',
            route_id_is: 'kategorie.t_id',
            track_id_i: 'kategorie.k_id',
            track_id_is: 'kategorie.k_id',
            video_id_is: '"666dummy999"',
            video_id_i: '"666dummy999"',
            loc_lochirarchie_ids_txt: 'location.l_id',
            l_lochirarchietxt: 'location.l_name',
            html: 'CONCAT(k_name, " ", COALESCE(k_meta_shortdesc,""), " ", l_name)'
        },
        spartialConfig: {
            lat: 'l_geo_latdeg',
            lon: 'l_geo_longdeg',
            spatialField: 'geodist',
            spatialSortKey: 'distance'
        },
        writeMapping: {
            'kategorie.t_id': ':route_id_i:',
            // 'kategorie.i_id': ':image_id_i:',
            'kategorie.l_id': ':loc_id_i:',
            'kategorie.tr_id': ':trip_id_i:',
            // 'kategorie.n_id': ':news_id_i:',
            'kategorie.k_gesperrt': ':blocked_i:',
            'kategorie.k_datevon': ':datestart_dt:',
            'kategorie.k_datebis': ':dateend_dt:',
            'kategorie.k_meta_shortdesc': ':desc_txt:',
            // 'kategorie.k_meta_shortdesc_md': ':desc_md_txt:',
            // 'kategorie.k_meta_shortdesc_html': ':desc_html_txt:',
            'kategorie.k_altitude_asc': ':data_tech_alt_asc_i:',
            'kategorie.k_altitude_desc': ':data_tech_alt_desc_i:',
            'kategorie.k_altitude_min': ':data_tech_alt_min_i:',
            'kategorie.k_altitude_max': ':data_tech_alt_max_i:',
            'kategorie.k_distance': ':data_tech_dist_f:',
            'kategorie.k_rate_ausdauer': ':rate_pers_ausdauer_i:',
            'kategorie.k_rate_bildung': ':rate_pers_bildung_i:',
            'kategorie.k_rate_gesamt': ':rate_pers_gesamt_i:',
            'kategorie.k_rate_kraft': ':rate_pers_kraft_i:',
            'kategorie.k_rate_mental': ':rate_pers_mental_i:',
            'kategorie.k_rate_motive': ':rate_pers_motive_i:',
            'kategorie.k_rate_schwierigkeit': ':rate_pers_schwierigkeit_i:',
            'kategorie.k_rate_wichtigkeit': ':rate_pers_wichtigkeit_i:',
            'kategorie.k_gpstracks_basefile': ':gpstracks_basefile_s:',
            'kategorie.k_gpstracks_gpx_source': ':gpstrack_src_s:',
            'kategorie.k_name': ':name_s:',
            'kategorie.k_type': ':subtype_s:'
        },
        fieldMapping: {
            id: 'id',
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
            blocked_i: 'k_gesperrt',
            dateshow_dt: 'k_dateshow',
            datestart_dt: 'k_datevon',
            dateend_dt: 'k_datebis',
            desc_txt: 'k_meta_shortdesc',
            desc_md_txt: 'k_meta_shortdesc_md',
            desc_html_txt: 'k_meta_shortdesc_html',
            distance: 'geodist',
            geo_lon_s: 'k_gps_lon',
            geo_lat_s: 'k_gps_lat',
            geo_loc_p: 'k_gps_loc',
            data_tech_alt_asc_i: 'k_altitude_asc',
            data_tech_alt_desc_i: 'k_altitude_desc',
            data_tech_alt_min_i: 'k_altitude_min',
            data_tech_alt_max_i: 'k_altitude_max',
            data_tech_dist_f: 'k_distance',
            data_tech_dur_f: 'dur',
            rate_pers_ausdauer_i: 'k_rate_ausdauer',
            rate_pers_bildung_i: 'k_rate_bildung',
            rate_pers_gesamt_i: 'k_rate_gesamt',
            rate_pers_kraft_i: 'k_rate_kraft',
            rate_pers_mental_i: 'k_rate_mental',
            rate_pers_motive_i: 'k_rate_motive',
            rate_pers_schwierigkeit_i: 'k_rate_schwierigkeit',
            rate_pers_wichtigkeit_i: 'k_rate_wichtigkeit',
            gpstracks_basefile_s: 'k_gpstracks_basefile',
            gpstrack_src_s: 'k_gpstracks_gpx_source',
            keywords_txt: 'k_keywords',
            loc_lochirarchie_s: 'l_lochirarchietxt',
            loc_lochirarchie_ids_s: 'l_lochirarchieids',
            name_s: 'k_name',
            type_s: 'type',
            actiontype_s: 'actionType',
            subtype_s: 'subtype',
            i_fav_url_txt: 'i_fav_url_txt'
        }
    };

    public static readonly keywordModelConfigType: KeywordModelConfigJoinType = {
        table: 'kategorie', joinTable: 'kategorie_keyword', fieldReference: 'k_id'
    };

    public static readonly joinModelConfigTypeLinkedRoutes: JoinModelConfigTableType = {
        baseTableIdField: 'k_id',
        joinTable: 'kategorie_tour',
        joinFieldMappings: {
            't_id': 'refId',
            'kt_full': 'full'
        }
    };

    public static readonly actionTagAssignConfig: ActionTagAssignTableConfigType = {
        table: 'kategorie',
        idField: 'k_id',
        references: {
            'route_id_is': {
                table: 'tour', idField: 't_id', referenceField: 't_id'
            },
            'trip_id_is': {
                table: 'trip', idField: 'tr_id', referenceField: 'tr_id'
            },
            'loc_lochirarchie_txt': {
                table: 'location', idField: 'l_id', referenceField: 'l_id'
            }
        }
    };

    public static readonly actionTagBlockConfig: ActionTagBlockTableConfigType = {
        table: 'kategorie', idField: 'k_id', blockField: 'k_gesperrt'};

    public static readonly actionTagReplaceConfig: ActionTagReplaceTableConfigType = {
        table: 'kategorie',
        fieldId: 'k_id',
        referenced: [
            { table: 'image', fieldReference: 'k_id' },
            { table: 'tour', fieldReference: 'k_id' },
            { table: 'video', fieldReference: 'k_id' },
        ],
        joins: [
            { table: 'kategorie_keyword', fieldReference: 'k_id' },
            { table: 'kategorie_person', fieldReference: 'k_id' },
            { table: 'kategorie_tour', fieldReference: 'k_id' }
        ]
    };
}

