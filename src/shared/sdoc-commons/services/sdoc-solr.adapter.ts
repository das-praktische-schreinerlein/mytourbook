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

    mapToSolrFieldName(fieldName: string): string {
        switch (fieldName) {
            case 'name':
                return 'name_s';
            case 'html':
                return 'html_txt';
            case 'desc':
                return 'desc_txt';
            default:
                break;
        }

        return super.mapToSolrFieldName(fieldName);
    }

    mapToSolrDocument(props: any): any {
        const values = {
            id: props.id,
            image_id_i: props.imageId,
            loc_id_i: props.locId,
            route_id_i: props.routeId,
            track_id_i: props.trackId,
            date_dt: props.datevon,
            desc_txt: props.desc,
            geo_lon_s: props.geoLon,
            geo_lat_s: props.geoLat,
            geo_loc_p: props.geoLoc,
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

    mapSolrDocument(mapper: Mapper, doc: any): Record {
        const imageMapper = mapper['datastore']._mappers['sdocimage'];
        const rateTechMapper = mapper['datastore']._mappers['sdocratetech'];

        const values = {};
        values['id'] = this.getSolrValue(doc, 'id', undefined);

        values['imageId'] = Number(this.getSolrValue(doc, 'image_id_i', undefined));
        values['locId'] = Number(this.getSolrValue(doc, 'loc_id_i', undefined));
        values['routeId'] = Number(this.getSolrValue(doc, 'route_id_i', undefined));
        values['trackId'] = Number(this.getSolrValue(doc, 'track_id_i', undefined));

        values['datevon'] = this.getSolrValue(doc, 'date_dt', undefined);
        values['desc'] = this.getSolrValue(doc, 'desc_txt', undefined);
        values['geoLon'] = this.getSolrCoorValue(doc, 'geo_lon_s', undefined);
        values['geoLat'] = this.getSolrCoorValue(doc, 'geo_lat_s', undefined);
        values['geoLoc'] = this.getSolrCoorValue(doc, 'geo_loc_p', undefined);
        values['gpsTrackBasefile'] = this.getSolrValue(doc, 'gpstracks_basefile_s', undefined);
        values['keywords'] = this.getSolrValue(doc, 'keywords_txt', '').split(',,').join(', ').replace(/KW_/g, '');
        values['name'] = this.getSolrValue(doc, 'name_s', undefined);
        values['type'] = this.getSolrValue(doc, 'type_s', undefined);
        values['locHirarchie'] = this.getSolrValue(doc, 'loc_lochirarchie_s', '')
            .replace(/,,/g, ' -> ')
            .replace(/,/g, ' ')
            .replace(/_/g, ' ')
            .trim();
        values['locHirarchieIds'] = this.getSolrValue(doc, 'loc_lochirarchie_ids_s', '')
            .replace(/_/g, ' ').trim()
            .replace(/[,]+/g, ',').replace(/(^,)|(,$)/g, '');

        // console.log('mapSolrDocument values:', values);

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
        // console.log('mapSolrDocument record full:', record);


        const rateTechValues = {};
        rateTechValues['altAsc'] = this.getSolrValue(doc, 'rate_tech_alt_asc_i', undefined);
        rateTechValues['altDesc'] = this.getSolrValue(doc, 'rate_tech_alt_desc_i', undefined);
        rateTechValues['altMin'] = this.getSolrValue(doc, 'rate_tech_alt_min_i', undefined);
        rateTechValues['altMax'] = this.getSolrValue(doc, 'rate_tech_alt_max_i', undefined);
        rateTechValues['dist'] = this.getSolrValue(doc, 'rate_tech_dist_f', undefined);
        rateTechValues['dur'] = this.getSolrValue(doc, 'rate_tech_dur_f', undefined);
        let rateTechSet = false;
        for (const field in rateTechValues) {
            if (rateTechValues[field] !== undefined) {
                rateTechSet = true;
                break;
            }
        }

        console.log('mapSolrDocument record full:', record);
        if (rateTechSet) {
            record.set('sdocratetech', rateTechMapper.createRecord(rateTechValues));
        } else {
            record.set('sdocratetech', undefined);
        }

        // console.log('mapSolrDocument record full:', record);

        return record;
    }

    getSolrFields(mapper: Mapper, params: any, opts: any): string[] {
        return ['id', 'image_id_i', 'loc_id_i', 'route_id_i', 'track_id_i',
            'date_dt', 'desc_txt', 'geo_lon_s', 'geo_lat_s', 'geo_loc_p',
            'rate_tech_alt_asc_i', 'rate_tech_alt_desc_i', 'rate_tech_alt_min_i', 'rate_tech_alt_max_i',
            'rate_tech_dist_f', 'rate_tech_dur_f',
            'gpstracks_basefile_s', 'keywords_txt', 'loc_lochirarchie_s', 'loc_lochirarchie_ids_s', 'name_s', 'type_s', 'i_fav_url_txt'];
    };

    getFacetParams(mapper: Mapper, params: any, opts: any, query: any): Map<string, any> {
        const facetParams = new Map<string, any>();
        facetParams.set('facet', 'on');

        facetParams.set('facet.field', ['loc_id_i',
            'loc_lochirarchie_txt',
            'keywords_txt',
            'month_is', 'week_is',
            'type_txt']);

        facetParams.set('f.keywords_txt.facet.prefix', 'kw_');
        facetParams.set('f.keywords_txt.facet.limit', '-1');
        facetParams.set('f.keywords_txt.facet.sort', 'count');

        facetParams.set('f.month_is.facet.limit', '-1');
        facetParams.set('f.month_is.facet.sort', 'count');

        facetParams.set('f.week_is.facet.limit', '-1');
        facetParams.set('f.week_is.facet.sort', 'count');

        return facetParams;
    };

    getSpatialParams(mapper: Mapper, params: any, opts: any, query: any): Map<string, any> {
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


    getSortParams(mapper: Mapper, params: any, opts: any, query: any): Map<string, any> {
        const sortParams = new Map<string, any>();

        const form = opts.originalSearchForm || {};
        switch (form.sort) {
            case 'date':
                sortParams.set('bq', 'type_s:ROUTE^1.4 type_s:LOCATION^1.3 type_s:TRACK^1.2 type_s:IMAGE^1');
                sortParams.set('qf', 'html_txt^12.0 name_txt^10.0 desc_txt^8.0 keywords_txt^6.0 loc_lochirarchie_txt^4.0');
                sortParams.set('defType', 'edismax');
                sortParams.set('boost', 'recip(rord(date_dts),1,3000,1000)');
                break;
            case 'location':
                sortParams.set('sort', 'loc_lochirarchie_s asc');
                sortParams.set('bq', 'type_txt:ROUTE^1.4 type_txt:LOCATION^1.3 type_txt:TRACK^1.2 type_txt:IMAGE^1');
                sortParams.set('qf', 'html_txt^12.0 name_txt^10.0 desc_txt^8.0 keywords_txt^6.0 loc_lochirarchie_txt^4.0');
                sortParams.set('defType', 'edismax');
                sortParams.set('boost', 'recip(rord(date_dts),1,3000,1000)');
                break;
            default:
                sortParams.set('bq', 'type_txt:ROUTE^1.4 type_txt:LOCATION^1.3 type_txt:TRACK^1.2 type_txt:IMAGE^1');
                sortParams.set('qf', 'html_txt^12.0 name_txt^10.0 desc_txt^8.0 keywords_txt^6.0 loc_lochirarchie_txt^4.0');
                sortParams.set('defType', 'edismax');
                sortParams.set('boost', 'recip(rord(date_dts),1,1000,1000)');
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

