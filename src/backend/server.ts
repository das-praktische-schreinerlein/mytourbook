import compression from 'compression';
import cors from 'cors';
import express from 'express';
import {json, urlencoded} from 'body-parser';
import {SDocServerModule} from './modules/sdoc-server.module';
import {PDocServerModule} from './modules/pdoc-server.module';
import {ProxyServerModule} from './modules/proxy-server.module';

// create server
const app = express();

// configure server
const mycors = cors();
mycors.origin = '*';
app.use(mycors);

app.use(json()); // for parsing application/json
app.use(urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//app.use(compression);

// add routes
SDocServerModule.configureRoutes(app, '/api/v1');
PDocServerModule.configureRoutes(app, '/api/v1');
ProxyServerModule.configureRoutes(app, '');

// start server
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

