import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import {join} from 'path';
import * as express from 'express';
// Express Engine
import {ngExpressEngine} from '@nguniversal/express-engine';
// Import module map for lazy loading
import {provideModuleMap} from '@nguniversal/module-map-ngfactory-loader';
import * as fs from 'fs';
import {CacheModeType, SimpleFrontendServerModule, ServerModuleConfig} from './simple-frontend-server.module';
import {LogUtils} from '@dps/mycms-commons/dist/commons/utils/log.utils';

export class AngularUniversalFrontendServerModule extends SimpleFrontendServerModule {
    public static configureDefaultServer(app: express.Application, config: ServerModuleConfig) {
        const mytbAngularModule = new AngularUniversalFrontendServerModule(app, config);
        if (config.cacheMode === CacheModeType.USE_CACHE) {
            mytbAngularModule.configureGlobals();
            mytbAngularModule.configureViewEngine();
        }
        mytbAngularModule.configureStaticFileRoutes();
        mytbAngularModule.configureServerRoutes();
    }

    public constructor(protected app: express.Application, protected config: ServerModuleConfig) {
        super(app, config);
    }

    public configureGlobals(): void {
        const template = '<html><body></body></html>';

        // simulate browser
        const domino = require('domino');
        const win: Window = domino.createWindow(template);
        global['window'] = win;
        Object.defineProperty(win.document, 'referrer', {get : function() { return 'https://www.michas-ausflugstipps.de'; }});
        global['document'] = win.document;
        global['navigator'] = { userAgent: 'chrome', product: 'ReactNative', platform: 'Win'};
        global['window']['devicePixelRatio'] = 1;
        global['self'] = global['window'];

        // import dependencies
        global['L'] = require('leaflet');
    }

    public configureViewEngine(): void {
        // * NOTE :: leave this as require() since this file is built Dynamically from webpack
        const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('../../dist/' + this.config.distServerProfile + 'main.bundle');

        this.app.engine('html', ngExpressEngine({
            bootstrap: AppServerModuleNgFactory,
            providers: [
                provideModuleMap(LAZY_MODULE_MAP)
            ]
        }));

        this.app.set('view engine', 'html');
        this.app.set('views', join(this.config.staticFolder, ''));
    }

    protected handleNotCachedRoute(req, res): any {
        if (this.config.cacheMode === CacheModeType.USE_CACHE) {
            // NOT CACHED but use cache
            console.log('not cached but cache:', req.url);
            return this.renderAngularRoute(req, res);
        } else {
            // NOT CACHED but use CACHED_ONLY
            return this.sendIndex(req, res);
        }
    }

    private renderAngularRoute(req, res): any {
        /* Server-side rendering */
        const me = this;
        //global['navigator'] = req['headers']['user-agent'];
        return res.render(this.indexFile,
            { req, res, providers: [{ provide: 'baseUrl', useValue: `${req.protocol}://${req.get('host')}/${this.config.distProfile}`}]
            }, (err, html) => {
                if (me.config.cacheMode !== CacheModeType.NO_CACHE) {
                    res.status(201).send(html);
                    if (err) {
                        console.error('error while getting url:' + LogUtils.sanitizeLogMsg(res.url), err);
                        return;
                    }

                    const filename = me.getCacheFilename(req.url);
                    fs.writeFileSync(filename, html);
                    return;
                }

                res.status(200).send(html);
                if (err) {
                    console.error('error while getting url:' + LogUtils.sanitizeLogMsg(res.url), err);
                    return;
                }
            }
        );
    }
}
