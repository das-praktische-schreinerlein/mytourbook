import {PDocSearchResult} from '@dps/mycms-commons/dist/pdoc-commons/model/container/pdoc-searchresult';
import {PDocSearchForm} from '@dps/mycms-commons/dist/pdoc-commons/model/forms/pdoc-searchform';
import {PDocDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.service';
import {Router} from 'js-data-express';
import express from 'express';

export class PDocServerModule {
    public static configureRoutes(app: express.Application, apiPrefix: string, dataService: PDocDataService, locale: string) {
        const mapper = dataService.getMapper('pdoc');

        // configure express
        const config = {
            request: (req, res, next) => {
                if (req.method !== 'GET') {
                    return next('not allowed');
                }
                return next();
            }
        };
        console.log('configure route pdoc:', apiPrefix + '/' + locale + '/pdoc');
        app.use(apiPrefix + '/' + locale + '/pdoc', new Router(mapper, config).router);

        // use own wrapper for search
        console.log('configure route pdocsearch:', apiPrefix + '/' + locale + '/pdocsearch');
        app.route(apiPrefix + '/' + locale + '/pdocsearch')
            .all(function(req, res, next) {
                if (req.method !== 'GET') {
                    return next('not allowed');
                }
                return next();
            })
            .get(function(req, res, next) {
                const searchForm = new PDocSearchForm(req.query);
                try {
                    dataService.search(searchForm).then(
                        function searchDone(searchResult: PDocSearchResult) {
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
