import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewContainerRef} from '@angular/core';
import {SDocDataService} from '../../services/sdoc-data.service';
import {SDocRecord} from '../../model/records/sdoc-record';
import {SDocSearchForm} from '../../model/forms/sdoc-searchform';
import {SDocSearchResult} from '../../model/container/sdoc-searchresult';
import {Subscription} from 'rxjs/Subscription';
import {Facets} from '../../../../commons/model/container/facets';
import {AppService, AppState} from '../../../shared/services/app.service';
import {SDocSearchFormConverter} from '../../services/sdoc-searchform-converter.service';
import {ToastsManager} from 'ng2-toastr';
import {SDocRoutingService} from '../../services/sdoc-routing.service';
import {Layout} from '../sdoc-list/sdoc-list.component';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Component({
    selector: 'app-sdoc-inline-searchpage',
    templateUrl: './sdoc-inline-searchpage.component.html',
    styleUrls: ['./sdoc-inline-searchpage.component.css']
})
export class SDocInlineSearchpageComponent implements OnInit, OnDestroy {
    private initialized = false;
    private appStateSubscription: Subscription;
    adminMode = false;
    Layout = Layout;

    searchResult: SDocSearchResult;
    searchForm: SDocSearchForm;

    // initialize a private variable _record, it's a BehaviorSubject
    private _paramsObservable = new BehaviorSubject<any>({});
    private _params = {};

    @Input()
    public set params(value: any) {
        // set the latest value for _data BehaviorSubject
        this._paramsObservable.next(value);
        this._params = value;
    };

    public get params(): any {
        // get the latest value from _data BehaviorSubject
        // return this._params.getValue();
        return this._params;
    }

    @Input()
    showForm = false;

    @Input()
    showOnlyIfRecordsFound = true;

    @Input()
    label: string;

    @Output()
    show: EventEmitter<SDocRecord> = new EventEmitter();

    constructor(private appService: AppService,
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
/**
        this._paramsObservable.subscribe(
            params => {
                console.error("doNewSearchWithparams", params);
                return this.doSearchWithParams(params);
            });
**/
    }

    ngOnDestroy() {
        // Clean sub to avoid memory leak
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

    private doSearchWithParams(params: any) {
        console.log('doSearchWithParams params:', params);
        this.searchFormConverter.paramsToSearchForm(params, {}, this.searchForm);
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
