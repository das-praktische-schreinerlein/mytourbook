import {Router} from 'js-data-express';
import express from 'express';
import {SDocRecord} from '../shared/sdoc-commons/model/records/sdoc-record';
import {SDocServerModule} from './sdoc-server.module';
import {SDocDataService} from '../shared/sdoc-commons/services/sdoc-data.service';
import {SDocAdapterResponseMapper} from '../shared/sdoc-commons/services/sdoc-adapter-response.mapper';
import {Adapter} from 'js-data-adapter';
import {Mapper, utils} from 'js-data';
import {ActionTagForm} from '../shared/commons/utils/actiontag.utils';
import {IdValidationRule} from '../shared/search-commons/model/forms/generic-validator.util';

export class SDocWriterServerModule {
    private dataService: SDocDataService;
    private mapper: Mapper;
    private adapter: Adapter;
    private responseMapper = new SDocAdapterResponseMapper({});
    private idValidationRule = new IdValidationRule(true);

    public static configureRoutes(app: express.Application, apiPrefix: string, sdocServerModule: SDocServerModule): SDocWriterServerModule {
        console.log('configure route sdoc:', apiPrefix + '/:locale' + '/sdocwrite/:resolveSdocToWriteBySdocId');
        const sdocWriterServerModule = new SDocWriterServerModule(sdocServerModule);
        app.route(apiPrefix + '/:locale' + '/sdocwrite')
            .all(function(req, res, next) {
                if (req.method !== 'POST') {
                    return next('not allowed');
                }
                return next();
            })
            .post(function(req, res, next) {
                const sdocSrc = req['body'];
                if (sdocSrc === undefined) {
                    console.log('create failed: no requestbody');
                    res.status(403);
                    res.json();
                    return next('not found');
                }

                sdocWriterServerModule.addRecord(sdocSrc).then(sdoc => {
                    if (sdoc === undefined) {
                        console.log('create not fullfilled: no result');
                        res.status(403);
                        res.json();
                        return next('not found');
                    }

                    res.json(sdoc.toSerializableJsonObj());
                    return next();
                }).catch(reason => {
                    console.error('createrequest not fullfilled:', reason);
                    res.status(403);
                    res.json();
                    return next('not found');
                });
            });
        app.route(apiPrefix + '/:locale' + '/sdocwrite/:resolveSdocToWriteBySdocId')
            .all(function(req, res, next) {
                if (req.method === 'PUT' && req.method === 'DEL') {
                    return next('not allowed');
                }
                return next();
            })
            .put(function(req, res, next) {
                const sdocSrc = req['body'];
                if (sdocSrc === undefined) {
                    console.log('update failed: no requestbody');
                    res.status(403);
                    res.json();
                    return next('not found');
                }

                sdocWriterServerModule.updateRecord(sdocSrc).then(sdoc => {
                    if (sdoc === undefined) {
                        console.log('update not fullfilled: sdoc not found');
                        res.status(403);
                        res.json();
                        return next();
                    }

                    res.json(sdoc.toSerializableJsonObj());
                    return next();
                }).catch(reason => {
                    console.error('updaterequest not fullfilled:', reason);
                    res.status(403);
                    res.json();
                    return next('not found');
                });
            });
        app.route(apiPrefix + '/:locale' + '/sdocaction')
            .all(function(req, res, next) {
                if (req.method === 'PUT' && req.method === 'DEL') {
                    return next('not allowed');
                }
                return next();
            })
            .put(function(req, res, next) {
                const actionSrc = req['body'];
                if (actionSrc === undefined) {
                    console.log('actiontag failed: no requestbody');
                    res.status(403);
                    res.json();
                    return next('not found');
                }

                sdocWriterServerModule.doActionTag(actionSrc).then(sdoc => {
                    if (sdoc === undefined) {
                        console.log('actiontag not fullfilled: action not found');
                        res.status(403);
                        res.json();
                        return next();
                    }

                    res.json(sdoc.toSerializableJsonObj());
                    return next();
                }).catch(reason => {
                    console.error('actiontagrequest not fullfilled:', reason);
                    res.status(403);
                    res.json();
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

    public doActionTag(actionTagFormSrc: {}): Promise<SDocRecord> {
        const actionTagForm = this.mapActionTagForm(actionTagFormSrc);
        if (actionTagForm === undefined) {
            return utils.reject('actionTagForm not mapped');
        }

        return this.dataService.getById(actionTagForm.recordId).then(sdoc => {
            if (sdoc === undefined) {
                return utils.reject('record not mapped: undefined');
            }
            if (sdoc.id === undefined || sdoc.id === '') {
                return utils.reject('record not mapped: no id');
            }

            return this.dataService.doActionTag(sdoc, actionTagForm);
        }).catch(reason => {
            return utils.reject('record not found: ' + reason);
        });
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

    private mapActionTagForm(actiontTagFormSrc: {}): ActionTagForm {
        if (actiontTagFormSrc === undefined) {
            return undefined;
        }

        return {
            recordId: this.idValidationRule.sanitize(actiontTagFormSrc['recordId']),
            key: this.idValidationRule.sanitize(actiontTagFormSrc['key']),
            type: this.idValidationRule.sanitize(actiontTagFormSrc['type']),
            payload: actiontTagFormSrc['payload']
        };
    }
}
