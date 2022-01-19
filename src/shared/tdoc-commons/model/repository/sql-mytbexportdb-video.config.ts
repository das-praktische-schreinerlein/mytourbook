import {TableConfig} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {AdapterFilterActions} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';

export class SqlMytbExportDbVideoConfig {
    public static readonly tableConfig: TableConfig = {
        key: 'video',
        tableName: 'video',
        selectFrom: 'video INNER JOIN kategorie_full ON kategorie_full.k_id=video.k_id ' +
            'LEFT JOIN location ON location.l_id = kategorie_full.l_id',
        loadDetailData: [
            {
                profile: 'navigation_objects',
                sql: '(SELECT CONCAT("navid=VIDEO_", v_id, ":::name=", COALESCE(v_katname, "null"), ":::navtype=", "PREDECESSOR")' +
                    '  AS navigation_objects' +
                    '  FROM video WHERE v_date < (SELECT v_date FROM video WHERE v_id IN (:id))' +
                    '   ORDER BY v_date DESC, v_id DESC LIMIT 1) ' +
                    'UNION ' +
                    ' (SELECT CONCAT("navid=VIDEO_", v_id, ":::name=", COALESCE(v_katname, "null"), ":::navtype=", "SUCCESSOR")' +
                    '  AS navigation_objects' +
                    '  FROM video WHERE v_date > (SELECT v_date FROM video WHERE v_id IN (:id))' +
                    '   ORDER BY v_date, v_id LIMIT 1)',
                parameterNames: ['id'],
                modes: ['details']
            }
        ],
        selectFieldList: [
            '"VIDEO" AS type',
            'CONCAT("ac_", kategorie_full.k_type) AS actiontype',
            'CONCAT("ac_", kategorie_full.k_type) AS subtype',
            'CONCAT("VIDEO", "_", video.v_id) AS id',
            'video.v_id',
            'video.k_id',
            'kategorie_full.d_id',
            'kategorie_full.k_d_ids',
            'kategorie_full.t_id',
            'kategorie_full.k_t_ids',
            'kategorie_full.tr_id',
            'kategorie_full.l_id',
            'n_id',
            'v_katname',
            'k_html',
            'CONCAT(v_katname, " ", v_keywords, " ", l_lochirarchietxt) AS html',
            'k_dateshow',
            'v_date',
            'DATE_FORMAT(v_date, GET_FORMAT(DATE, "ISO")) AS dateonly',
            'WEEK(v_date) AS week',
            'MONTH(v_date) AS month',
            'YEAR(v_date) AS year',
            'k_gpstracks_basefile',
            'v_keywords',
            'k_meta_shortdesc',
            'k_meta_shortdesc_md',
            'k_meta_shortdesc_html',
            'v_rate',
            'CAST(v_gps_lat AS CHAR(50)) AS v_gps_lat',
            'CAST(v_gps_lon AS CHAR(50)) AS v_gps_lon',
            'CONCAT(v_gps_lat, ",", v_gps_lon) AS v_gps_loc',
            'l_lochirarchietxt',
            'l_lochirarchieids',
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
// common
            'id_notin_is': {
                filterField: 'CONCAT("VIDEO", "_", video.v_id)',
                action: AdapterFilterActions.NOTIN
            },
            'actiontype_ss': {
                selectField: 'CONCAT("ac_", kategorie_full.k_type)',
                selectFrom: 'video INNER join kategorie_full ON kategorie_full.k_id=video.k_id'
            },
            'data_tech_alt_asc_facet_is': {
                selectField: 'ROUND((k_altitude_asc / 500))*500',
                selectFrom: 'video INNER JOIN kategorie_full ON kategorie_full.k_id=video.k_id',
                orderBy: 'value asc'
            },
            'data_tech_alt_max_facet_is': {
                selectField: 'ROUND((v_gps_ele / 500))*500',
                orderBy: 'value asc'
            },
            'data_tech_dist_facets_fs': {
                selectField: 'ROUND((k_distance / 5))*5',
                selectFrom: 'video INNER JOIN kategorie_full ON kategorie_full.k_id=video.k_id',
                orderBy: 'value asc'
            },
            'data_tech_dur_facet_fs': {
                selectField: 'ROUND(ROUND(TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 * 2) / 2, 1)',
                selectFrom: 'video INNER JOIN kategorie_full ON kategorie_full.k_id=video.k_id',
                orderBy: 'value asc'
            },
            'done_ss': {
                selectField: 'CONCAT("DONE", (v_date IS NOT NULL))',
                orderBy: 'value asc'
            },
            'keywords_txt': {
                // use only kat-keywords because of performance-issues
                selectSql: 'SELECT 0 AS count, ' +
                    '  SUBSTRING_INDEX(SUBSTRING_INDEX(kategorie_full.k_keywords, ",", numbers.n), ",", -1) AS value ' +
                    'FROM' +
                    ' (SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL' +
                    '  SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL' +
                    '  SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL ' +
                    '  SELECT 14 UNION ALL SELECT 15 UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL' +
                    '  SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20) ' +
                    '  numbers INNER JOIN kategorie_full ON ' +
                    '  CHAR_LENGTH(kategorie_full.k_keywords) - CHAR_LENGTH(REPLACE(kategorie_full.k_keywords, ",", "")) >= numbers.n - 1' +
                    ' GROUP BY count, value' +
                    ' ORDER BY value',
                filterField: 'v_keywords',
                action: AdapterFilterActions.LIKEIN
                /**
                 selectSql: 'SELECT 0 AS count, ' +
                 '  SUBSTRING_INDEX(SUBSTRING_INDEX(video.v_keywords, ",", numbers.n), ",", -1) AS value ' +
                 ' FROM' +
                 '  (SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL' +
                 '   SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL' +
                 '   SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL ' +
                 '   SELECT 14 UNION ALL SELECT 15 UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL' +
                 '   SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20) ' +
                 '  numbers INNER JOIN video ON ' +
                 '   CHAR_LENGTH(video.v_keywords) - CHAR_LENGTH(REPLACE(video.v_keywords, ",", "")) >= numbers.n - 1' +
                 '  GROUP BY count, value' +
                 '  ORDER BY value',
                 filterField: 'v_keywords',
                 action: AdapterFilterActions.LIKEIN
                 **/
            },
            'loc_id_i': {
                noFacet: true
            },
            'loc_lochirarchie_txt': {
                selectSql: 'SELECT COUNT(*) AS count, GetTechName(l_name) AS value, REPLACE(l_lochirarchietxt, ",,", " -> ") AS label' +
                    ' FROM location LEFT JOIN kategorie_full ON location.l_id = kategorie_full.l_id ' +
                    ' LEFT JOIN video ON kategorie_full.k_id=video.k_id ' +
                    ' GROUP BY value, label' +
                    ' ORDER BY count DESC, label ASC',
                filterField: 'GetTechName(l_name)',
                action: AdapterFilterActions.IN
            },
            'month_is': {
                selectField: 'MONTH(v_date)',
                orderBy: 'value asc'
            },
            'news_id_i': {
                filterFields: ['kategorie_full.n_id'],
                action: AdapterFilterActions.IN_NUMBER
            },
            'news_id_is': {
                filterFields: ['kategorie_full.n_id'],
                action: AdapterFilterActions.IN_NUMBER
            },
            'objects_txt': {
                noFacet: true
            },
            'persons_txt': {
                noFacet: true
            },
            'playlists_txt': {
                noFacet: true
            },
            'rate_pers_gesamt_is': {
                selectField: 'v_rate',
                orderBy: 'value asc'
            },
            'rate_pers_schwierigkeit_is': {
                selectField: 'k_rate_schwierigkeit',
                selectFrom: 'video INNER JOIN kategorie_full ON kategorie_full.k_id=video.k_id',
                orderBy: 'value asc'
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
                selectField: 'CONCAT("ac_", kategorie_full.k_type)',
                selectFrom: 'video INNER JOIN kategorie_full ON kategorie_full.k_id=video.k_id',
                orderBy: 'value asc'
            },
            'type_txt': {
                constValues: ['video', 'track', 'route', 'location', 'trip', 'news', 'destination'],
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
            'date': 'v_date DESC',
            'dateAsc': 'v_date ASC',
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
            'location': 'l_lochirarchietxt ASC, v_date ASC',
            'locationDetails': 'l_lochirarchietxt ASC, v_date ASC',
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
            doublettes: '"666dummy999"',
            conflictingRates: '"666dummy999"',
            noCoordinates: '"666dummy999"',
            noFavoriteChildren: '"666dummy999"',
            noLocation: '"666dummy999"',
            noMainFavoriteChildren: '"666dummy999"',
            noRoute: '"666dummy999"',
            noSubType: '"666dummy999"',
            todoDesc: '"666dummy999"',
            todoKeywords: '"666dummy999"',
            unrated: '"666dummy999"',
            unRatedChildren: '"666dummy999"',
            // common
            id: 'video.v_id',
            video_id_i: 'video.v_id',
            video_id_is: 'video.v_id',
            image_id_is: '"666dummy999"',
            image_id_i: '"666dummy999"',
            destination_id_s: 'kategorie_full.d_id',
            destination_id_ss: 'kategorie_full.d_id',
            route_id_i: 'kategorie_full.t_id',
            route_id_is: 'kategorie_full.t_id',
            track_id_i: 'video.k_id',
            track_id_is: 'video.k_id',
            loc_lochirarchie_ids_txt: 'location.l_id',
            l_lochirarchietxt: 'location.l_name',
            odstates_ss: '"666dummy999"',
            odprecision_is: '"666dummy999"',
            odcats_txt: '"666dummy999"',
            odkeys_txt: '"666dummy999"',
            oddetectors_txt: '"666dummy999"',
            html: 'CONCAT(v_katname, " ", v_keywords, " ", l_lochirarchietxt)'
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
            dateshow_dt: 'v_date',
            html_txt: 'k_html',
            desc_txt: 'k_meta_shortdesc',
            desc_md_txt: 'k_meta_shortdesc_md',
            desc_html_txt: 'k_meta_shortdesc_html',
            distance: 'geodist',
            geo_lon_s: 'v_gps_lon',
            geo_lat_s: 'v_gps_lat',
            geo_loc_p: 'v_gps_loc',
            data_tech_alt_asc_i: 'k_altitude_asc',
            data_tech_alt_desc_i: 'k_altitude_desc',
            data_tech_alt_min_i: 'v_gps_ele',
            data_tech_alt_max_i: 'v_gps_ele',
            data_tech_dist_f: 'k_distance',
            data_tech_dur_f: 'dur',
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
            name_s: 'v_katname',
            type_s: 'type',
            actiontype_s: 'actionType',
            subtype_s: 'subtype',
            v_fav_url_txt: 'v_fav_url_txt'
        }
    };
}

