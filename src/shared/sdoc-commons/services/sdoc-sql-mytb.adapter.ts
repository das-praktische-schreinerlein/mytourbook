import {SDocRecord} from '../model/records/sdoc-record';
import {SDocSearchForm} from '../model/forms/sdoc-searchform';
import {SDocSearchResult} from '../model/container/sdoc-searchresult';
import {GenericSqlAdapter} from '../../search-commons/services/generic-sql.adapter';
import {SDocAdapterResponseMapper} from './sdoc-adapter-response.mapper';
import {TableConfig} from '../../search-commons/services/sql-query.builder';
import {AdapterFilterActions, AdapterQuery} from '../../search-commons/services/mapper.utils';

export class SDocSqlMytbAdapter extends GenericSqlAdapter<SDocRecord, SDocSearchForm, SDocSearchResult> {
    public static tableConfigs = {
        'track': {
            tableName: 'kategorie_full',
            selectFrom: 'kategorie_full INNER JOIN location ON location.l_id = kategorie_full.l_id ' +
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
                'k_gpstracks_basefile',
                'k_keywords',
                'k_meta_shortdesc',
                'k_meta_shortdesc_md',
                'k_meta_shortdesc_html',
                'k_rate_gesamt',
                'CAST(k_gps_lat AS CHAR(50)) AS k_gps_lat',
                'CAST(k_gps_lon AS CHAR(50)) AS k_gps_lon',
                'CONCAT(k_gps_lat, ",", k_gps_lon) AS k_gps_loc',
                'l_lochirarchietxt',
                'l_lochirarchieids',
                'CONCAT(image.i_dir, "/", image.i_file) as i_fav_url_txt',
                'k_altitude_asc AS altAsc',
                'k_altitude_desc AS altDesc',
                'k_altitude_min AS altMin',
                'k_altitude_max AS altMax',
                'k_distance AS dist',
                'k_rate_ausdauer AS ausdauer',
                'k_rate_bildung AS bildung',
                'k_rate_gesamt AS gesamt',
                'k_rate_kraft AS kraft',
                'k_rate_mental AS mental',
                'k_rate_motive AS motive',
                'k_rate_schwierigkeit AS schwierigkeit',
                'k_rate_wichtigkeit AS wichtigkeit',
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
                    selectField: 'ROUND((k_altitude_asc / 500))*500'
                },
                'data_tech_alt_max_facet_is': {
                    selectField: 'ROUND((k_altitude_max / 500))*500'
                },
                'data_tech_dist_facets_fs': {
                    selectField: 'ROUND((k_distance / 5))*5'
                },
                'data_tech_dur_facet_fs': {
                    selectField: 'ROUND(ROUND(TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 * 2) / 2, 1)'
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
                    selectSql: 'SELECT COUNT(*) AS count, l_name AS value' +
                    ' FROM kategorie_full INNER JOIN location ON kategorie_full.l_id = location.l_id ' +
                    ' GROUP BY l_name' +
                    ' ORDER BY count DESC',
                    filterField: 'l_lochirarchietxt',
                    action: AdapterFilterActions.LIKEIN
                },
                'month_is': {
                    selectField: 'MONTH(k_datevon)'
                },
                'rate_pers_gesamt_is': {
                    selectField: 'k_rate_gesamt'
                },
                'rate_pers_schwierigkeit_is': {
                    selectField: 'k_rate_schwierigkeit'
                },
                'rate_tech_overall_ss': {
                    noFacet: true
                },
                'subtype_ss': {
                    selectField: 'CONCAT("ac_", kategorie_full.k_type)'
                },
                'type_txt': {
                    constValues: ['track', 'route', 'image', 'location', 'trip', 'news'],
                    filterField: '"track"',
                    selectLimit: 1
                },
                'week_is': {
                    selectField: 'WEEK(k_datevon)'
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
                'relevance': 'k_datevon DESC',
                'default': 'k_datevon DESC'
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
                lon: 'k_gps_lon'
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
                geo_lon_s: 'k_gps_lon',
                geo_lat_s: 'k_gps_lat',
                geo_loc_p: 'k_gps_loc',
                data_tech_alt_asc_i: 'altAsc',
                data_tech_alt_desc_i: 'altDesc',
                data_tech_alt_min_i: 'altMin',
                data_tech_alt_max_i: 'altMax',
                data_tech_dist_f: 'dist',
                data_tech_dur_f: 'dur',
                rate_pers_ausdauer_i: 'ausdauer',
                rate_pers_bildung_i: 'bildung',
                rate_pers_gesamt_i: 'gesamt',
                rate_pers_kraft_i: 'kraft',
                rate_pers_mental_i: 'mental',
                rate_pers_motive_i: 'motive',
                rate_pers_schwierigkeit_i: 'schwierigkeit',
                rate_pers_wichtigkeit_i: 'wichtigkeit',
                gpstracks_basefile_s: 'k_gpstracks_basefile',
                keywords_txt: 'k_keywords',
                loc_lochirarchie_s: 'l_lochirarchietxt',
                loc_lochirarchie_ids_s: 'l_lochirarchieids',
                name_s: 'k_name',
                type_s: 'type',
                actiontype_ss: 'k_type',
                subtype_s: 'subtype_s',
                i_fav_url_txt: 'i_fav_url_txt'
            }
        },
        'image': {
            tableName: 'image',
            selectFrom: 'image INNER JOIN kategorie_full ON kategorie_full.k_id=image.k_id ' +
                        'INNER JOIN location ON location.l_id = kategorie_full.l_id',
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
                'CONCAT(image.i_dir, "/", image.i_file) as i_fav_url_txt',
                'k_altitude_asc AS altAsc',
                'k_altitude_desc AS altDesc',
                'i_gps_ele AS altMin',
                'i_gps_ele AS altMax',
                'k_distance AS dist',
                'k_rate_ausdauer AS ausdauer',
                'k_rate_bildung AS bildung',
                'i_rate AS gesamt',
                'k_rate_kraft AS kraft',
                'k_rate_mental AS mental',
                'i_rate_motive AS motive',
                'k_rate_schwierigkeit AS schwierigkeit',
                'i_rate_wichtigkeit AS wichtigkeit',
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
                    selectFrom: 'image INNER JOIN kategorie_full ON kategorie_full.k_id=image.k_id'
                },
                'data_tech_alt_max_facet_is': {
                    selectField: 'ROUND((i_gps_ele / 500))*500'
                },
                'data_tech_dist_facets_fs': {
                    selectField: 'ROUND((k_distance / 5))*5',
                    selectFrom: 'image INNER JOIN kategorie_full ON kategorie_full.k_id=image.k_id'
                },
                'data_tech_dur_facet_fs': {
                    selectField: 'ROUND(ROUND(TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 * 2) / 2, 1)',
                    selectFrom: 'image INNER JOIN kategorie_full ON kategorie_full.k_id=image.k_id'
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
                    selectSql: 'SELECT COUNT(*) AS count, l_name AS value' +
                    ' FROM image INNER JOIN kategorie_full ON kategorie_full.k_id=image.k_id ' +
                    '   INNER JOIN location ON location.l_id = kategorie_full.l_id ' +
                    ' GROUP BY l_name' +
                    ' ORDER BY count DESC',
                    filterField: 'l_lochirarchietxt',
                    action: AdapterFilterActions.LIKEIN
                },
                'month_is': {
                    selectField: 'MONTH(i_date)'
                },
                'rate_pers_gesamt_is': {
                    selectField: 'i_rate'
                },
                'rate_pers_schwierigkeit_is': {
                    selectField: 'k_rate_schwierigkeit',
                    selectFrom: 'image INNER JOIN kategorie_full ON kategorie_full.k_id=image.k_id'
                },
                'rate_tech_overall_ss': {
                    noFacet: true
                },
                'subtype_ss': {
                    selectField: 'CONCAT("ac_", kategorie_full.k_type)',
                    selectFrom: 'image INNER JOIN kategorie_full ON kategorie_full.k_id=image.k_id'
                },
                'type_txt': {
                    constValues: ['image', 'track', 'route', 'location', 'trip', 'news'],
                    filterField: '"image"',
                    selectLimit: 1
                },
                'week_is': {
                    selectField: 'WEEK(i_date)'
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
                'relevance': 'i_date DESC',
                'default': 'i_date DESC'
            },
            spartialConfig: {
                lat: 'i_gps_lat',
                lon: 'i_gps_lon'
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
                geo_lon_s: 'i_gps_lon',
                geo_lat_s: 'i_gps_lat',
                geo_loc_p: 'i_gps_loc',
                data_tech_alt_asc_i: 'altAsc',
                data_tech_alt_desc_i: 'altDesc',
                data_tech_alt_min_i: 'altMin',
                data_tech_alt_max_i: 'altMax',
                data_tech_dist_f: 'dist',
                data_tech_dur_f: 'dur',
                rate_pers_ausdauer_i: 'ausdauer',
                rate_pers_bildung_i: 'bildung',
                rate_pers_gesamt_i: 'gesamt',
                rate_pers_kraft_i: 'kraft',
                rate_pers_mental_i: 'mental',
                rate_pers_motive_i: 'motive',
                rate_pers_schwierigkeit_i: 'schwierigkeit',
                rate_pers_wichtigkeit_i: 'wichtigkeit',
                gpstracks_basefile_s: 'k_gpstracks_basefile',
                keywords_txt: 'i_keywords',
                loc_lochirarchie_s: 'l_lochirarchietxt',
                loc_lochirarchie_ids_s: 'l_lochirarchieids',
                name_s: 'i_katname',
                type_s: 'type',
                actiontype_ss: 'k_type',
                subtype_s: 'subtype_s',
                i_fav_url_txt: 'i_fav_url_txt'
            }
        },
        'route': {
            tableName: 'tour',
            selectFrom: 'tour INNER JOIN location ON tour.l_id = location.l_id',
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
                't_datevon as t_date_show',
                't_datevon',
                'DATE_FORMAT(t_datevon, GET_FORMAT(DATE, "ISO")) AS dateonly',
                'WEEK(t_datevon) AS week',
                'MONTH(t_datevon) AS month',
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
                't_route_hm AS altAsc',
                't_ele_max AS altMax',
                't_route_m AS dist',
                't_rate_ausdauer AS ausdauer',
                't_rate_bildung AS bildung',
                't_rate_gesamt AS gesamt',
                't_rate_kraft AS kraft',
                't_rate_mental AS mental',
                't_rate_motive AS motive',
                't_rate_schwierigkeit AS schwierigkeit',
                't_rate_wichtigkeit AS wichtigkeit',
                't_rate as overall',
                't_rate_ks as ks',
                't_rate_firn as firn',
                't_rate_gletscher as gletscher',
                't_rate_klettern as klettern',
                't_rate_bergtour as bergtour',
                't_rate_schneeschuh as schneeschuh',
                't_desc_fuehrer_full as guides',
                't_desc_gebiet as region',
                't_desc_talort as baseloc',
                't_desc_ziel as destloc',
                'ROUND((t_route_hm / 500))*500 AS altAscFacet',
                'ROUND((t_ele_max / 500))*500 AS altMaxFacet',
                'ROUND((t_route_m / 5))*5 AS distFacet',
                't_route_dauer AS dur',
                'ROUND(ROUND(t_route_dauer * 2) / 2, 1) AS durFacet'],
            facetConfigs: {
                'actiontype_ss': {
                    selectField: 'CONCAT("ac_", tour.t_typ)'
                },
                'data_tech_alt_asc_facet_is': {
                    selectField: 'ROUND((t_route_hm / 500))*500'
                },
                'data_tech_alt_max_facet_is': {
                    selectField: 'ROUND((t_ele_max / 500))*500'
                },
                'data_tech_dist_facets_fs': {
                    selectField: 'ROUND((t_route_m / 5))*5'
                },
                'data_tech_dur_facet_fs': {
                    selectField: 'ROUND(ROUND(t_route_dauer * 2) / 2, 1)'
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
                    selectSql: 'SELECT COUNt(*) AS count, l_name AS value' +
                    ' FROM tour INNER JOIN location ON tour.l_id = location.l_id ' +
                    ' GROUP BY l_name' +
                    ' ORDER BY count DESC',
                    filterField: 'l_lochirarchietxt',
                    action: AdapterFilterActions.LIKEIN
                },
                'month_is': {
                    selectField: 'MONTH(t_datevon)'
                },
                'rate_pers_gesamt_is': {
                    selectField: 't_rate_gesamt'
                },
                'rate_pers_schwierigkeit_is': {
                    selectField: 't_rate_schwierigkeit'
                },
                'rate_tech_overall_ss': {
                    selectField: 't_rate'
                },
                'subtype_ss': {
                    selectField: 'CONCAT("ac_", tour.t_typ)'
                },
                'type_txt': {
                    constValues: ['route', 'track', 'image', 'location', 'trip', 'news'],
                    filterField: '"route"',
                    selectLimit: 1
                },
                'week_is': {
                    selectField: 'WEEK(t_datevon)'
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
                'relevance': 't_datevon DESC',
                'default': 't_datevon DESC'
            },
            spartialConfig: {
                lat: 't_gps_lat',
                lon: 't_gps_lon'
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
                html_txt: 't_html_list',
                desc_txt: 't_meta_shortdesc',
                desc_md_txt: 't_meta_shortdesc_md',
                desc_html_txt: 't_meta_shortdesc_html',
                geo_lon_s: 't_gps_lon',
                geo_lat_s: 't_gps_lat',
                geo_loc_p: 't_gps_loc',
                data_tech_alt_asc_i: 'altAsc',
                data_tech_alt_desc_i: 'altDesc',
                data_tech_alt_min_i: 'altMin',
                data_tech_alt_max_i: 'altMax',
                data_tech_dist_f: 'dist',
                data_tech_dur_f: 'dur',
                data_info_guides_s: 'guides',
                data_info_region_s: 'region',
                data_info_baseloc_s: 'baseloc',
                data_info_destloc_s: 'destloc',
                rate_pers_ausdauer_i: 'ausdauer',
                rate_pers_bildung_i: 'bildung',
                rate_pers_gesamt_i: 'gesamt',
                rate_pers_kraft_i: 'kraft',
                rate_pers_mental_i: 'mental',
                rate_pers_motive_i: 'motive',
                rate_pers_schwierigkeit_i: 'schwierigkeit',
                rate_pers_wichtigkeit_i: 'wichtigkeit',
                rate_tech_overall_s: 'overall',
                rate_tech_ks_s: 'ks',
                rate_tech_firn_s: 'firn',
                rate_tech_gletscher_s: 'gletscher',
                rate_tech_klettern_s: 'klettern',
                rate_tech_bergtour_s: 'bergtour',
                rate_tech_schneeschuh_s: 'schneeschuh',
                gpstracks_basefile_s: 't_gpstracks_basefile',
                keywords_txt: 't_keywords',
                loc_lochirarchie_s: 'l_lochirarchietxt',
                loc_lochirarchie_ids_s: 'l_lochirarchieids',
                name_s: 't_name',
                type_s: 'type',
                actiontype_ss: 't_typ',
                subtype_s: 'subtype_s',
                i_fav_url_txt: 'i_fav_url_txt'
            }
        },
        'location': {
            tableName: 'location',
            selectFrom: 'location',
            selectFieldList: [
                '"LOCATION" AS type',
                'CONCAT(location.l_typ) AS subtype',
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
                    selectSql: 'SELECT COUNt(*) AS count, l_name AS value' +
                    ' FROM location' +
                    ' GROUP BY l_name' +
                    ' ORDER BY count DESC',
                    filterField: 'l_lochirarchietxt',
                    action: AdapterFilterActions.LIKEIN
                },
                'month_is': {
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
                }
            },
            sortMapping: {
                'distance': 'geodist ASC',
                'location': 'l_lochirarchietxt ASC',
                'relevance': 'l_lochirarchietxt ASC',
                'default': 'l_id DESC'
            },
            spartialConfig: {
                lat: 'l_gps_lat',
                lon: 'l_gps_lon'
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
                geo_lon_s: 'l_gps_lon',
                geo_lat_s: 'l_gps_lat',
                geo_loc_p: 'l_gps_loc',
                keywords_txt: 'l_keywords',
                loc_lochirarchie_s: 'l_lochirarchietxt',
                loc_lochirarchie_ids_s: 'l_lochirarchieids',
                name_s: 'l_name',
                type_s: 'type',
                subtype_s: 'subtype_s',
            }
        },
        'trip': {
            tableName: 'trip',
            selectFrom: 'trip',
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
                }
            },
            sortMapping: {
                'date': 'tr_datevon DESC',
                'dateAsc': 'tr_datevon ASC',
                'relevance': 'tr_datevon ASC',
                'default': 'tr_datevon DESC'
            },
            filterMapping: {
                id: 'trip.tr_id',
                trip_id_i: 'trip.tr_id',
                trip_id_is: 'trip.tr_id',
                route_id_is: '"dummy"',
                news_id_is: '"dummy"',
                loc_lochirarchie_ids_txt: '"dummy"',
                html: 'CONCAT(tr_name, " ", tr_keywords, " ", tr_meta_shortdesc_md)'
            },
            fieldMapping: {
                id: 'id',
                trip_id_i: 'tr_id',
                trip_id_is: 'tr_id',
                dateshow_dt: 'tr_dateshow',
                desc_txt: 'tr_meta_shortdesc',
                desc_md_txt: 'tr_meta_shortdesc_md',
                desc_html_txt: 'tr_meta_shortdesc_html',
                keywords_txt: 'tr_keywords',
                name_s: 'tr_name',
                type_s: 'type',
                subtype_s: 'subtype_s',
            }
        },
        'news': {
            tableName: 'news',
            selectFrom: 'news',
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
                }
            },
            sortMapping: {
                'date': 'n_date DESC',
                'dateAsc': 'n_date ASC',
                'relevance': 'n_date ASC',
                'default': 'n_date DESC'
            },
            filterMapping: {
                id: 'news.n_id',
                news_id_i: 'news.n_id',
                news_id_is: 'news.n_id',
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
                dateshow_dt: 'n_date',
                desc_txt: 'n_message',
                desc_md_txt: 'n_message_md',
                desc_html_txt: 'n_message_html',
                keywords_txt: 'n_keywords',
                name_s: 'n_headline',
                type_s: 'type',
                subtype_s: 'subtype_s',
            }
        }
    };

    constructor(config: any) {
        super(config, new SDocAdapterResponseMapper());
    }

    protected getTableConfig(params: AdapterQuery): TableConfig {
        return SDocSqlMytbAdapter.tableConfigs[this.extractTable(params)];
    }

    protected getTableConfigForTable(table: string): TableConfig {
        return SDocSqlMytbAdapter.tableConfigs[table];
    }

    protected extractTable(params: AdapterQuery): string {
        const types = params.where['type_txt'];
        if (types !== undefined && types.in !== undefined && types.in.length === 1) {
            const tabName = types.in[0];
            if (SDocSqlMytbAdapter.tableConfigs[tabName] !== undefined) {
                return tabName;
            }

            return undefined;
        }
        const ids = params.where['id'];
        if (ids !== undefined && ids.in !== undefined && ids.in.length === 1) {
            const tabName = ids.in[0].replace(/_.*/, '').toLowerCase();
            if (SDocSqlMytbAdapter.tableConfigs[tabName] !== undefined) {
                return tabName;
            }

            return undefined;
        }

        return undefined;
    }
}

