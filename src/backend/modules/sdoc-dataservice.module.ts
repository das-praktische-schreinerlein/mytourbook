import {SDocDataStore, SDocTeamFilterConfig} from '../shared/sdoc-commons/services/sdoc-data.store';
import {SearchParameterUtils} from '../shared/search-commons/services/searchparameter.utils';
import {SDocDataService} from '../shared/sdoc-commons/services/sdoc-data.service';
import {SDocSolrAdapter} from '../shared/sdoc-commons/services/sdoc-solr.adapter';
import axios from 'axios';
import * as fs from 'fs';
import {HttpAdapter} from 'js-data-http';
import {SDocSqlMediadbAdapter} from '../shared/sdoc-commons/services/sdoc-sql-mediadb.adapter';
import {SDocSqlMytbAdapter} from '../shared/sdoc-commons/services/sdoc-sql-mytb.adapter';

export class SDocDataServiceModule {
    private static dataServices = new Map<string, SDocDataService>();

    public static getDataService(profile: string, backendConfig: {}, readOnly: boolean): SDocDataService {
        if (!this.dataServices.has(profile)) {
            switch (backendConfig['sdocDataStoreAdapter']) {
                case 'SDocSolrAdapter':
                    this.dataServices.set(profile, SDocDataServiceModule.createDataServiceSolr(backendConfig, readOnly));
                    break;
                case 'SDocSqlMediadbAdapter':
                    this.dataServices.set(profile, SDocDataServiceModule.createDataServiceMediadbSql(backendConfig, readOnly));
                    break;
                case 'SDocSqlMytbAdapter':
                    this.dataServices.set(profile, SDocDataServiceModule.createDataServiceMytbSql(backendConfig, readOnly));
                    break;
                default:
                    throw new Error('configured sdocDataStoreAdapter not exist:' + backendConfig['sdocDataStoreAdapter']);
            }
        }

        return this.dataServices.get(profile);
    }

    private static createDataServiceSolr(backendConfig: {}, readOnly: boolean): SDocDataService {
        // configure store
        const filterConfig: SDocTeamFilterConfig = new SDocTeamFilterConfig();
        const themeFilters: any[] = JSON.parse(fs.readFileSync(backendConfig['filePathThemeFilterJson'], { encoding: 'utf8' }));
        for (const themeName in themeFilters) {
            filterConfig.set(themeName, themeFilters[themeName]);
        }
        const dataStore: SDocDataStore = new SDocDataStore(new SearchParameterUtils(), filterConfig);
        const dataService: SDocDataService = new SDocDataService(dataStore);

        // configure solr-adapter
        const solrConfig = backendConfig['SDocSolrAdapter'];
        if (solrConfig === undefined) {
            throw new Error('config for SDocSolrAdapter not exists');
        }
        const options = {
            basePath: solrConfig['solrCoreSDoc'],
            suffix: '&wt=json&indent=on&datatype=jsonp&json.wrf=JSONP_CALLBACK&callback=JSONP_CALLBACK&',
            http: axios,
            beforeHTTP: function (config, opts) {
                config.auth = {
                    username: solrConfig['solrCoreSDocReadUsername'],
                    password: solrConfig['solrCoreSDocReadPassword']
                };

                // Now do the default behavior
                return HttpAdapter.prototype.beforeHTTP.call(this, config, opts);
            }
        };
        const adapter = new SDocSolrAdapter(options);
        dataStore.setAdapter('http', adapter, '', {});

        return dataService;
    }

    private static createDataServiceMediadbSql(backendConfig: {}, readOnly: boolean): SDocDataService {
        // configure store
        const filterConfig: SDocTeamFilterConfig = new SDocTeamFilterConfig();
        const themeFilters: any[] = JSON.parse(fs.readFileSync(backendConfig['filePathThemeFilterJson'], { encoding: 'utf8' }));
        for (const themeName in themeFilters) {
            filterConfig.set(themeName, themeFilters[themeName]);
        }
        const dataStore: SDocDataStore = new SDocDataStore(new SearchParameterUtils(), filterConfig);
        const dataService: SDocDataService = new SDocDataService(dataStore);

        // configure solr-adapter
        const sqlConfig = backendConfig['SDocSqlMediadbAdapter'];
        if (sqlConfig === undefined) {
            throw new Error('config for SDocSqlMediadbAdapter not exists');
        }
        const options = {
            knexOpts: {
                client: sqlConfig['client'],
                connection: {
                    host: sqlConfig['host'],
                    user: sqlConfig['user'],
                    password: sqlConfig['password'],
                    database: sqlConfig['database'],
                    port: sqlConfig['port']
                }
            }
        };
        const adapter = new SDocSqlMediadbAdapter(options);
        dataStore.setAdapter('http', adapter, '', {});

        return dataService;
    }

    private static createDataServiceMytbSql(backendConfig: {}, readOnly: boolean): SDocDataService {
        // configure store
        const filterConfig: SDocTeamFilterConfig = new SDocTeamFilterConfig();
        const themeFilters: any[] = JSON.parse(fs.readFileSync(backendConfig['filePathThemeFilterJson'], { encoding: 'utf8' }));
        for (const themeName in themeFilters) {
            filterConfig.set(themeName, themeFilters[themeName]);
        }
        const dataStore: SDocDataStore = new SDocDataStore(new SearchParameterUtils(), filterConfig);
        const dataService: SDocDataService = new SDocDataService(dataStore);

        // configure solr-adapter
        const sqlConfig = backendConfig['SDocSqlMytbAdapter'];
        if (sqlConfig === undefined) {
            throw new Error('config for SDocSqlMytbAdapter not exists');
        }
        const options = {
            knexOpts: {
                client: sqlConfig['client'],
                connection: {
                    host: sqlConfig['host'],
                    user: sqlConfig['user'],
                    password: sqlConfig['password'],
                    database: sqlConfig['database'],
                    port: sqlConfig['port']
                }
            }
        };
        const adapter = new SDocSqlMytbAdapter(options);
        dataStore.setAdapter('http', adapter, '', {});

        return dataService;
    }
}
