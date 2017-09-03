import proxy from 'http-proxy-middleware';
import express from 'express';

export class ProxyServerModule {
    public static configureRoutes(app: express.Application, apiPrefix: string, backendConfig: {}) {
        app.use(apiPrefix + '/tracks', proxy({target: backendConfig['proxyUrlTracks'], changeOrigin: true}));
        app.use(apiPrefix + '/digifotos', proxy({target: backendConfig['proxyUrlPictures'], changeOrigin: true}));
    }
}
