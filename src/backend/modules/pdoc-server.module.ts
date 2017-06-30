import {PDocSearchResult} from '../shared/pdoc-commons/model/container/pdoc-searchresult';
import {PDocSearchForm} from '../shared/pdoc-commons/model/forms/pdoc-searchform';
import {PDocDataStore} from '../shared/pdoc-commons/services/pdoc-data.store';
import {SearchParameterUtils} from '../shared/search-commons/services/searchparameter.utils';
import {PDocDataService} from '../shared/pdoc-commons/services/pdoc-data.service';
import {PDocInMemoryAdapter} from '../shared/pdoc-commons/services/pdoc-inmemory.adapter';
import {PDocRecord} from '../shared/pdoc-commons/model/records/pdoc-record';
import {arser, Router} from 'js-data-express';
import express from 'express';
import * as fs from 'fs';

export class PDocServerModule {
    public static configureRoutes(app: express.Application, apiPrefix: string, backendConfig: {}) {
        // configure store
        const dataStore: PDocDataStore = new PDocDataStore(new SearchParameterUtils());
        const dataService: PDocDataService = new PDocDataService(dataStore);
        const mapper = dataService.getMapper('pdoc');

        const docs: any[] = JSON.parse(fs.readFileSync(backendConfig['filePathPDocJson'], { encoding: 'utf8' })).pdocs;
        dataService.addMany(docs).then(function doneAddMany(records: PDocRecord[]) {
                console.log('loaded pdocs from assets', records);
            },
            function errorCreate(reason: any) {
                console.error('loading pdocs failed:' + reason);
            }
        );

        // configure dummy-adapter
        const options = {};
        const adapter = new PDocInMemoryAdapter(options);
        dataStore.setAdapter('inmemory', adapter, '', {});

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
        app.use(apiPrefix + '/pdoc', new Router(mapper, config).router);

        // use own wrapper for search
        app.route(apiPrefix + '/pdocsearch')
            .all(function(req, res, next) {
                // runs for all HTTP verbs first
                // think of it as route specific middleware!
                next();
            })
            .get(function(req, res, next) {
                const searchForm = new PDocSearchForm(req.query);
                try {
                    dataService.search(searchForm).then(
                        function searchDone(searchResult: PDocSearchResult) {
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
                        function searchDone(searchResult: PDocSearchResult) {
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
