import {TableConfig} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {ActionTagReplaceTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-replace.adapter';
import {AdapterFilterActions} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';

export class SqlMytbDbPlaylistConfig {
    public static readonly tableConfig: TableConfig = {
        key: 'playlist',
        tableName: 'playlist',
        selectFrom: 'playlist',
        optionalGroupBy: [
            {
                from: 'LEFT JOIN image_playlist tip ON playlist.p_id = tip.p_id ' +
                    'LEFT JOIN image pimage ON tip.i_id = pimage.i_id',
                triggerParams: ['image_id_i', 'image_id_is'],
                groupByFields: []
            },
            {
                from: 'LEFT JOIN video_playlist tvp ON playlist.p_id = tvp.p_id ' +
                    'LEFT JOIN video pvideo ON tvp.v_id = pvideo.v_id',
                triggerParams: ['video_id_i', 'video_id_is'],
                groupByFields: []
            },
            {
                from: 'INNER JOIN (SELECT p_id AS id FROM playlist WHERE p_key' +
                    '              IN (SELECT DISTINCT p_key AS name' +
                    '                  FROM playlist GROUP BY name HAVING COUNT(*) > 1)' +
                    '             ) doublettes' +
                    '             ON playlist.p_id=doublettes.id',
                triggerParams: ['doublettes'],
                groupByFields: []
            }
        ],
        groupbBySelectFieldList: true,
        groupbBySelectFieldListIgnore: ['p_keywords'],
        loadDetailData: [
            {
                profile: 'extended_object_properties',
                sql: 'SELECT CONCAT("category=ENTITYCOUNT:::name=IMAGE_COUNT:::value=", CAST(COUNT(DISTINCT image_playlist.i_id) AS CHAR)) AS extended_object_properties' +
                    '      FROM image_playlist' +
                    '      WHERE image_playlist.p_id IN (:id)' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=IMAGE_TOP_COUNT:::value=", CAST(COUNT(DISTINCT image.i_id) AS CHAR)) AS extended_object_properties' +
                    '      FROM image INNER JOIN image_playlist ON image.i_id = image_playlist.i_id' +
                    '      WHERE image_playlist.p_id IN (:id) AND i_rate >= 6' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=INFO_COUNT:::value=", CAST(COUNT(DISTINCT info_playlist.if_id) AS CHAR)) AS extended_object_properties' +
                    '      FROM info_playlist ' +
                    '      WHERE info_playlist.p_id IN (:id)' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=LOCATION_COUNT:::value=", CAST(COUNT(DISTINCT location_playlist.l_id) AS CHAR)) AS extended_object_properties' +
                    '      FROM location_playlist ' +
                    '      WHERE location_playlist.p_id IN (:id)' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=TRACK_COUNT:::value=", CAST(COUNT(DISTINCT kategorie_playlist.k_id) AS CHAR)) AS extended_object_properties' +
                    '      FROM kategorie_playlist' +
                    '      WHERE kategorie_playlist.p_id IN (:id)' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=ROUTE_COUNT:::value=", CAST(COUNT(DISTINCT tour_playlist.t_id) AS CHAR)) AS extended_object_properties' +
                    '       FROM tour_playlist ' +
                    '       WHERE tour_playlist.p_id IN (:id)' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=TRIP_COUNT:::value=", CAST(COUNT(DISTINCT trip_playlist.tr_id) AS CHAR)) AS extended_object_properties' +
                    '      FROM trip_playlist' +
                    '      WHERE trip_playlist.p_id IN (:id)' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=VIDEO_COUNT:::value=", CAST(COUNT(DISTINCT video_playlist.v_id) AS CHAR)) AS extended_object_properties' +
                    '      FROM video_playlist' +
                    '      WHERE video_playlist.p_id IN (:id)',
                parameterNames: ['id']
            },
            {
                profile: 'navigation_objects',
                sql: '(SELECT CONCAT("navid=PLAYLIST_", p_id, ":::name=", COALESCE(p_name, "null"), ":::navtype=", "PREDECESSOR")' +
                    '  AS navigation_objects' +
                    '  FROM playlist WHERE p_id < (SELECT p_id FROM playlist WHERE p_id IN (:id))' +
                    '  ORDER BY p_id DESC, p_id DESC LIMIT 1) ' +
                    'UNION ' +
                    ' (SELECT CONCAT("navid=PLAYLIST_", p_id, ":::name=", COALESCE(p_name, "null"), ":::navtype=", "SUCCESSOR")' +
                    '  AS navigation_objects' +
                    '  FROM playlist WHERE p_id > (SELECT p_id FROM playlist WHERE p_id IN (:id))' +
                    '   ORDER BY p_id, p_id LIMIT 1)',
                parameterNames: ['id'],
                modes: ['details']
            }
        ],
        selectFieldList: [
            '"PLAYLIST" AS type',
            'CONCAT("PLAYLIST", "_", playlist.p_id) AS id',
            'playlist.p_id',
            'playlist.p_name',
            'p_meta_desc'],
        facetConfigs: {
            // dashboard
            'doublettes': {
                selectSql: 'SELECT COUNT(playlist.p_id) AS count, "doublettes" AS value,' +
                    ' "doublettes" AS label, "true" AS id' +
                    ' FROM playlist INNER JOIN (SELECT p_id AS id FROM playlist WHERE p_key' +
                    '              IN (SELECT DISTINCT p_key AS name' +
                    '                  FROM playlist GROUP BY name HAVING COUNT(*) > 1)' +
                    '             ) doublettes' +
                    '             ON playlist.p_id=doublettes.id',
                cache: {
                    useCache: false
                }
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
                selectSql: 'SELECT COUNT(playlist.p_id) AS count, "todoDesc" AS value,' +
                    ' "todoDesc" AS label, "true" AS id' +
                    ' FROM playlist WHERE p_meta_desc LIKE "TODODESC%"',
                filterField: 'playlist.p_meta_desc',
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
                constValues: ['unRatedChildren'],
                filterField: '"666dummy999"'
            },
            // common
            'id_notin_is': {
                filterField: 'CONCAT("PLAYLIST", "_", playlist.p_id)',
                action: AdapterFilterActions.NOTIN
            },
            'actiontype_ss': {
                noFacet: true
            },
            'blocked_is': {
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
                noFacet: true
            },
            'gpstracks_state_is': {
                noFacet: true
            },
            'initial_s': {
                selectSql: 'SELECT COUNT(*) as count, ' +
                    ' SUBSTR(UPPER(p_name), 1, 1) as value ' +
                    'FROM playlist ' +
                    'WHERE LENGTH(p_name) > 0 ' +
                    'GROUP BY SUBSTR(UPPER(p_name), 1, 1)' +
                    'ORDER BY value',
            },
            'keywords_txt': {
                constValues: ['keywords_txt'],
                filterField: '"666dummy999"'
            },
            'loc_id_i': {
                noFacet: true
            },
            'loc_lochirarchie_txt': {
                noFacet: true
            },
            'month_is': {
                noFacet: true
            },
            'news_id_i': {
                constValues: ['news_id_i'],
                filterField: '"666dummy999"'
            },
            'news_id_is': {
                constValues: ['news_id_is'],
                filterField: '"666dummy999"'
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
                selectSql: 'SELECT COUNT(playlist.p_id) AS count, ' +
                    ' p_name AS value ' +
                    'FROM' +
                    ' playlist' +
                    ' GROUP BY value' +
                    ' ORDER BY value',
                filterField: 'playlist.p_name',
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
                constValues: ['subtype_ss'],
                filterField: '"666dummy999"'
            },
            'trip_id_i': {
                constValues: ['trip_id_i'],
                filterField: '"666dummy999"'
            },
            'trip_id_is': {
                constValues: ['trip_id_is'],
                filterField: '"666dummy999"'
            },
            'type_ss': {
                constValues: ['playlist', 'trip', 'location', 'track', 'route', 'image', 'odimgobject', 'video', 'news', 'destination', 'info', 'poi'],
                filterField: '"playlist"',
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
            'countImages': '(SELECT COUNT(DISTINCT p_sort.i_id) FROM image_playlist p_sort WHERE p_sort.p_id = playlist.p_id) ASC, p_name ASC',
            'countImagesDesc': '(SELECT COUNT(DISTINCT p_sort.i_id) FROM image_playlist p_sort WHERE p_sort.p_id = playlist.p_id) DESC, p_name ASC',
            'countInfos': '(SELECT COUNT(DISTINCT p_sort.if_id) FROM info_playlist p_sort WHERE p_sort.p_id = playlist.p_id) ASC, p_name ASC',
            'countInfosDesc': '(SELECT COUNT(DISTINCT p_sort.if_id) FROM info_playlist p_sort WHERE p_sort.p_id = playlist.p_id) DESC, p_name ASC',
            'countLocations': '(SELECT COUNT(DISTINCT p_sort.l_id) FROM location_playlist p_sort WHERE p_sort.p_id = playlist.p_id) ASC, p_name ASC',
            'countLocationsDesc': '(SELECT COUNT(DISTINCT p_sort.l_id) FROM location_playlist p_sort WHERE p_sort.p_id = playlist.p_id) DESC, p_name ASC',
            'countRoutes': '(SELECT COUNT(DISTINCT p_sort.t_id) FROM tour_playlist p_sort WHERE p_sort.p_id = playlist.p_id) ASC, p_name ASC',
            'countRoutesDesc': '(SELECT COUNT(DISTINCT p_sort.t_id) FROM tour_playlist p_sort WHERE p_sort.p_id = playlist.p_id) DESC, p_name ASC',
            'countTracks': '(SELECT COUNT(DISTINCT p_sort.k_id) FROM kategorie_playlist p_sort WHERE p_sort.p_id = playlist.p_id) ASC, p_name ASC',
            'countTracksDesc': '(SELECT COUNT(DISTINCT p_sort.k_id) FROM kategorie_playlist p_sort WHERE p_sort.p_id = playlist.p_id) DESC, p_name ASC',
            'countTrips': '(SELECT COUNT(DISTINCT p_sort.tr_id) FROM trip_playlist p_sort WHERE p_sort.p_id = playlist.p_id) ASC, p_name ASC',
            'countTripsDesc': '(SELECT COUNT(DISTINCT p_sort.tr_id) FROM trip_playlist p_sort WHERE p_sort.p_id = playlist.p_id) DESC, p_name ASC',
            'countVideos': '(SELECT COUNT(DISTINCT p_sort.v_id) FROM video_playlist p_sort WHERE p_sort.p_id = playlist.p_id) ASC, p_name ASC',
            'countVideosDesc': '(SELECT COUNT(DISTINCT p_sort.v_id) FROM video_playlist p_sort WHERE p_sort.p_id = playlist.p_id) DESC, p_name ASC',
            'name': 'p_name ASC',
            'forExport': 'playlist.p_id ASC, p_name ASC',
            'relevance': 'playlist.p_id DESC, p_name ASC'
        },
        spartialConfig: {
            lat: undefined,
            lon: undefined,
            spatialField: undefined,
            spatialSortKey: undefined
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
            todoDesc: '"todoDesc"',
            todoKeywords: '"666dummy999"',
            unrated: '"666dummy999"',
            unRatedChildren: '"666dummy999"',
            // common
            id: 'playlist.p_id',
            destination_id_s: '"666dummy999"',
            destination_id_ss: '"666dummy999"',
            playlist_id_i: 'playlist.p_id',
            playlist_id_is: 'playlist.p_id',
            poi_id_i: '"666dummy999"',
            poi_id_is: '"666dummy999"',
            route_id_i: '"666dummy999"',
            route_id_is: '"666dummy999"',
            track_id_i: '"666dummy999"',
            track_id_is: '"666dummy999"',
            video_id_is: 'pvideo.v_id',
            video_id_i: 'pvideo.v_id',
            image_id_is: 'pimage.i_id',
            image_id_i: 'pimage.i_id',
            trip_id_is: '"666dummy999"',
            trip_id_i: '"666dummy999"',
            loc_id_i: '"666dummy999"',
            loc_id_is: '"666dummy999"',
            loc_lochirarchie_ids_txt: '"666dummy999"',
            l_lochirarchietxt: '"666dummy999"',
            gpstracks_state_is: '"666dummy999"',
            initial_s: 'SUBSTR(UPPER(p_name), 1, 1)',
            html: 'CONCAT(p_name, " ", COALESCE(p_meta_desc,""))'
        },
        writeMapping: {
            'playlist.p_meta_desc': ':desc_md_txt:',
            'playlist.p_key': ':key_s:',
            'playlist.p_name': ':name_s:'
        },
        fieldMapping: {
            id: 'id',
            playlist_id_i: 'p_id',
            playlist_id_is: 'p_id',
            desc_md_txt: 'p_meta_desc',
            name_s: 'p_name',
            type_s: 'type'
        }
    };

    public static readonly actionTagReplaceConfig: ActionTagReplaceTableConfigType = {
        table: 'playlist',
        fieldId: 'p_id',
        referenced: [],
        joins: [
            { table: 'image_playlist', fieldReference: 'p_id' },
            { table: 'info_playlist', fieldReference: 'p_id' },
            { table: 'kategorie_playlist', fieldReference: 'p_id' },
            { table: 'location_playlist', fieldReference: 'p_id' },
            { table: 'tour_playlist', fieldReference: 'p_id' },
            { table: 'trip_playlist', fieldReference: 'p_id' },
            { table: 'video_playlist', fieldReference: 'p_id' }
        ]
    };
}

