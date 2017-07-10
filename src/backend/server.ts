import cors from 'cors';
import compression from 'compression';
import express from 'express';
import {json, urlencoded} from 'body-parser';
import {SDocServerModule} from './modules/sdoc-server.module';
import {PDocServerModule} from './modules/pdoc-server.module';
import {ProxyServerModule} from './modules/proxy-server.module';

const backendConfig = {
    solrCoreSDoc: 'http://localhost:8983/solr/mytb/',
    solrCoreSDocReadUsername: 'mytbread',
    solrCoreSDocReadPassword: 'SolrRocks',
    filePathPDocJson: 'src/backend/assets/pdocs.json',
    filePathThemeFilterJson: 'src/backend/assets/themeFilterConfig.json',
    proxyUrlTracks: 'http://localhost/michas/'
};

// create server
const app = express();

// configure server
const mycors = cors();
mycors.origin = '*';
app.use(mycors);

app.use(json()); // for parsing application/json
app.use(urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(compression());

// add routes
SDocServerModule.configureRoutes(app, '/api/v1', backendConfig);
PDocServerModule.configureRoutes(app, '/api/v1', backendConfig);
ProxyServerModule.configureRoutes(app, '', backendConfig);

// start server
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

