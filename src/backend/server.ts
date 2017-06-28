import cors from 'cors';
import express from 'express';
import proxy from 'http-proxy-middleware';
import {json, urlencoded} from 'body-parser';
import {SDocServerModule} from './modules/sdoc-server.module';
import {PDocServerModule} from './modules/pdoc-server.module';

// create server
const app = express();

// configure server
const mycors = cors();
mycors.origin = '*';
app.use(mycors);

app.use(json()); // for parsing application/json
app.use(urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// add routes
SDocServerModule.configureRoutes(app, '/api/v1');
PDocServerModule.configureRoutes(app, '/api/v1');

app.use('/tracks', proxy({target: 'http://localhost/michas', changeOrigin: true}));

// start server
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

