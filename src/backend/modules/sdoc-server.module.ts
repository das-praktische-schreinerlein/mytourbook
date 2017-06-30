import {SDocSearchResult} from '../shared/sdoc-commons/model/container/sdoc-searchresult';
import {SDocSearchForm} from '../shared/sdoc-commons/model/forms/sdoc-searchform';
import {SDocDataStore, SDocTeamFilterConfig} from '../shared/sdoc-commons/services/sdoc-data.store';
import {SearchParameterUtils} from '../shared/search-commons/services/searchparameter.utils';
import {SDocDataService} from '../shared/sdoc-commons/services/sdoc-data.service';
import {SDocSolrAdapter} from '../shared/sdoc-commons/services/sdoc-solr.adapter';
import {Router} from 'js-data-express';
import axios from 'axios';
import express from 'express';
import * as fs from 'fs';

export class SDocServerModule {
    public static configureRoutes(app: express.Application, apiPrefix: string, backendConfig: {}) {
        // configure store
        const filterConfig: SDocTeamFilterConfig = new SDocTeamFilterConfig();
        const themeFilters: any[] = JSON.parse(fs.readFileSync(backendConfig['filePathThemeFilterJson'], { encoding: 'utf8' }));
        for (const themeName in themeFilters) {
            filterConfig.set(themeName, themeFilters[themeName]);
        }
        const dataStore: SDocDataStore = new SDocDataStore(new SearchParameterUtils(), filterConfig);
        const dataService: SDocDataService = new SDocDataService(dataStore);
        const mapper = dataService.getMapper('sdoc');

        // configure solr-adapter
        const options = {
            basePath: backendConfig['solrCoreSDoc'],
            suffix: '&wt=json&indent=on&datatype=jsonp&json.wrf=JSONP_CALLBACK&callback=JSONP_CALLBACK&',
            http: axios
        };
        const adapter = new SDocSolrAdapter(options);
        dataStore.setAdapter('http', adapter, '', {});

        // configure express
        const config = {
            request: (req, res, next) => {
                const userLoggedIn = true;

                if (userLoggedIn) {
                    next();
                } else {
                    res.sendStatus(403);
                }
            }
        };
        app.use(apiPrefix + '/sdoc', new Router(mapper, config).router);

        // use own wrapper for search
        app.route(apiPrefix + '/sdocsearch')
            .all(function(req, res, next) {
                // runs for all HTTP verbs first
                // think of it as route specific middleware!
                next();
            })
            .get(function(req, res, next) {
                const searchForm = new SDocSearchForm(req.query);
                try {
                    dataService.search(searchForm).then(
                        function searchDone(searchResult: SDocSearchResult) {
                            res.json(searchResult.toSerializableJsonObj());
                        }
                    ).catch(
                        function searchError(error) {
                            console.error('error thrown: ', error);
                            res.sendStatus(500);
                        }
                    );
                } catch (error) {
                    console.error('error thrown: ', error);
                    res.sendStatus(500);
                }
            })
            .post(function(req, res, next) {
                // TODO: Test it - untested
                const searchForm = JSON.parse(req.body);
                try {
                    dataService.search(searchForm).then(
                        function searchDone(searchResult: SDocSearchResult) {
                            res.json(searchResult.toSerializableJsonObj());
                        }
                    ).catch(
                        function searchError(error) {
                            console.error('error thrown: ', error);
                            res.sendStatus(500);
                        }
                    );
                } catch (error) {
                    console.error('error thrown: ', error);
                    res.sendStatus(500);
                }
            });
    }
}
