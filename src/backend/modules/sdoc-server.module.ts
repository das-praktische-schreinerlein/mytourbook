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
import {SDocRecord} from '../shared/sdoc-commons/model/records/sdoc-record';

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

        // configure solr-adapter
        const options = {
            basePath: backendConfig['solrCoreSDoc'],
            suffix: '&wt=json&indent=on&datatype=jsonp&json.wrf=JSONP_CALLBACK&callback=JSONP_CALLBACK&',
            http: axios
        };
        const adapter = new SDocSolrAdapter(options);
        dataStore.setAdapter('http', adapter, '', {});

        // configure express
        app.param('id', function(req, res, next, id) {
            const idParam = (id || '');
            if (idParam.search(/[^a-zA-Z0-9_]/) >= 0) {
                return next('not found');
            }
            const searchForm = new SDocSearchForm({moreFilter: 'id:' + idParam});
            dataService.search(searchForm).then(
                function searchDone(searchResult: SDocSearchResult) {
                    if (!searchResult || searchResult.recordCount !== 1) {
                        return next('not found');
                    }
                    req['sdoc'] = searchResult.currentRecords[0];
                    next();
                }
            ).catch(
                function searchError(error) {
                    console.error('error thrown: ', error);
                    return next('not found');
                }
            );
        });

        app.route(apiPrefix + '/sdoc/:id')
            .all(function(req, res, next) {
                if (req.method !== 'GET') {
                    next('not allowed');
                }
                next();
            })
            .get(function(req, res, next) {
                const sdoc: SDocRecord = req['sdoc'];
                res.json(sdoc.toSerializableJsonObj());
                next();
            });

        // use own wrapper for search
        app.route(apiPrefix + '/sdocsearch')
            .all(function(req, res, next) {
                if (req.method !== 'GET') {
                    next('not allowed');
                }
                next();
            })
            .get(function(req, res, next) {
                const searchForm = new SDocSearchForm(req.query);
                try {
                    dataService.search(searchForm).then(
                        function searchDone(searchResult: SDocSearchResult) {
                            res.json(searchResult.toSerializableJsonObj());
                            next();
                        }
                    ).catch(
                        function searchError(error) {
                            console.error('error thrown: ', error);
                            return next('not found');
                        }
                    );
                } catch (error) {
                    console.error('error thrown: ', error);
                    return next('not found');
                }
            });
    }
}
