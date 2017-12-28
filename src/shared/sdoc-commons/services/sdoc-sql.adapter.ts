import {Mapper} from 'js-data';
import {SDocRecord} from '../model/records/sdoc-record';
import {SDocSearchForm} from '../model/forms/sdoc-searchform';
import {SDocSearchResult} from '../model/container/sdoc-searchresult';
import {AdapterFilterActions, GenericSqlAdapter, TableConfig, TableFacetConfig} from '../../search-commons/services/generic-sql.adapter';
import {SDocAdapterResponseMapper} from './sdoc-adapter-response.mapper';

export class SDocSqlAdapter extends GenericSqlAdapter<SDocRecord, SDocSearchForm, SDocSearchResult> {
    public static tableConfigs = {
        'track': {
            tableName: 'kategorie_full',
            selectFrom: 'kategorie_full inner join location on location.l_id = kategorie_full.l_id left join image on kategorie_full.i_id=image.i_id',
            selectFieldList: [
                '"TRACK" AS type',
                'CONCAT("ac_", kategorie_full.k_type) AS actiontype',
                'CONCAT("ac_", kategorie_full.k_type) AS subtype',
                'CONCAT("TRACK", "_", kategorie_full.k_id) AS id',
                'kategorie_full.k_id',
                'kategorie_full.t_id',
                'kategorie_full.k_t_ids',
                'kategorie_full.tr_id',
                'kategorie_full.l_id',
                'n_id',
                'k_name',
                'k_html',
                'CONCAT(k_html, " ", k_name, " ", k_keywords, " ", k_meta_shortdesc_md, " ", l_lochirarchietxt) AS html',
                'k_dateshow',
                'k_datevon',
                'DATE_FORMAT(k_datevon, GET_FORMAT(DATE, "ISO")) AS dateonly',
                'WEEK(k_datevon) AS week',
                'MONTH(k_datevon) AS month',
                'k_gpstracks_basefile',
                'k_keywords',
                'k_meta_shortdesc_md',
                'k_meta_shortdesc_html',
                'k_rate_gesamt',
                'CAST(k_gps_lat AS CHAR(50)) AS k_gps_lat',
                'CAST(k_gps_lon AS CHAR(50)) AS k_gps_lon',
                'CONCAT(k_gps_lat, ",", k_gps_lon) AS k_gps_loc',
                'l_lochirarchietxt',
                'l_lochirarchieids',
                'CONCAT(image.i_dir, "/", image.i_file) as i_fav_url_txt',
                'k_altitude_asc AS altAsc',
                'k_altitude_desc AS altDesc',
                'k_altitude_min AS altMin',
                'k_altitude_max AS altMax',
                'k_distance AS dist',
                'k_rate_ausdauer AS ausdauer',
                'k_rate_bildung AS bildung',
                'k_rate_gesamt AS gesamt',
                'k_rate_kraft AS kraft',
                'k_rate_mental AS mental',
                'k_rate_motive AS motive',
                'k_rate_schwierigkeit AS schwierigkeit',
                'k_rate_wichtigkeit AS wichtigkeit',
                'ROUND((k_altitude_asc / 500))*500 AS altAscFacet',
                'ROUND((k_altitude_max / 500))*500 AS altMaxFacet',
                'ROUND((k_distance / 5))*5 AS distFacet',
                'TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 AS dur',
                'ROUND(ROUND(TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 * 2) / 2, 1) AS durFacet'],
            facetConfigs: {
                'actiontype_ss': {
                    selectField: 'CONCAT("ac_", kategorie_full.k_type)'
                },
                'data_tech_alt_asc_facet_is': {
                    selectField: 'ROUND((k_altitude_asc / 500))*500'
                },
                'data_tech_alt_max_facet_is': {
                    selectField: 'ROUND((k_altitude_max / 500))*500'
                },
                'data_tech_dist_facets_fs': {
                    selectField: 'ROUND((k_distance / 5))*5'
                },
                'data_tech_dur_facet_fs': {
                    selectField: 'ROUND(ROUND(TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 * 2) / 2, 1)'
                },
                'keywords_txt': {
                    selectSql: 'SELECT 0 AS count, ' +
                    '  SUBSTRING_INDEX(SUBSTRING_INDEX(kategorie_full.k_keywords, ",", numbers.n), ",", -1) AS value ' +
                    ' FROM' +
                    '  (SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL' +
                    '   SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL' +
                    '   SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL ' +
                    '   SELECT 14 UNION ALL SELECT 15 UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL' +
                    '   SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20) ' +
                    '  numbers INNER JOIN kategorie_full ON ' +
                    '   CHAR_LENGTH(kategorie_full.k_keywords) - CHAR_LENGTH(REPLACE(kategorie_full.k_keywords, ",", "")) >= numbers.n - 1' +
                    '  GROUP BY count, value' +
                    '  ORDER BY value',
                    filterField: 'k_keywords',
                    action: AdapterFilterActions.LIKEIN
                },
                'loc_id_i': {
                },
                'loc_lochirarchie_txt': {
                    selectSql: 'SELECT COUNt(*) AS count, l_name AS value' +
                    ' FROM kategorie_full INNER JOIN location ON kategorie_full.l_id = location.l_id ' +
                    ' GROUP BY l_name' +
                    ' ORDER BY count DESC',
                    filterField: 'l_lochirarchietxt',
                    action: AdapterFilterActions.LIKEIN
                },
                'month_is': {
                    selectField: 'MONTH(k_datevon)'
                },
                'rate_pers_gesamt_is': {
                    selectField: 'k_rate_gesamt'
                },
                'rate_pers_schwierigkeit_is': {
                    selectField: 'k_rate_schwierigkeit'
                },
                'rate_tech_overall_ss': {
                },
                'subtype_ss': {
                    selectField: 'CONCAT("ac_", kategorie_full.k_type)'
                },
                'type_txt': {
                    constValues: ['track', 'route'],
                    filterField: '"track"'
                },
                'week_is': {
                    selectField: 'WEEK(k_datevon)'
                }
            },
            sortMapping: {
                'date': 'k_datevon DESC',
                'dateAsc': 'k_datevon ASC',
                'distance': 'geodist() ASC',
                'dataTechDurDesc': 'TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevON))/3600 DESC',
                'dataTechAltDesc': 'k_altitude_asc DESC',
                'dataTechMaxDesc': 'k_altitude_max DESC',
                'dataTechDistDesc': 'k_distance DESC',
                'dataTechDurAsc': 'TIME_TO_SEC(TIMEDIFF(k_datebis, k_datevon))/3600 ASC',
                'dataTechAltAsc': 'k_altitude_asc ASC',
                'dataTechMaxAsc': 'k_altitude_max ASC',
                'dataTechDistAsc': 'k_distance ASC',
                'ratePers': 'k_rate_gesamt DESC',
                'location': 'l_lochirarchietxt ASC',
                'relevance': 'k_datevon DESC'
            },
            fieldMapping: {
                id: 'id',
                image_id_i: 'i_id',
                loc_id_i: 'l_id',
                route_id_i: 't_id',
                track_id_i: 'k_id',
                trip_id_i: 'tr_id',
                news_id_i: 'n_id',
                dateshow_dt: 'k_dateshow',
                html_txt: 'k_html',
                desc_txt: 'desc_txt',
                desc_md_txt: 'k_meta_shortdesc_md',
                desc_html_txt: 'k_meta_shortdesc_html',
                geo_lon_s: 'k_gps_lon',
                geo_lat_s: 'k_gps_lat',
                geo_loc_p: 'k_gps_loc',
                data_tech_alt_asc_i: 'altAsc',
                data_tech_alt_desc_i: 'altDesc',
                data_tech_alt_min_i: 'altMin',
                data_tech_alt_max_i: 'altMax',
                data_tech_dist_f: 'dist',
                data_tech_dur_f: 'dur',
                rate_pers_ausdauer_i: 'ausdauer',
                rate_pers_bildung_i: 'bildung',
                rate_pers_gesamt_i: 'gesamt',
                rate_pers_kraft_i: 'kraft',
                rate_pers_mental_i: 'mental',
                rate_pers_motive_i: 'motive',
                rate_pers_schwierigkeit_i: 'schwierigkeit',
                rate_pers_wichtigkeit_i: 'wichtigkeit',
                gpstracks_basefile_s: 'k_gpstracks_basefile',
                keywords_txt: 'k_keywords',
                loc_lochirarchie_s: 'l_lochirarchietxt',
                loc_lochirarchie_ids_s: 'l_lochirarchieids',
                name_s: 'k_name',
                type_s: 'type',
                actiontype_ss: 'k_type',
                subtype_s: 'subtype_s',
                i_fav_url_txt: 'i_fav_url_txt'
            }
        },
        'route': {
            tableName: 'tour',
            selectFrom: 'tour INNER JOIN location ON tour.l_id = location.l_id',
            selectFieldList: [],
            fieldMapping: {
                id: 'k_id',
                image_id_i: 'i_id',
                loc_id_i: 'l_id',
                route_id_i: 't_id',
                track_id_i: 'k_id',
                trip_id_i: 'tr_id',
                news_id_i: 'n_id',
                dateshow_dt: 'k_dateshow',
                html_txt: 'k_html',
                desc_txt: 'desc_txt',
                desc_md_txt: 'k_meta_shortdesc_md',
                desc_html_txt: 'k_meta_shortdesc_html',
                geo_lon_s: 'k_gps_lon',
                geo_lat_s: 'k_gps_lat',
                geo_loc_p: 'k_gps_loc',
                data_tech_alt_asc_i: 'altAsc',
                data_tech_alt_desc_i: 'altDesc',
                data_tech_alt_min_i: 'altMin',
                data_tech_alt_max_i: 'altMax',
                data_tech_dist_f: 'dist',
                data_tech_dur_f: 'dur',
                data_info_guides_s: 'data_info_guides_s',
                data_info_region_s: 'data_info_region_s',
                data_info_baseloc_s: 'data_info_baseloc_s',
                data_info_destloc_s: 'data_info_destloc_s',
                rate_pers_ausdauer_i: 'ausdauer',
                rate_pers_bildung_i: 'bildung',
                rate_pers_gesamt_i: 'gesamt',
                rate_pers_kraft_i: 'kraft',
                rate_pers_mental_i: 'mental',
                rate_pers_motive_i: 'motive',
                rate_pers_schwierigkeit_i: 'schwierigkeit',
                rate_pers_wichtigkeit_i: 'wichtigkeit',
                rate_tech_overall_s: 'rate_tech_overall_s',
                rate_tech_ks_s: 'rate_tech_ks_s',
                rate_tech_firn_s: 'rate_tech_firn_s',
                rate_tech_gletscher_s: 'rate_tech_gletscher_s',
                rate_tech_klettern_s: 'rate_tech_klettern_s',
                rate_tech_bergtour_s: 'rate_tech_bergtour_s',
                rate_tech_schneeschuh_s: 'rate_tech_schneeschuh_s',
                gpstracks_basefile_s: 'k_gpstracks_basefile',
                keywords_txt: 'k_keywords',
                loc_lochirarchie_s: 'l_lochirarchietxt',
                loc_lochirarchie_ids_s: 'l_lochirarchieids',
                name_s: 'k_name',
                type_s: 'type',
                actiontype_ss: 'k_type',
                subtype_s: 'subtype_s',
                i_fav_url_txt: 'i_fav_url_txt'
            }
        }
    };

