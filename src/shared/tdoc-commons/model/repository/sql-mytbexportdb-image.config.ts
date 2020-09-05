import {TableConfig} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {AdapterFilterActions} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';

export class SqlMytbExportDbImageConfig {
    public static readonly tableConfig: TableConfig = {
        key: 'image',
        tableName: 'image',
        selectFrom: 'image INNER JOIN kategorie_full ON kategorie_full.k_id=image.k_id ' +
            'LEFT JOIN location ON location.l_id = kategorie_full.l_id',
        loadDetailData: [
            {
                profile: 'navigation_objects',
                sql: '(SELECT CONCAT("navid=IMAGE_", i_id, ":::name=", COALESCE(i_katname, "null"), ":::navtype=", "PREDECESSOR")' +
                    '  AS navigation_objects' +
                    '  FROM image WHERE i_date < (SELECT i_date FROM image WHERE i_id IN (:id))' +
                    '   ORDER BY i_date DESC, i_id DESC LIMIT 1) ' +
                    'UNION ' +
                    ' (SELECT CONCAT("navid=IMAGE_", i_id, ":::name=", COALESCE(i_katname, "null"), ":::navtype=", "SUCCESSOR")' +
                    '  AS navigation_objects' +
                    '  FROM image WHERE i_date > (SELECT i_date FROM image WHERE i_id IN (:id))' +
                    '   ORDER BY i_date, i_id LIMIT 1)',
                parameterNames: ['id'],
                modes: ['details']
            }
        ],
        selectFieldList: [
            '"IMAGE" AS type',
            'CONCAT("ac_", kategorie_full.k_type) AS actiontype',
            'CONCAT("ac_", kategorie_full.k_type) AS subtype',
            'CONCAT("IMAGE", "_", image.i_id) AS id',
            'image.i_id',
            'image.k_id',
            'kategorie_full.d_id',
            'kategorie_full.k_d_ids',
            'kategorie_full.t_id',
            'kategorie_full.k_t_ids',
            'kategorie_full.tr_id',
            'kategorie_full.l_id',
            'n_id',
            'i_katname',
            'k_html',
            'CONCAT(i_katname, " ", i_keywords, " ", l_lochirarchietxt) AS html',
            'k_dateshow',
            'i_date',
            'DATE_FORMAT(i_date, GET_FORMAT(DATE, "ISO")) AS dateonly',
            'WEEK(i_date) AS week',
            'MONTH(i_date) AS month',
            'YEAR(i_date) AS year',
            'k_gpstracks_basefile',
            'i_keywords',
            'k_meta_shortdesc',
            'k_meta_shortdesc_md',
            'k_meta_shortdesc_html',
            'i_rate',
            'CAST(i_gps_lat AS CHAR(50)) AS i_gps_lat',
            'CAST(i_gps_lon AS CHAR(50)) AS i_gps_lon',
            'CONCAT(i_gps_lat, ",", i_gps_lon) AS i_gps_loc',
            'l_lochirarchietxt',
            'l_lochirarchieids',
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
            // common
            'id_notin_is': {
                filterField: 'CONCAT("IMAGE", "_", image.i_id)',
                action: AdapterFilterActions.NOTIN
            },
            'actiontype_ss': {
                selectField: 'CONCAT("ac_", kategorie_full.k_type)',
                selectFrom: 'image INNER join kategorie_full ON kategorie_full.k_id=image.k_id'
            },
            'data_tech_alt_asc_facet_is': {
                selectField: 'ROUND((k_altitude_asc / 500))*500',
                selectFrom: 'image INNER JOIN kategorie_full ON kategorie_full.k_id=image.k_id',
                orderBy: 'value asc'
            },
            'data_tech_alt_max_facet_is': {
                selectField: 'ROUND((i_gps_ele / 500))*500',
                orderBy: 'value asc'
            },
            'data_tech_dist_facets_fs': {
                selectField: 'ROUND((k_distance / 5))*5',
                selectFrom: 'image INNER JOIN kategorie_full ON kategorie_full.k_id=image.k_id',
                orderBy: 'value asc'
            },
            'data_tech_dur_facet_fs': {
                selectField: 'ROUND(ROUND(TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 * 2) / 2, 1)',
                selectFrom: 'image INNER JOIN kategorie_full ON kategorie_full.k_id=image.k_id',
                orderBy: 'value asc'
            },
            'done_ss': {
                selectField: 'CONCAT("DONE", (i_date IS NOT NULL))',
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
                filterField: 'i_keywords',
                action: AdapterFilterActions.LIKEIN
                /**
                 selectSql: 'SELECT 0 AS count, ' +
                 '  SUBSTRING_INDEX(SUBSTRING_INDEX(image.i_keywords, ",", numbers.n), ",", -1) AS value ' +
                 ' FROM' +
                 '  (SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL' +
                 '   SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL' +
                 '   SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL ' +
                 '   SELECT 14 UNION ALL SELECT 15 UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL' +
                 '   SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20) ' +
                 '  numbers INNER JOIN image ON ' +
                 '   CHAR_LENGTH(image.i_keywords) - CHAR_LENGTH(REPLACE(image.i_keywords, ",", "")) >= numbers.n - 1' +
                 '  GROUP BY count, value' +
                 '  ORDER BY value',
                 filterField: 'i_keywords',
                 action: AdapterFilterActions.LIKEIN
                 **/
            },
            'loc_id_i': {
                noFacet: true
            },
            'loc_lochirarchie_txt': {
                selectSql: 'SELECT COUNT(*) AS count, GetTechName(l_name) AS value, REPLACE(l_lochirarchietxt, ",,", " -> ") AS label' +
                    ' FROM location LEFT JOIN kategorie_full ON location.l_id = kategorie_full.l_id ' +
                    ' LEFT JOIN image ON kategorie_full.k_id=image.k_id ' +
                    ' GROUP BY value, label' +
                    ' ORDER BY count DESC, label ASC',
                filterField: 'GetTechName(l_name)',
                action: AdapterFilterActions.IN
            },
            'month_is': {
                selectField: 'MONTH(i_date)',
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
                selectField: 'i_rate',
                orderBy: 'value asc'
            },
            'rate_pers_schwierigkeit_is': {
                selectField: 'k_rate_schwierigkeit',
                selectFrom: 'image INNER JOIN kategorie_full ON kategorie_full.k_id=image.k_id',
                orderBy: 'value asc'
            },
            'rate_tech_overall_ss': {
                noFacet: true
            },
            'subtype_ss': {
                selectField: 'CONCAT("ac_", kategorie_full.k_type)',
                selectFrom: 'image INNER JOIN kategorie_full ON kategorie_full.k_id=image.k_id',
                orderBy: 'value asc'
            },
            'type_txt': {
                constValues: ['image', 'video', 'track', 'route', 'location', 'trip', 'news', 'destination'],
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
            'date': 'i_date DESC',
            'dateAsc': 'i_date ASC',
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
            id: 'image.i_id',
            destination_id_s: 'kategorie_full.d_id',
            destination_id_ss: 'kategorie_full.d_id',
            image_id_i: 'image.i_id',
            image_id_is: 'image.i_id',
            video_id_is: '"666dummy999"',
            video_id_i: '"666dummy999"',
            route_id_i: 'kategorie_full.t_id',
            route_id_is: 'kategorie_full.t_id',
            track_id_i: 'image.k_id',
            track_id_is: 'image.k_id',
            loc_lochirarchie_ids_txt: 'location.l_id',
            l_lochirarchietxt: 'location.l_name',
            odstates_ss: '"666dummy999"',
            odprecision_is: '"666dummy999"',
            odcats_txt: '"666dummy999"',
            odkeys_txt: '"666dummy999"',
            oddetectors_txt: '"666dummy999"',
            html: 'CONCAT(i_katname, " ", i_keywords, " ", l_lochirarchietxt)'
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
            dateshow_dt: 'i_date',
            html_txt: 'k_html',
            desc_txt: 'k_meta_shortdesc',
            desc_md_txt: 'k_meta_shortdesc_md',
            desc_html_txt: 'k_meta_shortdesc_html',
            distance: 'geodist',
            geo_lon_s: 'i_gps_lon',
            geo_lat_s: 'i_gps_lat',
            geo_loc_p: 'i_gps_loc',
            data_tech_alt_asc_i: 'k_altitude_asc',
            data_tech_alt_desc_i: 'k_altitude_desc',
            data_tech_alt_min_i: 'i_gps_ele',
            data_tech_alt_max_i: 'i_gps_ele',
            data_tech_dist_f: 'k_distance',
            data_tech_dur_f: 'dur',
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
            name_s: 'i_katname',
            type_s: 'type',
            actiontype_s: 'actionType',
            subtype_s: 'subtype',
            i_fav_url_txt: 'i_fav_url_txt'
        }
    };
}

