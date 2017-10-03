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
import marked from 'marked';
import htmlToText from 'html-to-text';

export class PDocServerModule {
    public static configureRoutes(app: express.Application, apiPrefix: string, backendConfig: {}, locale: string) {
        // configure store
        const dataStore: PDocDataStore = new PDocDataStore(new SearchParameterUtils());
        const dataService: PDocDataService = new PDocDataService(dataStore);
        const mapper = dataService.getMapper('pdoc');
        marked.setOptions({
            gfm: true,
            tables: true,
            breaks: true,
            pedantic: false,
            sanitize: true,
            smartLists: true,
            smartypants: true
        });

        const fileName = backendConfig['filePathPDocJson'].replace('.json', '-' + locale + '.json');
        const docs: any[] = JSON.parse(fs.readFileSync(fileName, { encoding: 'utf8' })).pdocs;
        for (const doc of docs) {
            if (!doc['descHtml']) {
                doc['descHtml'] = marked(doc['descMd']);
            }
            if (!doc['descTxt']) {
                doc['descTxt'] = htmlToText.fromString(doc['descHtml'], {
                    wordwrap: 80
                });
            }
        }
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
                if (req.method !== 'GET') {
                    return next('not allowed');
                }
                return next();
            }
        };
        app.use(apiPrefix + '/' + locale + '/pdoc', new Router(mapper, config).router);

        // use own wrapper for search
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
