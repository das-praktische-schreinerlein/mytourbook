import {EventEmitter, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {
    CommonDocActionTagService,
    CommonDocActionTagServiceConfig
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-actiontag.service';
import {PDocDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.service';
import {PDocRecord} from '@dps/mycms-commons/dist/pdoc-commons/model/records/pdoc-record';
import {
    ActionTagEvent,
    ActionTagFormResultType,
    MultiRecordActionTagEvent
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-actiontags/cdoc-actiontags.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {PDocReplaceFormComponent} from '../components/pdoc-replaceform/pdoc-replaceform.component';
import {ToastrService} from 'ngx-toastr';
import * as Promise_serial from 'promise-serial';
import {
    CommonDocAssignFormComponentResultType
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-assignform/cdoc-assignform.component';
import {PDocAssignFormComponent} from '../components/pdoc-assignform/pdoc-assignform.component';
import {
    CommonDocReplaceFormComponentResultType
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-replaceform/cdoc-replaceform.component';
import {
    CommonDocAssignJoinFormComponentResultType
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-assignjoinform/cdoc-assignjoinform.component';
import {PDocAssignJoinFormComponent} from '../components/pdoc-assignjoinform/pdoc-assignjoinform.component';
import {PDocActionTagService} from '../../shared-pdoc/services/pdoc-actiontag.service';

@Injectable()
export class PDocAdminActionTagService extends PDocActionTagService {
    constructor(router: Router, cdocDataService: PDocDataService,
                appService: GenericAppService, protected modalService: NgbModal,
                protected toastr: ToastrService) {
        super(router, cdocDataService, appService, modalService, toastr);
        this.configureComponent({});
    }

    protected getComponentConfig(config: {}): CommonDocActionTagServiceConfig {
        return {
            baseEditPath: 'pdocadmin'
        };
    }

    protected processActionTagEventUnknown(actionTagEvent: ActionTagEvent,
                                           actionTagEventEmitter: EventEmitter<ActionTagEvent>): Promise<PDocRecord> {
        if (actionTagEvent.config.type === 'replace') {
            return this.processActionTagEventReplace(actionTagEvent, actionTagEventEmitter);
        } else if (actionTagEvent.config.type === 'assign') {
            return this.processActionTagEventAssign(actionTagEvent, actionTagEventEmitter);
        } else if (actionTagEvent.config.type === 'assignjoin') {
            return this.processActionTagEventAssignJoin(actionTagEvent, actionTagEventEmitter);
        } else {
            return super.processActionTagEventUnknown(actionTagEvent, actionTagEventEmitter);
        }
    }

    protected processActionMultiRecordTagEventUnknown(actionTagEvent: MultiRecordActionTagEvent,
                                                      actionTagEventEmitter: EventEmitter<MultiRecordActionTagEvent>):
        Promise<PDocRecord[]> {
        if (actionTagEvent.config.type === 'replace') {
            return this.processMultiActionTagEventReplace(actionTagEvent, actionTagEventEmitter);
        } else if (actionTagEvent.config.type === 'assign') {
            return this.processMultiActionTagEventAssign(actionTagEvent, actionTagEventEmitter);
        } else if (actionTagEvent.config.type === 'assignjoin') {
            return this.processMultiActionTagEventAssignJoin(actionTagEvent, actionTagEventEmitter);
        } else {
            return super.processActionMultiRecordTagEventUnknown(actionTagEvent, actionTagEventEmitter);
        }
    }

    protected processActionTagEventReplace(actionTagEvent: ActionTagEvent,
                                           actionTagEventEmitter: EventEmitter<ActionTagEvent>): Promise<PDocRecord> {
        return  new Promise<PDocRecord>((resolve, reject) => {
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
        Promise<PDocRecord[]> {
        const formResultObservable: Subject<CommonDocReplaceFormComponentResultType> =
            new Subject<CommonDocReplaceFormComponentResultType>();
        const promise = this.processMultiActionFormTagEvent(multiActionTagEvent, multiActionTagEventEmitter, formResultObservable);

        const modalRef = this.modalService.open(PDocReplaceFormComponent);
        modalRef.componentInstance.records = multiActionTagEvent.records;
        modalRef.componentInstance.resultObservable = formResultObservable;

        return promise;
    }

    protected processActionTagEventAssign(actionTagEvent: ActionTagEvent,
                                          actionTagEventEmitter: EventEmitter<ActionTagEvent>): Promise<PDocRecord> {
        return  new Promise<PDocRecord>((resolve, reject) => {
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
        Promise<PDocRecord[]> {
        const formResultObservable: Subject<CommonDocAssignFormComponentResultType> = new Subject<CommonDocAssignFormComponentResultType>();
        const promise = this.processMultiActionFormTagEvent(multiActionTagEvent, multiActionTagEventEmitter, formResultObservable);

        const modalRef = this.modalService.open(PDocAssignFormComponent);
        modalRef.componentInstance.records = multiActionTagEvent.records;
        modalRef.componentInstance.resultObservable = formResultObservable;

        return promise;
    }

    protected processActionTagEventAssignJoin(actionTagEvent: ActionTagEvent,
                                          actionTagEventEmitter: EventEmitter<ActionTagEvent>): Promise<PDocRecord> {
        return  new Promise<PDocRecord>((resolve, reject) => {
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
        Promise<PDocRecord[]> {
        const formResultObservable: Subject<CommonDocAssignJoinFormComponentResultType> =
            new Subject<CommonDocAssignJoinFormComponentResultType>();
        const promise = this.processMultiActionFormTagEvent(multiActionTagEvent, multiActionTagEventEmitter, formResultObservable);

        const modalRef = this.modalService.open(PDocAssignJoinFormComponent);
        modalRef.componentInstance.records = multiActionTagEvent.records;
        modalRef.componentInstance.resultObservable = formResultObservable;

        return promise;
    }

    protected processMultiActionFormTagEvent(multiActionTagEvent: MultiRecordActionTagEvent,
                                             multiActionTagEventEmitter: EventEmitter<MultiRecordActionTagEvent>,
                                             formResultObservable: Subject<ActionTagFormResultType>): Promise<PDocRecord[]> {
        return  new Promise<PDocRecord[]>((resolve, reject) => {
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
