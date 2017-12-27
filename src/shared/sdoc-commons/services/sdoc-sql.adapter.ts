import {Mapper, Record} from 'js-data';
import {SDocRecord} from '../model/records/sdoc-record';
import {SDocImageRecord} from '../model/records/sdocimage-record';
import {SDocSearchForm} from '../model/forms/sdoc-searchform';
import {SDocSearchResult} from '../model/container/sdoc-searchresult';
import {GenericSqlAdapter, TableConfig} from '../../search-commons/services/generic-sql.adapter';
import {SDocAdapterResponseMapper} from './sdoc-adapter-response.mapper';

export class SDocSqlAdapter extends GenericSqlAdapter<SDocRecord, SDocSearchForm, SDocSearchResult> {
    public static tableConfigs = {
        'track': {
            tableName: 'kategorie_full',
            selectFrom: 'kategorie_full inner join location on kategorie_full.l_id = location.l_id',
            selectFieldList: [
                '"TRACK" as type',
                'concat("ac_", kategorie_full.k_type) as actiontype',
                'concat("ac_", kategorie_full.k_type) as subtype',
                'concat("TRACK", "_", kategorie_full.k_id) as id',
                'kategorie_full.k_id',
                'kategorie_full.t_id',
                'kategorie_full.k_t_ids',
                'kategorie_full.tr_id',
                'kategorie_full.l_id',
                'n_id',
                'k_name',
                'k_html',
                'concat(k_html, " ", k_name, " ", k_keywords, " ", k_meta_shortdesc_md, " ", l_lochirarchietxt) as html',
                'k_dateshow',
                'k_datevon',
                'DATE_FORMAT (k_datevon, GET_FORMAT(DATE, "ISO")) as dateonly',
                'week(k_datevon) AS week',
                'month(k_datevon) as month',
                'k_gpstracks_basefile',
                'k_keywords',
                'k_meta_shortdesc_md',
                'k_meta_shortdesc_html',
                'k_rate_gesamt',
                'cast(k_gps_lat as char(50)) as k_gps_lat',
                'cast(k_gps_lon as char(50)) as k_gps_lon',
                'concat(k_gps_lat, ",", k_gps_lon) as k_gps_loc',
                'l_lochirarchietxt',
                'l_lochirarchieids',
                '`K_ALTITUDE_ASC` as altAsc',
                '`K_ALTITUDE_DESC` as altDesc',
                '`K_ALTITUDE_MIN` as altMin',
                '`K_ALTITUDE_MAX` as altMax',
                '`K_DISTANCE` as dist',
                '`K_RATE_AUSDAUER` as ausdauer',
                '`K_RATE_BILDUNG` as bildung',
                '`K_RATE_GESAMT` as gesamt',
                '`K_RATE_KRAFT` as kraft',
                '`K_RATE_MENTAL` as mental',
                '`K_RATE_MOTIVE` as motive',
                '`K_RATE_SCHWIERIGKEIT` as schwierigkeit',
                '`K_RATE_WICHTIGKEIT` as wichtigkeit',
                'round((K_ALTITUDE_ASC / 500))*500 as altAscFacet',
                'round((K_ALTITUDE_MAX / 500))*500 as altMaxFacet',
                'round((K_DISTANCE / 5))*5 as distFacet',
                'TIME_TO_SEC(TIMEDIFF(K_DATEBIS, K_DATEVON))/3600 as dur',
                'ROUND(ROUND(TIME_TO_SEC(TIMEDIFF(K_DATEBIS, K_DATEVON))/3600 * 2) / 2, 1) as durFacet'],
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
            selectFrom: 'tour inner join location on tour.l_id = location.l_id',
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
            return super.mapFilterToAdapterQuery(mapper, 'k_id', action,
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

    getFacetParams(method: string, mapper: Mapper, params: any, opts: any, query: any): Map<string, any> {
        const facetConfigs = {
            'actiontype_ss': {
                'f.actiontype_ss.facet.limit': '-1',
                'f.actiontype_ss.facet.sort': 'index'
            },
            'data_tech_alt_asc_facet_is': {
                'f.data_tech_alt_asc_facet_is.facet.limit': '-1',
                'f.data_tech_alt_asc_facet_is.facet.sort': 'index'
            },
            'data_tech_alt_max_facet_is': {
                'f.data_tech_alt_max_facet_is.facet.limit': '-1',
                'f.data_tech_alt_max_facet_is.facet.sort': 'index'
            },
            'data_tech_dist_facets_fs': {
                'f.data_tech_dist_facets_fs.facet.limit': '-1',
                'f.data_tech_dist_facets_fs.facet.sort': 'index'
            },
            'data_tech_dur_facet_fs': {
                'f.data_tech_dur_facet_fs.facet.limit': '-1',
                'f.data_tech_dur_facet_fs.facet.sort': 'index'
            },
            'keywords_txt': {
                'f.keywords_txt.facet.prefix': 'kw_',
                'f.keywords_txt.facet.limit': '-1',
                'f.keywords_txt.facet.sort': 'count'
            },
            'loc_id_i': {},
            'loc_lochirarchie_txt': {},
            'month_is': {
                'f.month_is.facet.limit': '-1',
                'f.month_is.facet.sort': 'index'
            },
            'rate_pers_gesamt_is': {
                'f.rate_pers_gesamt_is.facet.limit': '-1',
                'f.rate_pers_gesamt_is.facet.sort': 'index'
            },
            'rate_pers_schwierigkeit_is': {
                'f.rate_pers_schwierigkeit_is.facet.limit': '-1',
                'f.rate_pers_schwierigkeit_is.facet.sort': 'index'
            },
            'rate_tech_overall_ss': {
                'f.rate_tech_overall_ss.facet.limit': '-1',
                'f.rate_tech_overall_ss.facet.sort': 'index'
            },
            'subtype_ss': {
                'f.subtype_ss.facet.limit': '-1',
                'f.subtype_ss.facet.sort': 'index'
            },
            'type_txt': {},
            'week_is': {
                'f.week_is.facet.limit': '-1',
                'f.week_is.facet.sort': 'index'
            }
        };

        const facetParams = new Map<string, any>();
        const facets = [];
        for (const key in facetConfigs) {
            if (opts.showFacets === true || (opts.showFacets instanceof Array && opts.showFacets.indexOf(key) >= 0)) {
                facets.push(key);
                for (const paramKey in facetConfigs[key]) {
                    facetParams.set(paramKey, facetConfigs[key][paramKey]);
                }
            }
        }

        if (facets.length > 0) {
            facetParams.set('facet', 'on');
            facetParams.set('facet.field', facets);
        }

        return facetParams;
    };

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


    getSortParams(method: string, mapper: Mapper, params: any, opts: any, query: any): Map<string, any> {
        const sortParams = new Map<string, any>();

        const form = opts.originalSearchForm || {};

        // set commons: relevance
        sortParams.set('sort', 'dateonly_s desc');

        switch (form.sort) {
            case 'date':
                sortParams.set('sort', 'dateonly_s desc');
                break;
            case 'dateAsc':
                sortParams.set('sort', 'date_dt asc');
                break;
            case 'distance':
                sortParams.set('sort', 'geodist() asc');
                break;
            case 'dataTechDurDesc':
                sortParams.set('sort', 'data_tech_dur_f desc');
                break;
            case 'dataTechAltDesc':
                sortParams.set('sort', 'data_tech_alt_asc_i desc');
                break;
            case 'dataTechMaxDesc':
                sortParams.set('sort', 'data_tech_alt_max_i desc');
                break;
            case 'dataTechDistDesc':
                sortParams.set('sort', 'data_tech_dist_f desc');
                break;
            case 'dataTechDurAsc':
                sortParams.set('sort', 'data_tech_dur_f asc');
                break;
            case 'dataTechAltAsc':
                sortParams.set('sort', 'data_tech_alt_asc_i asc');
                break;
            case 'dataTechMaxAsc':
                sortParams.set('sort', 'data_tech_alt_max_i asc');
                break;
            case 'dataTechDistAsc':
                sortParams.set('sort', 'data_tech_dist_f asc');
                break;
            case 'ratePers':
                sortParams.set('sort', 'sub(15, rate_pers_gesamt_i) asc, dateonly_s desc');
                sortParams.set('bq',
                    'type_s:ROUTE^1.4 type_s:LOCATION^1.3 type_s:TRACK^1.2 type_s:TRIP^1.2 type_s:NEWS^1.1 type_s:IMAGE^1');
                sortParams.set('boost', 'product( recip( rord(date_dts), 1, 1000, 1000), 1)');
                break;
            case 'location':
                sortParams.set('sort', 'loc_lochirarchie_s asc');
                break;
            case 'relevance':
            default:
        }

        return sortParams;
    };

    getAdapterPath(method: string, mapper: Mapper, id: string | number, opts: any, query: any) {
        const path = 'kategorie_full';
        console.log('sqltable:', path);
        return path;
    }
}

