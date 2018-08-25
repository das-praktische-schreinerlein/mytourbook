import {TourDocRecord} from '../model/records/tdoc-record';
import {TourDocSearchForm} from '../model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../model/container/tdoc-searchresult';
import {GenericSqlAdapter} from '../../search-commons/services/generic-sql.adapter';
import {TourDocAdapterResponseMapper} from './tdoc-adapter-response.mapper';
import {TableConfig} from '../../search-commons/services/sql-query.builder';
import {AdapterQuery} from '../../search-commons/services/mapper.utils';
import {Facet, Facets} from '../../search-commons/model/container/facets';
import {TourDocSqlMytbConfig} from './tdoc-sql-mytb.config';

export class TourDocSqlMytbAdapter extends GenericSqlAdapter<TourDocRecord, TourDocSearchForm, TourDocSearchResult> {
    private tableConfig: TourDocSqlMytbConfig = new TourDocSqlMytbConfig();

    constructor(config: any) {
        super(config, new TourDocAdapterResponseMapper(config));
    }

    protected getTableConfig(params: AdapterQuery): TableConfig {
        return this.getTableConfigForTableKey(this.extractTable(params));
    }

    protected getTableConfigForTableKey(table: string): TableConfig {
        return this.tableConfig.getTableConfigForTableKey(table);
    }

    protected getDefaultFacets(): Facets {
        const facets = new Facets();
        let facet = new Facet();
        facet.facet = ['trip', 'location', 'track', 'route', 'image', 'video', 'news'].map(value => {return [value, 0]; });
        facet.selectLimit = 1;
        facets.facets.set('type_txt', facet);
        facet = new Facet();
        facet.facet = ['relevance'].map(value => {return [value, 0]; });
        facets.facets.set('sorts', facet);

        return facets;
    }

    protected extractTable(params: AdapterQuery): string {
        if (params.where === undefined) {
            return undefined;
        }

        const types = params.where['type_txt'];
        if (types !== undefined && types.in !== undefined && types.in.length === 1) {
            const tabKey = types.in[0].toLowerCase();
            if (this.tableConfig.getTableConfigForTableKey(tabKey) !== undefined) {
                return tabKey;
            }

            return undefined;
        }
        const ids = params.where['id'];
        if (ids !== undefined && ids.in_number !== undefined && ids.in_number.length === 1) {
            const tabKey = ids.in_number[0].replace(/_.*/g, '').toLowerCase();
            if (this.tableConfig.getTableConfigForTableKey(tabKey) !== undefined) {
                return tabKey;
            }

            return undefined;
        }

        return undefined;
    }
}

