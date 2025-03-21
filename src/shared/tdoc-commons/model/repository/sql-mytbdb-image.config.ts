import {TableConfig} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {AdapterFilterActions} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';
import {ActionTagBlockTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-block.adapter';
import {ActionTagReplaceTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-replace.adapter';
import {ActionTagAssignTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-assign.adapter';
import {KeywordModelConfigJoinType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-keyword.adapter';
import {PlaylistModelConfigJoinType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-playlist.adapter';
import {RateModelConfigTableType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-rate.adapter';
import {Globals} from './globals';
import {PdfEntityDbMapping} from '../../services/tdoc-sql-mytbdb.config';

export class SqlMytbDbImageConfig {
    public static readonly tableConfig: TableConfig = {
        key: 'image',
        tableName: 'image',
        selectFrom: 'image LEFT JOIN kategorie ON kategorie.k_id=image.k_id ' +
            'LEFT JOIN location_hirarchical as location ON location.l_id = kategorie.l_id ',
        optionalGroupBy: [
            {
                from: 'LEFT JOIN image_keyword ON image.i_id=image_keyword.i_id ' +
                    'LEFT JOIN keyword ON image_keyword.kw_id=keyword.kw_id',
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
                from: 'LEFT JOIN image_playlist ON image.i_id=image_playlist.i_id ' +
                    'LEFT JOIN playlist ON image_playlist.p_id=playlist.p_id',
                triggerParams: ['playlists_txt', 'playlists_max_txt', 'playlistPos'],
                groupByFields: ['GROUP_CONCAT(DISTINCT playlist.p_name ORDER BY playlist.p_name SEPARATOR ", ") AS i_playlists']
            },
            {
                from: 'INNER JOIN image_similar ON image.i_id=image_similar.i_similar_id',
                triggerParams: ['image_similar_id_i'],
                groupByFields: ['i_similar_id']
            },
            {
                from: 'LEFT JOIN image_object ON image.i_id=image_object.i_id ' +
                    'LEFT JOIN objects ON image_object.io_obj_type=objects.o_key',
                triggerParams: ['id', 'odstates_ss', 'odprecision_is', 'odcats_txt', 'odkeys_txt', 'oddetectors_txt'],
                groupByFields: ['GROUP_CONCAT(DISTINCT objects.o_name ORDER BY objects.o_name SEPARATOR ", ") AS i_allobjects']
            },
            {
                from: 'LEFT JOIN image_object image_object_persons ON image.i_id=image_object_persons.i_id ' +
                    'LEFT JOIN objects persons ON image_object_persons.io_obj_type=persons.o_key' +
                    ' AND LOWER(persons.o_category) LIKE "person"' +
                    ' AND (image_object_persons.io_precision = 1' +
                    '      OR image_object_persons.io_state in ("' + Globals.detectionOkStates.join('", "') + '"))',
                triggerParams: ['persons_txt'],
                groupByFields: ['GROUP_CONCAT(DISTINCT persons.o_name ORDER BY persons.o_name SEPARATOR ", ") AS i_persons']
            },
            {
                from: 'LEFT JOIN image_object image_object_objects ON image.i_id=image_object_objects.i_id ' +
                    'LEFT JOIN objects realobjects ON image_object_objects.io_obj_type=realobjects.o_key' +
                    ' AND LOWER(realobjects.o_category) NOT LIKE "person"' +
                    ' AND (image_object_objects.io_precision = 1' +
                    '      OR image_object_objects.io_state in ("' + Globals.detectionOkStates.join('", "') + '"))',
                triggerParams: ['objects_txt'],
                groupByFields: ['GROUP_CONCAT(DISTINCT realobjects.o_name ORDER BY realobjects.o_name SEPARATOR ", ") AS i_objects']
            },
            {
                from: 'LEFT JOIN news ON kategorie.k_datevon >= news.n_datevon AND kategorie.k_datevon <= news.n_datebis',
                triggerParams: ['news_id_i', 'news_id_is'],
                groupByFields: ['news.n_id']
            },
            {
                from: 'INNER JOIN (SELECT i_id AS id FROM image INNER JOIN' +
                    '                (SELECT DISTINCT i_dir, i_file FROM image GROUP BY i_dir, i_file' +
                    '                 HAVING COUNT(*) > 1) doublettes' +
                    '                ON image.i_file = doublettes.i_file AND image.i_dir = doublettes.i_dir) doublettes2' +
                    '             ON image.i_id = doublettes2.id',
                triggerParams: ['doublettes'],
                groupByFields: []
            }
        ],
        loadDetailData: [
            {
                profile: 'image_playlist',
                sql: 'SELECT GROUP_CONCAT(DISTINCT playlist.p_name ORDER BY playlist.p_name SEPARATOR ", ") AS i_playlists ' +
                    'FROM image_playlist' +
                    ' INNER JOIN playlist ON image_playlist.p_id=playlist.p_id ' +
                    'WHERE image_playlist.i_id IN (:id)',
                parameterNames: ['id'],
                modes: ['details', 'full', 'commonsearch', 'commoninlinesearch']
            },
            {
                profile: 'image_persons',
                sql: 'SELECT GROUP_CONCAT(DISTINCT objects.o_name ORDER BY objects.o_name SEPARATOR ", ") AS i_persons ' +
                    'FROM image_object' +
                    ' INNER JOIN objects_key ON image_object.io_obj_type=objects_key.ok_key' +
                    ' AND image_object.io_detector=objects_key.ok_detector ' +
                    ' INNER JOIN objects ON objects_key.o_id=objects.o_id ' +
                    ' AND LOWER(o_category) LIKE "person"' +
                    ' AND (image_object.io_precision = 1' +
                    '      OR image_object.io_state in ("' + Globals.detectionOkStates.join('", "') + '"))' +
                    'WHERE image_object.i_id IN (:id)',
                parameterNames: ['id'],
                modes: ['details', 'full', 'commonsearch', 'commoninlinesearch']
            },
            {
                profile: 'image_objects',
                sql: 'SELECT GROUP_CONCAT(DISTINCT objects.o_name ORDER BY objects.o_name SEPARATOR ", ") AS i_objects ' +
                    'FROM image_object' +
                    ' INNER JOIN objects_key ON image_object.io_obj_type=objects_key.ok_key' +
                    ' AND image_object.io_detector=objects_key.ok_detector ' +
                    ' INNER JOIN objects ON objects_key.o_id=objects.o_id ' +
                    ' AND LOWER(o_category) NOT LIKE "person"' +
                    ' AND (image_object.io_precision = 1' +
                    '      OR image_object.io_state in ("' + Globals.detectionOkStates.join('", "') + '"))' +
                    'WHERE image_object.i_id IN (:id)',
                parameterNames: ['id'],
                modes: ['details', 'full', 'commonsearch', 'commoninlinesearch']
            },
            {
                profile: 'image_objectdetections',
                sql: 'SELECT GROUP_CONCAT(DISTINCT CONCAT("ioId=", COALESCE(image_object.io_id, ""),' +
                    ' ":::fileName=", COALESCE(image.i_calced_path, ""),' +
                    ' ":::key=", COALESCE(image_object.io_obj_type, ""),' +
                    ' ":::detector=", COALESCE(image_object.io_detector, ""),' +
                    ' ":::imgWidth=", COALESCE(image_object.io_img_width, ""),' +
                    ' ":::imgHeight=", COALESCE(image_object.io_img_height, ""),' +
                    ' ":::objX=", COALESCE(image_object.io_obj_x1, ""),' +
                    ' ":::objY=", COALESCE(image_object.io_obj_y1, ""),' +
                    ' ":::objWidth=", COALESCE(image_object.io_obj_width, ""),' +
                    ' ":::objHeight=", COALESCE(image_object.io_obj_height, ""),' +
                    ' ":::name=", objects.o_name,' +
                    ' ":::category=", objects.o_category,' +
                    ' ":::precision=", COALESCE(image_object.io_precision, ""),' +
                    ' ":::state=", COALESCE(image_object.io_state, "")) ORDER BY objects.o_name SEPARATOR ";;") AS i_objectdetections ' +
                    'FROM image INNER JOIN image_object ON image.i_id=image_object.i_id ' +
                    ' INNER JOIN objects_key ON image_object.io_obj_type=objects_key.ok_key' +
                    '            AND image_object.io_detector=objects_key.ok_detector ' +
                    ' INNER JOIN objects ON objects_key.o_id=objects.o_id ' +
                    'WHERE image_object.i_id IN (:id)',
                parameterNames: ['id'],
                modes: ['details', 'full', 'commonsearch', 'commoninlinesearch']
            },
            {
                profile: 'keywords',
                sql: 'select GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS keywords ' +
                    'FROM image_keyword' +
                    ' INNER JOIN keyword ON image_keyword.kw_id=keyword.kw_id ' +
                    'WHERE image_keyword.i_id IN (:id)',
                parameterNames: ['id'],
                modes: ['full']
            },
            {
                profile: 'navigation_objects',
                sql: '(SELECT CONCAT("navid=IMAGE_", i_id, ":::name=", COALESCE(i_meta_name, "null"), ":::navtype=", "PREDECESSOR")' +
                    '  AS navigation_objects' +
                    '  FROM image WHERE i_date < (SELECT i_date FROM image WHERE i_id IN (:id))' +
                    '   ORDER BY i_date DESC, i_id DESC LIMIT 1) ' +
                    'UNION ' +
                    ' (SELECT CONCAT("navid=IMAGE_", i_id, ":::name=", COALESCE(i_meta_name, "null"), ":::navtype=", "SUCCESSOR")' +
                    '  AS navigation_objects' +
                    '  FROM image WHERE i_date > (SELECT i_date FROM image WHERE i_id IN (:id))' +
                    '   ORDER BY i_date, i_id LIMIT 1)',
                parameterNames: ['id'],
                modes: ['details', 'full']
            },
            {
                profile: 'linkedplaylists',
                sql: 'SELECT CONCAT("type=playlist:::name=", COALESCE(p_name, "null"), ":::refId=", CAST(playlist.p_id AS CHAR),' +
                    '   ":::position=", COALESCE(image_playlist.ip_pos, "null"),   ":::details=", COALESCE(image_playlist.ip_details, "null"))' +
                    '  AS linkedplaylists' +
                    '  FROM playlist INNER JOIN image_playlist ON playlist.p_id = image_playlist.p_id WHERE image_playlist.i_id IN (:id)' +
                    '  ORDER BY p_name',
                parameterNames: ['id'],
                modes: ['details', 'full', 'playlist_view']
            }
        ],
        groupbBySelectFieldListIgnore: ['i_keywords', 'i_playlists', 'i_persons', 'i_objects', 'i_objectdetections'],
        selectFieldList: [
            '"IMAGE" AS type',
            'k_type',
            'kategorie.k_calced_actiontype AS actiontype',
            'kategorie.k_calced_actiontype AS subtype',
            'CONCAT("IMAGE", "_", image.i_id) AS id',
            // 'n_id',
            'image.i_id',
            'image.k_id',
            'kategorie.t_id',
            'kategorie.tr_id',
            'kategorie.l_id',
            'COALESCE(i_meta_name, k_name) AS i_meta_name',
            'i_gesperrt',
            'i_date',
            'DATE_FORMAT(i_date, GET_FORMAT(DATE, "ISO")) AS dateonly',
            'WEEK(i_date) AS week',
            'MONTH(i_date) AS month',
            'YEAR(i_date) AS year',
            'k_gpstracks_basefile',
            'k_gpstracks_state',
            'i_pdffile',
            'i_meta_shortdesc',
            'i_calced_gps_lat AS i_gps_lat',
            'i_calced_gps_lon AS i_gps_lon',
            'i_calced_gps_loc AS i_gps_loc',
            'l_lochirarchietxt',
            'l_lochirarchieids',
            'i_calced_path AS i_fav_url_txt',
            'i_datefile',
            'i_daterecording',
            'i_filesize',
            'i_metadata',
            'i_resolution',
            'k_altitude_asc',
            'k_altitude_desc',
            'i_gps_ele',
            'i_gps_ele',
            'k_distance',
            'k_rate_ausdauer',
            'k_rate_bildung',
            'i_rate',
            'k_rate_kraft',
            'k_rate_mental',
            'i_rate_motive',
            'k_rate_schwierigkeit',
            'i_rate_wichtigkeit',
            'k_calced_altAscFacet AS altAscFacet',
            'i_calced_altMaxFacet AS altMaxFacet',
            'k_calced_distFacet AS distFacet',
            'k_calced_dur AS dur',
            'k_calced_durFacet AS durFacet',
            // changelog
            'i_createdat',
            'i_updatedat',
            'i_updateversion'],
        facetConfigs: {
            // dashboard
            'doublettes': {
                selectSql: 'SELECT COUNT(image.i_id) AS count, "doublettes" AS value,' +
                    ' "doublettes" AS label, "true" AS id' +
                    ' FROM image INNER JOIN (SELECT i_id AS id FROM image INNER JOIN' +
                    '                (SELECT DISTINCT i_dir, i_file FROM image GROUP BY i_dir, i_file' +
                    '                 HAVING COUNT(*) > 1) doublettes' +
                    '                ON image.i_file = doublettes.i_file AND image.i_dir = doublettes.i_dir) doublettes2' +
                    '             ON image.i_id = doublettes2.id',
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
                selectSql: 'SELECT COUNT(image.i_id) AS count, "noLocation" AS value,' +
                    ' "noLocation" AS label, "true" AS id' +
                    ' FROM image WHERE l_id IS NULL OR l_id IN (0,1 )',
                filterField: 'image.l_id',
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
                selectSql: 'SELECT COUNT(image.k_id) AS count, "todoDesc" AS value,' +
                    ' "todoDesc" AS label, "true" AS id' +
                    ' FROM image WHERE i_meta_shortdesc LIKE "TODODESC%"',
                filterField: 'image.i_meta_shortdesc',
                action: AdapterFilterActions.LIKE
            },
            'todoKeywords': {
                selectSql: 'SELECT COUNT(image.i_id) AS count, "todoKeywords" AS value,' +
                    ' "todoKeywords" AS label, "true" AS id' +
                    ' FROM image INNER JOIN image_keyword ON image.i_id=image_keyword.i_id' +
                    ' INNER JOIN keyword ON image_keyword.kw_id=keyword.kw_id ' +
                    'WHERE keyword.kw_name IN ("KW_TODOKEYWORDS")',
                filterField: 'keyword.kw_name',
                action: AdapterFilterActions.IN
            },
            'unrated': {
                selectSql: 'SELECT COUNT(image.i_id) AS count, "unrated" AS value,' +
                    ' "unrated" AS label, "true" AS id' +
                    ' FROM image WHERE i_rate IS NULL OR i_rate in (0)',
                filterField: 'image.i_rate',
                action: AdapterFilterActions.IN
            },
            'unRatedChildren': {
                constValues: ['unRatedChildren'],
                filterField: '"666dummy999"'
            },
            // common
            'id_notin_is': {
                filterField: 'CONCAT("IMAGE", "_", image.i_id)',
                action: AdapterFilterActions.NOTIN
            },
            'actiontype_ss': {
                selectField: 'kategorie.k_calced_actiontype',
                selectFrom: 'image INNER JOIN kategorie ON kategorie.k_id=image.k_id'
            },
            'blocked_is': {
                selectField: 'i_gesperrt'
            },
            'data_tech_alt_asc_facet_is': {
                selectField: 'k_calced_altAscFacet',
                selectFrom: 'image INNER JOIN kategorie ON kategorie.k_id=image.k_id',
                orderBy: 'value asc'
            },
            'data_tech_alt_max_facet_is': {
                selectField: 'i_calced_altMaxFacet',
                orderBy: 'value asc'
            },
            'data_tech_dist_facets_fs': {
                selectField: 'k_calced_distFacet',
                selectFrom: 'image INNER JOIN kategorie ON kategorie.k_id=image.k_id',
                orderBy: 'value asc'
            },
            'data_tech_dur_facet_fs': {
                selectField: 'k_calced_durFacet',
                selectFrom: 'image INNER JOIN kategorie ON kategorie.k_id=image.k_id',
                orderBy: 'value asc'
            },
            'data_tech_sections_facet_ss': {
                noFacet: true
            },
            'done_ss': {
                selectField: 'CONCAT("DONE", (i_date IS NOT NULL))',
                orderBy: 'value asc'
            },
            'gpstracks_state_is': {
                selectField: 'kategorie.k_gpstracks_state',
                selectFrom: 'image INNER JOIN kategorie ON kategorie.k_id=image.k_id'
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
                selectSql: 'SELECT COUNT(image.l_id) AS count, GetTechName(l_name) AS value, location.l_id AS id,' +
                    ' l_lochirarchietxt AS label' +
                    ' FROM location_hirarchical as location INNER JOIN kategorie ON location.l_id = kategorie.l_id ' +
                    ' INNER JOIN image ON kategorie.k_id=image.k_id ' +
                    ' GROUP BY value, label, id' +
                    ' ORDER BY label ASC',
                triggerTables: ['location', 'kategorie', 'image'],
                filterField: 'GetTechName(l_lochirarchietxt)',
                action: AdapterFilterActions.LIKE
            },
            'month_is': {
                selectField: 'MONTH(i_date)',
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
                selectSql: 'SELECT COUNT(image.i_id) AS count, ' +
                    ' o_name AS value ' +
                    'FROM' +
                    ' objects LEFT JOIN image_object ON objects.o_key=image_object.io_obj_type' +
                    ' INNER JOIN image ON image_object.i_id=image.i_id ' +
                    ' WHERE objects.o_category NOT IN ("' + Globals.personCategories.join('", "') + '")' +
                    ' GROUP BY value' +
                    ' ORDER BY value',
                filterField: 'realobjects.o_name',
                action: AdapterFilterActions.IN
            },
            'odcats_txt': {
                selectSql: 'SELECT COUNT(image.i_id) AS count, o_category AS value ' +
                    'FROM' +
                    ' image_object INNER JOIN image ON image_object.i_id=image.i_id ' +
                    ' LEFT JOIN objects_key ON image_object.io_obj_type=objects_key.ok_key' +
                    '      AND image_object.io_detector=objects_key.ok_detector ' +
                    ' LEFT JOIN objects ON objects_key.o_id=objects.o_id ' +
                    ' GROUP BY value' +
                    ' ORDER BY value',
                filterField: 'objects.o_category',
                action: AdapterFilterActions.IN
            },
            'oddetectors_txt': {
                selectSql: 'SELECT COUNT(image.i_id) AS count, ' +
                    ' io_detector AS value ' +
                    'FROM' +
                    ' image_object INNER JOIN image ON image_object.i_id=image.i_id ' +
                    ' GROUP BY value' +
                    ' ORDER BY value',
                filterField: 'image_object.io_detector',
                action: AdapterFilterActions.IN
            },
            'odkeys_txt': {
                selectSql: 'SELECT COUNT(image.i_id) AS count, ' +
                    ' io_obj_type AS value, CONCAT(o_name, " | "  , o_category, " | " , io_obj_type) AS label ' +
                    'FROM' +
                    ' image_object INNER JOIN image ON image_object.i_id=image.i_id ' +
                    ' LEFT JOIN objects_key ON image_object.io_obj_type=objects_key.ok_key' +
                    '      AND image_object.io_detector=objects_key.ok_detector ' +
                    ' LEFT JOIN objects ON objects_key.o_id=objects.o_id ' +
                    ' GROUP BY value' +
                    ' ORDER BY label, value',
                filterField: 'image_object.io_obj_type',
                action: AdapterFilterActions.IN
            },
            'odkeys_all_txt': {
                ignoreIfNotExplicitNamed: false,
                selectSql: 'SELECT COUNT(image.i_id) AS count, ' +
                    ' ok_key AS value, CONCAT(o_name, " | " , o_category, " | " , ok_key) AS label ' +
                    'FROM' +
                    ' objects_key' +
                    ' LEFT JOIN image_object  ON image_object.io_obj_type=objects_key.ok_key' +
                    '      AND image_object.io_detector=objects_key.ok_detector ' +
                    ' LEFT JOIN objects ON objects_key.o_id=objects.o_id ' +
                    ' LEFT JOIN image ON image_object.i_id=image.i_id ' +
                    ' GROUP BY value' +
                    ' ORDER BY label, value',
                filterField: 'image_object.io_obj_type',
                action: AdapterFilterActions.IN
            },
            'odcategory_all_txt': {
                ignoreIfNotExplicitNamed: false,
                selectSql: 'SELECT COUNT(image.i_id) AS count, ' +
                    ' o_category AS value, o_category AS label ' +
                    'FROM' +
                    ' objects_key' +
                    ' LEFT JOIN image_object ON image_object.io_obj_type=objects_key.ok_key' +
                    '      AND image_object.io_detector=objects_key.ok_detector ' +
                    ' LEFT JOIN objects ON objects_key.o_id=objects.o_id ' +
                    ' LEFT JOIN image ON image_object.i_id=image.i_id ' +
                    ' GROUP BY value' +
                    ' ORDER BY label, value',
                filterField: 'objects.o_category',
                action: AdapterFilterActions.IN
            },
            'odprecision_is': {
                selectSql: 'SELECT COUNT(image.i_id) AS count, ' +
                    ' ROUND(io_precision, 1)*100 AS value ' +
                    'FROM' +
                    ' image_object INNER JOIN image ON image_object.i_id=image.i_id ' +
                    ' GROUP BY value' +
                    ' ORDER BY value',
                filterField: 'ROUND(image_object.io_precision, 1)*100',
                action: AdapterFilterActions.IN
            },
            'odstates_ss': {
                selectSql: 'SELECT COUNT(image.i_id) AS count, ' +
                    ' io_state AS value ' +
                    'FROM' +
                    ' image_object INNER JOIN image ON image_object.i_id=image.i_id ' +
                    ' GROUP BY value' +
                    ' ORDER BY value',
                filterField: 'image_object.io_state',
                action: AdapterFilterActions.IN
            },
            'persons_txt': {
                selectSql: 'SELECT COUNT(image.i_id) AS count, ' +
                    ' o_name AS value ' +
                    'FROM' +
                    ' objects LEFT JOIN image_object ON objects.o_key=image_object.io_obj_type' +
                    ' INNER JOIN image ON image_object.i_id=image.i_id ' +
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
                selectField: 'i_rate',
                orderBy: 'value asc'
            },
            'rate_pers_schwierigkeit_is': {
                selectField: 'k_rate_schwierigkeit',
                selectFrom: 'image INNER JOIN kategorie ON kategorie.k_id=image.k_id',
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
                selectFrom: 'image INNER JOIN kategorie ON kategorie.k_id=image.k_id',
                orderBy: 'value asc'
            },
            'type_ss': {
                constValues: ['image', 'odimgobject', 'video', 'track', 'route', 'location', 'trip', 'news', 'destination', 'info', 'playlist', 'poi'],
                filterField: '"image"',
                selectLimit: 1
            },
            'week_is': {
                selectField: 'WEEK(i_date)',
                orderBy: 'value asc'
            },
            'year_is': {
                selectField: 'YEAR(i_date)',
                orderBy: 'value asc'
            }
        },
        sortMapping: {
            'date': 'i_date DESC, image.i_id DESC',
            'dateAsc': 'i_date ASC, image.i_id ASC',
            'trackDate': 'i_date DESC, image.i_id ASC',
            'trackDateAsc': 'i_date ASC, image.i_id ASC',
            'tripDate': 'i_date DESC, image.i_id ASC',
            'tripDateAsc': 'i_date ASC, image.i_id ASC',
            'distance': 'geodist ASC',
            'dataTechDurDesc': 'k_calced_dur DESC',
            'dataTechAltDesc': 'k_altitude_asc DESC',
            'dataTechMaxDesc': 'i_gps_ele DESC',
            'dataTechDistDesc': 'k_distance DESC',
            'dataTechDurAsc': 'k_calced_dur ASC',
            'dataTechAltAsc': 'k_altitude_asc ASC',
            'dataTechMaxAsc': 'i_gps_ele ASC',
            'dataTechDistAsc': 'k_distance ASC',
            'forExport': 'i_date ASC, image.i_id ASC',
            'ratePers': 'i_rate DESC, i_date DESC',
            'playlistPos': 'image_playlist.ip_pos ASC',
            'location': 'l_lochirarchietxt ASC, i_date ASC',
            'locationDetails': 'l_lochirarchietxt ASC, i_date ASC',
            'relevance': 'i_date DESC',
            'createdAt': 'i_createdat DESC, image.i_id DESC',
            'updatedAt': 'i_updatedat DESC, image.i_id DESC'
        },
        spartialConfig: {
            lat: 'i_gps_lat',
            lon: 'i_gps_lon',
            spatialField: 'geodist',
            spatialSortKey: 'distance'
        },
        changelogConfig: {
            createDateField: 'i_createdat',
            updateDateField: 'i_updatedat',
            updateVersionField: 'i_updateversion',
            table: 'image',
            fieldId: 'i_id'
        },
        filterMapping: {
            // dashboard
            doublettes: '"doublettes"',
            conflictingRates: '"666dummy999"',
            noFavoriteChildren: '"666dummy999"',
            noMainFavoriteChildren: '"666dummy999"',
            noMetaOnly: 'COALESCE(i_metadata, "noMetaOnly")',
            noCoordinates: '"666dummy999"',
            noLocation: 'image.l_id',
            noRoute: '"666dummy999"',
            noSubType: '"666dummy999"',
            todoDesc: '"todoDesc"',
            todoKeywords: 'keyword.kw_name',
            unrated: 'image.i_rate',
            unRatedChildren: '"666dummy999"',
            // changelog
            createdafter_dt: 'i_createdat',
            updatedafter_dt: 'i_updatedat',
            // common
            id: 'image.i_id',
            destination_id_s: 'dt.d_id',
            destination_id_ss: 'dt.d_id',
            image_id_i: 'image.i_id',
            image_similar_id_i: 'image_similar.i_id',
            image_id_is: 'image.i_id',
            i_fav_url_txt: 'image.i_calced_path',
            info_id_i: '"666dummy999"',
            info_id_is: '"666dummy999"',
            video_id_is: '"666dummy999"',
            video_id_i: '"666dummy999"',
            poi_id_i: '"666dummy999"',
            poi_id_is: '"666dummy999"',
            route_id_i: 'kategorie.t_id',
            route_id_is: 'kategorie.t_id',
            track_id_i: 'image.k_id',
            track_id_is: 'image.k_id',
            loc_lochirarchie_ids_txt: 'location.l_id',
            l_lochirarchietxt: 'location.l_name',
            initial_s: '"666dummy999"',
            track_keywords_txt: 'tkw.kw_name',
            html: 'CONCAT(COALESCE(i_meta_name, ""), " ", k_name, " ", COALESCE(k_meta_shortdesc,""), " ", location.l_lochirarchietxt)',
            htmlNameOnly: 'CONCAT(COALESCE(i_meta_name, ""), " ", k_name)'
        },
        writeMapping: {
            'image.l_id': ':loc_id_i:',
            'image.k_id': ':track_id_i:',
            'image.i_gesperrt': ':blocked_i:',
            'image.i_date': ':datestart_dt:',
            'image.i_meta_shortdesc': ':desc_md_txt:',
            'image.i_gps_lon': ':geo_lon_s:',
            'image.i_gps_lat': ':geo_lat_s:',
            'image.i_gps_ele': ':data_tech_alt_max_i:',
            'image.i_rate': ':rate_pers_gesamt_i:',
            'image.i_rate_motive': ':rate_pers_motive_i:',
            'image.i_rate_wichtigkeit': ':rate_pers_wichtigkeit_i:',
            'image.i_meta_name': ':name_s:',
            'image.i_datefile': ':mediameta_filecreated_dt:',
            'image.i_daterecording': ':mediameta_recordingdate_dt:',
            'image.i_filesize': ':mediameta_filesize_i:',
            'image.i_metadata': ':mediameta_metadata_txt:',
            'image.i_resolution': ':mediameta_resolution_s:',
            'image.i_dir': 'SUBSTRING(":i_fav_url_txt:", 1, CHARINDEX("/", ":i_fav_url_txt:") - 1)',
            'image.i_file': 'SUBSTRING(":i_fav_url_txt:", CHARINDEX("/", ":i_fav_url_txt:"))'
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
            actiontype_s: 'actionType',
            blocked_i: 'i_gesperrt',
            data_tech_alt_asc_i: 'k_altitude_asc',
            data_tech_alt_desc_i: 'k_altitude_desc',
            data_tech_alt_min_i: 'i_gps_ele',
            data_tech_alt_max_i: 'i_gps_ele',
            data_tech_dist_f: 'k_distance',
            data_tech_dur_f: 'dur',
            dateshow_dt: 'i_date',
            datestart_dt: 'i_date',
            dateend_dt: 'i_date',
            desc_md_txt: 'i_meta_shortdesc',
            distance: 'geodist',
            geo_lon_s: 'i_gps_lon',
            geo_lat_s: 'i_gps_lat',
            geo_loc_p: 'i_gps_loc',
            i_fav_url_txt: 'i_fav_url_txt',
            mediameta_filecreated_dt: 'i_datefile',
            mediameta_filename_s: 'i_fav_url_txt',
            mediameta_filesize_i: 'i_filesize',
            mediameta_metadata_txt: 'i_metadata',
            mediameta_recordingdate_dt: 'i_daterecording',
            mediameta_resolution_s: 'i_resolution',
            rate_pers_ausdauer_i: 'k_rate_ausdauer',
            rate_pers_bildung_i: 'k_rate_bildung',
            rate_pers_gesamt_i: 'i_rate',
            rate_pers_kraft_i: 'k_rate_kraft',
            rate_pers_mental_i: 'k_rate_mental',
            rate_pers_motive_i: 'i_rate_motive',
            rate_pers_schwierigkeit_i: 'k_rate_schwierigkeit',
            rate_pers_wichtigkeit_i: 'i_rate_wichtigkeit',
            gpstracks_basefile_s: 'k_gpstracks_basefile',
            gpstracks_state_i: 'k_gpstracks_state',
            pdffile_s: 'i_pdffile',
            keywords_txt: 'i_keywords',
            loc_lochirarchie_s: 'l_lochirarchietxt',
            loc_lochirarchie_ids_s: 'l_lochirarchieids',
            name_s: 'i_meta_name',
            persons_txt: 'i_persons',
            objects_txt: 'i_objects',
            playlists_txt: 'i_playlists',
            subtype_s: 'subtype',
            type_s: 'type',
            // changelog
            createdat_dt: 'i_createdat',
            updatedat_dt: 'i_updatedat',
            updateversion_i: 'i_updateversion'
        }
    };

    public static readonly keywordModelConfigType: KeywordModelConfigJoinType = {
        table: 'image', joinTable: 'image_keyword', fieldReference: 'i_id',
        changelogConfig: SqlMytbDbImageConfig.tableConfig.changelogConfig
    };

    public static readonly playlistModelConfigType: PlaylistModelConfigJoinType = {
        table: 'image', joinTable: 'image_playlist', fieldReference: 'i_id', positionField: 'ip_pos',
        detailsField: 'ip_details',
        changelogConfig: SqlMytbDbImageConfig.tableConfig.changelogConfig
    };

    public static readonly rateModelConfigTypeImage: RateModelConfigTableType = {
        fieldId: 'i_id',
        table: 'image',
        rateFields: {
            'gesamt': 'i_rate',
            'motive': 'i_rate_motive',
            'wichtigkeit': 'i_rate_wichtigkeit'
        },
        fieldSum: 'i_rate',
        changelogConfig: SqlMytbDbImageConfig.tableConfig.changelogConfig
    };

    public static readonly rateModelConfigTypeTrackImage: RateModelConfigTableType = {
        fieldId: 'k_id',
        table: 'image',
        rateFields: {
            'gesamt': 'i_rate',
            'motive': 'i_rate_motive',
            'wichtigkeit': 'i_rate_wichtigkeit'
        },
        fieldSum: 'i_rate',
        changelogConfig: SqlMytbDbImageConfig.tableConfig.changelogConfig
    };

    public static readonly actionTagAssignConfig: ActionTagAssignTableConfigType = {
        table: 'image',
        idField: 'i_id',
        references: {
            'track_id_is': {
                table: 'kategorie', idField: 'k_id', referenceField: 'k_id'
            },
            'loc_lochirarchie_txt': {
                table: 'location', idField: 'l_id', referenceField: 'l_id'
            }
        },
        changelogConfig: SqlMytbDbImageConfig.tableConfig.changelogConfig
    };

    public static readonly actionTagBlockConfig: ActionTagBlockTableConfigType = {
        table: 'image', idField: 'i_id', blockField: 'i_gesperrt',
        changelogConfig: SqlMytbDbImageConfig.tableConfig.changelogConfig
    };

    public static readonly actionTagReplaceConfig: ActionTagReplaceTableConfigType = {
        table: 'image',
        fieldId: 'i_id',
        referenced: [],
        joins: [
            { table: 'image_object', fieldReference: 'i_id' },
            { table: 'image_playlist', fieldReference: 'i_id' },
            { table: 'image_keyword', fieldReference: 'i_id' }
        ],
        changelogConfig: SqlMytbDbImageConfig.tableConfig.changelogConfig
    };

    public static readonly pdfEntityDbMapping: PdfEntityDbMapping = {
        table: 'image',
        fieldId: 'i_id',
        fieldFilename: 'i_pdffile'
    };
}

