import {EventEmitter, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {
    CommonDocActionTagService,
    CommonDocActionTagServiceConfig
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-actiontag.service';
import {TourDocDataService} from '../../../shared/tdoc-commons/services/tdoc-data.service';
import {TourDocRecord} from '../../../shared/tdoc-commons/model/records/tdoc-record';
import {
    ActionTagEvent,
    ActionTagFormResultType,
    MultiRecordActionTagEvent
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-actiontags/cdoc-actiontags.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
    TourDocObjectDetectionObjectKeyEditFormComponent,
    TourDocObjectDetectionObjectKeyEditFormResultType
} from '../components/tdoc-odobjectkeyeditform/tdoc-odobjectkeyeditform.component';
import {Subject} from 'rxjs';
import {TourDocReplaceFormComponent} from '../components/tdoc-replaceform/tdoc-replaceform.component';
import {ToastrService} from 'ngx-toastr';
import * as Promise_serial from 'promise-serial';
import {
    CommonDocAssignFormComponentResultType
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-assignform/cdoc-assignform.component';
import {TourDocAssignFormComponent} from '../components/tdoc-assignform/tdoc-assignform.component';
import {
    CommonDocReplaceFormComponentResultType
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-replaceform/cdoc-replaceform.component';
import {
    CommonDocKeywordTagFormComponentResultType
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-keywordtagform/cdoc-keywordtagform.component';
import {TourDocKeywordTagFormComponent} from '../../shared-tdoc/components/tdoc-keywordtagform/tdoc-keywordtagform.component';
import {
    CommonDocAssignJoinFormComponentResultType
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-assignjoinform/cdoc-assignjoinform.component';
import {TourDocAssignJoinFormComponent} from '../components/tdoc-assignjoinform/tdoc-assignjoinform.component';
import {TourDocAssignPlaylistFormComponent} from '../components/tdoc-assignplaylistform/tdoc-assignplaylistform.component';
import {TourDocActionTagService} from '../../shared-tdoc/services/tdoc-actiontag.service';
import {TourDocPlaylistService} from '../../shared-tdoc/services/tdoc-playlist.service';
import {TourDocAlbumService} from '../../shared-tdoc/services/tdoc-album.service';

@Injectable()
export class TourDocAdminActionTagService extends TourDocActionTagService {
    constructor(router: Router, cdocDataService: TourDocDataService, cdocPlaylistService: TourDocPlaylistService,
                cdocAlbumService: TourDocAlbumService, appService: GenericAppService, protected modalService: NgbModal,
                protected toastr: ToastrService) {
        super(router, cdocDataService, cdocPlaylistService, cdocAlbumService, appService, modalService, toastr);
        this.configureComponent({});
    }

    protected getComponentConfig(config: {}): CommonDocActionTagServiceConfig {
        return {
            baseEditPath: 'tdocadmin'
        };
    }

    protected processActionTagEventUnknown(actionTagEvent: ActionTagEvent,
                                           actionTagEventEmitter: EventEmitter<ActionTagEvent>): Promise<TourDocRecord> {
        if (actionTagEvent.config.type === 'objectkeyedit') {
            return this.processActionTagEventObjectKeyEdit(actionTagEvent, actionTagEventEmitter);
        } else if (actionTagEvent.config.type === 'replace') {
            return this.processActionTagEventReplace(actionTagEvent, actionTagEventEmitter);
        } else if (actionTagEvent.config.type === 'assign') {
            return this.processActionTagEventAssign(actionTagEvent, actionTagEventEmitter);
        } else if (actionTagEvent.config.type === 'assignjoin') {
            return this.processActionTagEventAssignJoin(actionTagEvent, actionTagEventEmitter);
        } else if (actionTagEvent.config.type === 'assignplaylist') {
            return this.processActionTagEventConfigureAssignPlaylist(actionTagEvent, actionTagEventEmitter);
        } else if (actionTagEvent.config.type === 'keyword') {
            return this.processActionTagEventKeywordTag(actionTagEvent, actionTagEventEmitter);
        } else {
            return super.processActionTagEventUnknown(actionTagEvent, actionTagEventEmitter);
        }
    }

    protected processActionMultiRecordTagEventUnknown(actionTagEvent: MultiRecordActionTagEvent,
                                                      actionTagEventEmitter: EventEmitter<MultiRecordActionTagEvent>):
        Promise<TourDocRecord[]> {
        if (actionTagEvent.config.type === 'replace') {
            return this.processMultiActionTagEventReplace(actionTagEvent, actionTagEventEmitter);
        } else if (actionTagEvent.config.type === 'assign') {
            return this.processMultiActionTagEventAssign(actionTagEvent, actionTagEventEmitter);
        } else if (actionTagEvent.config.type === 'assignjoin') {
            return this.processMultiActionTagEventAssignJoin(actionTagEvent, actionTagEventEmitter);
        } else if (actionTagEvent.config.type === 'keyword') {
            return this.processMultiActionTagEventKeywordTag(actionTagEvent, actionTagEventEmitter);
        } else {
            return super.processActionMultiRecordTagEventUnknown(actionTagEvent, actionTagEventEmitter);
        }
    }

    protected processActionTagEventObjectKeyEdit(actionTagEvent: ActionTagEvent,
                                                 actionTagEventEmitter: EventEmitter<ActionTagEvent>): Promise<TourDocRecord> {
        return  new Promise<TourDocRecord>((resolve, reject) => {
            actionTagEvent.processed = true;
            actionTagEvent.error = undefined;

            let formResultObservable: Subject<TourDocObjectDetectionObjectKeyEditFormResultType> =
                new Subject<TourDocObjectDetectionObjectKeyEditFormResultType>();
            formResultObservable.subscribe(editResult => {
                actionTagEvent.config.payload = editResult;
                this.processActionTagEventTag(actionTagEvent, actionTagEventEmitter).then(() => {
                    actionTagEventEmitter.emit(actionTagEvent);
                    resolve(<TourDocRecord>actionTagEvent.result);
                }).catch(reason => {
                    this.toastr.error('Oopps... Da lief wohl was schief :-(', 'Oje');
                    actionTagEvent.error = reason;
                    actionTagEventEmitter.emit(actionTagEvent);
                    reject(reason);
                });
                formResultObservable = undefined;
            });
            const modalRef = this.modalService.open(TourDocObjectDetectionObjectKeyEditFormComponent);
            modalRef.componentInstance.record = actionTagEvent.record;
            modalRef.componentInstance.resultObservable = formResultObservable;
        });
    }

    protected processActionTagEventReplace(actionTagEvent: ActionTagEvent,
                                           actionTagEventEmitter: EventEmitter<ActionTagEvent>): Promise<TourDocRecord> {
        return  new Promise<TourDocRecord>((resolve, reject) => {
            this.processMultiActionTagEventReplace(CommonDocActionTagService.actionTagEventToMultiActionTagEvent(actionTagEvent),
                CommonDocActionTagService.actionTagEventEmitterToMultiActionTagEventEmitter(actionTagEventEmitter)).then(value => {
                    resolve(value !== undefined && value.length > 0 ? value[0] : undefined);
            }).catch(reason => {
                reject(reason);
            });
        });
    }

    protected processMultiActionTagEventReplace(multiActionTagEvent: MultiRecordActionTagEvent,
                                               multiActionTagEventEmitter: EventEmitter<MultiRecordActionTagEvent>):
        Promise<TourDocRecord[]> {
        const formResultObservable: Subject<CommonDocReplaceFormComponentResultType> =
            new Subject<CommonDocReplaceFormComponentResultType>();
        const promise = this.processMultiActionFormTagEvent(multiActionTagEvent, multiActionTagEventEmitter, formResultObservable);

        const modalRef = this.modalService.open(TourDocReplaceFormComponent);
        modalRef.componentInstance.records = multiActionTagEvent.records;
        modalRef.componentInstance.resultObservable = formResultObservable;

        return promise;
    }

    protected processActionTagEventAssign(actionTagEvent: ActionTagEvent,
                                          actionTagEventEmitter: EventEmitter<ActionTagEvent>): Promise<TourDocRecord> {
        return  new Promise<TourDocRecord>((resolve, reject) => {
            this.processMultiActionTagEventAssign(CommonDocActionTagService.actionTagEventToMultiActionTagEvent(actionTagEvent),
                CommonDocActionTagService.actionTagEventEmitterToMultiActionTagEventEmitter(actionTagEventEmitter)).then(value => {
                resolve(value !== undefined && value.length > 0 ? value[0] : undefined);
            }).catch(reason => {
                reject(reason);
            });
        });
    }

    protected processMultiActionTagEventAssign(multiActionTagEvent: MultiRecordActionTagEvent,
                                               multiActionTagEventEmitter: EventEmitter<MultiRecordActionTagEvent>):
        Promise<TourDocRecord[]> {
        const formResultObservable: Subject<CommonDocAssignFormComponentResultType> = new Subject<CommonDocAssignFormComponentResultType>();
        const promise = this.processMultiActionFormTagEvent(multiActionTagEvent, multiActionTagEventEmitter, formResultObservable);

        const modalRef = this.modalService.open(TourDocAssignFormComponent);
        modalRef.componentInstance.records = multiActionTagEvent.records;
        modalRef.componentInstance.resultObservable = formResultObservable;

        return promise;
    }

    protected processActionTagEventAssignJoin(actionTagEvent: ActionTagEvent,
                                          actionTagEventEmitter: EventEmitter<ActionTagEvent>): Promise<TourDocRecord> {
        return  new Promise<TourDocRecord>((resolve, reject) => {
            this.processMultiActionTagEventAssignJoin(CommonDocActionTagService.actionTagEventToMultiActionTagEvent(actionTagEvent),
                CommonDocActionTagService.actionTagEventEmitterToMultiActionTagEventEmitter(actionTagEventEmitter)).then(value => {
                resolve(value !== undefined && value.length > 0 ? value[0] : undefined);
            }).catch(reason => {
                reject(reason);
            });
        });
    }

    protected processMultiActionTagEventAssignJoin(multiActionTagEvent: MultiRecordActionTagEvent,
                                               multiActionTagEventEmitter: EventEmitter<MultiRecordActionTagEvent>):
        Promise<TourDocRecord[]> {
        const formResultObservable: Subject<CommonDocAssignJoinFormComponentResultType> =
            new Subject<CommonDocAssignJoinFormComponentResultType>();
        const promise = this.processMultiActionFormTagEvent(multiActionTagEvent, multiActionTagEventEmitter, formResultObservable);

        const modalRef = this.modalService.open(TourDocAssignJoinFormComponent);
        modalRef.componentInstance.records = multiActionTagEvent.records;
        modalRef.componentInstance.resultObservable = formResultObservable;

        return promise;
    }

    protected processActionTagEventConfigureAssignPlaylist(actionTagEvent: ActionTagEvent,
                                                           actionTagEventEmitter: EventEmitter<ActionTagEvent>): Promise<TourDocRecord> {
        return  new Promise<TourDocRecord>((resolve, reject) => {
            this.processMultiActionTagEventConfigureAssignPlaylist(
                CommonDocActionTagService.actionTagEventToMultiActionTagEvent(actionTagEvent),
                CommonDocActionTagService.actionTagEventEmitterToMultiActionTagEventEmitter(actionTagEventEmitter)).then(value => {
                resolve(value !== undefined && value.length > 0 ? value[0] : undefined);
            }).catch(reason => {
                reject(reason);
            });
        });
    }

    protected processMultiActionTagEventConfigureAssignPlaylist(multiActionTagEvent: MultiRecordActionTagEvent,
                                                                multiActionTagEventEmitter: EventEmitter<MultiRecordActionTagEvent>):
        Promise<TourDocRecord[]> {
        const formResultObservable: Subject<CommonDocAssignJoinFormComponentResultType> =
            new Subject<CommonDocAssignJoinFormComponentResultType>();
        const promise = this.processMultiActionFormTagEvent(multiActionTagEvent, multiActionTagEventEmitter, formResultObservable);

        const modalRef = this.modalService.open(TourDocAssignPlaylistFormComponent);
        modalRef.componentInstance.actionTagEvent = multiActionTagEvent;
        modalRef.componentInstance.records = multiActionTagEvent.records;
        modalRef.componentInstance.resultObservable = formResultObservable;

        return promise;
    }

    protected processActionTagEventKeywordTag(actionTagEvent: ActionTagEvent,
                                          actionTagEventEmitter: EventEmitter<ActionTagEvent>): Promise<TourDocRecord> {
        return  new Promise<TourDocRecord>((resolve, reject) => {
            this.processMultiActionTagEventKeywordTag(CommonDocActionTagService.actionTagEventToMultiActionTagEvent(actionTagEvent),
                CommonDocActionTagService.actionTagEventEmitterToMultiActionTagEventEmitter(actionTagEventEmitter)).then(value => {
                resolve(value !== undefined && value.length > 0 ? value[0] : undefined);
            }).catch(reason => {
                reject(reason);
            });
        });
    }

    protected processMultiActionTagEventKeywordTag(multiActionTagEvent: MultiRecordActionTagEvent,
                                               multiActionTagEventEmitter: EventEmitter<MultiRecordActionTagEvent>):
        Promise<TourDocRecord[]> {
        const formResultObservable: Subject<CommonDocKeywordTagFormComponentResultType> =
            new Subject<CommonDocKeywordTagFormComponentResultType>();
        const promise = this.processMultiActionFormTagEvent(multiActionTagEvent, multiActionTagEventEmitter, formResultObservable);

        const modalRef = this.modalService.open(TourDocKeywordTagFormComponent);
        modalRef.componentInstance.records = multiActionTagEvent.records;
        modalRef.componentInstance.resultObservable = formResultObservable;

        return promise;
    }

    protected processMultiActionFormTagEvent(multiActionTagEvent: MultiRecordActionTagEvent,
                                             multiActionTagEventEmitter: EventEmitter<MultiRecordActionTagEvent>,
                                             formResultObservable: Subject<ActionTagFormResultType>): Promise<TourDocRecord[]> {
        return  new Promise<TourDocRecord[]>((resolve, reject) => {
            const me = this;
            multiActionTagEvent.processed = true;
            multiActionTagEvent.error = undefined;

            formResultObservable.subscribe(editResult => {
                multiActionTagEvent.config.payload = editResult;
                const actionTagEventPromises = [];
                for (const record of multiActionTagEvent.records) {
                    const actionTagEventEmitter = new EventEmitter<ActionTagEvent>();
                    const actionTagEvent: ActionTagEvent = {
                        config: multiActionTagEvent.config,
                        error: undefined,
                        processed: true,
                        record: record,
                        set: multiActionTagEvent.set,
                        result: undefined
                    };
                    actionTagEventEmitter.subscribe((data: ActionTagEvent) => {
                        multiActionTagEvent.results = multiActionTagEvent.results !== undefined ? multiActionTagEvent.results : [];
                        multiActionTagEvent.results.push(data.result);
                    }, (error: any) => {
                        multiActionTagEvent.error = error;
                    });
                    actionTagEventPromises.push(function () {
                        return me.processActionTagEventTag(actionTagEvent, actionTagEventEmitter);
                    });
                }

                Promise_serial(actionTagEventPromises, {parallelize: 1}).then(() => {
                    // this.router.navigate([ this.baseEditPath, 'edit', 'anonym', actionTagEvent.record.id ] );
                    multiActionTagEvent.processed = true;
                    multiActionTagEvent.error = undefined;
                    multiActionTagEventEmitter.emit(multiActionTagEvent);
                    const newUrl = this.router.url;
                    // TODO: check this in angular 6
                    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                        this.router.navigateByUrl(newUrl);
                    });
                }).catch(reason => {
                    this.toastr.error('Oopps... Da lief wohl was schief :-(', 'Oje');
                    multiActionTagEvent.processed = true;
                    multiActionTagEvent.error = reason;
                    multiActionTagEvent.results = undefined;
                    multiActionTagEventEmitter.emit(multiActionTagEvent);
                    reject(multiActionTagEvent.error);
                });

                formResultObservable = undefined;
            }, error => {
                multiActionTagEvent.processed = true;
                multiActionTagEvent.error = error;
                multiActionTagEvent.results = undefined;
                reject(multiActionTagEvent.error);

                formResultObservable = undefined;
            });
        });
    }

}
