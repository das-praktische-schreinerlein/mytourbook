import {Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {SDocDataService} from '../../../services/sdoc-data.service';
import {SDocRecord} from '../../../model/records/sdoc-record';
import {ActivatedRoute, Router} from '@angular/router';
import {SDocSearchForm} from '../../../model/forms/sdoc-searchform';
import {SDocSearchResult} from '../../../model/container/sdoc-searchresult';
import {Subscription} from 'rxjs/Subscription';
import {Facets} from '../../../model/container/facets';
import {AppService, AppState} from '../../../services/app.service';
import {SDocSearchFormConverter} from '../../../services/sdoc-searchform-converter.service';
import {ToastsManager} from 'ng2-toastr';
import {SDocRoutingService} from '../../../services/sdoc-routing.service';
import {Layout} from '../sdoc-list/sdoc-list.component';

@Component({
    selector: 'app-sdoc-searchpage',
    templateUrl: './sdoc-searchpage.component.html',
    styleUrls: ['./sdoc-searchpage.component.css']
})
export class SDocSearchpageComponent implements OnInit, OnDestroy {
    private initialized = false;
    private appStateSubscription: Subscription;
    private routeSubscription: Subscription;
    private routeUrlSubscription: Subscription;
    adminMode = true;
    Layout = Layout;

    searchResult: SDocSearchResult;
    searchForm: SDocSearchForm;

    constructor(private appService: AppService, private route: ActivatedRoute, private router: Router,
                private sdocDataService: SDocDataService, private searchFormConverter: SDocSearchFormConverter,
                private sdocRoutingService: SDocRoutingService, private toastr: ToastsManager, vcr: ViewContainerRef) {
        this.searchForm = new SDocSearchForm({});
        this.searchResult = new SDocSearchResult(this.searchForm, 0, [], new Facets());
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        // reset initialized
        this.initialized = false;

        // check for route
        const url = this.router.routerState.snapshot.url;
        if (url === 'sdocs' || url === '/sdocs') {
            console.log('ngOnInit: redirect for ', url);
            return this.redirectToSearch();
        }

        // do search
        console.log('ngOnInit: search for ', url);
        this.appStateSubscription = this.appService.getAppState().subscribe(appState => {
            if (appState === AppState.Ready) {
                this.routeSubscription = this.route.params.subscribe(params => {
                    return this.doSearchWithParams(params);
                });
            }
        });
    }

    ngOnDestroy() {
        // Clean sub to avoid memory leak
        if (this.routeSubscription) {
            this.routeSubscription.unsubscribe();
        }
        if (this.routeUrlSubscription) {
            this.routeUrlSubscription.unsubscribe();
        }
    }

    onShowSDoc(sdoc: SDocRecord) {
        this.sdocRoutingService.navigateToShowFromSearch(sdoc, this.searchForm);
        return false;
    }

    onEditSDoc(sdoc: SDocRecord) {
        this.sdocRoutingService.navigateToEditFromSearch(sdoc.id, this.searchForm);
        return false;
    }

    onDeleteSDoc(sdoc: SDocRecord) {
        if (window.confirm('SDoc wirklich löschen?')) {
            const me = this;
            this.sdocDataService.deleteById(sdoc.id).then(function doneDeleteById() {
                    console.log('SDoc deleted', sdoc);
                    me.toastr.info('Datesatz wurde gelöscht.', 'Fertig');
                    me.doSearch();
                },
                function errorCreate(reason: any) {
                    console.error('deleteSDocById failed:' + reason);
                    me.toastr.error('Es gab leider ein Problem bei der Löschen - am besten noch einmal probieren :-(', 'Oops!');
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

    onSearchSDoc(sdocSearchForm: SDocSearchForm) {
        this.searchForm = sdocSearchForm;
        console.log('onSearchSDoc: redirect to ', sdocSearchForm);
        this.redirectToSearch();
        return false;
    }

    private redirectToSearch() {
        // reset initialized
        this.initialized = false;

        const url = this.searchFormConverter.searchFormToUrl('/sdocs/', this.searchForm) + '?' + new Date().getTime();
        console.log('redirectToSearch: redirect to ', url);

        this.router.navigateByUrl(url);
        return false;
    }

    private doSearchWithParams(params: any) {
        console.log('doSearchWithParams params:', params);
        this.searchFormConverter.paramsToSearchForm(params, this.searchForm);
        this.doSearch();
    }

    private doSearch() {
        console.log('doSearch form:', this.searchForm);
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
