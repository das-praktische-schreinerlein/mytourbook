import {join} from 'path';
import * as express from 'express';
import * as fs from 'fs';
import {LogUtils} from '@dps/mycms-commons/dist/commons/utils/log.utils';

export enum CacheModeType {
    NO_CACHE, USE_CACHE, CACHED_ONLY
}

export interface ServerModuleConfig {
    staticFolder: string;
    distServerProfile: string;
    distProfile: string;
    cacheFolder: string;
    cacheMode: CacheModeType;
    redirectFileJson?: string;
    redirectOnlyCached?: boolean;
}

export class SimpleFrontendServerModule {
    protected indexFile: string;
    private redirects = {};

    public static configureDefaultServer(app: express.Application, config: ServerModuleConfig) {
        const mytbServerModule = new SimpleFrontendServerModule(app, config);
        mytbServerModule.configureStaticFileRoutes();
        mytbServerModule.configureServerRoutes();
    }

    public constructor(protected app: express.Application, protected config: ServerModuleConfig) {
        this.indexFile = join(this.config.staticFolder, this.config.distProfile, 'index.html');
    }

    public configureStaticFileRoutes(): void {
        // Serve static files from /browser
        const matchingPath = '/' + this.config.distProfile + '*.*';
        this.app.get(matchingPath, express.static(join(this.config.staticFolder, '')));
        this.app.get(matchingPath, function(req, res, next) {
            req.url = req.url.replace(/\/([^\/]+)\.[0-9a-z]+\.(css|js|jpg|png|gif|svg|json)$/, '/$1.$2');
            next();
        });
        this.app.get(matchingPath, express.static(join(this.config.staticFolder, '')));
    }

    public configureServerRoutes(): void {
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
                return me.sendIndex(req, res);
            } else {
                const filename = me.getCacheFilename(req.url);

                fs.exists(filename, function (exists: boolean) {
                    if (exists) {
                        // CACHED: use cached file
                        res.status(200);
                        return res.sendFile(filename, {root: '.'});
                    }

                    const fullUrl = `${req.protocol}://${req.get('host')}` + req.url;
                    const redirectUrl = me.redirects[fullUrl] || me.redirects[req.url];
                    if (redirectUrl) {
                        if (!me.config.redirectOnlyCached) {
                            console.log('redirect:' + LogUtils.sanitizeLogMsg(req.url), redirectUrl);
                            return me.sendRedirect(req, res, redirectUrl);
                        }

                        const redirectFile = redirectUrl.replace(`${req.protocol}://${req.get('host')}`, '');
                        fs.exists(me.getCacheFilename(redirectFile), function (redirectExists: boolean) {
                            if (redirectExists) {
                                // CACHED: use cached file
                                console.log('redirect cache exists:' + LogUtils.sanitizeLogMsg(req.url), redirectUrl);
                                return me.sendRedirect(req, res, redirectUrl);
                            }

                            return me.handleNotCachedRoute(req, res);
                        });
                    } else {
                        return me.handleNotCachedRoute(req, res);
                    }
                });
            }
        });
    }

    protected handleNotCachedRoute(req, res): any {
        // NOT CACHED but use CACHED_ONLY
        return this.sendIndex(req, res);
    }

    protected sendRedirect(req, res, redirectUrl): any {
        return res.redirect(redirectUrl);
    }

    protected sendIndex(req, res): any {
        res.status(200);
        return res.sendFile(this.indexFile);
    }

    protected getCacheFilename(url: string): string {
        return this.config.cacheFolder + this.createCacheFilename(url);
    }

    protected createCacheFilename(url: string): string {
        return url.replace(/[^a-z0-9]/gi, '_').toLocaleLowerCase() + '-'
            + require('crypto').createHash('md5').update(url).digest('hex')
            + '.html';
    }
}
