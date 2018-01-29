import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import {join} from 'path';
import * as express from 'express';
// Express Engine
import {ngExpressEngine} from '@nguniversal/express-engine';
// Import module map for lazy loading
import {provideModuleMap} from '@nguniversal/module-map-ngfactory-loader';
import * as fs from 'fs';

export enum CacheModeType {
    NO_CACHE, USE_CACHE, CACHED_ONLY
}

export interface UniversalModuleConfig {
    distFolder: string;
    distServerProfile: string;
    distProfile: string;
    cacheFolder: string;
    cacheMode: CacheModeType;
}

export class MytbAngularUniversalModule {
    private indexFile: string;

    public static configureDefaultServer(app: express.Application, config: UniversalModuleConfig) {
        const mytbAngularModule = new MytbAngularUniversalModule(app, config);
        mytbAngularModule.configureGlobals();
        mytbAngularModule.configureViewEngine();
        mytbAngularModule.configureStaticFileRoutes();
        mytbAngularModule.configureAllAsAngularUniversalRoutes();
    }

    public constructor(private app: express.Application, private config: UniversalModuleConfig) {
        this.indexFile = join(this.config.distFolder, this.config.distProfile, 'index.html');
    }

    public configureGlobals(): void {
        const template = '<html><body></body></html>';

        // simulate browser
        const domino = require('domino');
        const win = domino.createWindow(template);
        global['window'] = win;
        Object.defineProperty(win.document, 'referrer', {get : function(){ return "https://www.michas-ausflugstipps.de"; }});
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
        this.app.set('views', join(this.config.distFolder, ''));
    }

    public configureStaticFileRoutes(): void {
        // Serve static files from /browser
        this.app.get('/' + this.config.distProfile + '*.*', express.static(join(this.config.distFolder, '')));
    }

    public configureAllAsAngularUniversalRoutes(): void {
        const me = this;

        // All regular routes use the Universal engine
        this.app.get('/' + this.config.distProfile + '*', (req, res) => {
            if (me.config.cacheMode === CacheModeType.NO_CACHE) {
                res.status(200);
                res.sendFile(me.indexFile);
                return;
            } else {
                const filename = me.getCacheFilename(req.url);
                fs.exists(filename, function (exists: boolean) {
                    if (exists) {
                        // CACHED: use cached file
                        res.status(200);
                        res.sendFile(filename, {root: '.'});
                        return;
                    } else if (me.config.cacheMode === CacheModeType.CACHED_ONLY) {
                        // NOT CACHED but use CACHED_ONLY
                        res.status(200);
                        res.sendFile(me.indexFile);
                        return;
                    } else {
                        // NOT CACHED but use cache
                        console.error("not cached but cache:", req.url);
                        me.angularRouter(req, res);
                        return;
                    }
                });
            }
        });
    }

    private angularRouter(req, res): any {
        /* Server-side rendering */
        const me = this;
        //global['navigator'] = req['headers']['user-agent'];
        res.render(this.indexFile,
            { req, res, providers: [{ provide: 'baseUrl', useValue: `${req.protocol}://${req.get('host')}/${this.config.distProfile}`}]
            }, (err, html) => {
                res.status(200).send(html);
                if (err) {
                    console.error('error while getting url:' + res.url, err);
                    return;
                }

                if (me.config.cacheMode !== CacheModeType.NO_CACHE) {
                    const filename = me.getCacheFilename(req.url);
                    fs.writeFileSync(filename, html);
                }
            }
        );
    }

    private getCacheFilename(url: string): string {
        return this.config.cacheFolder + this.createCacheFilename(url);
    }

    private createCacheFilename(url: string): string {
        return url.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '-'
            + require('crypto').createHash('md5').update(url).digest('hex')
            + '.html';
    }
}
