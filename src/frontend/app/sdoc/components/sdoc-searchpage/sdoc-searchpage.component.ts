import {Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {SDocDataService} from '../../../../shared/sdoc-commons/services/sdoc-data.service';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {ActivatedRoute, Router} from '@angular/router';
import {SDocSearchForm} from '../../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {SDocSearchResult} from '../../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {Facets} from '../../../../shared/search-commons/model/container/facets';
import {SDocSearchFormConverter} from '../../services/sdoc-searchform-converter.service';
import {ToastsManager} from 'ng2-toastr';
import {SDocRoutingService} from '../../services/sdoc-routing.service';
import {Layout} from '../sdoc-list/sdoc-list.component';

@Component({
    selector: 'app-sdoc-searchpage',
    templateUrl: './sdoc-searchpage.component.html',
    styleUrls: ['./sdoc-searchpage.component.css']
})
export class SDocSearchpageComponent implements OnInit, OnDestroy {
    private initialized = false;
    adminMode = true;
    Layout = Layout;

    searchResult: SDocSearchResult;
    searchForm: SDocSearchForm;
    baseSearchUrl = '/sdoc/search/';
    layout = Layout.FLAT;
    sort = 'relevance';
    perPage = 10;

    constructor(private route: ActivatedRoute, private router: Router,
                private sdocDataService: SDocDataService, private searchFormConverter: SDocSearchFormConverter,
                private sdocRoutingService: SDocRoutingService, private toastr: ToastsManager, vcr: ViewContainerRef) {
        this.searchForm = new SDocSearchForm({});
        this.searchResult = new SDocSearchResult(this.searchForm, 0, [], new Facets());
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        // reset initialized
        this.initialized = false;

        this.route.data.subscribe(
            (data: { searchForm: SDocSearchForm, flgDoSearch: boolean, baseSearchUrl: string }) => {
                this.baseSearchUrl = (data.baseSearchUrl ? data.baseSearchUrl : this.baseSearchUrl);
                if (!data.flgDoSearch) {
                    console.log('ngOnInit: redirect for ', data);
                    return this.redirectToSearch();
                }

                console.log('route: search for ', data.searchForm);
                this.searchForm = data.searchForm;
                this.perPage = this.searchForm.perPage;
                this.sort = this.searchForm.sort;
                return this.doSearch();
            },
            (error: {reason: any}) => {
                    console.error('deleteSDocById failed:' + error.reason);
                    this.toastr.error('Es gab leider ein Problem bei der Suche - am besten noch einmal probieren :-(', 'Oops!');
            }
        );
    }

    ngOnDestroy() {
    }

    onShowSDoc(sdoc: SDocRecord) {
        this.sdocRoutingService.navigateToShow(sdoc, this.sdocRoutingService.getLastSearchUrl());
        return false;
    }

    onEditSDoc(sdoc: SDocRecord) {
        this.sdocRoutingService.navigateToEdit(sdoc.id, this.sdocRoutingService.getLastSearchUrl());
        return false;
    }

    onDeleteSDoc(sdoc: SDocRecord) {
        if (window.confirm('SDoc wirklich löschen?')) {
            const me = this;
            this.sdocDataService.deleteById(sdoc.id).then(function doneDeleteById() {
                    console.log('SDoc deleted', sdoc);
                    me.toastr.info('Datensatz wurde gelöscht.', 'Fertig');
                    me.doSearch();
                },
                function errorCreate(reason: any) {
                    console.error('deleteSDocById failed:' + reason);
                    me.toastr.error('Es gab leider ein Problem beim Löschen - am besten noch einmal probieren :-(', 'Oops!');
                }
            );
        }
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
            me.toastr.error('Es gibt leider Probleme bei der Suche - am besten noch einmal probieren :-(', 'Oops!');
            console.error('doSearch failed:' + reason);
        });
    }
}
