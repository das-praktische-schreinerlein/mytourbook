import {EventEmitter, Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {
    CommonDocActionTagService,
    CommonDocActionTagServiceConfig
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-actiontag.service';
import {TourDocDataService} from '../../../shared/tdoc-commons/services/tdoc-data.service';
import {TourDocRecord} from '../../../shared/tdoc-commons/model/records/tdoc-record';
import {TourDocSearchForm} from '../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {TourDocAlbumService} from './tdoc-album.service';
import {TourDocPlaylistService} from './tdoc-playlist.service';
import {ActionTagEvent} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-actiontags/cdoc-actiontags.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
    TourDocObjectDetectionObjectKeyEditFormComponent,
    TourDocObjectDetectionObjectKeyEditFormResultType
} from '../components/tdoc-odobjectkeyeditform/tdoc-odobjectkeyeditform.component';
import {Subject} from 'rxjs/Subject';
import {
    TourDocReplaceFormComponent,
    TourDocReplaceFormComponentResultType
} from '../components/tdoc-replaceform/tdoc-replaceform.component';
import {ToastrService} from 'ngx-toastr';

@Injectable()
export class TourDocActionTagService extends CommonDocActionTagService<TourDocRecord, TourDocSearchForm, TourDocSearchResult,
    TourDocDataService> {
    constructor(router: Router, cdocDataService: TourDocDataService, cdocPlaylistService: TourDocPlaylistService,
                cdocAlbumService: TourDocAlbumService, appService: GenericAppService, private modalService: NgbModal,
                protected toastr: ToastrService, private route: ActivatedRoute) {
        super(router, cdocDataService, cdocPlaylistService, cdocAlbumService, appService);
        this.configureComponent({});
    }

    protected getComponentConfig(config: {}): CommonDocActionTagServiceConfig {
        return {
            baseEditPath: 'tdocadmin'
        };
    }

    protected processActionTagEventUnknown(actionTagEvent: ActionTagEvent,
                                           actionTagEventEmitter: EventEmitter<ActionTagEvent>): Promise<any> {
        if (actionTagEvent.config.type === 'objectkeyedit') {
            return this.processActionTagEventObjectKeyEdit(actionTagEvent, actionTagEventEmitter);
        } else if (actionTagEvent.config.type === 'replace') {
            return this.processActionTagEventReplace(actionTagEvent, actionTagEventEmitter);
        } else {
            return super.processActionTagEventUnknown(actionTagEvent, actionTagEventEmitter);
        }
    }

    protected processActionTagEventObjectKeyEdit(actionTagEvent: ActionTagEvent,
                                                 actionTagEventEmitter: EventEmitter<ActionTagEvent>): Promise<any> {
        actionTagEvent.processed = true;
        actionTagEvent.error = undefined;
        let actionTagEventObservable: Subject<ActionTagEvent> = new Subject<ActionTagEvent>();
        actionTagEventObservable.subscribe(value => {
            actionTagEventEmitter.emit(value);
            actionTagEventObservable.unsubscribe();
            actionTagEventObservable = undefined;
        });
        let tourDocObjectDetectionObjectKeyEditFormResultTypeObservable: Subject<TourDocObjectDetectionObjectKeyEditFormResultType> =
            new Subject<TourDocObjectDetectionObjectKeyEditFormResultType>();
        tourDocObjectDetectionObjectKeyEditFormResultTypeObservable.subscribe(editResult => {
            actionTagEvent.config.payload = editResult;
            this.processActionTagEventTag(actionTagEvent, actionTagEventEmitter).then(tagResult => {
                actionTagEventObservable.next(actionTagEvent);
            }).catch(reason => {
                this.toastr.error('Oopps... Da lief wohl was schief :-(', 'Oje');
                actionTagEventObservable.next(actionTagEvent);
            });
            tourDocObjectDetectionObjectKeyEditFormResultTypeObservable = undefined;
        });
        const modalRef = this.modalService.open(TourDocObjectDetectionObjectKeyEditFormComponent);
        modalRef.componentInstance.record = actionTagEvent.record;
        modalRef.componentInstance.resultObservable = tourDocObjectDetectionObjectKeyEditFormResultTypeObservable;

        return actionTagEventObservable.toPromise();
    }

    protected processActionTagEventReplace(actionTagEvent: ActionTagEvent,
                                           actionTagEventEmitter: EventEmitter<ActionTagEvent>): Promise<any> {
        actionTagEvent.processed = true;
        actionTagEvent.error = undefined;
        let actionTagEventObservable: Subject<ActionTagEvent> = new Subject<ActionTagEvent>();
        actionTagEventObservable.subscribe(value => {
            actionTagEventEmitter.emit(value);
            actionTagEventObservable.unsubscribe();
            actionTagEventObservable = undefined;
        });
        let tourDocReplaceFormComponentResultTypeObservable: Subject<TourDocReplaceFormComponentResultType> =
            new Subject<TourDocReplaceFormComponentResultType>();
        tourDocReplaceFormComponentResultTypeObservable.subscribe(editResult => {
            actionTagEvent.config.payload = editResult;
            this.processActionTagEventTag(actionTagEvent, actionTagEventEmitter).then(tagResult => {
                actionTagEventObservable.next(actionTagEvent);
                // this.router.navigate([ this.baseEditPath, 'edit', 'anonym', actionTagEvent.record.id ] );
                const newUrl = this.router.url;
                // TODO: check this in angular 6
                this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                    this.router.navigateByUrl(newUrl);
                });
            }).catch(reason => {
                this.toastr.error('Oopps... Da lief wohl was schief :-(', 'Oje');
                actionTagEventObservable.next(actionTagEvent);
            });
            tourDocReplaceFormComponentResultTypeObservable = undefined;
        });
        const modalRef = this.modalService.open(TourDocReplaceFormComponent);
        modalRef.componentInstance.record = actionTagEvent.record;
        modalRef.componentInstance.resultObservable = tourDocReplaceFormComponentResultTypeObservable;

        return actionTagEventObservable.toPromise();
    }
}
