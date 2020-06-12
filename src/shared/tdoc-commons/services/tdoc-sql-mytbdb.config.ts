import {TableConfig, TableConfigs} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {AdapterFilterActions} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';
import {TourDocSqlUtils} from './tdoc-sql.utils';
import {ActionTagReplaceConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-replace.adapter';
import {ActionTagBlockConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-block.adapter';
import {ActionTagAssignConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-assign.adapter';
import {KeywordModelConfigType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-keyword.adapter';
import {PlaylistModelConfigType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-playlist.adapter';
import {RateModelConfigType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-rate.adapter';
import {ObjectDetectionModelConfigType} from '@dps/mycms-commons/dist/commons/model/common-sql-object-detection.model';

export class TourDocSqlMytbDbConfig {
    public static readonly personCategories = ['Person', 'person', 'Familie', 'family', 'friend', 'Freund'];
    public static readonly detectionOkStates = ['RUNNING_MANUAL_APPROVED', 'RUNNING_MANUAL_CORRECTED', 'RUNNING_MANUAL_DETAILED',
        'DONE_APPROVAL_PROCESSED', 'DONE_CORRECTION_PROCESSED', 'DONE_DETAIL_PROCESSED'];
    public static readonly tableConfigs: TableConfigs = {
        'track': {
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
                        'LEFT JOIN tour kt ON kategorie_tour.t_id=kt.t_id ',
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
                    from: 'INNER JOIN (SELECT DISTINCT k_id AS id FROM kategorie WHERE' +
                        '   k_rate_motive > 0 AND k_id NOT IN ' +
                        '       (SELECT DISTINCT k_ID FROM image WHERE (i_rate >= k_rate_motive OR i_rate >= 9 OR i_rate = 6))) conflictingRates' +
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
                    profile: 'keywords',
                    sql: 'select GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS keywords ' +
                        'FROM kategorie INNER JOIN kategorie_keyword ON kategorie.k_id=kategorie_keyword.k_id' +
                        ' INNER JOIN keyword on kategorie_keyword.kw_id=keyword.kw_id ' +
                        'WHERE kategorie.k_id IN (:id)',
                    parameterNames: ['id'],
                    modes: ['full']
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
                'k_meta_shortdesc AS k_meta_shortdesc_html',
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
                        ' FROM kategorie INNER JOIN (SELECT DISTINCT k_id AS id FROM kategorie WHERE' +
                        '   k_rate_motive > 0 AND k_id NOT IN ' +
                        '       (SELECT DISTINCT k_ID FROM image WHERE (i_rate >= k_rate_motive OR i_rate >= 6))) conflictingRates' +
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
                        ' FROM kategorie WHERE k_type IS NULL or k_type in (0)',
                    filterField: 'CONCAT("ac_", kategorie.k_type)',
                    action: AdapterFilterActions.IN
                },
                'todoDesc': {
                    selectSql: 'SELECT COUNT(kategorie.k_id) AS count, "todoDesc" AS value,' +
                        ' "todoDesc" AS label, "true" AS id' +
                        ' FROM kategorie WHERE k_meta_shortdesc LIKE "TODODESC"',
                    filterField: 'kategorie.k_meta_shortdesc',
                    action: AdapterFilterActions.LIKE
                },
                'todoKeywords': {
                    selectSql: 'SELECT COUNT(kategorie.k_id) AS count, "todoKeywords" AS value,' +
                        ' "todoKeywords" AS label, "true" AS id' +
                        ' FROM kategorie INNER JOIN kategorie_keyword ON kategorie.k_id=kategorie_keyword.k_id' +
                        ' INNER JOIN keyword on kategorie_keyword.kw_id=keyword.kw_id ' +
                        'WHERE keyword.kw_name IN ("KW_TODOKEYWORDS")',
                    filterField: 'keyword.kw_name',
                    action: AdapterFilterActions.IN
                },
                'unrated': {
                    selectSql: 'SELECT COUNT(kategorie.k_id) AS count, "unrated" AS value,' +
                        ' "unrated" AS label, "true" AS id' +
                        ' FROM kategorie WHERE k_rate_gesamt IS NULL or k_rate_gesamt in (0)',
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
                    filterFields: ['kategorie.t_id', 'kt.t_id'],
                    action: AdapterFilterActions.IN_NUMBER
                },
                'route_id_is': {
                    selectSql: 'SELECT COUNT(kategorie.t_id) AS count, tour.t_id AS value,' +
                        ' tour.t_name AS label, tour.t_id AS id' +
                        ' FROM tour LEFT JOIN kategorie ON kategorie.t_id = tour.t_id ' +
                        ' GROUP BY value, label, id' +
                        ' ORDER BY label',
                    filterFields: ['kategorie.t_id', 'kt.t_id'],
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
                    constValues: ['track', 'route', 'image', 'odimgobject', 'video', 'location', 'trip', 'news', 'destination'],
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
        },
        'image': {
            key: 'image',
            tableName: 'image',
            selectFrom: 'image LEFT JOIN kategorie ON kategorie.k_id=image.k_id ' +
                'LEFT JOIN location ON location.l_id = kategorie.l_id ',
            optionalGroupBy: [
                {
                    from: 'LEFT JOIN image_keyword ON image.i_id=image_keyword.i_id ' +
                        'LEFT JOIN keyword ON image_keyword.kw_id=keyword.kw_id',
                    triggerParams: ['id', 'keywords_txt', 'todoKeywords'],
                    groupByFields: ['GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS i_keywords']
                },
                {
                    from: 'LEFT JOIN tour kt2 ON kategorie.t_id=kt2.t_id ' +
                        'LEFT JOIN destination dt ON dt.d_id in (MD5(CONCAT(kt2.l_id, "_", kt2.t_desc_gebiet, "_", kt2.t_desc_ziel, "_", kt2.t_typ)))',
                    triggerParams: ['destination_id_s', 'destination_id_ss'],
                    groupByFields: []
                },
                {
                    from: 'LEFT JOIN image_playlist ON image.i_id=image_playlist.i_id ' +
                        'LEFT JOIN playlist ON image_playlist.p_id=playlist.p_id',
                    triggerParams: ['playlists_txt'],
                    groupByFields: ['GROUP_CONCAT(DISTINCT playlist.p_name ORDER BY playlist.p_name SEPARATOR ", ") AS i_playlists']
                },
                {
                    from: 'LEFT JOIN image_object ON image.i_id=image_object.i_id ' +
                        'LEFT JOIN objects ON image_object.io_obj_type=objects.o_key',
                    triggerParams: ['id', 'odstates_ss', 'odprecision_is', 'odcats_txt', 'odkeys_txt', 'oddetectors_txt'],
                    groupByFields: ['GROUP_CONCAT(DISTINCT objects.o_name ORDER BY objects.o_name SEPARATOR ", ") AS i_allobjects']
                },
                {
                    from: 'LEFT JOIN image_object image_object_persons ON image.i_id=image_object_persons.i_id ' +
                        'LEFT JOIN objects persons ON image_object_persons.io_obj_type=persons.o_key' +
                        ' AND LOWER(persons.o_category) LIKE "person"' +
                        ' AND (image_object_persons.io_precision = 1' +
                        '      OR image_object_persons.io_state in ("' + TourDocSqlMytbDbConfig.detectionOkStates.join('", "') + '"))',
                    triggerParams: ['persons_txt'],
                    groupByFields: ['GROUP_CONCAT(DISTINCT persons.o_name ORDER BY persons.o_name SEPARATOR ", ") AS i_persons']
                },
                {
                    from: 'LEFT JOIN image_object image_object_objects ON image.i_id=image_object_objects.i_id ' +
                        'LEFT JOIN objects realobjects ON image_object_objects.io_obj_type=realobjects.o_key' +
                        ' AND LOWER(realobjects.o_category) NOT LIKE "person"' +
                        ' AND (image_object_objects.io_precision = 1' +
                        '      OR image_object_objects.io_state in ("' + TourDocSqlMytbDbConfig.detectionOkStates.join('", "') + '"))',
                    triggerParams: ['objects_txt'],
                    groupByFields: ['GROUP_CONCAT(DISTINCT realobjects.o_name ORDER BY realobjects.o_name SEPARATOR ", ") AS i_objects']
                },
                {
                    from: 'LEFT JOIN news ON kategorie.k_datevon >= news.n_datevon AND kategorie.k_datevon <= news.n_datebis',
                    triggerParams: ['news_id_i', 'news_id_is'],
                    groupByFields: ['news.n_id']
                },
                {
                    from: 'INNER JOIN (SELECT i_id AS id FROM image INNER JOIN' +
                        '                (SELECT DISTINCT i_dir, i_file FROM image GROUP BY i_dir, i_file' +
                        '                 HAVING COUNT(*) > 1) doublettes' +
                        '                ON image.i_file = doublettes.i_file AND image.i_dir = doublettes.i_dir) doublettes2' +
                        '             ON image.i_id = doublettes2.id',
                    triggerParams: ['doublettes'],
                    groupByFields: []
                }
            ],
            loadDetailData: [
                {
                    profile: 'image_playlist',
                    sql: 'SELECT GROUP_CONCAT(DISTINCT playlist.p_name ORDER BY playlist.p_name SEPARATOR ", ") AS i_playlists ' +
                        'FROM image INNER JOIN image_playlist ON image.i_id=image_playlist.i_id' +
                        ' INNER JOIN playlist on image_playlist.p_id=playlist.p_id ' +
                        'WHERE image.i_id IN (:id)',
                    parameterNames: ['id']
                },
                {
                    profile: 'image_persons',
                    sql: 'SELECT GROUP_CONCAT(DISTINCT objects.o_name ORDER BY objects.o_name SEPARATOR ", ") AS i_persons ' +
                        'FROM image INNER JOIN image_object ON image.i_id=image_object.i_id' +
                        ' INNER JOIN objects_key ON image_object.io_obj_type=objects_key.ok_key' +
                        ' AND image_object.io_detector=objects_key.ok_detector ' +
                        ' INNER JOIN objects ON objects_key.o_id=objects.o_id ' +
                        ' AND LOWER(o_category) LIKE "person"' +
                        ' AND (image_object.io_precision = 1' +
                        '      OR image_object.io_state in ("' + TourDocSqlMytbDbConfig.detectionOkStates.join('", "') + '"))' +
                        'WHERE image.i_id IN (:id)',
                    parameterNames: ['id']
                },
                {
                    profile: 'image_objects',
                    sql: 'SELECT GROUP_CONCAT(DISTINCT objects.o_name ORDER BY objects.o_name SEPARATOR ", ") AS i_objects ' +
                        'FROM image INNER JOIN image_object ON image.i_id=image_object.i_id' +
                        ' INNER JOIN objects_key ON image_object.io_obj_type=objects_key.ok_key' +
                        ' AND image_object.io_detector=objects_key.ok_detector ' +
                        ' INNER JOIN objects ON objects_key.o_id=objects.o_id ' +
                        ' AND LOWER(o_category) NOT LIKE "person"' +
                        ' AND (image_object.io_precision = 1' +
                        '      OR image_object.io_state in ("' + TourDocSqlMytbDbConfig.detectionOkStates.join('", "') + '"))' +
                        'WHERE image.i_id IN (:id)',
                    parameterNames: ['id']
                },
                {
                    profile: 'image_objectdetections',
                    sql: 'SELECT GROUP_CONCAT(DISTINCT CONCAT("ioId=", image_object.io_id, ":::key=", image_object.io_obj_type,' +
                        ' ":::detector=", image_object.io_detector,' +
                        ' ":::imgWidth=", image_object.io_img_width,' +
                        ' ":::imgHeight=", image_object.io_img_height,' +
                        ' ":::objX=", image_object.io_obj_x1,' +
                        ' ":::objY=", image_object.io_obj_y1,' +
                        ' ":::objWidth=", image_object.io_obj_width,' +
                        ' ":::objHeight=", image_object.io_obj_height,' +
                        ' ":::name=", objects.o_name,' +
                        ' ":::category=", objects.o_category,' +
                        ' ":::precision=", image_object.io_precision,' +
                        ' ":::state=", image_object.io_state) SEPARATOR ";;") as i_objectdetections ' +
                        'FROM image INNER JOIN image_object ON image.i_id=image_object.i_id' +
                        ' INNER JOIN objects_key ON image_object.io_obj_type=objects_key.ok_key' +
                        '            AND image_object.io_detector=objects_key.ok_detector ' +
                        ' INNER JOIN objects ON objects_key.o_id=objects.o_id ' +
                        'WHERE image.i_id IN (:id)',
                    parameterNames: ['id']
                },
                {
                    profile: 'keywords',
                    sql: 'select GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS keywords ' +
                        'FROM image INNER JOIN image_keyword ON image.i_id=image_keyword.i_id' +
                        ' INNER JOIN keyword on image_keyword.kw_id=keyword.kw_id ' +
                        'WHERE image.i_id IN (:id)',
                    parameterNames: ['id'],
                    modes: ['full']
                },
                {
                    profile: 'navigation_objects',
                    sql: '(SELECT CONCAT("navid=IMAGE_", i_id, ":::name=", COALESCE(i_meta_name, "null"), ":::navtype=", "PREDECESSOR")' +
                        '  AS navigation_objects' +
                        '  FROM image WHERE i_date < (SELECT i_date FROM image WHERE i_id IN (:id))' +
                        '   ORDER BY i_date DESC, i_id DESC LIMIT 1) ' +
                        'UNION ' +
                        ' (SELECT CONCAT("navid=IMAGE_", i_id, ":::name=", COALESCE(i_meta_name, "null"), ":::navtype=", "SUCCESSOR")' +
                        '  AS navigation_objects' +
                        '  FROM image WHERE i_date > (SELECT i_date FROM image WHERE i_id IN (:id))' +
                        '   ORDER BY i_date, i_id LIMIT 1)',
                    parameterNames: ['id'],
                    modes: ['details']
                }
            ],
            groupbBySelectFieldListIgnore: ['i_keywords', 'i_playlists', 'i_persons', 'i_objects', 'i_objectdetections'],
            selectFieldList: [
                '"IMAGE" AS type',
                'k_type',
                'CONCAT("ac_", kategorie.k_type) AS actiontype',
                'CONCAT("ac_", kategorie.k_type) AS subtype',
                'CONCAT("IMAGE", "_", image.i_id) AS id',
                // 'n_id',
                'image.i_id',
                'image.k_id',
                'kategorie.t_id',
                'kategorie.tr_id',
                'kategorie.l_id',
                'COALESCE(i_meta_name,k_name) AS i_meta_name',
                'CONCAT(COALESCE(i_meta_name,""), " ", l_name) AS html',
                'i_gesperrt',
                'i_date',
                'DATE_FORMAT(i_date, GET_FORMAT(DATE, "ISO")) AS dateonly',
                'WEEK(i_date) AS week',
                'MONTH(i_date) AS month',
                'YEAR(i_date) AS year',
                'k_gpstracks_basefile',
                'i_meta_shortdesc',
                'i_meta_shortdesc AS i_meta_shortdesc_md',
                'i_meta_shortdesc AS i_meta_shortdesc_html',
                'CAST(i_gps_lat AS CHAR(50)) AS i_gps_lat',
                'CAST(i_gps_lon AS CHAR(50)) AS i_gps_lon',
                'CONCAT(i_gps_lat, ",", i_gps_lon) AS i_gps_loc',
                'CONCAT("T", location.l_typ, "L", location.l_parent_id, " -> ", location.l_name) AS l_lochirarchietxt',
                'CONCAT(CAST(location.l_parent_id AS CHAR(50)), ",", CAST(location.l_id AS CHAR(50))) AS l_lochirarchieids',
                'CONCAT(image.i_dir, "/", image.i_file) AS i_fav_url_txt',
                'k_altitude_asc',
                'k_altitude_desc',
                'i_gps_ele',
                'i_gps_ele',
                'k_distance',
                'k_rate_ausdauer',
                'k_rate_bildung',
                'i_rate',
                'k_rate_kraft',
                'k_rate_mental',
                'i_rate_motive',
                'k_rate_schwierigkeit',
                'i_rate_wichtigkeit',
                'ROUND((k_altitude_asc / 500))*500 AS altAscFacet',
                'ROUND((i_gps_ele / 500))*500 AS altMaxFacet',
                'ROUND((k_distance / 5))*5 AS distFacet',
                'TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 AS dur',
                'ROUND(ROUND(TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 * 2) / 2, 1) AS durFacet'],
            facetConfigs: {
                // dashboard
                'doublettes': {
                    selectSql: 'SELECT COUNT(image.i_id) AS count, "doublettes" AS value,' +
                        ' "doublettes" AS label, "true" AS id' +
                        ' FROM image INNER JOIN (SELECT i_id AS id FROM image INNER JOIN' +
                        '                (SELECT DISTINCT i_dir, i_file FROM image GROUP BY i_dir, i_file' +
                        '                 HAVING COUNT(*) > 1) doublettes' +
                        '                ON image.i_file = doublettes.i_file AND image.i_dir = doublettes.i_dir) doublettes2' +
                        '             ON image.i_id = doublettes2.id',
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
                    selectSql: 'SELECT COUNT(image.i_id) AS count, "noLocation" AS value,' +
                        ' "noLocation" AS label, "true" AS id' +
                        ' FROM image WHERE l_id IS NULL OR l_id IN (0,1 )',
                    filterField: 'image.l_id',
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
                    selectSql: 'SELECT COUNT(image.k_id) AS count, "todoDesc" AS value,' +
                        ' "todoDesc" AS label, "true" AS id' +
                        ' FROM image WHERE i_meta_shortdesc LIKE "TODODESC"',
                    filterField: 'image.i_meta_shortdesc',
                    action: AdapterFilterActions.IN
                },
                'todoKeywords': {
                    selectSql: 'SELECT COUNT(image.i_id) AS count, "todoKeywords" AS value,' +
                        ' "todoKeywords" AS label, "true" AS id' +
                        ' FROM image INNER JOIN image_keyword ON image.i_id=image_keyword.i_id' +
                        ' INNER JOIN keyword on image_keyword.kw_id=keyword.kw_id ' +
                        'WHERE keyword.kw_name IN ("KW_TODOKEYWORDS")',
                    filterField: 'keyword.kw_name',
                    action: AdapterFilterActions.IN
                },
                'unrated': {
                    selectSql: 'SELECT COUNT(image.i_id) AS count, "unrated" AS value,' +
                        ' "unrated" AS label, "true" AS id' +
                        ' FROM image WHERE i_rate IS NULL or i_rate in (0)',
                    filterField: 'image.i_rate',
                    action: AdapterFilterActions.IN
                },
                'unRatedChildren': {
                    constValues: ['unRatedChildren'],
                    filterField: '"666dummy999"'
                },
                // common
                'id_notin_is': {
                    filterField: 'CONCAT("IMAGE", "_", image.i_id)',
                    action: AdapterFilterActions.NOTIN
                },
                'actiontype_ss': {
                    selectField: 'CONCAT("ac_", kategorie.k_type)',
                    selectFrom: 'image INNER JOIN kategorie ON kategorie.k_id=image.k_id'
                },
                'blocked_is': {
                    selectField: 'i_gesperrt'
                },
                'data_tech_alt_asc_facet_is': {
                    selectField: 'ROUND((k_altitude_asc / 500))*500',
                    selectFrom: 'image INNER JOIN kategorie ON kategorie.k_id=image.k_id',
                    orderBy: 'value asc'
                },
                'data_tech_alt_max_facet_is': {
                    selectField: 'ROUND((i_gps_ele / 500))*500',
                    orderBy: 'value asc'
                },
                'data_tech_dist_facets_fs': {
                    selectField: 'ROUND((k_distance / 5))*5',
                    selectFrom: 'image INNER JOIN kategorie ON kategorie.k_id=image.k_id',
                    orderBy: 'value asc'
                },
                'data_tech_dur_facet_fs': {
                    selectField: 'ROUND(ROUND(TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 * 2) / 2, 1)',
                    selectFrom: 'image INNER JOIN kategorie ON kategorie.k_id=image.k_id',
                    orderBy: 'value asc'
                },
                'done_ss': {
                    selectField: 'CONCAT("DONE", (i_date IS NOT NULL))',
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
                    selectSql: 'SELECT COUNT(image.l_id) AS count, GetTechName(l_name) AS value, location.l_id AS id,' +
                        ' location.l_name AS label' +
                        ' FROM location INNER JOIN kategorie ON location.l_id = kategorie.l_id ' +
                        ' INNER JOIN image ON kategorie.k_id=image.k_id ' +
                        ' GROUP BY GetTechName(l_name), location.l_id' +
                        ' ORDER BY l_name ASC',
                    filterField: 'GetTechName(l_name)',
                    action: AdapterFilterActions.IN
                },
                'month_is': {
                    selectField: 'MONTH(i_date)',
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
                    selectSql: 'SELECT COUNT(image.i_id) AS count, ' +
                        ' o_name AS value ' +
                        'FROM' +
                        ' objects LEFT JOIN image_object ON objects.o_key=image_object.io_obj_type' +
                        ' INNER JOIN image ON image_object.i_id=image.i_id ' +
                        ' WHERE objects.o_category NOT IN ("' + TourDocSqlMytbDbConfig.personCategories.join('", "') + '")' +
                        ' GROUP BY value' +
                        ' ORDER BY value',
                    filterField: 'realobjects.o_name',
                    action: AdapterFilterActions.IN
                },
                'odcats_txt': {
                    selectSql: 'SELECT COUNT(image.i_id) AS count, o_category AS value ' +
                        'FROM' +
                        ' image_object INNER JOIN image ON image_object.i_id=image.i_id ' +
                        ' LEFT JOIN objects_key ON image_object.io_obj_type=objects_key.ok_key' +
                        '      AND image_object.io_detector=objects_key.ok_detector ' +
                        ' LEFT JOIN objects ON objects_key.o_id=objects.o_id ' +
                        ' GROUP BY value' +
                        ' ORDER BY value',
                    filterField: 'objects.o_category',
                    action: AdapterFilterActions.IN
                },
                'oddetectors_txt': {
                    selectSql: 'SELECT COUNT(image.i_id) AS count, ' +
                        ' io_detector AS value ' +
                        'FROM' +
                        ' image_object INNER JOIN image ON image_object.i_id=image.i_id ' +
                        ' GROUP BY value' +
                        ' ORDER BY value',
                    filterField: 'image_object.io_detector',
                    action: AdapterFilterActions.IN
                },
                'odkeys_txt': {
                    selectSql: 'SELECT COUNT(image.i_id) AS count, ' +
                        ' io_obj_type AS value, CONCAT(o_name, " | "  , o_category, " | " , io_obj_type) as label ' +
                        'FROM' +
                        ' image_object INNER JOIN image ON image_object.i_id=image.i_id ' +
                        ' LEFT JOIN objects_key ON image_object.io_obj_type=objects_key.ok_key' +
                        '      AND image_object.io_detector=objects_key.ok_detector ' +
                        ' LEFT JOIN objects ON objects_key.o_id=objects.o_id ' +
                        ' GROUP BY value' +
                        ' ORDER BY label, value',
                    filterField: 'image_object.io_obj_type',
                    action: AdapterFilterActions.IN
                },
                'odkeys_all_txt': {
                    ignoreIfNotExplicitNamed: false,
                    selectSql: 'SELECT COUNT(image.i_id) AS count, ' +
                        ' ok_key AS value, CONCAT(o_name, " | " , o_category, " | " , ok_key) as label ' +
                        'FROM' +
                        ' objects_key' +
                        ' LEFT JOIN image_object  ON image_object.io_obj_type=objects_key.ok_key' +
                        '      AND image_object.io_detector=objects_key.ok_detector ' +
                        ' LEFT JOIN objects ON objects_key.o_id=objects.o_id ' +
                        ' LEFT JOIN image ON image_object.i_id=image.i_id ' +
                        ' GROUP BY value' +
                        ' ORDER BY label, value',
                    filterField: 'image_object.io_obj_type',
                    action: AdapterFilterActions.IN
                },
                'odcategory_all_txt': {
                    ignoreIfNotExplicitNamed: false,
                    selectSql: 'SELECT COUNT(image.i_id) AS count, ' +
                        ' o_category AS value, o_category as label ' +
                        'FROM' +
                        ' objects_key' +
                        ' LEFT JOIN image_object ON image_object.io_obj_type=objects_key.ok_key' +
                        '      AND image_object.io_detector=objects_key.ok_detector ' +
                        ' LEFT JOIN objects ON objects_key.o_id=objects.o_id ' +
                        ' LEFT JOIN image ON image_object.i_id=image.i_id ' +
                        ' GROUP BY value' +
                        ' ORDER BY label, value',
                    filterField: 'objects.o_category',
                    action: AdapterFilterActions.IN
                },
                'odprecision_is': {
                    selectSql: 'SELECT COUNT(image.i_id) AS count, ' +
                        ' ROUND(io_precision, 1)*100 AS value ' +
                        'FROM' +
                        ' image_object INNER JOIN image ON image_object.i_id=image.i_id ' +
                        ' GROUP BY value' +
                        ' ORDER BY value',
                    filterField: 'ROUND(image_object.io_precision, 1)*100',
                    action: AdapterFilterActions.IN
                },
                'odstates_ss': {
                    selectSql: 'SELECT COUNT(image.i_id) AS count, ' +
                        ' io_state AS value ' +
                        'FROM' +
                        ' image_object INNER JOIN image ON image_object.i_id=image.i_id ' +
                        ' GROUP BY value' +
                        ' ORDER BY value',
                    filterField: 'image_object.io_state',
                    action: AdapterFilterActions.IN
                },
                'persons_txt': {
                    selectSql: 'SELECT COUNT(image.i_id) AS count, ' +
                        ' o_name AS value ' +
                        'FROM' +
                        ' objects LEFT JOIN image_object ON objects.o_key=image_object.io_obj_type' +
                        ' INNER JOIN image ON image_object.i_id=image.i_id ' +
                        ' WHERE objects.o_category IN ("' + TourDocSqlMytbDbConfig.personCategories.join('", "') + '")' +
                        ' GROUP BY value' +
                        ' ORDER BY value',
                    filterField: 'persons.o_name',
                    action: AdapterFilterActions.IN
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
                'rate_pers_gesamt_is': {
                    selectField: 'i_rate',
                    orderBy: 'value asc'
                },
                'rate_pers_schwierigkeit_is': {
                    selectField: 'k_rate_schwierigkeit',
                    selectFrom: 'image INNER JOIN kategorie ON kategorie.k_id=image.k_id',
                    orderBy: 'value asc'
                },
                'rate_tech_overall_ss': {
                    noFacet: true
                },
                'subtype_ss': {
                    selectField: 'CONCAT("ac_", kategorie.k_type)',
                    selectFrom: 'image INNER JOIN kategorie ON kategorie.k_id=image.k_id',
                    orderBy: 'value asc'
                },
                'type_txt': {
                    constValues: ['image', 'odimgobject', 'video', 'track', 'route', 'location', 'trip', 'news', 'destination'],
                    filterField: '"image"',
                    selectLimit: 1
                },
                'week_is': {
                    selectField: 'WEEK(i_date)',
                    orderBy: 'value asc'
                },
                'year_is': {
                    selectField: 'YEAR(i_date)',
                    orderBy: 'value asc'
                }
            },
            sortMapping: {
                'date': 'i_date DESC, image.i_id DESC',
                'dateAsc': 'i_date ASC, image.i_id ASC',
                'distance': 'geodist ASC',
                'dataTechDurDesc': 'TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevON))/3600 DESC',
                'dataTechAltDesc': 'k_altitude_asc DESC',
                'dataTechMaxDesc': 'i_gps_ele DESC',
                'dataTechDistDesc': 'k_distance DESC',
                'dataTechDurAsc': 'TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 ASC',
                'dataTechAltAsc': 'k_altitude_asc ASC',
                'dataTechMaxAsc': 'i_gps_ele ASC',
                'dataTechDistAsc': 'k_distance ASC',
                'forExport': 'i_date ASC, image.i_id ASC',
                'ratePers': 'i_rate DESC, i_date DESC',
                'location': 'l_lochirarchietxt ASC',
                'relevance': 'i_date DESC'
            },
            spartialConfig: {
                lat: 'i_gps_lat',
                lon: 'i_gps_lon',
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
                noLocation: 'image.l_id',
                noRoute: '"666dummy999"',
                noSubType: '"666dummy999"',
                todoDesc: '"todoDesc"',
                todoKeywords: 'keyword.kw_name',
                unrated: 'image.i_rate',
                unRatedChildren: '"666dummy999"',
                // common
                id: 'image.i_id',
                destination_id_s: 'dt.d_id',
                destination_id_ss: 'dt.d_id',
                image_id_i: 'image.i_id',
                image_id_is: 'image.i_id',
                video_id_is: '"666dummy999"',
                video_id_i: '"666dummy999"',
                route_id_i: 'kategorie.t_id',
                route_id_is: 'kategorie.t_id',
                track_id_i: 'image.k_id',
                track_id_is: 'image.k_id',
                loc_lochirarchie_ids_txt: 'location.l_id',
                l_lochirarchietxt: 'location.l_name',
                html: 'CONCAT(COALESCE(i_meta_name,""), " ", l_name)'
            },
            writeMapping: {
                'image.l_id': ':loc_id_i:',
                'image.k_id': ':track_id_i:',
                'image.i_gesperrt': ':blocked_i:',
                'image.i_date': ':datestart_dt:',
                'image.i_meta_shortdesc': ':desc_txt:',
                // 'image.i_meta_shortdesc_md': ':desc_md_txt:',
                // 'image.i_meta_shortdesc_html': ':desc_html_txt:',
                'image.i_gps_lon': ':geo_lon_s:',
                'image.i_gps_lat': ':geo_lat_s:',
                'image.i_gps_ele': ':data_tech_alt_max_i:',
                'image.i_rate': ':rate_pers_gesamt_i:',
                'image.i_rate_motive': ':rate_pers_motive_i:',
                'image.i_rate_wichtigkeit': ':rate_pers_wichtigkeit_i:',
                'image.i_meta_name': ':name_s:',
                'image.i_dir': 'SUBSTRING(":i_fav_url_txt:", 1, CHARINDEX("/", ":i_fav_url_txt:") - 1)',
                'image.i_file': 'SUBSTRING(":i_fav_url_txt:", CHARINDEX("/", ":i_fav_url_txt:"))'
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
                actiontype_s: 'actionType',
                blocked_i: 'i_gesperrt',
                data_tech_alt_asc_i: 'k_altitude_asc',
                data_tech_alt_desc_i: 'k_altitude_desc',
                data_tech_alt_min_i: 'i_gps_ele',
                data_tech_alt_max_i: 'i_gps_ele',
                data_tech_dist_f: 'k_distance',
                data_tech_dur_f: 'dur',
                dateshow_dt: 'i_date',
                datestart_dt: 'i_date',
                dateend_dt: 'i_date',
                desc_txt: 'i_meta_shortdesc',
                desc_md_txt: 'i_meta_shortdesc_md',
                desc_html_txt: 'i_meta_shortdesc_html',
                distance: 'geodist',
                geo_lon_s: 'i_gps_lon',
                geo_lat_s: 'i_gps_lat',
                geo_loc_p: 'i_gps_loc',
                i_fav_url_txt: 'i_fav_url_txt',
                rate_pers_ausdauer_i: 'k_rate_ausdauer',
                rate_pers_bildung_i: 'k_rate_bildung',
                rate_pers_gesamt_i: 'i_rate',
                rate_pers_kraft_i: 'k_rate_kraft',
                rate_pers_mental_i: 'k_rate_mental',
                rate_pers_motive_i: 'i_rate_motive',
                rate_pers_schwierigkeit_i: 'k_rate_schwierigkeit',
                rate_pers_wichtigkeit_i: 'i_rate_wichtigkeit',
                gpstracks_basefile_s: 'k_gpstracks_basefile',
                keywords_txt: 'i_keywords',
                loc_lochirarchie_s: 'l_lochirarchietxt',
                loc_lochirarchie_ids_s: 'l_lochirarchieids',
                name_s: 'i_meta_name',
                persons_txt: 'i_persons',
                objects_txt: 'i_objects',
                playlists_txt: 'i_playlists',
                subtype_s: 'subtype',
                type_s: 'type'
            }
        },
        'odimgobject': {
            key: 'odimgobject',
            tableName: 'image_object',
            selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id ' +
                'LEFT JOIN objects persons ON image_object.io_obj_type=persons.o_key AND LOWER(persons.o_category) LIKE "person" ' +
                'LEFT JOIN objects realobjects ON image_object.io_obj_type=realobjects.o_key' +
                '     AND LOWER(realobjects.o_category) NOT LIKE "person" ' +
                'LEFT JOIN kategorie ON kategorie.k_id=image.k_id ' +
                'LEFT JOIN location ON location.l_id = kategorie.l_id ',
            optionalGroupBy: [
                {
                    from: 'LEFT JOIN image_keyword ON image.i_id=image_keyword.i_id ' +
                        'LEFT JOIN keyword ON image_keyword.kw_id=keyword.kw_id',
                    triggerParams: ['id', 'keywords_txt'],
                    groupByFields: ['GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS i_keywords']
                },
                {
                    from: 'LEFT JOIN image_playlist ON image.i_id=image_playlist.i_id ' +
                        'LEFT JOIN playlist ON image_playlist.p_id=playlist.p_id',
                    triggerParams: ['playlists_txt'],
                    groupByFields: ['GROUP_CONCAT(DISTINCT playlist.p_name ORDER BY playlist.p_name SEPARATOR ", ") AS i_playlists']
                },
                {
                    from: 'INNER JOIN (SELECT io_id AS id FROM image_object' +
                        '                     WHERE CONCAT(image_object.i_id, ":::key=", image_object.io_obj_type,' +
                        ' ":::detector=", image_object.io_detector,' +
                        ' ":::objX=", image_object.io_obj_x1,' +
                        ' ":::objY=", image_object.io_obj_y1,' +
                        ' ":::objWidth=", image_object.io_obj_width,' +
                        ' ":::objHeight=", image_object.io_obj_height,' +
                        ' ":::precision=", image_object.io_precision) IN' +
                        '    (SELECT DISTINCT CONCAT(image_object.i_id, ":::key=", image_object.io_obj_type,' +
                        ' ":::detector=", image_object.io_detector,' +
                        ' ":::objX=", image_object.io_obj_x1,' +
                        ' ":::objY=", image_object.io_obj_y1,' +
                        ' ":::objWidth=", image_object.io_obj_width,' +
                        ' ":::objHeight=", image_object.io_obj_height,' +
                        ' ":::precision=", image_object.io_precision)' +
                        '     FROM image_object GROUP BY CONCAT(image_object.i_id, ":::key=", image_object.io_obj_type,' +
                        ' ":::detector=", image_object.io_detector,' +
                        ' ":::objX=", image_object.io_obj_x1,' +
                        ' ":::objY=", image_object.io_obj_y1,' +
                        ' ":::objWidth=", image_object.io_obj_width,' +
                        ' ":::objHeight=", image_object.io_obj_height,' +
                        ' ":::precision=", image_object.io_precision)' +
                        '                    HAVING COUNT(*) > 1)' +
                        '             ) doublettes' +
                        '             ON image_object.io_id=doublettes.id',
                    triggerParams: ['doublettes'],
                    groupByFields: []
                }
            ],
            loadDetailData: [
                {
                    profile: 'image_playlist',
                    sql: 'SELECT GROUP_CONCAT(DISTINCT playlist.p_name ORDER BY playlist.p_name SEPARATOR ", ") AS i_playlists ' +
                        'FROM image_object INNER JOIN image ON image_object.i_id=image.i_id' +
                        ' INNER JOIN image_playlist ON image.i_id=image_playlist.i_id' +
                        ' INNER JOIN playlist on image_playlist.p_id=playlist.p_id ' +
                        'WHERE image_object.io_id IN (:id)',
                    parameterNames: ['id']
                },
                {
                    profile: 'image_objectdetections',
                    sql: 'SELECT GROUP_CONCAT(DISTINCT CONCAT("ioId=", image_object.io_id,' +
                        ' ":::key=", image_object.io_obj_type,' +
                        ' ":::detector=", image_object.io_detector,' +
                        ' ":::imgWidth=", image_object.io_img_width,' +
                        ' ":::imgHeight=", image_object.io_img_height,' +
                        ' ":::objX=", image_object.io_obj_x1,' +
                        ' ":::objY=", image_object.io_obj_y1,' +
                        ' ":::objWidth=", image_object.io_obj_width,' +
                        ' ":::objHeight=", image_object.io_obj_height,' +
                        ' ":::name=", objects.o_name,' +
                        ' ":::category=", objects.o_category,' +
                        ' ":::precision=", image_object.io_precision,' +
                        ' ":::state=", image_object.io_state) SEPARATOR ";;") as i_objectdetections ' +
                        'FROM image INNER JOIN image_object ON image.i_id=image_object.i_id' +
                        ' INNER JOIN objects_key ON image_object.io_obj_type=objects_key.ok_key' +
                        '       AND image_object.io_detector=objects_key.ok_detector ' +
                        ' INNER JOIN objects ON objects_key.o_id=objects.o_id ' +
                        'WHERE image_object.io_id IN (:id)',
                    parameterNames: ['id']
                },
                {
                    profile: 'keywords',
                    sql: 'select GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS keywords ' +
                        'FROM image_object INNER JOIN image ON image_object.i_id=image.i_id' +
                        ' INNER JOIN image_keyword ON image.i_id=image_keyword.i_id' +
                        ' INNER JOIN keyword on image_keyword.kw_id=keyword.kw_id ' +
                        'WHERE image_object.io_id IN (:id)',
                    parameterNames: ['id'],
                    modes: ['full']
                }
            ],
            groupbBySelectFieldListIgnore: ['i_keywords', 'i_playlists'],
            selectFieldList: [
                '"ODIMGOBJECT" AS type',
                'k_type',
                'CONCAT("ac_", kategorie.k_type) AS actiontype',
                'CONCAT("ac_", kategorie.k_type) AS subtype',
                'CONCAT("ODIMGOBJECT", "_", image_object.io_id) AS id',
                // 'n_id',
                'image.i_id',
                'image.k_id',
                'kategorie.t_id',
                'kategorie.tr_id',
                'kategorie.l_id',
                'COALESCE(persons.o_name, realobjects.o_name, i_meta_name, k_name) AS i_meta_name',
                'CONCAT(COALESCE(persons.o_name,""), " ", COALESCE(realobjects.o_name,""), " ", l_name) AS html',
                'i_gesperrt',
                'i_date',
                'DATE_FORMAT(i_date, GET_FORMAT(DATE, "ISO")) AS dateonly',
                'WEEK(i_date) AS week',
                'MONTH(i_date) AS month',
                'YEAR(i_date) AS year',
                'k_gpstracks_basefile',
                'i_meta_shortdesc',
                'i_meta_shortdesc AS i_meta_shortdesc_md',
                'i_meta_shortdesc AS i_meta_shortdesc_html',
                'CAST(i_gps_lat AS CHAR(50)) AS i_gps_lat',
                'CAST(i_gps_lon AS CHAR(50)) AS i_gps_lon',
                'CONCAT(i_gps_lat, ",", i_gps_lon) AS i_gps_loc',
                'CONCAT("T", location.l_typ, "L", location.l_parent_id, " -> ", location.l_name) AS l_lochirarchietxt',
                'CONCAT(CAST(location.l_parent_id AS CHAR(50)), ",", CAST(location.l_id AS CHAR(50))) AS l_lochirarchieids',
                'CONCAT(image.i_dir, "/", image.i_file) AS i_fav_url_txt',
                'k_altitude_asc',
                'k_altitude_desc',
                'i_gps_ele',
                'i_gps_ele',
                'k_distance',
                'k_rate_ausdauer',
                'k_rate_bildung',
                'i_rate',
                'k_rate_kraft',
                'k_rate_mental',
                'i_rate_motive',
                'k_rate_schwierigkeit',
                'i_rate_wichtigkeit',
                'ROUND((k_altitude_asc / 500))*500 AS altAscFacet',
                'ROUND((i_gps_ele / 500))*500 AS altMaxFacet',
                'ROUND((k_distance / 5))*5 AS distFacet',
                'TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 AS dur',
                'ROUND(ROUND(TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 * 2) / 2, 1) AS durFacet',
                'persons.o_name AS i_persons',
                'realobjects.o_name AS i_objects'],
            facetConfigs: {
                // dashboard
                'doublettes': {
                    selectSql: 'SELECT COUNT(image_object.io_id) AS count, "doublettes" AS value,' +
                        ' "doublettes" AS label, "true" AS id' +
                        ' FROM image_object INNER JOIN (SELECT io_id AS id FROM image_object' +
                        '                     WHERE CONCAT(image_object.i_id, ":::key=", image_object.io_obj_type,' +
                        ' ":::detector=", image_object.io_detector,' +
                        ' ":::objX=", image_object.io_obj_x1,' +
                        ' ":::objY=", image_object.io_obj_y1,' +
                        ' ":::objWidth=", image_object.io_obj_width,' +
                        ' ":::objHeight=", image_object.io_obj_height,' +
                        ' ":::precision=", image_object.io_precision) IN' +
                        '    (SELECT DISTINCT CONCAT(image_object.i_id, ":::key=", image_object.io_obj_type,' +
                        ' ":::detector=", image_object.io_detector,' +
                        ' ":::objX=", image_object.io_obj_x1,' +
                        ' ":::objY=", image_object.io_obj_y1,' +
                        ' ":::objWidth=", image_object.io_obj_width,' +
                        ' ":::objHeight=", image_object.io_obj_height,' +
                        ' ":::precision=", image_object.io_precision)' +
                        '     FROM image_object GROUP BY CONCAT(image_object.i_id, ":::key=", image_object.io_obj_type,' +
                        ' ":::detector=", image_object.io_detector,' +
                        ' ":::objX=", image_object.io_obj_x1,' +
                        ' ":::objY=", image_object.io_obj_y1,' +
                        ' ":::objWidth=", image_object.io_obj_width,' +
                        ' ":::objHeight=", image_object.io_obj_height,' +
                        ' ":::precision=", image_object.io_precision)' +
                        '                    HAVING COUNT(*) > 1)' +
                        '             ) doublettes' +
                        '             ON image_object.io_id=doublettes.id',
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
                    filterField: 'CONCAT("ODIMGOBJECT", "_", image_object.io_id)',
                    action: AdapterFilterActions.NOTIN
                },
                'actiontype_ss': {
                    selectField: 'CONCAT("ac_", kategorie.k_type)',
                    selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id ' +
                        'INNER JOIN kategorie ON kategorie.k_id=image.k_id'
                },
                'blocked_is': {
                    selectField: 'i_gesperrt',
                    selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id'
                },
                'data_tech_alt_asc_facet_is': {
                    selectField: 'ROUND((k_altitude_asc / 500))*500',
                    selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id ' +
                        'INNER JOIN kategorie ON kategorie.k_id=image.k_id',
                    orderBy: 'value asc'
                },
                'data_tech_alt_max_facet_is': {
                    selectField: 'ROUND((i_gps_ele / 500))*500',
                    orderBy: 'value asc',
                    selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id'
                },
                'data_tech_dist_facets_fs': {
                    selectField: 'ROUND((k_distance / 5))*5',
                    selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id ' +
                        'INNER JOIN kategorie ON kategorie.k_id=image.k_id',
                    orderBy: 'value asc'
                },
                'data_tech_dur_facet_fs': {
                    selectField: 'ROUND(ROUND(TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 * 2) / 2, 1)',
                    selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id ' +
                        'INNER JOIN kategorie ON kategorie.k_id=image.k_id',
                    orderBy: 'value asc'
                },
                'done_ss': {
                    selectField: 'CONCAT("DONE", (i_date IS NOT NULL))',
                    selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id',
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
                    selectSql: 'SELECT COUNT(image.l_id) AS count, GetTechName(l_name) AS value, location.l_id AS id,' +
                        ' location.l_name AS label' +
                        ' FROM location INNER JOIN kategorie ON location.l_id = kategorie.l_id ' +
                        ' INNER JOIN image ON kategorie.k_id=image.k_id ' +
                        ' INNER JOIN image_object ON image_object.i_id=image.i_id' +
                        ' GROUP BY GetTechName(l_name), location.l_id' +
                        ' ORDER BY l_name ASC',
                    filterField: 'GetTechName(l_name)',
                    action: AdapterFilterActions.IN
                },
                'month_is': {
                    selectField: 'MONTH(i_date)',
                    orderBy: 'value asc',
                    selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id ',
                },
                'objects_txt': {
                    selectSql: 'SELECT COUNT(io_id) AS count, ' +
                        ' o_name AS value ' +
                        'FROM' +
                        ' objects LEFT JOIN image_object ON objects.o_key=image_object.io_obj_type' +
                        ' WHERE objects.o_category NOT IN ("' + TourDocSqlMytbDbConfig.personCategories.join('", "') + '")' +
                        ' GROUP BY value' +
                        ' ORDER BY value',
                    filterField: 'realobjects.o_name',
                    action: AdapterFilterActions.IN
                },
                'odcats_txt': {
                    selectSql: 'SELECT COUNT(io_id) AS count, o_category AS value ' +
                        'FROM' +
                        ' image_object' +
                        ' LEFT JOIN objects_key ON image_object.io_obj_type=objects_key.ok_key' +
                        '      AND image_object.io_detector=objects_key.ok_detector ' +
                        ' LEFT JOIN objects ON objects_key.o_id=objects.o_id ' +
                        ' GROUP BY value' +
                        ' ORDER BY value',
                    filterField: 'realobjects.o_category',
                    action: AdapterFilterActions.IN
                },
                'oddetectors_txt': {
                    selectSql: 'SELECT COUNT(io_id) AS count, ' +
                        ' io_detector AS value ' +
                        'FROM' +
                        ' image_object' +
                        ' GROUP BY value' +
                        ' ORDER BY value',
                    filterField: 'io_detector',
                    action: AdapterFilterActions.IN
                },
                'odkeys_txt': {
                    selectSql: 'SELECT COUNT(io_id) AS count, ' +
                        ' io_obj_type AS value, CONCAT(o_name, " | " , o_category, " | " , io_obj_type) as label ' +
                        'FROM' +
                        ' image_object' +
                        ' LEFT JOIN objects_key ON image_object.io_obj_type=objects_key.ok_key' +
                        '      AND image_object.io_detector=objects_key.ok_detector ' +
                        ' LEFT JOIN objects ON objects_key.o_id=objects.o_id ' +
                        ' GROUP BY value' +
                        ' ORDER BY label, value',
                    filterField: 'io_obj_type',
                    action: AdapterFilterActions.IN
                },
                'odkeys_all_txt': {
                    ignoreIfNotExplicitNamed: false,
                    selectSql: 'SELECT COUNT(io_id) AS count, ' +
                        ' ok_key AS value, CONCAT(o_name, " | " , o_category, " | " , ok_key) as label ' +
                        'FROM' +
                        ' objects_key' +
                        ' LEFT JOIN image_object  ON image_object.io_obj_type=objects_key.ok_key' +
                        '      AND image_object.io_detector=objects_key.ok_detector ' +
                        ' LEFT JOIN objects ON objects_key.o_id=objects.o_id ' +
                        ' GROUP BY value' +
                        ' ORDER BY label, value',
                    filterField: 'io_obj_type',
                    action: AdapterFilterActions.IN
                },
                'odcategory_all_txt': {
                    ignoreIfNotExplicitNamed: false,
                    selectSql: 'SELECT COUNT(io_id) AS count, ' +
                        ' o_category AS value, o_category as label ' +
                        'FROM' +
                        ' objects_key' +
                        ' LEFT JOIN image_object  ON image_object.io_obj_type=objects_key.ok_key' +
                        '      AND image_object.io_detector=objects_key.ok_detector ' +
                        ' LEFT JOIN objects ON objects_key.o_id=objects.o_id ' +
                        ' GROUP BY value' +
                        ' ORDER BY label, value',
                    filterField: 'realobjects.o_category',
                    action: AdapterFilterActions.IN
                },
                'odprecision_is': {
                    selectSql: 'SELECT COUNT(ROUND(io_precision, 1)*100) AS count, ' +
                        ' ROUND(io_precision, 1)*100 AS value ' +
                        'FROM' +
                        ' image_object' +
                        ' GROUP BY value' +
                        ' ORDER BY value',
                    filterField: 'ROUND(io_precision, 1)*100',
                    action: AdapterFilterActions.IN
                },
                'odstates_ss': {
                    selectSql: 'SELECT COUNT(io_id) AS count, ' +
                        ' io_state AS value ' +
                        'FROM' +
                        ' image_object' +
                        ' GROUP BY value' +
                        ' ORDER BY value',
                    filterField: 'io_state',
                    action: AdapterFilterActions.IN
                },
                'persons_txt': {
                    selectSql: 'SELECT COUNT(io_id) AS count, ' +
                        ' o_name AS value ' +
                        'FROM' +
                        ' objects LEFT JOIN image_object ON objects.o_key=image_object.io_obj_type' +
                        ' WHERE objects.o_category IN ("' + TourDocSqlMytbDbConfig.personCategories.join('", "') + '")' +
                        ' GROUP BY value' +
                        ' ORDER BY value',
                    filterField: 'persons.o_name',
                    action: AdapterFilterActions.IN
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
                'rate_pers_gesamt_is': {
                    selectField: 'i_rate',
                    orderBy: 'value asc',
                    selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id'
                },
                'rate_pers_schwierigkeit_is': {
                    selectField: 'k_rate_schwierigkeit',
                    selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id ' +
                        'INNER JOIN kategorie ON kategorie.k_id=image.k_id',
                    orderBy: 'value asc'
                },
                'rate_tech_overall_ss': {
                    noFacet: true
                },
                'subtype_ss': {
                    selectField: 'CONCAT("ac_", kategorie.k_type)',
                    selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id ' +
                        'INNER JOIN kategorie ON kategorie.k_id=image.k_id',
                    orderBy: 'value asc'
                },
                'type_txt': {
                    constValues: ['image', 'odimgobject', 'video', 'track', 'route', 'location', 'trip', 'news', 'destination'],
                    filterField: '"odimgobject"',
                    selectLimit: 1
                },
                'week_is': {
                    selectField: 'WEEK(i_date)',
                    orderBy: 'value asc',
                    selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id'
                },
                'year_is': {
                    selectField: 'YEAR(i_date)',
                    orderBy: 'value asc',
                    selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id'
                }
            },
            sortMapping: {
                'date': 'i_date DESC, image.i_id DESC',
                'dateAsc': 'i_date ASC, image.i_id ASC',
                'distance': 'geodist ASC',
                'dataTechDurDesc': 'TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevON))/3600 DESC',
                'dataTechAltDesc': 'k_altitude_asc DESC',
                'dataTechMaxDesc': 'i_gps_ele DESC',
                'dataTechDistDesc': 'k_distance DESC',
                'dataTechDurAsc': 'TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 ASC',
                'dataTechAltAsc': 'k_altitude_asc ASC',
                'dataTechMaxAsc': 'i_gps_ele ASC',
                'dataTechDistAsc': 'k_distance ASC',
                'forExport': 'i_date ASC, image.i_id ASC',
                'odState': 'io_state ASC, image.i_id ASC',
                'odPrecision': 'io_precision DESC, image.i_id ASC',
                'ratePers': 'i_rate DESC, i_date DESC',
                'location': 'l_lochirarchietxt ASC',
                'relevance': 'i_date DESC'
            },
            spartialConfig: {
                lat: 'i_gps_lat',
                lon: 'i_gps_lon',
                spatialField: 'geodist',
                spatialSortKey: 'distance'
            },
            filterMapping: {
                // dashboard
                doublettes: '"666dummy999"',
                conflictingRates: '"666dummy999"',
                noFavoriteChildren: '"666dummy999"',
                noMainFavoriteChildren: '"666dummy999"',
                noCoordinates: '"666dummy999"',
                noLocation: '"666dummy999"',
                noRoute: '"666dummy999"',
                noSubType: '"666dummy999"',
                todoDesc: '"666dummy999"',
                todoKeywords: '"666dummy999"',
                unrated: '"666dummy999"',
                unRatedChildren: '"666dummy999"',
                // common
                id: 'image_object.io_id',
                image_id_i: 'image.i_id',
                image_id_is: 'image.i_id',
                video_id_is: '"666dummy999"',
                video_id_i: '"666dummy999"',
                route_id_i: 'kategorie.t_id',
                route_id_is: 'kategorie.t_id',
                track_id_i: 'image.k_id',
                track_id_is: 'image.k_id',
                news_id_is: '"666dummy999"',
                loc_lochirarchie_ids_txt: 'location.l_id',
                l_lochirarchietxt: 'location.l_name',
                html: 'CONCAT(COALESCE(i_meta_name,""), " ", l_name)'
            },
            // TODO: for import
            writeMapping: {
                'image_object.i_id': ':image_id_i:',
                'image_object.i_rate': ':rate_pers_gesamt_i:'
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
                actiontype_s: 'actionType',
                blocked_i: 'i_gesperrt',
                data_tech_alt_asc_i: 'k_altitude_asc',
                data_tech_alt_desc_i: 'k_altitude_desc',
                data_tech_alt_min_i: 'i_gps_ele',
                data_tech_alt_max_i: 'i_gps_ele',
                data_tech_dist_f: 'k_distance',
                data_tech_dur_f: 'dur',
                dateshow_dt: 'i_date',
                datestart_dt: 'i_date',
                dateend_dt: 'i_date',
                desc_txt: 'i_meta_shortdesc',
                desc_md_txt: 'i_meta_shortdesc_md',
                desc_html_txt: 'i_meta_shortdesc_html',
                distance: 'geodist',
                geo_lon_s: 'i_gps_lon',
                geo_lat_s: 'i_gps_lat',
                geo_loc_p: 'i_gps_loc',
                i_fav_url_txt: 'i_fav_url_txt',
                rate_pers_ausdauer_i: 'k_rate_ausdauer',
                rate_pers_bildung_i: 'k_rate_bildung',
                rate_pers_gesamt_i: 'i_rate',
                rate_pers_kraft_i: 'k_rate_kraft',
                rate_pers_mental_i: 'k_rate_mental',
                rate_pers_motive_i: 'i_rate_motive',
                rate_pers_schwierigkeit_i: 'k_rate_schwierigkeit',
                rate_pers_wichtigkeit_i: 'i_rate_wichtigkeit',
                gpstracks_basefile_s: 'k_gpstracks_basefile',
                keywords_txt: 'i_keywords',
                loc_lochirarchie_s: 'l_lochirarchietxt',
                loc_lochirarchie_ids_s: 'l_lochirarchieids',
                name_s: 'i_meta_name',
                persons_txt: 'i_persons',
                objects_txt: 'i_objects',
                playlists_txt: 'i_playlists',
                subtype_s: 'subtype',
                type_s: 'type'
            }
        },
        'video': {
            key: 'video',
            tableName: 'video',
            selectFrom: 'video LEFT JOIN kategorie ON kategorie.k_id=video.k_id ' +
                'LEFT JOIN location ON location.l_id = kategorie.l_id ',
            optionalGroupBy: [
                {
                    from: 'LEFT JOIN video_keyword ON video.v_id=video_keyword.v_id ' +
                        'LEFT JOIN keyword ON video_keyword.kw_id=keyword.kw_id',
                    triggerParams: ['id', 'keywords_txt', 'todoKeywords'],
                    groupByFields: ['GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS i_keywords']
                },
                {
                    from: 'LEFT JOIN tour kt2 ON kategorie.t_id=kt2.t_id ' +
                        'LEFT JOIN destination dt ON dt.d_id in (MD5(CONCAT(kt2.l_id, "_", kt2.t_desc_gebiet, "_", kt2.t_desc_ziel, "_", kt2.t_typ)))',
                    triggerParams: ['destination_id_s', 'destination_id_ss'],
                    groupByFields: []
                },
                {
                    from: 'LEFT JOIN video_playlist ON video.v_id=video_playlist.v_id ' +
                        'LEFT JOIN playlist ON video_playlist.p_id=playlist.p_id',
                    triggerParams: ['playlists_txt'],
                    groupByFields: ['GROUP_CONCAT(DISTINCT playlist.p_name ORDER BY playlist.p_name SEPARATOR ", ") AS v_playlists']
                },
                {
                    from: 'LEFT JOIN video_object ON video.v_id=video_object.v_id ' +
                        'LEFT JOIN objects ON video_object.vo_obj_type=objects.o_key',
                    triggerParams: ['id', 'odstates_ss', 'odprecision_is', 'odcats_txt', 'odkeys_txt', 'oddetectors_txt'],
                    groupByFields: ['GROUP_CONCAT(DISTINCT objects.o_name ORDER BY objects.o_name SEPARATOR ", ") AS v_allobjects']
                },
                {
                    from: 'LEFT JOIN video_object video_object_persons ON video.v_id=video_object_persons.v_id ' +
                        'LEFT JOIN objects persons ON video_object_persons.vo_obj_type=persons.o_key' +
                        ' AND LOWER(persons.o_category) LIKE "person"' +
                        ' AND (video_object_persons.vo_precision = 1' +
                        '      OR video_object_persons.vo_state in ("' + TourDocSqlMytbDbConfig.detectionOkStates.join('", "') + '"))',
                    triggerParams: ['persons_txt'],
                    groupByFields: ['GROUP_CONCAT(DISTINCT persons.o_name ORDER BY persons.o_name SEPARATOR ", ") AS v_persons']
                },
                {
                    from: 'LEFT JOIN video_object video_object_objects ON video.v_id=video_object_objects.v_id ' +
                        'LEFT JOIN objects realobjects ON video_object_objects.vo_obj_type=realobjects.o_key' +
                        ' AND LOWER(realobjects.o_category) NOT LIKE "person"' +
                        ' AND (video_object_objects.vo_precision = 1' +
                        '      OR video_object_objects.vo_state in ("' + TourDocSqlMytbDbConfig.detectionOkStates.join('", "') + '"))',
                    triggerParams: ['objects_txt'],
                    groupByFields: ['GROUP_CONCAT(DISTINCT realobjects.o_name ORDER BY realobjects.o_name SEPARATOR ", ") AS v_objects']
                },
                {
                    from: 'LEFT JOIN news ON kategorie.k_datevon >= news.n_datevon AND kategorie.k_datevon <= news.n_datebis',
                    triggerParams: ['news_id_i', 'news_id_is'],
                    groupByFields: ['news.n_id']
                },
                {
                    from: 'INNER JOIN (SELECT v_id AS id FROM video INNER JOIN' +
                        '                (SELECT DISTINCT v_dir, v_file FROM video GROUP BY v_dir, v_file' +
                        '                 HAVING COUNT(*) > 1) doublettes' +
                        '                ON video.v_file = doublettes.v_file AND video.v_dir = doublettes.v_dir) doublettes2' +
                        '             ON video.v_id = doublettes2.id',
                    triggerParams: ['doublettes'],
                    groupByFields: []
                }
            ],
            loadDetailData: [
                {
                    profile: 'video_playlist',
                    sql: 'SELECT GROUP_CONCAT(DISTINCT playlist.p_name ORDER BY playlist.p_name SEPARATOR ", ") AS v_playlists ' +
                        'FROM video INNER JOIN video_playlist ON video.v_id=video_playlist.v_id' +
                        ' INNER JOIN playlist on video_playlist.p_id=playlist.p_id ' +
                        'WHERE video.v_id IN (:id)',
                    parameterNames: ['id']
                },
                {
                    profile: 'video_persons',
                    sql: 'SELECT GROUP_CONCAT(DISTINCT objects.o_name ORDER BY objects.o_name SEPARATOR ", ") AS v_persons ' +
                        'FROM video INNER JOIN video_object ON video.v_id=video_object.v_id' +
                        ' INNER JOIN objects_key ON video_object.vo_obj_type=objects_key.ok_key' +
                        ' AND video_object.vo_detector=objects_key.ok_detector ' +
                        ' INNER JOIN objects ON objects_key.o_id=objects.o_id ' +
                        ' AND LOWER(o_category) LIKE "person"' +
                        ' AND (video_object.vo_precision = 1' +
                        '      OR video_object.vo_state in ("' + TourDocSqlMytbDbConfig.detectionOkStates.join('", "') + '"))' +
                        'WHERE video.v_id IN (:id)',
                    parameterNames: ['id']
                },
                {
                    profile: 'video_objects',
                    sql: 'SELECT GROUP_CONCAT(DISTINCT objects.o_name ORDER BY objects.o_name SEPARATOR ", ") AS v_objects ' +
                        'FROM video INNER JOIN video_object ON video.v_id=video_object.v_id' +
                        ' INNER JOIN objects_key ON video_object.vo_obj_type=objects_key.ok_key' +
                        ' AND video_object.vo_detector=objects_key.ok_detector ' +
                        ' INNER JOIN objects ON objects_key.o_id=objects.o_id ' +
                        ' AND LOWER(o_category) NOT LIKE "person"' +
                        ' AND (video_object.vo_precision = 1' +
                        '      OR video_object.vo_state in ("' + TourDocSqlMytbDbConfig.detectionOkStates.join('", "') + '"))' +
                        'WHERE video.v_id IN (:id)',
                    parameterNames: ['id']
                },
                {
                    profile: 'keywords',
                    sql: 'select GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS keywords ' +
                        'FROM video INNER JOIN video_keyword ON video.v_id=video_keyword.v_id' +
                        ' INNER JOIN keyword on video_keyword.kw_id=keyword.kw_id ' +
                        'WHERE video.v_id IN (:id)',
                    parameterNames: ['id'],
                    modes: ['full']
                },
                {
                    profile: 'navigation_objects',
                    sql: '(SELECT CONCAT("navid=VIDEO_", v_id, ":::name=", COALESCE(v_meta_name, "null"), ":::navtype=", "PREDECESSOR")' +
                        '  AS navigation_objects' +
                        '  FROM video WHERE v_date < (SELECT v_date FROM video WHERE v_id IN (:id))' +
                        '  ORDER BY v_date DESC, v_id DESC LIMIT 1) ' +
                        'UNION ' +
                        ' (SELECT CONCAT("navid=VIDEO_", v_id, ":::name=", COALESCE(v_meta_name, "null"), ":::navtype=", "SUCCESSOR")' +
                        '  AS navigation_objects' +
                        '  FROM video WHERE v_date > (SELECT v_date FROM video WHERE v_id IN (:id))' +
                        '   ORDER BY v_date, v_id LIMIT 1)',
                    parameterNames: ['id'],
                    modes: ['details']
                }
            ],
            groupbBySelectFieldListIgnore: ['v_keywords', 'v_playlists', 'v_persons', 'v_objects'],
            selectFieldList: [
                '"VIDEO" AS type',
                'k_type',
                'CONCAT("ac_", kategorie.k_type) AS actiontype',
                'CONCAT("ac_", kategorie.k_type) AS subtype',
                'CONCAT("VIDEO", "_", video.v_id) AS id',
                // 'n_id',
                'video.v_id',
                'video.k_id',
                'kategorie.t_id',
                'kategorie.tr_id',
                'kategorie.l_id',
                'COALESCE(v_meta_name,k_name) AS v_meta_name',
                'CONCAT(COALESCE(v_meta_name,""), " ", l_name) AS html',
                'v_gesperrt',
                'v_date',
                'DATE_FORMAT(v_date, GET_FORMAT(DATE, "ISO")) AS dateonly',
                'WEEK(v_date) AS week',
                'MONTH(v_date) AS month',
                'YEAR(v_date) AS year',
                'k_gpstracks_basefile',
                'v_meta_shortdesc',
                'v_meta_shortdesc AS v_meta_shortdesc_md',
                'v_meta_shortdesc AS v_meta_shortdesc_html',
                'CAST(v_gps_lat AS CHAR(50)) AS v_gps_lat',
                'CAST(v_gps_lon AS CHAR(50)) AS v_gps_lon',
                'CONCAT(v_gps_lat, ",", v_gps_lon) AS v_gps_loc',
                'CONCAT("T", location.l_typ, "L", location.l_parent_id, " -> ", location.l_name) AS l_lochirarchietxt',
                'CONCAT(CAST(location.l_parent_id AS CHAR(50)), ",", CAST(location.l_id AS CHAR(50))) AS l_lochirarchieids',
                'CONCAT(video.v_dir, "/", video.v_file) AS v_fav_url_txt',
                'k_altitude_asc',
                'k_altitude_desc',
                'v_gps_ele',
                'v_gps_ele',
                'k_distance',
                'k_rate_ausdauer',
                'k_rate_bildung',
                'v_rate',
                'k_rate_kraft',
                'k_rate_mental',
                'v_rate_motive',
                'k_rate_schwierigkeit',
                'v_rate_wichtigkeit',
                'ROUND((k_altitude_asc / 500))*500 AS altAscFacet',
                'ROUND((v_gps_ele / 500))*500 AS altMaxFacet',
                'ROUND((k_distance / 5))*5 AS distFacet',
                'TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 AS dur',
                'ROUND(ROUND(TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 * 2) / 2, 1) AS durFacet'],
            facetConfigs: {
                // dashboard
                'doublettes': {
                    selectSql: 'SELECT COUNT(video.v_id) AS count, "doublettes" AS value,' +
                        ' "doublettes" AS label, "true" AS id' +
                        ' FROM video INNER JOIN (SELECT v_id AS id FROM video INNER JOIN' +
                        '                (SELECT DISTINCT v_dir, v_file FROM video GROUP BY v_dir, v_file' +
                        '                 HAVING COUNT(*) > 1) doublettes' +
                        '                ON video.v_file = doublettes.v_file AND video.v_dir = doublettes.v_dir) doublettes2' +
                        '             ON video.v_id = doublettes2.id',
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
                    selectSql: 'SELECT COUNT(video.v_id) AS count, "noLocation" AS value,' +
                        ' "noLocation" AS label, "true" AS id' +
                        ' FROM video WHERE l_id IS NULL OR l_id IN (0,1 )',
                    filterField: 'video.l_id',
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
                    selectSql: 'SELECT COUNT(video.k_id) AS count, "todoDesc" AS value,' +
                        ' "todoDesc" AS label, "true" AS id' +
                        ' FROM video WHERE v_meta_shortdesc LIKE "TODODESC"',
                    filterField: 'video.v_meta_shortdesc',
                    action: AdapterFilterActions.IN
                },
                'todoKeywords': {
                    selectSql: 'SELECT COUNT(video.v_id) AS count, "todoKeywords" AS value,' +
                        ' "todoKeywords" AS label, "true" AS id' +
                        ' FROM video INNER JOIN video_keyword ON video.v_id=video_keyword.v_id' +
                        ' INNER JOIN keyword on video_keyword.kw_id=keyword.kw_id ' +
                        'WHERE keyword.kw_name IN ("KW_TODOKEYWORDS")',
                    filterField: 'keyword.kw_name',
                    action: AdapterFilterActions.IN
                },
                'unrated': {
                    selectSql: 'SELECT COUNT(video.v_id) AS count, "unrated" AS value,' +
                        ' "unrated" AS label, "true" AS id' +
                        ' FROM video WHERE v_rate IS NULL or v_rate in (0)',
                    filterField: 'video.v_rate',
                    action: AdapterFilterActions.IN
                },
                'unRatedChildren': {
                    constValues: ['unRatedChildren'],
                    filterField: '"666dummy999"'
                },
                // common
                'id_notin_is': {
                    filterField: 'CONCAT("VIDEO", "_", video.v_id)',
                    action: AdapterFilterActions.NOTIN
                },
                'actiontype_ss': {
                    selectField: 'CONCAT("ac_", kategorie.k_type)',
                    selectFrom: 'video INNER JOIN kategorie ON kategorie.k_id=video.k_id'
                },
                'blocked_is': {
                    selectField: 'v_gesperrt'
                },
                'data_tech_alt_asc_facet_is': {
                    selectField: 'ROUND((k_altitude_asc / 500))*500',
                    selectFrom: 'video INNER JOIN kategorie ON kategorie.k_id=video.k_id',
                    orderBy: 'value asc'
                },
                'data_tech_alt_max_facet_is': {
                    selectField: 'ROUND((v_gps_ele / 500))*500',
                    orderBy: 'value asc'
                },
                'data_tech_dist_facets_fs': {
                    selectField: 'ROUND((k_distance / 5))*5',
                    selectFrom: 'video INNER JOIN kategorie ON kategorie.k_id=video.k_id',
                    orderBy: 'value asc'
                },
                'data_tech_dur_facet_fs': {
                    selectField: 'ROUND(ROUND(TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 * 2) / 2, 1)',
                    selectFrom: 'video INNER JOIN kategorie ON kategorie.k_id=video.k_id',
                    orderBy: 'value asc'
                },
                'done_ss': {
                    selectField: 'CONCAT("DONE", (v_date IS NOT NULL))',
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
                    selectSql: 'SELECT COUNT(video.l_id) AS count, GetTechName(l_name) AS value, location.l_id AS id,' +
                        ' GetLocationNameAncestry(location.l_id, location.l_name, " -> ") AS label' +
                        ' FROM location LEFT JOIN kategorie ON location.l_id = kategorie.l_id ' +
                        ' LEFT JOIN video ON kategorie.k_id=video.k_id ' +
                        ' GROUP BY GetTechName(l_name), location.l_id' +
                        ' ORDER BY label ASC',
                    filterField: 'GetTechName(GetLocationNameAncestry(location.l_id, location.l_name, " -> "))',
                    action: AdapterFilterActions.LIKE
                },
                'month_is': {
                    selectField: 'MONTH(v_date)',
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
                    selectSql: 'SELECT COUNT(video.v_id) AS count, ' +
                        ' o_name AS value ' +
                        'FROM' +
                        ' objects LEFT JOIN video_object ON objects.o_key=video_object.vo_obj_type' +
                        ' INNER JOIN video ON video_object.v_id=video.v_id ' +
                        ' WHERE objects.o_category NOT IN ("' + TourDocSqlMytbDbConfig.personCategories.join('", "') + '")' +
                        ' GROUP BY value' +
                        ' ORDER BY value',
                    filterField: 'realobjects.o_name',
                    action: AdapterFilterActions.IN
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
                    selectSql: 'SELECT COUNT(video.v_id) AS count, ' +
                        ' o_name AS value ' +
                        'FROM' +
                        ' objects LEFT JOIN video_object ON objects.o_key=video_object.vo_obj_type' +
                        ' INNER JOIN video ON video_object.v_id=video.v_id ' +
                        ' WHERE objects.o_category IN ("' + TourDocSqlMytbDbConfig.personCategories.join('", "') + '")' +
                        ' GROUP BY value' +
                        ' ORDER BY value',
                    filterField: 'persons.o_name',
                    action: AdapterFilterActions.IN
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
                'rate_pers_gesamt_is': {
                    selectField: 'v_rate',
                    orderBy: 'value asc'
                },
                'rate_pers_schwierigkeit_is': {
                    selectField: 'k_rate_schwierigkeit',
                    selectFrom: 'video INNER JOIN kategorie ON kategorie.k_id=video.k_id',
                    orderBy: 'value asc'
                },
                'rate_tech_overall_ss': {
                    noFacet: true
                },
                'subtype_ss': {
                    selectField: 'CONCAT("ac_", kategorie.k_type)',
                    selectFrom: 'video INNER JOIN kategorie ON kategorie.k_id=video.k_id',
                    orderBy: 'value asc'
                },
                'type_txt': {
                    constValues: ['video', 'track', 'route', 'location', 'trip', 'news', 'image', 'odimgobject', 'destination'],
                    filterField: '"video"',
                    selectLimit: 1
                },
                'week_is': {
                    selectField: 'WEEK(v_date)',
                    orderBy: 'value asc'
                },
                'year_is': {
                    selectField: 'YEAR(v_date)',
                    orderBy: 'value asc'
                }
            },
            sortMapping: {
                'date': 'v_date DESC, video.v_id DESC',
                'dateAsc': 'v_date ASC, video.v_id ASC',
                'distance': 'geodist ASC',
                'dataTechDurDesc': 'TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevON))/3600 DESC',
                'dataTechAltDesc': 'k_altitude_asc DESC',
                'dataTechMaxDesc': 'v_gps_ele DESC',
                'dataTechDistDesc': 'k_distance DESC',
                'dataTechDurAsc': 'TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 ASC',
                'dataTechAltAsc': 'k_altitude_asc ASC',
                'dataTechMaxAsc': 'v_gps_ele ASC',
                'dataTechDistAsc': 'k_distance ASC',
                'forExport': 'v_date ASC, video.v_id ASC',
                'ratePers': 'v_rate DESC, v_date DESC',
                'location': 'l_lochirarchietxt ASC',
                'relevance': 'v_date DESC'
            },
            spartialConfig: {
                lat: 'v_gps_lat',
                lon: 'v_gps_lon',
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
                noLocation: 'video.l_id',
                noRoute: '"666dummy999"',
                noSubType: '"666dummy999"',
                todoDesc: '"todoDesc"',
                todoKeywords: 'keyword.kw_name',
                unrated: 'video.v_rate',
                unRatedChildren: '"666dummy999"',
                // common
                id: 'video.v_id',
                destination_id_s: 'dt.d_id',
                destination_id_ss: 'dt.d_id',
                image_id_is: '"666dummy999"',
                image_id_i: '"666dummy999"',
                video_id_i: 'video.v_id',
                video_id_is: 'video.v_id',
                route_id_i: 'kategorie.t_id',
                route_id_is: 'kategorie.t_id',
                track_id_i: 'video.k_id',
                track_id_is: 'video.k_id',
                loc_lochirarchie_ids_txt: 'location.l_id',
                l_lochirarchietxt: 'location.l_name',
                html: 'CONCAT(COALESCE(v_meta_name,""), " ", l_name)'
            },
            writeMapping: {
                'video.l_id': ':loc_id_i:',
                'video.k_id': ':track_id_i:',
                'video.v_gesperrt': ':blocked_i:',
                'video.v_date': ':datestart_dt:',
                'video.v_meta_shortdesc': ':desc_txt:',
                // 'video.v_meta_shortdesc_md': ':desc_md_txt:',
                // 'video.v_meta_shortdesc_html': ':desc_html_txt:',
                'video.v_gps_lon': ':geo_lon_s:',
                'video.v_gps_lat': ':geo_lat_s:',
                'video.v_gps_ele': ':data_tech_alt_max_i:',
                'video.v_rate': ':rate_pers_gesamt_i:',
                'video.v_rate_motive': ':rate_pers_motive_i:',
                'video.v_rate_wichtigkeit': ':rate_pers_wichtigkeit_i:',
                'video.v_meta_name': ':name_s:',
                'video.v_dir': 'SUBSTRING(":v_fav_url_txt:", 1, CHARINDEX("/", ":v_fav_url_txt:") - 1)',
                'video.v_file': 'SUBSTRING(":v_fav_url_txt:", CHARINDEX("/", ":v_fav_url_txt:"))'
            },
            fieldMapping: {
                id: 'id',
                video_id_i: 'v_id',
                video_id_is: 'v_id',
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
                actiontype_s: 'actionType',
                blocked_i: 'v_gesperrt',
                data_tech_alt_asc_i: 'k_altitude_asc',
                data_tech_alt_desc_i: 'k_altitude_desc',
                data_tech_alt_min_i: 'v_gps_ele',
                data_tech_alt_max_i: 'v_gps_ele',
                data_tech_dist_f: 'k_distance',
                data_tech_dur_f: 'dur',
                dateshow_dt: 'v_date',
                datestart_dt: 'v_date',
                dateend_dt: 'v_date',
                desc_txt: 'v_meta_shortdesc',
                desc_md_txt: 'v_meta_shortdesc_md',
                desc_html_txt: 'v_meta_shortdesc_html',
                distance: 'geodist',
                geo_lon_s: 'v_gps_lon',
                geo_lat_s: 'v_gps_lat',
                geo_loc_p: 'v_gps_loc',
                v_fav_url_txt: 'v_fav_url_txt',
                rate_pers_ausdauer_i: 'k_rate_ausdauer',
                rate_pers_bildung_i: 'k_rate_bildung',
                rate_pers_gesamt_i: 'v_rate',
                rate_pers_kraft_i: 'k_rate_kraft',
                rate_pers_mental_i: 'k_rate_mental',
                rate_pers_motive_i: 'v_rate_motive',
                rate_pers_schwierigkeit_i: 'k_rate_schwierigkeit',
                rate_pers_wichtigkeit_i: 'v_rate_wichtigkeit',
                gpstracks_basefile_s: 'k_gpstracks_basefile',
                keywords_txt: 'v_keywords',
                loc_lochirarchie_s: 'l_lochirarchietxt',
                loc_lochirarchie_ids_s: 'l_lochirarchieids',
                name_s: 'v_meta_name',
                persons_txt: 'v_persons',
                objects_txt: 'v_objects',
                playlists_txt: 'v_playlists',
                subtype_s: 'subtype',
                type_s: 'type'
            }
        },
        'route': {
            key: 'route',
            tableName: 'tour',
            selectFrom: 'tour LEFT JOIN location ON tour.l_id = location.l_id ',
            optionalGroupBy: [
                {
                    from: 'LEFT JOIN tour_keyword ON tour.t_id=tour_keyword.t_id ' +
                        'LEFT JOIN keyword ON tour_keyword.kw_id=keyword.kw_id',
                    triggerParams: ['id', 'keywords_txt', 'todoKeywords'],
                    groupByFields: ['GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS t_keywords']
                },
                {
                    from: 'LEFT JOIN kategorie_tour ON tour.t_id=kategorie_tour.t_id ' +
                        'LEFT JOIN kategorie kt ON kategorie_tour.k_id=kt.k_id ' +
                        'LEFT JOIN kategorie ON tour.t_id=kategorie.t_id',
                    triggerParams: ['id', 'track_id_i', 'track_id_is'],
                    groupByFields: ['GROUP_CONCAT(DISTINCT kategorie.k_id ORDER BY kategorie.k_id SEPARATOR ", ") AS t_k_ids',
                        'GROUP_CONCAT(DISTINCT kt.k_id ORDER BY kt.k_id SEPARATOR ", ") AS t_kt_ids']
                },
                {
                    from: 'LEFT JOIN destination dt ON dt.d_id in (MD5(CONCAT(tour.l_id, "_", tour.t_desc_gebiet, "_", tour.t_desc_ziel, "_", tour.t_typ)))',
                    triggerParams: ['destination_id_s', 'destination_id_ss'],
                    groupByFields: []
                },
                {
                    from: 'LEFT JOIN kategorie_tour kt_kt ON tour.t_id=kt_kt.t_id ' +
                        'LEFT JOIN kategorie kt_k ON kt_kt.k_id=kt_k.k_id ' +
                        'LEFT JOIN news kt_news ON kt_k.k_datevon >= kt_news.n_datevon AND kt_k.k_datevon <= kt_news.n_datebis ' +
                        'LEFT JOIN kategorie k_k ON tour.t_id=k_k.t_id ' +
                        'LEFT JOIN news k_news ON k_k.k_datevon >= k_news.n_datevon AND k_k.k_datevon <= k_news.n_datebis ',
                    triggerParams: ['news_id_i', 'news_id_is'],
                    groupByFields: ['kt_news.n_id', 'k_news.n_id']
                },
                {
                    from: 'LEFT JOIN kategorie_tour kt_kt ON tour.t_id=kt_kt.t_id ' +
                        'LEFT JOIN kategorie kt_k ON kt_kt.k_id=kt_k.k_id ' +
                        'LEFT JOIN trip kt_trip ON kt_k.k_datevon >= kt_trip.tr_datevon AND kt_k.k_datevon <= kt_trip.tr_datebis ' +
                        'LEFT JOIN kategorie k_k ON tour.t_id=k_k.t_id ' +
                        'LEFT JOIN trip k_trip ON k_k.k_datevon >= k_trip.tr_datevon AND k_k.k_datevon <= k_trip.tr_datebis ',
                    triggerParams: ['trip_id_i', 'trip_id_is'],
                    groupByFields: ['kt_trip.tr_id', 'k_trip.tr_id']
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
            groupbBySelectFieldListIgnore: ['t_keywords'],
            loadDetailData: [
                {
                    profile: 'image',
                    sql: 'SELECT CONCAT(image.i_dir, "/", image.i_file) AS i_fav_url_txt ' +
                        'FROM tour INNER JOIN kategorie on tour.k_id=kategorie.k_id' +
                        ' INNER JOIN image on kategorie.k_id=image.k_id ' +
                        ' INNER JOIN image_playlist ON image.i_id=image_playlist.i_id ' +
                        'WHERE tour.t_id IN (:id) and p_id in (18)',
                    parameterNames: ['id']
                },
                {
                    profile: 'keywords',
                    sql: 'select GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS keywords ' +
                        'FROM tour INNER JOIN tour_keyword ON tour.t_id=tour_keyword.t_id' +
                        ' INNER JOIN keyword on tour_keyword.kw_id=keyword.kw_id ' +
                        'WHERE tour.t_id IN (:id)',
                    parameterNames: ['id'],
                    modes: ['full']
                },
                {
                    profile: 'navigation_objects',
                    sql: '(SELECT CONCAT("navid=ROUTE_", t_id, ":::name=", COALESCE(t_name, "null"), ":::navtype=", "PREDECESSOR")' +
                        '  AS navigation_objects' +
                        '  FROM tour LEFT JOIN location ON tour.l_id = location.l_id' +
                        '  WHERE CONCAT(GetLocationNameAncestry(location.l_id, location.l_name, "->"), t_name) <' +
                        '      (SELECT CONCAT(GetLocationNameAncestry(location.l_id, location.l_name, "->"), t_name) FROM tour ' +
                        '       LEFT JOIN location ON tour.l_id = location.l_id WHERE t_id IN (:id))' +
                        '  ORDER BY CONCAT(GetLocationNameAncestry(location.l_id, location.l_name, "->"), t_name) DESC, t_id DESC LIMIT 1) ' +
                        'UNION ' +
                        ' (SELECT CONCAT("navid=ROUTE_", t_id, ":::name=", COALESCE(t_name, "null"), ":::navtype=", "SUCCESSOR")' +
                        '  AS navigation_objects' +
                        '  FROM tour LEFT JOIN location ON tour.l_id = location.l_id' +
                        '   WHERE CONCAT(GetLocationNameAncestry(location.l_id, location.l_name, "->"), t_name) >' +
                        '      (SELECT CONCAT(GetLocationNameAncestry(location.l_id, location.l_name, "->"), t_name) FROM tour' +
                        '       LEFT JOIN location ON tour.l_id = location.l_id WHERE t_id IN (:id))' +
                        '   ORDER BY CONCAT(GetLocationNameAncestry(location.l_id, location.l_name, "->"), t_name), t_id LIMIT 1)',
                    parameterNames: ['id'],
                    modes: ['details']
                }
            ],
            selectFieldList: [
                '"ROUTE" AS type',
                'CONCAT("ac_", tour.t_typ) AS actiontype',
                'CONCAT("ac_", tour.t_typ) AS subtype',
                'CONCAT("ROUTE", "_", tour.t_id) AS id',
                'tour.k_id',
                'tour.t_id',
                'tour.l_id',
                't_name',
                'CONCAT(t_name, " ", COALESCE(t_meta_shortdesc,""), " ", l_name) AS html',
                't_datevon AS t_date_show',
                't_datevon',
                'DATE_FORMAT(t_datevon, GET_FORMAT(DATE, "ISO")) AS dateonly',
                'WEEK(t_datevon) AS week',
                'MONTH(t_datevon) AS month',
                'YEAR(t_datevon) AS year',
                't_gpstracks_basefile',
                't_meta_shortdesc',
                't_meta_shortdesc AS t_meta_shortdesc_md',
                't_meta_shortdesc AS t_meta_shortdesc_html',
                'CAST(l_geo_latdeg AS CHAR(50)) AS t_gps_lat',
                'CAST(l_geo_longdeg AS CHAR(50)) AS t_gps_lon',
                'CONCAT(l_geo_latdeg, ",", l_geo_longdeg) AS t_gps_loc',
                'GetLocationNameAncestry(location.l_id, location.l_name, " -> ") AS l_lochirarchietxt',
                'GetLocationIdAncestry(location.l_id, ",") AS l_lochirarchieids',
                't_route_hm',
                't_ele_max',
                't_route_m',
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
                't_desc_talort',
                't_desc_ziel',
                't_gesperrt',
                'ROUND((t_route_hm / 500))*500 AS altAscFacet',
                'ROUND((t_ele_max / 500))*500 AS altMaxFacet',
                'ROUND((t_route_m / 5))*5 AS distFacet',
                't_route_dauer',
                'ROUND(ROUND(t_route_dauer * 2) / 2, 1) AS durFacet'],
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
                        ' FROM tour WHERE t_typ IS NULL or t_typ in (0)',
                    filterField: 'CONCAT("ac_", tour.t_typ)',
                    action: AdapterFilterActions.IN
                },
                'todoDesc': {
                    selectSql: 'SELECT COUNT(tour.t_id) AS count, "todoDesc" AS value,' +
                        ' "todoDesc" AS label, "true" AS id' +
                        ' FROM tour WHERE t_meta_shortdesc LIKE "TODODESC"',
                    filterField: 'tour.t_meta_shortdesc',
                    action: AdapterFilterActions.IN
                },
                'todoKeywords': {
                    selectSql: 'SELECT COUNT(tour.t_id) AS count, "todoKeywords" AS value,' +
                        ' "todoKeywords" AS label, "true" AS id' +
                        ' FROM tour INNER JOIN tour_keyword ON tour.t_id=tour_keyword.t_id' +
                        ' INNER JOIN keyword on tour_keyword.kw_id=keyword.kw_id ' +
                        'WHERE keyword.kw_name IN ("KW_TODOKEYWORDS")',
                    filterField: 'keyword.kw_name',
                    action: AdapterFilterActions.IN
                },
                'unrated': {
                    selectSql: 'SELECT COUNT(tour.t_id) AS count, "unrated" AS value,' +
                        ' "unrated" AS label, "true" AS id' +
                        ' FROM tour WHERE t_rate_gesamt IS NULL or t_rate_gesamt in (0)',
                    filterField: 'tour.t_rate_gesamt',
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
                    selectField: 'CONCAT("ac_", tour.t_typ)'
                },
                'blocked_is': {
                    selectField: 't_gesperrt'
                },
                'data_tech_alt_asc_facet_is': {
                    selectField: 'ROUND((t_route_hm / 500))*500',
                    orderBy: 'value asc'
                },
                'data_tech_alt_max_facet_is': {
                    selectField: 'ROUND((t_ele_max / 500))*500',
                    orderBy: 'value asc'
                },
                'data_tech_dist_facets_fs': {
                    selectField: 'ROUND((t_route_m / 5))*5',
                    orderBy: 'value asc'
                },
                'data_tech_dur_facet_fs': {
                    selectField: 'ROUND(ROUND(t_route_dauer * 2) / 2, 1)',
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
                    selectSql: 'SELECT COUNt(tour.l_id) AS count, GetTechName(l_name) AS value,' +
                        ' GetLocationNameAncestry(location.l_id, location.l_name, " -> ") AS label, location.l_id AS id' +
                        ' FROM location LEFT JOIN tour ON tour.l_id = location.l_id ' +
                        ' GROUP BY value, label, id' +
                        ' ORDER BY label ASC',
                    filterField: 'GetTechName(GetLocationNameAncestry(location.l_id, location.l_name, " -> "))',
                    action: AdapterFilterActions.LIKE
                },
                'month_is': {
                    selectField: 'MONTH(t_datevon)',
                    orderBy: 'value asc'
                },
                'news_id_i': {
                    filterFields: ['k_news.n_id', 'kt_news.n_id'],
                    action: AdapterFilterActions.IN_NUMBER
                },
                'news_id_is': {
                    filterFields: ['k_news.n_id', 'kt_news.n_id'],
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
                'subtype_ss': {
                    selectField: 'CONCAT("ac_", tour.t_typ)'
                },
                'track_id_i': {
                    filterFields: ['kategorie.k_id', 'kt.k_id'],
                    action: AdapterFilterActions.IN_NUMBER
                },
                'track_id_is': {
                    selectSql: 'SELECT COUNT(kategorie.k_id) AS count, kategorie.k_id AS value,' +
                        ' kategorie.k_name AS label, kategorie.k_id AS id' +
                        ' FROM kategorie INNER JOIN tour ON kategorie.t_id = tour.t_id ' +
                        ' GROUP BY value, label, id' +
                        ' ORDER BY label',
                    filterFields: ['kategorie.k_id', 'kt.k_id'],
                    action: AdapterFilterActions.IN_NUMBER
                },
                'trip_id_i': {
                    filterFields: ['k_trip.tr_id', 'kt_trip.tr_id'],
                    action: AdapterFilterActions.IN_NUMBER
                },
                'trip_id_is': {
                    filterFields: ['k_trip.tr_id', 'kt_trip.tr_id'],
                    action: AdapterFilterActions.IN_NUMBER
                },
                'type_txt': {
                    constValues: ['route', 'track', 'image', 'odimgobject', 'video', 'location', 'trip', 'news', 'destination'],
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
                }
            },
            sortMapping: {
                'date': 't_datevon DESC',
                'dateAsc': 't_datevon ASC',
                'distance': 'geodist ASC',
                'dataTechDurDesc': 't_route_dauer DESC',
                'dataTechAltDesc': 't_route_hm DESC',
                'dataTechMaxDesc': 't_ele_max DESC',
                'dataTechDistDesc': 't_route_m DESC',
                'dataTechDurAsc': 't_route_dauer ASC',
                'dataTechAltAsc': 't_route_hm ASC',
                'dataTechMaxAsc': 't_ele_max ASC',
                'dataTechDistAsc': 't_route_m ASC',
                'forExport': 'tour.t_id ASC',
                'ratePers': 't_rate_gesamt DESC, t_datevon DESC',
                'location': 'l_lochirarchietxt ASC',
                'relevance': 't_datevon DESC'
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
                noSubType: 'CONCAT("ac_", tour.t_typ)',
                todoDesc: '"todoDesc"',
                todoKeywords: 'keyword.kw_name',
                unrated: 'tour.t_rate_gesamt',
                unRatedChildren: '"unRatedChildren"',
                // common
                id: 'tour.t_id',
                destination_id_s: 'dt.d_id',
                destination_id_ss: 'dt.d_id',
                route_id_i: 'tour.t_id',
                route_id_is: 'tour.t_id',
                video_id_is: '"666dummy999"',
                video_id_i: '"666dummy999"',
                trip_id_is: '"666dummy999"',
                loc_id_i: 'tour.l_id',
                loc_id_is: 'tour.l_id',
                loc_lochirarchie_ids_txt: 'location.l_id',
                l_lochirarchietxt: 'location.l_name',
                html: 'CONCAT(t_name, " ", COALESCE(t_meta_shortdesc,""), " ", l_name)'
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
                'tour.t_key': ':key_s:',
                'tour.t_name': ':name_s:',
                'tour.t_typ': ':subtype_s:'
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
                data_info_guides_s: 't_desc_fuehrer',
                data_info_region_s: 't_desc_gebiet',
                data_info_baseloc_s: 't_desc_talort',
                data_info_destloc_s: 't_desc_ziel',
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
                keywords_txt: 't_keywords',
                loc_lochirarchie_s: 'l_lochirarchietxt',
                loc_lochirarchie_ids_s: 'l_lochirarchieids',
                name_s: 't_name',
                type_s: 'type',
                actiontype_s: 'actionType',
                subtype_s: 'subtype',
                i_fav_url_txt: 'i_fav_url_txt'
            }
        },
        'destination': {
            key: 'destination',
            tableName: 'destination',
            selectFrom: 'destination LEFT JOIN location ON destination.l_id = location.l_id ',
            optionalGroupBy: [
                {
                    from: 'LEFT JOIN tour dtour ON destination.d_id in (MD5(CONCAT(dtour.l_id, "_", dtour.t_desc_gebiet, "_", dtour.t_desc_ziel, "_", dtour.t_typ)))',
                    triggerParams: ['route_id_i', 'route_id_is'],
                    groupByFields: []
                },
                {
                    from:
                        'LEFT JOIN tour t ON destination.d_id in (MD5(CONCAT(t.l_id, "_", t.t_desc_gebiet, "_", t.t_desc_ziel, "_", t.t_typ))) ' +
                        'LEFT JOIN kategorie_tour kt ON kt.t_id=t.t_id ' +
                        'LEFT JOIN kategorie k ON k.k_id=kt.k_id OR k.t_id=t.t_id ',
                    triggerParams: ['track_id_i', 'track_id_is'],
                    groupByFields: []
                },
                {
                    from: 'LEFT JOIN tour ntour ON destination.d_id=MD5(CONCAT(ntour.l_id, "_", ntour.t_desc_gebiet, "_", ntour.t_desc_ziel, "_", ntour.t_typ)) ' +
                        'LEFT JOIN kategorie_tour kt_kt ON ntour.t_id=kt_kt.t_id ' +
                        'LEFT JOIN kategorie kt_k ON kt_kt.k_id=kt_k.k_id ' +
                        'LEFT JOIN news kt_news ON kt_k.k_datevon >= kt_news.n_datevon AND kt_k.k_datevon <= kt_news.n_datebis ' +
                        'LEFT JOIN kategorie k_k ON ntour.t_id=k_k.t_id ' +
                        'LEFT JOIN news k_news ON k_k.k_datevon >= k_news.n_datevon AND k_k.k_datevon <= k_news.n_datebis ',
                    triggerParams: ['news_id_i', 'news_id_is'],
                    groupByFields: ['kt_news.n_id', 'k_news.n_id']
                },
                {
                    from: 'LEFT JOIN tour trtour ON destination.d_id=MD5(CONCAT(trtour.l_id, "_", trtour.t_desc_gebiet, "_", trtour.t_desc_ziel, "_", trtour.t_typ)) ' +
                        'LEFT JOIN kategorie_tour kt_kt ON trtour.t_id=kt_kt.t_id ' +
                        'LEFT JOIN kategorie kt_k ON kt_kt.k_id=kt_k.k_id ' +
                        'LEFT JOIN trip kt_trip ON kt_k.k_datevon >= kt_trip.tr_datevon AND kt_k.k_datevon <= kt_trip.tr_datebis ' +
                        'LEFT JOIN kategorie k_k ON trtour.t_id=k_k.t_id ' +
                        'LEFT JOIN trip k_trip ON k_k.k_datevon >= k_trip.tr_datevon AND k_k.k_datevon <= k_trip.tr_datebis ',
                    triggerParams: ['trip_id_i', 'trip_id_is'],
                    groupByFields: ['kt_trip.tr_id', 'k_trip.tr_id']
                }
            ],
            groupbBySelectFieldListIgnore: ['t_keywords'],
            loadDetailData: [
                {
                    profile: 'image',
                    sql: 'SELECT CONCAT(image.i_dir, "/", image.i_file) AS i_fav_url_txt ' +
                        'FROM destination ' +
                        ' INNER JOIN tour ON destination.d_id=MD5(CONCAT(tour.l_id, "_", t_desc_gebiet, "_", t_desc_ziel, "_", t_typ)) ' +
                        ' INNER JOIN kategorie on tour.k_id=kategorie.k_id ' +
                        ' INNER JOIN image on kategorie.k_id=image.k_id ' +
                        ' INNER JOIN image_playlist ON image.i_id=image_playlist.i_id ' +
                        'WHERE destination.d_id IN (":id") and p_id in (18)',
                    parameterNames: ['id']
                },
                {
                    profile: 'keywords',
                    sql: 'select GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS keywords ' +
                        'FROM destination ' +
                        ' INNER JOIN tour ON destination.d_id=MD5(CONCAT(tour.l_id, "_", t_desc_gebiet, "_", t_desc_ziel, "_", t_typ)) ' +
                        ' INNER JOIN tour_keyword ON tour.t_id=tour_keyword.t_id' +
                        ' INNER JOIN keyword on tour_keyword.kw_id=keyword.kw_id ' +
                        'WHERE destination.d_id IN (":id")',
                    parameterNames: ['id'],
                    modes: ['full']
                }
            ],
            selectFieldList: [
                'DISTINCT "DESTINATION" AS type',
                'CONCAT("ac_", destination.d_typ) AS actiontype',
                'CONCAT("ac_", destination.d_typ) AS subtype',
                'CONCAT("DESTINATION", "_", destination.d_id) AS id',
                'destination.d_id',
                'destination.l_id',
                'd_name',
                'CONCAT(d_name, " ", l_name) AS html',
                'd_datevon AS d_date_show',
                'd_datevon',
                'DATE_FORMAT(d_datevon, GET_FORMAT(DATE, "ISO")) AS dateonly',
                'WEEK(d_datevon) AS week',
                'MONTH(d_datevon) AS month',
                'YEAR(d_datevon) AS year',
                'CAST(l_geo_latdeg AS CHAR(50)) AS d_gps_lat',
                'CAST(l_geo_longdeg AS CHAR(50)) AS d_gps_lon',
                'CONCAT(l_geo_latdeg, ",", l_geo_longdeg) AS d_gps_loc',
                'GetLocationNameAncestry(location.l_id, location.l_name, " -> ") AS l_lochirarchietxt',
                'GetLocationIdAncestry(location.l_id, ",") AS l_lochirarchieids',
                'd_route_hm',
                'd_ele_max',
                'd_route_m',
                'd_rate_ausdauer',
                'd_rate_bildung',
                'd_rate_gesamt',
                'd_rate_kraft',
                'd_rate_mental',
                'd_rate_motive',
                'd_rate_schwierigkeit',
                'd_rate_wichtigkeit',
                'd_rate',
                'd_rate_ks',
                'd_rate_firn',
                'd_rate_gletscher',
                'd_rate_klettern',
                'd_rate_bergtour',
                'd_rate_schneeschuh',
                'd_desc_gebiet',
                'd_desc_ziel',
                'ROUND((d_route_hm / 500))*500 AS altAscFacet',
                'ROUND((d_ele_max / 500))*500 AS altMaxFacet',
                'ROUND((d_route_m / 5))*5 AS distFacet',
                'd_route_dauer',
                'ROUND(ROUND(d_route_dauer * 2) / 2, 1) AS durFacet'],
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
                    filterField: 'CONCAT("DESTINATION", "_", destination.d_id)',
                    action: AdapterFilterActions.NOTIN
                },
                'actiontype_ss': {
                    selectField: 'CONCAT("ac_", destination.d_typ)'
                },
                'blocked_is': {
                    noFacet: true
                },
                'data_tech_alt_asc_facet_is': {
                    selectField: 'ROUND((d_route_hm / 500))*500',
                    orderBy: 'value asc'
                },
                'data_tech_alt_max_facet_is': {
                    selectField: 'ROUND((d_ele_max / 500))*500',
                    orderBy: 'value asc'
                },
                'data_tech_dist_facets_fs': {
                    selectField: 'ROUND((d_route_m / 5))*5',
                    orderBy: 'value asc'
                },
                'data_tech_dur_facet_fs': {
                    selectField: 'ROUND(ROUND(d_route_dauer * 2) / 2, 1)',
                    orderBy: 'value asc'
                },
                'data_info_region_s': {
                    selectField: 'destination.d_desc_gebiet',
                    orderBy: 'value asc'
                },
                'done_ss': {
                    selectField: 'CONCAT("DONE", (d_datevon IS NOT NULL))',
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
                    selectSql: 'SELECT COUNT(destination.l_id) AS count, GetTechName(l_name) AS value,' +
                        ' GetLocationNameAncestry(location.l_id, location.l_name, " -> ") AS label, location.l_id AS id' +
                        ' FROM location LEFT JOIN destination ON destination.l_id = location.l_id ' +
                        ' GROUP BY value, label, id' +
                        ' ORDER BY label ASC',
                    filterField: 'GetTechName(GetLocationNameAncestry(location.l_id, location.l_name, " -> "))',
                    action: AdapterFilterActions.LIKE
                },
                'month_is': {
                    selectField: 'MONTH(d_datevon)',
                    orderBy: 'value asc'
                },
                'news_id_i': {
                    filterFields: ['k_news.n_id', 'kt_news.n_id'],
                    action: AdapterFilterActions.IN_NUMBER
                },
                'news_id_is': {
                    filterFields: ['k_news.n_id', 'kt_news.n_id'],
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
                    selectField: 'd_rate_gesamt',
                    orderBy: 'value asc'
                },
                'rate_pers_schwierigkeit_is': {
                    selectField: 'd_rate_schwierigkeit',
                    orderBy: 'value asc'
                },
                'rate_tech_klettern_ss': {
                    selectField: 'd_rate_klettern',
                    orderBy: 'value asc'
                },
                'rate_tech_ks_ss': {
                    selectField: 'd_rate_ks',
                    orderBy: 'value asc'
                },
                'rate_tech_schneeschuh_ss': {
                    selectField: 'd_rate_schneeschuh',
                    orderBy: 'value asc'
                },
                'rate_tech_overall_ss': {
                    selectField: 'd_rate',
                    orderBy: 'value asc'
                },
                'subtype_ss': {
                    selectField: 'd_typ',
                    orderBy: 'value asc'
                },
                'trip_id_i': {
                    filterFields: ['k_trip.tr_id', 'kt_trip.tr_id'],
                    action: AdapterFilterActions.IN_NUMBER
                },
                'trip_id_is': {
                    filterFields: ['k_trip.tr_id', 'kt_trip.tr_id'],
                    action: AdapterFilterActions.IN_NUMBER
                },
                'type_txt': {
                    constValues: ['route', 'track', 'image', 'odimgobject', 'video', 'location', 'trip', 'news', 'destination'],
                    filterField: '"destination"',
                    selectLimit: 1
                },
                'week_is': {
                    selectField: 'WEEK(d_datevon)',
                    orderBy: 'value asc'
                },
                'year_is': {
                    selectField: 'YEAR(d_datevon)',
                    orderBy: 'value asc'
                }
            },
            sortMapping: {
                'date': 'd_datevon DESC',
                'dateAsc': 'd_datevon ASC',
                'distance': 'geodist ASC',
                'dataTechDurDesc': 'd_route_dauer DESC',
                'dataTechAltDesc': 'd_route_hm DESC',
                'dataTechMaxDesc': 'd_ele_max DESC',
                'dataTechDistDesc': 'd_route_m DESC',
                'dataTechDurAsc': 'd_route_dauer ASC',
                'dataTechAltAsc': 'd_route_hm ASC',
                'dataTechMaxAsc': 'd_ele_max ASC',
                'dataTechDistAsc': 'd_route_m ASC',
                'forExport': 'destination.d_id ASC',
                'ratePers': 'd_rate_gesamt DESC, d_datevon DESC',
                'location': 'l_lochirarchietxt ASC',
                'relevance': 'd_datevon DESC'
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
                noLocation: '"666dummy999"',
                noRoute: '"666dummy999"',
                noSubType: '"666dummy999"',
                todoDesc: '"666dummy999"',
                todoKeywords: '"666dummy999"',
                unrated: '"666dummy999"',
                unRatedChildren: '"666dummy999"',
                // common
                id: 'destination.d_id',
                route_id_i: 'dtour.t_id',
                route_id_is: 'dtour.t_id',
                track_id_i: 'k.k_id',
                track_id_is: 'k.k_id',
                video_id_is: '"666dummy999"',
                video_id_i: '"666dummy999"',
                trip_id_is: '"666dummy999"',
                loc_id_i: 'destination.l_id',
                loc_id_is: 'destination.l_id',
                loc_lochirarchie_ids_txt: 'location.l_id',
                l_lochirarchietxt: 'location.l_name',
                html: 'CONCAT(d_name, " ", COALESCE(d_meta_shortdesc,""), " ", l_name)'
            },
            writeMapping: {
            },
            fieldMapping: {
                id: 'id',
                destination_id_s: 'd_id',
                destination_id_ss: 'd_id',
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
                dateshow_dt: 'd_dateshow',
                datestart_dt: 'd_datevon',
                dateend_dt: 'd_datebis',
                distance: 'geodist',
                geo_lon_s: 'd_gps_lon',
                geo_lat_s: 'd_gps_lat',
                geo_loc_p: 'd_gps_loc',
                data_tech_alt_asc_i: 'd_route_hm',
                data_tech_alt_desc_i: 'altDesc',
                data_tech_alt_min_i: 'altMin',
                data_tech_alt_max_i: 'd_ele_max',
                data_tech_dist_f: 'd_route_m',
                data_tech_dur_f: 'd_route_dauer',
                data_info_guides_s: 'd_desc_fuehrer',
                data_info_region_s: 'd_desc_gebiet',
                data_info_baseloc_s: 'd_desc_talort',
                data_info_destloc_s: 'd_desc_ziel',
                rate_pers_ausdauer_i: 'd_rate_ausdauer',
                rate_pers_bildung_i: 'd_rate_bildung',
                rate_pers_gesamt_i: 'd_rate_gesamt',
                rate_pers_kraft_i: 'd_rate_kraft',
                rate_pers_mental_i: 'd_rate_mental',
                rate_pers_motive_i: 'd_rate_motive',
                rate_pers_schwierigkeit_i: 'd_rate_schwierigkeit',
                rate_pers_wichtigkeit_i: 'd_rate_wichtigkeit',
                rate_tech_overall_s: 'd_rate',
                rate_tech_ks_s: 'd_rate_ks',
                rate_tech_firn_s: 'd_rate_firn',
                rate_tech_gletscher_s: 'd_rate_gletscher',
                rate_tech_klettern_s: 'd_rate_klettern',
                rate_tech_bergtour_s: 'd_rate_bergtour',
                rate_tech_schneeschuh_s: 'd_rate_schneeschuh',
                keywords_txt: 't_keywords',
                loc_lochirarchie_s: 'l_lochirarchietxt',
                loc_lochirarchie_ids_s: 'l_lochirarchieids',
                name_s: 'd_name',
                type_s: 'type',
                actiontype_s: 'actionType',
                subtype_s: 'subtype',
                i_fav_url_txt: 'i_fav_url_txt'
            }
        },
        'location': {
            key: 'location',
            tableName: 'location',
            selectFrom: 'location ',
            optionalGroupBy: [
                {
                    from: 'LEFT JOIN location_keyword ON location.l_id=location_keyword.l_id ' +
                        'LEFT JOIN keyword ON location_keyword.kw_id=keyword.kw_id',
                    triggerParams: ['id', 'keywords_txt', 'todoKeywords'],
                    groupByFields: ['GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS l_keywords']
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
                    groupByFields: ['l_geo_area']
                }
            ],
            groupbBySelectFieldListIgnore: ['l_keywords'],
            loadDetailData: [
                {
                    profile: 'image',
                    sql: 'SELECT CONCAT(image.i_dir, "/", image.i_file) AS i_fav_url_txt ' +
                        'FROM location INNER JOIN kategorie on location.l_id=kategorie.l_id' +
                        ' INNER JOIN image on kategorie.k_id=image.k_id ' +
                        'WHERE location.l_id IN (:id) order by i_rate desc limit 0, 1',
                    parameterNames: ['id']
                },
                {
                    profile: 'keywords',
                    sql: 'select GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS keywords ' +
                        'FROM location INNER JOIN location_keyword ON location.l_id=location_keyword.l_id' +
                        ' INNER JOIN keyword on location_keyword.kw_id=keyword.kw_id ' +
                        'WHERE location.l_id IN (:id)',
                    parameterNames: ['id'],
                    modes: ['full']
                },
                {
                    profile: 'navigation_objects',
                    sql: '(SELECT CONCAT("navid=LOCATION_", l_id, ":::name=", COALESCE(l_name, "null"), ":::navtype=", "PREDECESSOR")' +
                        '  AS navigation_objects, GetLocationNameAncestry(location.l_id, location.l_name, "->") as l_lochirarchietxt' +
                        '  FROM location WHERE GetLocationNameAncestry(location.l_id, location.l_name, "->") <' +
                        '      (SELECT GetLocationNameAncestry(location.l_id, location.l_name, "->") FROM location WHERE l_id IN (:id))' +
                        '  ORDER BY l_lochirarchietxt DESC, l_id DESC LIMIT 1) ' +
                        'UNION ' +
                        ' (SELECT CONCAT("navid=LOCATION_", l_id, ":::name=", COALESCE(l_name, "null"), ":::navtype=", "SUCCESSOR")' +
                        '  AS navigation_objects, GetLocationNameAncestry(location.l_id, location.l_name, "->") AS l_lochirarchietxt' +
                        '  FROM location WHERE GetLocationNameAncestry(location.l_id, location.l_name, "->") >' +
                        '      (SELECT GetLocationNameAncestry(location.l_id, location.l_name, "->") FROM location WHERE l_id IN (:id))' +
                        '  ORDER BY l_lochirarchietxt, l_id LIMIT 1)',
                    parameterNames: ['id'],
                    modes: ['details']
                }
            ],
            selectFieldList: [
                '"LOCATION" AS type',
                'location.l_typ',
                'CONCAT("loc_", l_typ) AS subtype',
                'CONCAT("LOCATION", "_", location.l_id) AS id',
                'location.l_id',
                'l_parent_id',
                'l_name',
                'CONCAT(l_name, " ", COALESCE(l_meta_shortdesc,"")) AS html',
                'l_gesperrt',
                'l_meta_shortdesc',
                'l_meta_shortdesc AS l_meta_shortdesc_md',
                'l_meta_shortdesc AS l_meta_shortdesc_html',
                'CAST(l_geo_latdeg AS CHAR(50)) AS l_geo_latdeg',
                'CAST(l_geo_longdeg AS CHAR(50)) AS l_geo_longdeg',
                'CONCAT(l_geo_latdeg, ",", l_geo_longdeg) AS l_gps_loc',
                'GetLocationNameAncestry(location.l_id, location.l_name, " -> ") AS l_lochirarchietxt',
                'GetLocationIdAncestry(location.l_id, ",") AS l_lochirarchieids'],
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
                        ' FROM location WHERE l_typ IS NULL or l_typ in (0)',
                    filterField: 'CONCAT("ac_", location.l_typ)',
                    action: AdapterFilterActions.IN
                },
                'todoDesc': {
                    selectSql: 'SELECT COUNT(location.l_id) AS count, "todoDesc" AS value,' +
                        ' "todoDesc" AS label, "true" AS id' +
                        ' FROM location WHERE l_meta_shortdesc LIKE "TODODESC"',
                    filterField: 'location.l_meta_shortdesc',
                    action: AdapterFilterActions.IN
                },
                'todoKeywords': {
                    selectSql: 'SELECT COUNT(location.l_id) AS count, "todoKeywords" AS value,' +
                        ' "todoKeywords" AS label, "true" AS id' +
                        ' FROM location INNER JOIN location_keyword ON location.l_id=location_keyword.l_id' +
                        ' INNER JOIN keyword on location_keyword.kw_id=keyword.kw_id ' +
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
                    selectField: 'CONCAT("ac_", location.l_typ)'
                },
                'blocked_is': {
                    selectField: 'l_gesperrt'
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
                'done_ss': {
                    noFacet: true
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
                },
                'loc_lochirarchie_txt': {
                    selectSql: 'SELECT COUNT(*) AS count, GetTechName(l_name) AS value,' +
                        ' GetLocationNameAncestry(location.l_id, location.l_name, " -> ") AS label, l_id AS id' +
                        ' FROM location' +
                        ' GROUP BY value, label, id' +
                        ' ORDER BY label ASC',
                    filterField: 'GetTechName(GetLocationNameAncestry(location.l_id, location.l_name, " -> "))',
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
                'subtype_ss': {
                    noFacet: true
                },
                'type_txt': {
                    constValues: ['location', 'track', 'route', 'trip', 'image', 'odimgobject', 'video', 'news', 'destination'],
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
                'distance': 'geodist ASC',
                'forExport': 'l_typ ASC, l_parent_id ASC, l_id ASC',
                'location': 'l_lochirarchietxt ASC',
                'relevance': 'l_name ASC'
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
                noFavoriteChildren: '"666dummy999"',
                noMainFavoriteChildren: '"666dummy999"',
                noCoordinates: '"noCoordinates"',
                noLocation: 'location.l_parent_id',
                noRoute: '"666dummy999"',
                noSubType: '"666dummy999"',
                todoDesc: '"todoDesc"',
                todoKeywords: 'keyword.kw_name',
                unrated: '"666dummy999"',
                unRatedChildren: '"666dummy999"',
                // common
                id: 'location.l_id',
                loc_id_i: 'location.l_id',
                loc_id_is: 'location.l_id',
                loc_parent_id_i: 'l_parent_id',
                trip_id_is: '"666dummy999"',
                html: 'CONCAT(l_name, " ", COALESCE(l_meta_shortdesc,""))'
            },
            writeMapping: {
                'location.l_meta_shortdesc': ':desc_txt:',
                'location.l_parent_id': ':loc_id_parent_i:',
                // 'location.l_meta_shortdesc_md': ':desc_md_txt:',
                // 'location.l_meta_shortdesc_html': ':desc_html_txt:',
                'location.l_gesperrt': ':blocked_i:',
                'location.l_geo_longdeg': ':geo_lon_s:',
                'location.l_geo_latdeg': ':geo_lat_s:',
                'location.l_geo_poly': ':geo_loc_p:',
                'location.l_geo_area': ':gpstrack_src_s:',
                'location.l_key': ':key_s:',
                'location.l_name': ':name_s:',
                'location.l_typ': ':subtype_s:'
            },
            fieldMapping: {
                id: 'id',
                loc_id_i: 'l_id',
                loc_id_is: 'l_id',
                loc_id_parent_i: 'l_parent_id',
                desc_txt: 'l_meta_shortdesc',
                desc_md_txt: 'l_meta_shortdesc_md',
                desc_html_txt: 'l_meta_shortdesc_html',
                blocked_i: 'l_gesperrt',
                distance: 'geodist',
                geo_lon_s: 'l_geo_longdeg',
                geo_lat_s: 'l_geo_latdeg',
                geo_loc_p: 'l_gps_loc',
                gpstrack_src_s: 'l_geo_area',
                keywords_txt: 'l_keywords',
                loc_lochirarchie_s: 'l_lochirarchietxt',
                loc_lochirarchie_ids_s: 'l_lochirarchieids',
                name_s: 'l_name',
                type_s: 'type',
                subtype_s: 'subtype'
            }
        },
        'trip': {
            key: 'trip',
            tableName: 'trip',
            selectFrom: 'trip LEFT JOIN kategorie ON kategorie.tr_id = trip.tr_id' +
                ' LEFT JOIN location ON location.l_id = trip.l_id',
            optionalGroupBy: [
                {
                    from: 'LEFT JOIN kategorie_keyword ON kategorie.k_id=kategorie_keyword.k_id ' +
                        'LEFT JOIN keyword ON kategorie_keyword.kw_id=keyword.kw_id',
                    triggerParams: ['id', 'keywords_txt'],
                    groupByFields: ['GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS tr_keywords']
                },
                {
                    from: 'LEFT JOIN kategorie_tour ON kategorie.k_id=kategorie_tour.k_id ' +
                        'LEFT JOIN tour kt ON kategorie_tour.t_id=kt.t_id ' +
                        'LEFT JOIN tour kt2 ON kategorie.t_id=kt2.t_id ' +
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
                    from: 'INNER JOIN (SELECT tr_id AS id FROM trip WHERE ' + TourDocSqlUtils.generateDoubletteNameSql('tr_name') +
                        '              IN (SELECT DISTINCT ' + TourDocSqlUtils.generateDoubletteNameSql('tr_name') + ' AS name' +
                        '                  FROM trip GROUP BY name HAVING COUNT(*) > 1)' +
                        '             ) doublettes' +
                        '             ON trip.tr_id=doublettes.id',
                    triggerParams: ['doublettes'],
                    groupByFields: []
                }
            ],
            groupbBySelectFieldList: true,
            groupbBySelectFieldListIgnore: ['tr_keywords', 'k_altitude_asc_sum', 'k_altitude_desc_sum', 'k_distance_sum',
                'k_altitude_min', 'k_altitude_max'
            ],
            loadDetailData: [
                {
                    profile: 'image',
                    sql: 'SELECT CONCAT(image.i_dir, "/", image.i_file) AS i_fav_url_txt ' +
                        'FROM trip INNER JOIN kategorie on trip.tr_id=kategorie.tr_id' +
                        ' INNER JOIN image on kategorie.k_id=image.k_id ' +
                        'WHERE trip.tr_id IN (:id) order by i_rate desc limit 0, 1',
                    parameterNames: ['id']
                },
                {
                    profile: 'navigation_objects',
                    sql: '(SELECT CONCAT("navid=TRIP_", tr_id, ":::name=", COALESCE(tr_name, "null"), ":::navtype=", "PREDECESSOR")' +
                        '  AS navigation_objects' +
                        '  FROM trip WHERE tr_datevon < (SELECT tr_datevon FROM trip WHERE tr_id IN (:id))' +
                        '  ORDER BY tr_datevon DESC, tr_id DESC LIMIT 1) ' +
                        'UNION ' +
                        ' (SELECT CONCAT("navid=TRIP_", tr_id, ":::name=", COALESCE(tr_name, "null"), ":::navtype=", "SUCCESSOR")' +
                        '  AS navigation_objects' +
                        '  FROM trip WHERE tr_datevon > (SELECT tr_datevon FROM trip WHERE tr_id IN (:id))' +
                        '   ORDER BY tr_datevon, tr_id LIMIT 1)',
                    parameterNames: ['id'],
                    modes: ['details']
                }
            ],
            selectFieldList: [
                '"TRIP" AS type',
                'CONCAT("TRIP", "_", trip.tr_id) AS id',
                'trip.tr_id',
                'trip.l_id',
                'trip.tr_name',
                'CONCAT(tr_name, " ", COALESCE(tr_meta_shortdesc,"")) AS html',
                'CAST(l_geo_latdeg AS CHAR(50)) AS tr_gps_lat',
                'CAST(l_geo_longdeg AS CHAR(50)) AS tr_gps_lon',
                'CONCAT(l_geo_latdeg, ",", l_geo_longdeg) AS tr_gps_loc',
                'GetLocationNameAncestry(location.l_id, location.l_name, " -> ") AS l_lochirarchietxt',
                'GetLocationIdAncestry(location.l_id, ",") AS l_lochirarchieids',
                'tr_datevon AS tr_dateshow',
                'tr_datevon',
                'tr_datebis',
                'DATE_FORMAT(tr_datevon, GET_FORMAT(DATE, "ISO")) AS dateonly',
                'WEEK(tr_datevon) AS week',
                'MONTH(tr_datevon) AS month',
                'YEAR(tr_datevon) AS year',
                'tr_gesperrt',
                'SUM(k_altitude_asc) AS k_altitude_asc_sum',
                'SUM(k_altitude_desc) AS k_altitude_desc_sum',
                'MIN(k_altitude_min) AS k_altitude_min',
                'MAX(k_altitude_max) AS k_altitude_max',
                'SUM(k_distance) AS k_distance_sum',
                'tr_meta_shortdesc',
                'tr_meta_shortdesc AS tr_meta_shortdesc_md',
                'tr_meta_shortdesc AS tr_meta_shortdesc_html'],
            facetConfigs: {
                // dashboard
                'doublettes': {
                    selectSql: 'SELECT COUNT(trip.tr_id) AS count, "doublettes" AS value,' +
                        ' "doublettes" AS label, "true" AS id' +
                        ' FROM trip INNER JOIN (SELECT tr_id AS id FROM trip WHERE ' + TourDocSqlUtils.generateDoubletteNameSql('tr_name') +
                        '              IN (SELECT DISTINCT ' + TourDocSqlUtils.generateDoubletteNameSql('tr_name') + ' AS name' +
                        '                  FROM trip GROUP BY name HAVING COUNT(*) > 1)' +
                        '             ) doublettes' +
                        '             ON trip.tr_id=doublettes.id',
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
                    selectSql: 'SELECT COUNT(trip.tr_id) AS count, "loc_no_parentr_id_is" AS value,' +
                        ' "loc_no_parentr_id_is" AS label, "true" AS id' +
                        ' FROM trip WHERE l_id IS NULL OR l_id IN (0,1 )',
                    filterField: 'trip.l_id',
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
                    selectSql: 'SELECT COUNT(trip.tr_id) AS count, "todoDesc" AS value,' +
                        ' "todoDesc" AS label, "true" AS id' +
                        ' FROM trip WHERE tr_meta_shortdesc LIKE "TODODESC"',
                    filterField: 'trip.tr_meta_shortdesc',
                    action: AdapterFilterActions.IN
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
                    filterField: 'CONCAT("TRIP", "_", trip.tr_id)',
                    action: AdapterFilterActions.NOTIN
                },
                'actiontype_ss': {
                    noFacet: true
                },
                'blocked_is': {
                    selectField: 'tr_gesperrt'
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
                'done_ss': {
                    selectField: 'CONCAT("DONE", (tr_datevon IS NOT NULL))',
                    orderBy: 'value asc'
                },
                'keywords_txt': {
                    noFacet: true
                },
                'loc_id_i': {
                    noFacet: true
                },
                'loc_lochirarchie_txt': {
                    selectSql: 'SELECT COUNt(trip.l_id) AS count, GetTechName(l_name) AS value,' +
                        ' GetLocationNameAncestry(location.l_id, location.l_name, " -> ") AS label, location.l_id AS id' +
                        ' FROM location LEFT JOIN trip ON trip.l_id = location.l_id ' +
                        ' GROUP BY value, label, id' +
                        ' ORDER BY label ASC',
                    filterField: 'GetTechName(GetLocationNameAncestry(location.l_id, location.l_name, " -> "))',
                    action: AdapterFilterActions.LIKE
                },
                'month_is': {
                    selectField: 'MONTH(tr_datevon)'
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
                    noFacet: true
                },
                'rate_pers_schwierigkeit_is': {
                    noFacet: true
                },
                'rate_tech_overall_ss': {
                    noFacet: true
                },
                'subtype_ss': {
                    noFacet: true
                },
                'type_txt': {
                    constValues: ['trip', 'location', 'track', 'route', 'image', 'odimgobject', 'video', 'news', 'destination'],
                    filterField: '"trip"',
                    selectLimit: 1
                },
                'week_is': {
                    selectField: 'WEEK(tr_datevon)'
                },
                'year_is': {
                    selectField: 'YEAR(tr_datevon)'
                }
            },
            sortMapping: {
                'date': 'tr_datevon DESC',
                'dateAsc': 'tr_datevon ASC',
                'forExport': 'tr_datevon ASC',
                'location': 'l_lochirarchietxt ASC',
                'relevance': 'tr_datevon DESC'
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
                noLocation: 'trip.l_id',
                noRoute: '"666dummy999"',
                noSubType: '"666dummy999"',
                todoDesc: '"todoDesc"',
                todoKeywords: 'keyword.kw_name',
                unrated: '"666dummy999"',
                unRatedChildren: '"666dummy999"',
                // common
                id: 'trip.tr_id',
                destination_id_s: 'dt.d_id',
                destination_id_ss: 'dt.d_id',
                trip_id_i: 'trip.tr_id',
                trip_id_is: 'trip.tr_id',
                video_id_is: '"666dummy999"',
                video_id_i: '"666dummy999"',
                image_id_is: '"666dummy999"',
                image_id_i: '"666dummy999"',
                track_id_is: '"666dummy999"',
                track_id_i: '"666dummy999"',
                route_id_is: '"666dummy999"',
                loc_id_i: 'trip.l_id',
                loc_id_is: 'trip.l_id',
                loc_lochirarchie_ids_txt: 'location.l_id',
                l_lochirarchietxt: 'location.l_name',
                html: 'CONCAT(tr_name, " ", COALESCE(tr_meta_shortdesc,""))'
            },
            writeMapping: {
                'trip.l_id': ':loc_id_i:',
                'trip.tr_datevon': ':datestart_dt:',
                'trip.tr_datebis': ':dateend_dt:',
                'trip.tr_meta_shortdesc': ':desc_txt:',
                'trip.tr_gesperrt': ':blocked_i:',
//                'trip.tr_meta_shortdesc_md': ':desc_md_txt:',
//                'trip.tr_meta_shortdesc_html': ':desc_html_txt:',
                'trip.tr_name': ':name_s:'
            },
            fieldMapping: {
                id: 'id',
                trip_id_i: 'tr_id',
                trip_id_is: 'tr_id',
                loc_id_i: 'l_id',
                loc_id_is: 'l_id',
                loc_lochirarchie_s: 'l_lochirarchietxt',
                loc_lochirarchie_ids_s: 'l_lochirarchieids',
                geo_lon_s: 'tr_gps_lon',
                geo_lat_s: 'tr_gps_lat',
                geo_loc_p: 'tr_gps_loc',
                data_tech_alt_asc_i: 'k_altitude_asc_sum',
                data_tech_alt_desc_i: 'k_altitude_desc_sum',
                data_tech_alt_min_i: 'k_altitude_min',
                data_tech_alt_max_i: 'k_altitude_max',
                data_tech_dist_f: 'k_distance_sum',
                data_tech_dur_f: 'dur',
                dateshow_dt: 'tr_dateshow',
                datestart_dt: 'tr_datevon',
                dateend_dt: 'tr_datebis',
                blocked_i: 'tr_gesperrt',
                desc_txt: 'tr_meta_shortdesc',
                desc_md_txt: 'tr_meta_shortdesc_md',
                desc_html_txt: 'tr_meta_shortdesc_html',
                keywords_txt: 'tr_keywords',
                name_s: 'tr_name',
                type_s: 'type'
            }
        },
        'news': {
            key: 'news',
            tableName: 'news',
            selectFrom: 'news',
            optionalGroupBy: [
                {
                    from: 'INNER JOIN (SELECT n_id AS id FROM news WHERE ' + TourDocSqlUtils.generateDoubletteNameSql('n_headline') +
                        '              IN (SELECT DISTINCT ' + TourDocSqlUtils.generateDoubletteNameSql('n_headline') + ' AS name' +
                        '                  FROM news GROUP BY name HAVING COUNT(*) > 1)' +
                        '             ) doublettes' +
                        '             ON news.n_id=doublettes.id',
                    triggerParams: ['doublettes'],
                    groupByFields: []
                }
            ],
            loadDetailData: [
                {
                    profile: 'image',
                    sql: 'SELECT CONCAT(image.i_dir, "/", image.i_file) AS i_fav_url_txt ' +
                        'FROM news' +
                        ' INNER JOIN kategorie on (kategorie.k_datevon >= news.n_datevon AND kategorie.k_datevon <= news.n_datebis)' +
                        ' INNER JOIN image on kategorie.k_id=image.k_id ' +
                        'WHERE news.n_id IN (:id) order by i_rate desc limit 0, 1',
                    parameterNames: ['id']
                },
                {
                    profile: 'navigation_objects',
                    sql: '(SELECT CONCAT("navid=NEWS_", n_id, ":::name=", COALESCE(n_headline, "null"), ":::navtype=", "PREDECESSOR")' +
                        '  AS navigation_objects' +
                        '  FROM news WHERE n_datevon < (SELECT n_datevon FROM news WHERE n_id IN (:id))' +
                        '  ORDER BY n_datevon DESC, n_id DESC LIMIT 1) ' +
                        'UNION ' +
                        ' (SELECT CONCAT("navid=NEWS_", n_id, ":::name=", COALESCE(n_headline, "null"), ":::navtype=", "SUCCESSOR")' +
                        '  AS navigation_objects' +
                        '  FROM news WHERE n_datevon > (SELECT n_datevon FROM news WHERE n_id IN (:id))' +
                        '   ORDER BY n_datevon, n_id LIMIT 1)',
                    parameterNames: ['id'],
                    modes: ['details']
                }
            ],
            selectFieldList: [
                '"NEWS" AS type',
                'CONCAT("NEWS", "_", news.n_id) AS id',
                'news.n_id',
                'n_headline',
                'CONCAT(n_headline, " ", COALESCE(n_message,"")) AS html',
                'n_date',
                'n_datevon',
                'n_datebis',
                'DATE_FORMAT(n_date, GET_FORMAT(DATE, "ISO")) AS dateonly',
                'WEEK(n_date) AS week',
                'MONTH(n_date) AS month',
                'YEAR(n_date) AS year',
                'n_gesperrt',
                'n_message',
                'n_message AS n_message_md',
                'n_message AS n_message_html'],
            facetConfigs: {
                // dashboard
                'doublettes': {
                    selectSql: 'SELECT COUNT(news.n_id) AS count, "doublettes" AS value,' +
                        ' "doublettes" AS label, "true" AS id' +
                        ' FROM news INNER JOIN (SELECT n_id AS id FROM news WHERE ' + TourDocSqlUtils.generateDoubletteNameSql('n_headline') +
                        '              IN (SELECT DISTINCT ' + TourDocSqlUtils.generateDoubletteNameSql('n_headline') + ' AS name' +
                        '                  FROM news GROUP BY name HAVING COUNT(*) > 1)' +
                        '             ) doublettes' +
                        '             ON news.n_id=doublettes.id',
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
                    selectSql: 'SELECT COUNT(news.n_id) AS count, "todoDesc" AS value,' +
                        ' "todoDesc" AS label, "true" AS id' +
                        ' FROM news WHERE n_message LIKE "TODODESC"',
                    filterField: 'news.n_message',
                    action: AdapterFilterActions.IN
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
                    filterField: 'CONCAT("NEWS", "_", news.n_id)',
                    action: AdapterFilterActions.NOTIN
                },
                'actiontype_ss': {
                    noFacet: true
                },
                'blocked_is': {
                    selectField: 'n_gesperrt'
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
                'done_ss': {
                    selectField: 'CONCAT("DONE", (n_date IS NOT NULL))',
                    orderBy: 'value asc'
                },
                'keywords_txt': {
                    noFacet: true
                },
                'loc_id_i': {
                    noFacet: true
                },
                'loc_lochirarchie_txt': {
                    noFacet: true
                },
                'month_is': {
                    selectField: 'MONTH(n_date)'
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
                    noFacet: true
                },
                'rate_pers_schwierigkeit_is': {
                    noFacet: true
                },
                'rate_tech_overall_ss': {
                    noFacet: true
                },
                'subtype_ss': {
                    noFacet: true
                },
                'type_txt': {
                    constValues: ['trip', 'location', 'track', 'route', 'image', 'odimgobject', 'video', 'news', 'destination'],
                    filterField: '"news"',
                    selectLimit: 1
                },
                'week_is': {
                    selectField: 'WEEK(n_date)'
                },
                'year_is': {
                    selectField: 'YEAR(n_date)'
                }
            },
            sortMapping: {
                'date': 'n_date DESC',
                'dateAsc': 'n_date ASC',
                'forExport': 'n_date ASC',
                'relevance': 'n_date DESC'
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
                todoKeywords: 'keyword.kw_name',
                unrated: '"666dummy999"',
                unRatedChildren: '"666dummy999"',
                // common
                id: 'news.n_id',
                news_id_i: 'news.n_id',
                news_id_is: 'news.n_id',
                image_id_i: '"666dummy999"',
                image_id_is: '"666dummy999"',
                video_id_is: '"666dummy999"',
                video_id_i: '"666dummy999"',
                track_id_i: '"666dummy999"',
                track_id_is: '"666dummy999"',
                trip_id_i: '"666dummy999"',
                trip_id_is: '"666dummy999"',
                route_id_i: '"666dummy999"',
                route_id_is: '"666dummy999"',
                loc_lochirarchie_ids_txt: '"666dummy999"',
                l_lochirarchietxt: 'location.l_name',
                html: 'CONCAT(n_headline, " ", COALESCE(n_message,""))'
            },
            writeMapping: {
                'news.n_date': ':dateshow_dt:',
                'news.n_datevon': ':datestart_dt:',
                'news.n_datebis': ':dateend_dt:',
                'news.n_gesperrt': ':blocked_i:',
                'news.n_message': ':desc_txt:',
                'news.n_message_md': ':desc_md_txt:',
                'news.n_message_html': ':desc_html_txt:',
                'news.n_keywords': ':keywords_txt:',
                'news.n_headline': ':name_s:'
            },
            fieldMapping: {
                id: 'id',
                news_id_i: 'n_id',
                news_id_is: 'n_id',
                dateshow_dt: 'n_date',
                datestart_dt: 'n_datevon',
                dateend_dt: 'n_datebis',
                blocked_i: 'n_gesperrt',
                desc_txt: 'n_message',
                desc_md_txt: 'n_message_md',
                desc_html_txt: 'n_message_html',
                keywords_txt: 'n_keywords',
                name_s: 'n_headline',
                type_s: 'type'
            }
        }
    };

    public static readonly keywordModelConfigType: KeywordModelConfigType = {
        table: 'keyword',
        fieldId: 'kw_id',
        fieldName: 'kw_name',
        joins: {
            'image': {
                table: 'image', joinTable: 'image_keyword', fieldReference: 'i_id'
            },
            'video': {
                table: 'video', joinTable: 'video_keyword', fieldReference: 'v_id'
            },
            'track': {
                table: 'kategorie', joinTable: 'kategorie_keyword', fieldReference: 'k_id'
            },
            'route': {
                table: 'tour', joinTable: 'tour_keyword', fieldReference: 't_id'
            },
            'location': {
                table: 'location', joinTable: 'location_keyword', fieldReference: 'l_id'
            }
        }
    };

    public static readonly playlistModelConfigType: PlaylistModelConfigType = {
        table: 'playlist',
        fieldId: 'p_id',
        fieldName: 'p_name',
        joins: {
            'image': {
                table: 'image', joinTable: 'image_playlist', fieldReference: 'i_id'
            },
            'video': {
                table: 'video', joinTable: 'video_playlist', fieldReference: 'v_id'
            }
        }
    };

    public static readonly rateModelConfigType: RateModelConfigType = {
        tables: {
            'image': {
                fieldId: 'i_id',
                table: 'image',
                rateFields: {
                    'gesamt': 'i_rate',
                    'motive': 'i_rate_motive',
                    'wichtigkeit': 'i_rate_wichtigkeit'
                },
                fieldSum: 'i_rate'
            },
            'video': {
                fieldId: 'v_id',
                table: 'video',
                rateFields: {
                    'gesamt': 'v_rate',
                    'motive': 'v_rate_motive',
                    'wichtigkeit': 'v_rate_wichtigkeit'
                },
                fieldSum: 'v_rate'
            }
        }
    };

    public static readonly objectDetectionModelConfigType: ObjectDetectionModelConfigType = {
        objectTable: {
            fieldCategory: 'o_category',
            fieldId: 'o_id',
            fieldKey: 'o_key',
            fieldName: 'o_name',
            fieldPicasaKey: 'o_picasa_key',
            table: 'objects'
        },
        objectKeyTable: {
            fieldDetector: 'ok_detector',
            fieldId: 'o_id',
            fieldKey: 'ok_key',
            table: 'objects_key'
        },
        detectionTables: {
            'image': {
                entityType: 'image',
                table: 'image',
                id: undefined,
                baseTable: 'image',
                baseFieldId: 'i_id',
                baseFieldFileDir: 'i_dir',
                baseFieldFileName: 'i_file',
                baseFieldFilePath: 'CONCAT(i_dir, "/", i_file)',
                detectedTable: 'image_object',
                detectedFieldDetector: 'io_detector',
                detectedFieldPrecision: 'io_precision',
                detectedFieldState: 'io_state',
                detectedFieldKey: 'io_obj_type',
                detailFieldNames: ['io_obj_type', 'io_img_width', 'io_img_height',
                    'io_obj_x1', 'io_obj_y1', 'io_obj_width', 'io_obj_height',
                    'io_precision']
            },
            'video': {
                entityType: 'video',
                table: 'video',
                id: undefined,
                baseTable: 'video',
                baseFieldId: 'v_id',
                baseFieldFileDir: 'v_dir',
                baseFieldFileName: 'v_file',
                baseFieldFilePath: 'CONCAT(v_dir, "/", v_file)',
                detectedTable: 'video_object',
                detectedFieldDetector: 'vo_detector',
                detectedFieldPrecision: 'vo_precision',
                detectedFieldState: 'vo_state',
                detectedFieldKey: 'vo_obj_type',
                detailFieldNames: ['vo_obj_type', 'vo_img_width', 'vo_img_height',
                    'vo_obj_x1', 'vo_obj_y1', 'vo_obj_width', 'vo_obj_height',
                    'vo_precision']
            }
        },
        detectedObjectsTables: {
            'odimgobject': {
                fieldDetector: 'io_detector',
                fieldId: 'io_id',
                fieldPrecision: 'io_precision',
                fieldState: 'io_state',
                table: 'image_object',
                fieldKey: 'io_obj_type'
            }
        }
    };

    public static readonly actionTagAssignConfig: ActionTagAssignConfigType = {
        tables: {
            'image': {
                table: 'image',
                idField: 'i_id',
                references: {
                    'track_id_is': {
                        table: 'kategorie', idField: 'k_id', referenceField: 'k_id'
                    },
                    'loc_lochirarchie_txt': {
                        table: 'location', idField: 'l_id', referenceField: 'l_id'
                    }
                }
            },
            'video': {
                table: 'video',
                idField: 'v_id',
                references: {
                    'track_id_is': {
                        table: 'kategorie', idField: 'k_id', referenceField: 'k_id'
                    },
                    'loc_lochirarchie_txt': {
                        table: 'location', idField: 'l_id', referenceField: 'l_id'
                    }
                }
            },
            'track': {
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
            },
            'route': {
                table: 'tour',
                idField: 't_id',
                references: {
                    'loc_lochirarchie_txt': {
                        table: 'location', idField: 'l_id', referenceField: 'l_id'
                    }
                }
            },
            'news': {
                table: 'news',
                idField: 'n_id',
                references: {
                    'loc_lochirarchie_txt': {
                        table: 'location', idField: 'l_id', referenceField: 'l_id'
                    }
                }
            },
            'trip': {
                table: 'trip',
                idField: 'tr_id',
                references: {
                    'loc_lochirarchie_txt': {
                        table: 'location', idField: 'l_id', referenceField: 'l_id'
                    }
                }
            }
        }
    };

    public static readonly actionTagBlockConfig: ActionTagBlockConfigType = {
        tables: {
            'image': {
                table: 'image', idField: 'i_id', blockField: 'i_gesperrt'
            },
            'video': {
                table: 'video', idField: 'v_id', blockField: 'v_gesperrt'
            },
            'track': {
                table: 'kategorie', idField: 'k_id', blockField: 'k_gesperrt'
            },
            'route': {
                table: 'tour', idField: 't_id', blockField: 't_gesperrt'
            },
            'location': {
                table: 'location', idField: 'l_id', blockField: 'l_gesperrt'
            },
            'trip': {
                table: 'trip', idField: 'tr_id', blockField: 'tr_gesperrt'
            },
            'news': {
                table: 'news', idField: 'n_id', blockField: 'n_gesperrt'
            }
        }
    };

    public static readonly actionTagReplaceConfig: ActionTagReplaceConfigType = {
        tables: {
            'image': {
                table: 'image',
                fieldId: 'i_id',
                referenced: [],
                joins: [
                    { table: 'image_object', fieldReference: 'i_id' },
                    { table: 'image_playlist', fieldReference: 'i_id' },
                    { table: 'image_keyword', fieldReference: 'i_id' }
                ]
            },
            'video': {
                table: 'video',
                fieldId: 'v_id',
                referenced: [],
                joins: [
                    { table: 'video_object', fieldReference: 'v_id' },
                    { table: 'video_playlist', fieldReference: 'v_id' },
                    { table: 'video_keyword', fieldReference: 'v_id' }
                ]
            },
            'track': {
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
            },
            'route': {
                table: 'tour',
                fieldId: 't_id',
                referenced: [
                    { table: 'kategorie', fieldReference: 't_id' },
                ],
                joins: [
                    { table: 'kategorie_tour', fieldReference: 't_id' },
                    { table: 'tour_keyword', fieldReference: 't_id' }
                ]
            },
            'location': {
                table: 'location',
                fieldId: 'l_id',
                referenced: [
                    { table: 'image', fieldReference: 'l_id' },
                    { table: 'kategorie', fieldReference: 'l_id' },
                    { table: 'location', fieldReference: 'l_parent_id' },
                    { table: 'tour', fieldReference: 'l_id' },
                    { table: 'trip', fieldReference: 'l_id' },
                    { table: 'video', fieldReference: 'l_id' }
                ],
                joins: []
            },
            'news': {
                table: 'news',
                fieldId: 'n_id',
                referenced: [],
                joins: []
            },
            'trip': {
                table: 'trip',
                fieldId: 'tr_id',
                referenced: [
                    { table: 'kategorie', fieldReference: 'tr_id' }
                ],
                joins: []
            }
        }
    };

    public getTableConfigForTableKey(table: string): TableConfig {
        return TourDocSqlMytbDbConfig.tableConfigs[table];
    }

    public getKeywordModelConfigFor(): KeywordModelConfigType {
        return TourDocSqlMytbDbConfig.keywordModelConfigType;
    }

    public getObjectDetectionModelConfigFor(): ObjectDetectionModelConfigType {
        return TourDocSqlMytbDbConfig.objectDetectionModelConfigType;
    }

    public getPlaylistModelConfigFor(): PlaylistModelConfigType {
        return TourDocSqlMytbDbConfig.playlistModelConfigType;
    }

    public getRateModelConfigFor(): RateModelConfigType {
        return TourDocSqlMytbDbConfig.rateModelConfigType;
    }

    public getActionTagAssignConfig(): ActionTagAssignConfigType {
        return TourDocSqlMytbDbConfig.actionTagAssignConfig;
    }

    public getActionTagBlockConfig(): ActionTagBlockConfigType {
        return TourDocSqlMytbDbConfig.actionTagBlockConfig;
    }

    public getActionTagReplaceConfig(): ActionTagReplaceConfigType {
        return TourDocSqlMytbDbConfig.actionTagReplaceConfig;
    }
}

