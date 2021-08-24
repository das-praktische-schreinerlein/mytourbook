import {TableConfig} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {AdapterFilterActions} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';

export class SqlMytbExportDbTripConfig {
    public static readonly tableConfig: TableConfig = {
        key: 'trip',
        tableName: 'trip',
        selectFrom: 'trip LEFT JOIN kategorie_full ON kategorie_full.tr_id = trip.tr_id',
        groupbBySelectFieldList: true,
        groupbBySelectFieldListIgnore: ['k_altitude_asc_sum', 'k_altitude_desc_sum', 'k_distance_sum',
            'k_altitude_min', 'k_altitude_max'
        ],
        loadDetailData: [
            {
                profile: 'image',
                sql: 'SELECT CONCAT(image.i_dir, "/", image.i_file) AS i_fav_url_txt ' +
                    'FROM trip INNER JOIN kategorie_full on trip.tr_id=kategorie_full.tr_id' +
                    ' INNER JOIN image on kategorie_full.i_id=image.i_id ' +
                    'WHERE trip.tr_id in (:id) order by i_rate desc limit 0, 1',
                parameterNames: ['id']
            },
            {
                profile: 'navigation_objects',
                sql: '(SELECT CONCAT("navid=TRIP_", tr_id, ":::name=", COALESCE(tr_name, "null"), ":::navtype=", "PREDECESSOR")' +
                    '  AS navigation_objects' +
                    '  FROM trip WHERE tr_datevon < (SELECT tr_datevon FROM trip WHERE tr_id IN (:id))' +
                    '  ORDER BY tr_datevon DESC, tr_id DESC LIMIT 1) ' +
                    'UNION ' +
                    ' (SELECT CONCAT("navid=TRIP_", tr_id, ":::name=", COALESCE(tr_name, "null"), ":::navtype=", "SUCCESSOR")' +
                    '  AS navigation_objects' +
                    '  FROM trip WHERE tr_datevon > (SELECT tr_datevon FROM trip WHERE tr_id IN (:id))' +
                    '   ORDER BY tr_datevon, tr_id LIMIT 1)',
                parameterNames: ['id'],
                modes: ['details']
            }
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
// common
            'id_notin_is': {
                filterField: 'CONCAT("TRIP", "_", trip.tr_id)',
                action: AdapterFilterActions.NOTIN
            },
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
            'done_ss': {
                selectField: 'CONCAT("DONE", (tr_datevon IS NOT NULL))',
                orderBy: 'value asc'
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
                noFacet: true
            },
            'rate_pers_schwierigkeit_is': {
                noFacet: true
            },
            'rate_tech_overall_ss': {
                noFacet: true
            },
            'route_attr_ss': {
                noFacet: true
            },
            'route_attr_parts_ss': {
                noFacet: true
            },
            'subtype_ss': {
                noFacet: true
            },
            'type_txt': {
                constValues: ['trip', 'location', 'track', 'route', 'image', 'video', 'news', 'destination'],
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
            'relevance': 'tr_datevon DESC'
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
            id: 'trip.tr_id',
            trip_id_i: 'trip.tr_id',
            trip_id_is: 'trip.tr_id',
            video_id_is: '"666dummy999"',
            video_id_i: '"666dummy999"',
            image_id_is: '"666dummy999"',
            image_id_i: '"666dummy999"',
            track_id_is: '"666dummy999"',
            track_id_i: '"666dummy999"',
            destination_id_s: '"666dummy999"',
            destination_id_ss: '"666dummy999"',
            route_id_is: '"666dummy999"',
            loc_id_i: 'trip.l_id',
            loc_id_is: 'trip.l_id',
            news_id_is: '"666dummy999"',
            loc_lochirarchie_ids_txt: '"666dummy999"',
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
    };
}

