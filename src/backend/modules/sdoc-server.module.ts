import {SDocSearchResult} from '../shared/sdoc-commons/model/container/sdoc-searchresult';
import {SDocSearchForm, SDocSearchFormValidator} from '../shared/sdoc-commons/model/forms/sdoc-searchform';
import {SDocDataStore, SDocTeamFilterConfig} from '../shared/sdoc-commons/services/sdoc-data.store';
import {SearchParameterUtils} from '../shared/search-commons/services/searchparameter.utils';
import {SDocDataService} from '../shared/sdoc-commons/services/sdoc-data.service';
import {SDocSolrAdapter} from '../shared/sdoc-commons/services/sdoc-solr.adapter';
import {Router} from 'js-data-express';
import axios from 'axios';
import express from 'express';
import * as fs from 'fs';
import {SDocRecord} from '../shared/sdoc-commons/model/records/sdoc-record';
import {IdValidationRule} from '../shared/search-commons/model/forms/generic-validator.util';
import {Facets} from '../shared/search-commons/model/container/facets';
import {HttpAdapter} from 'js-data-http';
import {GenericSearchOptions} from '../shared/search-commons/services/generic-search.service';

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

        // configure express
        const idValidationRule = new IdValidationRule(true);
        app.param('id', function(req, res, next, id) {
            const idParam = (id || '');
            if (!idValidationRule.isValid(idParam)) {
                return next('not found');
            }
            const searchForm = new SDocSearchForm({moreFilter: 'id:' + idValidationRule.sanitize(idParam)});
            dataService.search(searchForm).then(
                function searchDone(searchResult: SDocSearchResult) {
                    if (!searchResult || searchResult.recordCount !== 1) {
                        req['sdoc'] = undefined;
                        return next();
                    }
                    req['sdoc'] = searchResult.currentRecords[0];
                    return next();
                }
            ).catch(
                function searchError(error) {
                    console.error('error thrown: ', error);
                    return next('not found');
                }
            );
        });

        app.route(apiPrefix + '/:locale' + '/sdoc/:id')
            .all(function(req, res, next) {
                if (req.method !== 'GET') {
                    return next('not allowed');
                }
                return next();
            })
            .get(function(req, res, next) {
                const sdoc: SDocRecord = req['sdoc'];
                if (sdoc === undefined) {
                    res.json();
                    return next();
                }
                res.json(sdoc.toSerializableJsonObj());
                return next();
            });

        // use own wrapper for search
        app.route(apiPrefix + '/:locale/sdocsearch')
            .all(function(req, res, next) {
                if (req.method !== 'GET') {
                    return next('not allowed');
                }
                return next();
            })
            .get(function(req, res, next) {
                const searchForm = new SDocSearchForm(req.query);
                if (!SDocSearchFormValidator.isValid(searchForm)) {
                    console.error('form invalid:', searchForm);
                    res.json((new SDocSearchResult(searchForm, 0, [], new Facets())).toSerializableJsonObj());
                    return next();
                }
                try {
                    const searchOptions: GenericSearchOptions = {
                        showForm: req.query['showForm'] !== 'false',
                        loadTrack: req.query['loadTrack'] !== 'true',
                        showFacets: true
                    };
                    if (req.query['showFacets'] === 'false') {
                        searchOptions.showFacets = false;
                    } else if (req.query['showFacets'] === 'true') {
                        searchOptions.showFacets = true;
                    } else if (req.query['showFacets'] !== undefined) {
                        searchOptions.showFacets = req.query['showFacets'].toString().split(',');
                    }

                    dataService.search(searchForm, searchOptions).then(
                        function searchDone(searchResult: SDocSearchResult) {
                            if (searchOptions.showForm === false) {
                                searchResult.searchForm = new SDocSearchForm({});
                            }
                            if (searchOptions.showFacets === false) {
                                searchResult.facets = new Facets();
                            }
                            res.json(searchResult.toSerializableJsonObj());
                            return next();
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
