import {TableConfig} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {ActionTagBlockTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-block.adapter';
import {ActionTagReplaceTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-replace.adapter';
import {ActionTagAssignTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-assign.adapter';
import {AdapterFilterActions} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';
import {TourDocSqlUtils} from '../../services/tdoc-sql.utils';
import {PlaylistModelConfigJoinType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-playlist.adapter';

export class SqlMytbDbTripConfig {
    public static readonly tableConfig: TableConfig = {
        key: 'trip',
        tableName: 'trip',
        selectFrom: 'trip LEFT JOIN kategorie ON kategorie.tr_id = trip.tr_id' +
            ' LEFT JOIN location ON location.l_id = trip.l_id',
        optionalGroupBy: [
            {
                from: 'LEFT JOIN kategorie_keyword ON kategorie.k_id=kategorie_keyword.k_id ' +
                    'LEFT JOIN keyword ON kategorie_keyword.kw_id=keyword.kw_id',
                triggerParams: ['id', 'keywords_txt'],
                groupByFields: ['GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS tr_keywords']
            },
            {
                from: 'LEFT JOIN trip_playlist ON trip.tr_id=trip_playlist.tr_id ' +
                    'LEFT JOIN playlist ON trip_playlist.p_id=playlist.p_id',
                triggerParams: ['playlists_txt', 'playlists_max_txt', 'playlistPos'],
                groupByFields: ['GROUP_CONCAT(DISTINCT playlist.p_name ORDER BY playlist.p_name SEPARATOR ", ") AS tr_playlists']
            },
            {
                from: 'LEFT JOIN kategorie_tour ON kategorie.k_id=kategorie_tour.k_id ' +
                    'LEFT JOIN tour kt ON kategorie_tour.t_id=kt.t_id ' +
                    'LEFT JOIN tour kt2 ON kategorie.t_id=kt2.t_id ' +
                    'LEFT JOIN destination dt ON dt.d_id in (MD5(CONCAT(kt.l_id, "_", kt.t_desc_gebiet, "_", kt.t_desc_ziel, "_", kt.t_typ)), ' +
                    '                                          MD5(CONCAT(kt2.l_id, "_", kt2.t_desc_gebiet, "_", kt2.t_desc_ziel, "_", kt2.t_typ)))',
                triggerParams: ['destination_id_s', 'destination_id_ss'],
                groupByFields: []
            },
            {
                from: 'LEFT JOIN news ON kategorie.k_datevon >= news.n_datevon AND kategorie.k_datevon <= news.n_datebis',
                triggerParams: ['news_id_i', 'news_id_is'],
                groupByFields: ['news.n_id']
            },
            {
                from: 'INNER JOIN (SELECT tr_id AS id FROM trip WHERE ' + TourDocSqlUtils.generateDoubletteNameSql('tr_name') +
                    '              IN (SELECT DISTINCT ' + TourDocSqlUtils.generateDoubletteNameSql('tr_name') + ' AS name' +
                    '                  FROM trip GROUP BY name HAVING COUNT(*) > 1)' +
                    '             ) doublettes' +
                    '             ON trip.tr_id=doublettes.id',
                triggerParams: ['doublettes'],
                groupByFields: []
            },
            {
                from: 'INNER JOIN (SELECT tr_id AS id FROM trip WHERE tr_id NOT IN (' +
                    '      SELECT DISTINCT tr_id FROM kategorie' +
                    '         WHERE k_id IN (SELECT DISTINCT k_ID FROM image WHERE i_rate >= k_rate_motive OR i_rate >= 9)' +
                    '         AND tr_id IS NOT NULL)) conflictingRates' +
                    '  ON trip.tr_id = conflictingRates.id',
                triggerParams: ['conflictingRates'],
                groupByFields: []
            },
            {
                from: 'INNER JOIN (SELECT tr_id AS id FROM kategorie' +
                    '       WHERE k_id IN' +
                    '           (SELECT DISTINCT k_ID FROM image WHERE i_rate = 0 OR i_rate IS NULL)) unRatedChildren' +
                    '   ON trip.tr_id=unRatedChildren.id',
                triggerParams: ['unRatedChildren'],
                groupByFields: []
            },
            {
                from: 'INNER JOIN (SELECT tr_id AS id FROM kategorie' +
                    '     WHERE k_id NOT IN ' +
                    '       (SELECT DISTINCT k_ID FROM image INNER JOIN image_playlist ON image.i_id=image_playlist.I_ID WHERE p_id IN ' +
                    '          (SELECT DISTINCT p_id FROM playlist WHERE p_name like "%kategorie_favorites%"))' +
                    '        AND k_id IN (SELECT DISTINCT k_ID FROM image WHERE i_rate = 0 OR i_rate IS NULL)) noMainFavoriteChildren' +
                    ' ON trip.tr_id=noMainFavoriteChildren.id',
                triggerParams: ['noMainFavoriteChildren'],
                groupByFields: []
            }
        ],
        groupbBySelectFieldList: true,
        groupbBySelectFieldListIgnore: ['tr_keywords', 'tr_playlists', 'k_altitude_asc_sum', 'k_altitude_desc_sum', 'k_distance_sum',
            'k_altitude_min', 'k_altitude_max'
        ],
        loadDetailData: [
            {
                profile: 'trip_playlist',
                sql: 'SELECT GROUP_CONCAT(DISTINCT playlist.p_name ORDER BY playlist.p_name SEPARATOR ", ") AS tr_playlists ' +
                    'FROM trip_playlist' +
                    ' INNER JOIN playlist ON trip_playlist.p_id=playlist.p_id ' +
                    'WHERE trip_playlist.tr_id IN (:id)',
                parameterNames: ['id']
            },
            {
                profile: 'image',
                sql: 'SELECT CONCAT(image.i_dir, "/", image.i_file) AS i_fav_url_txt ' +
                    'FROM kategorie' +
                    ' INNER JOIN image ON kategorie.k_id=image.k_id ' +
                    'WHERE kategorie.tr_id IN (:id) order by i_rate desc limit 0, 1',
                parameterNames: ['id']
            },
            {
                profile: 'extended_object_properties',
                sql: 'SELECT CONCAT("category=ENTITYCOUNT:::name=ROUTE_COUNT:::value=", CAST(COUNT(DISTINCT tour.t_id) AS CHAR)) AS extended_object_properties' +
                    '      FROM trip INNER JOIN kategorie ON trip.tr_id = kategorie.tr_id' +
                    '      LEFT JOIN kategorie_tour ON kategorie_tour.k_id = kategorie.k_id' +
                    '      INNER JOIN tour ON tour.t_id = kategorie.t_id OR tour.t_id = kategorie_tour.t_id' +
                    '      WHERE kategorie.tr_id IN (:id)' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=TRACK_COUNT:::value=", CAST(COUNT(DISTINCT kategorie.k_id) AS CHAR)) AS extended_object_properties' +
                    '      FROM kategorie ' +
                    '      WHERE kategorie.tr_id IN (:id)' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=IMAGE_COUNT:::value=", CAST(COUNT(DISTINCT image.i_id) AS CHAR)) AS extended_object_properties' +
                    '      FROM image INNER JOIN kategorie ON image.k_id = kategorie.k_id' +
                    '      WHERE kategorie.tr_id IN (:id)' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=IMAGE_TOP_COUNT:::value=", CAST(COUNT(DISTINCT image.i_id) AS CHAR)) AS extended_object_properties' +
                    '      FROM image INNER JOIN kategorie ON image.k_id = kategorie.k_id' +
                    '      WHERE kategorie.tr_id IN (:id) AND i_rate >= 6' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=IMAGE_FAV_COUNT:::value=", CAST(COUNT(DISTINCT image.i_id) AS CHAR)) AS extended_object_properties' +
                    '      FROM image INNER JOIN kategorie ON image.k_id = kategorie.k_id' +
                    '      WHERE kategorie.tr_id IN (:id) AND i_rate > 0' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=VIDEO_COUNT:::value=", CAST(COUNT(DISTINCT video.v_id) AS CHAR)) AS extended_object_properties' +
                    '      FROM video INNER JOIN kategorie ON video.k_id = kategorie.k_id' +
                    '      WHERE kategorie.tr_id IN (:id)',
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
            },
            {
                profile: 'linkedplaylists',
                sql: 'SELECT CONCAT("type=playlist:::name=", COALESCE(p_name, "null"), ":::refId=", CAST(playlist.p_id AS CHAR),' +
                    '   ":::position=", COALESCE(trip_playlist.trp_pos, "null"),   ":::details=", COALESCE(trip_playlist.trp_details, "null"))' +
                    '  AS linkedplaylists' +
                    '  FROM playlist INNER JOIN trip_playlist ON playlist.p_id = trip_playlist.p_id WHERE trip_playlist.tr_id IN (:id)' +
                    '  ORDER BY p_name',
                parameterNames: ['id']
            }
        ],
        selectFieldList: [
            '"TRIP" AS type',
            'CONCAT("TRIP", "_", trip.tr_id) AS id',
            'trip.tr_id',
            'trip.l_id',
            'trip.tr_name',
            'CONCAT(tr_name, " ", COALESCE(tr_meta_shortdesc,"")) AS html',
            'CAST(l_geo_latdeg AS CHAR(50)) AS tr_gps_lat',
            'CAST(l_geo_longdeg AS CHAR(50)) AS tr_gps_lon',
            'CONCAT(l_geo_latdeg, ",", l_geo_longdeg) AS tr_gps_loc',
            'GetLocationNameAncestry(location.l_id, location.l_name, " -> ") AS l_lochirarchietxt',
            'GetLocationIdAncestry(location.l_id, ",") AS l_lochirarchieids',
            'tr_datevon AS tr_dateshow',
            'tr_datevon',
            'tr_datebis',
            'DATE_FORMAT(tr_datevon, GET_FORMAT(DATE, "ISO")) AS dateonly',
            'WEEK(tr_datevon) AS week',
            'MONTH(tr_datevon) AS month',
            'YEAR(tr_datevon) AS year',
            'tr_gesperrt',
            'SUM(k_altitude_asc) AS k_altitude_asc_sum',
            'SUM(k_altitude_desc) AS k_altitude_desc_sum',
            'MIN(k_altitude_min) AS k_altitude_min',
            'MAX(k_altitude_max) AS k_altitude_max',
            'SUM(k_distance) AS k_distance_sum',
            'tr_meta_shortdesc',
            'tr_meta_shortdesc AS tr_meta_shortdesc_md'],
        facetConfigs: {
            // dashboard
            'doublettes': {
                selectSql: 'SELECT COUNT(trip.tr_id) AS count, "doublettes" AS value,' +
                    ' "doublettes" AS label, "true" AS id' +
                    ' FROM trip INNER JOIN (SELECT tr_id AS id FROM trip WHERE ' + TourDocSqlUtils.generateDoubletteNameSql('tr_name') +
                    '              IN (SELECT DISTINCT ' + TourDocSqlUtils.generateDoubletteNameSql('tr_name') + ' AS name' +
                    '                  FROM trip GROUP BY name HAVING COUNT(*) > 1)' +
                    '             ) doublettes' +
                    '             ON trip.tr_id=doublettes.id',
                cache: {
                    useCache: false
                }
            },
            'conflictingRates': {
                constValues: ['conflictingRates'],
                filterField: '"conflictingRates"'
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
                selectSql: 'SELECT COUNT(trip.tr_id) AS count, "noLocation" AS value,' +
                    ' "noLocation" AS label, "true" AS id' +
                    ' FROM trip WHERE l_id IS NULL OR l_id IN (0,1 )',
                filterField: 'trip.l_id',
                action: AdapterFilterActions.IN
            },
            'noMainFavoriteChildren': {
                selectSql: 'SELECT COUNT(DISTINCT kategorie.tr_id) AS count, "noMainFavoriteChildren" AS value,' +
                    ' "noMainFavoriteChildren" AS label, "true" AS id' +
                    ' FROM kategorie ' +
                    ' INNER JOIN (SELECT DISTINCT k_id AS id FROM kategorie WHERE k_id NOT IN ' +
                    '     (SELECT DISTINCT k_ID FROM image INNER JOIN image_playlist ON image.i_id=image_playlist.I_ID WHERE p_id IN ' +
                    '          (SELECT DISTINCT p_id FROM playlist WHERE p_name like "%kategorie_favorites%"))' +
                    '      AND k_id IN (SELECT DISTINCT k_ID FROM image WHERE i_rate = 0 OR i_rate IS NULL)) noMainFavoriteChildren' +
                    ' ON kategorie.k_id=noMainFavoriteChildren.id WHERE kategorie.tr_id IS NOT NULL',
                cache: {
                    useCache: false
                }
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
                selectSql: 'SELECT COUNT(trip.tr_id) AS count, "todoDesc" AS value,' +
                    ' "todoDesc" AS label, "true" AS id' +
                    ' FROM trip WHERE tr_meta_shortdesc LIKE "TODODESC%"',
                filterField: 'trip.tr_meta_shortdesc',
                action: AdapterFilterActions.LIKE
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
                selectSql: 'SELECT COUNT(DISTINCT kategorie.tr_id) AS count, "unRatedChildren" AS value,' +
                    ' "unRatedChildren" AS label, "true" AS id' +
                    ' FROM kategorie ' +
                    ' INNER JOIN (SELECT DISTINCT k_id AS id FROM kategorie WHERE k_id IN' +
                    '      (SELECT DISTINCT k_ID FROM image WHERE i_rate = 0 OR i_rate IS NULL)) unRatedChildren' +
                    '   ON kategorie.k_id=unRatedChildren.id WHERE kategorie.tr_id IS NOT NULL',
                cache: {
                    useCache: false
                }
            },
            // common
            'id_notin_is': {
                filterField: 'CONCAT("TRIP", "_", trip.tr_id)',
                action: AdapterFilterActions.NOTIN
            },
            'actiontype_ss': {
                noFacet: true
            },
            'blocked_is': {
                selectField: 'tr_gesperrt'
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
                noFacet: true
            },
            'loc_id_i': {
                noFacet: true
            },
            'loc_lochirarchie_txt': {
                selectSql: 'SELECT COUNt(trip.l_id) AS count, GetTechName(l_name) AS value,' +
                    ' GetLocationNameAncestry(location.l_id, location.l_name, " -> ") AS label, location.l_id AS id' +
                    ' FROM location LEFT JOIN trip ON trip.l_id = location.l_id ' +
                    ' GROUP BY value, label, id' +
                    ' ORDER BY label ASC',
                filterField: 'GetTechName(GetLocationNameAncestry(location.l_id, location.l_name, " -> "))',
                action: AdapterFilterActions.LIKE
            },
            'month_is': {
                selectField: 'MONTH(tr_datevon)'
            },
            'news_id_i': {
                filterFields: ['news.n_id'],
                action: AdapterFilterActions.IN_NUMBER
            },
            'news_id_is': {
                filterFields: ['news.n_id'],
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
                selectSql: 'SELECT 0 AS count, ' +
                    '  p_name AS value ' +
                    'FROM' +
                    ' playlist' +
                    ' GROUP BY count, value' +
                    ' ORDER BY value',
                filterField: 'p_name',
                action: AdapterFilterActions.IN
            },
            'playlists_max_txt': {
                selectSql: 'SELECT max(pos) AS count, ' +
                    '  p_name AS value ' +
                    'FROM' +
                    ' playlist LEFT OUTER JOIN all_entries_playlist_max ON playlist.p_id = all_entries_playlist_max.p_id' +
                    ' GROUP BY value' +
                    ' ORDER BY value',
                cache: {
                    useCache: false
                },
                filterField: 'p_name',
                action: AdapterFilterActions.IN
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
                constValues: ['trip', 'location', 'track', 'route', 'image', 'odimgobject', 'video', 'news', 'destination', 'info', 'playlist'],
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
            'countImages': '(SELECT COUNT(DISTINCT i_sort.i_id) FROM image i_sort' +
                '     INNER JOIN kategorie k_sort ON i_sort.k_id = k_sort.k_id' +
                '     WHERE k_sort.tr_id = trip.tr_id) ASC, tr_name ASC',
            'countImagesDesc': '(SELECT COUNT(DISTINCT i_sort.i_id) FROM image i_sort' +
                '     INNER JOIN kategorie k_sort ON i_sort.k_id = k_sort.k_id' +
                '     WHERE k_sort.tr_id = trip.tr_id) DESC, tr_name ASC',
            'countImagesTop': '(SELECT COUNT(DISTINCT i_sort.i_id) FROM image i_sort' +
                '     INNER JOIN kategorie k_sort ON i_sort.k_id = k_sort.k_id' +
                '     WHERE k_sort.tr_id = trip.tr_id AND i_sort.i_rate >= 6) ASC, tr_name ASC',
            'countImagesTopDesc': '(SELECT COUNT(DISTINCT i_sort.i_id) FROM image i_sort' +
                '     INNER JOIN kategorie k_sort ON i_sort.k_id = k_sort.k_id' +
                '     WHERE k_sort.tr_id = trip.tr_id AND i_sort.i_rate >= 6) DESC, tr_name ASC',
            'countRoutes': '(SELECT COUNT(DISTINCT t_sort.t_id) FROM kategorie k_sort' +
                '      LEFT JOIN kategorie_tour kt_sort ON kt_sort.k_id = k_sort.k_id' +
                '      INNER JOIN tour t_sort ON t_sort.t_id = k_sort.t_id OR t_sort.t_id = kt_sort.t_id' +
                '      WHERE k_sort.tr_id = trip.tr_id) ASC, tr_name ASC',
            'countRoutesDesc': '(SELECT COUNT(DISTINCT t_sort.t_id) FROM kategorie k_sort' +
                '      LEFT JOIN kategorie_tour kt_sort ON kt_sort.k_id = k_sort.k_id' +
                '      INNER JOIN tour t_sort ON t_sort.t_id = k_sort.t_id OR t_sort.t_id = kt_sort.t_id' +
                '      WHERE k_sort.tr_id = trip.tr_id) DESC, tr_name ASC',
            'countTracks': '(SELECT COUNT(DISTINCT k_sort.k_id) FROM kategorie k_sort ' +
                '     WHERE k_sort.tr_id = trip.tr_id) ASC, tr_name ASC',
            'countTracksDesc': '(SELECT COUNT(DISTINCT k_sort.k_id) FROM kategorie k_sort ' +
                '     WHERE k_sort.tr_id = trip.tr_id) DESC, tr_name ASC',
            'countVideos': '(SELECT COUNT(DISTINCT v_sort.v_id) FROM video v_sort' +
                '     INNER JOIN kategorie k_sort ON v_sort.k_id = k_sort.k_id ' +
                '     WHERE k_sort.tr_id = trip.tr_id) ASC, tr_name ASC',
            'countVideosDesc': '(SELECT COUNT(DISTINCT v_sort.v_id) FROM video v_sort' +
                '     INNER JOIN kategorie k_sort ON v_sort.k_id = k_sort.k_id' +
                '     WHERE k_sort.tr_id = trip.tr_id) DESC, tr_name ASC',
            'date': 'tr_datevon DESC, tr_name ASC',
            'dateAsc': 'tr_datevon ASC, tr_name ASC',
            'forExport': 'tr_datevon ASC, tr_name ASC',
            'name': 'tr_name ASC',
            'playlistPos': 'trip_playlist.trp_pos ASC',
            'location': 'l_lochirarchietxt ASC, tr_name ASC',
            'relevance': 'tr_datevon DESC, tr_name ASC'
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
            conflictingRates: '"conflictingRates"',
            noFavoriteChildren: '"666dummy999"',
            noMainFavoriteChildren: '"noMainFavoriteChildren"',
            noCoordinates: '"666dummy999"',
            noLocation: 'trip.l_id',
            noRoute: '"666dummy999"',
            noSubType: '"666dummy999"',
            todoDesc: '"todoDesc"',
            todoKeywords: 'keyword.kw_name',
            unrated: '"666dummy999"',
            unRatedChildren: '"unRatedChildren"',
            // common
            id: 'trip.tr_id',
            destination_id_s: 'dt.d_id',
            destination_id_ss: 'dt.d_id',
            info_id_i: '"666dummy999"',
            info_id_is: '"666dummy999"',
            trip_id_i: 'trip.tr_id',
            trip_id_is: 'trip.tr_id',
            video_id_is: '"666dummy999"',
            video_id_i: '"666dummy999"',
            image_id_is: '"666dummy999"',
            image_id_i: '"666dummy999"',
            track_id_is: '"666dummy999"',
            track_id_i: '"666dummy999"',
            route_id_is: '"666dummy999"',
            loc_id_i: 'trip.l_id',
            loc_id_is: 'trip.l_id',
            loc_lochirarchie_ids_txt: 'location.l_id',
            l_lochirarchietxt: 'location.l_name',
            html: 'CONCAT(tr_name, " ", COALESCE(tr_meta_shortdesc,""))'
        },
        writeMapping: {
            'trip.l_id': ':loc_id_i:',
            'trip.tr_datevon': ':datestart_dt:',
            'trip.tr_datebis': ':dateend_dt:',
            'trip.tr_meta_shortdesc': ':desc_txt:',
            'trip.tr_gesperrt': ':blocked_i:',
//                'trip.tr_meta_shortdesc_md': ':desc_md_txt:',
//                'trip.tr_meta_shortdesc_html': ':desc_html_txt:',
            'trip.tr_name': ':name_s:'
        },
        fieldMapping: {
            id: 'id',
            trip_id_i: 'tr_id',
            trip_id_is: 'tr_id',
            loc_id_i: 'l_id',
            loc_id_is: 'l_id',
            loc_lochirarchie_s: 'l_lochirarchietxt',
            loc_lochirarchie_ids_s: 'l_lochirarchieids',
            playlists_txt: 'tr_playlists',
            geo_lon_s: 'tr_gps_lon',
            geo_lat_s: 'tr_gps_lat',
            geo_loc_p: 'tr_gps_loc',
            data_tech_alt_asc_i: 'k_altitude_asc_sum',
            data_tech_alt_desc_i: 'k_altitude_desc_sum',
            data_tech_alt_min_i: 'k_altitude_min',
            data_tech_alt_max_i: 'k_altitude_max',
            data_tech_dist_f: 'k_distance_sum',
            data_tech_dur_f: 'dur',
            dateshow_dt: 'tr_dateshow',
            datestart_dt: 'tr_datevon',
            dateend_dt: 'tr_datebis',
            blocked_i: 'tr_gesperrt',
            desc_txt: 'tr_meta_shortdesc',
            desc_md_txt: 'tr_meta_shortdesc_md',
            desc_html_txt: 'tr_meta_shortdesc_html',
            keywords_txt: 'tr_keywords',
            name_s: 'tr_name',
            type_s: 'type'
        }
    };

    public static readonly playlistModelConfigType: PlaylistModelConfigJoinType = {
        table: 'trip', joinTable: 'trip_playlist', fieldReference: 'tr_id', positionField: 'trp_pos',
        detailsField: 'trp_details'
    };

    public static readonly actionTagAssignConfig: ActionTagAssignTableConfigType = {
        table: 'trip',
        idField: 'tr_id',
        references: {
            'loc_lochirarchie_txt': {
                table: 'location', idField: 'l_id', referenceField: 'l_id'
            }
        }
    };

    public static readonly actionTagBlockConfig: ActionTagBlockTableConfigType = {
        table: 'trip', idField: 'tr_id', blockField: 'tr_gesperrt'
    };

    public static readonly actionTagReplaceConfig: ActionTagReplaceTableConfigType = {
        table: 'trip',
        fieldId: 'tr_id',
        referenced: [
            { table: 'kategorie', fieldReference: 'tr_id' }
        ],
        joins: []
    };
}

