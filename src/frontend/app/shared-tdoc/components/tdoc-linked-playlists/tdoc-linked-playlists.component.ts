import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {TourDocLinkedPlaylistRecord} from '../../../../shared/tdoc-commons/model/records/tdoclinkedplaylist-record';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {AppState, GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {ActionTagEvent} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-actiontags/cdoc-actiontags.component';
import {TourDocActionTagService} from '../../services/tdoc-actiontag.service';
import {ToastrService} from 'ngx-toastr';

export interface TourDocLinkedPlaylistsComponentConfig {
    appendAvailable: boolean;
    editAvailable: boolean;
    showAvailable: boolean;
}

@Component({
    selector: 'app-tdoc-linked-playlists',
    templateUrl: './tdoc-linked-playlists.component.html',
    styleUrls: ['./tdoc-linked-playlists.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocLinkedPlaylistsComponent extends AbstractInlineComponent implements OnInit {
    appendAvailable = false;
    editAvailable = false;
    linkedPlaylists: TourDocLinkedPlaylistRecord[];
    showAvailable = false;

    @Input()
    public record: TourDocRecord;

    @Input()
    public small ? = false;

    @Output()
    public actionTagEvent: EventEmitter<ActionTagEvent> = new EventEmitter();

    constructor(private sanitizer: DomSanitizer, private commonRoutingService: CommonRoutingService,
                private cdocRoutingService: CommonDocRoutingService, protected appService: GenericAppService,
                protected actionTagService: TourDocActionTagService, protected toastr: ToastrService,
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

    public submitShow(event, playlist: TourDocLinkedPlaylistRecord): boolean {
        this.commonRoutingService.navigateByUrl(this.getUrl(playlist));
        return false;
    }

    public submitChangePosition(event, playlist: TourDocLinkedPlaylistRecord): boolean {
        this.processAction({ config: {
                key: 'assignplaylist',
                name: 'assignplaylist',
                shortName: 'assignplaylist',
                type: 'assignplaylist',
                payload: {
                    playlistkey: playlist.name,
                    set: true,
                    position: playlist.position
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


    public getShowUrl(playlist: TourDocLinkedPlaylistRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(this.getUrl(playlist));
    }

    protected updateData(): void {
        if (this.record === undefined || this.record['tdoclinkedplaylists'] === undefined
            || this.record['tdoclinkedplaylists'].length <= 0) {
            this.linkedPlaylists = [];
            return;
        }

        this.linkedPlaylists = this.record['tdoclinkedplaylists'];
    }

    protected configureComponent(config: {}): void {
        const componentConfig = this.getComponentConfig(config);

        this.appendAvailable = componentConfig.appendAvailable;
        this.editAvailable = componentConfig.editAvailable;
        this.showAvailable = componentConfig.showAvailable;
    }


    protected getComponentConfig(config: {}): TourDocLinkedPlaylistsComponentConfig {
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

    private getUrl(playlist: TourDocLinkedPlaylistRecord): string {
        return this.cdocRoutingService.getShowUrl(new TourDocRecord({id: 'PLAYLIST_' + playlist.refId,
            name: playlist.name, type: 'PLAYLIST'}), '');
    }

}
