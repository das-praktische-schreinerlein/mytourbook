import {Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {SDocDataService} from '../../../../shared/sdoc-commons/services/sdoc-data.service';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {ActivatedRoute, Router} from '@angular/router';
import {SDocSearchForm, SDocSearchFormFactory} from '../../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {SDocSearchResult} from '../../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {Facets} from '../../../../shared/search-commons/model/container/facets';
import {SDocSearchFormConverter} from '../../../shared-sdoc/services/sdoc-searchform-converter.service';
import {ToastsManager} from 'ng2-toastr';
import {SDocRoutingService} from '../../../shared-sdoc/services/sdoc-routing.service';
import {Layout} from '../../../shared-sdoc/components/sdoc-list/sdoc-list.component';
import {ResolvedData} from '../../../../shared/angular-commons/resolver/resolver.utils';
import {ErrorResolver} from '../../../sections/resolver/error.resolver';
import {SectionsSearchFormResolver} from '../../../sections/resolver/sections-searchform.resolver';
import {IdValidationRule} from '../../../../shared/search-commons/model/forms/generic-validator.util';
import {PDocRecord} from '../../../../shared/pdoc-commons/model/records/pdoc-record';
import {GenericAppService} from '../../../../shared/search-commons/services/generic-app.service';
import {PageUtils} from '../../../../shared/angular-commons/services/page.utils';

@Component({
    selector: 'app-sdoc-searchpage',
    templateUrl: './sdoc-searchpage.component.html',
    styleUrls: ['./sdoc-searchpage.component.css']
})
export class SDocSearchpageComponent implements OnInit, OnDestroy {
    private initialized = false;
    showLoadingSpinner = false;
    idValidationRule = new IdValidationRule(true);
    Layout = Layout;

    pdoc: PDocRecord;
    searchResult: SDocSearchResult;
    searchForm: SDocSearchForm;
    baseSearchUrl = '/sdoc/';
    layout = Layout.FLAT;
    sort = 'relevance';
    perPage = 10;
    mapCenterPos: L.LatLng = undefined;
    mapZoom = 9;

    constructor(private route: ActivatedRoute, private router: Router, private errorResolver: ErrorResolver,
                private sdocDataService: SDocDataService, private searchFormConverter: SDocSearchFormConverter,
                private sdocRoutingService: SDocRoutingService, private toastr: ToastsManager, vcr: ViewContainerRef,
                private pageUtils: PageUtils) {
        this.searchForm = new SDocSearchForm({});
        this.searchResult = new SDocSearchResult(this.searchForm, 0, [], new Facets());
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        // reset initialized
        this.initialized = false;
        const me = this;

        this.route.data.subscribe(
            (data: { searchForm: ResolvedData<SDocSearchForm>, pdoc: ResolvedData<PDocRecord>,
                flgDoSearch: boolean, baseSearchUrl: ResolvedData<string> }) => {
                const flgSearchFormError = ErrorResolver.isResolverError(data.searchForm);
                const flgPDocError = ErrorResolver.isResolverError(data.pdoc);
                const flgBaseSearchUrlError = ErrorResolver.isResolverError(data.baseSearchUrl);
                if (!flgSearchFormError && !flgBaseSearchUrlError) {
                    me.baseSearchUrl = (data.baseSearchUrl.data ? data.baseSearchUrl.data : me.baseSearchUrl);
                    if (!data.flgDoSearch) {
                        console.log('ngOnInit: redirect for ', data);
                        return this.redirectToSearch();
                    }

                    console.log('route: search for ', data);
                    this.searchForm = data.searchForm.data;
                    if (this.searchForm.perPage === 1) {
                        this.layout = Layout.PAGE;
                        this.pageUtils.setGlobalStyle('.hide-on-fullpage { display: none; } ' +
                            '.show-on-fullpage-block { display: block; }', 'fullPageStyle');
                    } else {
                        this.pageUtils.setGlobalStyle('.show-on-fullpage-block { display: none; }', 'fullPageStyle');
                    }
                    this.perPage = this.searchForm.perPage;
                    this.sort = this.searchForm.sort;
                    if (this.searchForm.nearby !== undefined && this.searchForm.nearby.length > 0) {
                        const [lat, lon] = this.searchForm.nearby.split('_');
                        this.mapCenterPos = new L.LatLng(+lat, +lon);
                    } else {
                        this.mapCenterPos = undefined;
                    }

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
                        this.pageUtils.setRobots(true, true);
                    }
                    this.pageUtils.setMetaLanguage();

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
                        searchForm = SDocSearchFormFactory.createSanitized(data.searchForm.error.data);
                    } else {
                        searchForm = new SDocSearchForm({});
                    }
                } else if (data.searchForm.data) {
                    sectionId = data.searchForm.data.theme;
                    searchForm = data.searchForm.data;
                }
                switch (errorCode) {
                    case SectionsSearchFormResolver.ERROR_INVALID_SDOC_SEARCHFORM:
                        code = ErrorResolver.ERROR_INVALID_DATA;
                        if (sectionId && sectionId !== '') {
                            me.baseSearchUrl = ['sections', this.idValidationRule.sanitize(sectionId)].join('/');
                        } else {
                            me.baseSearchUrl = ['sdoc'].join('/');
                        }
                        newUrl = this.searchFormConverter.searchFormToUrl(
                            this.baseSearchUrl + '/', SDocSearchFormFactory.cloneSanitized(searchForm));
                        msg = undefined;
                        break;
                    case SectionsSearchFormResolver.ERROR_INVALID_SEARCHFORM_SECTION_ID:
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
                return;
            }
        );
    }

    ngOnDestroy() {
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

        this.searchForm.pageNum = +page;
        console.log('onPageChange: redirect to page', page);
        this.redirectToSearch();
        return false;
    }

    onPerPageChange(perPage: number) {
        if (!this.initialized) {
            // ignore changes if not initialized
            return;
        }

        this.searchForm.perPage = perPage;
        console.log('onPerPageChange: redirect to perPage', perPage);
        this.redirectToSearch();
        return false;
    }

    onSortChange(sort: string) {
        if (!this.initialized) {
            // ignore changes if not initialized
            return;
        }

        this.searchForm.sort = sort;
        console.log('onSortChange: redirect to sort', sort);
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
        return false;
    }

    onSearchSDoc(sdocSearchForm: SDocSearchForm) {
        const origSearchForm = this.searchForm;
        this.searchForm = sdocSearchForm;
        this.searchForm.perPage = origSearchForm.perPage;
        this.searchForm.sort = origSearchForm.sort;
        console.log('onSearchSDoc: redirect to ', sdocSearchForm);
        this.redirectToSearch();
        return false;
    }

    onMapSDocClicked(sdoc: SDocRecord) {
        console.error("sdocClicked", sdoc);
    }

    onMapCenterChanged(newCenter: L.LatLng) {
        console.error("newCenter", newCenter);
    }

    private redirectToSearch() {
        // reset initialized
        this.initialized = false;

        const url = this.searchFormConverter.searchFormToUrl(this.baseSearchUrl, this.searchForm);
        console.log('redirectToSearch: redirect to ', url);

        this.router.navigateByUrl(url);
        return false;
    }

    private doSearch() {
        if (this.searchForm.sort === 'distance' && (this.searchForm.nearby === undefined || this.searchForm.nearby === '')) {
            console.log('doSearch: redirect because of sort/nearby form:', this.searchForm);
            this.searchForm.sort = 'relevance';
            this.sort = 'relvance';
            return this.redirectToSearch();
        }

        console.log('doSearch form:', this.searchForm);
        this.sdocRoutingService.setLastBaseUrl(this.baseSearchUrl);
        this.sdocRoutingService.setLastSearchUrl(this.searchFormConverter.searchFormToUrl(this.baseSearchUrl, this.searchForm));

        const me = this;
        me.showLoadingSpinner = true;
        this.sdocDataService.search(this.searchForm, {
            showFacets: true,
            loadTrack: true,
            showForm: true
        }).then(function doneSearch(sdocSearchResult) {
            if (sdocSearchResult === undefined) {
                console.log('empty searchResult', sdocSearchResult);
            } else {
                console.log('update searchResult', sdocSearchResult);
                me.initialized = true;
                me.searchResult = sdocSearchResult;
                me.searchForm = sdocSearchResult.searchForm;
            }
            me.showLoadingSpinner = false;
        }).catch(function errorSearch(reason) {
            me.toastr.error('Es gibt leider Probleme bei der Suche - am besten noch einmal probieren :-(', 'Oje!');
            console.error('doSearch failed:' + reason);
            me.showLoadingSpinner = false;
        });
    }
}
