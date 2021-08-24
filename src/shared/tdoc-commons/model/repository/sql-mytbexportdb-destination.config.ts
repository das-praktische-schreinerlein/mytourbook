import {TableConfig} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {AdapterFilterActions} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';

export class SqlMytbExportDbDestinationConfig {
    public static readonly tableConfig: TableConfig = {
        key: 'destination',
        tableName: 'destination',
        selectFrom: 'destination LEFT JOIN location ON destination.l_id = location.l_id ',
        optionalGroupBy: [
        ],
        groupbBySelectFieldListIgnore: ['t_keywords'],
        loadDetailData: [
            {
                profile: 'image',
                sql: 'SELECT CONCAT(image.i_dir, "/", image.i_file) AS i_fav_url_txt ' +
                    'FROM destination ' +
                    ' INNER JOIN tour ON destination.d_id=tour.d_id ' +
                    ' INNER JOIN kategorie_full on tour.k_id=kategorie_full.k_id ' +
                    ' INNER JOIN image on kategorie_full.k_id=image.k_id ' +
                    'WHERE destination.d_id IN (":id")',
                parameterNames: ['id']
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
            'CAST(l_gps_lat AS CHAR(50)) AS d_gps_lat',
            'CAST(l_gps_lon AS CHAR(50)) AS d_gps_lon',
            'CONCAT(l_gps_lat, ",", l_gps_lon) AS d_gps_loc',
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
                    '  SUBSTRING_INDEX(SUBSTRING_INDEX(destination.d_keywords, ",", numbers.n), ",", -1) AS value ' +
                    ' FROM' +
                    '  (SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL' +
                    '   SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL' +
                    '   SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL ' +
                    '   SELECT 14 UNION ALL SELECT 15 UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL' +
                    '   SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20) ' +
                    '  numbers INNER JOIN destination ON ' +
                    '   CHAR_LENGTH(destination.d_keywords) - CHAR_LENGTH(REPLACE(destination.d_keywords, ",", "")) >= numbers.n - 1' +
                    '  GROUP BY count, value' +
                    '  ORDER BY value',
                filterField: 'd_keywords',
                action: AdapterFilterActions.LIKEIN
            },
            'loc_id_i': {
                noFacet: true
            },
            'loc_lochirarchie_txt': {
                selectSql: 'SELECT COUNt(*) AS count, GetTechName(l_name) AS value, REPLACE(l_lochirarchietxt, ",,", " -> ") AS label' +
                    ' FROM location LEFT JOIN destination ON destination.l_id = location.l_id ' +
                    ' GROUP BY value, label' +
                    ' ORDER BY count DESC, label ASC',
                filterField: 'GetTechName(l_name)',
                action: AdapterFilterActions.IN
            },
            'month_is': {
                selectField: 'MONTH(d_datevon)',
                orderBy: 'value asc'
            },
            'news_id_i': {
                filterFields: ['kategorie_full.n_id', 'kategorie_full.n_id'],
                action: AdapterFilterActions.IN_NUMBER
            },
            'news_id_is': {
                filterFields: ['kategorie_full.n_id', 'kategorie_full.n_id'],
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
            'route_attr_ss': {
                noFacet: true
            },
            'route_attr_parts_ss': {
                noFacet: true
            },
            'subtype_ss': {
                selectField: 'd_typ',
                orderBy: 'value asc'
            },
            'route_id_i': {
                filterFields: ['destination.d_t_ids'],
                action: AdapterFilterActions.IN_CSV
            },
            'route_id_is': {
                filterFields: ['destination.d_t_ids'],
                action: AdapterFilterActions.IN_CSV
            },
            'track_id_i': {
                filterFields: ['destination.d_k_ids'],
                action: AdapterFilterActions.IN_CSV
            },
            'track_id_is': {
                filterFields: ['destination.d_k_ids'],
                action: AdapterFilterActions.IN_CSV
            },
            'type_txt': {
                constValues: ['route', 'track', 'image', 'video', 'location', 'trip', 'news', 'destination'],
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
            lat: 'l_gps_lat',
            lon: 'l_gps_lon',
            spatialField: 'geodist',
            spatialSortKey: 'distance'
        },
        filterMapping: {
            // common
            id: 'destination.d_id',
            video_id_is: '"666dummy999"',
            video_id_i: '"666dummy999"',
            loc_id_i: 'destination.l_id',
            loc_id_is: 'destination.l_id',
            trip_id_is: '"666dummy999"',
            trip_id_i: '"666dummy999"',
            loc_lochirarchie_ids_txt: 'location.l_id',
            l_lochirarchietxt: 'location.l_name',
            html: 'CONCAT(d_name, " ", l_name)'
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
    };
}

