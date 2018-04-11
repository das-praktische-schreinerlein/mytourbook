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
    redirectFileJson?: string;
    redirectOnlyCached?: boolean;
}

export class MytbAngularUniversalModule {
    private indexFile: string;
    private redirects = {};

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
        Object.defineProperty(win.document, 'referrer', {get : function(){ return 'https://www.michas-ausflugstipps.de'; }});
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

        if (me.config.redirectFileJson) {
            console.log('configure redirects from file', me.config.redirectFileJson);
            me.redirects = JSON.parse(fs.readFileSync(me.config.redirectFileJson, {encoding: 'utf8'}));
            console.log('configure redirects', this.redirects);
        }
        me.redirects = me.redirects || {};

        // All regular routes use the Universal engine
        this.app.get('/' + this.config.distProfile + '*', (req, res) => {
            if (me.config.cacheMode === CacheModeType.NO_CACHE) {
                res.status(200);
                res.sendFile(me.indexFile);
                return;
            } else {
                const filename = me.getCacheFilename(req.url);
                let notCachedAndNoRedirect = function () {
                    if (me.config.cacheMode === CacheModeType.CACHED_ONLY) {
                        // NOT CACHED but use CACHED_ONLY
                        res.status(200);
                        res.sendFile(me.indexFile);
                        return;
                    } else {
                        // NOT CACHED but use cache
                        console.log('not cached but cache:', req.url);
                        me.angularRouter(req, res);
                        return;
                    }
                };

                fs.exists(filename, function (exists: boolean) {
                    if (exists) {
                        // CACHED: use cached file
                        res.status(200);
                        res.sendFile(filename, {root: '.'});
                        notCachedAndNoRedirect = null;
                        return;
                    }

                    const fullUrl = `${req.protocol}://${req.get('host')}` + req.url;
                    const redirectUrl = me.redirects[fullUrl] || me.redirects[req.url];
                    if (redirectUrl) {
                        if (!me.config.redirectOnlyCached) {
                            console.log('redirect:' + req.url, redirectUrl);
                            res.redirect(redirectUrl);
                            notCachedAndNoRedirect = null;
                            return;
                        }

                        const redirectFile = redirectUrl.replace(`${req.protocol}://${req.get('host')}`, '');
                        fs.exists(me.getCacheFilename(redirectFile), function (redirectExists: boolean) {
                            if (redirectExists) {
                                // CACHED: use cached file
                                console.log('redirect cache exists:' + req.url, redirectUrl);
                                res.redirect(redirectUrl);
                                notCachedAndNoRedirect = null;
                                return;
                            }

                            notCachedAndNoRedirect();
                            notCachedAndNoRedirect = null;
                            return null;
                        });
                    } else {
                        notCachedAndNoRedirect();
                        notCachedAndNoRedirect = null;
                        return null;
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
                if (me.config.cacheMode !== CacheModeType.NO_CACHE) {
                    res.status(201).send(html);
                    if (err) {
                        console.error('error while getting url:' + res.url, err);
                        return;
                    }

                    const filename = me.getCacheFilename(req.url);
                    fs.writeFileSync(filename, html);
                    return;
                }

                res.status(200).send(html);
                if (err) {
                    console.error('error while getting url:' + res.url, err);
                    return;
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
