import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {SDocDataService} from '../../../../shared/sdoc-commons/services/sdoc-data.service';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {ActivatedRoute} from '@angular/router';
import {SDocSearchForm, SDocSearchFormFactory} from '../../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {SDocSearchResult} from '../../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {Facets} from '../../../../shared/search-commons/model/container/facets';
import {SDocSearchFormConverter} from '../../../shared-sdoc/services/sdoc-searchform-converter.service';
import {ToastsManager} from 'ng2-toastr';
import {SDocRoutingService} from '../../../shared-sdoc/services/sdoc-routing.service';
import {ResolvedData} from '../../../../shared/angular-commons/resolver/resolver.utils';
import {ErrorResolver} from '../../../sections/resolver/error.resolver';
import {IdValidationRule} from '../../../../shared/search-commons/model/forms/generic-validator.util';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {PageUtils} from '../../../../shared/angular-commons/services/page.utils';
import {CommonRoutingService, RoutingState} from '../../../../shared/angular-commons/services/common-routing.service';
import {GenericTrackingService} from '../../../../shared/angular-commons/services/generic-tracking.service';
import {SDocAlbumResolver} from '../../../shared-sdoc/resolver/sdoc-album.resolver';
import {AngularMarkdownService} from '../../../../shared/angular-commons/services/angular-markdown.service';
import {AngularHtmlService} from '../../../../shared/angular-commons/services/angular-html.service';
import {PlatformService} from '../../../../shared/angular-commons/services/platform.service';
import {SDocContentUtils} from '../../../shared-sdoc/services/sdoc-contentutils.service';

