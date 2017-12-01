import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import {join} from 'path';
import * as express from 'express';
// Express Engine
import {ngExpressEngine} from '@nguniversal/express-engine';
// Import module map for lazy loading
import {provideModuleMap} from '@nguniversal/module-map-ngfactory-loader';

export class MytbAngularModule {
    public static configureRoutes(app: express.Application, distFolder: string, distProfile: string, distServerProfile: string) {
        const indexFile = join(distFolder, distProfile, 'index.html');
        const template = '<html><body></body></html>';

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
        app.set('views', join(distFolder, ''));

        // Serve static files from /browser
        app.get('/' + distProfile + '*.*', express.static(join(distFolder, '')));

        // All regular routes use the Universal engine
        app.get('/' + distProfile + '*', (req, res) => {
            //global['navigator'] = req['headers']['user-agent'];
            angularRouter(req, res);
        });
    }
}
