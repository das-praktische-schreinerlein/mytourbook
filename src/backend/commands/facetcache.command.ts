import * as fs from 'fs';
import {AbstractCommand} from '@dps/mycms-server-commons/dist/backend-commons/commands/abstract.command';
import {utils} from 'js-data';
import {
    CommonFacetCacheConfiguration,
    CommonFacetCacheService,
    CommonFacetCacheServiceConfiguration
} from '../shared/tdoc-commons/services/common-facetcache.service';
import * as knex from 'knex';
import {SqlConnectionConfig} from '../modules/tdoc-dataservice.module';
import {
    FacetCacheUsageConfigurations,
    SqlQueryBuilder,
    TableConfig,
    TableConfigs
} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {ServerConfig} from '../server-module.loader';
import {FacetUtils} from '@dps/mycms-commons/dist/search-commons/model/container/facets';
import {TourDocSqlMediadbConfig} from '../shared/tdoc-commons/services/tdoc-sql-mediadb.config';
import {TourDocSqlMytbConfig} from '../shared/tdoc-commons/services/tdoc-sql-mytb.config';

export class FacetCacheManagerCommand implements AbstractCommand {
    public process(argv): Promise<any> {
        const facetCacheManager = this.configureCommonFacetCacheService(argv);
        const action = argv['action'];

        let promise: Promise<any>;
        switch (action) {
            case 'prepareAll':
                try {
                    promise = facetCacheManager.dropAllFacets().then(value => {
                        return facetCacheManager.dropAllDatabaseRequirements();
                    }).then(value => {
                        return facetCacheManager.createAllDatabaseRequirements();
                    }).then(value => {
                        return facetCacheManager.createAllFacets();
                    });
                } catch (err) {
                    return utils.reject(err);
                }

                break;
            case 'dropAllDatabaseRequirements':
                try {
                    promise = facetCacheManager.dropAllDatabaseRequirements();
                } catch (err) {
                    return utils.reject(err);
                }

                break;
            case 'createAllDatabaseRequirements':
                try {
                    promise = facetCacheManager.createAllDatabaseRequirements();
                } catch (err) {
                    return utils.reject(err);
                }

                break;
            case 'dropAllFacets':
                try {
                    promise = facetCacheManager.dropAllFacets();
                } catch (err) {
                    return utils.reject(err);
                }

                break;
            case 'createAllFacets':
                try {
                    promise = facetCacheManager.createAllFacets();
                } catch (err) {
                    return utils.reject(err);
                }

                break;
            case 'removedFacetsCacheConfigs':
                try {
                    promise = facetCacheManager.removeFacetsCacheConfigs();
                } catch (err) {
                    return utils.reject(err);
                }

                break;
            case 'createFacetsCacheConfigs':
                try {
                    promise = facetCacheManager.createFacetsCacheConfigs();
                } catch (err) {
                    return utils.reject(err);
                }

                break;
            default:
                console.error('unknown action:', argv);
                promise = utils.reject('unknown action');
        }

        return promise;
    }

    protected configureCommonFacetCacheService(argv: string[]): CommonFacetCacheService {
        const filePathConfigJson = argv['c'] || argv['backend'] || 'config/backend.json';
        const backendConfig = JSON.parse(fs.readFileSync(filePathConfigJson, { encoding: 'utf8' }));
        const serverConfig: ServerConfig = {
            apiDataPrefix: '/api/v1',
            apiAssetsPrefix: '/api/assets',
            apiPublicPrefix: '/api/static',
            filePathErrorDocs: './error_docs/',
            backendConfig: backendConfig,
            firewallConfig: undefined
        };

        const sqlQueryBuilder = new SqlQueryBuilder();
        const facetConfig: CommonFacetCacheServiceConfiguration = serverConfig.backendConfig['facetCacheConfig'];
        if (facetConfig === undefined) {
            throw new Error('config for facetCacheConfig not exists');
        }

        let tableConfigs: TableConfigs;
        const adapaterName = backendConfig['tdocDataStoreAdapter'];
        switch (adapaterName) {
            case 'TourDocSqlMediadbAdapter':
                tableConfigs = TourDocSqlMediadbConfig.tableConfigs;
                break;
            case 'TourDocSqlMytbAdapter':
                tableConfigs = TourDocSqlMytbConfig.tableConfigs;
                break;
            default:
                throw new Error('tdocDataStoreAdapter not exists: ' + adapaterName);
        }

        sqlQueryBuilder.extendTableConfigs(tableConfigs);
        facetConfig.facets = this.createCommonFacetCacheConfigurations(tableConfigs,
            backendConfig[adapaterName]['facetCacheUsage']);
        console.log('create facets:', facetConfig);

        return new CommonFacetCacheService(facetConfig, this.createKnex(serverConfig.backendConfig));
    }

    protected createCommonFacetCacheConfigurations(tableConfigs: TableConfigs, facetCacheConfig: FacetCacheUsageConfigurations):
        CommonFacetCacheConfiguration[] {
        const configs: CommonFacetCacheConfiguration[] = [];
        for (const tableKey in facetCacheConfig) {
            const tableConfig: TableConfig = tableConfigs[tableKey];
            if (tableConfig === undefined) {
                throw new Error('tableConfig not exists: ' + tableKey);
            }

            for (const facetKey of facetCacheConfig[tableKey].facetKeys) {
                const facetConfig = tableConfig.facetConfigs[facetKey];
                if (facetConfig === undefined) {
                    throw new Error('facetConfig not exists: ' + tableKey + ' facet:' + facetKey);
                }
                if (facetConfig.selectSql === undefined) {
                    continue;
                }

                const config: CommonFacetCacheConfiguration = {
                    valueType: facetConfig.valueType,
                    longKey: FacetUtils.generateFacetCacheKey(tableKey, facetKey),
                    facetSql: facetConfig.selectSql,
                    triggerTables: facetConfig.triggerTables,
                    withLabel: facetConfig.withLabelField,
                    name: FacetUtils.generateFacetCacheKey(tableKey, facetKey),
                    shortKey: facetKey
                };
                configs.push(config);
            }
        }

        return configs;
    }

    protected createKnex(backendConfig: {}): any {
        // configure adapter
        const sqlConfig: SqlConnectionConfig = backendConfig[backendConfig['tdocDataStoreAdapter']];
        if (sqlConfig === undefined) {
            throw new Error('config for tdocDataStoreAdapter not exists');
        }
        const knexOpts = {
            client: sqlConfig.client,
            connection: sqlConfig.connection
        };
        return knex(knexOpts);
    }

}
