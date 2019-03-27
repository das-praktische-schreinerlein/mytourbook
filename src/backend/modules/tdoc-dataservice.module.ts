import {TourDocDataStore, TourDocTeamFilterConfig} from '../shared/tdoc-commons/services/tdoc-data.store';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {TourDocDataService} from '../shared/tdoc-commons/services/tdoc-data.service';
import {TourDocSolrAdapter} from '../shared/tdoc-commons/services/tdoc-solr.adapter';
import axios from 'axios';
import * as fs from 'fs';
import * as knex from 'knex';
import {HttpAdapter} from 'js-data-http';
import {TourDocSqlMediadbAdapter} from '../shared/tdoc-commons/services/tdoc-sql-mediadb.adapter';
import {TourDocSqlMytbAdapter} from '../shared/tdoc-commons/services/tdoc-sql-mytb.adapter';
import {TourDocItemsJsAdapter} from '../shared/tdoc-commons/services/tdoc-itemsjs.adapter';
import {TourDocFileUtils} from '../shared/tdoc-commons/services/tdoc-file.utils';
import {ObjectDetectionDataStore} from '../shared/tdoc-commons/services/common-queued-object-detection.service';
import {TourDocSqlMediadbObjectDetectionAdapter} from '../shared/tdoc-commons/services/tdoc-sql-mediadb-objectdetection.adapter';
import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';

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
    private static odDataStores = new Map<string, ObjectDetectionDataStore>();

    public static getDataService(profile: string, backendConfig: {}): TourDocDataService {
        if (!this.dataServices.has(profile)) {
            switch (backendConfig['tdocDataStoreAdapter']) {
                case 'TourDocSolrAdapter':
                    this.dataServices.set(profile, TourDocDataServiceModule.createDataServiceSolr(backendConfig));
                    break;
                case 'TourDocSqlMediadbAdapter':
                    this.dataServices.set(profile, TourDocDataServiceModule.createDataServiceMediadbSql(backendConfig));
                    break;
                case 'TourDocSqlMytbAdapter':
                    this.dataServices.set(profile, TourDocDataServiceModule.createDataServiceMytbSql(backendConfig));
                    break;
                case 'TourDocItemsJsAdapter':
                    this.dataServices.set(profile, TourDocDataServiceModule.createDataServiceItemsJs(backendConfig));
                    break;
                default:
                    throw new Error('configured tdocDataStoreAdapter not exist:' + backendConfig['tdocDataStoreAdapter']);
            }
        }

        return this.dataServices.get(profile);
    }

    public static getObjectDetectionDataStore(profile: string, backendConfig: {}): ObjectDetectionDataStore {
        if (!this.odDataStores.has(profile)) {
            switch (backendConfig['tdocDataStoreAdapter']) {
                case 'TourDocSqlMediadbAdapter':
                    this.odDataStores.set(profile, TourDocDataServiceModule.createObjectDetectionDataStoreMediadbSql(backendConfig));
                    break;
                default:
                    throw new Error('configured tdocDataStoreAdapter not exist as ObjectDetectionDataStore:'
                        + backendConfig['tdocDataStoreAdapter']);
            }
        }

        return this.odDataStores.get(profile);
    }

    private static createDataServiceSolr(backendConfig: {}): TourDocDataService {
        // configure store
        const filterConfig: TourDocTeamFilterConfig = new TourDocTeamFilterConfig();
        const themeFilters: any[] = JSON.parse(fs.readFileSync(backendConfig['filePathThemeFilterJson'], { encoding: 'utf8' }));
        for (const themeName in themeFilters) {
            filterConfig.set(themeName, themeFilters[themeName]);
        }
        const dataStore: TourDocDataStore = new TourDocDataStore(new SearchParameterUtils(), filterConfig);
        const dataService: TourDocDataService = new TourDocDataService(dataStore);

        // configure solr-adapter
        const solrConfig = backendConfig['TourDocSolrAdapter'];
        if (solrConfig === undefined) {
            throw new Error('config for TourDocSolrAdapter not exists');
        }
        const options = {
            basePath: solrConfig['solrCoreTourDoc'],
            suffix: '&wt=json&indent=on&datatype=jsonp&json.wrf=JSONP_CALLBACK&callback=JSONP_CALLBACK&',
            http: axios,
            beforeHTTP: function (config, opts) {
                config.auth = {
                    username: solrConfig['solrCoreTourDocReadUsername'],
                    password: solrConfig['solrCoreTourDocReadPassword']
                };

                // Now do the default behavior
                return HttpAdapter.prototype.beforeHTTP.call(this, config, opts);
            },
            mapperConfig: backendConfig['mapperConfig']
        };
        const adapter = new TourDocSolrAdapter(options);
        dataStore.setAdapter('http', adapter, '', {});

        return dataService;
    }

    private static createDataServiceMediadbSql(backendConfig: {}): TourDocDataService {
        // configure store
        const filterConfig: TourDocTeamFilterConfig = new TourDocTeamFilterConfig();
        const themeFilters: any[] = JSON.parse(fs.readFileSync(backendConfig['filePathThemeFilterJson'], { encoding: 'utf8' }));
        for (const themeName in themeFilters) {
            filterConfig.set(themeName, themeFilters[themeName]);
        }
        const dataStore: TourDocDataStore = new TourDocDataStore(new SearchParameterUtils(), filterConfig);
        const dataService: TourDocDataService = new TourDocDataService(dataStore);

        // configure adapter
        const sqlConfig: SqlConnectionConfig = backendConfig['TourDocSqlMediadbAdapter'];
        if (sqlConfig === undefined) {
            throw new Error('config for TourDocSqlMediadbAdapter not exists');
        }
        const options = {
            knexOpts: {
                client: sqlConfig.client,
                connection: sqlConfig.connection
            },
            mapperConfig: backendConfig['mapperConfig']
        };
        const adapter = new TourDocSqlMediadbAdapter(options);
        dataStore.setAdapter('http', adapter, '', {});

        return dataService;
    }

    private static createDataServiceMytbSql(backendConfig: {}): TourDocDataService {
        // configure store
        const filterConfig: TourDocTeamFilterConfig = new TourDocTeamFilterConfig();
        const themeFilters: any[] = JSON.parse(fs.readFileSync(backendConfig['filePathThemeFilterJson'], { encoding: 'utf8' }));
        for (const themeName in themeFilters) {
            filterConfig.set(themeName, themeFilters[themeName]);
        }
        const dataStore: TourDocDataStore = new TourDocDataStore(new SearchParameterUtils(), filterConfig);
        const dataService: TourDocDataService = new TourDocDataService(dataStore);

        // configure adapter
        const sqlConfig: SqlConnectionConfig = backendConfig['TourDocSqlMytbAdapter'];
        if (sqlConfig === undefined) {
            throw new Error('config for TourDocSqlMytbAdapter not exists');
        }
        const options = {
            knexOpts: {
                client: sqlConfig.client,
                connection: sqlConfig.connection
            },
            mapperConfig: backendConfig['mapperConfig']
        };
        const adapter = new TourDocSqlMytbAdapter(options);
        dataStore.setAdapter('http', adapter, '', {});

        return dataService;
    }

    private static createDataServiceItemsJs(backendConfig: {}): TourDocDataService {
        // configure store
        const filterConfig: TourDocTeamFilterConfig = new TourDocTeamFilterConfig();
        const themeFilters: any[] = JSON.parse(fs.readFileSync(backendConfig['filePathThemeFilterJson'], { encoding: 'utf8' }));
        for (const themeName in themeFilters) {
            filterConfig.set(themeName, themeFilters[themeName]);
        }
        const dataStore: TourDocDataStore = new TourDocDataStore(new SearchParameterUtils(), filterConfig);
        const dataService: TourDocDataService = new TourDocDataService(dataStore);

        // configure adapter
        const itemsJsConfig = backendConfig['TourDocItemsJsAdapter'];
        if (itemsJsConfig === undefined) {
            throw new Error('config for TourDocItemsJsAdapter not exists');
        }
        const records = TourDocFileUtils.parseRecordSourceFromJson(fs.readFileSync(itemsJsConfig['dataFile'], { encoding: 'utf8' }));

        const adapter = new TourDocItemsJsAdapter({mapperConfig: backendConfig['mapperConfig']}, records);
        dataStore.setAdapter('http', adapter, '', {});

        return dataService;
    }

    private static createObjectDetectionDataStoreMediadbSql(backendConfig: {}): ObjectDetectionDataStore {
        // configure adapter
        const sqlConfig: SqlConnectionConfig = backendConfig['TourDocSqlMediadbAdapter'];
        if (sqlConfig === undefined) {
            throw new Error('config for TourDocSqlMediadbAdapter not exists');
        }
        const options = {
            knexOpts: {
                client: sqlConfig.client,
                connection: sqlConfig.connection
            }
        };
        const odDataStore: ObjectDetectionDataStore =
            new TourDocSqlMediadbObjectDetectionAdapter(options, knex(options.knexOpts), new SqlQueryBuilder());

        return odDataStore;
    }

}
