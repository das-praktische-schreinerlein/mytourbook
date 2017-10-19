import {GenericSolrAdapter} from '../../search-commons/services/generic-solr.adapter';
import {Mapper, Record} from 'js-data';
import {SDocRecord} from '../model/records/sdoc-record';
import {SDocImageRecord} from '../model/records/sdocimage-record';
import {SDocSearchForm} from '../model/forms/sdoc-searchform';
import {SDocSearchResult} from '../model/container/sdoc-searchresult';

export class SDocSolrAdapter extends GenericSolrAdapter<SDocRecord, SDocSearchForm, SDocSearchResult> {
    constructor(config: any) {
        super(config);
    }

    mapToAdapterFieldName(fieldName: string): string {
        switch (fieldName) {
            case 'name':
                return 'name_s';
            case 'html':
                return 'html_txt';
            case 'descTxt':
                return 'desc_txt';
            default:
                break;
        }

        return super.mapToAdapterFieldName(fieldName);
    }

    mapToAdapterDocument(props: any): any {
        const values = {
            id: props.id,
            image_id_i: props.imageId,
            loc_id_i: props.locId,
            route_id_i: props.routeId,
            track_id_i: props.trackId,
            trip_id_i: props.tripId,
            news_id_i: props.newsId,
            date_dt: props.datevon,
            desc_txt: props.descTxt,
            desc_md_txt: props.descMd,
            desc_html_txt: props.descHtml,
            geo_lon_s: props.geoLon,
            geo_lat_s: props.geoLat,
            geo_loc_p: props.geoLoc,
            gpstrack_s: props.gpsTrack,
            gpstracks_basefile_s: props.gpsTrackBasefile,
            keywords_txt: (props.keywords ? props.keywords.split(', ').join(',,KW_') : ''),
            loc_lochirarchie_s: (props.locHirarchie ? props.locHirarchie
                .toLowerCase()
                .replace(/[ ]*->[ ]*/g, ',,')
                .replace(/ /g, '_') : ''),
            loc_lochirarchie_ids_s: (props.locHirarchieIds ? props.locHirarchieIds
                .toLowerCase()
                .replace(/,/g, ',,')
                .replace(/ /g, '_') : ''),
            name_s: props.name,
            type_s: props.type,

        };

        values['html_txt'] = [values.desc_txt, values.name_s, values.keywords_txt, values.type_s].join(' ');

        return values;
    }

