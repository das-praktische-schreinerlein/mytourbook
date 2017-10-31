import {SDocSearchResult} from '../shared/sdoc-commons/model/container/sdoc-searchresult';
import {SDocSearchForm, SDocSearchFormValidator} from '../shared/sdoc-commons/model/forms/sdoc-searchform';
import {SDocDataService} from '../shared/sdoc-commons/services/sdoc-data.service';
import {Router} from 'js-data-express';
import express from 'express';
import {SDocRecord} from '../shared/sdoc-commons/model/records/sdoc-record';
import {IdValidationRule} from '../shared/search-commons/model/forms/generic-validator.util';
import {Facets} from '../shared/search-commons/model/container/facets';
import {GenericSearchOptions} from '../shared/search-commons/services/generic-search.service';

export class SDocServerModule {
    public static configureRoutes(app: express.Application, apiPrefix: string, dataService: SDocDataService, readOnly: boolean) {
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
