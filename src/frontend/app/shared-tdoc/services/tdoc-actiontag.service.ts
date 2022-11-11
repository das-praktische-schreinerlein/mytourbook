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
import {
    ActionTagEvent,
    MultiRecordActionTagEvent
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-actiontags/cdoc-actiontags.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';

@Injectable()
export class TourDocActionTagService extends CommonDocActionTagService<TourDocRecord, TourDocSearchForm, TourDocSearchResult,
    TourDocDataService> {
    constructor(router: Router, cdocDataService: TourDocDataService, cdocPlaylistService: TourDocPlaylistService,
                cdocAlbumService: TourDocAlbumService, appService: GenericAppService, protected modalService: NgbModal,
                protected toastr: ToastrService) {
        super(router, cdocDataService, cdocPlaylistService, cdocAlbumService, appService);
        this.configureComponent({});
    }

    protected getComponentConfig(config: {}): CommonDocActionTagServiceConfig {
        return {
            baseEditPath: 'tdocadmin'
        };
    }

    protected processActionTagEventUnknown(actionTagEvent: ActionTagEvent,
                                           actionTagEventEmitter: EventEmitter<ActionTagEvent>): Promise<TourDocRecord> {
        if (actionTagEvent.config.type === 'noop') {
            return this.processActionTagEventNoop(actionTagEvent, actionTagEventEmitter);
        } else {
            return super.processActionTagEventUnknown(actionTagEvent, actionTagEventEmitter);
        }
    }

    protected processActionMultiRecordTagEventUnknown(actionTagEvent: MultiRecordActionTagEvent,
                                                      actionTagEventEmitter: EventEmitter<MultiRecordActionTagEvent>):
        Promise<TourDocRecord[]> {
        if (actionTagEvent.config.type === 'noop') {
            return this.processActionMultiRecordTagEventNoop(actionTagEvent, actionTagEventEmitter);
        } else {
            return super.processActionMultiRecordTagEventUnknown(actionTagEvent, actionTagEventEmitter);
        }
    }

    // TODO move to commons
    protected processActionTagEventNoop(actionTagEvent: ActionTagEvent,
                                        actionTagEventEmitter: EventEmitter<ActionTagEvent>): Promise<TourDocRecord> {
        actionTagEvent.processed = true;
        actionTagEvent.result = actionTagEvent.record;
        actionTagEventEmitter.emit(actionTagEvent);
        return Promise.resolve(<TourDocRecord>actionTagEvent.record);
    }

    // TODO move to commons
    protected processActionMultiRecordTagEventNoop(actionTagEvent: MultiRecordActionTagEvent,
                                                   actionTagEventEmitter: EventEmitter<MultiRecordActionTagEvent>)
        : Promise<TourDocRecord[]> {
        actionTagEvent.processed = true;
        actionTagEvent.results = actionTagEvent.records;
        actionTagEventEmitter.emit(actionTagEvent);
        actionTagEventEmitter.error(actionTagEvent.error);
        return Promise.resolve(<TourDocRecord[]>actionTagEvent.results);
    }

}
