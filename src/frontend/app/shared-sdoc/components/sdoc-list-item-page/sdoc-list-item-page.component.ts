import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChange} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {Layout} from '../sdoc-list/sdoc-list.component';
import {ItemData, SDocContentUtils} from '../../services/sdoc-contentutils.service';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import {ActionTagEvent} from '../sdoc-actiontags/sdoc-actiontags.component';
import {AngularHtmlService} from '../../../../shared/angular-commons/services/angular-html.service';
import {AngularMarkdownService} from '../../../../shared/angular-commons/services/angular-markdown.service';
import {PlatformService} from '../../../../shared/angular-commons/services/platform.service';
import {SDocSearchResult} from '../../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {SDocSearchForm} from '../../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {SDocDataService} from '../../../../shared/sdoc-commons/services/sdoc-data.service';
import {SDocSearchFormConverter} from '../../services/sdoc-searchform-converter.service';

@Component({
    selector: 'app-sdoc-list-item-page',
    templateUrl: './sdoc-list-item-page.component.html',
    styleUrls: ['./sdoc-list-item-page.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocListItemPageComponent implements OnChanges {
    private flgDescRendered = false;
    public contentUtils: SDocContentUtils;
    listItem: ItemData = {
        currentRecord: undefined,
        styleClassFor: undefined,
        thumbnailUrl: undefined,
        previewUrl: undefined,
        image: undefined,
        video: undefined,
        urlShow: undefined,
        tracks: [],
        flgShowMap: false,
        flgShowProfileMap: false,
        flgMapAvailable: false,
        flgProfileMapAvailable: false
    };
    maxImageHeight = '0';
    imageShowMap = false;

    @Input()
    public record: SDocRecord;

    @Input()
    public backToSearchUrl: string;

    @Input()
    public layout: Layout;

    @Input()
    public short? = false;

    @Output()
    public show: EventEmitter<SDocRecord> = new EventEmitter();

    @Output()
    public showImage: EventEmitter<SDocRecord> = new EventEmitter();

    @Output()
    public playerStarted: EventEmitter<SDocRecord> = new EventEmitter();

    @Output()
    public playerStopped: EventEmitter<SDocRecord> = new EventEmitter();

    constructor(contentUtils: SDocContentUtils, private cd: ChangeDetectorRef, private platformService: PlatformService,
                private angularMarkdownService: AngularMarkdownService, private angularHtmlService: AngularHtmlService,
                private sdocDataService: SDocDataService, private searchFormConverter: SDocSearchFormConverter) {
        this.contentUtils = contentUtils;
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            this.updateData();
        }
    }

    submitShow(sdoc: SDocRecord) {
        this.show.emit(sdoc);
        return false;
    }

    onActionTagEvent(event: ActionTagEvent) {
        if (event.result !== undefined) {
            this.record = <SDocRecord>event.result;
            this.updateData();
        }

        return false;
    }

    onVideoStarted() {
        this.playerStarted.emit(this.record);
    }

    onVideoEnded() {
        this.playerStopped.emit(this.record);
    }

    renderDesc(): string {
        if (this.flgDescRendered || !this.record) {
            return;
        }

        if (!this.platformService.isClient()) {
            return this.record.descTxt || '';
        }

        if (this.record.descHtml) {
            this.flgDescRendered = this.angularHtmlService.renderHtml('#desc', this.record.descHtml, true);
        } else {
            const desc = this.record.descMd ? this.record.descMd : '';
            this.flgDescRendered = this.angularMarkdownService.renderMarkdown('#desc', desc, true);
        }

        return '';
    }

    private updateData() {
        const me = this;

        this.contentUtils.updateItemData(this.listItem, this.record, 'page');
        this.maxImageHeight = (window.innerHeight - 150) + 'px';
        if (this.record.type === 'IMAGE' || this.record.type === 'VIDEO') {
            this.listItem.flgShowMap = this.listItem.flgShowMap &&  this.imageShowMap;
            this.listItem.flgShowProfileMap = this.listItem.flgShowProfileMap &&  this.imageShowMap;
        }
        this.cd.markForCheck();

        if (this.record.type === 'TRIP' && (me.listItem.tracks === undefined || me.listItem.tracks.length < 1)) {
            const searchForm = new SDocSearchForm({});
            this.searchFormConverter.paramsToSearchForm(this.contentUtils.getSDocSubItemFiltersForType(this.record, 'TRACK', undefined),
                {}, searchForm);
            this.sdocDataService.search(searchForm, {
                showFacets: false,
                loadTrack: true,
                showForm: false
            }).then(function doneSearch(sdocSearchResult: SDocSearchResult) {
                if (sdocSearchResult !== undefined && sdocSearchResult.recordCount > 0 &&
                    sdocSearchResult.currentRecords[0].tripId === me.listItem.currentRecord.tripId) {
                    // open map only if tripId of searchResut is for current trip: because of async
                    me.listItem.flgShowMap = sdocSearchResult.recordCount > 0;
                    me.listItem.flgShowProfileMap = me.listItem.flgShowMap;
                    me.listItem.tracks = sdocSearchResult.currentRecords;
                }
                me.cd.markForCheck();
            });
        }
    }
}
