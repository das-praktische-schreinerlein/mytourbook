import {Component, OnDestroy, OnInit} from '@angular/core';
import {SDocDataService} from '../../../services/sdoc-data.service';
import {SDocRecord} from '../../../model/records/sdoc-record';
import {ActivatedRoute, Router} from '@angular/router';
import {SDocSearchForm} from '../../../model/forms/sdoc-searchform';
import {SDocSearchResult} from '../../../model/container/sdoc-searchresult';
import {BehaviorSubject, Subscription} from 'rxjs';
import {Facets} from '../../../model/container/facets';

@Component({
    selector: 'app-sdoc-searchpage',
    templateUrl: './sdoc-searchpage.component.html',
    styleUrls: ['./sdoc-searchpage.component.css']
})
export class SDocSearchpageComponent implements OnInit, OnDestroy {
    private initialized = false;
    private routeSubscription: Subscription;
    private routeUrlSubscription: Subscription;
    private curListSubcription: Subscription;

    private searchResult: SDocSearchResult;
    searchResultObervable: BehaviorSubject<SDocSearchResult>;
    private searchForm: SDocSearchForm;
    searchFormObervable: BehaviorSubject<SDocSearchForm>;

    constructor(private sdocDataService: SDocDataService, private route: ActivatedRoute, private router: Router) {
        this.searchForm = new SDocSearchForm({});
        this.searchResult = new SDocSearchResult(this.searchForm, 0, [], new Facets());
        this.searchFormObervable = <BehaviorSubject<SDocSearchForm>>new BehaviorSubject(this.searchForm);
        this.searchResultObervable = <BehaviorSubject<SDocSearchResult>>new BehaviorSubject(this.searchResult);
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
        this.routeSubscription = this.route.params.subscribe(params => {
            return this.doSearchWithParams(params);
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
        this.router.navigateByUrl('/sdoc/edit/' + sdoc.id);
    }

    onDeleteSDoc(sdoc: SDocRecord) {
        if (window.confirm('SDoc wirklich löschen?')) {
            this.sdocDataService.deleteById(sdoc.id).subscribe(
                () => {
                    console.log('SDoc deleted', sdoc);
                    this.redirectToSearch();
                },
                error => {
                    console.error('deleteSDocById failed:' + error);
                },
                () => {
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

        let url = '/sdocs/';
        const params: Object[] = [
            this.searchForm.when || 'jederzeit',
            this.searchForm.where || 'ueberall',
            this.searchForm.what || 'alles',
            this.searchForm.fulltext || 'egal',
            'ungefiltert',
            this.searchForm.sort || 'relevanz',
            +this.searchForm.perPage || 10,
            +this.searchForm.pageNum || 1
        ];
        url += params.join('/');
        console.log('redirectToSearch: redirect to ', url);
        this.router.navigateByUrl(url);
        return;
    }

    private doSearchWithParams(params: any) {
        console.log('doSearchWithParams params:', params);
        this.searchForm.when = (params['when'] || '').replace(/^jederzeit/, '');
        this.searchForm.where = (params['where'] || '').replace(/^ueberall/, '');
        this.searchForm.what = (params['what'] || '').replace(/^alles/, '');
        this.searchForm.fulltext = (params['fulltext'] || '').replace(/^egal$/, '');
        this.searchForm.sort = params['sort'] || '';
        this.searchForm.perPage = +params['perPage'] || 10;
        this.searchForm.pageNum = +params['pageNum'] || 1;
        this.sdocDataService.findCurList(this.searchForm);
    }
}
