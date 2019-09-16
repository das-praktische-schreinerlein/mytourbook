import {TableConfig, TableConfigs} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {AdapterFilterActions} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';

export class TourDocSqlMytbDbConfig {
    public static personCategories = ['Person', 'person', 'Familie', 'family', 'friend', 'Freund'];
    public static detectionOkStates = ['RUNNING_MANUAL_APPROVED', 'RUNNING_MANUAL_CORRECTED', 'RUNNING_MANUAL_DETAILED',
        'DONE_APPROVAL_PROCESSED', 'DONE_CORRECTION_PROCESSED', 'DONE_DETAIL_PROCESSED'];
    public static tableConfigs: TableConfigs = {
        'track': {
            key: 'track',
            tableName: 'kategorie',
            selectFrom: 'kategorie LEFT JOIN location ON location.l_id = kategorie.l_id ',
//                        'LEFT JOIN image ON kategorie.i_id=image.i_id ' +
            optionalGroupBy: [
                {
                    from: 'LEFT JOIN kategorie_keyword ON kategorie.k_id=kategorie_keyword.k_id ' +
                          'LEFT JOIN keyword ON kategorie_keyword.kw_id=keyword.kw_id',
                    triggerParams: ['id', 'keywords_txt'],
                    groupByFields: ['GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS k_keywords']
                },
                {
                    from: 'LEFT JOIN kategorie_tour ON kategorie.k_id=kategorie_tour.k_id ' +
                    'LEFT JOIN tour kt ON kategorie_tour.t_id=kt.t_id',
                    triggerParams: ['route_id_i', 'route_id_is'],
                    groupByFields: ['GROUP_CONCAT(DISTINCT kt.t_id ORDER BY kt.t_id SEPARATOR ", ") AS k_kt_ids']
                },
                {
                    from: ' ',
                    triggerParams: ['id', 'loadTrack'],
                    groupByFields: ['k_gpstracks_gpx_source']
                }
            ],
            groupbBySelectFieldListIgnore: ['k_keywords'],
            loadDetailData: [
                {
                    profile: 'image',
                    sql: 'SELECT CONCAT(image.i_dir, "/", image.i_file) AS i_fav_url_txt ' +
                         'FROM image INNER JOIN image_playlist ON image.i_id=image_playlist.i_id ' +
                         'WHERE image.k_id in (:id) and p_id in (18)',
                    parameterNames: ['id']
                },
                {
                    profile: 'keywords',
                    sql: 'select GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS keywords ' +
                    'FROM kategorie INNER JOIN kategorie_keyword ON kategorie.k_id=kategorie_keyword.k_id' +
                    ' INNER JOIN keyword on kategorie_keyword.kw_id=keyword.kw_id ' +
                    'WHERE kategorie.k_id in (:id)',
                    parameterNames: ['id'],
                    modes: ['full']
                }
            ],
            selectFieldList: [
                '"TRACK" AS type',
                'kategorie.k_type',
                'CONCAT("ac_", kategorie.k_type) AS actiontype',
                'CONCAT("ac_", kategorie.k_type) AS subtype',
                'CONCAT("TRACK", "_", kategorie.k_id) AS id',
//                'kategorie.i_id',
                'kategorie.k_id',
                'kategorie.t_id',
                'kategorie.tr_id',
                'kategorie.l_id',
//                'n_id',
                'k_name',
//                'k_html',
                'CONCAT(k_name, " ", COALESCE(k_meta_shortdesc,""), " ", l_name) AS html',
                'k_gesperrt',
                'k_datevon AS k_dateshow',
                'k_datevon',
                'k_datebis',
                'DATE_FORMAT(k_datevon, GET_FORMAT(DATE, "ISO")) AS dateonly',
                'WEEK(k_datevon) AS week',
                'MONTH(k_datevon) AS month',
                'YEAR(k_datevon) AS year',
                'k_gpstracks_basefile',
                'k_meta_shortdesc',
                'k_meta_shortdesc AS k_meta_shortdesc_md',
                'k_meta_shortdesc AS k_meta_shortdesc_html',
                'CAST(l_geo_latdeg AS CHAR(50)) AS k_gps_lat',
                'CAST(l_geo_longdeg AS CHAR(50)) AS k_gps_lon',
                'CONCAT(l_geo_latdeg, ",", l_geo_longdeg) AS k_gps_loc',
                'GetLocationNameAncestry(location.l_id, location.l_name, " -> ") AS l_lochirarchietxt',
                'GetLocationIdAncestry(location.l_id, ",") AS l_lochirarchieids',
//                'CONCAT(image.i_dir, "/", image.i_file) AS i_fav_url_txt',
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
                'actiontype_ss': {
                    selectField: 'CONCAT("ac_", kategorie.k_type)'
                },
                'blocked_is': {
                    selectField: 'k_gesperrt'
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
                    selectSql: 'SELECT COUNT(kategorie.l_id) AS count, GetTechName(l_name) AS value,' +
                    ' GetLocationNameAncestry(location.l_id, location.l_name, " -> ") AS label, location.l_id AS id' +
                    ' FROM location LEFT JOIN kategorie ON kategorie.l_id = location.l_id ' +
                    ' GROUP BY value, label, id' +
                    ' ORDER BY label',
                    filterField: 'GetTechName(GetLocationNameAncestry(location.l_id, location.l_name, " -> "))',
                    action: AdapterFilterActions.LIKE
                },
                'month_is': {
                    selectField: 'MONTH(k_datevon)',
                    orderBy: 'value asc'
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
                'subtype_ss': {
                    selectField: 'CONCAT("ac_", kategorie.k_type)'
                },
                'route_id_i': {
                    filterFields: ['kategorie.t_id', 'kt.t_id'],
                    action: AdapterFilterActions.IN_NUMBER
                },
                'route_id_is': {
                    selectSql: 'SELECT COUNT(kategorie.t_id) AS count, tour.t_id AS value,' +
                    ' tour.t_name AS label, tour.t_id AS id' +
                    ' FROM tour LEFT JOIN kategorie ON kategorie.t_id = tour.t_id ' +
                    ' GROUP BY value, label, id' +
                    ' ORDER BY label',
                    filterFields: ['kategorie.t_id', 'kt.t_id'],
                    action: AdapterFilterActions.IN_NUMBER
                },
                'trip_id_is': {
                    selectSql: 'SELECT COUNT(kategorie.tr_id) AS count, trip.tr_id AS value,' +
                    ' trip.tr_name AS label, trip.tr_id AS id' +
                    ' FROM trip LEFT JOIN kategorie ON kategorie.tr_id = trip.tr_id ' +
                    ' GROUP BY value, label, id' +
                    ' ORDER BY label',
                    filterField: 'tr_id',
                    action: AdapterFilterActions.IN_NUMBER
                },
                'type_txt': {
                    constValues: ['track', 'route', 'image', 'odimgobject', 'video', 'location', 'trip', 'news'],
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
                id: 'kategorie.k_id',
                loc_id_i: 'kategorie.l_id',
                loc_id_is: 'kategorie.l_id',
                route_id_i: 'kategorie.t_id',
                route_id_is: 'kategorie.t_id',
                track_id_i: 'kategorie.k_id',
                track_id_is: 'kategorie.k_id',
                video_id_is: '"dummy"',
                video_id_i: '"dummy"',
                news_id_is: '"dummy"',
                loc_lochirarchie_ids_txt: 'location.l_id',
                l_lochirarchietxt: 'location.l_name',
                html: 'CONCAT(k_name, " ", COALESCE(k_meta_shortdesc,""), " ", l_name)'
            },
            spartialConfig: {
                lat: 'l_geo_latdeg',
                lon: 'l_geo_longdeg',
                spatialField: 'geodist',
                spatialSortKey: 'distance'
            },
            writeMapping: {
                'kategorie.t_id': ':route_id_i:',
                // 'kategorie.i_id': ':image_id_i:',
                'kategorie.l_id': ':loc_id_i:',
                'kategorie.tr_id': ':trip_id_i:',
                //'kategorie.n_id': ':news_id_i:',
                'kategorie.k_gesperrt': ':blocked_i:',
                'kategorie.k_datevon': ':datestart_dt:',
                'kategorie.k_datebis': ':dateend_dt:',
                'kategorie.k_meta_shortdesc': ':desc_txt:',
                //'kategorie.k_meta_shortdesc_md': ':desc_md_txt:',
                //'kategorie.k_meta_shortdesc_html': ':desc_html_txt:',
                'kategorie.k_altitude_asc': ':data_tech_alt_asc_i:',
                'kategorie.k_altitude_desc': ':data_tech_alt_desc_i:',
                'kategorie.k_altitude_min': ':data_tech_alt_min_i:',
                'kategorie.k_altitude_max': ':data_tech_alt_max_i:',
                'kategorie.k_distance': ':data_tech_dist_f:',
                'kategorie.k_rate_ausdauer': ':rate_pers_ausdauer_i:',
                'kategorie.k_rate_bildung': ':rate_pers_bildung_i:',
                'kategorie.k_rate_gesamt': ':rate_pers_gesamt_i:',
                'kategorie.k_rate_kraft': ':rate_pers_kraft_i:',
                'kategorie.k_rate_mental': ':rate_pers_mental_i:',
                'kategorie.k_rate_motive': ':rate_pers_motive_i:',
                'kategorie.k_rate_schwierigkeit': ':rate_pers_schwierigkeit_i:',
                'kategorie.k_rate_wichtigkeit': ':rate_pers_wichtigkeit_i:',
                'kategorie.k_gpstracks_basefile': ':gpstracks_basefile_s:',
                'kategorie.k_gpstracks_gpx_source': ':gpstrack_src_s:',
                'kategorie.k_name': ':name_s:',
                'kategorie.k_type': ':subtype_s:'
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
                blocked_i: 'k_gesperrt',
                dateshow_dt: 'k_dateshow',
                datestart_dt: 'k_datevon',
                dateend_dt: 'k_datebis',
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
                gpstrack_src_s: 'k_gpstracks_gpx_source',
                keywords_txt: 'k_keywords',
                loc_lochirarchie_s: 'l_lochirarchietxt',
                loc_lochirarchie_ids_s: 'l_lochirarchieids',
                name_s: 'k_name',
                type_s: 'type',
                actiontype_s: 'actionType',
                subtype_s: 'subtype',
                i_fav_url_txt: 'i_fav_url_txt'
            }
        },
        'image': {
            key: 'image',
            tableName: 'image',
            selectFrom: 'image LEFT JOIN kategorie ON kategorie.k_id=image.k_id ' +
                        'LEFT JOIN location ON location.l_id = kategorie.l_id ',
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
                    triggerParams: ['id', 'playlists_txt'],
                    groupByFields: ['GROUP_CONCAT(DISTINCT playlist.p_name ORDER BY playlist.p_name SEPARATOR ", ") AS i_playlists']
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
                        '      OR image_object_persons.io_state in ("' + TourDocSqlMytbDbConfig.detectionOkStates.join('", "') + '"))',
                    triggerParams: ['id', 'persons_txt'],
                    groupByFields: ['GROUP_CONCAT(DISTINCT persons.o_name ORDER BY persons.o_name SEPARATOR ", ") AS i_persons']
                },
                {
                    from: 'LEFT JOIN image_object image_object_objects ON image.i_id=image_object_objects.i_id ' +
                        'LEFT JOIN objects realobjects ON image_object_objects.io_obj_type=realobjects.o_key' +
                        ' AND LOWER(realobjects.o_category) NOT LIKE "person"' +
                        ' AND (image_object_objects.io_precision = 1' +
                        '      OR image_object_objects.io_state in ("' + TourDocSqlMytbDbConfig.detectionOkStates.join('", "') + '"))',
                    triggerParams: ['id', 'objects_txt'],
                    groupByFields: ['GROUP_CONCAT(DISTINCT realobjects.o_name ORDER BY realobjects.o_name SEPARATOR ", ") AS i_objects']
                }
            ],
            loadDetailData: [
                {
                    profile: 'image_playlist',
                    sql: 'SELECT GROUP_CONCAT(DISTINCT playlist.p_name ORDER BY playlist.p_name SEPARATOR ", ") AS i_playlists ' +
                    'FROM image INNER JOIN image_playlist ON image.i_id=image_playlist.i_id' +
                    ' INNER JOIN playlist on image_playlist.p_id=playlist.p_id ' +
                    'WHERE image.i_id in (:id)',
                    parameterNames: ['id']
                },
                {
                    profile: 'image_persons',
                    sql: 'SELECT GROUP_CONCAT(DISTINCT objects.o_name ORDER BY objects.o_name SEPARATOR ", ") AS i_persons ' +
                    'FROM image INNER JOIN image_object ON image.i_id=image_object.i_id' +
                    ' INNER JOIN objects_key ON image_object.io_obj_type=objects_key.ok_key' +
                    ' AND image_object.io_detector=objects_key.ok_detector ' +
                    ' INNER JOIN objects ON objects_key.o_id=objects.o_id ' +
                    ' AND LOWER(o_category) LIKE "person"' +
                    ' AND (image_object.io_precision = 1' +
                    '      OR image_object.io_state in ("' + TourDocSqlMytbDbConfig.detectionOkStates.join('", "') + '"))' +
                    'WHERE image.i_id in (:id)',
                    parameterNames: ['id']
                },
                {
                    profile: 'image_objects',
                    sql: 'SELECT GROUP_CONCAT(DISTINCT objects.o_name ORDER BY objects.o_name SEPARATOR ", ") AS i_objects ' +
                        'FROM image INNER JOIN image_object ON image.i_id=image_object.i_id' +
                        ' INNER JOIN objects_key ON image_object.io_obj_type=objects_key.ok_key' +
                        ' AND image_object.io_detector=objects_key.ok_detector ' +
                        ' INNER JOIN objects ON objects_key.o_id=objects.o_id ' +
                        ' AND LOWER(o_category) NOT LIKE "person"' +
                        ' AND (image_object.io_precision = 1' +
                        '      OR image_object.io_state in ("' + TourDocSqlMytbDbConfig.detectionOkStates.join('", "') + '"))' +
                        'WHERE image.i_id in (:id)',
                    parameterNames: ['id']
                },
                {
                    profile: 'image_objectdetections',
                    sql: 'SELECT GROUP_CONCAT(DISTINCT CONCAT("ioId=", image_object.io_id, ":::key=", image_object.io_obj_type,' +
                        ' ":::detector=", image_object.io_detector,' +
                        ' ":::imgWidth=", image_object.io_img_width,' +
                        ' ":::imgHeight=", image_object.io_img_height,' +
                        ' ":::objX=", image_object.io_obj_x1,' +
                        ' ":::objY=", image_object.io_obj_y1,' +
                        ' ":::objWidth=", image_object.io_obj_width,' +
                        ' ":::objHeight=", image_object.io_obj_height,' +
                        ' ":::name=", objects.o_name,' +
                        ' ":::category=", objects.o_category,' +
                        ' ":::precision=", image_object.io_precision,' +
                        ' ":::state=", image_object.io_state) SEPARATOR ";;") as i_objectdetections ' +
                        'FROM image INNER JOIN image_object ON image.i_id=image_object.i_id' +
                        ' INNER JOIN objects_key ON image_object.io_obj_type=objects_key.ok_key AND image_object.io_detector=objects_key.ok_detector ' +
                        ' INNER JOIN objects ON objects_key.o_id=objects.o_id ' +
                        'WHERE image.i_id in (:id)',
                    parameterNames: ['id']
                },
                {
                    profile: 'keywords',
                    sql: 'select GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS keywords ' +
                    'FROM image INNER JOIN image_keyword ON image.i_id=image_keyword.i_id' +
                    ' INNER JOIN keyword on image_keyword.kw_id=keyword.kw_id ' +
                    'WHERE image.i_id in (:id)',
                    parameterNames: ['id'],
                    modes: ['full']
                }
            ],
            groupbBySelectFieldListIgnore: ['i_keywords', 'i_playlists', 'i_persons', 'i_objects', 'i_objectdetections'],
            selectFieldList: [
                '"IMAGE" AS type',
                'k_type',
                'CONCAT("ac_", kategorie.k_type) AS actiontype',
                'CONCAT("ac_", kategorie.k_type) AS subtype',
                'CONCAT("IMAGE", "_", image.i_id) AS id',
                // 'n_id',
                'image.i_id',
                'image.k_id',
                'kategorie.t_id',
                'kategorie.tr_id',
                'kategorie.l_id',
                'COALESCE(i_meta_name,k_name) AS i_meta_name',
                'CONCAT(COALESCE(i_meta_name,""), " ", l_name) AS html',
                'i_gesperrt',
                'i_date',
                'DATE_FORMAT(i_date, GET_FORMAT(DATE, "ISO")) AS dateonly',
                'WEEK(i_date) AS week',
                'MONTH(i_date) AS month',
                'YEAR(i_date) AS year',
                'k_gpstracks_basefile',
                'i_meta_shortdesc',
                'i_meta_shortdesc AS i_meta_shortdesc_md',
                'i_meta_shortdesc AS i_meta_shortdesc_html',
                'CAST(i_gps_lat AS CHAR(50)) AS i_gps_lat',
                'CAST(i_gps_lon AS CHAR(50)) AS i_gps_lon',
                'CONCAT(i_gps_lat, ",", i_gps_lon) AS i_gps_loc',
                'CONCAT("T", location.l_typ, "L", location.l_parent_id, " -> ", location.l_name) AS l_lochirarchietxt',
                'CONCAT(CAST(location.l_parent_id AS CHAR(50)), ",", CAST(location.l_id AS CHAR(50))) AS l_lochirarchieids',
                'CONCAT(image.i_dir, "/", image.i_file) AS i_fav_url_txt',
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
                'ROUND((k_altitude_asc / 500))*500 AS altAscFacet',
                'ROUND((i_gps_ele / 500))*500 AS altMaxFacet',
                'ROUND((k_distance / 5))*5 AS distFacet',
                'TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 AS dur',
                'ROUND(ROUND(TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 * 2) / 2, 1) AS durFacet'],
            facetConfigs: {
                'actiontype_ss': {
                    selectField: 'CONCAT("ac_", kategorie.k_type)',
                    selectFrom: 'image INNER JOIN kategorie ON kategorie.k_id=image.k_id'
                },
                'blocked_is': {
                    selectField: 'i_gesperrt'
                },
                'data_tech_alt_asc_facet_is': {
                    selectField: 'ROUND((k_altitude_asc / 500))*500',
                    selectFrom: 'image INNER JOIN kategorie ON kategorie.k_id=image.k_id',
                    orderBy: 'value asc'
                },
                'data_tech_alt_max_facet_is': {
                    selectField: 'ROUND((i_gps_ele / 500))*500',
                    orderBy: 'value asc'
                },
                'data_tech_dist_facets_fs': {
                    selectField: 'ROUND((k_distance / 5))*5',
                    selectFrom: 'image INNER JOIN kategorie ON kategorie.k_id=image.k_id',
                    orderBy: 'value asc'
                },
                'data_tech_dur_facet_fs': {
                    selectField: 'ROUND(ROUND(TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 * 2) / 2, 1)',
                    selectFrom: 'image INNER JOIN kategorie ON kategorie.k_id=image.k_id',
                    orderBy: 'value asc'
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
                    ' location.l_name AS label' +
                    ' FROM location INNER JOIN kategorie ON location.l_id = kategorie.l_id ' +
                    ' INNER JOIN image ON kategorie.k_id=image.k_id ' +
                    ' GROUP BY GetTechName(l_name), location.l_id' +
                    ' ORDER BY l_name ASC',
                    filterField: 'GetTechName(l_name)',
                    action: AdapterFilterActions.IN
                },
                'month_is': {
                    selectField: 'MONTH(i_date)',
                    orderBy: 'value asc'
                },
                'objects_txt': {
                    selectSql: 'SELECT COUNT(image.i_id) AS count, ' +
                        ' o_name AS value ' +
                        'FROM' +
                        ' objects LEFT JOIN image_object ON objects.o_key=image_object.io_obj_type' +
                        ' INNER JOIN image ON image_object.i_id=image.i_id ' +
                        ' WHERE objects.o_category NOT IN ("' + TourDocSqlMytbDbConfig.personCategories.join('", "') + '")' +
                        ' GROUP BY value' +
                        ' ORDER BY value',
                    filterField: 'realobjects.o_name',
                    action: AdapterFilterActions.IN
                },
                'odcats_txt': {
                    selectSql: 'SELECT COUNT(image.i_id) AS count, o_category AS value ' +
                        'FROM' +
                        ' image_object INNER JOIN image ON image_object.i_id=image.i_id ' +
                        ' LEFT JOIN objects_key ON image_object.io_obj_type=objects_key.ok_key AND image_object.io_detector=objects_key.ok_detector ' +
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
                        ' io_obj_type AS value, CONCAT(o_name, " | "  , o_category, " | " , io_obj_type) as label ' +
                        'FROM' +
                        ' image_object INNER JOIN image ON image_object.i_id=image.i_id ' +
                        ' LEFT JOIN objects_key ON image_object.io_obj_type=objects_key.ok_key AND image_object.io_detector=objects_key.ok_detector ' +
                        ' LEFT JOIN objects ON objects_key.o_id=objects.o_id ' +
                        ' GROUP BY value' +
                        ' ORDER BY label, value',
                    filterField: 'image_object.io_obj_type',
                    action: AdapterFilterActions.IN
                },
                'odkeys_all_txt': {
                    ignoreIfNotExplicitNamed: false,
                    selectSql: 'SELECT COUNT(image.i_id) AS count, ' +
                        ' ok_key AS value, CONCAT(o_name, " | " , o_category, " | " , ok_key) as label ' +
                        'FROM' +
                        ' objects_key LEFT JOIN image_object  ON image_object.io_obj_type=objects_key.ok_key AND image_object.io_detector=objects_key.ok_detector ' +
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
                        ' o_category AS value, o_category as label ' +
                        'FROM' +
                        ' objects_key LEFT JOIN image_object  ON image_object.io_obj_type=objects_key.ok_key AND image_object.io_detector=objects_key.ok_detector ' +
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
                    ' WHERE objects.o_category IN ("' + TourDocSqlMytbDbConfig.personCategories.join('", "') + '")' +
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
                'subtype_ss': {
                    selectField: 'CONCAT("ac_", kategorie.k_type)',
                    selectFrom: 'image INNER JOIN kategorie ON kategorie.k_id=image.k_id',
                    orderBy: 'value asc'
                },
                'type_txt': {
                    constValues: ['image', 'odimgobject', 'video', 'track', 'route', 'location', 'trip', 'news'],
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
                'distance': 'geodist ASC',
                'dataTechDurDesc': 'TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevON))/3600 DESC',
                'dataTechAltDesc': 'k_altitude_asc DESC',
                'dataTechMaxDesc': 'i_gps_ele DESC',
                'dataTechDistDesc': 'k_distance DESC',
                'dataTechDurAsc': 'TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 ASC',
                'dataTechAltAsc': 'k_altitude_asc ASC',
                'dataTechMaxAsc': 'i_gps_ele ASC',
                'dataTechDistAsc': 'k_distance ASC',
                'forExport': 'i_date ASC, image.i_id ASC',
                'ratePers': 'i_rate DESC, i_date DESC',
                'location': 'l_lochirarchietxt ASC',
                'relevance': 'i_date DESC'
            },
            spartialConfig: {
                lat: 'i_gps_lat',
                lon: 'i_gps_lon',
                spatialField: 'geodist',
                spatialSortKey: 'distance'
            },
            filterMapping: {
                id: 'image.i_id',
                image_id_i: 'image.i_id',
                image_id_is: 'image.i_id',
                video_id_is: '"dummy"',
                video_id_i: '"dummy"',
                route_id_i: 'kategorie.t_id',
                route_id_is: 'kategorie.t_id',
                track_id_i: 'image.k_id',
                track_id_is: 'image.k_id',
                news_id_is: '"dummy"',
                loc_lochirarchie_ids_txt: 'location.l_id',
                l_lochirarchietxt: 'location.l_name',
                html: 'CONCAT(COALESCE(i_meta_name,""), " ", l_name)'
            },
            writeMapping: {
                'image.l_id': ':loc_id_i:',
                'image.k_id': ':track_id_i:',
                'image.i_gesperrt': ':blocked_i:',
                'image.i_date': ':datestart_dt:',
                'image.i_meta_shortdesc': ':desc_txt:',
                //'image.i_meta_shortdesc_md': ':desc_md_txt:',
                //'image.i_meta_shortdesc_html': ':desc_html_txt:',
                'image.i_gps_lon': ':geo_lon_s:',
                'image.i_gps_lat': ':geo_lat_s:',
                'image.i_gps_ele': ':data_tech_alt_max_i:',
                'image.i_rate': ':rate_pers_gesamt_i:',
                'image.i_rate_motive': ':rate_pers_motive_i:',
                'image.i_rate_wichtigkeit': ':rate_pers_wichtigkeit_i:',
                'image.i_meta_name': ':name_s:',
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
                desc_txt: 'i_meta_shortdesc',
                desc_md_txt: 'i_meta_shortdesc_md',
                desc_html_txt: 'i_meta_shortdesc_html',
                distance: 'geodist',
                geo_lon_s: 'i_gps_lon',
                geo_lat_s: 'i_gps_lat',
                geo_loc_p: 'i_gps_loc',
                i_fav_url_txt: 'i_fav_url_txt',
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
        },
        'odimgobject': {
            key: 'odimgobject',
            tableName: 'image_object',
            selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id ' +
                'LEFT JOIN objects persons ON image_object.io_obj_type=persons.o_key AND LOWER(persons.o_category) LIKE "person" ' +
                'LEFT JOIN objects realobjects ON image_object.io_obj_type=realobjects.o_key AND LOWER(realobjects.o_category) NOT LIKE "person" ' +
                'LEFT JOIN kategorie ON kategorie.k_id=image.k_id ' +
                'LEFT JOIN location ON location.l_id = kategorie.l_id ',
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
                    triggerParams: ['id', 'playlists_txt'],
                    groupByFields: ['GROUP_CONCAT(DISTINCT playlist.p_name ORDER BY playlist.p_name SEPARATOR ", ") AS i_playlists']
                }
            ],
            loadDetailData: [
                {
                    profile: 'image_playlist',
                    sql: 'SELECT GROUP_CONCAT(DISTINCT playlist.p_name ORDER BY playlist.p_name SEPARATOR ", ") AS i_playlists ' +
                        'FROM image_object INNER JOIN image ON image_object.i_id=image.i_id' +
                        ' INNER JOIN image_playlist ON image.i_id=image_playlist.i_id' +
                        ' INNER JOIN playlist on image_playlist.p_id=playlist.p_id ' +
                        'WHERE image_object.io_id in (:id)',
                    parameterNames: ['id']
                },
                {
                    profile: 'image_objectdetections',
                    sql: 'SELECT GROUP_CONCAT(DISTINCT CONCAT("ioId=", image_object.io_id,' +
                        ' ":::key=", image_object.io_obj_type,' +
                        ' ":::detector=", image_object.io_detector,' +
                        ' ":::imgWidth=", image_object.io_img_width,' +
                        ' ":::imgHeight=", image_object.io_img_height,' +
                        ' ":::objX=", image_object.io_obj_x1,' +
                        ' ":::objY=", image_object.io_obj_y1,' +
                        ' ":::objWidth=", image_object.io_obj_width,' +
                        ' ":::objHeight=", image_object.io_obj_height,' +
                        ' ":::name=", objects.o_name,' +
                        ' ":::category=", objects.o_category,' +
                        ' ":::precision=", image_object.io_precision,' +
                        ' ":::state=", image_object.io_state) SEPARATOR ";;") as i_objectdetections ' +
                        'FROM image INNER JOIN image_object ON image.i_id=image_object.i_id' +
                        ' INNER JOIN objects_key ON image_object.io_obj_type=objects_key.ok_key AND image_object.io_detector=objects_key.ok_detector ' +
                        ' INNER JOIN objects ON objects_key.o_id=objects.o_id ' +
                        'WHERE image_object.io_id in (:id)',
                    parameterNames: ['id']
                },
                {
                    profile: 'keywords',
                    sql: 'select GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS keywords ' +
                        'FROM image_object INNER JOIN image ON image_object.i_id=image.i_id' +
                        ' INNER JOIN image_keyword ON image.i_id=image_keyword.i_id' +
                        ' INNER JOIN keyword on image_keyword.kw_id=keyword.kw_id ' +
                        'WHERE image_object.io_id in (:id)',
                    parameterNames: ['id'],
                    modes: ['full']
                }
            ],
            groupbBySelectFieldListIgnore: ['i_keywords', 'i_playlists'],
            selectFieldList: [
                '"ODIMGOBJECT" AS type',
                'k_type',
                'CONCAT("ac_", kategorie.k_type) AS actiontype',
                'CONCAT("ac_", kategorie.k_type) AS subtype',
                'CONCAT("ODIMGOBJECT", "_", image_object.io_id) AS id',
                // 'n_id',
                'image.i_id',
                'image.k_id',
                'kategorie.t_id',
                'kategorie.tr_id',
                'kategorie.l_id',
                'COALESCE(persons.o_name, realobjects.o_name, i_meta_name, k_name) AS i_meta_name',
                'CONCAT(COALESCE(persons.o_name,""), " ", COALESCE(realobjects.o_name,""), " ", l_name) AS html',
                'i_gesperrt',
                'i_date',
                'DATE_FORMAT(i_date, GET_FORMAT(DATE, "ISO")) AS dateonly',
                'WEEK(i_date) AS week',
                'MONTH(i_date) AS month',
                'YEAR(i_date) AS year',
                'k_gpstracks_basefile',
                'i_meta_shortdesc',
                'i_meta_shortdesc AS i_meta_shortdesc_md',
                'i_meta_shortdesc AS i_meta_shortdesc_html',
                'CAST(i_gps_lat AS CHAR(50)) AS i_gps_lat',
                'CAST(i_gps_lon AS CHAR(50)) AS i_gps_lon',
                'CONCAT(i_gps_lat, ",", i_gps_lon) AS i_gps_loc',
                'CONCAT("T", location.l_typ, "L", location.l_parent_id, " -> ", location.l_name) AS l_lochirarchietxt',
                'CONCAT(CAST(location.l_parent_id AS CHAR(50)), ",", CAST(location.l_id AS CHAR(50))) AS l_lochirarchieids',
                'CONCAT(image.i_dir, "/", image.i_file) AS i_fav_url_txt',
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
                'ROUND((k_altitude_asc / 500))*500 AS altAscFacet',
                'ROUND((i_gps_ele / 500))*500 AS altMaxFacet',
                'ROUND((k_distance / 5))*5 AS distFacet',
                'TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 AS dur',
                'ROUND(ROUND(TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 * 2) / 2, 1) AS durFacet',
                'persons.o_name AS i_persons',
                'realobjects.o_name AS i_objects'],
            facetConfigs: {
                'actiontype_ss': {
                    selectField: 'CONCAT("ac_", kategorie.k_type)',
                    selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id ' +
                        'INNER JOIN kategorie ON kategorie.k_id=image.k_id'
                },
                'blocked_is': {
                    selectField: 'i_gesperrt',
                    selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id'
                },
                'data_tech_alt_asc_facet_is': {
                    selectField: 'ROUND((k_altitude_asc / 500))*500',
                    selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id ' +
                                'INNER JOIN kategorie ON kategorie.k_id=image.k_id',
                    orderBy: 'value asc'
                },
                'data_tech_alt_max_facet_is': {
                    selectField: 'ROUND((i_gps_ele / 500))*500',
                    orderBy: 'value asc',
                    selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id'
                },
                'data_tech_dist_facets_fs': {
                    selectField: 'ROUND((k_distance / 5))*5',
                    selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id ' +
                                'INNER JOIN kategorie ON kategorie.k_id=image.k_id',
                    orderBy: 'value asc'
                },
                'data_tech_dur_facet_fs': {
                    selectField: 'ROUND(ROUND(TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 * 2) / 2, 1)',
                    selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id ' +
                        'INNER JOIN kategorie ON kategorie.k_id=image.k_id',
                    orderBy: 'value asc'
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
                        ' location.l_name AS label' +
                        ' FROM location INNER JOIN kategorie ON location.l_id = kategorie.l_id ' +
                        ' INNER JOIN image ON kategorie.k_id=image.k_id ' +
                        ' INNER JOIN image_object ON image_object.i_id=image.i_id' +
                        ' GROUP BY GetTechName(l_name), location.l_id' +
                        ' ORDER BY l_name ASC',
                    filterField: 'GetTechName(l_name)',
                    action: AdapterFilterActions.IN
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
                        ' WHERE objects.o_category NOT IN ("' + TourDocSqlMytbDbConfig.personCategories.join('", "') + '")' +
                        ' GROUP BY value' +
                        ' ORDER BY value',
                    filterField: 'realobjects.o_name',
                    action: AdapterFilterActions.IN
                },
                'odcats_txt': {
                    selectSql: 'SELECT COUNT(io_id) AS count, o_category AS value ' +
                        'FROM' +
                        ' image_object LEFT JOIN objects_key ON image_object.io_obj_type=objects_key.ok_key AND image_object.io_detector=objects_key.ok_detector ' +
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
                        ' io_obj_type AS value, CONCAT(o_name, " | " , o_category, " | " , io_obj_type) as label ' +
                        'FROM' +
                        ' image_object LEFT JOIN objects_key ON image_object.io_obj_type=objects_key.ok_key AND image_object.io_detector=objects_key.ok_detector ' +
                        ' LEFT JOIN objects ON objects_key.o_id=objects.o_id ' +
                        ' GROUP BY value' +
                        ' ORDER BY label, value',
                    filterField: 'io_obj_type',
                    action: AdapterFilterActions.IN
                },
                'odkeys_all_txt': {
                    ignoreIfNotExplicitNamed: false,
                    selectSql: 'SELECT COUNT(io_id) AS count, ' +
                        ' ok_key AS value, CONCAT(o_name, " | " , o_category, " | " , ok_key) as label ' +
                        'FROM' +
                        ' objects_key LEFT JOIN image_object  ON image_object.io_obj_type=objects_key.ok_key AND image_object.io_detector=objects_key.ok_detector ' +
                        ' LEFT JOIN objects ON objects_key.o_id=objects.o_id ' +
                        ' GROUP BY value' +
                        ' ORDER BY label, value',
                    filterField: 'io_obj_type',
                    action: AdapterFilterActions.IN
                },
                'odcategory_all_txt': {
                    ignoreIfNotExplicitNamed: false,
                    selectSql: 'SELECT COUNT(io_id) AS count, ' +
                        ' o_category AS value, o_category as label ' +
                        'FROM' +
                        ' objects_key LEFT JOIN image_object  ON image_object.io_obj_type=objects_key.ok_key AND image_object.io_detector=objects_key.ok_detector ' +
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
                        ' WHERE objects.o_category IN ("' + TourDocSqlMytbDbConfig.personCategories.join('", "') + '")' +
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
                'subtype_ss': {
                    selectField: 'CONCAT("ac_", kategorie.k_type)',
                    selectFrom: 'image_object INNER JOIN image ON image_object.i_id=image.i_id ' +
                        'INNER JOIN kategorie ON kategorie.k_id=image.k_id',
                    orderBy: 'value asc'
                },
                'type_txt': {
                    constValues: ['image', 'odimgobject', 'video', 'track', 'route', 'location', 'trip', 'news'],
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
                'dataTechDurDesc': 'TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevON))/3600 DESC',
                'dataTechAltDesc': 'k_altitude_asc DESC',
                'dataTechMaxDesc': 'i_gps_ele DESC',
                'dataTechDistDesc': 'k_distance DESC',
                'dataTechDurAsc': 'TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 ASC',
                'dataTechAltAsc': 'k_altitude_asc ASC',
                'dataTechMaxAsc': 'i_gps_ele ASC',
                'dataTechDistAsc': 'k_distance ASC',
                'forExport': 'i_date ASC, image.i_id ASC',
                'odState': 'io_stat ASC, image.i_id ASC',
                'ratePers': 'i_rate DESC, i_date DESC',
                'location': 'l_lochirarchietxt ASC',
                'relevance': 'i_date DESC'
            },
            spartialConfig: {
                lat: 'i_gps_lat',
                lon: 'i_gps_lon',
                spatialField: 'geodist',
                spatialSortKey: 'distance'
            },
            filterMapping: {
                id: 'image_object.io_id',
                image_id_i: 'image.i_id',
                image_id_is: 'image.i_id',
                video_id_is: '"dummy"',
                video_id_i: '"dummy"',
                route_id_i: 'kategorie.t_id',
                route_id_is: 'kategorie.t_id',
                track_id_i: 'image.k_id',
                track_id_is: 'image.k_id',
                news_id_is: '"dummy"',
                loc_lochirarchie_ids_txt: 'location.l_id',
                l_lochirarchietxt: 'location.l_name',
                html: 'CONCAT(COALESCE(i_meta_name,""), " ", l_name)'
            },
            // TODO: for import
            writeMapping: {
                'image_object.i_id': ':image_id_i:',
                'image_object.i_rate': ':rate_pers_gesamt_i:'
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
                desc_txt: 'i_meta_shortdesc',
                desc_md_txt: 'i_meta_shortdesc_md',
                desc_html_txt: 'i_meta_shortdesc_html',
                distance: 'geodist',
                geo_lon_s: 'i_gps_lon',
                geo_lat_s: 'i_gps_lat',
                geo_loc_p: 'i_gps_loc',
                i_fav_url_txt: 'i_fav_url_txt',
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
        },
        'video': {
            key: 'video',
            tableName: 'video',
            selectFrom: 'video LEFT JOIN kategorie ON kategorie.k_id=video.k_id ' +
            'LEFT JOIN location ON location.l_id = kategorie.l_id ',
            optionalGroupBy: [
                {
                    from: 'LEFT JOIN video_keyword ON video.v_id=video_keyword.v_id ' +
                    'LEFT JOIN keyword ON video_keyword.kw_id=keyword.kw_id',
                    triggerParams: ['id', 'keywords_txt'],
                    groupByFields: ['GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS i_keywords']
                },
                {
                    from: 'LEFT JOIN video_playlist ON video.v_id=video_playlist.v_id ' +
                    'LEFT JOIN playlist ON video_playlist.p_id=playlist.p_id',
                    triggerParams: ['id', 'playlists_txt'],
                    groupByFields: ['GROUP_CONCAT(DISTINCT playlist.p_name ORDER BY playlist.p_name SEPARATOR ", ") AS v_playlists']
                },
                {
                    from: 'LEFT JOIN video_object ON video.v_id=video_object.v_id ' +
                    'LEFT JOIN objects persons ON video_object.vo_obj_type=persons.o_key AND LOWER(persons.o_category) LIKE "person" ',
                    triggerParams: ['id', 'persons_txt'],
                    groupByFields: ['GROUP_CONCAT(DISTINCT persons.o_name ORDER BY persons.o_name SEPARATOR ", ") AS v_persons']
                },
                {
                    from: 'LEFT JOIN video_object ON video.v_id=video_object.v_id ' +
                        'LEFT JOIN objects realobjects ON video_object.vo_obj_type=realobjects.o_key AND LOWER(realobjects.o_category) NOT LIKE "person"',
                    triggerParams: ['id', 'objects_txt'],
                    groupByFields: ['GROUP_CONCAT(DISTINCT realobjects.o_name ORDER BY realobjects.o_name SEPARATOR ", ") AS v_objects']
                }
            ],
            loadDetailData: [
                {
                    profile: 'video_playlist',
                    sql: 'SELECT GROUP_CONCAT(DISTINCT playlist.p_name ORDER BY playlist.p_name SEPARATOR ", ") AS v_playlists ' +
                    'FROM video INNER JOIN video_playlist ON video.v_id=video_playlist.v_id' +
                    ' INNER JOIN playlist on video_playlist.p_id=playlist.p_id ' +
                    'WHERE video.v_id in (:id)',
                    parameterNames: ['id']
                },
                {
                    profile: 'video_persons',
                    sql: 'SELECT GROUP_CONCAT(DISTINCT objects.o_name ORDER BY objects.o_name SEPARATOR ", ") AS v_persons ' +
                    'FROM video INNER JOIN video_object ON video.v_id=video_object.v_id' +
                    ' INNER JOIN objects ON video_object.vo_obj_type=objects.o_key AND LOWER(o_category) LIKE "person" ' +
                    'WHERE video.v_id in (:id)',
                    parameterNames: ['id']
                },
                {
                    profile: 'video_objects',
                    sql: 'SELECT GROUP_CONCAT(DISTINCT objects.o_name ORDER BY objects.o_name SEPARATOR ", ") AS v_objects ' +
                        'FROM video INNER JOIN video_object ON video.v_id=video_object.v_id' +
                        ' INNER JOIN objects ON video_object.vo_obj_type=objects.o_key AND LOWER(o_category) NOT LIKE "person" ' +
                        'WHERE video.v_id in (:id)',
                    parameterNames: ['id']
                },
                {
                    profile: 'keywords',
                    sql: 'select GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS keywords ' +
                    'FROM video INNER JOIN video_keyword ON video.v_id=video_keyword.v_id' +
                    ' INNER JOIN keyword on video_keyword.kw_id=keyword.kw_id ' +
                    'WHERE video.v_id in (:id)',
                    parameterNames: ['id'],
                    modes: ['full']
                }
            ],
            groupbBySelectFieldListIgnore: ['v_keywords', 'v_playlists', 'v_persons', 'v_objects'],
            selectFieldList: [
                '"VIDEO" AS type',
                'k_type',
                'CONCAT("ac_", kategorie.k_type) AS actiontype',
                'CONCAT("ac_", kategorie.k_type) AS subtype',
                'CONCAT("VIDEO", "_", video.v_id) AS id',
                // 'n_id',
                'video.v_id',
                'video.k_id',
                'kategorie.t_id',
                'kategorie.tr_id',
                'kategorie.l_id',
                'COALESCE(v_meta_name,k_name) AS v_meta_name',
                'CONCAT(COALESCE(v_meta_name,""), " ", l_name) AS html',
                'v_gesperrt',
                'v_date',
                'DATE_FORMAT(v_date, GET_FORMAT(DATE, "ISO")) AS dateonly',
                'WEEK(v_date) AS week',
                'MONTH(v_date) AS month',
                'YEAR(v_date) AS year',
                'k_gpstracks_basefile',
                'v_meta_shortdesc',
                'v_meta_shortdesc AS v_meta_shortdesc_md',
                'v_meta_shortdesc AS v_meta_shortdesc_html',
                'CAST(v_gps_lat AS CHAR(50)) AS v_gps_lat',
                'CAST(v_gps_lon AS CHAR(50)) AS v_gps_lon',
                'CONCAT(v_gps_lat, ",", v_gps_lon) AS v_gps_loc',
                'CONCAT("T", location.l_typ, "L", location.l_parent_id, " -> ", location.l_name) AS l_lochirarchietxt',
                'CONCAT(CAST(location.l_parent_id AS CHAR(50)), ",", CAST(location.l_id AS CHAR(50))) AS l_lochirarchieids',
                'CONCAT(video.v_dir, "/", video.v_file) AS v_fav_url_txt',
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
                'ROUND((k_altitude_asc / 500))*500 AS altAscFacet',
                'ROUND((v_gps_ele / 500))*500 AS altMaxFacet',
                'ROUND((k_distance / 5))*5 AS distFacet',
                'TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 AS dur',
                'ROUND(ROUND(TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 * 2) / 2, 1) AS durFacet'],
            facetConfigs: {
                'actiontype_ss': {
                    selectField: 'CONCAT("ac_", kategorie.k_type)',
                    selectFrom: 'video INNER JOIN kategorie ON kategorie.k_id=video.k_id'
                },
                'blocked_is': {
                    selectField: 'v_gesperrt'
                },
                'data_tech_alt_asc_facet_is': {
                    selectField: 'ROUND((k_altitude_asc / 500))*500',
                    selectFrom: 'video INNER JOIN kategorie ON kategorie.k_id=video.k_id',
                    orderBy: 'value asc'
                },
                'data_tech_alt_max_facet_is': {
                    selectField: 'ROUND((v_gps_ele / 500))*500',
                    orderBy: 'value asc'
                },
                'data_tech_dist_facets_fs': {
                    selectField: 'ROUND((k_distance / 5))*5',
                    selectFrom: 'video INNER JOIN kategorie ON kategorie.k_id=video.k_id',
                    orderBy: 'value asc'
                },
                'data_tech_dur_facet_fs': {
                    selectField: 'ROUND(ROUND(TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 * 2) / 2, 1)',
                    selectFrom: 'video INNER JOIN kategorie ON kategorie.k_id=video.k_id',
                    orderBy: 'value asc'
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
                    ' GetLocationNameAncestry(location.l_id, location.l_name, " -> ") AS label' +
                    ' FROM location LEFT JOIN kategorie ON location.l_id = kategorie.l_id ' +
                    ' LEFT JOIN video ON kategorie.k_id=video.k_id ' +
                    ' GROUP BY GetTechName(l_name), location.l_id' +
                    ' ORDER BY label ASC',
                    filterField: 'GetTechName(GetLocationNameAncestry(location.l_id, location.l_name, " -> "))',
                    action: AdapterFilterActions.LIKE
                },
                'month_is': {
                    selectField: 'MONTH(v_date)',
                    orderBy: 'value asc'
                },
                'objects_txt': {
                    selectSql: 'SELECT COUNT(vo_obj_type) AS count, ' +
                        ' o_name AS value ' +
                        'FROM' +
                        ' objects LEFT JOIN video_object ON objects.o_key=video_object.vo_obj_type' +
                        ' WHERE objects.o_category NOT IN ("' + TourDocSqlMytbDbConfig.personCategories.join('", "') + '")' +
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
                    selectSql: 'SELECT COUNT(vo_obj_type) AS count, ' +
                    ' o_name AS value ' +
                    'FROM' +
                    ' objects LEFT JOIN video_object ON objects.o_key=video_object.vo_obj_type' +
                    ' WHERE objects.o_category IN ("' + TourDocSqlMytbDbConfig.personCategories.join('", "') + '")' +
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
                'subtype_ss': {
                    selectField: 'CONCAT("ac_", kategorie.k_type)',
                    selectFrom: 'video INNER JOIN kategorie ON kategorie.k_id=video.k_id',
                    orderBy: 'value asc'
                },
                'type_txt': {
                    constValues: ['video', 'track', 'route', 'location', 'trip', 'news', 'image', 'odimgobject'],
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
                'distance': 'geodist ASC',
                'dataTechDurDesc': 'TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevON))/3600 DESC',
                'dataTechAltDesc': 'k_altitude_asc DESC',
                'dataTechMaxDesc': 'v_gps_ele DESC',
                'dataTechDistDesc': 'k_distance DESC',
                'dataTechDurAsc': 'TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 ASC',
                'dataTechAltAsc': 'k_altitude_asc ASC',
                'dataTechMaxAsc': 'v_gps_ele ASC',
                'dataTechDistAsc': 'k_distance ASC',
                'forExport': 'v_date ASC, video.v_id ASC',
                'ratePers': 'v_rate DESC, v_date DESC',
                'location': 'l_lochirarchietxt ASC',
                'relevance': 'v_date DESC'
            },
            spartialConfig: {
                lat: 'v_gps_lat',
                lon: 'v_gps_lon',
                spatialField: 'geodist',
                spatialSortKey: 'distance'
            },
            filterMapping: {
                id: 'video.v_id',
                image_id_is: '"dummy"',
                image_id_i: '"dummy"',
                video_id_i: 'video.v_id',
                video_id_is: 'video.v_id',
                route_id_i: 'kategorie.t_id',
                route_id_is: 'kategorie.t_id',
                track_id_i: 'video.k_id',
                track_id_is: 'video.k_id',
                news_id_is: '"dummy"',
                loc_lochirarchie_ids_txt: 'location.l_id',
                l_lochirarchietxt: 'location.l_name',
                html: 'CONCAT(COALESCE(v_meta_name,""), " ", l_name)'
            },
            writeMapping: {
                'video.l_id': ':loc_id_i:',
                'video.k_id': ':track_id_i:',
                'video.v_gesperrt': ':blocked_i:',
                'video.v_date': ':datestart_dt:',
                'video.v_meta_shortdesc': ':desc_txt:',
                //'video.v_meta_shortdesc_md': ':desc_md_txt:',
                //'video.v_meta_shortdesc_html': ':desc_html_txt:',
                'video.v_gps_lon': ':geo_lon_s:',
                'video.v_gps_lat': ':geo_lat_s:',
                'video.v_gps_ele': ':data_tech_alt_max_i:',
                'video.v_rate': ':rate_pers_gesamt_i:',
                'video.v_rate_motive': ':rate_pers_motive_i:',
                'video.v_rate_wichtigkeit': ':rate_pers_wichtigkeit_i:',
                'video.v_meta_name': ':name_s:',
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
                desc_txt: 'v_meta_shortdesc',
                desc_md_txt: 'v_meta_shortdesc_md',
                desc_html_txt: 'v_meta_shortdesc_html',
                distance: 'geodist',
                geo_lon_s: 'v_gps_lon',
                geo_lat_s: 'v_gps_lat',
                geo_loc_p: 'v_gps_loc',
                v_fav_url_txt: 'v_fav_url_txt',
                rate_pers_ausdauer_i: 'k_rate_ausdauer',
                rate_pers_bildung_i: 'k_rate_bildung',
                rate_pers_gesamt_i: 'v_rate',
                rate_pers_kraft_i: 'k_rate_kraft',
                rate_pers_mental_i: 'k_rate_mental',
                rate_pers_motive_i: 'v_rate_motive',
                rate_pers_schwierigkeit_i: 'k_rate_schwierigkeit',
                rate_pers_wichtigkeit_i: 'v_rate_wichtigkeit',
                gpstracks_basefile_s: 'k_gpstracks_basefile',
                keywords_txt: 'v_keywords',
                loc_lochirarchie_s: 'l_lochirarchietxt',
                loc_lochirarchie_ids_s: 'l_lochirarchieids',
                name_s: 'v_meta_name',
                persons_txt: 'v_persons',
                objects_txt: 'v_objects',
                playlists_txt: 'v_playlists',
                subtype_s: 'subtype',
                type_s: 'type'
            }
        },
        'route': {
            key: 'route',
            tableName: 'tour',
            selectFrom: 'tour LEFT JOIN location ON tour.l_id = location.l_id ',
            optionalGroupBy: [
                {
                    from: 'LEFT JOIN tour_keyword ON tour.t_id=tour_keyword.t_id ' +
                          'LEFT JOIN keyword ON tour_keyword.kw_id=keyword.kw_id',
                    triggerParams: ['id', 'keywords_txt'],
                    groupByFields: ['GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS t_keywords']
                },
                {
                    from: 'LEFT JOIN kategorie_tour ON tour.t_id=kategorie_tour.t_id ' +
                    'LEFT JOIN kategorie kt ON kategorie_tour.k_id=kt.k_id ' +
                    'LEFT JOIN kategorie ON tour.t_id=kategorie.t_id',
                    triggerParams: ['id', 'track_id_i', 'track_id_is'],
                    groupByFields: ['GROUP_CONCAT(DISTINCT kategorie.k_id ORDER BY kategorie.k_id SEPARATOR ", ") AS t_k_ids',
                        'GROUP_CONCAT(DISTINCT kt.k_id ORDER BY kt.k_id SEPARATOR ", ") AS t_kt_ids']
                },
                {
                    from: ' ',
                    triggerParams: ['id', 'loadTrack'],
                    groupByFields: ['t_gpstracks_gpx']
                }
            ],
            groupbBySelectFieldListIgnore: ['t_keywords'],
            loadDetailData: [
                {
                    profile: 'image',
                    sql: 'SELECT CONCAT(image.i_dir, "/", image.i_file) AS i_fav_url_txt ' +
                    'FROM tour INNER JOIN kategorie on tour.k_id=kategorie.k_id' +
                    ' INNER JOIN image on kategorie.k_id=image.k_id ' +
                    ' INNER JOIN image_playlist ON image.i_id=image_playlist.i_id ' +
                    'WHERE tour.t_id in (:id) and p_id in (18)',
                    parameterNames: ['id']
                },
                {
                    profile: 'keywords',
                    sql: 'select GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS keywords ' +
                    'FROM tour INNER JOIN tour_keyword ON tour.t_id=tour_keyword.t_id' +
                    ' INNER JOIN keyword on tour_keyword.kw_id=keyword.kw_id ' +
                    'WHERE tour.t_id in (:id)',
                    parameterNames: ['id'],
                    modes: ['full']
                }
            ],
            selectFieldList: [
                '"ROUTE" AS type',
                'CONCAT("ac_", tour.t_typ) AS actiontype',
                'CONCAT("ac_", tour.t_typ) AS subtype',
                'CONCAT("ROUTE", "_", tour.t_id) AS id',
                'tour.k_id',
                'tour.t_id',
                'tour.l_id',
                't_name',
                'CONCAT(t_name, " ", COALESCE(t_meta_shortdesc,""), " ", l_name) AS html',
                't_datevon AS t_date_show',
                't_datevon',
                'DATE_FORMAT(t_datevon, GET_FORMAT(DATE, "ISO")) AS dateonly',
                'WEEK(t_datevon) AS week',
                'MONTH(t_datevon) AS month',
                'YEAR(t_datevon) AS year',
                't_gpstracks_basefile',
                't_meta_shortdesc',
                't_meta_shortdesc AS t_meta_shortdesc_md',
                't_meta_shortdesc AS t_meta_shortdesc_html',
                't_rate_gesamt',
                'CAST(l_geo_latdeg AS CHAR(50)) AS t_gps_lat',
                'CAST(l_geo_longdeg AS CHAR(50)) AS t_gps_lon',
                'CONCAT(l_geo_latdeg, ",", l_geo_longdeg) AS t_gps_loc',
                'GetLocationNameAncestry(location.l_id, location.l_name, " -> ") AS l_lochirarchietxt',
                'GetLocationIdAncestry(location.l_id, ",") AS l_lochirarchieids',
                't_route_hm',
                't_ele_max',
                't_route_m',
                't_rate_ausdauer',
                't_rate_bildung',
                't_rate_gesamt',
                't_rate_kraft',
                't_rate_mental',
                't_rate_motive',
                't_rate_schwierigkeit',
                't_rate_wichtigkeit',
                't_rate',
                't_rate_ks',
                't_rate_firn',
                't_rate_gletscher',
                't_rate_klettern',
                't_rate_bergtour',
                't_rate_schneeschuh',
                't_desc_fuehrer',
                't_desc_gebiet',
                't_desc_talort',
                't_desc_ziel',
                't_gesperrt',
                'ROUND((t_route_hm / 500))*500 AS altAscFacet',
                'ROUND((t_ele_max / 500))*500 AS altMaxFacet',
                'ROUND((t_route_m / 5))*5 AS distFacet',
                't_route_dauer',
                'ROUND(ROUND(t_route_dauer * 2) / 2, 1) AS durFacet'],
            facetConfigs: {
                'actiontype_ss': {
                    selectField: 'CONCAT("ac_", tour.t_typ)'
                },
                'blocked_is': {
                    selectField: 't_gesperrt'
                },
                'data_tech_alt_asc_facet_is': {
                    selectField: 'ROUND((t_route_hm / 500))*500',
                    orderBy: 'value asc'
                },
                'data_tech_alt_max_facet_is': {
                    selectField: 'ROUND((t_ele_max / 500))*500',
                    orderBy: 'value asc'
                },
                'data_tech_dist_facets_fs': {
                    selectField: 'ROUND((t_route_m / 5))*5',
                    orderBy: 'value asc'
                },
                'data_tech_dur_facet_fs': {
                    selectField: 'ROUND(ROUND(t_route_dauer * 2) / 2, 1)',
                    orderBy: 'value asc'
                },
                'data_info_guides_s': {
                    selectField: 'tour.t_desc_fuehrer',
                    orderBy: 'value asc'
                },
                'data_info_baseloc_s': {
                    selectField: 'tour.t_desc_talort',
                    orderBy: 'value asc'
                },
                'data_info_region_s': {
                    selectField: 'tour.t_desc_gebiet',
                    orderBy: 'value asc'
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
                    selectSql: 'SELECT COUNt(tour.l_id) AS count, GetTechName(l_name) AS value,' +
                    ' GetLocationNameAncestry(location.l_id, location.l_name, " -> ") AS label, location.l_id AS id' +
                    ' FROM location LEFT JOIN tour ON tour.l_id = location.l_id ' +
                    ' GROUP BY value, label, id' +
                    ' ORDER BY label ASC',
                    filterField: 'GetTechName(GetLocationNameAncestry(location.l_id, location.l_name, " -> "))',
                    action: AdapterFilterActions.LIKE
                },
                'month_is': {
                    selectField: 'MONTH(t_datevon)',
                    orderBy: 'value asc'
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
                    selectField: 't_rate_gesamt',
                    orderBy: 'value asc'
                },
                'rate_pers_schwierigkeit_is': {
                    selectField: 't_rate_schwierigkeit',
                    orderBy: 'value asc'
                },
                'rate_tech_klettern_ss': {
                    selectField: 't_rate_klettern',
                    orderBy: 'value asc'
                },
                'rate_tech_ks_ss': {
                    selectField: 't_rate_ks',
                    orderBy: 'value asc'
                },
                'rate_tech_schneeschuh_ss': {
                    selectField: 't_rate_schneeschuh',
                    orderBy: 'value asc'
                },
                'rate_tech_overall_ss': {
                    selectField: 't_rate',
                    orderBy: 'value asc'
                },
                'subtype_ss': {
                    selectField: 'CONCAT("ac_", tour.t_typ)'
                },
                'track_id_i': {
                    filterFields: ['kategorie.k_id', 'kt.k_id'],
                    action: AdapterFilterActions.IN_NUMBER
                },
                'track_id_is': {
                    selectSql: 'SELECT COUNT(kategorie.k_id) AS count, kategorie.k_id AS value,' +
                    ' kategorie.k_name AS label, kategorie.k_id AS id' +
                    ' FROM kategorie INNER JOIN tour ON kategorie.t_id = tour.t_id ' +
                    ' GROUP BY value, label, id' +
                    ' ORDER BY label',
                    filterFields: ['kategorie.k_id', 'kt.k_id'],
                    action: AdapterFilterActions.IN_NUMBER
                },
                'type_txt': {
                    constValues: ['route', 'track', 'image', 'odimgobject', 'video', 'location', 'trip', 'news'],
                    filterField: '"route"',
                    selectLimit: 1
                },
                'week_is': {
                    selectField: 'WEEK(t_datevon)',
                    orderBy: 'value asc'
                },
                'year_is': {
                    selectField: 'YEAR(t_datevon)',
                    orderBy: 'value asc'
                }
            },
            sortMapping: {
                'date': 't_datevon DESC',
                'dateAsc': 't_datevon ASC',
                'distance': 'geodist ASC',
                'dataTechDurDesc': 't_route_dauer DESC',
                'dataTechAltDesc': 't_route_hm DESC',
                'dataTechMaxDesc': 't_ele_max DESC',
                'dataTechDistDesc': 't_route_m DESC',
                'dataTechDurAsc': 't_route_dauer ASC',
                'dataTechAltAsc': 't_route_hm ASC',
                'dataTechMaxAsc': 't_ele_max ASC',
                'dataTechDistAsc': 't_route_m ASC',
                'forExport': 't_id ASC',
                'ratePers': 't_rate_gesamt DESC, t_datevon DESC',
                'location': 'l_lochirarchietxt ASC',
                'relevance': 't_datevon DESC'
            },
            spartialConfig: {
                lat: 'l_geo_latdeg',
                lon: 'l_geo_longdeg',
                spatialField: 'geodist',
                spatialSortKey: 'distance'
            },
            filterMapping: {
                id: 'tour.t_id',
                route_id_i: 'tour.t_id',
                route_id_is: 'tour.t_id',
                video_id_is: '"dummy"',
                video_id_i: '"dummy"',
                news_id_is: '"dummy"',
                trip_id_is: '"dummy"',
                loc_id_i: 'tour.l_id',
                loc_id_is: 'tour.l_id',
                loc_lochirarchie_ids_txt: 'location.l_id',
                l_lochirarchietxt: 'location.l_name',
                html: 'CONCAT(t_name, " ", COALESCE(t_meta_shortdesc,""), " ", l_name)'
            },
            writeMapping: {
                'tour.l_id': ':loc_id_i:',
                'tour.k_id': ':track_id_i:',
                'tour.t_datevon': ':datestart_dt:',
                'tour.t_gesperrt': ':blocked_i:',
                'tour.t_datebis': ':dateend_dt:',
                'tour.t_meta_shortdesc': ':desc_txt:',
//                'tour.t_meta_shortdesc_md': ':desc_md_txt:',
//                'tour.t_meta_shortdesc_html': ':desc_html_txt:',
                'tour.t_route_hm': ':data_tech_alt_asc_i:',
                'tour.t_ele_max': ':data_tech_alt_max_i:',
                'tour.t_route_m': ':data_tech_dist_f:',
                'tour.t_route_dauer': ':data_tech_dur_f:',
                'tour.t_desc_fuehrer': ':data_info_guides_s:',
                'tour.t_desc_gebiet': ':data_info_region_s:',
                'tour.t_desc_talort': ':data_info_baseloc_s:',
                'tour.t_desc_ziel': ':data_info_destloc_s:',
                'tour.t_rate_ausdauer': ':rate_pers_ausdauer_i:',
                'tour.t_rate_bildung': ':rate_pers_bildung_i:',
                'tour.t_rate_gesamt': ':rate_pers_gesamt_i:',
                'tour.t_rate_kraft': ':rate_pers_kraft_i:',
                'tour.t_rate_mental': ':rate_pers_mental_i:',
                'tour.t_rate_motive': ':rate_pers_motive_i:',
                'tour.t_rate_schwierigkeit': ':rate_pers_schwierigkeit_i:',
                'tour.t_rate_wichtigkeit': ':rate_pers_wichtigkeit_i:',
                'tour.t_rate': ':rate_tech_overall_s:',
                'tour.t_rate_ks': ':rate_tech_ks_s:',
                'tour.t_rate_firn': ':rate_tech_firn_s:',
                'tour.t_rate_gletscher': ':rate_tech_gletscher_s:',
                'tour.t_rate_klettern': ':rate_tech_klettern_s:',
                'tour.t_rate_bergtour': ':rate_tech_bergtour_s:',
                'tour.t_rate_schneeschuh': ':rate_tech_schneeschuh_s:',
                'tour.t_gpstracks_basefile': ':gpstracks_basefile_s:',
                'tour.t_gpstracks_gpx': ':gpstrack_src_s:',
                'tour.t_name': ':name_s:',
                'tour.t_typ': ':subtype_s:'
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
                dateshow_dt: 't_dateshow',
                datestart_dt: 't_datevon',
                dateend_dt: 't_datebis',
                desc_txt: 't_meta_shortdesc',
                desc_md_txt: 't_meta_shortdesc_md',
                desc_html_txt: 't_meta_shortdesc_html',
                blocked_i: 't_gesperrt',
                distance: 'geodist',
                geo_lon_s: 't_gps_lon',
                geo_lat_s: 't_gps_lat',
                geo_loc_p: 't_gps_loc',
                data_tech_alt_asc_i: 't_route_hm',
                data_tech_alt_desc_i: 'altDesc',
                data_tech_alt_min_i: 'altMin',
                data_tech_alt_max_i: 't_ele_max',
                data_tech_dist_f: 't_route_m',
                data_tech_dur_f: 't_route_dauer',
                data_info_guides_s: 't_desc_fuehrer',
                data_info_region_s: 't_desc_gebiet',
                data_info_baseloc_s: 't_desc_talort',
                data_info_destloc_s: 't_desc_ziel',
                rate_pers_ausdauer_i: 't_rate_ausdauer',
                rate_pers_bildung_i: 't_rate_bildung',
                rate_pers_gesamt_i: 't_rate_gesamt',
                rate_pers_kraft_i: 't_rate_kraft',
                rate_pers_mental_i: 't_rate_mental',
                rate_pers_motive_i: 't_rate_motive',
                rate_pers_schwierigkeit_i: 't_rate_schwierigkeit',
                rate_pers_wichtigkeit_i: 't_rate_wichtigkeit',
                rate_tech_overall_s: 't_rate',
                rate_tech_ks_s: 't_rate_ks',
                rate_tech_firn_s: 't_rate_firn',
                rate_tech_gletscher_s: 't_rate_gletscher',
                rate_tech_klettern_s: 't_rate_klettern',
                rate_tech_bergtour_s: 't_rate_bergtour',
                rate_tech_schneeschuh_s: 't_rate_schneeschuh',
                gpstracks_basefile_s: 't_gpstracks_basefile',
                gpstrack_src_s: 't_gpstracks_gpx',
                keywords_txt: 't_keywords',
                loc_lochirarchie_s: 'l_lochirarchietxt',
                loc_lochirarchie_ids_s: 'l_lochirarchieids',
                name_s: 't_name',
                type_s: 'type',
                actiontype_s: 'actionType',
                subtype_s: 'subtype',
                i_fav_url_txt: 'i_fav_url_txt'
            }
        },
        'location': {
            key: 'location',
            tableName: 'location',
            selectFrom: 'location ',
            optionalGroupBy: [
                {
                    from: 'LEFT JOIN location_keyword ON location.l_id=location_keyword.l_id ' +
                          'LEFT JOIN keyword ON location_keyword.kw_id=keyword.kw_id',
                    triggerParams: ['id', 'keywords_txt'],
                    groupByFields: ['GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS l_keywords']
                }
            ],
            groupbBySelectFieldListIgnore: ['l_keywords'],
            loadDetailData: [
                {
                    profile: 'image',
                    sql: 'SELECT CONCAT(image.i_dir, "/", image.i_file) AS i_fav_url_txt ' +
                        'FROM location INNER JOIN kategorie on location.l_id=kategorie.l_id' +
                        ' INNER JOIN image on kategorie.k_id=image.k_id ' +
                        'WHERE location.l_id in (:id) order by i_rate desc limit 0, 1',
                    parameterNames: ['id']
                },
                {
                    profile: 'keywords',
                    sql: 'select GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS keywords ' +
                    'FROM location INNER JOIN location_keyword ON location.l_id=location_keyword.l_id' +
                    ' INNER JOIN keyword on location_keyword.kw_id=keyword.kw_id ' +
                    'WHERE location.l_id in (:id)',
                    parameterNames: ['id'],
                    modes: ['full']
                }
            ],
            selectFieldList: [
                '"LOCATION" AS type',
                'location.l_typ',
                'CONCAT("loc_", l_typ) AS subtype',
                'CONCAT("LOCATION", "_", location.l_id) AS id',
                'location.l_id',
                'l_parent_id',
                'l_name',
                'CONCAT(l_name, " ", COALESCE(l_meta_shortdesc,"")) AS html',
                'l_gesperrt',
                'l_meta_shortdesc',
                'l_meta_shortdesc AS l_meta_shortdesc_md',
                'l_meta_shortdesc AS l_meta_shortdesc_html',
                'CAST(l_geo_latdeg AS CHAR(50)) AS l_geo_latdeg',
                'CAST(l_geo_longdeg AS CHAR(50)) AS l_geo_longdeg',
                'CONCAT(l_geo_latdeg, ",", l_geo_longdeg) AS l_gps_loc',
                'GetLocationNameAncestry(location.l_id, location.l_name, " -> ") AS l_lochirarchietxt',
                'GetLocationIdAncestry(location.l_id, ",") AS l_lochirarchieids'],
            facetConfigs: {
                'actiontype_ss': {
                    selectField: 'CONCAT("ac_", location.l_typ)'
                },
                'blocked_is': {
                    selectField: 'l_gesperrt'
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
                },
                'loc_lochirarchie_txt': {
                    selectSql: 'SELECT COUNT(*) AS count, GetTechName(l_name) AS value,' +
                    ' GetLocationNameAncestry(location.l_id, location.l_name, " -> ") AS label, l_id AS id' +
                    ' FROM location' +
                    ' GROUP BY value, label, id' +
                    ' ORDER BY label ASC',
                    filterField: 'GetTechName(GetLocationNameAncestry(location.l_id, location.l_name, " -> "))',
                    action: AdapterFilterActions.LIKE
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
                'subtype_ss': {
                    noFacet: true
                },
                'type_txt': {
                    constValues: ['location', 'track', 'route', 'trip', 'image', 'odimgobject', 'video', 'news'],
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
                'forExport': 'l_typ ASC, l_parent_id ASC, l_id ASC',
                'location': 'l_lochirarchietxt ASC',
                'relevance': 'l_name ASC'
            },
            spartialConfig: {
                lat: 'l_geo_latdeg',
                lon: 'l_geo_longdeg',
                spatialField: 'geodist',
                spatialSortKey: 'distance'
            },
            filterMapping: {
                id: 'location.l_id',
                loc_id_i: 'location.l_id',
                loc_id_is: 'location.l_id',
                loc_parent_id_i: 'l_parent_id',
                trip_id_is: '"dummy"',
                html: 'CONCAT(l_name, " ", COALESCE(l_meta_shortdesc,""))'
            },
            writeMapping: {
                'location.l_meta_shortdesc': ':desc_txt:',
                'location.l_parent_id': ':loc_id_parent_i:',
                //'location.l_meta_shortdesc_md': ':desc_md_txt:',
                //'location.l_meta_shortdesc_html': ':desc_html_txt:',
                'location.l_gesperrt': ':blocked_i:',
                'location.l_geo_longdeg': ':geo_lon_s:',
                'location.l_geo_latdeg': ':geo_lat_s:',
                //'location.l_gps_loc': ':geo_loc_p:',
                'location.l_name': ':name_s:',
                'location.l_typ': ':subtype_s:'
            },
            fieldMapping: {
                id: 'id',
                loc_id_i: 'l_id',
                loc_id_is: 'l_id',
                loc_id_parent_i: 'l_parent_id',
                desc_txt: 'l_meta_shortdesc',
                desc_md_txt: 'l_meta_shortdesc_md',
                desc_html_txt: 'l_meta_shortdesc_html',
                blocked_i: 'l_gesperrt',
                distance: 'geodist',
                geo_lon_s: 'l_geo_longdeg',
                geo_lat_s: 'l_geo_latdeg',
                geo_loc_p: 'l_gps_loc',
                keywords_txt: 'l_keywords',
                loc_lochirarchie_s: 'l_lochirarchietxt',
                loc_lochirarchie_ids_s: 'l_lochirarchieids',
                name_s: 'l_name',
                type_s: 'type',
                subtype_s: 'subtype'
            }
        },
        'trip': {
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
                }
            ],
            groupbBySelectFieldList: true,
            groupbBySelectFieldListIgnore: ['tr_keywords', 'k_altitude_asc_sum', 'k_altitude_desc_sum', 'k_distance_sum',
                'k_altitude_min', 'k_altitude_max'
            ],
            loadDetailData: [
                {
                    profile: 'image',
                    sql: 'SELECT CONCAT(image.i_dir, "/", image.i_file) AS i_fav_url_txt ' +
                    'FROM trip INNER JOIN kategorie on trip.tr_id=kategorie.tr_id' +
                    ' INNER JOIN image on kategorie.k_id=image.k_id ' +
                    'WHERE trip.tr_id in (:id) order by i_rate desc limit 0, 1',
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
                'CAST(l_geo_latdeg AS CHAR(50)) AS t_gps_lat',
                'CAST(l_geo_longdeg AS CHAR(50)) AS t_gps_lon',
                'CONCAT(l_geo_latdeg, ",", l_geo_longdeg) AS t_gps_loc',
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
                'tr_meta_shortdesc AS tr_meta_shortdesc_md',
                'tr_meta_shortdesc AS tr_meta_shortdesc_html'],
            facetConfigs: {
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
                'subtype_ss': {
                    noFacet: true
                },
                'type_txt': {
                    constValues: ['trip', 'location', 'track', 'route', 'image', 'odimgobject', 'video', 'news'],
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
                'forExport': 'tr_datevon ASC',
                'location': 'l_lochirarchietxt ASC',
                'relevance': 'tr_datevon DESC'
            },
            spartialConfig: {
                lat: 'l_geo_latdeg',
                lon: 'l_geo_longdeg',
                spatialField: 'geodist',
                spatialSortKey: 'distance'
            },
            filterMapping: {
                id: 'trip.tr_id',
                trip_id_i: 'trip.tr_id',
                trip_id_is: 'trip.tr_id',
                video_id_is: '"dummy"',
                video_id_i: '"dummy"',
                image_id_i: '"dummy"',
                track_id_i: '"dummy"',
                route_id_is: '"dummy"',
                news_id_is: '"dummy"',
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
        },
        'news': {
            key: 'news',
            tableName: 'news',
            selectFrom: 'news',
            loadDetailData: [
                {
                    profile: 'image',
                    sql: 'SELECT CONCAT(image.i_dir, "/", image.i_file) AS i_fav_url_txt ' +
                    'FROM news' +
                    ' INNER JOIN kategorie on (kategorie.k_datevon >= news.n_datevon AND kategorie.k_datevon <= news.n_datebis)' +
                    ' INNER JOIN image on kategorie.k_id=image.k_id ' +
                    'WHERE news.n_id in (:id) order by i_rate desc limit 0, 1',
                    parameterNames: ['id']
                }
            ],
            selectFieldList: [
                '"NEWS" AS type',
                'CONCAT("NEWS", "_", news.n_id) AS id',
                'news.n_id',
                'n_headline',
                'CONCAT(n_headline, " ", COALESCE(n_message,"")) AS html',
                'n_date',
                'n_datevon',
                'n_datebis',
                'DATE_FORMAT(n_date, GET_FORMAT(DATE, "ISO")) AS dateonly',
                'WEEK(n_date) AS week',
                'MONTH(n_date) AS month',
                'YEAR(n_date) AS year',
                'n_gesperrt',
                'n_message',
                'n_message AS n_message_md',
                'n_message AS n_message_html'],
            facetConfigs: {
                'actiontype_ss': {
                    noFacet: true
                },
                'blocked_is': {
                    selectField: 'n_gesperrt'
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
                'keywords_txt': {
                    noFacet: true
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
                'subtype_ss': {
                    noFacet: true
                },
                'type_txt': {
                    constValues: ['trip', 'location', 'track', 'route', 'image', 'odimgobject', 'video', 'news'],
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
                'forExport': 'n_date ASC',
                'relevance': 'n_date DESC'
            },
            filterMapping: {
                id: 'news.n_id',
                news_id_i: 'news.n_id',
                news_id_is: 'news.n_id',
                image_id_i: '"dummy"',
                video_id_is: '"dummy"',
                video_id_i: '"dummy"',
                track_id_i: '"dummy"',
                trip_id_is: '"dummy"',
                loc_lochirarchie_ids_txt: '"dummy"',
                l_lochirarchietxt: 'location.l_name',
                html: 'CONCAT(n_headline, " ", COALESCE(n_message,""))'
            },
            writeMapping: {
                'news.n_date': ':dateshow_dt:',
                'news.n_datevon': ':datestart_dt:',
                'news.n_datebis': ':dateend_dt:',
                'news.n_gesperrt': ':blocked_i:',
                'news.n_message': ':desc_txt:',
                'news.n_message_md': ':desc_md_txt:',
                'news.n_message_html': ':desc_html_txt:',
                'news.n_keywords': ':keywords_txt:',
                'news.n_headline': ':name_s:'
            },
            fieldMapping: {
                id: 'id',
                news_id_i: 'n_id',
                news_id_is: 'n_id',
                dateshow_dt: 'n_date',
                datestart_dt: 'n_datevon',
                dateend_dt: 'n_datebis',
                blocked_i: 'n_gesperrt',
                desc_txt: 'n_message',
                desc_md_txt: 'n_message_md',
                desc_html_txt: 'n_message_html',
                keywords_txt: 'n_keywords',
                name_s: 'n_headline',
                type_s: 'type'
            }
        }
    };

    public getTableConfigForTableKey(table: string): TableConfig {
        return TourDocSqlMytbDbConfig.tableConfigs[table];
    }
}

