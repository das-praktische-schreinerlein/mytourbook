import {Mapper} from 'js-data';
import {SDocRecord} from '../model/records/sdoc-record';
import {SDocSearchForm} from '../model/forms/sdoc-searchform';
import {SDocSearchResult} from '../model/container/sdoc-searchresult';
import {AdapterFilterActions, GenericSqlAdapter, TableConfig} from '../../search-commons/services/generic-sql.adapter';
import {SDocAdapterResponseMapper} from './sdoc-adapter-response.mapper';

export class SDocSqlMediadbAdapter extends GenericSqlAdapter<SDocRecord, SDocSearchForm, SDocSearchResult> {
    public static tableConfigs = {
        'track': {
            tableName: 'kategorie',
            selectFrom: 'kategorie INNER JOIN location ON location.l_id = kategorie.l_id ' +
//                        'LEFT JOIN image ON kategorie.i_id=image.i_id ' +
                        'LEFT JOIN kategorie_keyword ON kategorie.k_id=kategorie_keyword.k_id ' +
                        'LEFT JOIN keyword ON kategorie_keyword.kw_id=keyword.kw_id',
            groupbBySelectFieldList: true,
            groupbBySelectFieldListIgnore: ['k_keywords'],
            selectFieldList: [
                '"TRACK" AS type',
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
                'CONCAT(k_name, " ", k_meta_shortdesc, " ", l_name) AS html',
                'k_datevon AS k_dateshow',
                'k_datevon',
                'k_datebis',
                'DATE_FORMAT(k_datevon, GET_FORMAT(DATE, "ISO")) AS dateonly',
                'WEEK(k_datevon) AS week',
                'MONTH(k_datevon) AS month',
                'k_gpstracks_basefile',
                'GROUP_CONCAT(keyword.kw_name separator ", ") AS k_keywords',
                'k_meta_shortdesc',
                'k_meta_shortdesc AS k_meta_shortdesc_md',
                'k_meta_shortdesc AS k_meta_shortdesc_html',
                'k_rate_gesamt',
                'CAST(l_geo_latdeg AS CHAR(50)) AS k_gps_lat',
                'CAST(l_geo_longdeg AS CHAR(50)) AS k_gps_lon',
                'CONCAT(l_geo_latdeg, ",", l_geo_longdeg) AS k_gps_loc',
                'location.l_name AS l_lochirarchietxt',
                'CAST(location.l_id AS CHAR(50)) AS l_lochirarchieids',
//                'CONCAT(image.i_dir, "/", image.i_file) as i_fav_url_txt',
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
                    selectField: 'CONCAT("ac_", kategorie.k_type)'
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
                    selectSql: 'SELECT COUNT(*) AS count, l_name AS value' +
                    ' FROM kategorie INNER JOIN location ON kategorie.l_id = location.l_id ' +
                    ' GROUP BY l_name' +
                    ' ORDER BY count DESC',
                    filterField: 'l_name',
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
                    selectField: 'CONCAT("ac_", kategorie.k_type)'
                },
                'type_txt': {
                    constValues: ['track', 'route', 'image', 'location', 'trip', 'news'],
                    filterField: '"track"'
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
                'location': 'l_name ASC',
                'relevance': 'k_datevon DESC'
            },
            filterMapping: {
                id: 'kategorie.k_id',
                loc_id_i: 'kategorie.l_id',
                loc_id_is: 'kategorie.l_id',
                route_id_i: 'kategorie.t_id',
                route_id_is: 'kategorie.t_id',
                track_id_i: 'kategorie.k_id',
                track_id_is: 'kategorie.k_id',
                loc_lochirarchie_ids_txt: 'location.l_id',
                l_lochirarchietxt: 'location.l_name',
                html: 'CONCAT(k_name, " ", k_meta_shortdesc, " ", l_name)'
            },
            spartialConfig: {
                lat: 'l_geo_latdeg',
                lon: 'l_geo_longdeg'
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
            selectFrom: 'image INNER JOIN kategorie ON kategorie.k_id=image.k_id ' +
                        'INNER JOIN location ON location.l_id = kategorie.l_id ' +
                        'LEFT JOIN image_keyword ON image.i_id=image_keyword.i_id ' +
                        'LEFT JOIN keyword ON image_keyword.kw_id=keyword.kw_id',
            groupbBySelectFieldList: true,
            groupbBySelectFieldListIgnore: ['i_keywords'],
            selectFieldList: [
                '"IMAGE" AS type',
                'CONCAT("ac_", kategorie.k_type) AS actiontype',
                'CONCAT("ac_", kategorie.k_type) AS subtype',
                'CONCAT("IMAGE", "_", image.i_id) AS id',
//                'n_id',
                'image.i_id',
                'image.k_id',
                'kategorie.t_id',
                'kategorie.tr_id',
                'kategorie.l_id',
                'i_meta_name',
                'CONCAT(i_meta_name, " ", l_name) AS html',
                'i_date',
                'DATE_FORMAT(i_date, GET_FORMAT(DATE, "ISO")) AS dateonly',
                'WEEK(i_date) AS week',
                'MONTH(i_date) AS month',
                'k_gpstracks_basefile',
                'GROUP_CONCAT(keyword.kw_name separator ", ") AS i_keywords',
                'i_meta_shortdesc',
                'i_meta_shortdesc AS i_meta_shortdesc_md',
                'i_meta_shortdesc AS i_meta_shortdesc_html',
                'i_rate',
                'CAST(i_gps_lat AS CHAR(50)) AS i_gps_lat',
                'CAST(i_gps_lon AS CHAR(50)) AS i_gps_lon',
                'CONCAT(i_gps_lat, ",", i_gps_lon) AS i_gps_loc',
                'location.l_name AS l_lochirarchietxt',
                'CAST(location.l_id AS CHAR(50)) AS l_lochirarchieids',
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
                    selectField: 'CONCAT("ac_", kategorie.k_type)',
                    selectFrom: 'image INNER JOIN kategorie ON kategorie.k_id=image.k_id'
                },
                'data_tech_alt_asc_facet_is': {
                    selectField: 'ROUND((k_altitude_asc / 500))*500',
                    selectFrom: 'image INNER JOIN kategorie ON kategorie.k_id=image.k_id'
                },
                'data_tech_alt_max_facet_is': {
                    selectField: 'ROUND((i_gps_ele / 500))*500'
                },
                'data_tech_dist_facets_fs': {
                    selectField: 'ROUND((k_distance / 5))*5',
                    selectFrom: 'image INNER JOIN kategorie ON kategorie.k_id=image.k_id'
                },
                'data_tech_dur_facet_fs': {
                    selectField: 'ROUND(ROUND(TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 * 2) / 2, 1)',
                    selectFrom: 'image INNER JOIN kategorie ON kategorie.k_id=image.k_id'
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
                    selectSql: 'SELECT COUNT(*) AS count, l_name AS value' +
                    ' FROM image INNER JOIN kategorie ON kategorie.k_id=image.k_id ' +
                    '   INNER JOIN location ON location.l_id = kategorie.l_id ' +
                    ' GROUP BY l_name' +
                    ' ORDER BY count DESC',
                    filterField: 'l_name',
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
                    selectFrom: 'image INNER JOIN kategorie ON kategorie.k_id=image.k_id'
                },
                'rate_tech_overall_ss': {
                    noFacet: true
                },
                'subtype_ss': {
                    selectField: 'CONCAT("ac_", kategorie.k_type)',
                    selectFrom: 'image INNER JOIN kategorie ON kategorie.k_id=image.k_id'
                },
                'type_txt': {
                    constValues: ['image', 'track', 'route', 'location', 'trip', 'news'],
                    filterField: '"image"'
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
                'relevance': 'i_date DESC'
            },
            spartialConfig: {
                lat: 'i_gps_lat',
                lon: 'i_gps_lon'
            },
            filterMapping: {
                id: 'image.i_id',
                image_id_i: 'image.i_id',
                image_id_is: 'image.i_id',
                route_id_i: 'kategorie.t_id',
                route_id_is: 'kategorie.t_id',
                track_id_i: 'image.k_id',
                track_id_is: 'image.k_id',
                loc_lochirarchie_ids_txt: 'location.l_id',
                l_lochirarchietxt: 'location.l_name',
                html: 'CONCAT(i_meta_name, " ", l_name)'
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
                desc_txt: 'i_meta_shortdesc',
                desc_md_txt: 'i_meta_shortdesc_md',
                desc_html_txt: 'i_meta_shortdesc_html',
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
                name_s: 'i_meta_name',
                type_s: 'type',
                actiontype_ss: 'k_type',
                subtype_s: 'subtype_s',
                i_fav_url_txt: 'i_fav_url_txt'
            }
        },
        'route': {
            tableName: 'tour',
            selectFrom: 'tour INNER JOIN location ON tour.l_id = location.l_id ' +
            'LEFT JOIN tour_keyword ON tour.t_id=tour_keyword.t_id ' +
            'LEFT JOIN keyword ON tour_keyword.kw_id=keyword.kw_id',
            groupbBySelectFieldList: true,
            groupbBySelectFieldListIgnore: ['t_keywords'],
            selectFieldList: [
                '"ROUTE" AS type',
                'CONCAT("ac_", tour.t_typ) AS actiontype',
                'CONCAT("ac_", tour.t_typ) AS subtype',
                'CONCAT("ROUTE", "_", tour.t_id) AS id',
                'tour.k_id',
                'tour.t_id',
                'tour.l_id',
                't_name',
                'CONCAT(t_name, " ", t_meta_shortdesc, " ", l_name) AS html',
                't_datevon as t_date_show',
                't_datevon',
                'DATE_FORMAT(t_datevon, GET_FORMAT(DATE, "ISO")) AS dateonly',
                'WEEK(t_datevon) AS week',
                'MONTH(t_datevon) AS month',
                't_gpstracks_basefile',
                'GROUP_CONCAT(keyword.kw_name separator ", ") AS t_keywords',
                't_meta_shortdesc',
                't_meta_shortdesc AS t_meta_shortdesc_md',
                't_meta_shortdesc AS t_meta_shortdesc_html',
                't_rate_gesamt',
                'CAST(l_geo_latdeg AS CHAR(50)) AS t_gps_lat',
                'CAST(l_geo_longdeg AS CHAR(50)) AS t_gps_lon',
                'CONCAT(l_geo_latdeg, ",", l_geo_longdeg) AS t_gps_loc',
                'location.l_name AS l_lochirarchietxt',
                'CAST(location.l_id AS CHAR(50)) AS l_lochirarchieids',
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
                't_desc_fuehrer as guides',
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
                    selectField: 'ROUND((t_route_m / 500))*500'
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
                    selectSql: 'SELECT COUNt(*) AS count, l_name AS value' +
                    ' FROM tour INNER JOIN location ON tour.l_id = location.l_id ' +
                    ' GROUP BY l_name' +
                    ' ORDER BY count DESC',
                    filterField: 'l_name',
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
                    filterField: '"route"'
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
                'relevance': 't_datevon DESC'
            },
            spartialConfig: {
                lat: 'l_geo_latdeg',
                lon: 'l_geo_longdeg'
            },
            filterMapping: {
                id: 'tour.t_id',
                route_id_i: 'tour.t_id',
                route_id_is: 'tour.t_id',
                loc_id_i: 'tour.l_id',
                loc_id_is: 'tour.l_id',
                loc_lochirarchie_ids_txt: 'location.l_id',
                l_lochirarchietxt: 'location.l_name',
                html: 'CONCAT(t_name, " ", t_meta_shortdesc, " ", l_name)'
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
            selectFrom: 'location ' +
                        'LEFT JOIN location_keyword ON location.l_id=location_keyword.l_id ' +
                        'LEFT JOIN keyword ON location_keyword.kw_id=keyword.kw_id',
            groupbBySelectFieldList: true,
            groupbBySelectFieldListIgnore: ['l_keywords'],
            selectFieldList: [
                '"LOCATION" AS type',
                'CONCAT(location.l_typ) AS subtype',
                'CONCAT("LOCATION", "_", location.l_id) AS id',
                'location.l_id',
                'l_name',
                'CONCAT(l_name, " ", l_meta_shortdesc) AS html',
                'GROUP_CONCAT(keyword.kw_name separator ", ") AS l_keywords',
                'l_meta_shortdesc',
                'l_meta_shortdesc AS l_meta_shortdesc_md',
                'l_meta_shortdesc AS l_meta_shortdesc_html',
                'CAST(l_geo_latdeg AS CHAR(50)) AS l_gps_lat',
                'CAST(l_geo_longdeg AS CHAR(50)) AS l_gps_lon',
                'CONCAT(l_geo_latdeg, ",", l_geo_longdeg) AS l_gps_loc',
                'location.l_name AS l_lochirarchietxt',
                'CAST(location.l_id AS CHAR(50)) AS l_lochirarchieids'],
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
                    selectField: 'location.l_parent_id'
                },
                'loc_lochirarchie_txt': {
                    selectSql: 'SELECT COUNt(*) AS count, l_name AS value' +
                    ' FROM location' +
                    ' GROUP BY l_name' +
                    ' ORDER BY count DESC',
                    filterField: 'l_name',
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
                    filterField: '"location"'
                },
                'week_is': {
                    noFacet: true
                }
            },
            sortMapping: {
                'distance': 'geodist ASC',
                'location': 'l_name ASC',
                'relevance': 'l_name ASC'
            },
            spartialConfig: {
                lat: 'l_geo_latdeg',
                lon: 'l_geo_longdeg'
            },
            filterMapping: {
                id: 'location.l_id',
                loc_id_i: 'location.l_id',
                loc_id_is: 'location.l_id',
                loc_parent_id_i: 'l_parent_id',
                html: 'CONCAT(l_name, " ", l_meta_shortdesc)'
            },
            fieldMapping: {
                id: 'id',
                loc_id_i: 'l_id',
                loc_id_is: 'l_id',
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
                'CONCAT(tr_name, " ", tr_meta_shortdesc) AS html',
                'tr_datevon AS tr_dateshow',
                'tr_datevon',
                'tr_datebis',
                'DATE_FORMAT(tr_datevon, GET_FORMAT(DATE, "ISO")) AS dateonly',
                'WEEK(tr_datevon) AS week',
                'MONTH(tr_datevon) AS month',
                'tr_meta_shortdesc',
                'tr_meta_shortdesc AS tr_meta_shortdesc_md',
                'tr_meta_shortdesc AS tr_meta_shortdesc_html'],
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
                    noFacet: true
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
                    filterField: '"trip"'
                },
                'week_is': {
                    selectField: 'WEEK(tr_datevon)'
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
                loc_lochirarchie_ids_txt: '"dummy"',
                l_lochirarchietxt: 'location.l_name',
                html: 'CONCAT(tr_name, " ", tr_meta_shortdesc)'
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
            tableName: 'musik.news',
            selectFrom: 'musik.news',
            selectFieldList: [
                '"NEWS" AS type',
                'CONCAT("NEWS", "_", news.n_id) AS id',
                'news.n_id',
                'n_headline',
                'CONCAT(n_headline, " ", n_message) AS html',
                'n_date',
//                'n_datevon',
//                'n_datebis',
                'DATE_FORMAT(n_date, GET_FORMAT(DATE, "ISO")) AS dateonly',
                'WEEK(n_date) AS week',
                'MONTH(n_date) AS month',
                'n_message',
                'n_message AS n_message_md',
                'n_message AS n_message_html'],
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
                    filterField: '"trip"'
                },
                'week_is': {
                    selectField: 'WEEK(n_date)'
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
                track_id_i: '"dummy"',
                loc_lochirarchie_ids_txt: '"dummy"',
                l_lochirarchietxt: 'location.l_name',
                html: 'CONCAT(n_headline, " ", n_message)'
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

    protected getTableConfig(method: string, mapper: Mapper, params: any, opts: any, query: any): TableConfig {
        return SDocSqlMediadbAdapter.tableConfigs[this.extractTable(method, mapper, params, opts)];
    }

    protected getTableConfigForTable(table: string): TableConfig {
        return SDocSqlMediadbAdapter.tableConfigs[table];
    }

    protected extractTable(method: string, mapper: Mapper, params: any, opts: any): string {
        const types = params.where['type_txt'];
        if (types !== undefined && types.in !== undefined && types.in.length === 1) {
            const tabName = types.in[0];
            if (SDocSqlMediadbAdapter.tableConfigs[tabName] !== undefined) {
                return tabName;
            }

            return undefined;
        }
        const ids = params.where['id'];
        if (ids !== undefined && ids.in !== undefined && ids.in.length === 1) {
            const tabName = ids.in[0].replace(/_.*/, '').toLowerCase();
            if (SDocSqlMediadbAdapter.tableConfigs[tabName] !== undefined) {
                return tabName;
            }

            return undefined;
        }

        return undefined;
    }

    protected mapFilterToAdapterQuery(mapper: Mapper, fieldName: string, action: string, value: any, table: string): string {
        if (fieldName === 'type_txt') {
            return undefined;
        }

        if (fieldName === 'id') {
            return super.mapFilterToAdapterQuery(mapper, 'id', action,
                [this.mapperUtils.prepareSingleValue(value, '_').replace(/.*_/, '')], table);
        }

        return super.mapFilterToAdapterQuery(mapper, fieldName, action, value, table);
    }

    protected mapToAdapterFieldName(table, fieldName: string): string {
        switch (fieldName) {
            case 'name':
                return this.mapperUtils.mapToAdapterFieldName(this.getMappingForTable(table), 'name_s');
            case 'descTxt':
                return this.mapperUtils.mapToAdapterFieldName(this.getMappingForTable(table), 'desc_txt');
            case 'type_txt':
                return undefined;
            default:
                break;
        }

        return this.mapperUtils.mapToAdapterFieldName(this.getMappingForTable(table), fieldName);
    }

    getAdapterFields(method: string, mapper: Mapper, params: any, opts: any, query: any): string[] {
        const fields = super.getAdapterFields(method, mapper, params, opts, query);
        if (method === 'count') {
            return fields;
        }

        if (opts.loadTrack === true) {
//            fields.push(this.mapper.mapToAdapterFieldName('gpstrack_s'));
        }

        return fields;
    }
}

