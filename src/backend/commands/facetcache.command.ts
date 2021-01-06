import * as fs from 'fs';
import {AbstractCommand} from '@dps/mycms-server-commons/dist/backend-commons/commands/abstract.command';
import {AbstractFacetCacheManagerCommand} from '@dps/mycms-commons/dist/facetcache-commons/command/abstract-facetcache.command';
import {FacetCacheService} from '@dps/mycms-commons/dist/facetcache-commons/service/facetcache.service';
import * as knex from 'knex';
import {SqlConnectionConfig} from '../modules/tdoc-dataservice.module';
import {SqlQueryBuilder, TableConfigs} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {ServerConfig} from '../server-module.loader';
import {TourDocSqlMytbDbConfig} from '../shared/tdoc-commons/services/tdoc-sql-mytbdb.config';
import {TourDocSqlMytbExportDbConfig} from '../shared/tdoc-commons/services/tdoc-sql-mytbexportdb.config';
import {FacetCacheServiceConfiguration} from '@dps/mycms-commons/dist/facetcache-commons/model/facetcache.configuration';
import {FacetCacheUtils} from '@dps/mycms-commons/dist/search-commons/services/facetcache.utils';
import {MysqlFacetCacheAdapter} from '@dps/mycms-commons/dist/facetcache-commons/model/mysql-facetcache.adapter';
import {Sqlite3FacetCacheAdapter} from '@dps/mycms-commons/dist/facetcache-commons/model/sqlite3-facetcache.adapter';
import {TourDocFacetCacheService} from '../modules/tdoc-facetcache.service';
import {BackendConfigType} from '../modules/backend.commons';
import {KeywordValidationRule, ValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {CommonAdminCommand, SimpleConfigFilePathValidationRule} from './common-admin.command';

export class FacetCacheManagerCommand extends CommonAdminCommand {
    protected facetCacheManagerCommandWrapper = new FacetCacheManagerCommandWrapper();

    protected createValidationRules(): {[key: string]: ValidationRule} {
        return {
            action: new KeywordValidationRule(true),
            backend: new SimpleConfigFilePathValidationRule(true)
        };
    }

    protected processCommandArgs(argv: {}): Promise<any> {
        return this.facetCacheManagerCommandWrapper.process(argv);
    }
}

export class FacetCacheManagerCommandWrapper extends AbstractFacetCacheManagerCommand implements AbstractCommand {
    protected configureCommonFacetCacheService(argv: string[]): FacetCacheService {
        const filePathConfigJson = argv['backend'];
        if (filePathConfigJson === undefined) {
            throw new Error('ERROR - parameters required backendConfig: "--backend"');
        }

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
        const adapterName = backendConfig.tdocDataStoreAdapter;
        switch (adapterName) {
            case 'TourDocSqlMytbDbAdapter':
                tableConfigs = TourDocSqlMytbDbConfig.tableConfigs;
                break;
            case 'TourDocSqlMytbExportDbAdapter':
                tableConfigs = TourDocSqlMytbExportDbConfig.tableConfigs;
                break;
            default:
                throw new Error('tdocDataStoreAdapter not exists: ' + adapterName);
        }

        const facetConfig: FacetCacheServiceConfiguration = backendConfig[adapterName]['facetCacheConfig'];
        if (facetConfig === undefined) {
            throw new Error('config for facetCacheConfig not exists');
        }

        sqlQueryBuilder.extendTableConfigs(tableConfigs);
        facetConfig.facets = FacetCacheUtils.createCommonFacetCacheConfigurations(sqlQueryBuilder, tableConfigs,
            backendConfig[adapterName]['facetCacheUsage']);
        console.log('create facets:', facetConfig);

        const connection = this.createKnex(serverConfig.backendConfig);
        const client = connection.client['config']['client'];
        switch (client) {
            case 'mysql':
                return new TourDocFacetCacheService(facetConfig, connection,
                    new MysqlFacetCacheAdapter(facetConfig.datastore.scriptPath));
            case 'sqlite3':
                return new TourDocFacetCacheService(facetConfig, connection,
                    new Sqlite3FacetCacheAdapter(facetConfig.datastore.scriptPath));
            default:
                throw new Error('other clients than mysql are not supported');
        }
    }

    protected createKnex(backendConfig: BackendConfigType): any {
        // configure adapter
        const sqlConfig: SqlConnectionConfig = backendConfig[backendConfig.tdocDataStoreAdapter];
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
