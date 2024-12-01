import {TableConfig} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {AdapterFilterActions} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';
import {Globals} from './globals';

export class SqlMytbDbOdImageObjectConfig {
    public static readonly tableConfig: TableConfig = {
        key: 'odimgobject',
        tableName: 'image_object',
        selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id ' +
            'LEFT JOIN objects persons ON image_object.io_obj_type=persons.o_key AND persons.o_category = "person" ' +
            'LEFT JOIN objects realobjects ON image_object.io_obj_type=realobjects.o_key' +
            '     AND realobjects.o_category <> "person" ' +
            'LEFT JOIN kategorie ON kategorie.k_id=image.k_id ' +
            'LEFT JOIN location_hirarchical as location ON location.l_id = kategorie.l_id ',
        optionalGroupBy: [
            {
                from: 'LEFT JOIN image_keyword ON image.i_id=image_keyword.i_id ' +
                    'LEFT JOIN keyword ON image_keyword.kw_id=keyword.kw_id',
                triggerParams: ['id', 'keywords_txt'],
                groupByFields: ['GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS i_keywords']
            },
            {
                from: 'LEFT JOIN image_playlist ON image.i_id=image_playlist.i_id ' +
                    'LEFT JOIN playlist ON image_playlist.p_id=playlist.p_id',
                triggerParams: ['playlists_txt'],
                groupByFields: ['GROUP_CONCAT(DISTINCT playlist.p_name ORDER BY playlist.p_name SEPARATOR ", ") AS i_playlists']
            },
            {
                from: 'INNER JOIN (SELECT io_id AS id FROM image_object' +
                    '                     WHERE CONCAT(image_object.i_id, ":::key=", COALESCE(image_object.io_obj_type, ""),' +
                    ' ":::detector=", COALESCE(image_object.io_detector, ""),' +
                    ' ":::objX=", COALESCE(image_object.io_obj_x1, ""),' +
                    ' ":::objY=", COALESCE(image_object.io_obj_y1, ""),' +
                    ' ":::objWidth=", COALESCE(image_object.io_obj_width, ""),' +
                    ' ":::objHeight=", COALESCE(image_object.io_obj_height, ""),' +
                    ' ":::precision=", COALESCE(image_object.io_precision, "")) IN' +
                    '    (SELECT DISTINCT CONCAT(image_object.i_id, ":::key=", COALESCE(image_object.io_obj_type, ""),' +
                    ' ":::detector=", COALESCE(image_object.io_detector, ""),' +
                    ' ":::objX=", COALESCE(image_object.io_obj_x1, ""),' +
                    ' ":::objY=", COALESCE(image_object.io_obj_y1, ""),' +
                    ' ":::objWidth=", COALESCE(image_object.io_obj_width, ""),' +
                    ' ":::objHeight=", COALESCE(image_object.io_obj_height, ""),' +
                    ' ":::precision=", COALESCE(image_object.io_precision, ""))' +
                    '     FROM image_object GROUP BY CONCAT(image_object.i_id, ":::key=", COALESCE(image_object.io_obj_type, ""),' +
                    ' ":::detector=", COALESCE(image_object.io_detector, ""),' +
                    ' ":::objX=", COALESCE(image_object.io_obj_x1, ""),' +
                    ' ":::objY=", COALESCE(image_object.io_obj_y1, ""),' +
                    ' ":::objWidth=", COALESCE(image_object.io_obj_width, ""),' +
                    ' ":::objHeight=", COALESCE(image_object.io_obj_height, ""),' +
                    ' ":::precision=", COALESCE(image_object.io_precision, ""))' +
                    '                    HAVING COUNT(*) > 1)' +
                    '             ) doublettes' +
                    '             ON image_object.io_id=doublettes.id',
                triggerParams: ['doublettes'],
                groupByFields: []
            }
        ],
        loadDetailData: [
            {
                profile: 'image_playlist',
                sql: 'SELECT GROUP_CONCAT(DISTINCT playlist.p_name ORDER BY playlist.p_name SEPARATOR ", ") AS i_playlists ' +
                    'FROM image_object INNER JOIN image ON image_object.i_id=image.i_id' +
                    ' INNER JOIN image_playlist ON image.i_id=image_playlist.i_id' +
                    ' INNER JOIN playlist ON image_playlist.p_id=playlist.p_id ' +
                    'WHERE image_object.io_id IN (:id)',
                parameterNames: ['id'],
                modes: ['details', 'full', 'commonsearch', 'commoninlinesearch']
            },
            {
                profile: 'image_objectdetections',
                sql: 'SELECT GROUP_CONCAT(DISTINCT CONCAT("ioId=", COALESCE(image_object.io_id, ""),' +
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
                    ' ":::state=", COALESCE(image_object.io_state, "")) SEPARATOR ";;") AS i_objectdetections ' +
                    'FROM image INNER JOIN image_object ON image.i_id=image_object.i_id' +
                    ' INNER JOIN objects_key ON image_object.io_obj_type=objects_key.ok_key' +
                    '       AND image_object.io_detector=objects_key.ok_detector ' +
                    ' INNER JOIN objects ON objects_key.o_id=objects.o_id ' +
                    'WHERE image_object.io_id IN (:id)',
                parameterNames: ['id']
            },
            {
                profile: 'keywords',
                sql: 'select GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS keywords ' +
                    'FROM image_object INNER JOIN image ON image_object.i_id=image.i_id' +
                    ' INNER JOIN image_keyword ON image.i_id=image_keyword.i_id' +
                    ' INNER JOIN keyword ON image_keyword.kw_id=keyword.kw_id ' +
                    'WHERE image_object.io_id IN (:id)',
                parameterNames: ['id'],
                modes: ['full']
            }
        ],
        groupbBySelectFieldListIgnore: ['i_keywords', 'i_playlists'],
        selectFieldList: [
            '"ODIMGOBJECT" AS type',
            'k_type',
            'kategorie.k_calced_actiontype AS actiontype',
            'kategorie.k_calced_actiontype AS subtype',
            'CONCAT("ODIMGOBJECT", "_", image_object.io_id) AS id',
            // 'n_id',
            'image.i_id',
            'image.k_id',
            'kategorie.t_id',
            'kategorie.tr_id',
            'kategorie.l_id',
            'COALESCE(persons.o_name, realobjects.o_name, i_meta_name, k_name) AS i_meta_name',
            'i_gesperrt',
            'i_date',
            'DATE_FORMAT(i_date, GET_FORMAT(DATE, "ISO")) AS dateonly',
            'WEEK(i_date) AS week',
            'MONTH(i_date) AS month',
            'YEAR(i_date) AS year',
            'k_gpstracks_basefile',
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
            'persons.o_name AS i_persons',
            'realobjects.o_name AS i_objects'],
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
                filterField: 'CONCAT("ODIMGOBJECT", "_", image_object.io_id)',
                action: AdapterFilterActions.NOTIN
            },
            'actiontype_ss': {
                selectField: 'kategorie.k_calced_actiontype',
                selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id ' +
                    'INNER JOIN kategorie ON kategorie.k_id=image.k_id'
            },
            'blocked_is': {
                selectField: 'i_gesperrt',
                selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id'
            },
            'data_tech_alt_asc_facet_is': {
                selectField: 'k_calced_altAscFacet',
                selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id ' +
                    'INNER JOIN kategorie ON kategorie.k_id=image.k_id',
                orderBy: 'value asc'
            },
            'data_tech_alt_max_facet_is': {
                selectField: 'i_calced_altMaxFacet',
                orderBy: 'value asc',
                selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id'
            },
            'data_tech_dist_facets_fs': {
                selectField: 'k_calced_distFacet',
                selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id ' +
                    'INNER JOIN kategorie ON kategorie.k_id=image.k_id',
                orderBy: 'value asc'
            },
            'data_tech_dur_facet_fs': {
                selectField: 'k_calced_durFacet',
                selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id ' +
                    'INNER JOIN kategorie ON kategorie.k_id=image.k_id',
                orderBy: 'value asc'
            },
            'data_tech_sections_facet_ss': {
                noFacet: true
            },
            'done_ss': {
                selectField: 'CONCAT("DONE", (i_date IS NOT NULL))',
                selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id',
                orderBy: 'value asc'
            },
            'gpstracks_state_is': {
                noFacet: true
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
                    ' INNER JOIN image_object ON image_object.i_id=image.i_id' +
                    ' GROUP BY value, label, id' +
                    ' ORDER BY label ASC',
                triggerTables: ['location', 'kategorie', 'image', 'image_object'],
                filterField: 'GetTechName(l_lochirarchietxt)',
                action: AdapterFilterActions.LIKE
            },
            'month_is': {
                selectField: 'MONTH(i_date)',
                orderBy: 'value asc',
                selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id ',
            },
            'objects_txt': {
                selectSql: 'SELECT COUNT(io_id) AS count, ' +
                    ' o_name AS value ' +
                    'FROM' +
                    ' objects LEFT JOIN image_object ON objects.o_key=image_object.io_obj_type' +
                    ' WHERE objects.o_category NOT IN ("' + Globals.personCategories.join('", "') + '")' +
                    ' GROUP BY value' +
                    ' ORDER BY value',
                filterField: 'realobjects.o_name',
                action: AdapterFilterActions.IN
            },
            'odcats_txt': {
                selectSql: 'SELECT COUNT(io_id) AS count, o_category AS value ' +
                    'FROM' +
                    ' image_object' +
                    ' LEFT JOIN objects_key ON image_object.io_obj_type=objects_key.ok_key' +
                    '      AND image_object.io_detector=objects_key.ok_detector ' +
                    ' LEFT JOIN objects ON objects_key.o_id=objects.o_id ' +
                    ' GROUP BY value' +
                    ' ORDER BY value',
                filterField: 'realobjects.o_category',
                action: AdapterFilterActions.IN
            },
            'oddetectors_txt': {
                selectSql: 'SELECT COUNT(io_id) AS count, ' +
                    ' io_detector AS value ' +
                    'FROM' +
                    ' image_object' +
                    ' GROUP BY value' +
                    ' ORDER BY value',
                filterField: 'io_detector',
                action: AdapterFilterActions.IN
            },
            'odkeys_txt': {
                selectSql: 'SELECT COUNT(io_id) AS count, ' +
                    ' io_obj_type AS value, CONCAT(o_name, " | " , o_category, " | " , io_obj_type) AS label ' +
                    'FROM' +
                    ' image_object' +
                    ' LEFT JOIN objects_key ON image_object.io_obj_type=objects_key.ok_key' +
                    '      AND image_object.io_detector=objects_key.ok_detector ' +
                    ' LEFT JOIN objects ON objects_key.o_id=objects.o_id ' +
                    ' GROUP BY value' +
                    ' ORDER BY label, value',
                filterField: 'io_obj_type',
                action: AdapterFilterActions.IN
            },
            'odkeys_all_txt': {
                ignoreIfNotExplicitNamed: false,
                selectSql: 'SELECT COUNT(io_id) AS count, ' +
                    ' ok_key AS value, CONCAT(o_name, " | " , o_category, " | " , ok_key) AS label ' +
                    'FROM' +
                    ' objects_key' +
                    ' LEFT JOIN image_object  ON image_object.io_obj_type=objects_key.ok_key' +
                    '      AND image_object.io_detector=objects_key.ok_detector ' +
                    ' LEFT JOIN objects ON objects_key.o_id=objects.o_id ' +
                    ' GROUP BY value' +
                    ' ORDER BY label, value',
                filterField: 'io_obj_type',
                action: AdapterFilterActions.IN
            },
            'odcategory_all_txt': {
                ignoreIfNotExplicitNamed: false,
                selectSql: 'SELECT COUNT(io_id) AS count, ' +
                    ' o_category AS value, o_category AS label ' +
                    'FROM' +
                    ' objects_key' +
                    ' LEFT JOIN image_object  ON image_object.io_obj_type=objects_key.ok_key' +
                    '      AND image_object.io_detector=objects_key.ok_detector ' +
                    ' LEFT JOIN objects ON objects_key.o_id=objects.o_id ' +
                    ' GROUP BY value' +
                    ' ORDER BY label, value',
                filterField: 'realobjects.o_category',
                action: AdapterFilterActions.IN
            },
            'odprecision_is': {
                selectSql: 'SELECT COUNT(ROUND(io_precision, 1)*100) AS count, ' +
                    ' ROUND(io_precision, 1)*100 AS value ' +
                    'FROM' +
                    ' image_object' +
                    ' GROUP BY value' +
                    ' ORDER BY value',
                filterField: 'ROUND(io_precision, 1)*100',
                action: AdapterFilterActions.IN
            },
            'odstates_ss': {
                selectSql: 'SELECT COUNT(io_id) AS count, ' +
                    ' io_state AS value ' +
                    'FROM' +
                    ' image_object' +
                    ' GROUP BY value' +
                    ' ORDER BY value',
                filterField: 'io_state',
                action: AdapterFilterActions.IN
            },
            'persons_txt': {
                selectSql: 'SELECT COUNT(io_id) AS count, ' +
                    ' o_name AS value ' +
                    'FROM' +
                    ' objects LEFT JOIN image_object ON objects.o_key=image_object.io_obj_type' +
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
            'rate_pers_gesamt_is': {
                selectField: 'i_rate',
                orderBy: 'value asc',
                selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id'
            },
            'rate_pers_schwierigkeit_is': {
                selectField: 'k_rate_schwierigkeit',
                selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id ' +
                    'INNER JOIN kategorie ON kategorie.k_id=image.k_id',
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
                selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id ' +
                    'INNER JOIN kategorie ON kategorie.k_id=image.k_id',
                orderBy: 'value asc'
            },
            'type_ss': {
                constValues: ['image', 'odimgobject', 'video', 'track', 'route', 'location', 'trip', 'news', 'destination', 'info', 'playlist', 'poi'],
                filterField: '"odimgobject"',
                selectLimit: 1
            },
            'week_is': {
                selectField: 'WEEK(i_date)',
                orderBy: 'value asc',
                selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id'
            },
            'year_is': {
                selectField: 'YEAR(i_date)',
                orderBy: 'value asc',
                selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id'
            }
        },
        sortMapping: {
            'date': 'i_date DESC, image.i_id DESC',
            'dateAsc': 'i_date ASC, image.i_id ASC',
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
            'odState': 'io_state ASC, image.i_id ASC',
            'odPrecision': 'io_precision DESC, image.i_id ASC',
            'ratePers': 'i_rate DESC, i_date DESC',
            'location': 'l_lochirarchietxt ASC, i_date ASC',
            'locationDetails': 'l_lochirarchietxt ASC, i_date ASC',
            'relevance': 'i_date DESC'
        },
        spartialConfig: {
            lat: 'i_gps_lat',
            lon: 'i_gps_lon',
            spatialField: 'geodist',
            spatialSortKey: 'distance'
        },
        filterMapping: {
            // dashboard
            doublettes: '"666dummy999"',
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
            id: 'image_object.io_id',
            image_id_i: 'image.i_id',
            image_id_is: 'image.i_id',
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
            news_id_is: '"666dummy999"',
            gpstracks_state_is: '"666dummy999"',
            initial_s: '"666dummy999"',
            loc_lochirarchie_ids_txt: 'location.l_id',
            l_lochirarchietxt: 'location.l_name',
            html: 'CONCAT(COALESCE(i_meta_name,""), " ", COALESCE(persons.o_name,""), " ", COALESCE(realobjects.o_name,""),  " ", k_name, " ", COALESCE(k_meta_shortdesc,""), " ", location.l_lochirarchietxt)'
        },
        writeMapping: {
            'image_object.i_id': ':image_id_i:'
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
            keywords_txt: 'i_keywords',
            loc_lochirarchie_s: 'l_lochirarchietxt',
            loc_lochirarchie_ids_s: 'l_lochirarchieids',
            name_s: 'i_meta_name',
            persons_txt: 'i_persons',
            objects_txt: 'i_objects',
            playlists_txt: 'i_playlists',
            subtype_s: 'subtype',
            type_s: 'type'
        }
    };

}

