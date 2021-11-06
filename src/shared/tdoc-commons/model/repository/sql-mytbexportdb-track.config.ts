import {TableConfig} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {AdapterFilterActions} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';

export class SqlMytbExportDbTrackConfig {
    public static readonly tableConfig: TableConfig = {
        key: 'track',
        tableName: 'kategorie_full',
        selectFrom: 'kategorie_full LEFT JOIN location ON location.l_id = kategorie_full.l_id ' +
            'LEFT JOIN image ON kategorie_full.i_id=image.i_id',
        loadDetailData: [
            {
                profile: 'image',
                sql: 'SELECT CONCAT(image.i_dir, "/", image.i_file) AS i_fav_url_txt ' +
                    'FROM image' +
                    'WHERE image.k_id in (:id)',
                parameterNames: ['id']
            },
            {
                profile: 'navigation_objects',
                sql: '(SELECT CONCAT("navid=TRACK_", k_id, ":::name=", COALESCE(k_name, "null"), ":::navtype=", "PREDECESSOR")' +
                    '  AS navigation_objects' +
                    '  FROM kategorie_full WHERE k_datevon < (SELECT k_datevon FROM kategorie_full WHERE k_id IN (:id))' +
                    '  ORDER BY k_datevon DESC, k_id DESC LIMIT 1) ' +
                    'UNION ' +
                    ' (SELECT CONCAT("navid=TRACK_", k_id, ":::name=", COALESCE(k_name, "null"), ":::navtype=", "SUCCESSOR")' +
                    '  AS navigation_objects' +
                    '  FROM kategorie_full WHERE k_datevon > (SELECT k_datevon FROM kategorie_full WHERE k_id IN (:id))' +
                    '   ORDER BY k_datevon, k_id LIMIT 1)',
                parameterNames: ['id'],
                modes: ['details']
            }
        ],
        selectFieldList: [
            '"TRACK" AS type',
            'CONCAT("ac_", kategorie_full.k_type) AS actiontype',
            'CONCAT("ac_", kategorie_full.k_type) AS subtype',
            'CONCAT("TRACK", "_", kategorie_full.k_id) AS id',
            'kategorie_full.i_id',
            'kategorie_full.k_id',
            'kategorie_full.d_id',
            'kategorie_full.k_d_ids',
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
            'id_notin_is': {
                filterField: 'CONCAT("TRACK", "_", kategorie_full.k_id) AS id',
                action: AdapterFilterActions.NOTIN
            },
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
            'done_ss': {
                selectField: 'CONCAT("DONE", (k_datevon IS NOT NULL))',
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
                selectSql: 'SELECT COUNT(*) AS count, GetTechName(l_name) AS value, REPLACE(l_lochirarchietxt, ",,", " -> ") AS label' +
                    ' FROM location LEFT JOIN kategorie_full ON kategorie_full.l_id = location.l_id ' +
                    ' GROUP BY value, label' +
                    ' ORDER BY count DESC, label ASC',
                filterField: 'GetTechName(l_name)',
                action: AdapterFilterActions.IN
            },
            'month_is': {
                selectField: 'MONTH(k_datevon)',
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
            'route_attr_ss': {
                noFacet: true
            },
            'route_attr_txt': {
                noFacet: true
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
            'subtype_ss': {
                selectField: 'CONCAT("ac_", kategorie_full.k_type)'
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
                constValues: ['track', 'route', 'image', 'video', 'location', 'trip', 'news', 'destination'],
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
            'forExport': 'k_datevon ASC',
            'ratePers': 'k_rate_gesamt DESC, k_datevon DESC',
            'location': 'l_lochirarchietxt ASC',
            'relevance': 'k_datevon DESC'
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
            id: 'kategorie_full.k_id',
            destination_id_s: 'kategorie_full.d_id',
            destination_id_ss: 'kategorie_full.d_id',
            loc_id_i: 'kategorie_full.l_id',
            loc_id_is: 'kategorie_full.l_id',
            route_id_i: 'kategorie_full.t_id',
            route_id_is: 'kategorie_full.t_id',
            track_id_i: 'kategorie_full.k_id',
            track_id_is: 'kategorie_full.k_id',
            video_id_is: '"666dummy999"',
            video_id_i: '"666dummy999"',
            loc_lochirarchie_ids_txt: 'location.l_id',
            l_lochirarchietxt: 'location.l_name',
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
    };
}

