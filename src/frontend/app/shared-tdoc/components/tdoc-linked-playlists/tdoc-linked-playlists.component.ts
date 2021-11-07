import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {DomSanitizer} from '@angular/platform-browser';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {TourDocLinkedPlaylistRecord} from '../../../../shared/tdoc-commons/model/records/tdoclinkedplaylist-record';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {TourDocActionTagService} from '../../services/tdoc-actiontag.service';
import {ToastrService} from 'ngx-toastr';
import {TourDocSearchForm} from '../../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {CommonDocLinkedPlaylistsComponent, CommonDocLinkedPlaylistsComponentConfig} from './cdoc-linked-playlists.component';

@Component({
    selector: 'app-tdoc-linked-playlists',
    templateUrl: './cdoc-linked-playlists.component.html',
    styleUrls: ['./cdoc-linked-playlists.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocLinkedPlaylistsComponent extends CommonDocLinkedPlaylistsComponent<TourDocRecord, TourDocSearchForm,
    TourDocSearchResult, TourDocDataService, TourDocActionTagService, TourDocLinkedPlaylistRecord> {

    constructor(sanitizer: DomSanitizer, commonRoutingService: CommonRoutingService,
                cdocRoutingService: CommonDocRoutingService, appService: GenericAppService,
                actionTagService: TourDocActionTagService, toastr: ToastrService,
                cdocDataService: TourDocDataService, cd: ChangeDetectorRef) {
        super(sanitizer, commonRoutingService, cdocRoutingService, appService, actionTagService, toastr, cdocDataService, cd);
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

    protected getComponentConfig(config: {}): CommonDocLinkedPlaylistsComponentConfig {
        let appendAvailable = false;
        if (BeanUtils.getValue(config, 'components.tdoc-linked-playlists.appendAvailable')) {
            appendAvailable = BeanUtils.getValue(config, 'components.tdoc-linked-playlists.appendAvailable');
        }

        let editAvailable = false;
        if (BeanUtils.getValue(config, 'components.tdoc-linked-playlists.editAvailable')) {
            editAvailable = BeanUtils.getValue(config, 'components.tdoc-linked-playlists.editAvailable');
        }

        let showAvailable = false;
        if (BeanUtils.getValue(config, 'components.tdoc-linked-playlists.showAvailable')) {
            showAvailable = BeanUtils.getValue(config, 'components.tdoc-linked-playlists.showAvailable');
        }

        return {
            editAvailable: editAvailable,
            appendAvailable: appendAvailable,
            showAvailable: showAvailable
        };
    }

}
