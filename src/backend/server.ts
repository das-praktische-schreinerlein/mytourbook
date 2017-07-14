import cors from 'cors';
import compression from 'compression';
import express from 'express';
import {json, urlencoded} from 'body-parser';
import {SDocServerModule} from './modules/sdoc-server.module';
import {PDocServerModule} from './modules/pdoc-server.module';
import {ProxyServerModule} from './modules/proxy-server.module';
import * as fs from 'fs';

const filePathConfigJson = 'config/backend.json';
const backendConfig: {} = JSON.parse(fs.readFileSync(filePathConfigJson, { encoding: 'utf8' }));

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
app.listen(backendConfig['port'], function () {
    console.log('MyTB app listening on port ' + backendConfig['port']);
});

