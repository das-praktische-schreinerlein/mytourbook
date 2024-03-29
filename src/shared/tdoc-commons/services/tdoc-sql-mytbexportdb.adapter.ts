import {TourDocRecord} from '../model/records/tdoc-record';
import {TourDocSearchForm} from '../model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../model/container/tdoc-searchresult';
import {GenericSqlAdapter} from '@dps/mycms-commons/dist/search-commons/services/generic-sql.adapter';
import {TourDocAdapterResponseMapper} from './tdoc-adapter-response.mapper';
import {FacetCacheUsageConfigurations, TableConfig} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {AdapterQuery} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';
import {Facet, Facets} from '@dps/mycms-commons/dist/search-commons/model/container/facets';
import {TourDocSqlMytbExportDbConfig} from './tdoc-sql-mytbexportdb.config';
import {TourDocSqlUtils} from './tdoc-sql.utils';

export class TourDocSqlMytbExportDbAdapter extends GenericSqlAdapter<TourDocRecord, TourDocSearchForm, TourDocSearchResult> {
    private readonly tableConfig: TourDocSqlMytbExportDbConfig = new TourDocSqlMytbExportDbConfig();

    constructor(config: any, facetCacheUsageConfigurations: FacetCacheUsageConfigurations) {
        super(config, new TourDocAdapterResponseMapper(config), facetCacheUsageConfigurations);
        this.extendTableConfigs();
    }

    protected extendTableConfigs() {
        this.sqlQueryBuilder.extendTableConfigs(TourDocSqlMytbExportDbConfig.tableConfigs);
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
        facet.facet = ['trip', 'location', 'track', 'destination', 'route', 'image', 'video', 'news', 'info', 'poi'].map(value => {return [value, 0]; });
        facet.selectLimit = 1;
        facets.facets.set('type_ss', facet);
        facet = new Facet();
        facet.facet = ['relevance'].map(value => {return [value, 0]; });
        facets.facets.set('sorts', facet);

        return facets;
    }

    protected extractTable(params: AdapterQuery): string {
        if (params.where === undefined) {
            return undefined;
        }

        const types = params.where['type_ss'];
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

        if (ids !== undefined && ids.in !== undefined && ids.in.length === 1) {
            const tabKey = ids.in[0].replace(/_.*/g, '').toLowerCase();
            if (this.tableConfig.getTableConfigForTableKey(tabKey) !== undefined) {
                return tabKey;
            }

            return undefined;
        }

        return undefined;
    }

    protected transformToSqlDialect(sql: string): string {
        if (this.config.knexOpts.client !== 'mysql') {
            sql = TourDocSqlUtils.transformToSqliteDialect(sql);
        }

        return super.transformToSqlDialect(sql);
    }

}

