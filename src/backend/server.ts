import cors from 'cors';
import compression from 'compression';
import express from 'express';
import {json, urlencoded} from 'body-parser';
import {SDocServerModule} from './modules/sdoc-server.module';
import {PDocServerModule} from './modules/pdoc-server.module';
import {ProxyServerModule} from './modules/proxy-server.module';
import * as fs from 'fs';
import {FirewallConfig, FirewallModule} from './modules/firewall.module';

const apiPrefix = '/api/v1';
const filePathConfigJson = 'config/backend.json';
const filePathFirewallConfigJson = 'config/firewall.json';
const filePathErrorDocs = './error_docs/';
const backendConfig: {} = JSON.parse(fs.readFileSync(filePathConfigJson, { encoding: 'utf8' }));
const firewallConfig: FirewallConfig = JSON.parse(fs.readFileSync(filePathFirewallConfigJson, { encoding: 'utf8' }));

// create server
const app = express();

// configure server
const mycors = cors();
mycors.origin = '*';
app.use(mycors);

app.use(json()); // for parsing application/json
app.use(urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(compression());

// add ipfilter
FirewallModule.configureFirewall(app, firewallConfig, filePathErrorDocs);

// add routes
SDocServerModule.configureRoutes(app, apiPrefix, backendConfig);
PDocServerModule.configureRoutes(app, apiPrefix, backendConfig, 'de');
PDocServerModule.configureRoutes(app, apiPrefix, backendConfig, 'en');
ProxyServerModule.configureRoutes(app, '', backendConfig);

// start server
app.listen(backendConfig['port'], function () {
    console.log('MyTB app listening on port ' + backendConfig['port']);
});