    constructor(config: any) {
        super(config, new SDocAdapterResponseMapper());
    }

    protected getTableConfig(method: string, mapper: Mapper, params: any, opts: any, query: any): TableConfig {
        return SDocSqlAdapter.tableConfigs[this.extractTable(method, mapper, params, opts)];
    }

    protected getTableConfigForTable(table: string): TableConfig {
        return SDocSqlAdapter.tableConfigs[table];
    }

    protected extractTable(method: string, mapper: Mapper, params: any, opts: any): string {
        const types = params.where['type_txt'];
        if (types !== undefined && types.in !== undefined && types.in.length === 1) {
            const tabName = types.in[0];
            if (SDocSqlAdapter.tableConfigs[tabName] !== undefined) {
                return tabName;
            }

            return undefined;
        }
        const ids = params.where['id'];
        if (ids !== undefined && ids.in !== undefined && ids.in.length === 1) {
            const tabName = ids.in[0].replace(/_.*/, '').toLowerCase();
            if (SDocSqlAdapter.tableConfigs[tabName] !== undefined) {
                return tabName;
            }

            return undefined;
        }

        return undefined;
    }

    protected mapFilterToAdapterQuery(mapper: Mapper, fieldName: string, action: string, value: any, table: string): string {
        if (fieldName === 'type_txt') {
            return undefined;
        }

        if (fieldName === 'id') {
            return super.mapFilterToAdapterQuery(mapper, 'kategorie_full.k_id', action,
                [this.mapperUtils.prepareSingleValue(value, '_').replace(/.*_/, '')], table);
        }

        return super.mapFilterToAdapterQuery(mapper, fieldName, action, value, table);
    }

