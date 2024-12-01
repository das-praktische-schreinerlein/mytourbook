import {TableConfig} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {AdapterFilterActions} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';

export class SqlMytbExportDbNewsConfig {
    public static readonly tableConfig: TableConfig = {
        key: 'news',
        tableName: 'news',
        selectFrom: 'news LEFT JOIN kategorie_full ON kategorie_full.n_id = news.n_id',
        groupbBySelectFieldList: true,
        groupbBySelectFieldListIgnore: ['k_altitude_asc_sum', 'k_altitude_desc_sum', 'k_distance_sum',
            'k_altitude_min', 'k_altitude_max'
        ],
        loadDetailData: [
            {
                profile: 'image',
                sql: 'SELECT CONCAT(image.i_dir, "/", image.i_file) AS i_fav_url_txt ' +
                    'FROM news' +
                    ' INNER JOIN kategorie_full on kategorie_full.n_id=news.n_id' +
                    ' INNER JOIN image on kategorie_full.i_id=image.i_id ' +
                    'WHERE news.n_id in (:id) order by i_rate desc limit 0, 1',
                parameterNames: ['id'],
                modes: ['details', 'full', 'commonsearch', 'commoninlinesearch']
            },
            {
                profile: 'navigation_objects',
                sql: '(SELECT CONCAT("navid=NEWS_", n_id, ":::name=", COALESCE(n_headline, "null"), ":::navtype=", "PREDECESSOR")' +
                    '  AS navigation_objects' +
                    '  FROM news WHERE n_datevon < (SELECT n_datevon FROM news WHERE n_id IN (:id))' +
                    '  ORDER BY n_datevon DESC, n_id DESC LIMIT 1) ' +
                    'UNION ' +
                    ' (SELECT CONCAT("navid=NEWS_", n_id, ":::name=", COALESCE(n_headline, "null"), ":::navtype=", "SUCCESSOR")' +
                    '  AS navigation_objects' +
                    '  FROM news WHERE n_datevon > (SELECT n_datevon FROM news WHERE n_id IN (:id))' +
                    '   ORDER BY n_datevon, n_id LIMIT 1)',
                parameterNames: ['id'],
                modes: ['details']
            }
        ],
        selectFieldList: [
            '"NEWS" AS type',
            'CONCAT("NEWS", "_", news.n_id) AS id',
            'news.n_id',
            'n_headline',
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
            'id_notin_is': {
                filterField: 'CONCAT("NEWS", "_", news.n_id)',
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
            'data_tech_sections_facet_ss': {
                noFacet: true
            },
            'done_ss': {
                selectField: 'CONCAT("DONE", (n_date IS NOT NULL))',
                orderBy: 'value asc'
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
            'route_attr_txt': {
                noFacet: true
            },
            'subtype_ss': {
                noFacet: true
            },
            'type_ss': {
                constValues: ['trip', 'location', 'track', 'route', 'image', 'video', 'news', 'destination'],
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
            'relevance': 'n_date DESC'
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
            id: 'news.n_id',
            news_id_i: 'news.n_id',
            news_id_is: 'news.n_id',
            image_id_i: '"666dummy999"',
            image_id_is: '"666dummy999"',
            video_id_is: '"666dummy999"',
            video_id_i: '"666dummy999"',
            track_id_i: '"666dummy999"',
            track_id_is: '"666dummy999"',
            trip_id_i: '"666dummy999"',
            trip_id_is: '"666dummy999"',
            location_id_is: '"666dummy999"',
            route_id_i: '"666dummy999"',
            route_id_is: '"666dummy999"',
            loc_lochirarchie_ids_txt: '"666dummy999"',
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
    };
}