@Component({
    selector: 'app-sdoc-albumpage',
    templateUrl: './sdoc-albumpage.component.html',
    styleUrls: ['./sdoc-albumpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocAlbumpageComponent implements OnInit, OnDestroy {
    private initialized = false;
    private flgDescRendered = false;
    showLoadingSpinner = false;
    idValidationRule = new IdValidationRule(true);

    public contentUtils: SDocContentUtils;
    searchResult: SDocSearchResult;
    record: SDocRecord;
    searchForm: SDocSearchForm;
    baseSearchUrl = '/sdoc/';
    mode = 'show';
    tracks: SDocRecord[] = [];
    curRecordNr = 0;
    flgShowMap = false;
    flgShowProfileMap = false;
    maxImageHeight = '0';

    constructor(private route: ActivatedRoute, private commonRoutingService: CommonRoutingService, private errorResolver: ErrorResolver,
                private sdocDataService: SDocDataService, private searchFormConverter: SDocSearchFormConverter,
                private sdocRoutingService: SDocRoutingService, private toastr: ToastsManager, vcr: ViewContainerRef,
                private angularMarkdownService: AngularMarkdownService, private angularHtmlService: AngularHtmlService,
                private pageUtils: PageUtils, private cd: ChangeDetectorRef, private trackingProvider: GenericTrackingService,
                private platformService: PlatformService, contentUtils: SDocContentUtils) {
        this.searchForm = new SDocSearchForm({});
        this.searchResult = new SDocSearchResult(this.searchForm, 0, [], new Facets());
        this.toastr.setRootViewContainerRef(vcr);
        this.contentUtils = contentUtils;
    }

    ngOnInit() {
        // reset initialized
        this.initialized = false;
        const me = this;

        this.route.data.subscribe(
            (data: { searchForm: ResolvedData<SDocSearchForm>, flgDoSearch: boolean, baseSearchUrl: ResolvedData<string> }) => {
                me.commonRoutingService.setRoutingState(RoutingState.DONE);

                const flgSearchFormError = ErrorResolver.isResolverError(data.searchForm);
                const flgBaseSearchUrlError = ErrorResolver.isResolverError(data.baseSearchUrl);
                if (!flgSearchFormError && !flgBaseSearchUrlError) {
                    me.baseSearchUrl = (data.baseSearchUrl.data ? data.baseSearchUrl.data : me.baseSearchUrl);

                    // console.log('route: search for ', data);
                    this.searchForm = data.searchForm.data;

                    me.pageUtils.setGlobalStyle('', 'sectionStyle');
                    this.pageUtils.setTranslatedTitle('meta.title.prefix.sdocSearchPage',
                        {}, 'Search');
                    this.pageUtils.setTranslatedDescription('meta.desc.prefix.sdocSearchPage',
                        {}, 'Search');
                    this.pageUtils.setRobots(false, false);
                    this.pageUtils.setMetaLanguage();

                    this.trackingProvider.trackPageView();

                    this.pageUtils.setGlobalStyle('.hide-on-fullpage { display: none; } ' +
                        '.show-on-fullpage-block { display: block; }', 'fullPageStyle');
                    this.pageUtils.setGlobalStyle('body { background: #130b0b; } ', 'albumStyle');

                    return this.doSearch();
                }

                let newUrl, msg, code;
                const errorCode = (flgSearchFormError ? data.searchForm.error.code : data.baseSearchUrl.error.code);
                let searchForm = undefined;
                if (flgSearchFormError) {
                    if (data.searchForm.error.data) {
                        searchForm = SDocSearchFormFactory.createSanitized(data.searchForm.error.data);
                    } else {
                        searchForm = new SDocSearchForm({});
                    }
                } else if (data.searchForm.data) {
                    searchForm = data.searchForm.data;
                }

                switch (errorCode) {
                    case SDocAlbumResolver.ERROR_INVALID_SDOC_SEARCHFORM:
                        code = ErrorResolver.ERROR_INVALID_DATA;
                        me.baseSearchUrl = ['sdoc'].join('/');
                        newUrl = this.searchFormConverter.searchFormToUrl(
                            this.baseSearchUrl + '/', SDocSearchFormFactory.cloneSanitized(searchForm));
                        msg = undefined;
                        break;
                    case GenericAppService.ERROR_APP_NOT_INITIALIZED:
                        code = ErrorResolver.ERROR_APP_NOT_INITIALIZED;
                        newUrl = undefined;
                        msg = undefined;
                        break;
                    default:
                        code = ErrorResolver.ERROR_OTHER;
                        me.baseSearchUrl = ['sdoc'].join('/') + '/';
                        newUrl = undefined;
                        msg = undefined;
                }

                this.errorResolver.redirectAfterRouterError(code, newUrl, this.toastr, msg);
                me.cd.markForCheck();
                return;
            }
        );
    }

    ngOnDestroy() {
    }

    onCurRecordChange(page: number) {
        this.curRecordNr = page;
        this.loadRecord(this.curRecordNr);
        this.cd.markForCheck();
        return false;
    }

    onShowSDoc(sdoc: SDocRecord) {
        this.sdocRoutingService.navigateToShow(sdoc, this.sdocRoutingService.getLastSearchUrl());
        return false;
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

    private doSearch() {
        this.sdocRoutingService.setLastBaseUrl(this.baseSearchUrl);
        this.sdocRoutingService.setLastSearchUrl(this.route.toString());

        const ids = this.searchForm.moreFilter.replace(/id:/g, '').split(',');
        const idTypeMap = {};
        for (const id of ids) {
            let [type] = id.split('_');
            type = type.toLowerCase();
            if (idTypeMap[type] === undefined) {
                idTypeMap[type] = {};
            }
        }

        const me = this;
        me.showLoadingSpinner = true;
        me.searchResult = new SDocSearchResult(me.searchForm, 0, [], undefined);
        me.record = undefined;
        me.flgDescRendered = false;
        me.tracks = [];
        me.flgShowMap = false;
        me.flgShowProfileMap = false;
        me.cd.markForCheck();

        const promises: Promise<SDocSearchResult>[] = [];
        for (const type in idTypeMap) {
            const typeSearchForm = SDocSearchFormFactory.cloneSanitized(this.searchForm);
            typeSearchForm.type = type;
            typeSearchForm.perPage = 99;
            promises.push(this.sdocDataService.search(typeSearchForm, {
                showFacets: false,
                loadTrack: true,
                showForm: false
            }));
        }

        Promise.all(promises).then(function doneSearch(sdocSearchResults: SDocSearchResult[]) {
            const records: SDocRecord[] = [];
            sdocSearchResults.forEach(sdocSearchResult => {
                for (const sdoc of sdocSearchResult.currentRecords) {
                    let [type] = sdoc.id.split('_');
                    type = type.toLowerCase();
                    idTypeMap[type][sdoc.id] = sdoc;
                }
            });
            for (const id of ids) {
                let [type] = id.split('_');
                type = type.toLowerCase();
                if (idTypeMap[type][id] !== undefined) {
                    records.push(idTypeMap[type][id]);
                }
            }

            const sdocSearchResult = new SDocSearchResult(me.searchForm, records.length + 1, records, undefined);
            me.initialized = true;
            me.searchResult = sdocSearchResult;
            me.loadRecord(1);
            me.showLoadingSpinner = false;
            me.cd.markForCheck();
        }).catch(function errorSearch(reason) {
            me.toastr.error('Es gibt leider Probleme bei der Suche - am besten noch einmal probieren :-(', 'Oje!');
            console.error('doSearch failed:', reason);
            me.showLoadingSpinner = false;
            me.cd.markForCheck();
        });
    }

    private loadRecord(nr: number): void {
        this.record = undefined;
        this.flgDescRendered = false;
        if (this.searchResult !== undefined && this.searchResult.currentRecords.length >= nr) {
            this.record = this.searchResult.currentRecords[nr - 1];
        }

        if (this.record !== undefined && (this.record.gpsTrackBasefile || this.record.geoLoc !== undefined
            || (this.record.gpsTrackSrc !== undefined && this.record.gpsTrackSrc.length > 20))) {
            this.tracks = [this.record];
            this.flgShowMap = true;
            this.flgShowProfileMap = (this.record.gpsTrackBasefile !== undefined
                || (this.record.gpsTrackSrc !== undefined && this.record.gpsTrackSrc.length > 20));
        } else {
            this.tracks = [];
            this.flgShowMap = false;
            this.flgShowProfileMap = false;
        }

        this.maxImageHeight = (window.innerHeight - 200) + 'px';
    }
}
