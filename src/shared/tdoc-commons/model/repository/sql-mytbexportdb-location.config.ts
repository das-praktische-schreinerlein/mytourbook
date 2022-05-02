import {TableConfig} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {AdapterFilterActions} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';

export class SqlMytbExportDbLocationConfig {
    public static readonly tableConfig: TableConfig = {
        key: 'location',
        tableName: 'location',
        selectFrom: 'location',
        loadDetailData: [
            {
                profile: 'image',
                sql: 'SELECT CONCAT(image.i_dir, "/", image.i_file) AS i_fav_url_txt ' +
                    'FROM image INNER JOIN kategorie_full ON kategorie_full.i_id=image.i_id ' +
                    'WHERE kategorie_full.k_id in (:id) order by i_rate desc limit 0, 1',
                parameterNames: ['id']
            },
            {
                profile: 'navigation_objects',
                sql: '(SELECT CONCAT("navid=LOCATION_", l_id, ":::name=", COALESCE(l_name, "null"), ":::navtype=", "PREDECESSOR")' +
                    '  AS navigation_objects, l_lochirarchietxt' +
                    '  FROM location WHERE l_lochirarchietxt <' +
                    '      (SELECT l_lochirarchietxt FROM location WHERE l_id IN (:id))' +
                    '  ORDER BY l_lochirarchietxt DESC, l_id DESC LIMIT 1) ' +
                    'UNION ' +
                    ' (SELECT CONCAT("navid=LOCATION_", l_id, ":::name=", COALESCE(l_name, "null"), ":::navtype=", "SUCCESSOR")' +
                    '  AS navigation_objects, l_lochirarchietxt' +
                    '  FROM location WHERE l_lochirarchietxt >' +
                    '      (SELECT l_lochirarchietxt FROM location WHERE l_id IN (:id))' +
                    '  ORDER BY l_lochirarchietxt, l_id LIMIT 1)',
                parameterNames: ['id'],
                modes: ['details']
            }
        ],
        selectFieldList: [
            '"LOCATION" AS type',
            'location.l_typ',
            'CONCAT("loc_", l_typ) AS subtype',
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
// common
            'id_notin_is': {
                filterField: 'CONCAT("LOCATION", "_", location.l_id)',
                action: AdapterFilterActions.NOTIN
            },
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
            'data_tech_sections_facet_ss': {
                noFacet: true
            },
            'done_ss': {
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
                selectSql: 'SELECT COUNt(*) AS count, GetTechName(l_name) AS value, REPLACE(l_lochirarchietxt, ",,", " -> ") AS label' +
                    ' FROM location' +
                    ' GROUP BY value, label' +
                    ' ORDER BY count DESC, label ASC',
                filterField: 'GetTechName(l_name)',
                action: AdapterFilterActions.IN
            },
            'month_is': {
                noFacet: true
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
            'tes_ss': {
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
            'type_txt': {
                constValues: ['location', 'track', 'route', 'trip', 'image', 'video', 'news', 'destination'],
                filterField: '"location"',
                selectLimit: 1
            },
            'week_is': {
                noFacet: true
            },
            'year_is': {
                noFacet: true
            }
        },
        sortMapping: {
            'distance': 'geodist ASC',
            'location': 'l_lochirarchietxt ASC',
            'locationDetails': 'l_lochirarchietxt ASC',
            'relevance': 'l_lochirarchietxt ASC'
        },
        spartialConfig: {
            lat: 'l_gps_lat',
            lon: 'l_gps_lon',
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
            id: 'location.l_id',
            loc_id_i: 'location.l_id',
            loc_id_is: 'location.l_id',
            loc_parent_id_i: 'l_parent_id',
            news_id_is: '"666dummy999"',
            trip_id_is: '"666dummy999"',
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
            distance: 'geodist',
            geo_lon_s: 'l_gps_lon',
            geo_lat_s: 'l_gps_lat',
            geo_loc_p: 'l_gps_loc',
            keywords_txt: 'l_keywords',
            loc_lochirarchie_s: 'l_lochirarchietxt',
            loc_lochirarchie_ids_s: 'l_lochirarchieids',
            name_s: 'l_name',
            type_s: 'type',
            subtype_s: 'subtype'
        }
    };
}