    mapResponseDocument(mapper: Mapper, doc: any): Record {
        const dataTechMapper = mapper['datastore']._mappers['sdocdatatech'];
        const dataInfoMapper = mapper['datastore']._mappers['sdocdatainfo'];
        const imageMapper = mapper['datastore']._mappers['sdocimage'];
        const ratePersMapper = mapper['datastore']._mappers['sdocratepers'];
        const rateTechMapper = mapper['datastore']._mappers['sdocratetech'];

        const values = {};
        values['id'] = this.getAdapterValue(doc, 'id', undefined);

        values['imageId'] = Number(this.getAdapterValue(doc, 'image_id_i', undefined));
        values['locId'] = Number(this.getAdapterValue(doc, 'loc_id_i', undefined));
        values['routeId'] = Number(this.getAdapterValue(doc, 'route_id_i', undefined));
        values['trackId'] = Number(this.getAdapterValue(doc, 'track_id_i', undefined));
        values['tripId'] = Number(this.getAdapterValue(doc, 'trip_id_i', undefined));
        values['newsId'] = Number(this.getAdapterValue(doc, 'news_id_i', undefined));

        const subtypeField = doc['subtypes_ss'];
        if (subtypeField !== undefined && Array.isArray(subtypeField)) {
           values['subtypes'] = subtypeField.join(',');
        }
        values['datevon'] = this.getAdapterValue(doc, 'date_dt', undefined);
        values['descTxt'] = this.getAdapterValue(doc, 'desc_txt', undefined);
        values['descHtml'] = this.getAdapterValue(doc, 'desc_html_txt', undefined);
        values['descMd'] = this.getAdapterValue(doc, 'desc_md_txt', undefined);
        values['geoDistance'] = this.getAdapterCoorValue(doc, 'distance', undefined);
        values['geoLon'] = this.getAdapterCoorValue(doc, 'geo_lon_s', undefined);
        values['geoLat'] = this.getAdapterCoorValue(doc, 'geo_lat_s', undefined);
        values['geoLoc'] = this.getAdapterCoorValue(doc, 'geo_loc_p', undefined);
        values['gpsTrack'] = this.getAdapterValue(doc, 'gpstrack_s', undefined);
        values['gpsTrackBasefile'] = this.getAdapterValue(doc, 'gpstracks_basefile_s', undefined);
        values['keywords'] = this.getAdapterValue(doc, 'keywords_txt', '').split(',,').join(', ').replace(/KW_/g, '');
        values['name'] = this.getAdapterValue(doc, 'name_s', undefined);
        values['subtype'] = this.getAdapterValue(doc, 'subtype_s', undefined);
        values['type'] = this.getAdapterValue(doc, 'type_s', undefined);
        values['locHirarchie'] = this.getAdapterValue(doc, 'loc_lochirarchie_s', '')
            .replace(/,,/g, ' -> ')
            .replace(/,/g, ' ')
            .replace(/_/g, ' ')
            .trim();
        values['locHirarchieIds'] = this.getAdapterValue(doc, 'loc_lochirarchie_ids_s', '')
            .replace(/_/g, ' ').trim()
            .replace(/[,]+/g, ',').replace(/(^,)|(,$)/g, '');

        // console.log('mapResponseDocument values:', values);

        const record: SDocRecord = <SDocRecord>mapper.createRecord(values);

        const images: SDocImageRecord[] = [];
        const imageField = doc['i_fav_url_txt'];
        if (imageField !== undefined && Array.isArray(imageField)) {
            let id = 1;
            if (record.type === 'TRACK') {
                id = Number(record.trackId);
            } else if (record.type === 'ROUTE') {
                id = Number(record.routeId);
            } else if (record.type === 'LOCATION') {
                id = Number(record.locId);
            } else if (record.type === 'IMAGE') {
                id = Number(record.imageId);
            } else if (record.type === 'TRIP') {
                id = Number(record.tripId);
            } else if (record.type === 'NEWS') {
                id = Number(record.newsId);
            }
            id = id * 1000000;

            for (const imageDoc of imageField) {
                const imageValues = {};
                imageValues['name'] = values['name'];
                imageValues['id'] = (id++).toString();
                imageValues['fileName'] = imageDoc;
                const imageRecord = imageMapper.createRecord(imageValues);
                images.push(imageRecord);
            }
        }
        record.set('sdocimages', images);
        // console.log('mapResponseDocument record full:', record);


        const dataTechValues = {};
        dataTechValues['altAsc'] = this.getAdapterValue(doc, 'data_tech_alt_asc_i', undefined);
        dataTechValues['altDesc'] = this.getAdapterValue(doc, 'data_tech_alt_desc_i', undefined);
        dataTechValues['altMin'] = this.getAdapterValue(doc, 'data_tech_alt_min_i', undefined);
        dataTechValues['altMax'] = this.getAdapterValue(doc, 'data_tech_alt_max_i', undefined);
        dataTechValues['dist'] = this.getAdapterValue(doc, 'data_tech_dist_f', undefined);
        dataTechValues['dur'] = this.getAdapterValue(doc, 'data_tech_dur_f', undefined);
        let dataTechSet = false;
        for (const field in dataTechValues) {
            if (dataTechValues[field] !== undefined && dataTechValues[field] !== 0) {
                dataTechSet = true;
                break;
            }
        }

        if (dataTechSet) {
            record.set('sdocdatatech', dataTechMapper.createRecord(dataTechValues));
        } else {
            record.set('sdocdatatech', undefined);
        }

        const rateTechValues = {};
        rateTechValues['overall'] = this.getAdapterValue(doc, 'rate_tech_overall_s', undefined);
        rateTechValues['ks'] = this.getAdapterValue(doc, 'rate_tech_ks_s', undefined);
        rateTechValues['firn'] = this.getAdapterValue(doc, 'rate_tech_firn_s', undefined);
        rateTechValues['gletscher'] = this.getAdapterValue(doc, 'rate_tech_gletscher_s', undefined);
        rateTechValues['klettern'] = this.getAdapterValue(doc, 'rate_tech_klettern_s', undefined);
        rateTechValues['bergtour'] = this.getAdapterValue(doc, 'rate_tech_bergtour_s', undefined);
        rateTechValues['schneeschuh'] = this.getAdapterValue(doc, 'rate_tech_schneeschuh_s', undefined);
        let rateTechSet = false;
        for (const field in rateTechValues) {
            if (rateTechValues[field] !== undefined && (rateTechValues[field] + '').length > 0) {
                rateTechSet = true;
                break;
            }
        }

        if (rateTechSet) {
            record.set('sdocratetech', rateTechMapper.createRecord(rateTechValues));
        } else {
            record.set('sdocratetech', undefined);
        }

        const ratePersValues = {};
        ratePersValues['ausdauer'] = this.getAdapterValue(doc, 'rate_pers_ausdauer_i', undefined);
        ratePersValues['bildung'] = this.getAdapterValue(doc, 'rate_pers_bildung_i', undefined);
        ratePersValues['gesamt'] = this.getAdapterValue(doc, 'rate_pers_gesamt_i', undefined);
        ratePersValues['kraft'] = this.getAdapterValue(doc, 'rate_pers_kraft_i', undefined);
        ratePersValues['mental'] = this.getAdapterValue(doc, 'rate_pers_mental_i', undefined);
        ratePersValues['motive'] = this.getAdapterValue(doc, 'rate_pers_motive_i', undefined);
        ratePersValues['schwierigkeit'] = this.getAdapterValue(doc, 'rate_pers_schwierigkeit_i', undefined);
        ratePersValues['wichtigkeit'] = this.getAdapterValue(doc, 'rate_pers_wichtigkeit_i', undefined);
        let ratePersSet = false;
        for (const field in ratePersValues) {
            if (ratePersValues[field] !== undefined && (ratePersValues[field] + '').length > 0 && ratePersValues[field] > 0) {
                ratePersSet = true;
                break;
            }
        }

        if (ratePersSet) {
            record.set('sdocratepers', ratePersMapper.createRecord(ratePersValues));
        } else {
            record.set('sdocratepers', undefined);
        }

        const dataInfoValues = {};
        dataInfoValues['guides'] = this.getAdapterValue(doc, 'data_info_guides_s', undefined);
        dataInfoValues['region'] = this.getAdapterValue(doc, 'data_info_region_s', undefined);
        dataInfoValues['baseloc'] = this.getAdapterValue(doc, 'data_info_baseloc_s', undefined);
        dataInfoValues['destloc'] = this.getAdapterValue(doc, 'data_info_destloc_s', undefined);
        let dataInfoSet = false;
        for (const field in dataInfoValues) {
            if (dataInfoValues[field] !== undefined && (dataInfoValues[field] + '').length > 0) {
                dataInfoSet = true;
                break;
            }
        }

        if (dataInfoSet) {
            record.set('sdocdatainfo', dataInfoMapper.createRecord(dataInfoValues));
        } else {
            record.set('sdocdatainfo', undefined);
        }

        // console.log('mapResponseDocument record full:', record);

        return record;
    }

