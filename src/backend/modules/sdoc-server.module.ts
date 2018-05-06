import {SDocSearchResult} from '../shared/sdoc-commons/model/container/sdoc-searchresult';
import {SDocSearchForm, SDocSearchFormValidator} from '../shared/sdoc-commons/model/forms/sdoc-searchform';
import {SDocDataService} from '../shared/sdoc-commons/services/sdoc-data.service';
import {Router} from 'js-data-express';
import express from 'express';
import {SDocRecord} from '../shared/sdoc-commons/model/records/sdoc-record';
import {IdValidationRule} from '../shared/search-commons/model/forms/generic-validator.util';
import {Facets} from '../shared/search-commons/model/container/facets';
import {GenericSearchOptions} from '../shared/search-commons/services/generic-search.service';
import {DataCacheModule} from '../shared-node/server-commons/datacache.module';

export class SDocServerModule {
    public idValidationRule = new IdValidationRule(true);

    public static configureRoutes(app: express.Application, apiPrefix: string, dataService: SDocDataService,
                                  cache: DataCacheModule, backendConfig: {}): SDocServerModule {
        const sdocServerModule = new SDocServerModule(dataService, cache);

        // configure express
        app.param('resolveSdocBySdocId', function(req, res, next, id) {
            const idParam = (id || '');
            if (!sdocServerModule.idValidationRule.isValid(idParam)) {
                return next('not found');
            }

            const cacheKey = sdocServerModule.generateCacheKey(id);
            cache.get(cacheKey).then(value => {
                if (value !== undefined) {
                    req['sdoc'] = Object.assign(new SDocRecord(), value.details);
                    return next();
                }

                return sdocServerModule.getById(req, next, id);
            }).catch(reason => {
                return sdocServerModule.getById(req, next, id);
            });
        });

        console.log('configure route sdoc:', apiPrefix + '/:locale' + '/sdoc/:resolveSdocBySdocId');
        app.route(apiPrefix + '/:locale' + '/sdoc/:resolveSdocBySdocId')
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
                res.json(sdoc.toSerializableJsonObj(backendConfig['apiAnonymizeMedia']));
                return next();
            });

        // use own wrapper for search
        console.log('configure route sdocsearch:', apiPrefix + '/:locale/sdocsearch');
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
                    console.warn('form invalid');
                    res.json((new SDocSearchResult(searchForm, 0, [], new Facets())).toSerializableJsonObj());
                    return next();
                }
                try {
                    const searchOptions: GenericSearchOptions = {
                        showForm: req.query['showForm'] !== 'false',
                        loadTrack: req.query['loadTrack'] && req.query['loadTrack'] !== 'false',
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
                            res.json(searchResult.toSerializableJsonObj(backendConfig['apiAnonymizeMedia']));
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

        return sdocServerModule;
    }

    public constructor(private dataService: SDocDataService, private cache: DataCacheModule) {
    }

    public getById(req, next, id): Promise<SDocSearchResult> {
        const searchOptions: GenericSearchOptions = {
            showForm: false,
            loadTrack: false,
            showFacets: false
        };
        const searchForm = new SDocSearchForm({moreFilter: 'id:' + this.idValidationRule.sanitize(id)});
        const cacheKey = this.generateCacheKey(id);
        const me = this;
        return me.dataService.search(searchForm, searchOptions).then(
            function searchDone(searchResult: SDocSearchResult) {
                if (!searchResult || searchResult.recordCount !== 1) {
                    req['sdoc'] = undefined;
                    return next();
                }
                req['sdoc'] = searchResult.currentRecords[0];
                const cachedSDoc = req['sdoc'].toSerializableJsonObj();
                me.cache.set(cacheKey, {details: cachedSDoc, created: new Date().getDate(), updated: new Date().getDate()});
                return next();
            }
        ).catch(
            function searchError(error) {
                console.error('error thrown: ', error);
                return next('not found');
            }
        );
    }

    public generateCacheKey(id: any): string {
        return 'cachev1_solr_sdocId_' + id;
    }

    public getCache(): DataCacheModule {
        return this.cache;
    }

    public getDataService(): SDocDataService {
        return this.dataService;
    }

}
