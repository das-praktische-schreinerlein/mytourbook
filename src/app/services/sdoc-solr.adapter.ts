import {Injectable} from '@angular/core';
import {Jsonp} from '@angular/http';
import {GenericSolrAdapter} from './generic-solr.adapter';
import {Mapper, Record} from 'js-data';
import {SDocRecord} from '../model/records/sdoc-record';
import {SDocImageRecord} from '../model/records/sdocimage-record';
import {SDocSearchForm} from '../model/forms/sdoc-searchform';
import {SDocSearchResult} from '../model/container/sdoc-searchresult';

@Injectable()
export class SDocSolrAdapter extends GenericSolrAdapter<SDocRecord, SDocSearchForm, SDocSearchResult> {
    constructor(config: any, jsonP: Jsonp) {
        super(config, jsonP);
    }

    mapToSolrFieldName(fieldName: string): string {
        switch (fieldName) {
            case 'name':
                return 'name_txt';
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
        return {
            id: props.id,
            name_txt: props.name,
            html_txt: props.desc
        };
    }

    mapSolrDocument(mapper: Mapper, doc: any): Record {
        const imageMapper = mapper['datastore']._mappers['sdocimage'];

        const values = {};
        values['id'] = this.getSolrValue(doc, 'id', undefined);

        values['locId'] = Number(this.getSolrValue(doc, 'loc_id_i', undefined));
        values['routeId'] = Number(this.getSolrValue(doc, 'route_id_i', undefined));
        values['trackId'] = Number(this.getSolrValue(doc, 'track_id_i', undefined));

        values['datevon'] = this.getSolrValue(doc, 'date_dt', undefined);
        values['desc'] = this.getSolrValue(doc, 'desc_txt', undefined);
        values['geoLon'] = this.getSolrValue(doc, 'geo_lon_txt', undefined);
        values['geoLat'] = this.getSolrValue(doc, 'geo_lat_txt', undefined);
        values['geoLoc'] = this.getSolrValue(doc, 'geo_loc_p', undefined);
        values['gpsTrackBasefile'] = this.getSolrValue(doc, 'gpstracks_basefile_txt', undefined);
        values['keywords'] = this.getSolrValue(doc, 'keywords_txt', '').split(',,').join(', ').replace(/KW_/g, '');
        values['name'] = this.getSolrValue(doc, 'name_txt', undefined);
        values['type'] = this.getSolrValue(doc, 'type_txt', undefined);

        values['persons'] = this.getSolrValue(doc, 'personen_txt', '').split(',,').join(', ');
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
                id = Number(record.trackId);
            }
            id = id * 100000;

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

        return record;
    }

    getSolrFields(mapper: Mapper, params: any, opts: any): string[] {
        return ['id', 'loc_id_i', 'route_id_i', 'track_id_i', 'date_dt', 'desc_txt', 'geo_lon_txt', 'geo_lat_txt', 'geo_loc_p',
            'gpstracks_basefile_txt', 'keywords_txt', 'name_txt', 'type_txt', 'personen_txt', 'i_fav_url_txt'];
    };

    getFacetParams(mapper: Mapper, params: any, opts: any): Map<string, any> {
        const facetParams = new Map<string, any>();

        // TODO
        if (opts.facet === true) {
            facetParams.set('fq', '{!geofilt cache=false}');
            facetParams.set('sfield', 'geo_loc_p');
            facetParams.set('pt', '52.2657,13.5357');
            facetParams.set('d', '5');
        }

        return facetParams;
    };

    getSpatialParams(mapper: Mapper, params: any, opts: any): Map<string, any> {
        const spatialParams = new Map<string, any>();
        spatialParams.set('facet', 'on');

        spatialParams.set('facet.field', ['loc_id_i',
            'personen_txt',
            'loc_lochirarchie_txt',
            'keywords_txt', 'month_is',
            'week_is',
            'type_txt']);

        spatialParams.set('f.keywords_txt.facet.prefix', 'kw_');
        spatialParams.set('f.keywords_txt.facet.limit', '-1');
        spatialParams.set('f.keywords_txt.facet.sort', 'count');

        spatialParams.set('f.month_is.facet.limit', '-1');
        spatialParams.set('f.month_is.facet.sort', 'count');

        spatialParams.set('f.week_is.facet.limit', '-1');
        spatialParams.set('f.week_is.facet.sort', 'count');

        return spatialParams;
    };


    getSolrEndpoint(method: string): string {
        const updateMethods = ['create', 'destroy', 'update'];
        if (updateMethods.indexOf(method.toLowerCase()) >= 0) {
            return 'update?';
        }
        return 'select?';
    }
}

