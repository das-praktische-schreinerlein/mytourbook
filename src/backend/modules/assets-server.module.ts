import proxy from 'http-proxy-middleware';
import express from 'express';

export class AssetsServerModule {
    public static configureTrackRoutes(app: express.Application, apiPrefix: string, backendConfig: {}) {
        if (backendConfig['apiRouteTracks'] && backendConfig['apiRouteTracksStaticDir']) {
            const options = {
                dotfiles: 'ignore',
                etag: false,
                index: false,
                maxAge: '30d',
                redirect: false
            };

            app.use(apiPrefix + backendConfig['apiRouteTracks'], express.static(backendConfig['apiRouteTracksStaticDir'], options));
        } else if (backendConfig['apiRouteTracks'] && backendConfig['proxyTrackRouteToUrl']) {
            app.use(apiPrefix + backendConfig['apiRouteTracks'],
                proxy({target: backendConfig['proxyTrackRouteToUrl'], changeOrigin: true}));
        }
    }

    public static configurePictureRoutes(app: express.Application, apiPrefix: string, backendConfig: {}) {
        if (backendConfig['apiRouteTracks'] && backendConfig['apiRouteTracksStaticDir']) {
            const options = {
                dotfiles: 'ignore',
                etag: false,
                index: false,
                maxAge: '30d',
                redirect: false
            };

            app.use(apiPrefix + backendConfig['apiRoutePictures'], express.static(backendConfig['apiRoutePicturesStaticDir'], options));
        } else  if (backendConfig['apiRoutePictures'] && backendConfig['proxyPicturesRouteToUrl']) {
            app.use(apiPrefix + backendConfig['apiRoutePictures'],
                proxy({target: backendConfig['proxyPicturesRouteToUrl'], changeOrigin: true}));
        }
    }
}
