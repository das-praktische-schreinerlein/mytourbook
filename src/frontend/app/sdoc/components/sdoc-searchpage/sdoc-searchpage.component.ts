import {Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {SDocDataService} from '../../../../shared/sdoc-commons/services/sdoc-data.service';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {ActivatedRoute, Router} from '@angular/router';
import {SDocSearchForm} from '../../../../shared/sdoc-commons/model/forms/sdoc-searchform';
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

@Component({
    selector: 'app-sdoc-searchpage',
    templateUrl: './sdoc-searchpage.component.html',
    styleUrls: ['./sdoc-searchpage.component.css']
})
export class SDocSearchpageComponent implements OnInit, OnDestroy {
    private initialized = false;
    idValidationRule = new IdValidationRule(true);
    Layout = Layout;

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
                private sdocRoutingService: SDocRoutingService, private toastr: ToastsManager, vcr: ViewContainerRef) {
        this.searchForm = new SDocSearchForm({});
        this.searchResult = new SDocSearchResult(this.searchForm, 0, [], new Facets());
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        // reset initialized
        this.initialized = false;
        const me = this;

        this.route.data.subscribe(
            (data: { searchForm: ResolvedData<SDocSearchForm>, flgDoSearch: boolean, baseSearchUrl: ResolvedData<string> }) => {
                const flgSearchFormError = ErrorResolver.isResolverError(data.searchForm);
                const flgBaseSearchUrlError = ErrorResolver.isResolverError(data.baseSearchUrl);
                if (!flgSearchFormError && !flgBaseSearchUrlError) {
                    me.baseSearchUrl = (data.baseSearchUrl.data ? data.baseSearchUrl.data : me.baseSearchUrl);
                    if (!data.flgDoSearch) {
                        console.log('ngOnInit: redirect for ', data);
                        return this.redirectToSearch();
                    }

                    console.log('route: search for ', data);
                    this.searchForm = data.searchForm.data;
                    this.perPage = this.searchForm.perPage;
                    this.sort = this.searchForm.sort;
                    if (this.searchForm.nearby !== undefined && this.searchForm.nearby.length > 0) {
                        const [lat, lon] = this.searchForm.nearby.split('_');
                        this.mapCenterPos = new L.LatLng(+lat, +lon);
                    } else {
                        this.mapCenterPos = undefined;
                    }
                    return this.doSearch();
                }

                let newUrl, msg, code;
                const errorCode = (flgSearchFormError ? data.searchForm.error.code : data.baseSearchUrl.error.code);
                const sectionId = (flgSearchFormError ? data.searchForm.error.data : data.searchForm.data.theme);
                const searchForm = (flgSearchFormError ? new SDocSearchForm(data.searchForm.error.data) : data.searchForm.data);
                switch (errorCode) {
                    case SectionsSearchFormResolver.ERROR_INVALID_SECTION_ID:
                        code = ErrorResolver.ERROR_INVALID_ID;
                        me.baseSearchUrl = ['sections', this.idValidationRule.sanitize(sectionId)].join('/');
                        newUrl = this.searchFormConverter.searchFormToUrl(this.baseSearchUrl, searchForm);
                        msg = undefined;
                        break;
                    default:
                        code = ErrorResolver.ERROR_OTHER;
                        me.baseSearchUrl = ['sdoc'].join('/');
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
        console.log('onLayoutChange: redirect to layout', layout);
//        this.redirectToSearch();
        return false;
    }

    onSearchSDoc(sdocSearchForm: SDocSearchForm) {
        this.searchForm = sdocSearchForm;
        console.log('onSearchSDoc: redirect to ', sdocSearchForm);
        this.redirectToSearch();
        return false;
    }

    private redirectToSearch() {
        // reset initialized
        this.initialized = false;

        const url = this.searchFormConverter.searchFormToUrl(this.baseSearchUrl, this.searchForm) + '?' + new Date().getTime();
        console.log('redirectToSearch: redirect to ', url);

        this.router.navigateByUrl(url);
        return false;
    }

    private doSearch() {
        console.log('doSearch form:', this.searchForm);
        this.sdocRoutingService.setLastBaseUrl(this.baseSearchUrl);
        this.sdocRoutingService.setLastSearchUrl(this.searchFormConverter.searchFormToUrl(this.baseSearchUrl, this.searchForm));
        const me = this;
        this.sdocDataService.search(this.searchForm).then(function doneSearch(sdocSearchResult) {
            if (sdocSearchResult === undefined) {
                console.log('empty searchResult', sdocSearchResult);
            } else {
                console.log('update searchResult', sdocSearchResult);
                me.initialized = true;
                me.searchResult = sdocSearchResult;
                me.searchForm = sdocSearchResult.searchForm;
            }
        }).catch(function errorSearch(reason) {
            me.toastr.error('Es gibt leider Probleme bei der Suche - am besten noch einmal probieren :-(', 'Oje!');
            console.error('doSearch failed:' + reason);
        });
    }
}
