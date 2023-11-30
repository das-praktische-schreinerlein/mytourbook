import {TableConfig} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {AdapterFilterActions} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';

export class SqlMytbDbDestinationConfig {
    public static readonly tableConfig: TableConfig = {
        key: 'destination',
        tableName: 'destination',
        selectFrom: 'destination LEFT JOIN location_hirarchical as location ON destination.l_id = location.l_id ',
        optionalGroupBy: [
            {
                from: 'LEFT JOIN tour dtour ON destination.d_id in (dtour.t_calced_d_id)',
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
                    'LEFT JOIN tour t ON destination.d_id in (t.t_calced_d_id) ' +
                    'LEFT JOIN kategorie_tour kt ON kt.t_id=t.t_id ' +
                    'LEFT JOIN kategorie k ON k.k_id=kt.k_id OR k.t_id=t.t_id ',
                triggerParams: ['track_id_i', 'track_id_is'],
                groupByFields: []
            },
            {
                from: 'LEFT JOIN tour ntour ON destination.d_id=ntour.t_calced_d_id ' +
                    'LEFT JOIN kategorie_tour kt_kt ON ntour.t_id=kt_kt.t_id ' +
                    'LEFT JOIN kategorie kt_k ON kt_kt.k_id=kt_k.k_id OR ntour.t_id=kt_k.t_id ' +
                    'LEFT JOIN news kt_news ON kt_k.k_datevon >= kt_news.n_datevon AND kt_k.k_datevon <= kt_news.n_datebis ',
                triggerParams: ['news_id_i', 'news_id_is'],
                groupByFields: ['kt_news.n_id']
            },
            {
                from: 'LEFT JOIN tour trtour ON destination.d_id=trtour.t_calced_d_id ' +
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
                sql: 'SELECT i_calced_path AS i_fav_url_txt ' +
                    'FROM destination ' +
                    ' INNER JOIN tour ON destination.d_id=tour.t_calced_d_id ' +
                    ' INNER JOIN kategorie ON tour.k_id=kategorie.k_id ' +
                    ' INNER JOIN image ON kategorie.k_id=image.k_id ' +
                    ' INNER JOIN image_playlist ON image.i_id=image_playlist.i_id ' +
                    'WHERE destination.d_id IN (":id") and p_id in (18) ' +
                    'ORDER BY I_RATE_MOTIVE DESC, I_RATE_WICHTIGKEIT DESC, I_RATE DESC, kategorie.k_rate_gesamt DESC, image.I_ID DESC ' +
                    'LIMIT 1',
                parameterNames: ['id']
            },
            {
                profile: 'keywords',
                sql: 'select GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS keywords ' +
                    'FROM destination ' +
                    ' INNER JOIN tour ON destination.d_id=tour.t_calced_d_id ' +
                    ' INNER JOIN tour_keyword ON tour.t_id=tour_keyword.t_id' +
                    ' INNER JOIN keyword ON tour_keyword.kw_id=keyword.kw_id ' +
                    'WHERE destination.d_id IN (":id")',
                parameterNames: ['id'],
                modes: ['full']
            }
        ],
        selectFieldList: [
            'DISTINCT "DESTINATION" AS type',
            'd_calced_actiontype AS actiontype',
            'd_calced_actiontype AS subtype',
            'd_calced_id AS id',
            'destination.d_id',
            'destination.l_id',
            'd_name',
            'd_datefirst AS d_dateshow',
            'd_datefirst',
            'DATE_FORMAT(d_datefirst, GET_FORMAT(DATE, "ISO")) AS dateonly',
            'WEEK(d_datefirst) AS week',
            'MONTH(d_datefirst) AS month',
            'YEAR(d_datefirst) AS year',
            'l_calced_gps_lat AS d_gps_lat',
            'l_calced_gps_lon AS d_gps_lon',
            'l_calced_gps_loc AS d_gps_loc',
            'l_lochirarchietxt AS l_lochirarchietxt',
            'l_lochirarchieids AS l_lochirarchieids',
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
            'd_calced_altAscFacet AS altAscFacet',
            'd_calced_altMaxFacet AS altMaxFacet',
            'd_calced_distFacet AS distFacet',
            'd_route_dauer',
            'd_calced_durFacet AS durFacet'],
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
                filterField: 'destination.d_calced_id',
                action: AdapterFilterActions.NOTIN
            },
            'actiontype_ss': {
                selectField: 'destination.d_calced_actiontype'
            },
            'blocked_is': {
                noFacet: true
            },
            'data_tech_alt_asc_facet_is': {
                selectField: 'd_calced_altAscFacet',
                orderBy: 'value asc'
            },
            'data_tech_alt_max_facet_is': {
                selectField: 'd_calced_altMaxFacet',
                orderBy: 'value asc'
            },
            'data_tech_dist_facets_fs': {
                selectField: 'd_calced_distFacet',
                orderBy: 'value asc'
            },
            'data_tech_dur_facet_fs': {
                selectField: 'd_calced_durFacet',
                orderBy: 'value asc'
            },
            'data_tech_sections_facet_ss': {
                noFacet: true
            },
            'data_info_region_s': {
                selectField: 'destination.d_desc_gebiet',
                orderBy: 'value asc'
            },
            'done_ss': {
                selectField: 'CONCAT("DONE", (d_datefirst IS NOT NULL))',
                orderBy: 'value asc'
            },
            'gpstracks_state_is': {
                noFacet: true
            },
            'info_id_is': {
                filterFields: ['tif.if_id'],
                action: AdapterFilterActions.IN_NUMBER
            },
            'initial_s': {
                selectSql: 'SELECT COUNT(*) as count, ' +
                    ' SUBSTR(UPPER(d_name), 1, 1) as value ' +
                    'FROM destination ' +
                    'WHERE LENGTH(d_name) > 0 ' +
                    'GROUP BY SUBSTR(UPPER(d_name), 1, 1)' +
                    'ORDER BY value',
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
                    ' l_lochirarchietxt AS label, location.l_id AS id' +
                    ' FROM location_hirarchical as location LEFT JOIN destination ON destination.l_id = location.l_id ' +
                    ' GROUP BY value, label, id' +
                    ' ORDER BY label ASC',
                triggerTables: ['location', 'tour'],
                filterField: 'GetTechName(l_lochirarchietxt)',
                action: AdapterFilterActions.LIKE
            },
            'month_is': {
                selectField: 'MONTH(d_datefirst)',
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
            'route_attr_ss': {
                noFacet: true
            },
            'route_attr_txt': {
                noFacet: true
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
            'type_ss': {
                constValues: ['route', 'track', 'image', 'odimgobject', 'video', 'location', 'trip', 'news', 'destination', 'info', 'playlist', 'poi'],
                filterField: '"destination"',
                selectLimit: 1
            },
            'week_is': {
                selectField: 'WEEK(d_datefirst)',
                orderBy: 'value asc'
            },
            'year_is': {
                selectField: 'YEAR(d_datefirst)',
                orderBy: 'value asc'
            },
            // statistics
            'statistics': {
                selectSql: 'select CONCAT(typ, "-", type, "-", year) as value, count' +
                    '         from (' +
                    '                  select \'DESTINATION_DONE\' as typ, type, year, count(*) count' +
                    '                  from (' +
                    '                           select distinct t.t_calced_statisticname_actiontype as name,' +
                    '                                           t_calced_actiontype as type,' +
                    '                                           YEAR(K_DATEVON) as year,' +
                    '                                           K_DATEVON' +
                    '                           from kategorie k' +
                    '                                    inner join kategorie_tour kt on k.K_ID = kt.K_ID' +
                    '                                    inner join tour t on kt.t_ID = t.t_ID' +
                    '                           where kt.t_id > 1' +
                    '                             and kt.t_id not in (1, 1681)' +
                    '                             and DATE(k_datevon) > DATE(t_datefirst)' +
                    '' +
                    '                           union all' +
                    '' +
                    '                           select distinct t.t_calced_statisticname_actiontype as name,' +
                    '                                           t_calced_actiontype as type,' +
                    '                                           YEAR(K_DATEVON) as year,' +
                    '                                           K_DATEVON' +
                    '                           from kategorie k' +
                    '                                    inner join tour t on k.t_ID = t.t_ID' +
                    '                           where t.t_id > 1' +
                    '                             and t.t_id not in (1, 1681)' +
                    '                             and DATE(k_datevon) > DATE(t_datefirst)' +
                    '' +
                    '                           union all' +
                    '' +
                    '                           select distinct t_calced_statisticname_ele as name,' +
                    '                                           CONCAT("ele_", t_calced_altMaxFacet) as type,' +
                    '                                           YEAR(K_DATEVON) as year,' +
                    '                                           K_DATEVON' +
                    '                           from kategorie k' +
                    '                                    inner join kategorie_tour kt on k.K_ID = kt.K_ID' +
                    '                                    inner join tour t on kt.t_ID = t.t_ID' +
                    '                           where kt.t_id > 1' +
                    '                             and kt.t_id not in (1, 1681)' +
                    '                             and DATE(k_datevon) > DATE(t_datefirst)' +
                    '                             and t_ele_max is not null' +
                    '' +
                    '                           union all' +
                    '' +
                    '                           select distinct t_calced_statisticname_ele as name,' +
                    '                                           CONCAT("ele_", t_calced_altMaxFacet) as type,' +
                    '                                           YEAR(K_DATEVON) as year,' +
                    '                                           K_DATEVON' +
                    '                           from kategorie k' +
                    '                                    inner join tour t on k.t_ID = t.t_ID' +
                    '                           where t.t_id > 1' +
                    '                             and t.t_id not in (1, 1681)' +
                    '                             and DATE(k_datevon) > DATE(t_datefirst)' +
                    '                             and t_ele_max is not null' +
                    '                       ) x' +
                    '                  where year is not null' +
                    '                  group by type, year' +
                    '' +
                    '                  UNION' +
                    '' +
                    '                  select \'DESTINATION_DONE\' as typ, type, \'ALLOVER\' year, count(*) count' +
                    '                  from (' +
                    '                           select distinct t.t_calced_statisticname_actiontype as name,' +
                    '                                t_calced_actiontype as type,' +
'                                                    K_DATEVON' +
                    '                           from kategorie k' +
                    '                                    inner join kategorie_tour kt on k.K_ID = kt.K_ID' +
                    '                                    inner join tour t on kt.t_ID = t.t_ID' +
                    '                           where kt.t_id > 1' +
                    '                             and kt.t_id not in (1, 1681)' +
                    '                             and DATE(k_datevon) > DATE(t_datefirst)' +
                    '' +
                    '                           union all' +
                    '' +
                    '                           select distinct t.t_calced_statisticname_actiontype as name,' +
                    '                                t_calced_actiontype as type,' +
                '                                    K_DATEVON' +
                    '                           from kategorie k' +
                    '                                    inner join tour t on k.t_ID = t.t_ID' +
                    '                           where t.t_id > 1' +
                    '                             and t.t_id not in (1, 1681)' +
                    '                             and DATE(k_datevon) > DATE(t_datefirst)' +
                    '' +
                    '                           union all' +
                    '' +
                    '                           select distinct t_calced_statisticname_ele as name,' +
                    '                               CONCAT("ele_", t_calced_altMaxFacet) as type,' +
                    '                               K_DATEVON' +
                    '                           from kategorie k' +
                    '                                    inner join kategorie_tour kt on k.K_ID = kt.K_ID' +
                    '                                    inner join tour t on kt.t_ID = t.t_ID' +
                    '                           where kt.t_id > 1' +
                    '                             and kt.t_id not in (1, 1681)' +
                    '                             and DATE(k_datevon) > DATE(t_datefirst)' +
                    '                             and t_ele_max is not null' +
                    '' +
                    '                           union all' +
                    '' +
                    '                           select distinct t_calced_statisticname_ele as name,' +
                    '                               CONCAT("ele_", t_calced_altMaxFacet) as type,' +
                    '                               K_DATEVON' +
                    '                           from kategorie k' +
                    '                                    inner join tour t on k.t_ID = t.t_ID' +
                    '                           where t.t_id > 1' +
                    '                             and t.t_id not in (1, 1681)' +
                    '                             and DATE(k_datevon) > DATE(t_datefirst)' +
                    '                             and t_ele_max is not null' +
                    '                       ) x' +
                    '                  group by type' +
                    '' +
                    '                  UNION' +
                    '' +
                    '                  select \'DESTINATION_NEW\' as typ, type, year, count(*) count' +
                    '                  from (' +
                    '                           select distinct t.t_calced_statisticname_actiontype as name,' +
                    '                                           t_calced_actiontype as type,' +
                    '                                           min(YEAR(t_datefirst)) year' +
                    '                           from tour t' +
                    '                           where t.t_id > 1' +
                    '                             and t.t_id not in (1, 1681)' +
                    '                             and t_datefirst is not null' +
                    '                           group by name, type' +
                    '' +
                    '                           union all' +
                    '' +
                    '                           select distinct t_calced_statisticname_ele as name,' +
                    '                                           CONCAT("ele_", t_calced_altMaxFacet) as type,' +
                    '                                           min(YEAR(t_datefirst)) year' +
                    '                           from tour t' +
                    '                           where t.t_id > 1' +
                    '                             and t.t_id not in (1, 1681)' +
                    '                             and t_datefirst is not null' +
                    '                             and t_ele_max is not null' +
                    '                           group by name, type' +
                    '                       ) x' +
                    '                  where year is not null' +
                    '                  group by type, year' +
                    '' +
                    '                  UNION' +
                    '' +
                    '                  select \'DESTINATION_NEW\' as typ, type, \'ALLOVER\' year, count(*) count' +
                    '                  from (' +
                    '                           select distinct t.t_calced_statisticname_actiontype as name,' +
                    '                                           t_calced_actiontype as type,' +
                    '                                           min(YEAR(t_datefirst)) year' +
                    '                           from tour t' +
                    '                           where t.t_id > 1' +
                    '                             and t.t_id not in (1, 1681)' +
                    '                             and t_datefirst is not null' +
                    '                           group by name, type' +
                    '' +
                    '                           union all' +
                    '' +
                    '                           select distinct t_calced_statisticname_ele as name,' +
                    '                                           CONCAT("ele_", t_calced_altMaxFacet) as type,' +
                    '                                           min(YEAR(t_datefirst)) year' +
                    '                           from tour t' +
                    '                           where t.t_id > 1' +
                    '                             and t.t_id not in (1, 1681)' +
                    '                             and t_datefirst is not null' +
                    '                             and t_ele_max is not null' +
                    '                           group by name, type' +
                    '                       ) x' +
                    '                  group by type' +
                    '              ) allover' +
                    '        order by value, count',
                triggerTables: ['tour', 'kategorie_tour']
            }
        },
        sortMapping: {
            'date': 'd_datefirst DESC, d_name ASC',
            'dateAsc': 'd_datefirst ASC, d_name ASC',
            'distance': 'geodist ASC, d_name ASC',
            'dataTechDurDesc': 'd_route_dauer DESC, d_name ASC',
            'dataTechAltDesc': 'd_route_hm DESC, d_name ASC',
            'dataTechMaxDesc': 'd_ele_max DESC, d_name ASC',
            'dataTechDistDesc': 'd_route_m DESC, d_name ASC',
            'dataTechDurAsc': 'd_route_dauer ASC, d_name ASC',
            'dataTechAltAsc': 'd_route_hm ASC, d_name ASC',
            'dataTechMaxAsc': 'd_ele_max ASC, d_name ASC',
            'dataTechDistAsc': 'd_route_m ASC, d_name ASC',
            'forExport': 'destination.d_id ASC, d_name ASC',
            'ratePers': 'd_rate_gesamt DESC, d_datefirst DESC, d_name ASC',
            'name': 'd_name ASC',
            'location': 'l_lochirarchietxt ASC, d_name ASC',
            'locationDetails': 'l_lochirarchietxt ASC',
            'relevance': 'd_datefirst DESC, d_name ASC'
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
            noMetaOnly: '"666dummy999"',
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
            poi_id_i: '"666dummy999"',
            poi_id_is: '"666dummy999"',
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
            gpstracks_state_is: '"666dummy999"',
            initial_s: 'SUBSTR(UPPER(d_name), 1, 1)',
            html: 'CONCAT(d_name, " ", COALESCE(d_desc_gebiet, ""), " ", l_lochirarchietxt)'
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
            datestart_dt: 'd_datefirst',
            dateend_dt: 'd_datelast',
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

