import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChange, ViewContainerRef} from '@angular/core';
import {SDocDataService} from '../../../../shared/sdoc-commons/services/sdoc-data.service';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {SDocSearchForm} from '../../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {SDocSearchResult} from '../../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {Subscription} from 'rxjs/Subscription';
import {Facets} from '../../../../shared/search-commons/model/container/facets';
import {SDocSearchFormConverter} from '../../services/sdoc-searchform-converter.service';
import {ToastsManager} from 'ng2-toastr';
import {SDocRoutingService} from '../../services/sdoc-routing.service';
import {Layout} from '../sdoc-list/sdoc-list.component';
import {AppState, GenericAppService} from '../../../../shared/search-commons/services/generic-app.service';
import {Router} from '@angular/router';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';

@Component({
    selector: 'app-sdoc-inline-searchpage',
    templateUrl: './sdoc-inline-searchpage.component.html',
    styleUrls: ['./sdoc-inline-searchpage.component.css']
})
export class SDocInlineSearchpageComponent implements OnInit, OnDestroy, OnChanges {
    private initialized = false;
    private appStateSubscription: Subscription;

    showLoadingSpinner = false;
    Layout = Layout;

    searchResult: SDocSearchResult;
    searchForm: SDocSearchForm;

    @Input()
    public params = {};

    @Input()
    public showForm = false;

    @Input()
    public showTimetable? = false;

    @Input()
    public loadFacets? = false;

    @Input()
    public showOnlyIfRecordsFound = true;

    @Input()
    public label: string;

    @Input()
    public baseSearchUrl? = 'sdoc/';

    @Input()
    public searchLinkLabel?: string;

    @Input()
    public layout: Layout;

    @Output()
    public show: EventEmitter<SDocRecord> = new EventEmitter();

    @Output()
    public searchResultFound: EventEmitter<SDocSearchResult> = new EventEmitter();

    constructor(private appService: GenericAppService, private router: Router,
                private sdocDataService: SDocDataService, private searchFormConverter: SDocSearchFormConverter,
                private sdocRoutingService: SDocRoutingService, private toastr: ToastsManager, vcr: ViewContainerRef) {
        this.searchForm = new SDocSearchForm({});
        this.searchResult = new SDocSearchResult(this.searchForm, 0, [], new Facets());
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        // reset initialized
        this.initialized = false;

        // do search
        this.appStateSubscription = this.appService.getAppState().subscribe(appState => {
            if (appState === AppState.Ready) {
                return this.doSearchWithParams(this.params);
            }
        });
    }

    ngOnDestroy() {
        // Clean sub to avoid memory leak
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (this.initialized && ComponentUtils.hasNgChanged(changes)) {
//            console.error("doNewSearchWithparams", this.params);
            return this.doSearchWithParams(this.params);
        }
    }

    onShowSDoc(sdoc: SDocRecord) {
        this.sdocRoutingService.navigateToShow(sdoc, '');
        return false;
    }

    onPageChange(page: number) {
        if (!this.initialized) {
            // ignore changes if not initialized
            return;
        }

        this.searchForm.pageNum = +page;
        this.doSearch();
        return false;
    }

    onSearchSDoc(sdocSearchForm: SDocSearchForm) {
        this.searchForm = sdocSearchForm;
        this.doSearch();
        return false;
    }

    getToSearchUrl() {
        return this.searchFormConverter.searchFormToUrl(this.baseSearchUrl, this.searchForm);
    }

    onToSearchPage(event: any) {
        this.router.navigateByUrl(this.getToSearchUrl(), '');
        return false;
    }


    private doSearchWithParams(params: any) {
        console.log('doSearchWithParams params:', params);
        this.searchFormConverter.paramsToSearchForm(params, {}, this.searchForm);
        this.doSearch();
    }

    private doSearch() {
        console.log('doSearch form:', this.searchForm);
        const me = this;
        me.showLoadingSpinner = true;
        this.sdocDataService.search(this.searchForm,
            {
                showFacets: this.showForm || this.loadFacets || (this.showTimetable ? ['week_is', 'month_is'] : false),
                showForm: this.showForm
            }).then(function doneSearch(sdocSearchResult) {
            me.showLoadingSpinner = false;
            if (sdocSearchResult === undefined) {
                console.log('empty searchResult', sdocSearchResult);
                me.searchResult = new SDocSearchResult(me.searchForm, 0, [], new Facets());
            } else {
                console.log('update searchResult', sdocSearchResult);
                me.initialized = true;
                me.searchResult = sdocSearchResult;
                me.searchForm = sdocSearchResult.searchForm;
            }
            me.searchResultFound.emit(me.searchResult);
        }).catch(function errorSearch(reason) {
            me.toastr.error('Es gibt leider Probleme bei der Suche - am besten noch einmal probieren :-(', 'Oje!');
            console.error('doSearch failed:' + reason);
            me.showLoadingSpinner = false;
            me.searchResult = new SDocSearchResult(me.searchForm, 0, [], new Facets());
            me.searchResultFound.emit(me.searchResult);
        });
    }
}
