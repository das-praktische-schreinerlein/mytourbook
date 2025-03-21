import {TableConfig} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {AdapterFilterActions} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';
import {ActionTagBlockTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-block.adapter';
import {ActionTagReplaceTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-replace.adapter';
import {ActionTagAssignTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-assign.adapter';
import {KeywordModelConfigJoinType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-keyword.adapter';
import {PlaylistModelConfigJoinType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-playlist.adapter';
import {RateModelConfigTableType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-rate.adapter';
import {Globals} from './globals';

export class SqlMytbDbVideoConfig {
    public static readonly tableConfig: TableConfig = {
        key: 'video',
        tableName: 'video',
        selectFrom: 'video LEFT JOIN kategorie ON kategorie.k_id=video.k_id ' +
           'LEFT JOIN location_hirarchical as location ON location.l_id = kategorie.l_id ',
        optionalGroupBy: [
            {
                from: 'LEFT JOIN video_keyword ON video.v_id=video_keyword.v_id ' +
                    'LEFT JOIN keyword ON video_keyword.kw_id=keyword.kw_id',
                triggerParams: ['id', 'keywords_txt', 'todoKeywords'],
                groupByFields: ['GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS i_keywords']
            },
            {
                from: 'LEFT JOIN kategorie_keyword ON kategorie.k_id=kategorie_keyword.k_id ' +
                    'LEFT JOIN keyword tkw ON kategorie_keyword.kw_id=tkw.kw_id',
                triggerParams: ['track_keywords_txt'],
                groupByFields: ['GROUP_CONCAT(DISTINCT tkw.kw_name ORDER BY tkw.kw_name SEPARATOR ", ") AS track_keywords']
            },
            {
                from: 'LEFT JOIN tour kt2 ON kategorie.t_id=kt2.t_id ' +
                    'LEFT JOIN destination dt ON dt.d_id in (kt2.t_calced_d_id)',
                triggerParams: ['destination_id_s', 'destination_id_ss'],
                groupByFields: []
            },
            {
                from: 'LEFT JOIN video_playlist ON video.v_id=video_playlist.v_id ' +
                    'LEFT JOIN playlist ON video_playlist.p_id=playlist.p_id',
                triggerParams: ['playlists_txt', 'playlists_max_txt', 'playlistPos'],
                groupByFields: ['GROUP_CONCAT(DISTINCT playlist.p_name ORDER BY playlist.p_name SEPARATOR ", ") AS v_playlists']
            },
            {
                from: 'LEFT JOIN video_object ON video.v_id=video_object.v_id ' +
                    'LEFT JOIN objects ON video_object.vo_obj_type=objects.o_key',
                triggerParams: ['id', 'odstates_ss', 'odprecision_is', 'odcats_txt', 'odkeys_txt', 'oddetectors_txt'],
                groupByFields: ['GROUP_CONCAT(DISTINCT objects.o_name ORDER BY objects.o_name SEPARATOR ", ") AS v_allobjects']
            },
            {
                from: 'LEFT JOIN video_object video_object_persons ON video.v_id=video_object_persons.v_id ' +
                    'LEFT JOIN objects persons ON video_object_persons.vo_obj_type=persons.o_key' +
                    ' AND LOWER(persons.o_category) LIKE "person"' +
                    ' AND (video_object_persons.vo_precision = 1' +
                    '      OR video_object_persons.vo_state in ("' + Globals.detectionOkStates.join('", "') + '"))',
                triggerParams: ['persons_txt'],
                groupByFields: ['GROUP_CONCAT(DISTINCT persons.o_name ORDER BY persons.o_name SEPARATOR ", ") AS v_persons']
            },
            {
                from: 'LEFT JOIN video_object video_object_objects ON video.v_id=video_object_objects.v_id ' +
                    'LEFT JOIN objects realobjects ON video_object_objects.vo_obj_type=realobjects.o_key' +
                    ' AND LOWER(realobjects.o_category) NOT LIKE "person"' +
                    ' AND (video_object_objects.vo_precision = 1' +
                    '      OR video_object_objects.vo_state in ("' + Globals.detectionOkStates.join('", "') + '"))',
                triggerParams: ['objects_txt'],
                groupByFields: ['GROUP_CONCAT(DISTINCT realobjects.o_name ORDER BY realobjects.o_name SEPARATOR ", ") AS v_objects']
            },
            {
                from: 'LEFT JOIN news ON kategorie.k_datevon >= news.n_datevon AND kategorie.k_datevon <= news.n_datebis',
                triggerParams: ['news_id_i', 'news_id_is'],
                groupByFields: ['news.n_id']
            },
            {
                from: 'INNER JOIN (SELECT v_id AS id FROM video INNER JOIN' +
                    '                (SELECT DISTINCT v_dir, v_file FROM video GROUP BY v_dir, v_file' +
                    '                 HAVING COUNT(*) > 1) doublettes' +
                    '                ON video.v_file = doublettes.v_file AND video.v_dir = doublettes.v_dir) doublettes2' +
                    '             ON video.v_id = doublettes2.id',
                triggerParams: ['doublettes'],
                groupByFields: []
            }
        ],
        loadDetailData: [
            {
                profile: 'video_playlist',
                sql: 'SELECT GROUP_CONCAT(DISTINCT playlist.p_name ORDER BY playlist.p_name SEPARATOR ", ") AS v_playlists ' +
                    'FROM video_playlist' +
                    ' INNER JOIN playlist ON video_playlist.p_id=playlist.p_id ' +
                    'WHERE video_playlist.v_id IN (:id)',
                parameterNames: ['id'],
                modes: ['details', 'full', 'commonsearch', 'commoninlinesearch']
            },
            {
                profile: 'video_persons',
                sql: 'SELECT GROUP_CONCAT(DISTINCT objects.o_name ORDER BY objects.o_name SEPARATOR ", ") AS v_persons ' +
                    'FROM video_object' +
                    ' INNER JOIN objects_key ON video_object.vo_obj_type=objects_key.ok_key' +
                    ' AND video_object.vo_detector=objects_key.ok_detector ' +
                    ' INNER JOIN objects ON objects_key.o_id=objects.o_id ' +
                    ' AND LOWER(o_category) LIKE "person"' +
                    ' AND (video_object.vo_precision = 1' +
                    '      OR video_object.vo_state in ("' + Globals.detectionOkStates.join('", "') + '"))' +
                    'WHERE video_object.v_id IN (:id)',
                parameterNames: ['id'],
                modes: ['details', 'full', 'commonsearch', 'commoninlinesearch']
            },
            {
                profile: 'video_objects',
                sql: 'SELECT GROUP_CONCAT(DISTINCT objects.o_name ORDER BY objects.o_name SEPARATOR ", ") AS v_objects ' +
                    'FROM video_object' +
                    ' INNER JOIN objects_key ON video_object.vo_obj_type=objects_key.ok_key' +
                    ' AND video_object.vo_detector=objects_key.ok_detector ' +
                    ' INNER JOIN objects ON objects_key.o_id=objects.o_id ' +
                    ' AND LOWER(o_category) NOT LIKE "person"' +
                    ' AND (video_object.vo_precision = 1' +
                    '      OR video_object.vo_state in ("' + Globals.detectionOkStates.join('", "') + '"))' +
                    'WHERE video_object.v_id IN (:id)',
                parameterNames: ['id'],
                modes: ['details', 'full', 'commonsearch', 'commoninlinesearch']
            },
            {
                profile: 'keywords',
                sql: 'select GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS keywords ' +
                    'FROM video_keyword' +
                    ' INNER JOIN keyword ON video_keyword.kw_id=keyword.kw_id ' +
                    'WHERE video_keyword.v_id IN (:id)',
                parameterNames: ['id'],
                modes: ['full']
            },
            {
                profile: 'navigation_objects',
                sql: '(SELECT CONCAT("navid=VIDEO_", v_id, ":::name=", COALESCE(v_meta_name, "null"), ":::navtype=", "PREDECESSOR")' +
                    '  AS navigation_objects' +
                    '  FROM video WHERE v_date < (SELECT v_date FROM video WHERE v_id IN (:id))' +
                    '  ORDER BY v_date DESC, v_id DESC LIMIT 1) ' +
                    'UNION ' +
                    ' (SELECT CONCAT("navid=VIDEO_", v_id, ":::name=", COALESCE(v_meta_name, "null"), ":::navtype=", "SUCCESSOR")' +
                    '  AS navigation_objects' +
                    '  FROM video WHERE v_date > (SELECT v_date FROM video WHERE v_id IN (:id))' +
                    '   ORDER BY v_date, v_id LIMIT 1)',
                parameterNames: ['id'],
                modes: ['details']
            },
            {
                profile: 'linkedplaylists',
                sql: 'SELECT CONCAT("type=playlist:::name=", COALESCE(p_name, "null"), ":::refId=", CAST(playlist.p_id AS CHAR),' +
                    '   ":::position=", COALESCE(video_playlist.vp_pos, "null"),   ":::details=", COALESCE(video_playlist.vp_details, "null"))' +
                    '  AS linkedplaylists' +
                    '  FROM playlist INNER JOIN video_playlist ON playlist.p_id = video_playlist.p_id WHERE video_playlist.v_id IN (:id)' +
                    '  ORDER BY p_name',
                parameterNames: ['id'],
                modes: ['details', 'full', 'playlist_view']
            }
        ],
        groupbBySelectFieldListIgnore: ['v_keywords', 'v_playlists', 'v_persons', 'v_objects'],
        selectFieldList: [
            '"VIDEO" AS type',
            'k_type',
            'kategorie.k_calced_actiontype AS actiontype',
            'kategorie.k_calced_actiontype AS subtype',
            'CONCAT("VIDEO", "_", video.v_id) AS id',
            // 'n_id',
            'video.v_id',
            'video.k_id',
            'kategorie.t_id',
            'kategorie.tr_id',
            'kategorie.l_id',
            'COALESCE(v_meta_name,k_name) AS v_meta_name',
            'v_gesperrt',
            'v_date',
            'DATE_FORMAT(v_date, GET_FORMAT(DATE, "ISO")) AS dateonly',
            'WEEK(v_date) AS week',
            'MONTH(v_date) AS month',
            'YEAR(v_date) AS year',
            'k_gpstracks_basefile',
            'k_gpstracks_state',
            'v_meta_shortdesc',
            'v_calced_gps_lat AS v_gps_lat',
            'v_calced_gps_lon AS v_gps_lon',
            'v_calced_gps_loc AS v_gps_loc',
            'l_lochirarchietxt',
            'l_lochirarchieids',
            'v_calced_path AS v_fav_url_txt',
            'v_datefile',
            'v_daterecording',
            'v_duration',
            'v_filesize',
            'v_metadata',
            'v_resolution',
            'k_altitude_asc',
            'k_altitude_desc',
            'v_gps_ele',
            'v_gps_ele',
            'k_distance',
            'k_rate_ausdauer',
            'k_rate_bildung',
            'v_rate',
            'k_rate_kraft',
            'k_rate_mental',
            'v_rate_motive',
            'k_rate_schwierigkeit',
            'v_rate_wichtigkeit',
            'k_calced_altAscFacet AS altAscFacet',
            'v_calced_altMaxFacet AS altMaxFacet',
            'k_calced_distFacet AS distFacet',
            'k_calced_dur AS dur',
            'k_calced_durFacet AS durFacet',
            // changelog
            'v_createdat',
            'v_updatedat',
            'v_updateversion'],
        facetConfigs: {
            // dashboard
            'doublettes': {
                selectSql: 'SELECT COUNT(video.v_id) AS count, "doublettes" AS value,' +
                    ' "doublettes" AS label, "true" AS id' +
                    ' FROM video INNER JOIN (SELECT v_id AS id FROM video INNER JOIN' +
                    '                (SELECT DISTINCT v_dir, v_file FROM video GROUP BY v_dir, v_file' +
                    '                 HAVING COUNT(*) > 1) doublettes' +
                    '                ON video.v_file = doublettes.v_file AND video.v_dir = doublettes.v_dir) doublettes2' +
                    '             ON video.v_id = doublettes2.id',
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
                selectSql: 'SELECT COUNT(video.v_id) AS count, "noLocation" AS value,' +
                    ' "noLocation" AS label, "true" AS id' +
                    ' FROM video WHERE l_id IS NULL OR l_id IN (0,1 )',
                filterField: 'video.l_id',
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
                selectSql: 'SELECT COUNT(video.k_id) AS count, "todoDesc" AS value,' +
                    ' "todoDesc" AS label, "true" AS id' +
                    ' FROM video WHERE v_meta_shortdesc LIKE "TODODESC%"',
                filterField: 'video.v_meta_shortdesc',
                action: AdapterFilterActions.LIKE
            },
            'todoKeywords': {
                selectSql: 'SELECT COUNT(video.v_id) AS count, "todoKeywords" AS value,' +
                    ' "todoKeywords" AS label, "true" AS id' +
                    ' FROM video INNER JOIN video_keyword ON video.v_id=video_keyword.v_id' +
                    ' INNER JOIN keyword ON video_keyword.kw_id=keyword.kw_id ' +
                    'WHERE keyword.kw_name IN ("KW_TODOKEYWORDS")',
                filterField: 'keyword.kw_name',
                action: AdapterFilterActions.IN
            },
            'unrated': {
                selectSql: 'SELECT COUNT(video.v_id) AS count, "unrated" AS value,' +
                    ' "unrated" AS label, "true" AS id' +
                    ' FROM video WHERE v_rate IS NULL OR v_rate in (0)',
                filterField: 'video.v_rate',
                action: AdapterFilterActions.IN
            },
            'unRatedChildren': {
                constValues: ['unRatedChildren'],
                filterField: '"666dummy999"'
            },
            // common
            'id_notin_is': {
                filterField: 'CONCAT("VIDEO", "_", video.v_id)',
                action: AdapterFilterActions.NOTIN
            },
            'actiontype_ss': {
                selectField: 'kategorie.k_calced_actiontype',
                selectFrom: 'video INNER JOIN kategorie ON kategorie.k_id=video.k_id'
            },
            'blocked_is': {
                selectField: 'v_gesperrt'
            },
            'data_tech_alt_asc_facet_is': {
                selectField: 'k_calced_altAscFacet',
                selectFrom: 'video INNER JOIN kategorie ON kategorie.k_id=video.k_id',
                orderBy: 'value asc'
            },
            'data_tech_alt_max_facet_is': {
                selectField: 'v_calced_altMaxFacet',
                orderBy: 'value asc'
            },
            'data_tech_dist_facets_fs': {
                selectField: 'k_calced_distFacet',
                selectFrom: 'video INNER JOIN kategorie ON kategorie.k_id=video.k_id',
                orderBy: 'value asc'
            },
            'data_tech_dur_facet_fs': {
                selectField: 'k_calced_durFacet',
                selectFrom: 'video INNER JOIN kategorie ON kategorie.k_id=video.k_id',
                orderBy: 'value asc'
            },
            'data_tech_sections_facet_ss': {
                noFacet: true
            },
            'done_ss': {
                selectField: 'CONCAT("DONE", (v_date IS NOT NULL))',
                orderBy: 'value asc'
            },
            'gpstracks_state_is': {
                selectField: 'kategorie.k_gpstracks_state',
                selectFrom: 'video INNER JOIN kategorie ON kategorie.k_id=video.k_id'
            },
            'initial_s': {
                noFacet: true
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
                selectSql: 'SELECT COUNT(video.l_id) AS count, GetTechName(l_name) AS value, location.l_id AS id,' +
                    ' l_lochirarchietxt AS label' +
                    ' FROM location_hirarchical as location LEFT JOIN kategorie ON location.l_id = kategorie.l_id ' +
                    ' LEFT JOIN video ON kategorie.k_id=video.k_id ' +
                    ' GROUP BY value, label, id' +
                    ' ORDER BY label ASC',
                triggerTables: ['location', 'kategorie', 'video'],
                filterField: 'GetTechName(l_lochirarchietxt)',
                action: AdapterFilterActions.LIKE
            },
            'month_is': {
                selectField: 'MONTH(v_date)',
                orderBy: 'value asc'
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
                selectSql: 'SELECT COUNT(video.v_id) AS count, ' +
                    ' o_name AS value ' +
                    'FROM' +
                    ' objects LEFT JOIN video_object ON objects.o_key=video_object.vo_obj_type' +
                    ' INNER JOIN video ON video_object.v_id=video.v_id ' +
                    ' WHERE objects.o_category NOT IN ("' + Globals.personCategories.join('", "') + '")' +
                    ' GROUP BY value' +
                    ' ORDER BY value',
                filterField: 'realobjects.o_name',
                action: AdapterFilterActions.IN
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
                selectSql: 'SELECT COUNT(video.v_id) AS count, ' +
                    ' o_name AS value ' +
                    'FROM' +
                    ' objects LEFT JOIN video_object ON objects.o_key=video_object.vo_obj_type' +
                    ' INNER JOIN video ON video_object.v_id=video.v_id ' +
                    ' WHERE objects.o_category IN ("' + Globals.personCategories.join('", "') + '")' +
                    ' GROUP BY value' +
                    ' ORDER BY value',
                filterField: 'persons.o_name',
                action: AdapterFilterActions.IN
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
                selectField: 'v_rate',
                orderBy: 'value asc'
            },
            'rate_pers_schwierigkeit_is': {
                selectField: 'k_rate_schwierigkeit',
                selectFrom: 'video INNER JOIN kategorie ON kategorie.k_id=video.k_id',
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
            'subtype_ss': {
                selectField: 'kategorie.k_calced_actiontype',
                selectFrom: 'video INNER JOIN kategorie ON kategorie.k_id=video.k_id',
                orderBy: 'value asc'
            },
            'type_ss': {
                constValues: ['video', 'track', 'route', 'location', 'trip', 'news', 'image', 'odimgobject', 'destination', 'info', 'playlist', 'poi'],
                filterField: '"video"',
                selectLimit: 1
            },
            'week_is': {
                selectField: 'WEEK(v_date)',
                orderBy: 'value asc'
            },
            'year_is': {
                selectField: 'YEAR(v_date)',
                orderBy: 'value asc'
            }
        },
        sortMapping: {
            'date': 'v_date DESC, video.v_id DESC',
            'dateAsc': 'v_date ASC, video.v_id ASC',
            'trackDate': 'v_date DESC, video.v_id ASC',
            'trackDateAsc': 'v_date ASC, video.v_id ASC',
            'tripDate': 'v_date DESC, video.v_id ASC',
            'tripDateAsc': 'v_date ASC, video.v_id ASC',
            'distance': 'geodist ASC',
            'dataTechDurDesc': 'k_calced_dur DESC',
            'dataTechAltDesc': 'k_altitude_asc DESC',
            'dataTechMaxDesc': 'v_gps_ele DESC',
            'dataTechDistDesc': 'k_distance DESC',
            'dataTechDurAsc': 'k_calced_dur ASC',
            'dataTechAltAsc': 'k_altitude_asc ASC',
            'dataTechMaxAsc': 'v_gps_ele ASC',
            'dataTechDistAsc': 'k_distance ASC',
            'forExport': 'v_date ASC, video.v_id ASC',
            'ratePers': 'v_rate DESC, v_date DESC',
            'location': 'l_lochirarchietxt ASC, v_date ASC',
            'locationDetails': 'l_lochirarchietxt ASC, v_date ASC',
            'playlistPos': 'video_playlist.vp_pos ASC',
            'relevance': 'v_date DESC',
            'createdAt': 'v_createdat DESC, video.v_id DESC',
            'updatedAt': 'v_updatedat DESC, video.v_id DESC'
        },
        spartialConfig: {
            lat: 'v_gps_lat',
            lon: 'v_gps_lon',
            spatialField: 'geodist',
            spatialSortKey: 'distance'
        },
        changelogConfig: {
            createDateField: 'v_createdat',
            updateDateField: 'v_updatedat',
            updateVersionField: 'v_updateversion',
            table: 'video',
            fieldId: 'v_id'
        },
        filterMapping: {
            // dashboard
            doublettes: '"doublettes"',
            conflictingRates: '"666dummy999"',
            noFavoriteChildren: '"666dummy999"',
            noMainFavoriteChildren: '"666dummy999"',
            noMetaOnly: 'COALESCE(v_metadata, "noMetaOnly")',
            noCoordinates: '"666dummy999"',
            noLocation: 'video.l_id',
            noRoute: '"666dummy999"',
            noSubType: '"666dummy999"',
            todoDesc: '"todoDesc"',
            todoKeywords: 'keyword.kw_name',
            unrated: 'video.v_rate',
            unRatedChildren: '"666dummy999"',
            // changelog
            createdafter_dt: 'v_createdat',
            updatedafter_dt: 'v_updatedat',
            // common
            id: 'video.v_id',
            destination_id_s: 'dt.d_id',
            destination_id_ss: 'dt.d_id',
            image_id_is: '"666dummy999"',
            image_id_i: '"666dummy999"',
            info_id_i: '"666dummy999"',
            info_id_is: '"666dummy999"',
            video_id_i: 'video.v_id',
            video_id_is: 'video.v_id',
            v_fav_url_txt: 'video.v_calced_path',
            poi_id_i: '"666dummy999"',
            poi_id_is: '"666dummy999"',
            route_id_i: 'kategorie.t_id',
            route_id_is: 'kategorie.t_id',
            track_id_i: 'video.k_id',
            track_id_is: 'video.k_id',
            loc_lochirarchie_ids_txt: 'location.l_id',
            l_lochirarchietxt: 'location.l_name',
            track_keywords_txt: 'tkw.kw_name',
            html: 'CONCAT(COALESCE(v_meta_name, ""), " ", k_name, " ", COALESCE(k_meta_shortdesc,""), " ", " ", location.l_lochirarchietxt)',
            htmlNameOnly: 'CONCAT(COALESCE(v_meta_name, ""), " ", k_name)'
        },
        writeMapping: {
            'video.l_id': ':loc_id_i:',
            'video.k_id': ':track_id_i:',
            'video.v_gesperrt': ':blocked_i:',
            'video.v_date': ':datestart_dt:',
            'video.v_meta_shortdesc': ':desc_md_txt:',
            'video.v_gps_lon': ':geo_lon_s:',
            'video.v_gps_lat': ':geo_lat_s:',
            'video.v_gps_ele': ':data_tech_alt_max_i:',
            'video.v_rate': ':rate_pers_gesamt_i:',
            'video.v_rate_motive': ':rate_pers_motive_i:',
            'video.v_rate_wichtigkeit': ':rate_pers_wichtigkeit_i:',
            'video.v_meta_name': ':name_s:',
            'video.v_datefile': ':mediameta_filecreated_dt:',
            'video.v_daterecording': ':mediameta_recordingdate_dt:',
            'video.v_duration': ':mediameta_duration_i:',
            'video.v_filesize': ':mediameta_filesize_i:',
            'video.v_metadata': ':mediameta_metadata_txt:',
            'video.v_resolution': ':mediameta_resolution_s:',
            'video.v_dir': 'SUBSTRING(":v_fav_url_txt:", 1, CHARINDEX("/", ":v_fav_url_txt:") - 1)',
            'video.v_file': 'SUBSTRING(":v_fav_url_txt:", CHARINDEX("/", ":v_fav_url_txt:"))'
        },
        fieldMapping: {
            id: 'id',
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
            blocked_i: 'v_gesperrt',
            data_tech_alt_asc_i: 'k_altitude_asc',
            data_tech_alt_desc_i: 'k_altitude_desc',
            data_tech_alt_min_i: 'v_gps_ele',
            data_tech_alt_max_i: 'v_gps_ele',
            data_tech_dist_f: 'k_distance',
            data_tech_dur_f: 'dur',
            dateshow_dt: 'v_date',
            datestart_dt: 'v_date',
            dateend_dt: 'v_date',
            desc_md_txt: 'v_meta_shortdesc',
            distance: 'geodist',
            geo_lon_s: 'v_gps_lon',
            geo_lat_s: 'v_gps_lat',
            geo_loc_p: 'v_gps_loc',
            v_fav_url_txt: 'v_fav_url_txt',
            mediameta_duration_i: 'v_duration',
            mediameta_filecreated_dt: 'v_datefile',
            mediameta_filename_s: 'v_fav_url_txt',
            mediameta_filesize_i: 'v_filesize',
            mediameta_metadata_txt: 'v_metadata',
            mediameta_recordingdate_dt: 'v_daterecording',
            mediameta_resolution_s: 'v_resolution',
            rate_pers_ausdauer_i: 'k_rate_ausdauer',
            rate_pers_bildung_i: 'k_rate_bildung',
            rate_pers_gesamt_i: 'v_rate',
            rate_pers_kraft_i: 'k_rate_kraft',
            rate_pers_mental_i: 'k_rate_mental',
            rate_pers_motive_i: 'v_rate_motive',
            rate_pers_schwierigkeit_i: 'k_rate_schwierigkeit',
            rate_pers_wichtigkeit_i: 'v_rate_wichtigkeit',
            gpstracks_basefile_s: 'k_gpstracks_basefile',
            gpstracks_state_i: 'k_gpstracks_state',
            keywords_txt: 'v_keywords',
            loc_lochirarchie_s: 'l_lochirarchietxt',
            loc_lochirarchie_ids_s: 'l_lochirarchieids',
            initial_s: '"666dummy999"',
            name_s: 'v_meta_name',
            persons_txt: 'v_persons',
            objects_txt: 'v_objects',
            playlists_txt: 'v_playlists',
            subtype_s: 'subtype',
            type_s: 'type',
            // changelog
            createdat_dt: 'v_createdat',
            updatedat_dt: 'v_updatedat',
            updateversion_i: 'v_updateversion'
        }
    };

    public static readonly keywordModelConfigType: KeywordModelConfigJoinType = {
        table: 'video', joinTable: 'video_keyword', fieldReference: 'v_id',
        changelogConfig: SqlMytbDbVideoConfig.tableConfig.changelogConfig
    };

    public static readonly playlistModelConfigType: PlaylistModelConfigJoinType = {
        table: 'video', joinTable: 'video_playlist', fieldReference: 'v_id', positionField: 'vp_pos',
        detailsField: 'vp_details',
        changelogConfig: SqlMytbDbVideoConfig.tableConfig.changelogConfig
    };

    public static readonly rateModelConfigTypeVideo: RateModelConfigTableType = {
        fieldId: 'v_id',
        table: 'video',
        rateFields: {
            'gesamt': 'v_rate',
            'motive': 'v_rate_motive',
            'wichtigkeit': 'v_rate_wichtigkeit'
        },
        fieldSum: 'v_rate',
        changelogConfig: SqlMytbDbVideoConfig.tableConfig.changelogConfig
    };

    public static readonly rateModelConfigTypeTrackVideo: RateModelConfigTableType = {
        fieldId: 'k_id',
        table: 'video',
        rateFields: {
            'gesamt': 'v_rate',
            'motive': 'v_rate_motive',
            'wichtigkeit': 'v_rate_wichtigkeit'
        },
        fieldSum: 'v_rate',
        changelogConfig: SqlMytbDbVideoConfig.tableConfig.changelogConfig
    };

    public static readonly actionTagAssignConfig: ActionTagAssignTableConfigType = {
        table: 'video',
        idField: 'v_id',
        references: {
            'track_id_is': {
                table: 'kategorie', idField: 'k_id', referenceField: 'k_id'
            },
            'loc_lochirarchie_txt': {
                table: 'location', idField: 'l_id', referenceField: 'l_id'
            }
        },
        changelogConfig: SqlMytbDbVideoConfig.tableConfig.changelogConfig
    };

    public static readonly actionTagBlockConfig: ActionTagBlockTableConfigType = {
        table: 'video', idField: 'v_id', blockField: 'v_gesperrt',
        changelogConfig: SqlMytbDbVideoConfig.tableConfig.changelogConfig
    };

    public static readonly actionTagReplaceConfig: ActionTagReplaceTableConfigType = {
        table: 'video',
        fieldId: 'v_id',
        referenced: [],
        joins: [
            { table: 'video_object', fieldReference: 'v_id' },
            { table: 'video_playlist', fieldReference: 'v_id' },
            { table: 'video_keyword', fieldReference: 'v_id' }
        ],
        changelogConfig: SqlMytbDbVideoConfig.tableConfig.changelogConfig
    };
}

