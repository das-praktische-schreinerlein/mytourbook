import {ChangeDetectorRef, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Facets} from '../../search-commons/model/container/facets';
import {ToastsManager} from 'ng2-toastr';
import {CommonDocRoutingService} from '../services/cdoc-routing.service';
import {Layout, LayoutService, LayoutSize, LayoutSizeData, SearchFormLayout} from '../../angular-commons/services/layout.service';
import {ResolvedData} from '../../angular-commons/resolver/resolver.utils';
import {ErrorResolver} from '../resolver/error.resolver';
import {IdValidationRule} from '../../search-commons/model/forms/generic-validator.util';
import {PDocRecord} from '../../pdoc-commons/model/records/pdoc-record';
import {GenericAppService} from '../../commons/services/generic-app.service';
import {PageUtils} from '../../angular-commons/services/page.utils';
import {CommonRoutingService, RoutingState} from '../../angular-commons/services/common-routing.service';
import * as L from 'leaflet';
import {GenericTrackingService} from '../../angular-commons/services/generic-tracking.service';
import {PlatformService} from '../../angular-commons/services/platform.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {CommonDocRecord} from '../../search-commons/model/records/cdoc-entity-record';
import {CommonDocSearchForm} from '../../search-commons/model/forms/cdoc-searchform';
import {CommonDocSearchResult} from '../../search-commons/model/container/cdoc-searchresult';
import {CommonDocDataService} from '../../search-commons/services/cdoc-data.service';
import {GenericSearchFormSearchFormConverter} from '../../search-commons/services/generic-searchform.converter';
import {CommonEnvironment} from '../common-environment';
import {CommonSearchFormResolver} from '../resolver/searchform.resolver';

