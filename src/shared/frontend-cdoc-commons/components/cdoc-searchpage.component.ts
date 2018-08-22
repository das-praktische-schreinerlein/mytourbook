import {ChangeDetectorRef, ViewContainerRef} from '@angular/core';
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
import {GenericTrackingService} from '../../angular-commons/services/generic-tracking.service';
import {PlatformService} from '../../angular-commons/services/platform.service';
import {CommonDocRecord} from '../../search-commons/model/records/cdoc-entity-record';
import {CommonDocSearchForm} from '../../search-commons/model/forms/cdoc-searchform';
import {CommonDocSearchResult} from '../../search-commons/model/container/cdoc-searchresult';
import {CommonDocDataService} from '../../search-commons/services/cdoc-data.service';
import {GenericSearchFormSearchFormConverter} from '../../search-commons/services/generic-searchform.converter';
import {CommonSectionSearchFormResolver} from '../resolver/cdoc-section-searchform.resolver';
import {AbstractPageComponent} from '../../frontend-pdoc-commons/components/pdoc-page.component';
import {CommonEnvironment} from '../../frontend-pdoc-commons/common-environment';

export interface CommonDocSearchpageComponentConfig {
    baseSearchUrl: string;
    baseSearchUrlDefault: string;
}

export abstract class CommonDocSearchpageComponent<R extends CommonDocRecord, F extends CommonDocSearchForm,
    S extends CommonDocSearchResult<R, F>, D extends CommonDocDataService<R, F, S>> extends AbstractPageComponent {
    idValidationRule = new IdValidationRule(true);
    Layout = Layout;
    SearchFormLayout = SearchFormLayout;
    LayoutSize = LayoutSize;

    pdoc: PDocRecord;
    searchResult: S;
    searchForm: F;
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
                protected trackingProvider: GenericTrackingService, protected appService: GenericAppService,
                protected platformService: PlatformService, protected layoutService: LayoutService,
                protected environment: CommonEnvironment) {
        super(route, toastr, vcr, pageUtils, cd, trackingProvider, appService, platformService, layoutService, environment);
        this.searchForm = cdocDataService.newSearchForm({});
        this.searchResult = cdocDataService.newSearchResult(this.searchForm, 0, [], new Facets());
    }

    protected configureProcessing() {
        const me = this;
        this.route.fragment.subscribe(value => {
            this.anchor = this.idValidationRule.sanitize(value);
        });
        this.route.data.subscribe(
            (data: { searchForm: ResolvedData<F>, pdoc: ResolvedData<PDocRecord>,
                flgDoSearch: boolean, baseSearchUrl: ResolvedData<string> }) => {
                me.commonRoutingService.setRoutingState(RoutingState.DONE);
                me.onResize(this.layoutSizeObservable.getValue());

                me.configureProcessingOfResolvedData(me.config);
                if (me.processError(data)) {
                    return;
                }

                me.pdoc = data.pdoc ? data.pdoc.data : undefined;
                me.baseSearchUrl = (data.baseSearchUrl.data ? data.baseSearchUrl.data : me.baseSearchUrl);
                if (!data.flgDoSearch) {
                    // console.log('ngOnInit: redirect for ', data);
                    return this.redirectToSearch();
                }

                // console.log('route: search for ', data);
                this.searchForm = data.searchForm.data;
                this.setPageLayoutAndStyles();
                this.perPage = this.searchForm.perPage;
                this.sort = this.searchForm.sort;

                this.doProcessAfterResolvedData({});

                this.setMetaTags(me.config, me.pdoc, null);

                this.pageUtils.setMetaLanguage();

                this.trackingProvider.trackPageView();

                return this.doSearch();
            }
        );
    }

    onShowDoc(cdoc: R) {
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

    onSearchDoc(searchForm: F) {
        const origSearchForm = this.searchForm;
        this.searchForm = searchForm;
        this.searchForm.perPage = origSearchForm.perPage;
        this.searchForm.sort = origSearchForm.sort;
        this.searchForm.pageNum = 1;
        // console.log('onSearchDoc: redirect to ', searchForm);
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

    protected abstract getComponentConfig(config: {}): CommonDocSearchpageComponentConfig;

    protected configureComponent(config: {}): void {
        const componentConfig = this.getComponentConfig(config);

        this.baseSearchUrl = componentConfig.baseSearchUrl;
        this.baseSearchUrlDefault = componentConfig.baseSearchUrlDefault;
    }

    protected configureProcessingOfResolvedData(config: {}): void {
    }

    protected doProcessAfterResolvedData(config: {}): void {
    }

    protected setMetaTags(config: {}, pdoc: PDocRecord, record: CommonDocRecord): void {
        if (pdoc) {
            this.pageUtils.setTranslatedTitle('meta.title.prefix.cdocSectionSearchPage',
                {title: pdoc.heading}, pdoc.heading);
            this.pageUtils.setTranslatedDescription('meta.desc.prefix.cdocSectionSearchPage',
                {title: pdoc.heading, teaser: pdoc.teaser}, pdoc.teaser);
            this.pageUtils.setRobots(false, false);
        } else {
            this.pageUtils.setGlobalStyle('', 'sectionStyle');
            this.pageUtils.setTranslatedTitle('meta.title.prefix.cdocSearchPage',
                {}, 'Search');
            this.pageUtils.setTranslatedDescription('meta.desc.prefix.cdocSearchPage',
                {}, 'Search');
            this.pageUtils.setRobots(false, false);
        }
    }

    protected setPageLayoutAndStyles(): void {
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

    }

    protected processError(data: { searchForm: ResolvedData<F>, pdoc: ResolvedData<PDocRecord>,
        flgDoSearch: boolean, baseSearchUrl: ResolvedData<string> }): boolean {
        const flgSearchFormError = ErrorResolver.isResolverError(data.searchForm);
        const flgPDocError = ErrorResolver.isResolverError(data.pdoc);
        const flgBaseSearchUrlError = ErrorResolver.isResolverError(data.baseSearchUrl);
        if (!flgSearchFormError && !flgBaseSearchUrlError) {
            return false;
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
                searchForm = this.cdocDataService.createSanitizedSearchForm(data.searchForm.error.data);
            } else {
                searchForm = this.cdocDataService.newSearchForm({});
            }
        } else if (data.searchForm.data) {
            sectionId = data.searchForm.data.theme;
            searchForm = data.searchForm.data;
        }
        switch (errorCode) {
            case CommonSectionSearchFormResolver.ERROR_INVALID_SEARCHFORM:
                code = ErrorResolver.ERROR_INVALID_DATA;
                if (sectionId && sectionId !== '') {
                    this.baseSearchUrl = ['sections', this.idValidationRule.sanitize(sectionId)].join('/');
                } else {
                    this.baseSearchUrl = this.baseSearchUrlDefault;
                }
                newUrl = this.searchFormConverter.searchFormToUrl(
                    this.baseSearchUrl + '/', this.cdocDataService.cloneSanitizedSearchForm(searchForm));
                msg = undefined;
                break;
            case CommonSectionSearchFormResolver.ERROR_INVALID_SEARCHFORM_SECTION_ID:
                code = ErrorResolver.ERROR_INVALID_ID;
                if (sectionId && sectionId !== '') {
                    this.baseSearchUrl = ['sections', this.idValidationRule.sanitize(sectionId)].join('/');
                } else {
                    this.baseSearchUrl = this.baseSearchUrlDefault;
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
                this.baseSearchUrl = this.baseSearchUrlDefault + '/';
                newUrl = undefined;
                msg = undefined;
        }

        this.errorResolver.redirectAfterRouterError(code, newUrl, this.toastr, msg);
        this.cd.markForCheck();

        return true;
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

        this.showLoadingSpinner = true;
        this.cd.markForCheck();
        const me = this;
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
