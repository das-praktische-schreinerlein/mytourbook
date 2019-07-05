import * as fs from 'fs';
import {AbstractCommand} from '@dps/mycms-server-commons/dist/backend-commons/commands/abstract.command';
import {utils} from 'js-data';
import {CommonFacetCacheService} from '../modules/common-facetcache.service';
import * as knex from 'knex';
import {SqlConnectionConfig} from '../modules/tdoc-dataservice.module';
import {SqlQueryBuilder, TableConfigs} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {ServerConfig} from '../server-module.loader';
import {TourDocSqlMediadbConfig} from '../shared/tdoc-commons/services/tdoc-sql-mediadb.config';
import {TourDocSqlMytbConfig} from '../shared/tdoc-commons/services/tdoc-sql-mytb.config';
import {CommonFacetCacheServiceConfiguration, CommonFacetCacheUtils} from '../modules/common-facetcache.utils';
import {CommonMysqlFacetCacheAdapter} from '../modules/mysql-facetcache.adapter';

export class FacetCacheManagerCommand implements AbstractCommand {
    public process(argv): Promise<any> {
        const facetCacheManager = this.configureCommonFacetCacheService(argv);
        const action = argv['action'];

        let promise: Promise<any>;
        switch (action) {
            case 'prepareAndStartDatabaseManagedFacets':
                try {
                    promise = facetCacheManager.stopAndDropDatabaseManagedFacets().then(() => {
                        return facetCacheManager.dropDatabaseRequirements();
                    }).then(() => {
                        return facetCacheManager.createDatabaseRequirements();
                    }).then(() => {
                        return facetCacheManager.createAndStartDatabaseManagedFacets();
                    }).then(() => {
                        // clear facetcache-database
                        process.on('SIGTERM', () => {
                            console.error('closing cache server: removing database-requirements');
                            return this.clearFacetCacheOnShutdown(facetCacheManager);
                        });

                        // wait till sighup
                        return new Promise<boolean>(() => {});
                    });
                } catch (err) {
                    // cleaning database
                    return this.clearFacetCacheOnShutdown(facetCacheManager).then(() => {
                        return utils.reject(err);
                    }).catch(reason => {
                        console.error('error while closing cachserver', reason);
                        return utils.reject(err);
                    });
                }

                break;
            case 'prepareAndStartServerManagedFacets':
                try {
                    promise = facetCacheManager.dropServerManagedFacets().then(() => {
                        return facetCacheManager.dropDatabaseRequirements();
                    }).then(() => {
                        return facetCacheManager.createDatabaseRequirements();
                    }).then(() => {
                        return facetCacheManager.createAndStartServerManagedFacets();
                    }).then(() => {
                        // clear facetcache-database
                        process.on('SIGTERM', () => {
                            console.error('closing cache server: removing database-requirements');
                            return this.clearFacetCacheOnShutdown(facetCacheManager);
                        });

                        // wait till sighup
                        return new Promise<boolean>(() => {});
                    });
                } catch (err) {
                    // cleaning database
                    return this.clearFacetCacheOnShutdown(facetCacheManager).then(() => {
                        return utils.reject(err);
                    }).catch(reason => {
                        console.error('error while closing cachserver', reason);
                        return utils.reject(err);
                    });
                }

                break;
            case 'dropDatabaseRequirements':
                try {
                    promise = facetCacheManager.dropDatabaseRequirements();
                } catch (err) {
                    return utils.reject(err);
                }

                break;
            case 'createDatabaseRequirements':
                try {
                    promise = facetCacheManager.createDatabaseRequirements();
                } catch (err) {
                    return utils.reject(err);
                }

                break;
            case 'showCreateDatabaseRequirementsSql':
                try {
                    console.log(facetCacheManager.showCreateDatabaseRequirements());
                    promise = utils.resolve(true);
                } catch (err) {
                    return utils.reject(err);
                }

                break;
            case 'showDropDatabaseRequirementsSql':
                try {
                    console.log(facetCacheManager.showDropDatabaseRequirements());
                    promise = utils.resolve(true);
                } catch (err) {
                    return utils.reject(err);
                }

                break;
            case 'stopAndDropDatabaseManagedFacets':
                try {
                    promise = facetCacheManager.stopAndDropDatabaseManagedFacets();
                } catch (err) {
                    return utils.reject(err);
                }

                break;
            case 'showStopAndDropDatabaseManagedFacets':
                try {
                    console.log(facetCacheManager.showStopAndDropDatabaseManagedFacets());
                    promise = utils.resolve(true);
                } catch (err) {
                    return utils.reject(err);
                }

                break;
            case 'createAndStartDatabaseManagedFacets':
                try {
                    promise = facetCacheManager.createAndStartDatabaseManagedFacets().then(() => {
                        // clear facetcache-database
                        process.on('SIGTERM', () => {
                            console.error('closing cache server: removing facets');
                            return this.clearFacetsOnShutdown(facetCacheManager);
                        });

                        // wait till sighup
                        return new Promise<boolean>(() => {});
                    });
                } catch (err) {
                    return this.clearFacetsOnShutdown(facetCacheManager).then(() => {
                        return utils.reject(err);
                    }).catch(reason => {
                        console.error('error while closing cacheserver', reason);
                        return utils.reject(err);
                    });
                }
                break;
            case 'showCreateAndStartDatabaseManagedFacets':
                try {
                    console.log(facetCacheManager.showCreateAndStartDatabaseManagedFacets());
                    promise = utils.resolve(true);
                } catch (err) {
                    return utils.reject(err);
                }

                break;



            case 'dropServerManagedFacets':
                try {
                    promise = facetCacheManager.dropServerManagedFacets();
                } catch (err) {
                    return utils.reject(err);
                }

                break;
            case 'showDropDatabaseManagedFacets':
                try {
                    console.log(facetCacheManager.showDropServerManagedFacets());
                    promise = utils.resolve(true);
                } catch (err) {
                    return utils.reject(err);
                }

                break;
            case 'createAndStartServerManagedFacets':
                try {
                    promise = facetCacheManager.createAndStartServerManagedFacets().then(() => {
                        // clear facetcache-database
                        process.on('SIGTERM', () => {
                            console.error('closing cache server: removing facets');
                            return this.clearFacetsOnShutdown(facetCacheManager);
                        });

                        // wait till sighup
                        return new Promise<boolean>(() => {});
                    });
                } catch (err) {
                    return this.clearFacetsOnShutdown(facetCacheManager).then(() => {
                        return utils.reject(err);
                    }).catch(reason => {
                        console.error('error while closing cacheserver', reason);
                        return utils.reject(err);
                    });
                }
                break;
            case 'startServerManagedFacets':
                try {
                    promise = facetCacheManager.startServerManagedFacets();
                } catch (err) {
                    return utils.reject(err);
                }
                break;
            case 'showCreateServerManagedFacets':
                try {
                    console.log(facetCacheManager.showCreateServerManagedFacets());
                    promise = utils.resolve(true);
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

    protected clearFacetCacheOnShutdown(facetCacheManager: CommonFacetCacheService): Promise<any> {
        try {
            return this.clearFacetsOnShutdown(facetCacheManager).then(() => {
                return facetCacheManager.dropDatabaseRequirements();
            });
        } catch (err) {
            return utils.reject(err);
        }
    }

    protected clearFacetsOnShutdown(facetCacheManager: CommonFacetCacheService): Promise<any> {
        try {
            return facetCacheManager.stopAndDropDatabaseManagedFacets();
        } catch (err) {
            return utils.reject(err);
        }
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
        let tableConfigs: TableConfigs;
        const adapterName = backendConfig['tdocDataStoreAdapter'];
        switch (adapterName) {
            case 'TourDocSqlMediadbAdapter':
                tableConfigs = TourDocSqlMediadbConfig.tableConfigs;
                break;
            case 'TourDocSqlMytbAdapter':
                tableConfigs = TourDocSqlMytbConfig.tableConfigs;
                break;
            default:
                throw new Error('tdocDataStoreAdapter not exists: ' + adapterName);
        }

        const facetConfig: CommonFacetCacheServiceConfiguration = backendConfig[adapterName]['facetCacheConfig'];
        if (facetConfig === undefined) {
            throw new Error('config for facetCacheConfig not exists');
        }

        sqlQueryBuilder.extendTableConfigs(tableConfigs);
        facetConfig.facets = CommonFacetCacheUtils.createCommonFacetCacheConfigurations(tableConfigs,
            backendConfig[adapterName]['facetCacheUsage']);
        console.log('create facets:', facetConfig);

        const connection = this.createKnex(serverConfig.backendConfig);
        const client = connection.client['config']['client'];
        if (client !== 'mysql') {
            throw new Error('other clients than mysql are not supoort');
        }

        return new CommonFacetCacheService(facetConfig, connection, new CommonMysqlFacetCacheAdapter(facetConfig.datastore.scriptPath));
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
