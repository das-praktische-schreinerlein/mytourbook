import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {Layout} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {AngularHtmlService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-html.service';
import {AngularMarkdownService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-markdown.service';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {TourDocSearchResult} from '../../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {TourDocSearchForm} from '../../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {TourDocSearchFormConverter} from '../../services/tdoc-searchform-converter.service';
import {TourDocContentUtils, TourDocItemData} from '../../services/tdoc-contentutils.service';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {ActionTagEvent} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-actiontags/cdoc-actiontags.component';
import {TourDocMediaMetaRecord} from '../../../../shared/tdoc-commons/model/records/tdocmediameta-record';

const CONST_WITH_PUFFER = 72;
const CONST_HEIGHT_PUFFER = 60;

@Component({
    selector: 'app-tdoc-list-item-page',
    templateUrl: './tdoc-list-item-page.component.html',
    styleUrls: ['./tdoc-list-item-page.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocListItemPageComponent extends AbstractInlineComponent {
    private flgDescRendered = false;
    public contentUtils: TourDocContentUtils;
    listItem: TourDocItemData = {
        currentRecord: undefined,
        styleClassFor: undefined,
        thumbnailUrl: undefined,
        previewUrl: undefined,
        fullUrl: undefined,
        image: undefined,
        video: undefined,
        urlShow: undefined,
        tracks: [],
        flgShowMap: false,
        flgShowProfileMap: false,
        flgMapAvailable: false,
        flgProfileMapAvailable: false
    };

    @ViewChild('mainImageContainer')
    mainImageContainer: ElementRef;

    @ViewChild('mainImage')
    mainImage: ElementRef;
    imageWidth = 600;
    maxImageWidth = 0;
    maxImageHeight = 0;
    imageShowMap = false;
    descSelector = '#desc';

    @Input()
    public record: TourDocRecord;

    @Input()
    public backToSearchUrl: string;

    @Input()
    public layout: Layout;

    @Input()
    public short ? = false;

    @Input()
    public showItemObjectsFlag ? = false;

    @Output()
    public show: EventEmitter<TourDocRecord> = new EventEmitter();

    @Output()
    public showImage: EventEmitter<TourDocRecord> = new EventEmitter();

    @Output()
    public playerStarted: EventEmitter<TourDocRecord> = new EventEmitter();

    @Output()
    public playerStopped: EventEmitter<TourDocRecord> = new EventEmitter();

    constructor(contentUtils: TourDocContentUtils, protected cd: ChangeDetectorRef, private platformService: PlatformService,
                private angularMarkdownService: AngularMarkdownService, private angularHtmlService: AngularHtmlService,
                private tdocDataService: TourDocDataService, private searchFormConverter: TourDocSearchFormConverter,
                ) {
        super(cd);
        this.contentUtils = contentUtils;
    }

    submitShow(tdoc: TourDocRecord) {
        this.show.emit(tdoc);
        return false;
    }

    onActionTagEvent(event: ActionTagEvent) {
        if (event.result !== undefined) {
            this.record = <TourDocRecord>event.result;
            this.updateData();
        }

        return false;
    }

    onResizeMainImage() {
        this.setMaxImageHeight();

        let flgChanged = false
        if (this.mainImage !== undefined && this.mainImage.nativeElement['width'] !== this.imageWidth) {
            this.imageWidth = this.mainImage.nativeElement['width'];
            flgChanged = true;
        }

        if (this.mainImageContainer !== undefined && this.mainImageContainer.nativeElement['clientWidth'] > this.maxImageWidth) {
            this.maxImageWidth = this.mainImageContainer.nativeElement['clientWidth'] - CONST_WITH_PUFFER;
            flgChanged = true;
        }

        if (flgChanged) {
            this.cd.markForCheck();
        }
    }

    onVideoStarted() {
        this.playerStarted.emit(this.record);
    }

    onVideoEnded() {
        this.playerStopped.emit(this.record);
    }

    renderDesc(): string {
        if (!this.record) {
            if (!this.flgDescRendered) {
                return '';
            }

            this.setDesc(this.descSelector, '');
            this.flgDescRendered = false;
            return '';
        }

        if (this.flgDescRendered) {
            return '';
        }

        if (this.record && (this.record.descMd === undefined || this.record.descMd.toLowerCase() === 'tododesc')) {
            this.setDesc(this.descSelector, '');
            this.flgDescRendered = false;
            return '';
        }

        if (!this.platformService.isClient()) {
            this.setDesc(this.descSelector, this.record.descHtml || this.record.descTxt || this.record.descMd || '');
            this.flgDescRendered = false;
            return '';
        }

        if (this.record.descHtml) {
            this.flgDescRendered = this.angularHtmlService.renderHtml(this.descSelector, this.record.descHtml, true);
        } else {
            const desc = this.record.descMd ? this.record.descMd : '';
            this.flgDescRendered = this.angularMarkdownService.renderMarkdown(this.descSelector, desc, true);
        }

        return '';
    }

    setDesc(descSelector: string, html: string) {
        const inputEl = document.querySelector(descSelector);
        if (!inputEl || inputEl === undefined || inputEl === null) {
            return false;
        }

        inputEl.innerHTML = html;
    }

    getRotateFlag(tdocmediameta: TourDocMediaMetaRecord) {
        return tdocmediameta.metadata.indexOf('Orientation":6') > 0 || tdocmediameta.metadata.indexOf('Orientation":8') > 0;
    }

    protected setMaxImageHeight(): void {
        let newMaxImageHeight = this.maxImageHeight;
        if (this.mainImageContainer !== undefined && this.mainImageContainer.nativeElement['offsetTop']) {
            newMaxImageHeight = (window.innerHeight - this.mainImageContainer.nativeElement['offsetTop'] - CONST_HEIGHT_PUFFER);
        } else {
            newMaxImageHeight = (window.innerHeight - 150);
        }

        if (this.maxImageHeight !== newMaxImageHeight) {
            this.maxImageHeight = newMaxImageHeight;
        }
    }

    protected updateData(): void {
        const me = this;

        this.contentUtils.updateItemData(this.listItem, this.record, 'page');
        this.setMaxImageHeight();
        if (this.record.type === 'IMAGE' || this.record.type === 'VIDEO') {
            this.listItem.flgShowMap = this.listItem.flgShowMap &&  this.imageShowMap;
            this.listItem.flgShowProfileMap = this.listItem.flgShowProfileMap &&  this.imageShowMap;
        }
        this.cd.markForCheck();

        if (this.record.type === 'TRIP' && (me.listItem.tracks === undefined || me.listItem.tracks.length < 1)) {
            const searchForm = new TourDocSearchForm({});
            this.searchFormConverter.paramsToSearchForm(this.contentUtils.getTourDocSubItemFiltersForType(this.record, 'TRACK', undefined),
                {}, searchForm);
            this.tdocDataService.search(searchForm, {
                loadDetailsMode: 'details',
                showFacets: false,
                loadTrack: true,
                showForm: false
            }).then(function doneSearch(tdocSearchResult: TourDocSearchResult) {
                if (tdocSearchResult !== undefined && tdocSearchResult.recordCount > 0 &&
                    tdocSearchResult.currentRecords[0].tripId === (<TourDocRecord>me.listItem.currentRecord).tripId) {
                    // open map only if tripId of searchResut is for current trip: because of async
                    me.listItem.flgShowMap = tdocSearchResult.recordCount > 0;
                    me.listItem.flgShowProfileMap = me.listItem.flgShowMap;
                    me.listItem.tracks = tdocSearchResult.currentRecords;
                }
                me.cd.markForCheck();
            });
        }
    }
}
