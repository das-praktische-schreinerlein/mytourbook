import cors from 'cors';
import axios from 'axios';
import express from 'express';
import {mount, queryParser, Router} from 'js-data-express';
import {SDocDataStore} from './shared/sdoc-commons/services/sdoc-data.store';
import {SDocDataService} from './shared/sdoc-commons/services/sdoc-data.service';
import {SDocSolrAdapter} from './shared/sdoc-commons/services/sdoc-solr.adapter';
import {SearchParameterUtils} from './shared/search-commons/services/searchparameter.utils';
import {SDocSearchResult} from './shared/sdoc-commons/model/container/sdoc-searchresult';
import {Facet} from './shared/search-commons/model/container/facets';
let bodyParser = require('body-parser');

// create server
const app = express();
let mycors = cors();
mycors.origin = 'http://localhost:4200';
app.use(mycors);
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// configure store
const sdocDataStore: SDocDataStore = new SDocDataStore(new SearchParameterUtils());
const sdocDataService: SDocDataService = new SDocDataService(sdocDataStore);
const sdocMapper = sdocDataService.getMapper('sdoc');

// configure solr-adapter
const options = {
    basePath: 'http://localhost:8983/solr/mytb/',
    suffix: '&wt=json&indent=on&datatype=jsonp&json.wrf=JSONP_CALLBACK&callback=JSONP_CALLBACK&',
    http: axios
};
const httpAdapter = new SDocSolrAdapter(options);
sdocDataStore.setAdapter('http', httpAdapter, '', {});

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
app.use('/api/sdoc', new Router(sdocMapper, config).router);

// use own wrapper for search
app.route('/api/sdocs')
    .all(function(req, res, next) {
        // runs for all HTTP verbs first
        // think of it as route specific middleware!
        next();
    })
    .get(function(req, res, next) {
        sdocDataService.search(sdocDataService.createDefaultSearchForm()).then(
            function searchDone(sdocSearchResult: SDocSearchResult) {
                const result = {
                    'recordCount': sdocSearchResult.recordCount,
                    'searchForm': sdocSearchResult.searchForm,
                    'currentRecords': [],
                    'facets': {
                        facets: {}
                    }
                };
                for (let i = 0; i < sdocSearchResult.currentRecords.length; i++) {
                    const record = {};
                    for (const key in sdocSearchResult.currentRecords[i]) {
                        record[key] = sdocSearchResult.currentRecords[i][key];
                    }
                    record['sdocimages'] = sdocSearchResult.currentRecords[i].get('sdocimages');
                    result.currentRecords.push(record);
                }
                sdocSearchResult.facets.facets.forEach((value: Facet, key: string) => {
                    result.facets.facets[key] = sdocSearchResult.facets.facets.get(key).facet;
                });
                res.json(result);
            }
        );
    })
    .post(function(req, res, next) {
        sdocDataService.search(JSON.parse(req.body)).then(
            function searchDone(sdocSearchResult: SDocSearchResult) {
                res.json(sdocSearchResult);
            }
        );
    });

// start server
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

