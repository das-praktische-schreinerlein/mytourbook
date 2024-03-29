import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {DomSanitizer} from '@angular/platform-browser';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {TourDocLinkedPlaylistRecord} from '../../../../shared/tdoc-commons/model/records/tdoclinkedplaylist-record';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {TourDocActionTagService} from '../../services/tdoc-actiontag.service';
import {ToastrService} from 'ngx-toastr';
import {TourDocSearchForm} from '../../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {
    CommonDocLinkedPlaylistsComponent
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-linked-playlists/cdoc-linked-playlists.component';
import {TourDocRoutingService} from '../../../../shared/tdoc-commons/services/tdoc-routing.service';

@Component({
    selector: 'app-tdoc-linked-playlists',
    templateUrl: './../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-linked-playlists/cdoc-linked-playlists.component.html',
    styleUrls: ['./../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-linked-playlists/cdoc-linked-playlists.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocLinkedPlaylistsComponent extends CommonDocLinkedPlaylistsComponent<TourDocRecord, TourDocSearchForm,
    TourDocSearchResult, TourDocDataService, TourDocActionTagService, TourDocLinkedPlaylistRecord> {

    constructor(sanitizer: DomSanitizer, commonRoutingService: CommonRoutingService,
                protected tdocRoutingService: TourDocRoutingService, appService: GenericAppService,
                actionTagService: TourDocActionTagService, toastr: ToastrService,
                cdocDataService: TourDocDataService, cd: ChangeDetectorRef) {
        super(sanitizer, commonRoutingService, tdocRoutingService, appService, actionTagService, toastr, cdocDataService, cd);
    }

    protected updateData(): void {
        if (this.record === undefined || this.record['tdoclinkedplaylists'] === undefined
            || this.record['tdoclinkedplaylists'].length <= 0) {
            this.linkedPlaylists = [];
            this.maxPlaylistValues = {};
            return;
        }

        this.maxPlaylistValues = {};
        this.linkedPlaylists = this.record['tdoclinkedplaylists'];
    }

    public submitShow(event, linkedPlaylist: TourDocLinkedPlaylistRecord): boolean {
        this.tdocRoutingService.navigateToShow(this.generateRecord(linkedPlaylist), '');
        return false;
    }

    private generateRecord(linkedPlaylist: TourDocLinkedPlaylistRecord): TourDocRecord {
        return this.cdocDataService.newRecord({id: 'PLAYLIST_' + linkedPlaylist.refId,
            name: linkedPlaylist.name, type: 'PLAYLIST'});
    }
}