export abstract class AbstractCDocSearchpageComponent<R extends CommonDocRecord, F extends CommonDocSearchForm,
    S extends CommonDocSearchResult<R, F>, D extends CommonDocDataService<R, F, S>> implements OnInit, OnDestroy {
    protected initialized = false;
    protected layoutSizeObservable: BehaviorSubject<LayoutSizeData>;

    showLoadingSpinner = false;
    idValidationRule = new IdValidationRule(true);
    Layout = Layout;
    SearchFormLayout = SearchFormLayout;
    LayoutSize = LayoutSize;

    pdoc: PDocRecord;
    searchResult: S;
    searchForm: F;
    baseSearchUrl = '/sdoc/';
    layout = Layout.FLAT;
    sort = 'relevance';
    perPage = 10;
    searchFormLayout: SearchFormLayout = SearchFormLayout.GRID;
    showSearchFormElements = true;
    pauseAutoPlay = false;
    anchor = '';

    constructor(protected route: ActivatedRoute, protected commonRoutingService: CommonRoutingService,
                protected errorResolver: ErrorResolver, protected cdocDataService: D,
                protected searchFormConverter: GenericSearchFormSearchFormConverter<F>,
                protected cdocRoutingService: CommonDocRoutingService, protected toastr: ToastsManager,
                vcr: ViewContainerRef, protected pageUtils: PageUtils, protected cd: ChangeDetectorRef,
                protected trackingProvider: GenericTrackingService, protected platformService: PlatformService,
                protected layoutService: LayoutService, protected environment: CommonEnvironment) {
        this.searchForm = this.cdocDataService.newSearchForm({});
        this.searchResult = this.cdocDataService.newSearchResult(this.searchForm, 0, [], new Facets());
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        // reset initialized
        this.initialized = false;
        const me = this;

        this.layoutSizeObservable = this.layoutService.getLayoutSizeData();
        this.layoutSizeObservable.subscribe(layoutSizeData => {
            me.onResize(layoutSizeData);
        });

        this.route.fragment.subscribe(value => {
            this.anchor = this.idValidationRule.sanitize(value);
        });
        this.route.data.subscribe(
            (data: { searchForm: ResolvedData<F>, pdoc: ResolvedData<PDocRecord>,
                flgDoSearch: boolean, baseSearchUrl: ResolvedData<string> }) => {
                me.commonRoutingService.setRoutingState(RoutingState.DONE);

                me.onResize(this.layoutSizeObservable.getValue());

                const flgSearchFormError = ErrorResolver.isResolverError(data.searchForm);
                const flgPDocError = ErrorResolver.isResolverError(data.pdoc);
                const flgBaseSearchUrlError = ErrorResolver.isResolverError(data.baseSearchUrl);
                if (!flgSearchFormError && !flgBaseSearchUrlError) {
                    me.baseSearchUrl = (data.baseSearchUrl.data ? data.baseSearchUrl.data : me.baseSearchUrl);
                    if (!data.flgDoSearch) {
                        // console.log('ngOnInit: redirect for ', data);
                        return this.redirectToSearch();
                    }

                    // console.log('route: search for ', data);
                    this.searchForm = data.searchForm.data;
                    if (this.searchForm.perPage === 1) {
                        this.layout = Layout.PAGE;
                        this.pageUtils.setGlobalStyle('.hide-on-fullpage { display: none; } ' +
                            '.show-on-fullpage-block { display: block; } ' +
                            '.content-container, .list-container, .card-deck, .card { background: #130b0b !IMPORTANT; border: none !IMPORTANT;} ' +
                            '.other-content-container, .map-container { background: white !IMPORTANT; border: 2px !IMPORTANT;} ' +
                            '.list-header-container { background: #dadada; opacity: 0.1; } ' +
                            'div:hover { opacity: 1 }', 'fullPageStyle');
                    } else {
                        this.pageUtils.setGlobalStyle('.show-on-fullpage-block { display: none; }', 'fullPageStyle');
                    }
                    this.perPage = this.searchForm.perPage;
                    this.sort = this.searchForm.sort;

                    this.doProcessAfterSearchFormResolved();

                    me.pdoc = data.pdoc ? data.pdoc.data : undefined;
                    if (me.pdoc) {
                        this.pageUtils.setTranslatedTitle('meta.title.prefix.sdocSectionSearchPage',
                            {title: me.pdoc.heading}, me.pdoc.heading);
                        this.pageUtils.setTranslatedDescription('meta.desc.prefix.sdocSectionSearchPage',
                            {title: me.pdoc.heading, teaser: me.pdoc.teaser}, me.pdoc.teaser);
                        this.pageUtils.setRobots(false, false);
                    } else {
                        me.pageUtils.setGlobalStyle('', 'sectionStyle');
                        this.pageUtils.setTranslatedTitle('meta.title.prefix.sdocSearchPage',
                            {}, 'Search');
                        this.pageUtils.setTranslatedDescription('meta.desc.prefix.sdocSearchPage',
                            {}, 'Search');
                        this.pageUtils.setRobots(false, false);
                    }
                    this.pageUtils.setMetaLanguage();

                    this.trackingProvider.trackPageView();

                    return this.doSearch();
                }

                let newUrl, msg, code;
                const errorCode = (flgSearchFormError ? data.searchForm.error.code : data.baseSearchUrl.error.code);
                let sectionId = undefined;
                let searchForm = undefined;
                if (flgSearchFormError) {
                    if (data.searchForm.error.data) {
                        sectionId = data.searchForm.error.data.theme;
                    }
                    if (data.searchForm.error.data) {
                        searchForm = me.cdocDataService.createSanitizedSearchForm(data.searchForm.error.data);
                    } else {
                        searchForm = me.cdocDataService.newSearchForm({});
                    }
                } else if (data.searchForm.data) {
                    sectionId = data.searchForm.data.theme;
                    searchForm = data.searchForm.data;
                }
                switch (errorCode) {
                    case CommonSearchFormResolver.ERROR_INVALID_SEARCHFORM:
                        code = ErrorResolver.ERROR_INVALID_DATA;
                        if (sectionId && sectionId !== '') {
                            me.baseSearchUrl = ['sections', this.idValidationRule.sanitize(sectionId)].join('/');
                        } else {
                            me.baseSearchUrl = ['sdoc'].join('/');
                        }
                        newUrl = this.searchFormConverter.searchFormToUrl(
                           this.baseSearchUrl + '/', me.cdocDataService.cloneSanitizedSearchForm(searchForm));
                        msg = undefined;
                        break;
                    case CommonSearchFormResolver.ERROR_INVALID_SEARCHFORM_SECTION_ID:
                        code = ErrorResolver.ERROR_INVALID_ID;
                        if (sectionId && sectionId !== '') {
                            me.baseSearchUrl = ['sections', this.idValidationRule.sanitize(sectionId)].join('/');
                        } else {
                            me.baseSearchUrl = ['sdoc'].join('/');
                        }
                        newUrl = this.searchFormConverter.searchFormToUrl(this.baseSearchUrl + '/', searchForm);
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
        // this.layoutSizeObservable.unsubscribe();
    }

    onShowSDoc(cdoc: R) {
        this.cdocRoutingService.navigateToShow(cdoc, this.cdocRoutingService.getLastSearchUrl());
        return false;
    }

    onPageChange(page: number, scroll: boolean) {
        if (!this.initialized) {
            // ignore changes if not initialized
            return;
        }

        this.searchForm.pageNum = +page;
        // console.log('onPageChange: redirect to page', page);
        this.redirectToSearch();

        if (scroll) {
            this.pageUtils.scrollToTop();
        }

        return false;
    }

    onPerPageChange(perPage: number) {
        if (!this.initialized) {
            // ignore changes if not initialized
            return;
        }

        this.searchForm.perPage = perPage;
        this.searchForm.pageNum = 1;
        // console.log('onPerPageChange: redirect to perPage', perPage);
        this.redirectToSearch();

        return false;
    }

    onSortChange(sort: string) {
        if (!this.initialized) {
            // ignore changes if not initialized
            return;
        }

        this.searchForm.sort = sort;
        this.searchForm.pageNum = 1;
        // console.log('onSortChange: redirect to sort', sort);
        this.redirectToSearch();

        return false;
    }

    onLayoutChange(layout: Layout) {
        if (!this.initialized) {
            // ignore changes if not initialized
            return;
        }

        this.layout = layout;
        if (layout.toString() === Layout.PAGE.toString()) {
            this.onPerPageChange(1);
        } else if (this.perPage === 1) {
            this.onPerPageChange(10);
        }
//        this.redirectToSearch();
        this.cd.markForCheck();
        return false;
    }

    onSearchSDoc(searchForm: F) {
        const origSearchForm = this.searchForm;
        this.searchForm = searchForm;
        this.searchForm.perPage = origSearchForm.perPage;
        this.searchForm.sort = origSearchForm.sort;
        this.searchForm.pageNum = 1;
        // console.log('onSearchSDoc: redirect to ', sdocSearchForm);
        this.redirectToSearch();
        return false;
    }

    onShowFormChanged(showForm: boolean) {
        this.showSearchFormElements = showForm;
        this.onResize(this.layoutSizeObservable.getValue());
        return false;
    }

    onTimeTableColumnClicked(month: string) {
        this.searchForm.when = month;
        this.searchForm.pageNum = 1;
        this.redirectToSearch();
        return false;
    }
    onTypeTableColumnClicked(type: string) {
        this.searchForm.type = type;
        this.searchForm.pageNum = 1;
        this.redirectToSearch();
        return false;
    }

    onTagcloudClicked(filterValue: any, filter: string) {
        this.searchForm[filter] = filterValue;
        this.searchForm.pageNum = 1;
        this.redirectToSearch();

        return false;
    }

    onScrollToTop() {
        this.pageUtils.scrollToTop();
    }

    onPlayerStarted(cdoc: R) {
        this.pauseAutoPlay = true;
    }

    onPlayerStopped(cdoc: R) {
        this.pauseAutoPlay = false;
    }

    protected redirectToSearch() {
        // reset initialized
        this.initialized = false;

        const url = this.searchFormConverter.searchFormToUrl(this.baseSearchUrl, this.searchForm);
        // console.log('redirectToSearch: redirect to ', url);

        this.commonRoutingService.navigateByUrl(url);
        return false;
    }

    protected onResize(layoutSizeData: LayoutSizeData): void {
        if (this.platformService.isClient() && layoutSizeData.layoutSize >= LayoutSize.VERYBIG && this.showSearchFormElements &&
            !this.layoutService.isPrintMode()) {
            this.searchFormLayout = SearchFormLayout.STACKED;
        } else {
            this.searchFormLayout = SearchFormLayout.GRID;
        }

        this.cd.markForCheck();
    }

    protected doProcessAfterSearchFormResolved(): void {

    }

    protected doPreChecksBeforeSearch(): boolean {
        if ((this.searchForm.type === undefined || this.searchForm.type === '')
            && this.environment.emptyDefaultSearchTypes !== undefined && this.environment.emptyDefaultSearchTypes !== '') {
            this.searchForm.type = this.environment.emptyDefaultSearchTypes;
            return this.redirectToSearch();
        }
    }

    protected doCheckSearchResultAfterSearch(searchResult: S): void {
        this.pauseAutoPlay = false;
    }

    protected doSearch() {
        this.doPreChecksBeforeSearch();

        // console.log('doSearch form:', this.searchForm);
        this.cdocRoutingService.setLastBaseUrl(this.baseSearchUrl);
        this.cdocRoutingService.setLastSearchUrl(this.searchFormConverter.searchFormToUrl(this.baseSearchUrl, this.searchForm));

        const me = this;
        me.showLoadingSpinner = true;
        me.cd.markForCheck();
        this.cdocDataService.search(this.searchForm, {
            showFacets: true,
            loadTrack: true,
            showForm: true
        }).then(function doneSearch(cdocSearchResult) {
            me.doCheckSearchResultAfterSearch(cdocSearchResult);

            me.showLoadingSpinner = false;
            me.pageUtils.goToLinkAnchor(me.anchor);
            me.cd.markForCheck();
        }).catch(function errorSearch(reason) {
            me.toastr.error('Es gibt leider Probleme bei der Suche - am besten noch einmal probieren :-(', 'Oje!');
            console.error('doSearch failed:', reason);
            me.showLoadingSpinner = false;
            me.cd.markForCheck();
        });
    }
}
