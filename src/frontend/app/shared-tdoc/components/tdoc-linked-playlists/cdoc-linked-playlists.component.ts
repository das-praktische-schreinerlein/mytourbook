import {ChangeDetectorRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {AppState, GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {ActionTagEvent} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-actiontags/cdoc-actiontags.component';
import {ToastrService} from 'ngx-toastr';
import {CommonDocRecord} from '@dps/mycms-commons/dist/search-commons/model/records/cdoc-entity-record';
import {CommonDocSearchForm} from '@dps/mycms-commons/dist/search-commons/model/forms/cdoc-searchform';
import {CommonDocSearchResult} from '@dps/mycms-commons/dist/search-commons/model/container/cdoc-searchresult';
import {CommonDocDataService} from '@dps/mycms-commons/dist/search-commons/services/cdoc-data.service';
import {CommonDocActionTagService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-actiontag.service';
import {BaseLinkedPlaylistRecord} from '@dps/mycms-commons/dist/search-commons/model/records/baselinkedplaylist-record';

export interface CommonDocLinkedPlaylistsComponentConfig {
    appendAvailable: boolean;
    editAvailable: boolean;
    showAvailable: boolean;
}

export abstract class CommonDocLinkedPlaylistsComponent<R extends CommonDocRecord, F extends CommonDocSearchForm,
    S extends CommonDocSearchResult<R, F>, D extends CommonDocDataService<R, F, S>,
    A extends CommonDocActionTagService <R, F, S, D>, P extends BaseLinkedPlaylistRecord>
    extends AbstractInlineComponent implements OnInit {

    appendAvailable = false;
    editAvailable = false;
    linkedPlaylists: P[];
    showAvailable = false;

    @Input()
    public record: R;

    @Input()
    public small ? = false;

    @Output()
    public actionTagEvent: EventEmitter<ActionTagEvent> = new EventEmitter();

    constructor(private sanitizer: DomSanitizer, private commonRoutingService: CommonRoutingService,
                private cdocRoutingService: CommonDocRoutingService, protected appService: GenericAppService,
                protected actionTagService: A, protected toastr: ToastrService, protected cdocDataService: D,
                protected cd: ChangeDetectorRef) {
        super(cd);
    }

    ngOnInit() {
        this.appService.getAppState().subscribe(appState => {
            if (appState === AppState.Ready) {
                const config = this.appService.getAppConfig();
                this.configureComponent(config);
                this.updateData();
            }
        });
    }

    public submitShow(event, linkedPlaylist: P): boolean {
        this.commonRoutingService.navigateByUrl(this.getUrl(linkedPlaylist));
        return false;
    }

    public submitChangePosition(event, linkedPlaylist: P): boolean {
        this.processAction({ config: {
                key: 'assignplaylist',
                name: 'assignplaylist',
                shortName: 'assignplaylist',
                type: 'assignplaylist',
                payload: {
                    playlistkey: linkedPlaylist.name,
                    set: true,
                    position: linkedPlaylist.position
                },
                showFilter: [],
                configAvailability: [],
                multiRecordTag: false,
                recordAvailability: [],
                profileAvailability: []
            },
            set: true,
            record: this.record,
            processed: false,
            error: undefined,
            result: undefined });

        return false;
    }

    public submitAddToPlaylist(event): boolean {
        this.processAction({ config: {
                key: 'assignplaylist',
                name: 'assignplaylist',
                shortName: 'assignplaylist',
                type: 'assignplaylist',
                payload: {
                    playlistkey: undefined,
                    set: true,
                    position: undefined
                },
                showFilter: [],
                configAvailability: [],
                multiRecordTag: false,
                recordAvailability: [],
                profileAvailability: []
            },
            set: true,
            record: this.record,
            processed: false,
            error: undefined,
            result: undefined });

        return false;
    }

    protected processAction(actionTagEvent: ActionTagEvent): Promise<void> {
        return this.actionTagService.processActionTagEvent(actionTagEvent, this.actionTagEvent).then(value => {
            this.updateData();
        }).catch(reason => {
            this.toastr.error('Es gibt leider Probleme - am besten noch einmal probieren :-(', 'Oje!');
        });
    }


    public getShowUrl(linkedPlaylist: P): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(this.getUrl(linkedPlaylist));
    }

    protected abstract updateData();

    protected configureComponent(config: {}): void {
        const componentConfig = this.getComponentConfig(config);

        this.appendAvailable = componentConfig.appendAvailable;
        this.editAvailable = componentConfig.editAvailable;
        this.showAvailable = componentConfig.showAvailable;
    }


    protected getComponentConfig(config: {}): CommonDocLinkedPlaylistsComponentConfig {
        let appendAvailable = false;
        if (BeanUtils.getValue(config, 'components.cdoc-linked-playlists.appendAvailable')) {
            appendAvailable = BeanUtils.getValue(config, 'components.cdoc-linked-playlists.appendAvailable');
        }

        let editAvailable = false;
        if (BeanUtils.getValue(config, 'components.cdoc-linked-playlists.editAvailable')) {
            editAvailable = BeanUtils.getValue(config, 'components.cdoc-linked-playlists.editAvailable');
        }

        let showAvailable = false;
        if (BeanUtils.getValue(config, 'components.cdoc-linked-playlists.showAvailable')) {
            showAvailable = BeanUtils.getValue(config, 'components.cdoc-linked-playlists.showAvailable');
        }

        return {
            editAvailable: editAvailable,
            appendAvailable: appendAvailable,
            showAvailable: showAvailable
        };
    }

    private getUrl(linkedPlaylist: P): string {
        return this.cdocRoutingService.getShowUrl(this.cdocDataService.newRecord({id: 'PLAYLIST_' + linkedPlaylist.refId,
            name: linkedPlaylist.name, type: 'PLAYLIST'}), '');
    }

}
