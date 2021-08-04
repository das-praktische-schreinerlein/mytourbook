import {TableConfig} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {AdapterFilterActions} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';

export class SqlMytbDbDestinationConfig {
    public static readonly tableConfig: TableConfig = {
        key: 'destination',
        tableName: 'destination',
        selectFrom: 'destination LEFT JOIN location ON destination.l_id = location.l_id ',
        optionalGroupBy: [
            {
                from: 'LEFT JOIN tour dtour ON destination.d_id in (MD5(CONCAT(dtour.l_id, "_", dtour.t_desc_gebiet, "_", dtour.t_desc_ziel, "_", dtour.t_typ)))',
                triggerParams: ['route_id_i', 'route_id_is', 'info_id_i', 'info_id_is'],
                groupByFields: []
            },
            {
                from: 'LEFT JOIN tour_info ON dtour.t_id=tour_info.t_id ' +
                    'LEFT JOIN info tif ON tour_info.if_id=tif.if_id ',
                triggerParams: ['info_id_i', 'info_id_is'],
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
                    'LEFT JOIN kategorie kt_k ON kt_kt.k_id=kt_k.k_id OR ntour.t_id=kt_k.t_id ' +
                    'LEFT JOIN news kt_news ON kt_k.k_datevon >= kt_news.n_datevon AND kt_k.k_datevon <= kt_news.n_datebis ',
                triggerParams: ['news_id_i', 'news_id_is'],
                groupByFields: ['kt_news.n_id']
            },
            {
                from: 'LEFT JOIN tour trtour ON destination.d_id=MD5(CONCAT(trtour.l_id, "_", trtour.t_desc_gebiet, "_", trtour.t_desc_ziel, "_", trtour.t_typ)) ' +
                    'LEFT JOIN kategorie_tour kt_kt ON trtour.t_id=kt_kt.t_id ' +
                    'LEFT JOIN kategorie kt_k ON kt_kt.k_id=kt_k.k_id OR kt_k.t_id=trtour.t_id ' +
                    'LEFT JOIN trip kt_trip ON kt_k.tr_id=kt_trip.tr_id',
                triggerParams: ['trip_id_i', 'trip_id_is'],
                groupByFields: ['kt_trip.tr_id']
            }
        ],
        groupbBySelectFieldListIgnore: ['t_keywords'],
        loadDetailData: [
            {
                profile: 'image',
                sql: 'SELECT CONCAT(image.i_dir, "/", image.i_file) AS i_fav_url_txt ' +
                    'FROM destination ' +
                    ' INNER JOIN tour ON destination.d_id=MD5(CONCAT(tour.l_id, "_", t_desc_gebiet, "_", t_desc_ziel, "_", t_typ)) ' +
                    ' INNER JOIN kategorie ON tour.k_id=kategorie.k_id ' +
                    ' INNER JOIN image ON kategorie.k_id=image.k_id ' +
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
                    ' INNER JOIN keyword ON tour_keyword.kw_id=keyword.kw_id ' +
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
            'CONCAT(d_name, " ", COALESCE(d_desc_gebiet, ""), " ", l_name) AS html',
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
            'info_id_is': {
                filterFields: ['tif.if_id'],
                action: AdapterFilterActions.IN_NUMBER
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
                filterFields: ['kt_news.n_id'],
                action: AdapterFilterActions.IN_NUMBER
            },
            'news_id_is': {
                filterFields: ['kt_news.n_id'],
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
                filterFields: ['kt_trip.tr_id'],
                action: AdapterFilterActions.IN_NUMBER
            },
            'trip_id_is': {
                filterFields: ['kt_trip.tr_id'],
                action: AdapterFilterActions.IN_NUMBER
            },
            'type_txt': {
                constValues: ['route', 'track', 'image', 'odimgobject', 'video', 'location', 'trip', 'news', 'destination', 'info'],
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
            },
            // statistics
            'statistics': {
                selectSql: 'select CONCAT(typ, "-", type, "-", year) as value, count' +
                    '         from (' +
                    '                  select \'DESTINATION_DONE\' typ, type, year, count(*) count' +
                    '                  from (' +
                    '                           select distinct CONCAT(t.l_id, "_", t.t_desc_gebiet, "_", t.t_desc_ziel, "_", t.t_typ)     as name,' +
                    '                                           T_TYP           as type,' +
                    '                                           year(K_DATEVON) as year,' +
                    '                                           K_DATEVON' +
                    '                           from kategorie k' +
                    '                                    inner join kategorie_tour kt on k.K_ID = kt.K_ID' +
                    '                                    inner join tour t on kt.t_ID = t.t_ID' +
                    '                           where kt.t_id > 1' +
                    '                             and kt.t_id not in (1, 1681)' +
                    '                             and DATE(k_datevon) > DATE(t_datevon)' +
                    '' +
                    '                           union all' +
                    '' +
                    '                           select distinct CONCAT(t.l_id, "_", t.t_desc_gebiet, "_", t.t_desc_ziel, "_", t.t_typ)     as name,' +
                    '                                           T_TYP           as type,' +
                    '                                           year(K_DATEVON) as year,' +
                    '                                           K_DATEVON' +
                    '                           from kategorie k' +
                    '                                    inner join tour t on k.t_ID = t.t_ID' +
                    '                           where t.t_id > 1' +
                    '                             and t.t_id not in (1, 1681)' +
                    '                             and DATE(k_datevon) > DATE(t_datevon)' +
                    '                       ) x' +
                    '                  where year is not null' +
                    '                  group by type, year' +
                    '' +
                    '                  UNION' +
                    '' +
                    '                  select \'DESTINATION_DONE\' typ, type, \'ALLOVER\' year, count(*) count' +
                    '                  from (' +
                    '                           select distinct CONCAT(t.l_id, "_", t.t_desc_gebiet, "_", t.t_desc_ziel, "_", t.t_typ) as name, T_TYP as type, K_DATEVON' +
                    '                           from kategorie k' +
                    '                                    inner join kategorie_tour kt on k.K_ID = kt.K_ID' +
                    '                                    inner join tour t on kt.t_ID = t.t_ID' +
                    '                           where kt.t_id > 1' +
                    '                             and kt.t_id not in (1, 1681)' +
                    '                             and DATE(k_datevon) > DATE(t_datevon)' +
                    '' +
                    '                           union all' +
                    '' +
                    '                           select distinct CONCAT(t.l_id, "_", t.t_desc_gebiet, "_", t.t_desc_ziel, "_", t.t_typ) as name, T_TYP as type, K_DATEVON' +
                    '                           from kategorie k' +
                    '                                    inner join tour t on k.t_ID = t.t_ID' +
                    '                           where t.t_id > 1' +
                    '                             and t.t_id not in (1, 1681)' +
                    '                             and DATE(k_datevon) > DATE(t_datevon)' +
                    '                       ) x' +
                    '                  group by type' +
                    '' +
                    '                  UNION' +
                    '' +
                    '                  select \'DESTINATION_NEW\' typ, type, year, count(*) count' +
                    '                  from (' +
                    '                           select distinct CONCAT(t.l_id, "_", t.t_desc_gebiet, "_", t.t_desc_ziel, "_", t.t_typ) as       name,' +
                    '                                           T_TYP       as       type,' +
                    '                                           min(year(t_DATEVON)) year' +
                    '                           from tour t' +
                    '                           where t.t_id > 1' +
                    '                             and t.t_id not in (1, 1681)' +
                    '                             and T_DATEVON is not null' +
                    '                           group by name, type' +
                    '                       ) x' +
                    '                  where year is not null' +
                    '                  group by type, year' +
                    '' +
                    '                  UNION' +
                    '' +
                    '                  select \'DESTINATION_NEW\' typ, type, \'ALLOVER\' year, count(*) count' +
                    '                  from (' +
                    '                           select distinct CONCAT(t.l_id, "_", t.t_desc_gebiet, "_", t.t_desc_ziel, "_", t.t_typ) as       name,' +
                    '                                           T_TYP       as       type,' +
                    '                                           min(year(t_DATEVON)) year' +
                    '                           from tour t' +
                    '                           where t.t_id > 1' +
                    '                             and t.t_id not in (1, 1681)' +
                    '                             and T_DATEVON is not null' +
                    '                           group by name, type' +
                    '                       ) x' +
                    '                  group by type' +
                    '              ) allover' +
                    '        order by value, count'
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
            'name': 'd_name ASC',
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
            image_id_is: '"666dummy999"',
            image_id_i: '"666dummy999"',
            info_id_i: '"666dummy999"',
            info_id_is: '"666dummy999"',
            route_id_i: 'dtour.t_id',
            route_id_is: 'dtour.t_id',
            track_id_i: 'k.k_id',
            track_id_is: 'k.k_id',
            video_id_is: '"666dummy999"',
            video_id_i: '"666dummy999"',
            trip_id_is: 'kt_trip.tr_id',
            trip_id_i: 'kt_trip.tr_id',
            loc_id_i: 'destination.l_id',
            loc_id_is: 'destination.l_id',
            loc_lochirarchie_ids_txt: 'location.l_id',
            l_lochirarchietxt: 'location.l_name',
            html: 'CONCAT(d_name, " ", COALESCE(d_desc_gebiet, ""), " ", l_name)'
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

