import {Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {SDocDataService} from '../../../services/sdoc-data.service';
import {SDocRecord} from '../../../model/records/sdoc-record';
import {ActivatedRoute, Router} from '@angular/router';
import {SDocSearchForm} from '../../../model/forms/sdoc-searchform';
import {SDocSearchResult} from '../../../model/container/sdoc-searchresult';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subscription} from 'rxjs/Subscription';
import {Facets} from '../../../model/container/facets';
import {AppService, AppState} from '../../../services/app.service';
import {SDocSearchFormConverter} from '../../../services/sdoc-searchform-converter.service';
import {ToastsManager} from 'ng2-toastr';

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
    private curListSubcription: Subscription;

    private searchResult: SDocSearchResult;
    searchResultObervable: BehaviorSubject<SDocSearchResult>;
    private searchForm: SDocSearchForm;
    searchFormObervable: BehaviorSubject<SDocSearchForm>;

    constructor(private appService: AppService, private route: ActivatedRoute, private router: Router,
                private sdocDataService: SDocDataService, private searchFormConverter: SDocSearchFormConverter,
                private toastr: ToastsManager, vcr: ViewContainerRef) {
        this.searchForm = new SDocSearchForm({});
        this.searchResult = new SDocSearchResult(this.searchForm, 0, [], new Facets());
        this.searchFormObervable = <BehaviorSubject<SDocSearchForm>>new BehaviorSubject(this.searchForm);
        this.searchResultObervable = <BehaviorSubject<SDocSearchResult>>new BehaviorSubject(this.searchResult);
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
                this.curListSubcription = this.sdocDataService.getCurList().subscribe(
                    sdocSearchResult => {
                        if (sdocSearchResult === undefined) {
                            console.log('empty searchResult', sdocSearchResult);
                        } else {
                            console.log('update searchResult', sdocSearchResult);
                            this.initialized = true;
                            this.searchResult = sdocSearchResult;
                            this.searchResultObervable.next(sdocSearchResult);
                            this.searchForm = sdocSearchResult.searchForm;
                            this.searchFormObervable.next(this.searchForm);
                        }
                    },
                    error => {
                        console.error('getCurSDocList failed:' + error);
                    },
                    () => {
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
        if (this.curListSubcription) {
            this.curListSubcription.unsubscribe();
        }
    }

    onEditSDoc(sdoc: SDocRecord) {
        this.router.navigateByUrl(this.searchFormConverter.searchFormToUrl('/sdoc/edit/' + sdoc.id + '?from=/sdocs/', this.searchForm));
    }

    onDeleteSDoc(sdoc: SDocRecord) {
        if (window.confirm('SDoc wirklich löschen?')) {
            const me = this;
            this.sdocDataService.deleteById(sdoc.id).then(function doneDeleteById() {
                    console.log('SDoc deleted', sdoc);
                    me.redirectToSearch();
                },
                function errorCreate(reason: any) {
                    console.error('deleteSDocById failed:' + reason);
                }
            );
        }
    }

    onPageChange(page: number) {
        if (!this.initialized) {
            // ignore changes if not initialized
            return;
        }

        this.searchForm.pageNum = +page;
        console.log('onPageChange: redirect to page', page);
        this.redirectToSearch();
    }

    onSearchSDoc(sdocSearchForm: SDocSearchForm) {
        this.searchForm = sdocSearchForm;
        console.log('onSearchSDoc: redirect to ', sdocSearchForm);
        this.redirectToSearch();
    }

    private redirectToSearch() {
        // reset initialized
        this.initialized = false;

        const url = this.searchFormConverter.searchFormToUrl('/sdocs/', this.searchForm) + '?' + new Date().getTime();
        console.log('redirectToSearch: redirect to ', url);

        this.router.navigateByUrl(url);
        return;
    }

    private doSearchWithParams(params: any) {
        console.log('doSearchWithParams params:', params);
        this.searchFormConverter.paramsToSearchForm(params, this.searchForm);

        const me = this;
        this.sdocDataService.search(this.searchForm).catch(function errorSearch(reason) {
            me.toastr.error('Es gibt leider Probleme bei der Suche - am besten noch einmal probieren :-(', 'Oops!');
            console.error('doSearchWithParams failed:' + reason);
        });
    }
}
