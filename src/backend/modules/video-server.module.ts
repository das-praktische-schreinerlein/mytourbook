import proxy from 'http-proxy-middleware';
import express from 'express';
import * as vidStreamer from 'vid-streamer';

export enum VideoResolutions {
    'x100', 'x400', 'x600'
}

export class VideoServerModule {
    public static configureStaticVideoRoutes(app: express.Application, apiPrefix: string, backendConfig: {}) {
        if (backendConfig['apiRouteVideos'] && backendConfig['apiRouteVideosStaticDir']) {
            if (backendConfig['apiRouteVideosStaticEnabled'] !== true) {
                console.warn('SKIP route videos NOT Enabled:',
                    apiPrefix + backendConfig['apiRouteVideos'] + ' to ' + backendConfig['apiRouteVideosStaticDir']);
                return;
            }

            const newSettings = {
                rootFolder: backendConfig['apiRouteVideosStaticDir'],
                rootPath: '',
                forceDownload: false,
                mode: 'development',
                random: false,
                server: 'streamer'
            };

            console.log('configure route videostatic:',
                apiPrefix + backendConfig['apiRouteVideos'] + ' to ' + backendConfig['apiRouteVideosStaticDir']);
            app.use(apiPrefix + backendConfig['apiRouteVideos'], vidStreamer.settings(newSettings));
        } else if (backendConfig['apiRouteVideos'] && backendConfig['proxyVideosRouteToUrl']) {
            console.log('configure route videoproxy:',
                apiPrefix +  backendConfig['apiRouteVideos'] + ' to ' + backendConfig['proxyVideosRouteToUrl']);
            app.use(apiPrefix + backendConfig['apiRouteVideos'],
                proxy.createProxyMiddleware({target: backendConfig['proxyVideosRouteToUrl'], changeOrigin: true}));
        }
    }

    public static configureStoredVideoRoutes(app: express.Application, apiPrefix: string, backendConfig: {},
                                               errorFile: string, filePathErrorDocs: string) {
        // TODO
    }
}
