import {TourDocDataStore, TourDocTeamFilterConfig} from '../shared/tdoc-commons/services/tdoc-data.store';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {TourDocDataService} from '../shared/tdoc-commons/services/tdoc-data.service';
import {TourDocSolrAdapter} from '../shared/tdoc-commons/services/tdoc-solr.adapter';
import axios from 'axios';
import * as fs from 'fs';
import * as knex from 'knex';
import {HttpAdapter} from 'js-data-http';
import {TourDocSqlMytbDbAdapter} from '../shared/tdoc-commons/services/tdoc-sql-mytbdb.adapter';
import {TourDocSqlMytbExportDbAdapter} from '../shared/tdoc-commons/services/tdoc-sql-mytbexportdb.adapter';
import {TourDocItemsJsAdapter} from '../shared/tdoc-commons/services/tdoc-itemsjs.adapter';
import {TourDocFileUtils} from '../shared/tdoc-commons/services/tdoc-file.utils';
import {FacetCacheUsageConfigurations, SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {CommonObjectDetectionProcessingDatastore} from '@dps/mycms-commons/dist/commons/model/common-object-detection-processing-datastore';
import {
    TourDocSqlMytbDbObjectDetectionProcessingAdapter
} from '../shared/tdoc-commons/services/tdoc-sql-mytbdb-objectdetection-processing.adapter';
import {BackendConfigType} from './backend.commons';
import {ExtendedItemsJsConfig, ItemsJsDataImporter} from '../shared/tdoc-commons/services/itemsjs.dataimporter';

export interface SqlConnectionConfig {
    client: 'sqlite3' | 'mysql';
    connection: {
        host: string;
        user: string;
        password: string;
        database: string;
        port: string;
        filename?: string;
    };
}

export class TourDocDataServiceModule {
    private static dataServices = new Map<string, TourDocDataService>();
    private static odDataStores = new Map<string, CommonObjectDetectionProcessingDatastore>();

    public static getDataService(profile: string, backendConfig: BackendConfigType): TourDocDataService {
        if (!this.dataServices.has(profile)) {
            switch (backendConfig.tdocDataStoreAdapter) {
                case 'TourDocSolrAdapter':
                    this.dataServices.set(profile, TourDocDataServiceModule.createDataServiceSolr(backendConfig));
                    break;
                case 'TourDocSqlMytbDbAdapter':
                    this.dataServices.set(profile, TourDocDataServiceModule.createDataServiceMytbDbSql(backendConfig));
                    break;
                case 'TourDocSqlMytbExportDbAdapter':
                    this.dataServices.set(profile, TourDocDataServiceModule.createDataServiceMytbExportDbSql(backendConfig));
                    break;
                case 'TourDocItemsJsAdapter':
                    this.dataServices.set(profile, TourDocDataServiceModule.createDataServiceItemsJs(backendConfig));
                    break;
                default:
                    throw new Error('configured tdocDataStoreAdapter not exist:' + backendConfig.tdocDataStoreAdapter);
            }
        }

        return this.dataServices.get(profile);
    }

    public static getObjectDetectionDataStore(profile: string, backendConfig: BackendConfigType): CommonObjectDetectionProcessingDatastore {
        if (!this.odDataStores.has(profile)) {
            if (backendConfig.tdocDataStoreAdapter === 'TourDocSqlMytbDbAdapter') {
                this.odDataStores.set(profile, TourDocDataServiceModule.createObjectDetectionDataStoreMytbDbSql(backendConfig));
            } else {
                throw new Error('configured tdocDataStoreAdapter not exist as ObjectDetectionDataStore:'
                    + backendConfig.tdocDataStoreAdapter);
            }
        }

        return this.odDataStores.get(profile);
    }

    private static createDataServiceSolr(backendConfig: BackendConfigType): TourDocDataService {
        // configure store
        const filterConfig: TourDocTeamFilterConfig = new TourDocTeamFilterConfig();
        const themeFilters: any[] = JSON.parse(fs.readFileSync(backendConfig.filePathThemeFilterJson, { encoding: 'utf8' }));
        for (const themeName in themeFilters) {
            filterConfig.set(themeName, themeFilters[themeName]);
        }
        const dataStore: TourDocDataStore = new TourDocDataStore(new SearchParameterUtils(), filterConfig);
        const dataService: TourDocDataService = new TourDocDataService(dataStore);

        // configure solr-adapter
        const solrConfig = backendConfig.TourDocSolrAdapter;
        if (solrConfig === undefined) {
            throw new Error('config for TourDocSolrAdapter not exists');
        }
        const options = {
            basePath: solrConfig.solrCoreTourDoc,
            suffix: '&wt=json&indent=on&datatype=jsonp&json.wrf=JSONP_CALLBACK&callback=JSONP_CALLBACK&',
            http: axios,
            beforeHTTP: function (config, opts) {
                config.auth = {
                    username: solrConfig.solrCoreTourDocReadUsername,
                    password: solrConfig.solrCoreTourDocReadPassword
                };

                // Now do the default behavior
                return HttpAdapter.prototype.beforeHTTP.call(this, config, opts);
            },
            mapperConfig: backendConfig.mapperConfig
        };
        const adapter = new TourDocSolrAdapter(options);
        dataStore.setAdapter('http', adapter, '', {});

        return dataService;
    }

    private static createDataServiceMytbDbSql(backendConfig: BackendConfigType): TourDocDataService {
        // configure store
        const filterConfig: TourDocTeamFilterConfig = new TourDocTeamFilterConfig();
        const themeFilters: any[] = JSON.parse(fs.readFileSync(backendConfig.filePathThemeFilterJson, { encoding: 'utf8' }));
        for (const themeName in themeFilters) {
            filterConfig.set(themeName, themeFilters[themeName]);
        }
        const dataStore: TourDocDataStore = new TourDocDataStore(new SearchParameterUtils(), filterConfig);
        const dataService: TourDocDataService = new TourDocDataService(dataStore);

        // configure adapter
        const sqlConfig: SqlConnectionConfig = backendConfig.TourDocSqlMytbDbAdapter;
        if (sqlConfig === undefined) {
            throw new Error('config for TourDocSqlMytbDbAdapter not exists');
        }
        const options = {
            knexOpts: {
                client: sqlConfig.client,
                connection: sqlConfig.connection
            },
            mapperConfig: backendConfig.mapperConfig
        };
        const adapter = new TourDocSqlMytbDbAdapter(options,
            <FacetCacheUsageConfigurations>backendConfig.TourDocSqlMytbDbAdapter['facetCacheUsage']);
        dataStore.setAdapter('http', adapter, '', {});

        return dataService;
    }

    private static createDataServiceMytbExportDbSql(backendConfig: BackendConfigType): TourDocDataService {
        // configure store
        const filterConfig: TourDocTeamFilterConfig = new TourDocTeamFilterConfig();
        const themeFilters: any[] = JSON.parse(fs.readFileSync(backendConfig.filePathThemeFilterJson, { encoding: 'utf8' }));
        for (const themeName in themeFilters) {
            filterConfig.set(themeName, themeFilters[themeName]);
        }
        const dataStore: TourDocDataStore = new TourDocDataStore(new SearchParameterUtils(), filterConfig);
        const dataService: TourDocDataService = new TourDocDataService(dataStore);

        // configure adapter
        const sqlConfig: SqlConnectionConfig = backendConfig.TourDocSqlMytbExportDbAdapter;
        if (sqlConfig === undefined) {
            throw new Error('config for TourDocSqlMytbExportDbAdapter not exists');
        }
        const options = {
            knexOpts: {
                client: sqlConfig.client,
                connection: sqlConfig.connection
            },
            mapperConfig: backendConfig.mapperConfig
        };
        const adapter = new TourDocSqlMytbExportDbAdapter(options,
            <FacetCacheUsageConfigurations>backendConfig.TourDocSqlMytbExportDbAdapter['facetCacheUsage']);
        dataStore.setAdapter('http', adapter, '', {});

        return dataService;
    }

    private static createDataServiceItemsJs(backendConfig: BackendConfigType): TourDocDataService {
        // configure store
        const filterConfig: TourDocTeamFilterConfig = new TourDocTeamFilterConfig();
        const themeFilters: any[] = JSON.parse(fs.readFileSync(backendConfig.filePathThemeFilterJson, { encoding: 'utf8' }));
        for (const themeName in themeFilters) {
            filterConfig.set(themeName, themeFilters[themeName]);
        }
        const dataStore: TourDocDataStore = new TourDocDataStore(new SearchParameterUtils(), filterConfig);
        const dataService: TourDocDataService = new TourDocDataService(dataStore);

        // configure adapter
        const config = backendConfig.TourDocItemsJsAdapter;
        if (config === undefined) {
            throw new Error('config for TourDocItemsJsAdapter not exists');
        }

        const tdocs = [];
        const data = TourDocFileUtils.parseRecordSourceFromJson(fs.readFileSync(config.dataFile, { encoding: 'utf8' }));
        const exportRecords = data.map(doc => {
            return importer.extendAdapterDocument(doc);
        });

        tdocs.push(...exportRecords);

        const itemsJsConfig: ExtendedItemsJsConfig = TourDocItemsJsAdapter.itemsJsConfig;
        const importer: ItemsJsDataImporter = new ItemsJsDataImporter(itemsJsConfig);
        const records = importer.mapToItemJsDocuments(tdocs);
        const adapter = new TourDocItemsJsAdapter({mapperConfig: backendConfig.mapperConfig}, records, itemsJsConfig);
        dataStore.setAdapter('http', adapter, '', {});

        return dataService;
    }

    private static createObjectDetectionDataStoreMytbDbSql(backendConfig: BackendConfigType): CommonObjectDetectionProcessingDatastore {
        // configure adapter
        const sqlConfig: SqlConnectionConfig = backendConfig.TourDocSqlMytbDbAdapter;
        if (sqlConfig === undefined) {
            throw new Error('config for TourDocSqlMytbDbAdapter not exists');
        }
        const options = {
            knexOpts: {
                client: sqlConfig.client,
                connection: sqlConfig.connection
            }
        };
        const odDataStore: CommonObjectDetectionProcessingDatastore =
            new TourDocSqlMytbDbObjectDetectionProcessingAdapter(options, knex(options.knexOpts), new SqlQueryBuilder());

        return odDataStore;
    }

}
