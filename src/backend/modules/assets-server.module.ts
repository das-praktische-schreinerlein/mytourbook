import proxy from 'http-proxy-middleware';
import express from 'express';
import {TourDocRecord} from '../shared/tdoc-commons/model/records/tdoc-record';

export enum PictureResolutions {
    'x100', 'x400', 'x600'
}
export enum TrackFormats {
    'gpx', 'json'
}

export class AssetsServerModule {
    public static configureStaticTrackRoutes(app: express.Application, apiPrefix: string, backendConfig: {}) {
        if (backendConfig['apiRouteTracks'] && backendConfig['apiRouteTracksStaticDir']) {
            if (backendConfig['apiRouteTracksStaticEnabled'] !== true) {
                console.warn('SKIP route track NOT Enabled:',
                    apiPrefix + backendConfig['apiRouteTracks'] + ' to ' + backendConfig['apiRouteTracksStaticDir']);
                return;
            }

            const options = {
                dotfiles: 'ignore',
                etag: false,
                index: false,
                maxAge: '30d',
                redirect: false
            };

            console.log('configure route track:',
                apiPrefix + backendConfig['apiRouteTracks'] + ' to ' + backendConfig['apiRouteTracksStaticDir']);
            app.use(apiPrefix + backendConfig['apiRouteTracks'], express.static(backendConfig['apiRouteTracksStaticDir'], options));
        } else if (backendConfig['apiRouteTracks'] && backendConfig['proxyTrackRouteToUrl']) {
            console.log('configure route trackproxy:',
                apiPrefix + backendConfig['apiRouteTracks'] + ' to ' + backendConfig['proxyTrackRouteToUrl']);
            app.use(apiPrefix + backendConfig['apiRouteTracks'],
                proxy.createProxyMiddleware({target: backendConfig['proxyTrackRouteToUrl'], changeOrigin: true}));
        }
    }

    public static configureStoredTrackRoutes(app: express.Application, apiPrefix: string, backendConfig: {},
                                               errorFile: string, filePathErrorDocs: string) {
        if (backendConfig['apiRouteStoredTracks'] && backendConfig['apiRouteTracksStaticDir']) {
            console.log('configure route trackstore:',
                apiPrefix + backendConfig['apiRouteStoredTracks'] + ':trackFormat/:resolveTdocByTdocId'
                + ' to ' + backendConfig['apiRouteTracksStaticDir']);
            app.param('trackFormat', function(req, res, next, trackFormat) {
                req['trackFormat'] = undefined;
                if (Object.keys(TrackFormats).indexOf(trackFormat) < 0) {
                    return next('not found');
                }
                req['trackFormat'] = trackFormat;
                return next();
            });
            // use id: param to read from solr
            app.route(apiPrefix + backendConfig['apiRouteStoredTracks'] + ':trackFormat/:resolveTdocByTdocId')
                .all(function(req, res, next) {
                    if (req.method !== 'GET') {
                        return next('not allowed');
                    }
                    return next();
                })
                .get(function(req, res, next) {
                    const tdoc: TourDocRecord = req['tdoc'];
                    const trackFormat = req['trackFormat'];
                    if (trackFormat === undefined || tdoc === undefined || tdoc.gpsTrackBasefile === undefined) {
                        res.status(200);
                        res.sendFile(errorFile, {root: filePathErrorDocs});
                        return;
                    }
                    res.status(200);
                    res.sendFile(tdoc.gpsTrackBasefile + '.' + trackFormat,
                        {root: backendConfig['apiRouteTracksStaticDir']});
                    return;
                });
        }
    }

    public static configureStaticPictureRoutes(app: express.Application, apiPrefix: string, backendConfig: {}) {
        if (backendConfig['apiRoutePictures'] && backendConfig['apiRoutePicturesStaticDir']) {
            if (backendConfig['apiRoutePicturesStaticEnabled'] !== true) {
                console.warn('SKIP route pictures NOT Enabled:',
                    apiPrefix + backendConfig['apiRoutePictures'] + ' to ' + backendConfig['apiRoutePicturesStaticDir']);
                return;
            }

            const options = {
                dotfiles: 'ignore',
                etag: false,
                index: false,
                maxAge: '30d',
                redirect: false
            };

            console.log('configure route picturestatic:',
                apiPrefix + backendConfig['apiRoutePictures'] + ' to ' + backendConfig['apiRoutePicturesStaticDir']);
            app.use(apiPrefix + backendConfig['apiRoutePictures'], express.static(backendConfig['apiRoutePicturesStaticDir'], options));
        } else if (backendConfig['apiRoutePictures'] && backendConfig['proxyPicturesRouteToUrl']) {
            console.log('configure route pictureproxy:',
                apiPrefix +  backendConfig['apiRoutePictures'] + ' to ' + backendConfig['proxyPicturesRouteToUrl']);
            app.use(apiPrefix + backendConfig['apiRoutePictures'],
                proxy.createProxyMiddleware({target: backendConfig['proxyPicturesRouteToUrl'], changeOrigin: true}));
        }
    }

    public static configureStoredPictureRoutes(app: express.Application, apiPrefix: string, backendConfig: {},
                                               errorFile: string, filePathErrorDocs: string) {
        if (backendConfig['apiRouteStoredPictures'] && backendConfig['apiRoutePicturesStaticDir']) {
            console.log('configure route picturestore:',
                apiPrefix + backendConfig['apiRouteStoredPictures'] + ':resolution/:resolveTdocByTdocId'
                + ' to ' + backendConfig['apiRoutePicturesStaticDir']);
            app.param('resolution', function(req, res, next, resolution) {
                req['resolution'] = undefined;
                if (Object.keys(PictureResolutions).indexOf(resolution) < 0) {
                    return next('not found');
                }
                req['resolution'] = resolution;
                return next();
            });
            // use id: param to read from solr
            app.route(apiPrefix + backendConfig['apiRouteStoredPictures'] + ':resolution/:resolveTdocByTdocId')
                .all(function(req, res, next) {
                    if (req.method !== 'GET') {
                        return next('not allowed');
                    }
                    return next();
                })
                .get(function(req, res, next) {
                    const tdoc: TourDocRecord = req['tdoc'];
                    const resolution = req['resolution'];
                    if (resolution === undefined || tdoc === undefined
                        || !Array.isArray(tdoc['tdocimages']) || tdoc['tdocimages'].length < 1) {
                        res.status(200);
                        res.sendFile(errorFile, {root: filePathErrorDocs});
                        return;
                    }
                    res.status(200);
                    res.sendFile((backendConfig['apiRouteStoredPicturesResolutionPrefix'] || '')
                        + resolution + '/' + tdoc['tdocimages'][0]['fileName'],
                        {root: backendConfig['apiRoutePicturesStaticDir']});
                    return;
                });
        }
    }
}
