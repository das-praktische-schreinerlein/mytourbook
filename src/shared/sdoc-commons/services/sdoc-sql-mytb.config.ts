import {TableConfig} from '../../search-commons/services/sql-query.builder';
import {AdapterFilterActions} from '../../search-commons/services/mapper.utils';

export class SDocSqlMytbConfig {
    public static tableConfigs = {
        'track': {
            key: 'track',
            tableName: 'kategorie_full',
            selectFrom: 'kategorie_full LEFT JOIN location ON location.l_id = kategorie_full.l_id ' +
                        'LEFT JOIN image ON kategorie_full.i_id=image.i_id',
            selectFieldList: [
                '"TRACK" AS type',
                'CONCAT("ac_", kategorie_full.k_type) AS actiontype',
                'CONCAT("ac_", kategorie_full.k_type) AS subtype',
                'CONCAT("TRACK", "_", kategorie_full.k_id) AS id',
                'kategorie_full.i_id',
                'kategorie_full.k_id',
                'kategorie_full.t_id',
                'kategorie_full.k_t_ids',
                'kategorie_full.tr_id',
                'kategorie_full.l_id',
                'n_id',
                'k_name',
                'k_html',
                'CONCAT(k_html, " ", k_name, " ", k_keywords, " ", k_meta_shortdesc_md, " ", l_lochirarchietxt) AS html',
                'k_dateshow',
                'k_datevon',
                'k_datebis',
                'DATE_FORMAT(k_datevon, GET_FORMAT(DATE, "ISO")) AS dateonly',
                'WEEK(k_datevon) AS week',
                'MONTH(k_datevon) AS month',
                'YEAR(k_datevon) AS year',
                'k_gpstracks_basefile',
                'k_keywords',
                'k_meta_shortdesc',
                'k_meta_shortdesc_md',
                'k_meta_shortdesc_html',
                'CAST(k_gps_lat AS CHAR(50)) AS k_gps_lat',
                'CAST(k_gps_lon AS CHAR(50)) AS k_gps_lon',
                'CONCAT(k_gps_lat, ",", k_gps_lon) AS k_gps_loc',
                'l_lochirarchietxt',
                'l_lochirarchieids',
                'CONCAT(image.i_dir, "/", image.i_file) AS i_fav_url_txt',
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
                'actiontype_ss': {
                    selectField: 'CONCAT("ac_", kategorie_full.k_type)'
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
                'keywords_txt': {
                    selectSql: 'SELECT 0 AS count, ' +
                    '  SUBSTRING_INDEX(SUBSTRING_INDEX(kategorie_full.k_keywords, ",", numbers.n), ",", -1) AS value ' +
                    'FROM' +
                    ' (SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL' +
                    '  SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL' +
                    '  SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL ' +
                    '  SELECT 14 UNION ALL SELECT 15 UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL' +
                    '  SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20) ' +
                    ' numbers INNER JOIN kategorie_full ON ' +
                    '  CHAR_LENGTH(kategorie_full.k_keywords) - CHAR_LENGTH(REPLACE(kategorie_full.k_keywords, ",", "")) >= numbers.n - 1' +
                    ' GROUP BY count, value' +
                    ' ORDER BY value',
                    filterField: 'k_keywords',
                    action: AdapterFilterActions.LIKEIN
                },
                'loc_id_i': {
                    noFacet: true
                },
                'loc_lochirarchie_txt': {
                    selectSql: 'SELECT COUNT(*) AS count, l_name AS value, l_lochirarchietxt AS label' +
                    ' FROM kategorie_full INNER JOIN location ON kategorie_full.l_id = location.l_id ' +
                    ' GROUP BY value, label' +
                    ' ORDER BY count DESC',
                    filterField: 'l_lochirarchietxt',
                    action: AdapterFilterActions.LIKEIN
                },
                'month_is': {
                    selectField: 'MONTH(k_datevon)',
                    orderBy: 'value asc'
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
                    selectField: 'CONCAT("ac_", kategorie_full.k_type)'
                },
                'route_id_i': {
                    filterFields: ['kategorie_full.k_t_ids'],
                    action: AdapterFilterActions.IN_CSV
                },
                'route_id_is': {
                    selectSql: 'SELECT COUNT(kategorie_full.t_id) AS count, tour.t_id AS value,' +
                    ' tour.t_name AS label, tour.t_id AS id' +
                    ' FROM tour LEFT JOIN kategorie_full ON kategorie_full.t_id = tour.t_id ' +
                    ' GROUP BY value, label, id' +
                    ' ORDER BY label',
                    filterFields: ['kategorie_full.k_t_ids'],
                    action: AdapterFilterActions.IN_CSV
                },
                'trip_id_is': {
                    selectSql: 'SELECT COUNT(kategorie_full.tr_id) AS count, trip.tr_id AS value,' +
                    ' trip.tr_name AS label, trip.tr_id AS id' +
                    ' FROM trip LEFT JOIN kategorie_full ON kategorie_full.tr_id = trip.tr_id ' +
                    ' GROUP BY value, label, id' +
                    ' ORDER BY label',
                    filterField: 'tr_id',
                    action: AdapterFilterActions.IN_NUMBER
                },
                'type_txt': {
                    constValues: ['track', 'route', 'image', 'location', 'trip', 'news'],
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
                'ratePers': 'k_rate_gesamt DESC',
                'location': 'l_lochirarchietxt ASC',
                'relevance': 'k_datevon DESC'
            },
            filterMapping: {
                id: 'kategorie_full.k_id',
                loc_id_i: 'kategorie_full.l_id',
                loc_id_is: 'kategorie_full.l_id',
                route_id_i: 'kategorie_full.t_id',
                route_id_is: 'kategorie_full.t_id',
                track_id_i: 'kategorie_full.k_id',
                track_id_is: 'kategorie_full.k_id',
                loc_lochirarchie_ids_txt: 'location.l_id',
                html: 'CONCAT(k_html, " ", k_name, " ", k_keywords, " ", k_meta_shortdesc_md, " ", l_lochirarchietxt)'
            },
            spartialConfig: {
                lat: 'k_gps_lat',
                lon: 'k_gps_lon',
                spatialField: 'geodist',
                spatialSortKey: 'distance'
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
                dateshow_dt: 'k_dateshow',
                html_txt: 'k_html',
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
            selectFrom: 'image INNER JOIN kategorie_full ON kategorie_full.k_id=image.k_id ' +
                        'LEFT JOIN location ON location.l_id = kategorie_full.l_id',
            selectFieldList: [
                '"IMAGE" AS type',
                'CONCAT("ac_", kategorie_full.k_type) AS actiontype',
                'CONCAT("ac_", kategorie_full.k_type) AS subtype',
                'CONCAT("IMAGE", "_", image.i_id) AS id',
                'image.i_id',
                'image.k_id',
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
                    selectSql: 'SELECT COUNT(*) AS count, l_name AS value, l_lochirarchietxt AS label' +
                    ' FROM image INNER JOIN kategorie_full ON kategorie_full.k_id=image.k_id ' +
                    '   INNER JOIN location ON location.l_id = kategorie_full.l_id ' +
                    ' GROUP BY value, label' +
                    ' ORDER BY count DESC',
                    filterField: 'l_lochirarchietxt',
                    action: AdapterFilterActions.LIKEIN
                },
                'month_is': {
                    selectField: 'MONTH(i_date)',
                    orderBy: 'value asc'
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
                    constValues: ['image', 'track', 'route', 'location', 'trip', 'news'],
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
                'ratePers': 'i_rate DESC',
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
                id: 'image.i_id',
                image_id_i: 'image.i_id',
                image_id_is: 'image.i_id',
                route_id_i: 'kategorie_full.t_id',
                route_id_is: 'kategorie_full.t_id',
                track_id_i: 'image.k_id',
                track_id_is: 'image.k_id',
                loc_lochirarchie_ids_txt: 'location.l_id',
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
        },
        'route': {
            key: 'route',
            tableName: 'tour',
            selectFrom: 'tour LEFT JOIN location ON tour.l_id = location.l_id',
            selectFieldList: [
                '"ROUTE" AS type',
                'CONCAT("ac_", tour.t_typ) AS actiontype',
                'CONCAT("ac_", tour.t_typ) AS subtype',
                'CONCAT("ROUTE", "_", tour.t_id) AS id',
                'tour.k_id',
                'tour.t_id',
                'tour.l_id',
                't_name',
                't_html_list',
                'CONCAT(t_name, " ", t_keywords, " ", t_meta_shortdesc_md, " ", l_lochirarchietxt) AS html',
                't_datevon AS t_date_show',
                't_datevon',
                'DATE_FORMAT(t_datevon, GET_FORMAT(DATE, "ISO")) AS dateonly',
                'WEEK(t_datevon) AS week',
                'MONTH(t_datevon) AS month',
                'YEAR(t_datevon) AS year',
                't_gpstracks_basefile',
                't_keywords',
                't_meta_shortdesc',
                't_meta_shortdesc_md',
                't_meta_shortdesc_html',
                't_rate_gesamt',
                'CAST(t_gps_lat AS CHAR(50)) AS t_gps_lat',
                'CAST(t_gps_lon AS CHAR(50)) AS t_gps_lon',
                'CONCAT(t_gps_lat, ",", t_gps_lon) AS t_gps_loc',
                'l_lochirarchietxt',
                'l_lochirarchieids',
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
                'ROUND((t_route_hm / 500))*500 AS altAscFacet',
                'ROUND((t_ele_max / 500))*500 AS altMaxFacet',
                'ROUND((t_route_m / 5))*5 AS distFacet',
                't_route_dauer',
                'ROUND(ROUND(t_route_dauer * 2) / 2, 1) AS durFacet'],
            facetConfigs: {
                'actiontype_ss': {
                    selectField: 'CONCAT("ac_", tour.t_typ)'
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
                'keywords_txt': {
                    selectSql: 'SELECT 0 AS count, ' +
                    '  SUBSTRING_INDEX(SUBSTRING_INDEX(tour.t_keywords, ",", numbers.n), ",", -1) AS value ' +
                    ' FROM' +
                    '  (SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL' +
                    '   SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL' +
                    '   SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL ' +
                    '   SELECT 14 UNION ALL SELECT 15 UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL' +
                    '   SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20) ' +
                    '  numbers INNER JOIN tour ON ' +
                    '   CHAR_LENGTH(tour.t_keywords) - CHAR_LENGTH(REPLACE(tour.t_keywords, ",", "")) >= numbers.n - 1' +
                    '  GROUP BY count, value' +
                    '  ORDER BY value',
                    filterField: 't_keywords',
                    action: AdapterFilterActions.LIKEIN
                },
                'loc_id_i': {
                    noFacet: true
                },
                'loc_lochirarchie_txt': {
                    selectSql: 'SELECT COUNt(*) AS count, l_name AS value, l_lochirarchietxt AS label' +
                    ' FROM tour INNER JOIN location ON tour.l_id = location.l_id ' +
                    ' GROUP BY value, label' +
                    ' ORDER BY count DESC',
                    filterField: 'l_lochirarchietxt',
                    action: AdapterFilterActions.LIKEIN
                },
                'month_is': {
                    selectField: 'MONTH(t_datevon)',
                    orderBy: 'value asc'
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
                    filterFields: ['tour.t_k_ids'],
                    action: AdapterFilterActions.IN_CSV
                },
                'track_id_is': {
                    selectSql: 'SELECT COUNT(kategorie_full.k_id) AS count, kategorie_full.k_id AS value,' +
                    ' kategorie_full.k_name AS label, kategorie_full.k_id AS id' +
                    ' FROM kategorie_full INNER JOIN tour ON kategorie_full.t_id = tour.t_id ' +
                    ' GROUP BY value, label, id' +
                    ' ORDER BY label',
                    filterFields: ['tour.t_k_ids'],
                    action: AdapterFilterActions.IN_CSV
                },
                'type_txt': {
                    constValues: ['route', 'track', 'image', 'location', 'trip', 'news'],
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
                'ratePers': 't_rate_gesamt DESC',
                'location': 'l_lochirarchietxt ASC',
                'relevance': 't_datevon DESC'
            },
            spartialConfig: {
                lat: 't_gps_lat',
                lon: 't_gps_lon',
                spatialField: 'geodist',
                spatialSortKey: 'distance'
            },
            filterMapping: {
                id: 'tour.t_id',
                route_id_i: 'tour.t_id',
                route_id_is: 'tour.t_id',
                news_id_is: '"dummy"',
                trip_id_is: '"dummy"',
                loc_id_i: 'tour.l_id',
                loc_id_is: 'tour.l_id',
                loc_lochirarchie_ids_txt: 'location.l_id',
                html: 'CONCAT(t_name, " ", t_keywords, " ", t_meta_shortdesc_md, " ", l_lochirarchietxt)'
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
        'location': {
            key: 'location',
            tableName: 'location',
            selectFrom: 'location',
            selectFieldList: [
                '"LOCATION" AS type',
                'location.l_typ',
                'CONCAT("loc_", l_typ) AS subtype',
                'CONCAT("LOCATION", "_", location.l_id) AS id',
                'location.l_id',
                'l_name',
                'l_html',
                'CONCAT(l_name, " ", l_keywords, " ", l_meta_shortdesc_md, " ", l_lochirarchietxt) AS html',
                'l_keywords',
                'l_meta_shortdesc',
                'l_meta_shortdesc_md',
                'l_meta_shortdesc_html',
                'CAST(l_gps_lat AS CHAR(50)) AS l_gps_lat',
                'CAST(l_gps_lon AS CHAR(50)) AS l_gps_lon',
                'CONCAT(l_gps_lat, ",", l_gps_lon) AS l_gps_loc',
                'l_lochirarchietxt',
                'l_lochirarchieids'],
            facetConfigs: {
                'actiontype_ss': {
                    selectField: 'CONCAT("ac_", location.l_typ)'
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
                'keywords_txt': {
                    selectSql: 'SELECT 0 AS count, ' +
                    '  SUBSTRING_INDEX(SUBSTRING_INDEX(location.l_keywords, ",", numbers.n), ",", -1) AS value ' +
                    ' FROM' +
                    '  (SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL' +
                    '   SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL' +
                    '   SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL ' +
                    '   SELECT 14 UNION ALL SELECT 15 UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL' +
                    '   SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20) ' +
                    '  numbers INNER JOIN location ON ' +
                    '   CHAR_LENGTH(location.l_keywords) - CHAR_LENGTH(REPLACE(location.l_keywords, ",", "")) >= numbers.n - 1' +
                    '  GROUP BY count, value' +
                    '  ORDER BY value',
                    filterField: 'l_keywords',
                    action: AdapterFilterActions.LIKEIN
                },
                'loc_id_i': {
                },
                'loc_lochirarchie_txt': {
                    selectSql: 'SELECT COUNt(*) AS count, l_name AS value, l_lochirarchietxt AS label' +
                    ' FROM location' +
                    ' GROUP BY value, label' +
                    ' ORDER BY count DESC',
                    filterField: 'l_lochirarchietxt',
                    action: AdapterFilterActions.LIKEIN
                },
                'month_is': {
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
                    constValues: ['location', 'track', 'route', 'trip', 'image', 'news'],
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
                'location': 'l_lochirarchietxt ASC',
                'relevance': 'l_lochirarchietxt ASC'
            },
            spartialConfig: {
                lat: 'l_gps_lat',
                lon: 'l_gps_lon',
                spatialField: 'geodist',
                spatialSortKey: 'distance'
            },
            filterMapping: {
                id: 'location.l_id',
                loc_id_i: 'location.l_id',
                loc_id_is: 'location.l_id',
                loc_parent_id_i: 'l_parent_id',
                news_id_is: '"dummy"',
                trip_id_is: '"dummy"',
                html: 'CONCAT(l_name, " ", l_html, " " , l_keywords, " ", l_meta_shortdesc_md, " ", l_lochirarchietxt)'
            },
            fieldMapping: {
                id: 'id',
                loc_id_i: 'l_id',
                loc_id_is: 'l_id',
                html_txt: 'l_html',
                desc_txt: 'l_meta_shortdesc',
                desc_md_txt: 'l_meta_shortdesc_md',
                desc_html_txt: 'l_meta_shortdesc_html',
                distance: 'geodist',
                geo_lon_s: 'l_gps_lon',
                geo_lat_s: 'l_gps_lat',
                geo_loc_p: 'l_gps_loc',
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
            selectFrom: 'trip LEFT JOIN kategorie_full ON kategorie_full.tr_id = trip.tr_id',
            groupbBySelectFieldList: true,
            groupbBySelectFieldListIgnore: ['k_altitude_asc_sum', 'k_altitude_desc_sum', 'k_distance_sum',
                'k_altitude_min', 'k_altitude_max'
            ],
            selectFieldList: [
                '"TRIP" AS type',
                'CONCAT("TRIP", "_", trip.tr_id) AS id',
                'trip.tr_id',
                'trip.tr_name',
                'CONCAT(tr_name, " ", tr_keywords, " ", tr_meta_shortdesc_md) AS html',
                'tr_dateshow',
                'tr_datevon',
                'tr_datebis',
                'DATE_FORMAT(tr_datevon, GET_FORMAT(DATE, "ISO")) AS dateonly',
                'WEEK(tr_datevon) AS week',
                'MONTH(tr_datevon) AS month',
                'YEAR(tr_datevon) AS year',
                'SUM(k_altitude_asc) AS k_altitude_asc_sum',
                'SUM(k_altitude_desc) AS k_altitude_desc_sum',
                'MIN(k_altitude_min) AS k_altitude_min',
                'MAX(k_altitude_max) AS k_altitude_max',
                'SUM(k_distance) AS k_distance_sum',
                'tr_keywords',
                'tr_meta_shortdesc',
                'tr_meta_shortdesc_md',
                'tr_meta_shortdesc_html'],
            facetConfigs: {
                'actiontype_ss': {
                    noFacet: true
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
                'keywords_txt': {
                    selectSql: 'SELECT 0 AS count, ' +
                    '  SUBSTRING_INDEX(SUBSTRING_INDEX(trip.tr_keywords, ",", numbers.n), ",", -1) AS value ' +
                    ' FROM' +
                    '  (SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL' +
                    '   SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL' +
                    '   SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL ' +
                    '   SELECT 14 UNION ALL SELECT 15 UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL' +
                    '   SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20) ' +
                    '  numbers INNER JOIN trip ON ' +
                    '   CHAR_LENGTH(trip.tr_keywords) - CHAR_LENGTH(REPLACE(trip.tr_keywords, ",", "")) >= numbers.n - 1' +
                    '  GROUP BY count, value' +
                    '  ORDER BY value',
                    filterField: 'tr_keywords',
                    action: AdapterFilterActions.LIKEIN
                },
                'loc_id_i': {
                    noFacet: true
                },
                'loc_lochirarchie_txt': {
                    noFacet: true
                },
                'month_is': {
                    selectField: 'MONTH(tr_datevon)'
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
                    constValues: ['trip', 'location', 'track', 'route', 'image', 'news'],
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
                'relevance': 'tr_datevon ASC'
            },
            filterMapping: {
                id: 'trip.tr_id',
                trip_id_i: 'trip.tr_id',
                trip_id_is: 'trip.tr_id',
                track_id_i: '"dummy"',
                route_id_is: '"dummy"',
                news_id_is: '"dummy"',
                loc_lochirarchie_ids_txt: '"dummy"',
                html: 'CONCAT(tr_name, " ", tr_keywords, " ", tr_meta_shortdesc_md)'
            },
            fieldMapping: {
                id: 'id',
                trip_id_i: 'tr_id',
                trip_id_is: 'tr_id',
                data_tech_alt_asc_i: 'k_altitude_asc_sum',
                data_tech_alt_desc_i: 'k_altitude_desc_sum',
                data_tech_alt_min_i: 'k_altitude_min',
                data_tech_alt_max_i: 'k_altitude_max',
                data_tech_dist_f: 'k_distance_sum',
                data_tech_dur_f: 'dur',
                dateshow_dt: 'tr_dateshow',
                datestart_dt: 'tr_datevon',
                dateend_dt: 'tr_datebis',
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
            selectFrom: 'news LEFT JOIN kategorie_full ON kategorie_full.n_id = news.n_id',
            groupbBySelectFieldList: true,
            groupbBySelectFieldListIgnore: ['k_altitude_asc_sum', 'k_altitude_desc_sum', 'k_distance_sum',
                'k_altitude_min', 'k_altitude_max'
            ],
            selectFieldList: [
                '"NEWS" AS type',
                'CONCAT("NEWS", "_", news.n_id) AS id',
                'news.n_id',
                'n_headline',
                'CONCAT(n_headline, " ", n_keywords, " ", n_message_md) AS html',
                'n_date',
                'n_datevon',
                'n_datebis',
                'DATE_FORMAT(n_date, GET_FORMAT(DATE, "ISO")) AS dateonly',
                'WEEK(n_date) AS week',
                'MONTH(n_date) AS month',
                'YEAR(n_date) AS year',
                'SUM(k_altitude_asc) AS k_altitude_asc_sum',
                'SUM(k_altitude_desc) AS k_altitude_desc_sum',
                'MIN(k_altitude_min) AS k_altitude_min',
                'MAX(k_altitude_max) AS k_altitude_max',
                'SUM(k_distance) AS k_distance_sum',
                'n_keywords',
                'n_message',
                'n_message_md',
                'n_message_html'],
            facetConfigs: {
                'actiontype_ss': {
                    noFacet: true
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
                'keywords_txt': {
                    selectSql: 'SELECT 0 AS count, ' +
                    '  SUBSTRING_INDEX(SUBSTRING_INDEX(news.n_keywords, ",", numbers.n), ",", -1) AS value ' +
                    ' FROM' +
                    '  (SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL' +
                    '   SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL' +
                    '   SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL ' +
                    '   SELECT 14 UNION ALL SELECT 15 UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL' +
                    '   SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20) ' +
                    '  numbers INNER JOIN news ON ' +
                    '   CHAR_LENGTH(news.n_keywords) - CHAR_LENGTH(REPLACE(news.n_keywords, ",", "")) >= numbers.n - 1' +
                    '  GROUP BY count, value' +
                    '  ORDER BY value',
                    filterField: 'n_keywords',
                    action: AdapterFilterActions.LIKEIN
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
                    constValues: ['trip', 'location', 'track', 'route', 'image', 'news'],
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
                'relevance': 'n_date ASC'
            },
            filterMapping: {
                id: 'news.n_id',
                news_id_i: 'news.n_id',
                news_id_is: 'news.n_id',
                image_id_i: '"dummy"',
                track_id_i: '"dummy"',
                trip_id_is: '"dummy"',
                location_id_is: '"dummy"',
                route_id_is: '"dummy"',
                loc_lochirarchie_ids_txt: '"dummy"',
                html: 'CONCAT(n_headline, " ", n_keywords, " ", n_message_md)'
            },
            fieldMapping: {
                id: 'id',
                news_id_i: 'n_id',
                news_id_is: 'n_id',
                data_tech_alt_asc_i: 'k_altitude_asc_sum',
                data_tech_alt_desc_i: 'k_altitude_desc_sum',
                data_tech_alt_min_i: 'k_altitude_min',
                data_tech_alt_max_i: 'k_altitude_max',
                data_tech_dist_f: 'k_distance_sum',
                data_tech_dur_f: 'dur',
                dateshow_dt: 'n_date',
                datestart_dt: 'n_datevon',
                dateend_dt: 'n_datebis',
                desc_txt: 'n_message',
                desc_md_txt: 'n_message_md',
                desc_html_txt: 'n_message_html',
                keywords_txt: 'n_keywords',
                name_s: 'n_headline',
                type_s: 'type'
            }
        }
    };

    public getTableConfigForTableKey(table: string): TableConfig {
        return SDocSqlMytbConfig.tableConfigs[table];
    }
}