    protected mapToAdapterFieldName(table, fieldName: string): string {
        switch (fieldName) {
            case 'name':
                return this.mapperUtils.mapToAdapterFieldName(this.getMappingForTable(table), 'name_s');
            case 'html':
                return this.mapperUtils.mapToAdapterFieldName(this.getMappingForTable(table), 'html_txt');
            case 'descTxt':
                return this.mapperUtils.mapToAdapterFieldName(this.getMappingForTable(table), 'desc_txt');
            case 'type_txt':
                return undefined;
            default:
                break;
        }

        return this.mapperUtils.mapToAdapterFieldName(this.getMappingForTable(table), fieldName);
    }

    getAdapterFields(method: string, mapper: Mapper, params: any, opts: any, query: any): string[] {
        if (method === 'count') {
            return ['count(*)'];
        }

        const fields = super.getAdapterFields(method, mapper, params, opts, query);
        if (params !== undefined && params.spatial !== undefined && params.spatial.geo_loc_p !== undefined &&
            params.spatial.geo_loc_p.nearby !== undefined) {
            fields.push('distance:geodist()');
        }
        if (opts.loadTrack === true) {
//            fields.push(this.mapper.mapToAdapterFieldName('gpstrack_s'));
        }

        return fields;
    }

    getSpatialParams(method: string, mapper: Mapper, params: any, opts: any, query: any): Map<string, any> {
        const spatialParams = new Map<string, any>();

        if (params !== undefined && params.spatial !== undefined && params.spatial.geo_loc_p !== undefined &&
            params.spatial.geo_loc_p.nearby !== undefined) {
            const [lat, lon, distance] = params.spatial.geo_loc_p.nearby.split(/_/);

            spatialParams.set('fq', '{!geofilt cache=false}');
            spatialParams.set('sfield', 'geo_loc_p');
            spatialParams.set('pt', lat + ',' + lon);
            spatialParams.set('d', distance);
        }

        return spatialParams;
    };
}

