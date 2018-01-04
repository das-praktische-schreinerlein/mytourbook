import {SDocDataStore, SDocTeamFilterConfig} from '../shared/sdoc-commons/services/sdoc-data.store';
import {SearchParameterUtils} from '../shared/search-commons/services/searchparameter.utils';
import {SDocDataService} from '../shared/sdoc-commons/services/sdoc-data.service';
import {SDocSolrAdapter} from '../shared/sdoc-commons/services/sdoc-solr.adapter';
import axios from 'axios';
import * as fs from 'fs';
import {HttpAdapter} from 'js-data-http';
import {SDocSqlMediadbAdapter} from '../shared/sdoc-commons/services/sdoc-sql-mediadb.adapter';
import {SDocSqlMytbAdapter} from '../shared/sdoc-commons/services/sdoc-sql-mytb.adapter';
import {SDocItemsJsAdapter} from '../shared/sdoc-commons/services/sdoc-itemsjs.adapter';
import {IdValidationRule} from '../shared/search-commons/model/forms/generic-validator.util';

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
                case 'SDocItemsJsAdapter':
                    this.dataServices.set(profile, SDocDataServiceModule.createDataServiceItemsJs(backendConfig, readOnly));
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

        // configure adapter
        const sqlConfig = backendConfig['SDocSqlMediadbAdapter'];
        if (sqlConfig === undefined) {
            throw new Error('config for SDocSqlMediadbAdapter not exists');
        }
        const options = {
            knexOpts: {
                client: sqlConfig['client'],
                connection: sqlConfig['connection']
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

        // configure adapter
        const sqlConfig = backendConfig['SDocSqlMytbAdapter'];
        if (sqlConfig === undefined) {
            throw new Error('config for SDocSqlMytbAdapter not exists');
        }
        const options = {
            knexOpts: {
                client: sqlConfig['client'],
                connection: sqlConfig['connection']
            }
        };
        const adapter = new SDocSqlMytbAdapter(options);
        dataStore.setAdapter('http', adapter, '', {});

        return dataService;
    }

    private static createDataServiceItemsJs(backendConfig: {}, readOnly: boolean): SDocDataService {
        // configure store
        const filterConfig: SDocTeamFilterConfig = new SDocTeamFilterConfig();
        const themeFilters: any[] = JSON.parse(fs.readFileSync(backendConfig['filePathThemeFilterJson'], { encoding: 'utf8' }));
        for (const themeName in themeFilters) {
            filterConfig.set(themeName, themeFilters[themeName]);
        }
        const dataStore: SDocDataStore = new SDocDataStore(new SearchParameterUtils(), filterConfig);
        const dataService: SDocDataService = new SDocDataService(dataStore);

        // configure adapter
        const itemsJsConfig = backendConfig['SDocItemsJsAdapter'];
        if (itemsJsConfig === undefined) {
            throw new Error('config for SDocItemsJsAdapter not exists');
        }
        const data = JSON.parse(fs.readFileSync(itemsJsConfig['dataFile'], { encoding: 'utf8' }));
        const records = [];
        const idValidator = new IdValidationRule(true);
        const mapping = {
            // facets
            rate_pers_ausdauer_is: 'rate_pers_ausdauer_i',
            rate_pers_bildung_is: 'rate_pers_bildung_i',
            rate_pers_gesamt_is: 'rate_pers_gesamt_i',
            rate_pers_kraft_is: 'rate_pers_kraft_i',
            rate_pers_mental_is: 'rate_pers_mental_i',
            rate_pers_motive_is: 'rate_pers_motive_i',
            rate_pers_schwierigkeit_is: 'rate_pers_schwierigkeit_i',
            rate_pers_wichtigkeit_is: 'rate_pers_wichtigkeit_i',
            loc_lochirarchie_txt: 'loc_lochirarchie_s',
            track_id_is: 'track_id_i',
            route_id_is: 'route_id_i',
            loc_id_is: 'loc_id_i',
            trip_id_is: 'trip_id_i',
            news_id_is: 'news_id_i'
        };
        data.forEach(record => {
            for (const fieldName in mapping) {
                record[fieldName] = record[mapping[fieldName]];
            }
            record['id'] = idValidator.sanitize(record['id'] + '');

            // clean keywords
            record['keywords_txt'] = (record['keywords_txt'] !== undefined ?
                record['keywords_txt'].replace(/^,/g, '').replace(/,$/g, '').replace(/,,/g, ',') : '');

            // calc facets
            record['data_tech_alt_asc_facet_is'] = Math.ceil(Number.parseFloat(record['data_tech_alt_asc_i']) / 500) * 500 + '';
            record['data_tech_alt_max_facet_is'] = Math.ceil(Number.parseFloat(record['data_tech_alt_max_i']) / 500) * 500 + '';
            record['data_tech_dist_facets_fs'] = Math.ceil(Number.parseFloat(record['data_tech_dist_f']) / 5) * 5 + '';
            record['data_tech_dur_facet_fs'] = Math.ceil(Number.parseFloat(record['data_tech_dur_f']) / 2) * 2 + '';
            records.push(record);
        });

        const adapter = new SDocItemsJsAdapter({}, records);
        dataStore.setAdapter('http', adapter, '', {});

        return dataService;
    }
}
