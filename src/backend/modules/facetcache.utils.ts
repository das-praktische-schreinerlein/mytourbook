import {FacetCacheUsageConfigurations, TableConfig, TableConfigs} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {FacetUtils} from '@dps/mycms-commons/dist/search-commons/model/container/facets';

export interface FacetCacheConfiguration {
    longKey: string;
    shortKey: string;
    name: string;
    facetSql: string;
    withLabel: boolean;
    withId: boolean;
    valueType: 'string' | 'number' | 'date';
    triggerTables: string[];
}

export interface FacetCacheServiceConfiguration {
    datastore: {
        scriptPath: string;
    };
    facets: FacetCacheConfiguration[];
    checkInterval: number;
}

export class FacetcacheUtils {
    public static createCommonFacetCacheConfigurations(tableConfigs: TableConfigs,
                                                       facetCacheUsageConfigurations: FacetCacheUsageConfigurations):
        FacetCacheConfiguration[] {
        const configs: FacetCacheConfiguration[] = [];

        if (facetCacheUsageConfigurations.active !== true) {
            return configs;
        }

        for (const tableKey in facetCacheUsageConfigurations.entities) {
            const tableConfig: TableConfig = tableConfigs[tableKey];
            if (tableConfig === undefined) {
                throw new Error('tableConfig not exists: ' + tableKey);
            }

            for (const facetKey in tableConfig.facetConfigs) {
                const config = FacetcacheUtils.createCommonFacetCacheConfiguration(tableConfig, facetKey,
                    facetCacheUsageConfigurations);
                if (config !== undefined) {
                    configs.push(config);
                }
            }
        }

        return configs;
    }

    public static createCommonFacetCacheConfiguration(tableConfig: TableConfig, facetKey: string,
                                                      facetCacheUsageConfigurations: FacetCacheUsageConfigurations):
        FacetCacheConfiguration {
        let found = false;
        for (const pattern of facetCacheUsageConfigurations.entities[tableConfig.key].facetKeyPatterns) {
            if (facetKey.match(new RegExp(pattern))) {
                found = true;
                break;
            }
        }
        if (found === false) {
            return;
        }

        const facetConfig = tableConfig.facetConfigs[facetKey];
        if (facetConfig === undefined) {
            throw new Error('facetConfig not exists: ' + tableConfig.key + ' facet:' + facetKey);
        }
        if (facetConfig.selectSql === undefined) {
            return;
        }

        return {
            valueType: facetConfig.valueType,
            longKey: FacetUtils.generateFacetCacheKey(tableConfig.key, facetKey),
            facetSql: facetConfig.selectSql,
            triggerTables: facetConfig.triggerTables,
            withLabel: facetConfig.withLabelField,
            withId: facetConfig.withIdField,
            name: FacetUtils.generateFacetCacheKey(tableConfig.key, facetKey),
            shortKey: facetKey
        };
    }
}
