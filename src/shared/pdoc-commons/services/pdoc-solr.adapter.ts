import {GenericSolrAdapter} from '../../search-commons/services/generic-solr.adapter';
import {Mapper, Record} from 'js-data';
import {PDocRecord} from '../model/records/pdoc-record';
import {PDocSearchForm} from '../model/forms/pdoc-searchform';
import {PDocSearchResult} from '../model/container/pdoc-searchresult';
import {SolrConfig} from '../../search-commons/services/solr-query.builder';

export class PDocSolrAdapter extends GenericSolrAdapter<PDocRecord, PDocSearchForm, PDocSearchResult> {
    public static solrConfig: SolrConfig = {
        fieldList: ['id', 'desc_txt', 'desc_md_txt', 'desc_html_txt', 'keywords_txt', 'name_txt', 'type_txt'],
        facetConfigs: {
            'keywords_txt': {
                'f.keywords_txt.facet.prefix': 'kw_',
                'f.keywords_txt.facet.limit': '-1',
                'f.keywords_txt.facet.sort': 'count'
            },
            'type_txt': {}
        },
        commonSortOptions: {
            'qf': 'name_txt^10.0 desc_txt^8.0 keywords_txt^6.0',
            'defType': 'edismax'
        },
        sortMapping: {
            'relevance': {
            }
        },
        filterMapping: {
            'html': 'html_txt'
        },
        fieldMapping: {}
    };

    constructor(config: any) {
        super(config, undefined);
    }

    mapToAdapterDocument(props: any): any {
        const values = {
            id: props.id,
            desc_txt: props.descTxt,
            desc_md_txt: props.descMd,
            desc_html_txt: props.descHtml,
            keywords_txt: (props.keywords ? props.keywords.split(', ').join(',,KW_') : ''),
            name_txt: props.name,
            type_txt: props.type,

        };

        values['html_txt'] = [values.desc_txt, values.name_txt, values.keywords_txt, values.type_txt].join(' ');

        return values;
    }

    mapResponseDocument(mapper: Mapper, doc: any): Record {
        const values = {};
        values['id'] = this.mapperUtils.getAdapterValue(doc, 'id', undefined);

        values['descTxt'] = this.mapperUtils.getAdapterValue(doc, 'desc_txt', undefined);
        values['descMd'] = this.mapperUtils.getAdapterValue(doc, 'desc_md_txt', undefined);
        values['descHtml'] = this.mapperUtils.getAdapterValue(doc, 'desc_html_txt', undefined);
        values['keywords'] = this.mapperUtils.getAdapterValue(doc, 'keywords_txt', '').split(',,').join(', ').replace(/KW_/g, '');
        values['name'] = this.mapperUtils.getAdapterValue(doc, 'name_txt', undefined);
        values['type'] = this.mapperUtils.getAdapterValue(doc, 'type_txt', undefined);

        // console.log('mapResponseDocument values:', values);

        const record: PDocRecord = <PDocRecord>mapper.createRecord(values);

        // console.log('mapResponseDocument record full:', record);

        return record;
    }

    getHttpEndpoint(method: string): string {
        const updateMethods = ['create', 'destroy', 'update'];
        if (updateMethods.indexOf(method.toLowerCase()) >= 0) {
            return 'update?';
        }
        return 'select?';
    }

    getSolrConfig(): SolrConfig {
        return PDocSolrAdapter.solrConfig;
    }
}

