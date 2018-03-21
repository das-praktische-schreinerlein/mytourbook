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
import {IdCsvValidationRule, IdValidationRule} from '../../../../shared/search-commons/model/forms/generic-validator.util';
import {AppState, GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {PageUtils} from '../../../../shared/angular-commons/services/page.utils';
import {CommonRoutingService, RoutingState} from '../../../../shared/angular-commons/services/common-routing.service';
import {GenericTrackingService} from '../../../../shared/angular-commons/services/generic-tracking.service';
import {SDocAlbumResolver} from '../../../shared-sdoc/resolver/sdoc-album.resolver';
import {Layout} from '../../../shared-sdoc/components/sdoc-list/sdoc-list.component';
import {FormBuilder} from '@angular/forms';
import {SDocAlbumService} from '../../../shared-sdoc/services/sdoc-album.service';
import {BeanUtils} from '../../../../shared/commons/utils/bean.utils';

@Component({
    selector: 'app-sdoc-albumpage',
    templateUrl: './sdoc-albumpage.component.html',
    styleUrls: ['./sdoc-albumpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocAlbumpageComponent implements OnInit, OnDestroy {
    private config;
    private initialized = false;
    private idCsvValidationRule = new IdCsvValidationRule(true);

    showLoadingSpinner = false;
    idValidationRule = new IdValidationRule(true);

    searchResult: SDocSearchResult;
    listSearchResult: SDocSearchResult;
    record: SDocRecord;
    searchForm: SDocSearchForm;
    listSearchForm: SDocSearchForm;
    baseSearchUrl = '/sdoc/';
    mode = 'show';
    layout = Layout.FLAT;
    curRecordNr = 0;
    albumKey = 'Current';
    autoPlayAllowed = false;

    public editFormGroup = this.fb.group({
        albumSdocIds: ''
    });

    constructor(private route: ActivatedRoute, private commonRoutingService: CommonRoutingService, private errorResolver: ErrorResolver,
                private sdocDataService: SDocDataService, private searchFormConverter: SDocSearchFormConverter,
                private sdocRoutingService: SDocRoutingService, private toastr: ToastsManager, vcr: ViewContainerRef,
                private pageUtils: PageUtils, private cd: ChangeDetectorRef, private trackingProvider: GenericTrackingService,
                public fb: FormBuilder, private sdocAlbumService: SDocAlbumService, private appService: GenericAppService) {
        this.searchForm = new SDocSearchForm({});
        this.listSearchForm = new SDocSearchForm({});
        this.searchResult = new SDocSearchResult(this.searchForm, 0, [], new Facets());
        this.listSearchResult = new SDocSearchResult(this.listSearchForm, 0, [], new Facets());
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        // reset initialized
        this.initialized = false;
        const me = this;

        this.appService.getAppState().subscribe(appState => {
            if (appState === AppState.Ready) {
                this.config = this.appService.getAppConfig();
                if (!(this.config && this.config['sdocMaxItemsPerAlbum'] > 0)) {
                    console.warn('album not allowed');
                    this.record = undefined;
                    this.searchForm = undefined;
                    this.listSearchForm = undefined;

                    this.errorResolver.redirectAfterRouterError(ErrorResolver.ERROR_READONLY, undefined, this.toastr, undefined);
                    me.cd.markForCheck();
                    return;
                }

                if (BeanUtils.getValue(this.config, 'permissions.allowAutoPlay') &&
                    BeanUtils.getValue(this.config, 'components.sdoc-albumpage.allowAutoplay') + '' === 'true') {
                    this.autoPlayAllowed = true;
                }

                this.route.data.subscribe(
                (data: { searchForm: ResolvedData<SDocSearchForm>, flgDoEdit: boolean, baseSearchUrl: ResolvedData<string> }) => {
                    me.commonRoutingService.setRoutingState(RoutingState.DONE);

                    const flgSearchFormError = ErrorResolver.isResolverError(data.searchForm);
                    const flgBaseSearchUrlError = ErrorResolver.isResolverError(data.baseSearchUrl);
                    if (!flgSearchFormError && !flgBaseSearchUrlError) {
                        me.baseSearchUrl = (data.baseSearchUrl.data ? data.baseSearchUrl.data : me.baseSearchUrl);

                        if (data.flgDoEdit === true) {
                            me.mode = 'edit';
                        }

                        // console.log('route: search for ', data);
                        this.searchForm = SDocSearchFormFactory.cloneSanitized(data.searchForm.data);
                        this.listSearchForm = SDocSearchFormFactory.cloneSanitized(data.searchForm.data);

                        me.pageUtils.setGlobalStyle('', 'sectionStyle');
                        this.pageUtils.setTranslatedTitle('meta.title.prefix.sdocSearchPage',
                            {}, 'Search');
                        this.pageUtils.setTranslatedDescription('meta.desc.prefix.sdocSearchPage',
                            {}, 'Search');
                        this.pageUtils.setRobots(false, false);
                        this.pageUtils.setMetaLanguage();

                        this.trackingProvider.trackPageView();

                        this.pageUtils.setGlobalStyle('.hide-on-fullpage { display: none; } ' +
                            '.show-on-fullpage-block { display: block; } ' +
                            'body { background: #130b0b; } ' +
                            '.image-content-container {background: #130b0b !IMPORTANT; border: none !IMPORTANT;} ', 'fullPageStyle');

                        me.curRecordNr = this.listSearchForm.pageNum;
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
                });
            }
        });
    }

    ngOnDestroy() {
    }

    onCurRecordChange(page: number) {
        if (page < 1) {
            page = 1;
        }
        if (page >= this.listSearchResult.recordCount) {
            page = 1;
        }
        this.curRecordNr = page;
        this.loadRecord(this.curRecordNr);
        this.cd.markForCheck();
        this.pageUtils.scrollToTop();

        return false;
    }

    onShowSDoc(sdoc: SDocRecord) {
        this.sdocRoutingService.navigateToShow(sdoc, this.sdocRoutingService.getLastSearchUrl());
        return false;
    }

    onPageChange(page: number) {
        if (!this.initialized) {
            // ignore changes if not initialized
            return;
        }

        this.listSearchForm.pageNum = +page;
        this.loadListResult();
        this.cd.markForCheck();
        this.pageUtils.scrollToTop();

        return false;
    }

    onPerPageChange(perPage: number) {
        if (!this.initialized) {
            // ignore changes if not initialized
            return;
        }

        this.listSearchForm.perPage = perPage;
        this.listSearchForm.pageNum = 1;
        if (perPage + '' === '1') {
            this.doShow();
        }
        this.loadListResult();
        this.cd.markForCheck();
        this.pageUtils.scrollToTop();

        return false;
    }

    onSortChange(sort: string) {
        if (!this.initialized) {
            // ignore changes if not initialized
            return;
        }

        this.listSearchForm.sort = sort;
        this.listSearchForm.pageNum = 1;
        this.searchForm.sort = sort;
        this.doSearch();

        return false;
    }

    onLayoutChange(layout: Layout) {
        if (!this.initialized) {
            // ignore changes if not initialized
            return;
        }

        this.layout = layout;
        if (layout.toString() === Layout.PAGE.toString()) {
            this.doShow();
        } else if (this.listSearchForm.perPage === 1) {
            this.onPerPageChange(10);
        }

        this.loadListResult();
        this.cd.markForCheck();
        this.pageUtils.scrollToTop();

        return false;
    }

    submitSave(event: Event): boolean {
        const ids = this.editFormGroup.getRawValue()['albumSdocIds'];
        if (this.idCsvValidationRule.isValid(ids)) {
            this.sdocAlbumService.removeSdocIds(this.albumKey);
            for (const id of ids.split(',')) {
                this.sdocAlbumService.addIdToAlbum(this.albumKey, id);
            }
            this.doShow();
        }

        return false;
    }

    doEdit(): boolean {
        this.commonRoutingService.navigateByUrl(['sdoc/album/edit', this.albumKey, this.listSearchForm.sort, 10,
            Math.round(this.curRecordNr / 10) || 1].join('/'));
        return false;
    }

    doShow(): boolean {
        this.commonRoutingService.navigateByUrl(['sdoc/album/show', this.albumKey, this.listSearchForm.sort, 1,
            this.listSearchForm.pageNum * this.listSearchForm.perPage].join('/'));
        return false;
    }

    onAlbumIntervalNext(): boolean {
        const me = this;
        me.onCurRecordChange(me.curRecordNr + 1);
        this.searchForm.pageNum = this.curRecordNr;
        this.listSearchForm.pageNum = this.curRecordNr;

        return false;
    }

    onAlbumIntervalStarted(): boolean {
        const me = this;
        me.listSearchForm.pageNum = me.curRecordNr;

        return false;
    }

    private doSearch() {
        this.sdocRoutingService.setLastBaseUrl(this.baseSearchUrl);
        this.sdocRoutingService.setLastSearchUrl(this.route.toString());

        const ids = this.searchForm.moreFilter.replace(/id:/g, '').split(',');
        this.editFormGroup = this.fb.group({
            albumSdocIds: [ids.join(',')]
        });

        const me = this;
        me.searchResult = new SDocSearchResult(me.searchForm, 0, [], undefined);
        me.listSearchResult = new SDocSearchResult(me.listSearchForm, 0, [], undefined);
        me.record = undefined;
        me.cd.markForCheck();
        if (ids.length <= 0 || ids[0] === '') {
            return;
        }

        me.showLoadingSpinner = true;
        me.sdocDataService.doMultiSearch(me.searchForm, ids).then(function doneSearch(sdocSearchResult: SDocSearchResult) {
            me.initialized = true;
            me.searchResult = sdocSearchResult;
            me.loadListResult();
            me.loadRecord(me.curRecordNr);
            me.showLoadingSpinner = false;
            me.cd.markForCheck();
            me.pageUtils.scrollToTop();
        }).catch(function errorSearch(reason) {
            me.toastr.error('Es gibt leider Probleme bei der Suche - am besten noch einmal probieren :-(', 'Oje!');
            console.error('doSearch failed:', reason);
            me.showLoadingSpinner = false;
            me.cd.markForCheck();
        });
    }

    private loadRecord(nr: number): void {
        this.curRecordNr = nr;
        if (this.searchResult !== undefined && this.searchResult.currentRecords.length >= nr) {
            this.record = this.searchResult.currentRecords[nr - 1];
        } else {
            this.record = undefined;
        }
    }

    private loadListResult(): void {
        const listRecords = [];
        for (let i = (this.listSearchForm.pageNum - 1) * this.listSearchForm.perPage;
             (i < this.listSearchForm.pageNum * this.listSearchForm.perPage &&
            i < this.searchResult.recordCount); i++) {
            listRecords.push(this.searchResult.currentRecords[i]);
        }
        const listSdocSearchResult = new SDocSearchResult(this.listSearchForm, this.searchResult.recordCount, listRecords, undefined);

        this.listSearchResult = listSdocSearchResult;
        this.curRecordNr = this.listSearchForm.pageNum;
    }
}
