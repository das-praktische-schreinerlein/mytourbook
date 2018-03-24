import proxy from 'http-proxy-middleware';
import express from 'express';
import {SDocRecord} from '../shared/sdoc-commons/model/records/sdoc-record';
import {isArray} from 'util';
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
                proxy({target: backendConfig['proxyVideosRouteToUrl'], changeOrigin: true}));
        }
    }

    public static configureStoredVideoRoutes(app: express.Application, apiPrefix: string, backendConfig: {},
                                               errorFile: string, filePathErrorDocs: string) {

        if (1 === 1) {
            return;
        }

        // TODO
        if (backendConfig['apiRouteStoredVideos'] && backendConfig['apiRouteVideosStaticDir']) {
            console.log('configure route videostore:',
                apiPrefix + backendConfig['apiRouteStoredVideos'] + ':resolution/:resolveSdocBySdocId'
                + ' to ' + backendConfig['apiRouteVideosStaticDir']);
            app.param('resolution', function(req, res, next, resolution) {
                req['resolution'] = undefined;
                if (Object.keys(VideoResolutions).indexOf(resolution) < 0) {
                    return next('not found');
                }
                req['resolution'] = resolution;
                return next();
            });
            // use id: param to read from solr
            app.route(apiPrefix + backendConfig['apiRouteStoredVideos'] + ':resolution/:resolveSdocBySdocId')
                .all(function(req, res, next) {
                    if (req.method !== 'GET') {
                        return next('not allowed');
                    }
                    return next();
                })
                .get(function(req, res, next) {
                    const sdoc: SDocRecord = req['sdoc'];
                    const resolution = req['resolution'];
                    if (resolution === undefined || sdoc === undefined ||
                        !isArray(sdoc['sdocimages']) || sdoc['sdocimages'].length < 0) {
                        res.status(200);
                        res.sendFile(errorFile, {root: filePathErrorDocs});
                        return;
                    }
                    res.status(200);
                    res.sendFile((backendConfig['apiRouteStoredVideosResolutionPrefix'] || '')
                        + resolution + '/' + sdoc['sdocimages'][0]['fileName'],
                        {root: backendConfig['apiRouteVideosStaticDir']});
                    return;
                });
        }
    }
}