    getAdapterFields(method: string, mapper: Mapper, params: any, opts: any): string[] {
        const fields = ['id', 'image_id_i', 'loc_id_i', 'route_id_i', 'track_id_i', 'trip_id_i', 'news_id_i',
            'date_dt', 'desc_txt', 'desc_md_txt', 'desc_html_txt', 'geo_lon_s', 'geo_lat_s', 'geo_loc_p',
            'data_tech_alt_asc_i', 'data_tech_alt_desc_i', 'data_tech_alt_min_i', 'data_tech_alt_max_i',
            'data_tech_dist_f', 'data_tech_dur_f',
            'data_info_guides_s', 'data_info_region_s', 'data_info_baseloc_s', 'data_info_destloc_s',
            'rate_pers_ausdauer_i', 'rate_pers_bildung_i', 'rate_pers_gesamt_i', 'rate_pers_kraft_i', 'rate_pers_mental_i',
            'rate_pers_motive_i', 'rate_pers_schwierigkeit_i', 'rate_pers_wichtigkeit_i',
            'rate_tech_overall_s', 'rate_tech_ks_s', 'rate_tech_firn_s', 'rate_tech_gletscher_s', 'rate_tech_klettern_s',
            'rate_tech_bergtour_s', 'rate_tech_schneeschuh_s',
            'gpstracks_basefile_s', 'keywords_txt', 'loc_lochirarchie_s', 'loc_lochirarchie_ids_s', 'name_s', 'type_s',
            'actiontype_ss', 'subtype_s', 'i_fav_url_txt'];

        if (params !== undefined && params.spatial !== undefined && params.spatial.geo_loc_p !== undefined &&
            params.spatial.geo_loc_p.nearby !== undefined) {
            fields.push('distance:geodist()');
        }
        if (opts.loadTrack === true) {
            fields.push('gpstrack_s');
        }

        return fields;
    };

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
        sortParams.set('bq', 'type_s:ROUTE^1.4 type_s:LOCATION^1.3 type_s:TRACK^1.2 type_s:TRIP^1.2 type_s:NEWS^1.1 type_s:IMAGE^1' +
            ' _val_:"div(rate_pers_gesamt_i, 10)"' );
        sortParams.set('qf', 'html_txt^12.0 name_txt^10.0 desc_txt^8.0 keywords_txt^6.0 loc_lochirarchie_txt^4.0');
        sortParams.set('defType', 'edismax');
        sortParams.set('boost', 'recip(rord(date_dts),1,1000,1000)');

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

    getHttpEndpoint(method: string): string {
        const updateMethods = ['create', 'destroy', 'update'];
        if (updateMethods.indexOf(method.toLowerCase()) >= 0) {
            return 'update?';
        }
        return 'select?';
    }
}

