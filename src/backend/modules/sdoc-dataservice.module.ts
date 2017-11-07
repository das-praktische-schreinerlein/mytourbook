import {SDocDataStore, SDocTeamFilterConfig} from '../shared/sdoc-commons/services/sdoc-data.store';
import {SearchParameterUtils} from '../shared/search-commons/services/searchparameter.utils';
import {SDocDataService} from '../shared/sdoc-commons/services/sdoc-data.service';
import {SDocSolrAdapter} from '../shared/sdoc-commons/services/sdoc-solr.adapter';
import axios from 'axios';
import * as fs from 'fs';
import {HttpAdapter} from 'js-data-http';
import {SDocSqlAdapter} from '../shared/sdoc-commons/services/sdoc-sql.adapter';

export class SDocDataServiceModule {
    private static dataServices = new Map<string, SDocDataService>();

    public static getDataService(profile: string, backendConfig: {}, readOnly: boolean): SDocDataService {
        if (!this.dataServices.has(profile)) {
            this.dataServices.set(profile, SDocDataServiceModule.createDataServiceSolr(backendConfig, readOnly));
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
        const options = {
            basePath: backendConfig['solrCoreSDoc'],
            suffix: '&wt=json&indent=on&datatype=jsonp&json.wrf=JSONP_CALLBACK&callback=JSONP_CALLBACK&',
            http: axios,
            beforeHTTP: function (config, opts) {
                config.auth = {
                    username: backendConfig['solrCoreSDocReadUsername'],
                    password: backendConfig['solrCoreSDocReadPassword']
                };

                // Now do the default behavior
                return HttpAdapter.prototype.beforeHTTP.call(this, config, opts);
            }
        };
        const adapter = new SDocSolrAdapter(options);
        dataStore.setAdapter('http', adapter, '', {});

        return dataService;
    }

    private static createDataServiceSql(backendConfig: {}, readOnly: boolean): SDocDataService {
        // configure store
        const filterConfig: SDocTeamFilterConfig = new SDocTeamFilterConfig();
        const themeFilters: any[] = JSON.parse(fs.readFileSync(backendConfig['filePathThemeFilterJson'], { encoding: 'utf8' }));
        for (const themeName in themeFilters) {
            filterConfig.set(themeName, themeFilters[themeName]);
        }
        const dataStore: SDocDataStore = new SDocDataStore(new SearchParameterUtils(), filterConfig);
        const dataService: SDocDataService = new SDocDataService(dataStore);

        // configure solr-adapter
        const options = {
            knexOpts: {
                client: 'mysql',
                connection: {
                    host: 'localhost',
                    user: 'root',
                    password: '',
                    database: 'mytb',
                    port: '3306'
                }
            }
        };
        const adapter = new SDocSqlAdapter(options);
        dataStore.setAdapter('http', adapter, '', {});


        return dataService;
    }
}
