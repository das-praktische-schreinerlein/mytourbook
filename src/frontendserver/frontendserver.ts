// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import {enableProdMode} from '@angular/core';
import * as express from 'express';
import {join} from 'path';
// Express Engine
import {ngExpressEngine} from '@nguniversal/express-engine';
// Import module map for lazy loading
import {provideModuleMap} from '@nguniversal/module-map-ngfactory-loader';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const PORT = process.env.PORT || 4002;
const DIST_FOLDER = join(process.cwd(), 'dist');

const distProfile = 'mytbdev/de/';
const distServerProfile = 'mytbdev-server/de/';
const indexFile = join(DIST_FOLDER, distProfile, 'index.html');
const template = '<html><body></body></html>';

const debug = false;
if (!debug) {
    console.debug = function() {};
    console.log = function() {};
}

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

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('../../dist/' + distServerProfile + 'main.bundle');

app.engine('html', ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [
        provideModuleMap(LAZY_MODULE_MAP)
    ]
}));

/* Server-side rendering */
function angularRouter(req, res) {
    /* Server-side rendering */
    res.render(indexFile,
        { req, res, providers: [{ provide: 'baseUrl', useValue: `${req.protocol}://${req.get('host')}/${distProfile}`}]
        }
    );
}


app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, ''));

// Serve static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, '')));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
    //global['navigator'] = req['headers']['user-agent'];
    angularRouter(req, res);
});

// Start up the Node server
app.listen(PORT, () => {
    console.log(`Node server listening on http://localhost:${PORT}`);
});
