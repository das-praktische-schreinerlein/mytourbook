import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {ToastrService} from 'ngx-toastr';
import {TourDocSearchResult} from '../../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {TourDocSearchForm} from '../../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {TourDocLinkedPlaylistRecord} from '../../../../shared/tdoc-commons/model/records/tdoclinkedplaylist-record';
import {ActionTagEvent} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-actiontags/cdoc-actiontags.component';
import {TourDocActionTagService} from '../../../shared-tdoc/services/tdoc-actiontag.service';
import {TourDocExtendedObjectPropertyRecord} from '../../../../shared/tdoc-commons/model/records/tdocextendedobjectproperty-record';

export interface TourDocManagePlaylistEntryType {
    position: number,
    details: string,
    record: TourDocRecord
}

@Component({
    selector: 'app-tdoc-manage-playlist-entries',
    templateUrl: './tdoc-manage-playlist-entries.component.html',
    styleUrls: ['./tdoc-manage-playlist-entries.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocManagePlaylistEntriesComponent extends AbstractInlineComponent {
    showLoadingSpinner = false;
    searchForm: TourDocSearchForm;
    listSearchResult: TourDocSearchResult;
    playlistEntries: TourDocManagePlaylistEntryType[] = [];


    @Input()
    public record: TourDocRecord;

    @Input()
    public availableTypes: string[] = [];

    @Output()
    public actionTagEvent: EventEmitter<ActionTagEvent> = new EventEmitter();

    constructor(protected cd: ChangeDetectorRef, protected sanitizer: DomSanitizer, protected toastr: ToastrService,
                protected cdocDataService: TourDocDataService,
                protected actionTagService: TourDocActionTagService,
                protected cdocRoutingService: CommonDocRoutingService) {
        super(cd);
        this.searchForm = this.initSearchForm();
    }

    public submitShow(event, record: TourDocRecord): boolean {
        this.cdocRoutingService.navigateToShow(record, '');
        return false;
    }

    public getShowUrl(record: TourDocRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(this.getUrl(record));
    }

    public submitChangePosition(event, linkedPlaylist: TourDocManagePlaylistEntryType): boolean {
        this.processAction({ config: {
                key: 'assignplaylist',
                name: 'assignplaylist',
                shortName: 'assignplaylist',
                type: 'assignplaylist',
                payload: {
                    playlistkey: this.record.name,
                    set: true,
                    position: linkedPlaylist.position,
                    details: linkedPlaylist.details
                },
                showFilter: [],
                configAvailability: [],
                multiRecordTag: false,
                recordAvailability: [],
                profileAvailability: []
            },
            set: true,
            record: linkedPlaylist.record,
            processed: false,
            error: undefined,
            result: undefined });

        return false;
    }

    onPageChange(page: number) {
        this.searchForm.pageNum = +page;
        this.updateData();

        return false;
    }

    onPerPageChange(perPage: number) {
        this.searchForm.perPage = perPage;
        this.searchForm.pageNum = 1;
        this.updateData();

        return false;
    }


    protected initSearchForm(): TourDocSearchForm {
        const searchForm = this.cdocDataService.newSearchForm({});
        searchForm.perPage = 20;
        searchForm.pageNum = 1;
        searchForm.sort = 'playlistPos';

        return searchForm;
    }
    protected updateData(): void {
        const me = this;

        me.searchForm.playlists = '';
        me.listSearchResult =  this.cdocDataService.newSearchResult(me.searchForm, 0, [], undefined);
        me.playlistEntries = [];

        if (this.record === undefined || this.record.id === undefined) {
            me.searchForm.playlists = this.record.name;
            return;
        }

        me.showLoadingSpinner = true;
        me.cd.markForCheck();


        const typesCount = {};
        for (const recordProp of <TourDocExtendedObjectPropertyRecord[]>this.record['tdocextendedobjectproperties']) {
            const type = recordProp.name.replace('_COUNT', '');
            if (this.availableTypes.includes(type)) {
                typesCount[type] =  typesCount[type]
                    ?  typesCount[type]
                    : 0;
                typesCount[type] += Number.parseInt(recordProp.value, 10);
            }
        }

        me.searchForm.type = Object.keys(typesCount).map(key => key.toUpperCase()).join(',') || 'PLAYLIST';

        me.cdocDataService.doMultiPlaylistSearch(me.searchForm, this.record.name, typesCount).then(
            (cdocSearchResult: TourDocSearchResult) => {
                me.loadListResult(me.searchForm, cdocSearchResult);
                me.showLoadingSpinner = false;
                me.cd.markForCheck();
            }).catch((reason) => {
            me.toastr.error('Es gibt leider Probleme bei der Suche - am besten noch einmal probieren :-(', 'Oje!');
            console.error('doSearch failed:', reason);
            me.showLoadingSpinner = false;
            me.cd.markForCheck();
        });
    }

    protected loadListResult(searchForm: TourDocSearchForm, searchResult: TourDocSearchResult): void {
        let allRecords: TourDocManagePlaylistEntryType[] = []
        searchResult.currentRecords.forEach((playlistEntry: TourDocRecord) => {
            let position = undefined;
            let details = undefined;
            for (const playlistEntryRecord of <TourDocLinkedPlaylistRecord[]>playlistEntry['tdoclinkedplaylists']) {
                if (playlistEntryRecord.name === this.record.name) {
                    position = playlistEntryRecord.position;
                    details = playlistEntryRecord.details !== undefined
                    && playlistEntryRecord.details !== null
                    && playlistEntryRecord.details !== 'null'
                        ? playlistEntryRecord.details
                        : undefined;
                }
            }

            allRecords.push({position: position, record: playlistEntry, details: details });
        });

        allRecords = allRecords.sort((a, b) => {
            return a.position - b.position;
        });
        console.error("listRecords", allRecords);

        const listRecords = allRecords.slice(
            (searchForm.pageNum - 1) * searchForm.perPage,
            Math.min(searchForm.pageNum * searchForm.perPage, searchResult.recordCount));
        console.error("allRecords", listRecords);
        const listSearchResult: TourDocSearchResult = this.cdocDataService.newSearchResult(searchForm, searchResult.recordCount,
            listRecords.map(listRecord => listRecord.record), undefined);

        this.listSearchResult = listSearchResult;
        this.playlistEntries = listRecords;
    }

    protected processAction(actionTagEvent: ActionTagEvent): Promise<void> {
        return this.actionTagService.processActionTagEvent(actionTagEvent, this.actionTagEvent).then(value => {
            this.updateData();
        }).catch(reason => {
            this.toastr.error('Es gibt leider Probleme - am besten noch einmal probieren :-(', 'Oje!');
        });
    }


    protected getUrl(record: any): string {
        return this.cdocRoutingService.getShowUrl(record, '');
    }

}
