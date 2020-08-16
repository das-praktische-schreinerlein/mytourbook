import {TableConfig} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {ActionTagBlockTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-block.adapter';
import {ActionTagReplaceTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-replace.adapter';
import {ActionTagAssignTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-assign.adapter';
import {AdapterFilterActions} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';
import {TourDocSqlUtils} from '../../services/tdoc-sql.utils';

export class SqlMytbDbNewsConfig {
    public static readonly tableConfig: TableConfig = {
        key: 'news',
        tableName: 'news',
        selectFrom: 'news',
        optionalGroupBy: [
            {
                from: 'INNER JOIN (SELECT n_id AS id FROM news WHERE ' + TourDocSqlUtils.generateDoubletteNameSql('n_headline') +
                    '              IN (SELECT DISTINCT ' + TourDocSqlUtils.generateDoubletteNameSql('n_headline') + ' AS name' +
                    '                  FROM news GROUP BY name HAVING COUNT(*) > 1)' +
                    '             ) doublettes' +
                    '             ON news.n_id=doublettes.id',
                triggerParams: ['doublettes'],
                groupByFields: []
            }
        ],
        loadDetailData: [
            {
                profile: 'image',
                sql: 'SELECT CONCAT(image.i_dir, "/", image.i_file) AS i_fav_url_txt ' +
                    'FROM news' +
                    ' INNER JOIN kategorie ON (kategorie.k_datevon >= news.n_datevon AND kategorie.k_datevon <= news.n_datebis)' +
                    ' INNER JOIN image ON kategorie.k_id=image.k_id ' +
                    'WHERE news.n_id IN (:id) order by i_rate desc limit 0, 1',
                parameterNames: ['id']
            },
            {
                profile: 'extended_object_properties',
                sql: 'SELECT CONCAT("category=ENTITYCOUNT:::name=TRIP_COUNT:::value=", CAST(COUNT(DISTINCT trip.tr_id) AS CHAR)) AS extended_object_properties' +
                    '       FROM news' +
                    '       INNER JOIN kategorie ON (kategorie.k_datevon >= news.n_datevon AND kategorie.k_datevon <= news.n_datebis)' +
                    '       INNER JOIN trip ON trip.tr_id=kategorie.tr_id' +
                    '       WHERE news.n_id IN (:id)' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=ROUTE_COUNT:::value=", CAST(COUNT(DISTINCT tour.t_id) AS CHAR)) AS extended_object_properties' +
                    '      FROM news' +
                    '      INNER JOIN kategorie ON (kategorie.k_datevon >= news.n_datevon AND kategorie.k_datevon <= news.n_datebis)' +
                    '      LEFT JOIN kategorie_tour ON kategorie_tour.k_id = kategorie.k_id' +
                    '      INNER JOIN tour ON tour.t_id = kategorie.t_id OR tour.t_id = kategorie_tour.t_id' +
                    '      WHERE news.n_id IN (:id)' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=TRACK_COUNT:::value=", CAST(COUNT(DISTINCT kategorie.k_id) AS CHAR)) AS extended_object_properties' +
                    '      FROM news' +
                    '      INNER JOIN kategorie ON (kategorie.k_datevon >= news.n_datevon AND kategorie.k_datevon <= news.n_datebis)' +
                    '      WHERE news.n_id IN (:id)' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=IMAGE_COUNT:::value=", CAST(COUNT(DISTINCT image.i_id) AS CHAR)) AS extended_object_properties' +
                    '      FROM news' +
                    '      INNER JOIN kategorie ON (kategorie.k_datevon >= news.n_datevon AND kategorie.k_datevon <= news.n_datebis)' +
                    '      INNER JOIN image ON image.k_id = kategorie.k_id' +
                    '      WHERE news.n_id IN (:id)' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=VIDEO_COUNT:::value=", CAST(COUNT(DISTINCT video.v_id) AS CHAR)) AS extended_object_properties' +
                    '      FROM news' +
                    '      INNER JOIN kategorie ON (kategorie.k_datevon >= news.n_datevon AND kategorie.k_datevon <= news.n_datebis)' +
                    '      INNER JOIN video ON video.k_id = kategorie.k_id' +
                    '      WHERE news.n_id IN (:id)',
                parameterNames: ['id']
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
            // dashboard
            'doublettes': {
                selectSql: 'SELECT COUNT(news.n_id) AS count, "doublettes" AS value,' +
                    ' "doublettes" AS label, "true" AS id' +
                    ' FROM news INNER JOIN (SELECT n_id AS id' +
                    '              FROM news WHERE ' + TourDocSqlUtils.generateDoubletteNameSql('n_headline') +
                    '              IN (SELECT DISTINCT ' + TourDocSqlUtils.generateDoubletteNameSql('n_headline') + ' AS name' +
                    '                  FROM news GROUP BY name HAVING COUNT(*) > 1)' +
                    '             ) doublettes' +
                    '             ON news.n_id=doublettes.id',
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
                selectSql: 'SELECT COUNT(news.n_id) AS count, "todoDesc" AS value,' +
                    ' "todoDesc" AS label, "true" AS id' +
                    ' FROM news WHERE n_message LIKE "TODODESC"',
                filterField: 'news.n_message',
                action: AdapterFilterActions.IN
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
                filterField: 'CONCAT("NEWS", "_", news.n_id)',
                action: AdapterFilterActions.NOTIN
            },
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
            'done_ss': {
                selectField: 'CONCAT("DONE", (n_date IS NOT NULL))',
                orderBy: 'value asc'
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
                constValues: ['trip', 'location', 'track', 'route', 'image', 'odimgobject', 'video', 'news', 'destination', 'info'],
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
            'countImages': '(SELECT COUNT(DISTINCT i_sort.i_id) FROM image i_sort' +
                '     INNER JOIN kategorie k_sort ON i_sort.k_id = k_sort.k_id' +
                '     WHERE (k_sort.k_datevon >= news.n_datevon AND k_sort.k_datevon <= news.n_datebis)) ASC',
            'countImagesDesc': '(SELECT COUNT(DISTINCT i_sort.i_id) FROM image i_sort' +
                '     INNER JOIN kategorie k_sort ON i_sort.k_id = k_sort.k_id' +
                '     WHERE (k_sort.k_datevon >= news.n_datevon AND k_sort.k_datevon <= news.n_datebis)) DESC',
            'countRoutes': '(SELECT COUNT(DISTINCT t_sort.t_id) FROM kategorie k_sort' +
                '      LEFT JOIN kategorie_tour kt_sort ON kt_sort.k_id = k_sort.k_id' +
                '      INNER JOIN tour t_sort ON t_sort.t_id = k_sort.t_id OR t_sort.t_id = kt_sort.t_id' +
                '      WHERE (k_sort.k_datevon >= news.n_datevon AND k_sort.k_datevon <= news.n_datebis)) ASC',
            'countRoutesDesc': '(SELECT COUNT(DISTINCT t_sort.t_id) FROM kategorie k_sort' +
                '      LEFT JOIN kategorie_tour kt_sort ON kt_sort.k_id = k_sort.k_id' +
                '      INNER JOIN tour t_sort ON t_sort.t_id = k_sort.t_id OR t_sort.t_id = kt_sort.t_id' +
                '      WHERE (k_sort.k_datevon >= news.n_datevon AND k_sort.k_datevon <= news.n_datebis)) DESC',
            'countTracks': '(SELECT COUNT(DISTINCT k_sort.k_id) FROM kategorie k_sort ' +
                '     WHERE (k_sort.k_datevon >= news.n_datevon AND k_sort.k_datevon <= news.n_datebis)) ASC',
            'countTracksDesc': '(SELECT COUNT(DISTINCT k_sort.k_id) FROM kategorie k_sort ' +
                '     WHERE (k_sort.k_datevon >= news.n_datevon AND k_sort.k_datevon <= news.n_datebis)) DESC',
            'countTrips': '(SELECT COUNT(DISTINCT tr_sort.tr_id) FROM trip tr_sort' +
                '      INNER JOIN kategorie k_sort ON tr_sort.tr_id = k_sort.tr_id' +
                '      WHERE (k_sort.k_datevon >= news.n_datevon AND k_sort.k_datevon <= news.n_datebis)) ASC',
            'countTripsDesc': '(SELECT COUNT(DISTINCT tr_sort.tr_id) FROM trip tr_sort' +
                '      INNER JOIN kategorie k_sort ON tr_sort.tr_id = k_sort.tr_id' +
                '      WHERE (k_sort.k_datevon >= news.n_datevon AND k_sort.k_datevon <= news.n_datebis)) DESC',
            'countVideos': '(SELECT COUNT(DISTINCT v_sort.v_id) FROM video v_sort' +
                '     INNER JOIN kategorie k_sort ON v_sort.k_id = k_sort.k_id ' +
                '     WHERE (k_sort.k_datevon >= news.n_datevon AND k_sort.k_datevon <= news.n_datebis)) ASC',
            'countVideosDesc': '(SELECT COUNT(DISTINCT v_sort.v_id) FROM video v_sort' +
                '     INNER JOIN kategorie k_sort ON v_sort.k_id = k_sort.k_id' +
                '     WHERE (k_sort.k_datevon >= news.n_datevon AND k_sort.k_datevon <= news.n_datebis)) DESC',
            'date': 'n_date DESC',
            'dateAsc': 'n_date ASC',
            'forExport': 'n_date ASC',
            'relevance': 'n_date DESC'
        },
        filterMapping: {
            // dashboard
            doublettes: '"doublettes"',
            conflictingRates: '"666dummy999"',
            noFavoriteChildren: '"666dummy999"',
            noMainFavoriteChildren: '"666dummy999"',
            noCoordinates: '"666dummy999"',
            noLocation: '"666dummy999"',
            noRoute: '"666dummy999"',
            noSubType: '"666dummy999"',
            todoDesc: '"todoDesc"',
            todoKeywords: 'keyword.kw_name',
            unrated: '"666dummy999"',
            unRatedChildren: '"666dummy999"',
            // common
            id: 'news.n_id',
            news_id_i: 'news.n_id',
            news_id_is: 'news.n_id',
            image_id_i: '"666dummy999"',
            image_id_is: '"666dummy999"',
            info_id_i: '"666dummy999"',
            info_id_is: '"666dummy999"',
            video_id_is: '"666dummy999"',
            video_id_i: '"666dummy999"',
            track_id_i: '"666dummy999"',
            track_id_is: '"666dummy999"',
            trip_id_i: '"666dummy999"',
            trip_id_is: '"666dummy999"',
            route_id_i: '"666dummy999"',
            route_id_is: '"666dummy999"',
            loc_lochirarchie_ids_txt: '"666dummy999"',
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
    };

    public static readonly actionTagAssignConfig: ActionTagAssignTableConfigType = {
        table: 'news',
        idField: 'n_id',
        references: {
        }
    };

    public static readonly actionTagBlockConfig: ActionTagBlockTableConfigType = {
        table: 'news', idField: 'n_id', blockField: 'n_gesperrt'
    };

    public static readonly actionTagReplaceConfig: ActionTagReplaceTableConfigType = {
        table: 'news',
        fieldId: 'n_id',
        referenced: [],
        joins: []
    };
}
