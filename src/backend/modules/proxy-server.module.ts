import proxy from 'http-proxy-middleware';
import express from 'express';

export class ProxyServerModule {
    public static configureRoutes(app: express.Application, apiPrefix: string) {
        app.use(apiPrefix + '/tracks', proxy({target: 'http://www.michas-ausflugstipps.de/', changeOrigin: true}));
    }
}
