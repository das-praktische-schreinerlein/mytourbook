import {Router} from 'js-data-express';
import express from 'express';
import {SDocRecord} from '../shared/sdoc-commons/model/records/sdoc-record';
import {SDocServerModule} from './sdoc-server.module';
import {SDocDataService} from '../shared/sdoc-commons/services/sdoc-data.service';
import {SDocAdapterResponseMapper} from '../shared/sdoc-commons/services/sdoc-adapter-response.mapper';
import {Adapter} from 'js-data-adapter';
import {Mapper, utils} from 'js-data';

export class SDocWriterServerModule {
    private dataService: SDocDataService;
    private mapper: Mapper;
    private adapter: Adapter;
    private responseMapper = new SDocAdapterResponseMapper();

    public static configureRoutes(app: express.Application, apiPrefix: string, sdocServerModule: SDocServerModule): SDocWriterServerModule {
        console.log('configure route sdoc:', apiPrefix + '/:locale' + '/sdocwrite/:resolveSdocToWriteBySdocId');
        const sdocWriterServerModule = new SDocWriterServerModule(sdocServerModule);
        app.route(apiPrefix + '/:locale' + '/sdocwrite/:resolveSdocToWriteBySdocId')
            .all(function(req, res, next) {
                if (req.method === 'GET') {
                    return next('not allowed');
                }
                return next();
            })
            .put(function(req, res, next) {
                const sdocSrc = req['body'];
                if (sdocSrc === undefined) {
                    console.error('update failed: no requestbody');
                    res.status(403);
                    return next('not found');
                }

                sdocWriterServerModule.updateRecord(sdocSrc).then(sdoc => {
                    if (sdoc === undefined) {
                        console.error('update not fullfilled: sdoc not found');
                        res.status(403);
                        res.json();
                        return next();
                    }

                    res.json(sdoc.toSerializableJsonObj());
                    return next();
                }).catch(reason => {
                    console.error('updaterequest not fullfilled:', reason);
                    res.status(403);
                    return next('not found');
                });
            })
            .post(function(req, res, next) {
                const sdocSrc = req['data'];
                if (sdocSrc === undefined) {
                    console.error('create failed: no requestbody');
                    res.status(403);
                    return next('not found');
                }

                sdocWriterServerModule.addRecord(sdocSrc).then(sdoc => {
                    if (sdoc === undefined) {
                        console.error('create not fullfilled: no result');
                        res.status(403);
                        return next('not found');
                    }

                    res.json(sdoc.toSerializableJsonObj());
                    return next();
                }).catch(reason => {
                    console.error('createrequest not fullfilled:', reason);
                    res.status(403);
                    return next('not found');
                });
            });

        return sdocWriterServerModule;
    }

    public constructor(private sdocServerModule: SDocServerModule) {
        this.dataService = sdocServerModule.getDataService();
        this.mapper = this.dataService.getMapper('sdoc');
        this.adapter = this.dataService.getAdapterForMapper('sdoc');
        this.dataService.setWritable(true);
    }

    public updateRecord(sdocSrc: {}): Promise<SDocRecord> {
        const sdoc: SDocRecord = this.mapRecord(sdocSrc);
        if (sdoc === undefined) {
            return utils.reject('record not mapped: undefined');
        }
        if (sdoc.id === undefined || sdoc.id === '') {
            return utils.reject('record not mapped: no id');
        }

        return this.dataService.updateById(sdoc.id, sdoc);
    }

    public addRecord(sdocSrc: {}): Promise<SDocRecord> {
        const sdoc: SDocRecord = this.mapRecord(sdocSrc);
        if (sdoc === undefined) {
            return utils.reject('record not mapped: undefined');
        }
        if (sdoc.id !== undefined && sdoc.id !== '') {
            return utils.reject('record not mapped: existing id');
        }

        return this.dataService.add(sdoc);
    }

    private mapRecord(sdocSrc: {}): SDocRecord {
        return <SDocRecord>this.responseMapper.mapResponseDocument(this.mapper, sdocSrc, {});
    }
}
