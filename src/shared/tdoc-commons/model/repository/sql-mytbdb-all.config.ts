import {TableConfig} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {AdapterFilterActions} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';

export class SqlMytbDbAllConfig {
    public static readonly tableConfig: TableConfig = {
        key: 'all',
        tableName: 'all_entries',
        selectFrom: 'all_entries LEFT JOIN location ON location.l_id = all_entries.l_id ',
        optionalGroupBy: [
            {
                from: 'LEFT JOIN all_entries_keyword ON all_entries.id=all_entries_keyword.id ' +
                    'LEFT JOIN keyword ON all_entries_keyword.kw_id=keyword.kw_id',
                triggerParams: ['id', 'keywords_txt', 'todoKeywords'],
                groupByFields: ['GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS keywords']
            },
            {
                from: 'LEFT JOIN all_entries_playlist ON all_entries.id=all_entries_playlist.id ' +
                    'LEFT JOIN playlist ON all_entries_playlist.p_id=playlist.p_id',
                triggerParams: ['playlists_txt', 'playlists_max_txt', 'playlistPos'],
                groupByFields: ['GROUP_CONCAT(DISTINCT playlist.p_name ORDER BY playlist.p_name SEPARATOR ", ") AS playlists']
            }
        ],
        loadDetailData: [
            {
                profile: 'image',
                sql: 'SELECT * FROM (' +
                    'SELECT CONCAT(image.i_dir, "/", image.i_file) AS i_fav_url_txt, ' +
                    '      I_RATE_MOTIVE, I_RATE_WICHTIGKEIT, I_RATE, kategorie.k_rate_gesamt, image.I_ID ' +
                    '  FROM image' +
                    '      INNER JOIN kategorie ON image.k_id=kategorie.k_id' +
                    '  WHERE "IMAGE" = ":type" AND image.i_id IN (:id)' +
                    ' UNION ' +
                    'SELECT CONCAT(image.i_dir, "/", image.i_file) AS i_fav_url_txt, ' +
                    '      I_RATE_MOTIVE, I_RATE_WICHTIGKEIT, I_RATE, kategorie.k_rate_gesamt, image.I_ID ' +
                    '  FROM kategorie INNER JOIN image ON kategorie.k_id=image.k_id ' +
                    '  WHERE "TRIP" = ":type" AND kategorie.tr_id IN (:id)' +
                    ' UNION ' +
                    'SELECT CONCAT(image.i_dir, "/", image.i_file) AS i_fav_url_txt, ' +
                    '      I_RATE_MOTIVE, I_RATE_WICHTIGKEIT, I_RATE, kategorie.k_rate_gesamt, image.I_ID ' +
                    '  FROM tour INNER JOIN kategorie ON tour.k_id=kategorie.k_id' +
                    '   INNER JOIN image ON kategorie.k_id=image.k_id ' +
                    '   INNER JOIN image_playlist ON image.i_id=image_playlist.i_id ' +
                    '  WHERE "ROUTE" = ":type" AND tour.t_id IN (:id) and p_id in (18)' +
                    ' UNION ' +
                    'SELECT CONCAT(image.i_dir, "/", image.i_file) AS i_fav_url_txt, ' +
                    '      I_RATE_MOTIVE, I_RATE_WICHTIGKEIT, I_RATE, kategorie.k_rate_gesamt, image.I_ID ' +
                    '  FROM image INNER JOIN image_playlist ON image.i_id=image_playlist.i_id ' +
                    '      INNER JOIN kategorie ON image.k_id=kategorie.k_id' +
                    '  WHERE "TRACK" = ":type" AND image.k_id IN (:id) and p_id in (18)' +
                    ') allimage ' +
                    'ORDER BY I_RATE_MOTIVE DESC, I_RATE_WICHTIGKEIT DESC, I_RATE DESC, k_rate_gesamt DESC, I_ID DESC ' +
                    'LIMIT 1',
                parameterNames: ['id', 'type']
            },
            {
                profile: 'keywords',
                sql: 'select GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS keywords ' +
                    'FROM all_entries_keyword' +
                    ' INNER JOIN keyword ON all_entries_keyword.kw_id=keyword.kw_id ' +
                    'WHERE all_entries_keyword.origId IN (:id) AND all_entries_keyword.type IN (":type")',
                parameterNames: ['id', 'type'],
                modes: ['full']
            },
            {
                profile: 'all_entries_playlist',
                sql: 'SELECT GROUP_CONCAT(DISTINCT playlist.p_name ORDER BY playlist.p_name SEPARATOR ", ") AS playlists ' +
                    'FROM all_entries_playlist' +
                    ' INNER JOIN playlist ON all_entries_playlist.p_id=playlist.p_id ' +
                    'WHERE all_entries_playlist.origId IN (:id) AND all_entries_playlist.type IN (":type")',
                parameterNames: ['id', 'type']
            },
            {
                profile: 'linkedplaylists',
                sql: 'SELECT CONCAT("type=playlist:::name=", COALESCE(p_name, "null"), ":::refId=", CAST(playlist.p_id AS CHAR),' +
                    '   ":::position=", COALESCE(all_entries_playlist.pos, "null"),   ":::details=", COALESCE(all_entries_playlist.details, "null"))' +
                    '  AS linkedplaylists' +
                    '  FROM playlist INNER JOIN all_entries_playlist ON playlist.p_id = all_entries_playlist.p_id' +
                    '   WHERE all_entries_playlist.origId IN (:id) AND all_entries_playlist.type IN (":type")' +
                    '  ORDER BY p_name',
                parameterNames: ['id', 'type']
            }
        ],
        groupbBySelectFieldListIgnore: ['keywords', 'playlists', 'persons', 'objects', 'objectdetections'],
        selectFieldList: [
            'all_entries.type',
            'actiontype',
            'subtype',
            'all_entries.id',
            'i_id',
            'v_id',
            'k_id',
            't_id',
            'tr_id',
            'all_entries.l_id',
            'meta_name',
            'html',
            'blocked',
            'date',
            'datevon',
            'datebis',
            'dateonly',
            'week',
            'month',
            'year',
            'gpstracks_basefile',
            'meta_shortdesc',
            'meta_shortdesc_md',
            'gps_lat',
            'gps_lon',
            'gps_loc',
            'l_lochirarchietxt',
            'l_lochirarchieids',
            'i_fav_url_txt',
            'v_fav_url_txt',
            'altitude_asc',
            'altitude_desc',
            'gps_ele',
            'distance',
            'rate_ausdauer',
            'rate_bildung',
            'rate_gesamt',
            'rate_kraft',
            'rate_mental',
            'rate_motive',
            'rate_schwierigkeit',
            'rate_wichtigkeit',
            'altAscFacet',
            'altMaxFacet',
            'distFacet',
            'dur',
            'durFacet'],
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
                selectSql: 'SELECT COUNT(id) AS count, "noLocation" AS value,' +
                    ' "noLocation" AS label, "true" AS id' +
                    ' FROM all_entries WHERE l_id IS NULL OR l_id IN (0,1 )',
                filterField: 'l_id',
                action: AdapterFilterActions.IN
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
                filterField: 'rate_gesamt'
            },
            'unRatedChildren': {
                constValues: ['unRatedChildren'],
                filterField: '"666dummy999"'
            },
            // common
            'id_notin_is': {
                filterField: 'id',
                action: AdapterFilterActions.NOTIN
            },
            'actiontype_ss': {
                filterField: 'actiontype',
            },
            'blocked_is': {
                filterField: 'blocked'
            },
            'data_tech_alt_asc_facet_is': {
                filterField: 'altitude_asc',
            },
            'data_tech_alt_max_facet_is': {
                filterField: 'gps_ele'
            },
            'data_tech_dist_facets_fs': {
                filterField: 'distance'
            },
            'data_tech_dur_facet_fs': {
                filterField: 'ROUND(ROUND(TIME_TO_SEC(TIMEDIFF(datebis, datevon))/3600 * 2) / 2, 1)'
            },
            'data_tech_sections_facet_ss': {
                noFacet: true
            },
            'done_ss': {
                noFacet: true
            },
            'keywords_txt': {
                filterField: 'kw_name',
                action: AdapterFilterActions.LIKEIN
            },
            'loc_id_i': {
                noFacet: true
            },
            'loc_lochirarchie_txt': {
                filterField: 'GetTechName(l_name)'
            },
            'month_is': {
                filterField: 'month'
            },
            'news_id_i': {
                filterFields: ['n_id'],
                action: AdapterFilterActions.IN_NUMBER
            },
            'news_id_is': {
                filterFields: ['n_id'],
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
            'odkeys_all_txt': {
                noFacet: true
            },
            'odcategory_all_txt': {
                noFacet: true
            },
            'odprecision_is': {
                noFacet: true
            },
            'odstates_ss': {
                noFacet: true
            },
            'persons_txt': {
                filterField: 'persons.o_name',
                action: AdapterFilterActions.IN
            },
            'playlists_txt': {
                filterField: 'p_name',
                action: AdapterFilterActions.IN
            },
            'playlists_max_txt': {
                filterField: 'p_name',
                action: AdapterFilterActions.IN
            },
            'rate_pers_gesamt_is': {
                filterField: 'rate_gesamt'
            },
            'rate_pers_schwierigkeit_is': {
                filterField: 'rate_schwierigkeit'
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
                filterField: 'subtype'
            },
            'type_txt': {
                constValues: ['image', 'odimgobject', 'video', 'track', 'route', 'location', 'trip', 'news', 'destination', 'info', 'playlist'],
                filterField: 'lower(all_entries.type)',
                selectLimit: 1
            },
            'week_is': {
                filterField: 'week'
            },
            'year_is': {
                filterField: 'year'
            }
        },
        sortMapping: {
            'date': 'date DESC, id DESC',
            'dateAsc': 'date ASC, id ASC',
            'distance': 'geodist ASC',
            'dataTechDurDesc': 'TIME_TO_SEC(TIMEDIFF(datebis, datevon))/3600 DESC',
            'dataTechAltDesc': 'altitude_asc DESC',
            'dataTechMaxDesc': 'gps_ele DESC',
            'dataTechDistDesc': 'distance DESC',
            'dataTechDurAsc': 'TIME_TO_SEC(TIMEDIFF(datebis, datevon))/3600 ASC',
            'dataTechAltAsc': 'altitude_asc ASC',
            'dataTechMaxAsc': 'gps_ele ASC',
            'dataTechDistAsc': 'distance ASC',
            'forExport': 'date ASC, id ASC',
            'ratePers': 'rate_gesamt DESC, date DESC',
            'playlistPos': 'pos ASC',
            'location': 'l_lochirarchietxt ASC, date ASC',
            'locationDetails': 'l_lochirarchietxt ASC, date ASC',
            'relevance': 'date DESC'
        },
        spartialConfig: {
            lat: 'gps_lat',
            lon: 'gps_lon',
            spatialField: 'geodist',
            spatialSortKey: 'distance'
        },
        filterMapping: {
            // dashboard
            doublettes: '"666dummy999"',
            conflictingRates: '"666dummy999"',
            noFavoriteChildren: '"666dummy999"',
            noMainFavoriteChildren: '"666dummy999"',
            noCoordinates: '"666dummy999"',
            noLocation: 'l_id',
            noRoute: '"666dummy999"',
            noSubType: '"666dummy999"',
            todoDesc: '"666dummy999"',
            todoKeywords: '"666dummy999"',
            unrated: 'rate_gesamt',
            unRatedChildren: '"666dummy999"',
            // common
            id: 'all_entries.id',
            destination_id_s: 'd_id',
            destination_id_ss: 'd_id',
            image_id_i: 'i_id',
            image_id_is: 'i_id',
            video_id_i: 'v_id',
            video_id_is: 'v_id',
            info_id_i: '"666dummy999"',
            info_id_is: '"666dummy999"',
            route_id_i: 't_id',
            route_id_is: 't_id',
            track_id_i: 'k_id',
            track_id_is: 'k_id',
            loc_lochirarchie_ids_txt: 'location.l_id',
            l_lochirarchietxt: 'location.l_name',
            html: 'CONCAT(COALESCE(meta_name,""), " ", l_name)'
        },
        writeMapping: {
        },
        fieldMapping: {
            id: 'id',
            image_id_i: 'i_id',
            image_id_is: 'i_id',
            video_id_i: 'v_id',
            video_id_is: 'v_id',
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
            actiontype_s: 'actionType',
            blocked_i: 'blocked',
            data_tech_alt_asc_i: 'altitude_asc',
            data_tech_alt_desc_i: 'altitude_desc',
            data_tech_alt_min_i: 'gps_ele',
            data_tech_alt_max_i: 'gps_ele',
            data_tech_dist_f: 'distance',
            data_tech_dur_f: 'dur',
            dateshow_dt: 'date',
            datestart_dt: 'date',
            dateend_dt: 'date',
            desc_txt: 'meta_shortdesc',
            desc_md_txt: 'meta_shortdesc_md',
            desc_html_txt: 'meta_shortdesc_html',
            distance: 'geodist',
            geo_lon_s: 'gps_lon',
            geo_lat_s: 'gps_lat',
            geo_loc_p: 'gps_loc',
            i_fav_url_txt: 'i_fav_url_txt',
            v_fav_url_txt: 'v_fav_url_txt',
            rate_pers_ausdauer_i: 'rate_ausdauer',
            rate_pers_bildung_i: 'rate_bildung',
            rate_pers_gesamt_i: 'rate_gesamt',
            rate_pers_kraft_i: 'rate_kraft',
            rate_pers_mental_i: 'rate_mental',
            rate_pers_motive_i: 'rate_motive',
            rate_pers_schwierigkeit_i: 'rate_schwierigkeit',
            rate_pers_wichtigkeit_i: 'rate_wichtigkeit',
            gpstracks_basefile_s: 'gpstracks_basefile',
            keywords_txt: 'keywords',
            loc_lochirarchie_s: 'l_lochirarchietxt',
            loc_lochirarchie_ids_s: 'l_lochirarchieids',
            name_s: 'meta_name',
            persons_txt: 'persons',
            objects_txt: 'objects',
            playlists_txt: 'playlists',
            subtype_s: 'subtype',
            type_s: 'type'
        }
    };
}

