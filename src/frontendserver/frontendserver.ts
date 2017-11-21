// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { enableProdMode } from '@angular/core';
import * as express from 'express';
import { join } from 'path';
import { readFileSync } from 'fs';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist');

// Our index.html we'll use as our template
const template = readFileSync(join(DIST_FOLDER, 'mytbdev/de', 'index.html')).toString();

// simulate browser
const domino = require('domino');
const win = domino.createWindow(template);
global['window'] = win;
global['document'] = win.document;
global['navigator'] = { userAgent: 'chrome', product: 'ReactNative', platform: 'Win'};
global['window']['devicePixelRatio'] = 1;
global['self'] = global['window'];

// import dependencies
global['L'] = require('leaflet');

// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('../../dist/mytbdev-server/de/main.bundle');

app.engine('html', ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [
        provideModuleMap(LAZY_MODULE_MAP)
    ]
}));


app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, ''));

// Serve static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, '')));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
    //global['navigator'] = req['headers']['user-agent'];
    res.render(join(DIST_FOLDER, 'mytbdev/de', 'index.html'), { req });
});

// Start up the Node server
app.listen(PORT, () => {
    console.log(`Node server listening on http://localhost:${PORT}`);
});
