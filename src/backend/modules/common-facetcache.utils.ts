import {FacetCacheUsageConfigurations, TableConfig, TableConfigs} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {FacetUtils} from '@dps/mycms-commons/dist/search-commons/model/container/facets';

export interface CommonFacetCacheConfiguration {
    longKey: string;
    shortKey: string;
    name: string;
    facetSql: string;
    withLabel: boolean;
    withId: boolean;
    valueType: 'string' | 'number' | 'date';
    triggerTables: string[];
}
export interface CommonFacetCacheServiceConfiguration {
    datastore: {
        scriptPath: string;
    };
    startUp: {
        checkDatastore: boolean;
        prepareDatastore: boolean;
        clearDatastore: boolean;
        prepareTrigger: boolean;
        prepareFacetViews: boolean;
    };
    facets: CommonFacetCacheConfiguration[];
    checkInterval: number;
}

export class CommonFacetCacheUtils {
    public static createCommonFacetCacheConfigurations(tableConfigs: TableConfigs, facetCacheConfig: FacetCacheUsageConfigurations):
        CommonFacetCacheConfiguration[] {
        const configs: CommonFacetCacheConfiguration[] = [];
        for (const tableKey in facetCacheConfig) {
            const tableConfig: TableConfig = tableConfigs[tableKey];
            if (tableConfig === undefined) {
                throw new Error('tableConfig not exists: ' + tableKey);
            }

            for (const facetKey in tableConfig.facetConfigs) {
                const config = CommonFacetCacheUtils.createCommonFacetCacheConfiguration(tableConfig, facetKey, facetCacheConfig);
                if (config !== undefined) {
                    configs.push(config);
                }
            }
        }

        return configs;
    }

    public static createCommonFacetCacheConfiguration(tableConfig: TableConfig, facetKey: string,
                                                       facetCacheConfig: FacetCacheUsageConfigurations):
        CommonFacetCacheConfiguration {
        let found = false;
        for (const pattern of facetCacheConfig[tableConfig.key].facetKeyPatterns) {
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
