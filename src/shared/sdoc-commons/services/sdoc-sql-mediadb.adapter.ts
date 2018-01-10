import {SDocRecord} from '../model/records/sdoc-record';
import {SDocSearchForm} from '../model/forms/sdoc-searchform';
import {SDocSearchResult} from '../model/container/sdoc-searchresult';
import {GenericSqlAdapter} from '../../search-commons/services/generic-sql.adapter';
import {SDocAdapterResponseMapper} from './sdoc-adapter-response.mapper';
import {TableConfig, WriteQueryData} from '../../search-commons/services/sql-query.builder';
import {AdapterFilterActions, AdapterQuery} from '../../search-commons/services/mapper.utils';
import {Facet, Facets} from '../../search-commons/model/container/facets';
import {Mapper} from 'js-data';
import {SDocImageRecord} from '../model/records/sdocimage-record';

export class SDocSqlMediadbAdapter extends GenericSqlAdapter<SDocRecord, SDocSearchForm, SDocSearchResult> {
    public static tableConfigs = {
        'track': {
            tableName: 'kategorie',
            selectFrom: 'kategorie LEFT JOIN location ON location.l_id = kategorie.l_id ',
//                        'LEFT JOIN image ON kategorie.i_id=image.i_id ' +
            optionalGroupBy: [
                {
                    from: 'LEFT JOIN kategorie_keyword ON kategorie.k_id=kategorie_keyword.k_id ' +
                          'LEFT JOIN keyword ON kategorie_keyword.kw_id=keyword.kw_id',
                    triggerParams: ['id', 'keywords_txt'],
                    groupByFields: ['GROUP_CONCAT(keyword.kw_name separator ", ") AS k_keywords']
                }
            ],
            groupbBySelectFieldListIgnore: ['k_keywords'],
            loadDetailData: [
                {
                    profile: 'image',
                    // TODO: check security
                    sql: 'SELECT CONCAT(image.i_dir, "/", image.i_file) AS i_fav_url_txt ' +
                         'FROM image INNER JOIN image_playlist ON image.i_id=image_playlist.i_id ' +
                         'WHERE image.k_id in (:id) and p_id in (18)',
                    parameterNames: ['id']
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
                'CONCAT(k_name, " ", k_meta_shortdesc, " ", l_name) AS html',
                'k_datevon AS k_dateshow',
                'k_datevon',
                'k_datebis',
                'DATE_FORMAT(k_datevon, GET_FORMAT(DATE, "ISO")) AS dateonly',
                'WEEK(k_datevon) AS week',
                'MONTH(k_datevon) AS month',
                'k_gpstracks_basefile',
                'k_meta_shortdesc',
                'k_meta_shortdesc AS k_meta_shortdesc_md',
                'k_meta_shortdesc AS k_meta_shortdesc_html',
                'CAST(l_geo_latdeg AS CHAR(50)) AS k_gps_lat',
                'CAST(l_geo_longdeg AS CHAR(50)) AS k_gps_lon',
                'CONCAT(l_geo_latdeg, ",", l_geo_longdeg) AS k_gps_loc',
                'location.l_name AS l_lochirarchietxt',
                'CAST(location.l_id AS CHAR(50)) AS l_lochirarchieids',
//                'CONCAT(image.i_dir, "/", image.i_file) as i_fav_url_txt',
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
                    selectField: 'CONCAT("ac_", kategorie.k_type)'
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
                    selectField: 'MONTH(k_datevon)',
                    orderBy: 'value asc'
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
                'type_txt': {
                    constValues: ['track', 'route', 'image', 'location', 'trip', 'news'],
                    filterField: '"track"',
                    selectLimit: 1
                },
                'week_is': {
                    selectField: 'WEEK(k_datevon)',
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
                news_id_is: '"dummy"',
                loc_lochirarchie_ids_txt: 'location.l_id',
                l_lochirarchietxt: 'location.l_name',
                html: 'CONCAT(k_name, " ", k_meta_shortdesc, " ", l_name)'
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
                //'kategorie.n_id': ':news_id_i:',
                //'kategorie.k_dateshow': ':dateshow_dt:',
                'kategorie.k_meta_shortdesc': ':desc_txt:',
                //'kategorie.k_meta_shortdesc_md': ':desc_md_txt:',
                //'kategorie.k_meta_shortdesc_html': ':desc_html_txt:',
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
                'kategorie.k_name': ':name_s:',
                'kategorie.k_type': ':actiontype:'
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
            tableName: 'image',
            selectFrom: 'image LEFT JOIN kategorie ON kategorie.k_id=image.k_id ' +
                        'LEFT JOIN location ON location.l_id = kategorie.l_id ',
            optionalGroupBy: [
                {
                    from: 'LEFT JOIN image_keyword ON image.i_id=image_keyword.i_id ' +
                          'LEFT JOIN keyword ON image_keyword.kw_id=keyword.kw_id',
                    triggerParams: ['id', 'keywords_txt'],
                    groupByFields: ['GROUP_CONCAT(keyword.kw_name separator ", ") AS i_keywords']
                }
            ],
            groupbBySelectFieldListIgnore: ['i_keywords'],
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
                'COALESCE(i_meta_name, k_name) as i_meta_name',
                'CONCAT(i_meta_name, " ", l_name) AS html',
                'i_date',
                'DATE_FORMAT(i_date, GET_FORMAT(DATE, "ISO")) AS dateonly',
                'WEEK(i_date) AS week',
                'MONTH(i_date) AS month',
                'k_gpstracks_basefile',
                'i_meta_shortdesc',
                'i_meta_shortdesc AS i_meta_shortdesc_md',
                'i_meta_shortdesc AS i_meta_shortdesc_html',
                'CAST(i_gps_lat AS CHAR(50)) AS i_gps_lat',
                'CAST(i_gps_lon AS CHAR(50)) AS i_gps_lon',
                'CONCAT(i_gps_lat, ",", i_gps_lon) AS i_gps_loc',
                'location.l_name AS l_lochirarchietxt',
                'CAST(location.l_id AS CHAR(50)) AS l_lochirarchieids',
                'CONCAT(image.i_dir, "/", image.i_file) as i_fav_url_txt',
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
                    selectField: 'CONCAT("ac_", kategorie.k_type)',
                    selectFrom: 'image INNER JOIN kategorie ON kategorie.k_id=image.k_id'
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
                    selectField: 'MONTH(i_date)',
                    orderBy: 'value asc'
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
                    constValues: ['image', 'track', 'route', 'location', 'trip', 'news'],
                    filterField: '"image"',
                    selectLimit: 1
                },
                'week_is': {
                    selectField: 'WEEK(i_date)',
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
                route_id_i: 'kategorie.t_id',
                route_id_is: 'kategorie.t_id',
                track_id_i: 'image.k_id',
                track_id_is: 'image.k_id',
                news_id_is: '"dummy"',
                loc_lochirarchie_ids_txt: 'location.l_id',
                l_lochirarchietxt: 'location.l_name',
                html: 'CONCAT(i_meta_name, " ", l_name)'
            },
            writeMapping: {
                'image.l_id': ':loc_id_i:',
                'image.k_id': ':track_id_i:',
                'image.i_date': ':dateshow_dt:',
                'image.i_meta_shortdesc': ':desc_txt:',
                //'image.i_meta_shortdesc_md': ':desc_md_txt:',
                //'image.i_meta_shortdesc_html': ':desc_html_txt:',
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
                dateshow_dt: 'i_date',
                desc_txt: 'i_meta_shortdesc',
                desc_md_txt: 'i_meta_shortdesc_md',
                desc_html_txt: 'i_meta_shortdesc_html',
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
                name_s: 'i_meta_name',
                type_s: 'type',
                actiontype_s: 'actionType',
                subtype_s: 'subtype',
                i_fav_url_txt: 'i_fav_url_txt'
            }
        },
        'route': {
            tableName: 'tour',
            selectFrom: 'tour LEFT JOIN location ON tour.l_id = location.l_id ',
            optionalGroupBy: [
                {
                    from: 'LEFT JOIN tour_keyword ON tour.t_id=tour_keyword.t_id ' +
                          'LEFT JOIN keyword ON tour_keyword.kw_id=keyword.kw_id',
                    triggerParams: ['id', 'keywords_txt'],
                    groupByFields: ['GROUP_CONCAT(keyword.kw_name separator ", ") AS t_keywords']
                }
            ],
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
                't_meta_shortdesc',
                't_meta_shortdesc AS t_meta_shortdesc_md',
                't_meta_shortdesc AS t_meta_shortdesc_html',
                't_rate_gesamt',
                'CAST(l_geo_latdeg AS CHAR(50)) AS t_gps_lat',
                'CAST(l_geo_longdeg AS CHAR(50)) AS t_gps_lon',
                'CONCAT(l_geo_latdeg, ",", l_geo_longdeg) AS t_gps_loc',
                'location.l_name AS l_lochirarchietxt',
                'CAST(location.l_id AS CHAR(50)) AS l_lochirarchieids',
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
                    selectField: 'MONTH(t_datevon)',
                    orderBy: 'value asc'
                },
                'rate_pers_gesamt_is': {
                    selectField: 't_rate_gesamt',
                    orderBy: 'value asc'
                },
                'rate_pers_schwierigkeit_is': {
                    selectField: 't_rate_schwierigkeit',
                    orderBy: 'value asc'
                },
                'rate_tech_overall_ss': {
                    selectField: 't_rate',
                    orderBy: 'value asc'
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
                    selectField: 'WEEK(t_datevon)',
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
                lat: 'l_geo_latdeg',
                lon: 'l_geo_longdeg',
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
                l_lochirarchietxt: 'location.l_name',
                html: 'CONCAT(t_name, " ", t_meta_shortdesc, " ", l_name)'
            },
            writeMapping: {
                'tour.l_id': ':loc_id_i:',
                'tour.k_id': ':track_id_i:',
                'tour.t_dateshow': ':dateshow_dt:',
                'tour.t_meta_shortdesc': ':desc_txt:',
                'tour.t_meta_shortdesc_md': ':desc_md_txt:',
                'tour.t_meta_shortdesc_html': ':desc_html_txt:',
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
                'tour.t_name': ':name_s:',
                'tour.t_typ': ':actiontype_s:'
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
            tableName: 'location',
            selectFrom: 'location ',
            optionalGroupBy: [
                {
                    from: 'LEFT JOIN location_keyword ON location.l_id=location_keyword.l_id ' +
                          'LEFT JOIN keyword ON location_keyword.kw_id=keyword.kw_id',
                    triggerParams: ['id', 'keywords_txt'],
                    groupByFields: ['GROUP_CONCAT(keyword.kw_name separator ", ") AS l_keywords']
                }
            ],
            groupbBySelectFieldListIgnore: ['l_keywords'],
            selectFieldList: [
                '"LOCATION" AS type',
                'location.l_typ',
                'CONCAT("loc_", l_typ) AS subtype',
                'CONCAT("LOCATION", "_", location.l_id) AS id',
                'location.l_id',
                'l_name',
                'CONCAT(l_name, " ", l_meta_shortdesc) AS html',
                'l_meta_shortdesc',
                'l_meta_shortdesc AS l_meta_shortdesc_md',
                'l_meta_shortdesc AS l_meta_shortdesc_html',
                'CAST(l_geo_latdeg AS CHAR(50)) AS l_geo_latdeg',
                'CAST(l_geo_longdeg AS CHAR(50)) AS l_geo_longdeg',
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
                    filterField: '"location"',
                    selectLimit: 1
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
                lon: 'l_geo_longdeg',
                spatialField: 'geodist',
                spatialSortKey: 'distance'
            },
            filterMapping: {
                id: 'location.l_id',
                loc_id_i: 'location.l_id',
                loc_id_is: 'location.l_id',
                loc_parent_id_i: 'l_parent_id',
                trip_id_is: '"dummy"',
                html: 'CONCAT(l_name, " ", l_meta_shortdesc)'
            },
            writeMapping: {
                'location.l_meta_shortdesc': ':desc_txt:',
                //'location.l_meta_shortdesc_md': ':desc_md_txt:',
                //'location.l_meta_shortdesc_html': ':desc_html_txt:',
                'location.l_geo_longdeg': ':geo_lon_s:',
                'location.l_geo_latdeg': ':geo_lat_s:',
                //'location.l_gps_loc': ':geo_loc_p:',
                'location.l_name': ':name_s:',
                'location.l_typ': ':subtype_s:'
            },
            fieldMapping: {
                id: 'id',
                loc_id_i: 'l_id',
                loc_id_is: 'l_id',
                desc_txt: 'l_meta_shortdesc',
                desc_md_txt: 'l_meta_shortdesc_md',
                desc_html_txt: 'l_meta_shortdesc_html',
                distance: 'geodist',
                geo_lon_s: 'l_geo_longdeg',
                geo_lat_s: 'l_geo_latdeg',
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
                'relevance': 'tr_datevon ASC'
            },
            filterMapping: {
                id: 'trip.tr_id',
                trip_id_i: 'trip.tr_id',
                trip_id_is: 'trip.tr_id',
                image_id_i: '"dummy"',
                track_id_i: '"dummy"',
                route_id_is: '"dummy"',
                news_id_is: '"dummy"',
                loc_lochirarchie_ids_txt: '"dummy"',
                l_lochirarchietxt: 'location.l_name',
                html: 'CONCAT(tr_name, " ", tr_meta_shortdesc)'
            },
            writeMapping: {
                'trip.tr_dateshow': ':dateshow_dt:',
                'trip.tr_meta_shortdesc': ':desc_txt:',
                'trip.tr_meta_shortdesc_md': ':desc_md_txt:',
                'trip.tr_meta_shortdesc_html': ':desc_html_txt:',
                'trip.tr_name': ':name_s:'
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
                type_s: 'type'
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
                'relevance': 'n_date ASC'
            },
            filterMapping: {
                id: 'news.n_id',
                news_id_i: 'news.n_id',
                news_id_is: 'news.n_id',
                image_id_i: '"dummy"',
                track_id_i: '"dummy"',
                trip_id_is: '"dummy"',
                loc_lochirarchie_ids_txt: '"dummy"',
                l_lochirarchietxt: 'location.l_name',
                html: 'CONCAT(n_headline, " ", n_message)'
            },
            writeMapping: {
                'news.n_date': ':dateshow_dt:',
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
                desc_txt: 'n_message',
                desc_md_txt: 'n_message_md',
                desc_html_txt: 'n_message_html',
                keywords_txt: 'n_keywords',
                name_s: 'n_headline',
                type_s: 'type'
            }
        }
    };

    constructor(config: any) {
        super(config, new SDocAdapterResponseMapper());
    }

    protected getTableConfig(params: AdapterQuery): TableConfig {
        return SDocSqlMediadbAdapter.tableConfigs[this.extractTable(params)];
    }

    protected getTableConfigForTable(table: string): TableConfig {
        return SDocSqlMediadbAdapter.tableConfigs[table];
    }

    protected getDefaultFacets(): Facets {
        const facets = new Facets();
        let facet = new Facet();
        facet.facet = ['trip', 'location', 'track', 'route', 'image', 'news'].map(value => {return [value, 0]; });
        facet.selectLimit = 1;
        facets.facets.set('type_txt', facet);
        facet = new Facet();
        facet.facet = ['relevance'].map(value => {return [value, 0]; });
        facets.facets.set('sorts', facet);

        return facets;
    }

    protected extractTable(params: AdapterQuery): string {
        if (params.where === undefined) {
            return undefined;
        }

        const types = params.where['type_txt'];
        if (types !== undefined && types.in !== undefined && types.in.length === 1) {
            const tabName = types.in[0].toLowerCase();
            if (SDocSqlMediadbAdapter.tableConfigs[tabName] !== undefined) {
                return tabName;
            }
            return undefined;
        }
        const ids = params.where['id'];
        if (ids !== undefined && ids.in_number !== undefined && ids.in_number.length === 1) {
            const tabName = ids.in_number[0].replace(/_.*/g, '').toLowerCase();
            if (SDocSqlMediadbAdapter.tableConfigs[tabName] !== undefined) {
                return tabName;
            }

            return undefined;
        }

        return undefined;
    }

    protected queryTransformToAdapterWriteQuery(method: string, mapper: Mapper, props: any, opts: any): WriteQueryData {
        const query = super.queryTransformToAdapterWriteQuery(method, mapper, props, opts);
        if (query.tableConfig.tableName === 'image') {
            let file = null;
            let dir = null;
            if (props.get('sdocimages') && props.get('sdocimages').length > 0) {
                const image: SDocImageRecord = props.get('sdocimages')[0];
                file = image.fileName.replace(/^.*\/(.*?)$/, '$1');
                dir = image.fileName.replace(/^(.*)\/(.*?)$/, '$1').replace(/\\/g, '/');
            }
            query.fields['i_dir'] = dir;
            query.fields['i_file'] = file;
        }

        return query;
    }
}

