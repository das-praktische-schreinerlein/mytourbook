import {EventEmitter, Injectable} from '@angular/core';
import {Router} from '@angular/router';
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

@Injectable()
export class TourDocActionTagService extends CommonDocActionTagService<TourDocRecord, TourDocSearchForm, TourDocSearchResult,
    TourDocDataService> {
    constructor(router: Router, cdocDataService: TourDocDataService, cdocPlaylistService: TourDocPlaylistService,
                cdocAlbumService: TourDocAlbumService, appService: GenericAppService, private modalService: NgbModal) {
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
                actionTagEventObservable.next(actionTagEvent);
            });
            tourDocObjectDetectionObjectKeyEditFormResultTypeObservable = undefined;
        });
        const modalRef = this.modalService.open(TourDocObjectDetectionObjectKeyEditFormComponent);
        modalRef.componentInstance.record = actionTagEvent.record;
        modalRef.componentInstance.resultObservable = tourDocObjectDetectionObjectKeyEditFormResultTypeObservable;

        return actionTagEventObservable.toPromise();
    }

}
