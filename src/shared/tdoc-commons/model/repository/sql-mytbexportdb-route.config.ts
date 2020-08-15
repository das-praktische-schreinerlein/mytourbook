import {TableConfig} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {AdapterFilterActions} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';

export class SqlMytbExportDbRouteConfig {
    public static readonly tableConfig: TableConfig = {
        key: 'route',
        tableName: 'tour',
        selectFrom: 'tour LEFT JOIN location ON tour.l_id = location.l_id' +
            ' LEFT JOIN kategorie_full on tour.t_id = kategorie_full.t_id',
        loadDetailData: [
            {
                profile: 'image',
                sql: 'SELECT CONCAT(image.i_dir, "/", image.i_file) AS i_fav_url_txt ' +
                    'FROM image INNER JOIN kategorie_full ON kategorie_full.i_id=image.i_id ' +
                    ' INNER JOIN tour ON kategorie_full.k_id=tour.k_id ' +
                    'WHERE tour.t_id in (:id)',
                parameterNames: ['id']
            },
            {
                profile: 'navigation_objects',
                sql: '(SELECT CONCAT("navid=ROUTE_", t_id, ":::name=", COALESCE(t_name, "null"), ":::navtype=", "PREDECESSOR")' +
                    '  AS navigation_objects' +
                    '  FROM tour LEFT JOIN location ON tour.l_id = location.l_id' +
                    '  WHERE CONCAT(L_lochirarchietxt, t_name) <' +
                    '      (SELECT CONCAT(L_lochirarchietxt, t_name) FROM tour ' +
                    '       LEFT JOIN location ON tour.l_id = location.l_id WHERE t_id IN (:id))' +
                    '  ORDER BY CONCAT(L_lochirarchietxt, t_name) DESC, t_id DESC LIMIT 1) ' +
                    'UNION ' +
                    ' (SELECT CONCAT("navid=ROUTE_", t_id, ":::name=", COALESCE(t_name, "null"), ":::navtype=", "SUCCESSOR")' +
                    '  AS navigation_objects' +
                    '  FROM tour LEFT JOIN location ON tour.l_id = location.l_id' +
                    '   WHERE CONCAT(L_lochirarchietxt, t_name) >' +
                    '      (SELECT CONCAT(L_lochirarchietxt, t_name) FROM tour' +
                    '       LEFT JOIN location ON tour.l_id = location.l_id WHERE t_id IN (:id))' +
                    '   ORDER BY CONCAT(L_lochirarchietxt, t_name), t_id LIMIT 1)',
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
            'tour.d_id',
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
            // common
            'id_notin_is': {
                filterField: 'CONCAT("ROUTE", "_", tour.t_id)',
                action: AdapterFilterActions.NOTIN
            },
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
            'done_ss': {
                selectField: 'CONCAT("DONE", (t_datevon IS NOT NULL))',
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
                selectSql: 'SELECT COUNt(*) AS count, GetTechName(l_name) AS value, REPLACE(l_lochirarchietxt, ",,", " -> ") AS label' +
                    ' FROM location LEFT JOIN tour ON tour.l_id = location.l_id ' +
                    ' GROUP BY value, label' +
                    ' ORDER BY count DESC, label ASC',
                filterField: 'GetTechName(l_name)',
                action: AdapterFilterActions.IN
            },
            'month_is': {
                selectField: 'MONTH(t_datevon)',
                orderBy: 'value asc'
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
            'trip_id_i': {
                filterFields: ['kategorie_full.tr_id'],
                action: AdapterFilterActions.IN_NUMBER
            },
            'trip_id_is': {
                filterFields: ['kategorie_full.tr_id'],
                action: AdapterFilterActions.IN_NUMBER
            },
            'type_txt': {
                constValues: ['route', 'track', 'image', 'video', 'location', 'trip', 'news', 'destination'],
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
            lat: 't_gps_lat',
            lon: 't_gps_lon',
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
            id: 'tour.t_id',
            route_id_i: 'tour.t_id',
            route_id_is: 'tour.t_id',
            destination_id_s: 'tour.d_id',
            destination_id_ss: 'tour.d_id',
            news_id_i: '"666dummy999"',
            news_id_is: '"666dummy999"',
            trip_id_is: '"666dummy999"',
            loc_id_i: 'tour.l_id',
            loc_id_is: 'tour.l_id',
            loc_lochirarchie_ids_txt: 'location.l_id',
            l_lochirarchietxt: 'location.l_name',
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
    };
}

