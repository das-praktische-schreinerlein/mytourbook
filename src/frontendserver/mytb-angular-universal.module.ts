import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import {join} from 'path';
import * as express from 'express';
// Express Engine
import {ngExpressEngine} from '@nguniversal/express-engine';
// Import module map for lazy loading
import {provideModuleMap} from '@nguniversal/module-map-ngfactory-loader';

export class MytbAngularUniversalModule {
    private indexFile: string;

    public static configureDefaultServer(app: express.Application, distFolder: string, distServerProfile: string, distProfile: string) {
        const mytbAngularModule = new MytbAngularUniversalModule(app, distFolder, distServerProfile, distProfile);
        mytbAngularModule.configureGlobals();
        mytbAngularModule.configureViewEngine();
        mytbAngularModule.configureStaticFileRoutes();
        mytbAngularModule.configureAllAsAngularUniversalRoutes();
    }

    public constructor(private app: express.Application, private distFolder: string, private distServerProfile: string,
                       private distProfile: string) {
        this.indexFile = join(this.distFolder, this.distProfile, 'index.html');
    }

    public configureGlobals(): void {
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
    }

    public configureViewEngine(): void {
        // * NOTE :: leave this as require() since this file is built Dynamically from webpack
        const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('../../dist/' + this.distServerProfile + 'main.bundle');

        this.app.engine('html', ngExpressEngine({
            bootstrap: AppServerModuleNgFactory,
            providers: [
                provideModuleMap(LAZY_MODULE_MAP)
            ]
        }));

        this.app.set('view engine', 'html');
        this.app.set('views', join(this.distFolder, ''));
    }

    public configureStaticFileRoutes(): void {
        // Serve static files from /browser
        this.app.get('/' + this.distProfile + '*.*', express.static(join(this.distFolder, '')));
    }

    public configureAllAsAngularUniversalRoutes(): void {
        const me = this;

        // All regular routes use the Universal engine
        this.app.get('/' + this.distProfile + '*', (req, res) => {
            //global['navigator'] = req['headers']['user-agent'];
            me.angularRouter(req, res);
        });
    }

    private angularRouter(req, res): any {
        /* Server-side rendering */
        res.render(this.indexFile,
            { req, res, providers: [{ provide: 'baseUrl', useValue: `${req.protocol}://${req.get('host')}/${this.distProfile}`}]
            }
        );
    }
}
