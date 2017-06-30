import {GenericSolrAdapter} from '../../search-commons/services/generic-solr.adapter';
import {Mapper, Record} from 'js-data';
import {PDocRecord} from '../model/records/pdoc-record';
import {PDocSearchForm} from '../model/forms/pdoc-searchform';
import {PDocSearchResult} from '../model/container/pdoc-searchresult';

export class PDocSolrAdapter extends GenericSolrAdapter<PDocRecord, PDocSearchForm, PDocSearchResult> {
    constructor(config: any) {
        super(config);
    }

    mapToSolrFieldName(fieldName: string): string {
        switch (fieldName) {
            case 'name':
                return 'name_txt';
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
            desc_txt: props.desc,
            keywords_txt: (props.keywords ? props.keywords.split(', ').join(',,KW_') : ''),
            name_txt: props.name,
            type_txt: props.type,

        };

        values['html_txt'] = [values.desc_txt, values.name_txt, values.keywords_txt, values.type_txt].join(' ');

        return values;
    }

    mapSolrDocument(mapper: Mapper, doc: any): Record {
        const values = {};
        values['id'] = this.getSolrValue(doc, 'id', undefined);

        values['desc'] = this.getSolrValue(doc, 'desc_txt', undefined);
        values['keywords'] = this.getSolrValue(doc, 'keywords_txt', '').split(',,').join(', ').replace(/KW_/g, '');
        values['name'] = this.getSolrValue(doc, 'name_txt', undefined);
        values['type'] = this.getSolrValue(doc, 'type_txt', undefined);

        // console.log('mapSolrDocument values:', values);

        const record: PDocRecord = <PDocRecord>mapper.createRecord(values);

        // console.log('mapSolrDocument record full:', record);

        return record;
    }

    getSolrFields(mapper: Mapper, params: any, opts: any): string[] {
        return ['id', 'desc_txt', 'keywords_txt', 'name_txt', 'type_txt'];
    };

    getFacetParams(mapper: Mapper, params: any, opts: any, query: any): Map<string, any> {
        const facetParams = new Map<string, any>();
        facetParams.set('facet', 'on');

        facetParams.set('facet.field', ['keywords_txt', 'type_txt']);

        facetParams.set('f.keywords_txt.facet.prefix', 'kw_');
        facetParams.set('f.keywords_txt.facet.limit', '-1');
        facetParams.set('f.keywords_txt.facet.sort', 'count');

        return facetParams;
    };

    getSpatialParams(mapper: Mapper, params: any, opts: any, query: any): Map<string, any> {
        const spatialParams = new Map<string, any>();
        return spatialParams;
    };


    getSortParams(mapper: Mapper, params: any, opts: any, query: any): Map<string, any> {
        const sortParams = new Map<string, any>();

        const form = opts.originalSearchForm || {};
        switch (form.sort) {
            default:
                sortParams.set('qf', 'name_txt^10.0 desc_txt^8.0 keywords_txt^6.0');
                sortParams.set('defType', 'edismax');
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

