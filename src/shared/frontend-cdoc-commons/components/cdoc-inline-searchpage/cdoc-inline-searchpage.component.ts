import {ChangeDetectorRef, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewContainerRef} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {Facets} from '../../../search-commons/model/container/facets';
import {ToastsManager} from 'ng2-toastr';
import {CommonDocRoutingService} from '../../services/cdoc-routing.service';
import {Layout} from '../../../angular-commons/services/layout.service';
import {AppState, GenericAppService} from '../../../commons/services/generic-app.service';
import {CommonRoutingService} from '../../../angular-commons/services/common-routing.service';
import {PageUtils} from '../../../angular-commons/services/page.utils';
import {CommonDocSearchForm} from '../../../search-commons/model/forms/cdoc-searchform';
import {CommonDocDataService} from '../../../search-commons/services/cdoc-data.service';
import {CommonDocRecord} from '../../../search-commons/model/records/cdoc-entity-record';
import {CommonDocSearchResult} from '../../../search-commons/model/container/cdoc-searchresult';
import {GenericSearchFormSearchFormConverter} from '../../../search-commons/services/generic-searchform.converter';
import {AbstractInlineComponent} from '../../../angular-commons/components/inline.component';

export class CommonDocInlineSearchpageComponent <R extends CommonDocRecord, F extends CommonDocSearchForm,
    S extends CommonDocSearchResult<R, F>, D extends CommonDocDataService<R, F, S>> extends AbstractInlineComponent
    implements OnInit, OnDestroy {
    protected initialized = false;
    protected appStateSubscription: Subscription;

    showLoadingSpinner = false;
    Layout = Layout;

    searchResult: S;
    searchForm: F;

    @Input()
    public params = {};

    @Input()
    public showForm = false;

    @Input()
    public showTimetable? = false;

    @Input()
    public showLayout? = false;

    @Input()
    public showResultList? = false;

    @Input()
    public loadFacets? = false;

    @Input()
    public loadTrack? = false;

    @Input()
    public showOnlyIfRecordsFound = true;

    @Input()
    public label: string;

    @Input()
    public baseSearchUrl? = 'cdoc/';

    @Input()
    public searchLinkLabel?: string;

    @Input()
    public htmlId?: string;

    @Input()
    public layout: Layout;

    @Input()
    public short? = false;

    @Input()
    public perPageOnToSearchPage? = 10;

    @Output()
    public show: EventEmitter<R> = new EventEmitter();

    @Output()
    public searchResultFound: EventEmitter<S> = new EventEmitter();

    constructor(protected appService: GenericAppService, protected commonRoutingService: CommonRoutingService,
                protected cdocDataService: D, protected searchFormConverter: GenericSearchFormSearchFormConverter<F>,
                protected cdocRoutingService: CommonDocRoutingService, protected toastr: ToastsManager, vcr: ViewContainerRef,
                protected cd: ChangeDetectorRef, protected elRef: ElementRef, protected pageUtils: PageUtils) {
        super(cd);
        this.searchForm = this.cdocDataService.newSearchForm({});
        this.searchResult = this.cdocDataService.newSearchResult(this.searchForm, 0, [], new Facets());
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

    onShowDoc(cdoc: R) {
        this.cdocRoutingService.navigateToShow(cdoc, '');
        return false;
    }

    onPageChange(page: number) {
        if (!this.initialized) {
            // ignore changes if not initialized
            return;
        }

        this.searchForm.pageNum = +page;
        this.doSearch();
        this.pageUtils.scrollToTopOfElement(this.elRef);

        return false;
    }

    onPerPageChange(perPage: number) {
        if (!this.initialized) {
            // ignore changes if not initialized
            return;
        }

        this.searchForm.perPage = perPage;
        this.searchForm.pageNum = 1;
        this.doSearch();

        return false;
    }

    onSortChange(sort: string) {
        if (!this.initialized) {
            // ignore changes if not initialized
            return;
        }

        this.searchForm.sort = sort;
        this.searchForm.pageNum = 1;
        this.doSearch();

        return false;
    }

    onLayoutChange(layout: Layout) {
        if (!this.initialized) {
            // ignore changes if not initialized
            return;
        }

        this.layout = layout;
        this.cd.markForCheck();

        return false;
    }

    onSearchDoc(cdocSearchForm: F) {
        this.searchForm = cdocSearchForm;
        this.doSearch();
        return false;
    }

    getToSearchUrl() {
        const lSearchForm = this.cdocDataService.cloneSanitizedSearchForm(this.searchForm);
        lSearchForm.perPage = this.perPageOnToSearchPage;
        return this.searchFormConverter.searchFormToUrl(this.baseSearchUrl, lSearchForm);
    }

    onToSearchPage(event: any) {
        this.commonRoutingService.navigateByUrl(this.getToSearchUrl());
        return false;
    }

    protected updateData(): void {
        if (this.initialized) {
            return this.doSearchWithParams(this.params);
        }

    }

    protected doSearchWithParams(params: any) {
        // console.log('doSearchWithParams params:', params);
        this.searchFormConverter.paramsToSearchForm(params, {}, this.searchForm);
        this.searchForm = this.cdocDataService.cloneSanitizedSearchForm(this.searchForm);
        this.doSearch();
    }

    protected doSearch() {
        // console.log('doSearch form:', this.searchForm);
        const me = this;
        me.showLoadingSpinner = true;
        me.cd.markForCheck();
        this.cdocDataService.search(this.searchForm,
            {
                showFacets: this.showForm || this.loadFacets || (this.showTimetable ? ['week_is', 'month_is'] : false),
                loadTrack: this.loadTrack,
                showForm: this.showForm
            }).then(function doneSearch(cdocSearchResult) {
            me.showLoadingSpinner = false;
            if (cdocSearchResult === undefined) {
                // console.log('empty searchResult', cdocSearchResult);
                me.searchResult = me.cdocDataService.newSearchResult(me.searchForm, 0, [], new Facets());
            } else {
                // console.log('update searchResult', cdocSearchResult);
                me.initialized = true;
                me.searchResult = cdocSearchResult;
                me.searchForm = cdocSearchResult.searchForm;
            }
            me.searchResultFound.emit(me.searchResult);

            me.cd.markForCheck();
        }).catch(function errorSearch(reason) {
            me.toastr.error('Es gibt leider Probleme bei der Suche - am besten noch einmal probieren :-(', 'Oje!');
            console.error('doSearch failed:', reason);
            me.showLoadingSpinner = false;
            me.searchResult = me.cdocDataService.newSearchResult(me.searchForm, 0, [], new Facets());
            me.searchResultFound.emit(me.searchResult);
            me.cd.markForCheck();
        });
    }
}
