import {PDocSearchResult} from '../shared/pdoc-commons/model/container/pdoc-searchresult';
import {PDocSearchForm} from '../shared/pdoc-commons/model/forms/pdoc-searchform';
import {PDocDataStore} from '../shared/pdoc-commons/services/pdoc-data.store';
import {SearchParameterUtils} from '../shared/search-commons/services/searchparameter.utils';
import {PDocDataService} from '../shared/pdoc-commons/services/pdoc-data.service';
import {mount, queryParser, Router} from 'js-data-express';
import {PDocRecord} from '../shared/pdoc-commons/model/records/pdoc-record';
import express from 'express';
import * as fs from 'fs';

export class PDocServerModule {
    public static configureRoutes(app: express.Application, apiPrefix: string) {
        // configure store
        const pdocDataStore: PDocDataStore = new PDocDataStore(new SearchParameterUtils());
        const pdocDataService: PDocDataService = new PDocDataService(pdocDataStore);
        const pdocMapper = pdocDataService.getMapper('pdoc');

        const pdocs: any[] = JSON.parse(fs.readFileSync('src/backend/assets/pdocs.json', { encoding: 'utf8' })).pdocs;
        pdocDataService.addMany(pdocs).then(function doneAddMany(pdocsRecords: PDocRecord[]) {
                console.log('loaded pdocs from assets', pdocsRecords);
            },
            function errorCreate(reason: any) {
                console.error('loading appdata failed:' + reason);
            }
        );

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
        app.use(apiPrefix + '/pdoc', new Router(pdocMapper, config).router);

        // use own wrapper for search
        app.route(apiPrefix + '/pdocsearch')
            .all(function(req, res, next) {
                // runs for all HTTP verbs first
                // think of it as route specific middleware!
                next();
            })
            .get(function(req, res, next) {
                const searchForm = new PDocSearchForm(req.query);
                pdocDataService.search(searchForm).then(
                    function searchDone(pdocSearchResult: PDocSearchResult) {
                        res.json(pdocSearchResult.toSerializableJsonObj());
                    }
                );
            })
            .post(function(req, res, next) {
                // TODO: Test it - untested
                pdocDataService.search(JSON.parse(req.body)).then(
                    function searchDone(pdocSearchResult: PDocSearchResult) {
                        res.json(pdocSearchResult.toSerializableJsonObj());
                    }
                );
            });
    }
}
