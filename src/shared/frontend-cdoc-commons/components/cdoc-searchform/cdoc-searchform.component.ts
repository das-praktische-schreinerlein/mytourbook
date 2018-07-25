import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewContainerRef} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Facets} from '../../../search-commons/model/container/facets';
import {IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts} from 'angular-2-dropdown-multiselect';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {ToastsManager} from 'ng2-toastr';
import {HumanReadableFilter, SearchFormUtils} from '../../../angular-commons/services/searchform-utils.service';
import {SearchFormLayout} from '../../../angular-commons/services/layout.service';
import {CommonDocSearchForm} from '../../../search-commons/model/forms/cdoc-searchform';
import {CommonDocDataService} from '../../../search-commons/services/cdoc-data.service';
import {CommonDocRecord} from '../../../search-commons/model/records/cdoc-entity-record';
import {CommonDocSearchResult} from '../../../search-commons/model/container/cdoc-searchresult';
import {CommonDocSearchFormUtils} from '../../services/cdoc-searchform-utils.service';
import {GenericSearchFormSearchFormConverter} from '../../../search-commons/services/generic-searchform.converter';
import {CommonDocDataCacheService} from '../../services/cdoc-datacache.service';

export abstract class CDocSearchformComponent <R extends CommonDocRecord, F extends CommonDocSearchForm,
    S extends CommonDocSearchResult<R, F>, D extends CommonDocDataService<R, F, S>> implements OnInit {
    // initialize a private variable _searchForm, it's a BehaviorSubject
    private _searchResult: BehaviorSubject<S>;
    private defaultSeLectSettings: IMultiSelectSettings =
        {dynamicTitleMaxItems: 5,
            buttonClasses: 'btn btn-default btn-secondary text-right fullwidth btn-sm multiselect-highlight-value',
            containerClasses: 'dropdown-inline fullwidth',
            enableSearch: true,
            showUncheckAll: true};

    public optionsSelectWhat: IMultiSelectOption[] = [];
    public optionsSelectType: IMultiSelectOption[] = [];
    public optionsSelectPlaylists: IMultiSelectOption[] = [];

    public settingsSelectWhat = this.defaultSeLectSettings;
    public settingsSelectType: IMultiSelectSettings =
        {dynamicTitleMaxItems: 5,
            buttonClasses: 'btn btn-default btn-secondary text-right fullwidth btn-sm multiselect-highlight-value',
            containerClasses: 'dropdown-inline fullwidth',
            enableSearch: false};
    public settingsSelectPlaylists = this.defaultSeLectSettings;

    public textsSelectWhat: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Eigenschaft ausgewählt',
        checkedPlural: 'Eigenschaften ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '',
        allSelected: 'alles'};
    public textsSelectType: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Typ ausgewählt',
        checkedPlural: 'Typen ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '',
        allSelected: 'Alle'};
    public textsSelectPlaylists: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Playlist ausgewählt',
        checkedPlural: 'Playlist ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '',
        allSelected: 'Alle'};

    public humanReadableSearchForm: SafeHtml = '';
    public humanReadableSpecialFilter = '';

    public showDetailsAvailable = true;
    public showMetaAvailable = true;

    public width8 = 'col-sm-8';
    public width4 = 'col-sm-4';
    public width3 = 'col-sm-3';
    public width2 = 'col-sm-2';

    @Input()
    public searchFormLayout: SearchFormLayout = SearchFormLayout.GRID;

    @Input()
    public short? = false;

    @Input()
    public showForm? = false;

    @Input()
    public showWhat? = this.showForm;

    @Input()
    public showFulltext? = this.showForm;

    @Input()
    public showDetails? = this.showForm;

    @Input()
    public showMeta? = this.showForm;

    @Input()
    public showSpecialFilter? = this.showForm;

    @Input()
    public set searchResult(value: S) {
        // set the latest value for _data BehaviorSubject
        this._searchResult.next(value);
    };

    public get searchResult(): S {
        // get the latest value from _data BehaviorSubject
        return this._searchResult.getValue();
    }

    @Output()
    public search: EventEmitter<F> = new EventEmitter();

    @Output()
    public changedShowForm: EventEmitter<boolean> = new EventEmitter();

    // empty default
    public searchFormGroup;

    constructor(private sanitizer: DomSanitizer, public fb: FormBuilder, private searchFormUtils: SearchFormUtils,
                private cdocSearchFormUtils: CommonDocSearchFormUtils, private searchFormConverter: GenericSearchFormSearchFormConverter<F>,
                private sdocDataCacheService: CommonDocDataCacheService<R, F, S, D>, private toastr: ToastsManager, vcr: ViewContainerRef,
                private cd: ChangeDetectorRef) {
        this._searchResult = new BehaviorSubject<S>(this.createDefaultSearchResult());
        this.searchFormGroup = this.createDefaultFormGroup();
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        this._searchResult.subscribe(
            sdocSearchSearchResult => {
                this.updateSearchForm(sdocSearchSearchResult);
            },
        );
    }

    public onSubmitSearch(event?: any) {
        this.doSearch();
        return false;
    }

    public onChangeSelect(event?: any) {
        this.doSearch();
        return false;
    }

    protected createDefaultSearchResult(): S {
        return <S>new CommonDocSearchResult(new CommonDocSearchForm({}), 0, undefined, new Facets());
    }

    protected createDefaultFormGroup(): any {
        return this.fb.group({
            what: [],
            moreFilter: '',
            fulltext: '',
            playlists: [],
            type: [],
            sort: '',
            perPage: 10,
            pageNum: 1
        });
    }

    protected updateSearchForm(searchSearchResult: S): void {
        if (this.searchFormLayout === SearchFormLayout.STACKED) {
            this.width8 = 'col-sm-12';
            this.width4 = 'col-sm-12';
            this.width3 = 'col-sm-12';
            this.width2 = 'col-sm-6';
        } else {
            this.width8 = 'col-sm-8';
            this.width4 = 'col-sm-4';
            this.width3 = 'col-sm-3';
            this.width2 = 'col-sm-2';
        }
        this.updateFormGroup(searchSearchResult);
        this.updateSelectComponents(searchSearchResult);
        this.updateAvailabilityFlags(searchSearchResult);
        this.updateHumanReadableFiltes(searchSearchResult);
    }

    protected updateFormGroup(sdocSearchSearchResult: S): void {
        const values: F = sdocSearchSearchResult.searchForm;
        this.searchFormGroup = this.fb.group({
            what: [(values.what ? values.what.split(/,/) : [])],
            fulltext: values.fulltext,
            moreFilter: values.moreFilter,
            playlists: [(values.playlists ? values.playlists.split(/,/) : [])],
            type: [(values.type ? values.type.split(/,/) : [])]
        });
    }

    protected updateSelectComponents(sdocSearchSearchResult: S) {
        const rawValues = this.searchFormGroup.getRawValue();
        this.optionsSelectWhat = this.searchFormUtils.moveSelectedToTop(
            this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                this.cdocSearchFormUtils.getWhatValues(sdocSearchSearchResult), true, [/^kw_/gi], true),
            rawValues['what']);
        this.optionsSelectType = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            this.cdocSearchFormUtils.getTypeValues(sdocSearchSearchResult), true, [], true)
            .sort(function (a, b) {
                return a.name.localeCompare(b.name);
            });
        if (this.cdocSearchFormUtils.getTypeLimit(sdocSearchSearchResult) > 0) {
            this.settingsSelectType.selectionLimit = this.cdocSearchFormUtils.getTypeLimit(sdocSearchSearchResult);
        } else {
            this.settingsSelectType.selectionLimit = 0;
        }
        this.settingsSelectType.autoUnselect = this.settingsSelectType.selectionLimit + '' === '1';
        this.optionsSelectPlaylists = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            this.cdocSearchFormUtils.getPlaylistValues(sdocSearchSearchResult), true, [], true);
    }

    protected updateHumanReadableFiltes(sdocSearchSearchResult: S) {
        const me = this;
        this.humanReadableSpecialFilter = '';
        this.humanReadableSearchForm = '';
        const filters: HumanReadableFilter[] = this.searchFormConverter.searchFormToHumanReadableFilter(sdocSearchSearchResult.searchForm);
        const resolveableFilters = this.searchFormUtils.extractResolvableFilters(filters, this.searchFormConverter.getHrdIds());
        if (resolveableFilters.length > 0) {
            const resolveableIds = this.searchFormUtils.extractResolvableIds(resolveableFilters, this.searchFormConverter.getHrdIds());
            this.sdocDataCacheService.resolveNamesForIds(Array.from(resolveableIds.keys())).then(nameCache => {
                me.humanReadableSearchForm = me.sanitizer.bypassSecurityTrustHtml(
                    me.searchFormUtils.searchFormToHumanReadableMarkup(filters, false, nameCache, me.searchFormConverter.getHrdIds()));
                me.humanReadableSpecialFilter = me.searchFormUtils.searchFormToHumanReadableMarkup(resolveableFilters, true, nameCache,
                    me.searchFormConverter.getHrdIds());

                me.cd.markForCheck();
            }).catch(function onRejected(reason) {
                me.toastr.error('Es gibt leider Probleme bei der Suche - am besten noch einmal probieren :-(', 'Oje!');
                console.error('resolve moreFilterIds failed:', reason);
                me.humanReadableSearchForm = me.sanitizer.bypassSecurityTrustHtml(
                    me.searchFormUtils.searchFormToHumanReadableMarkup(filters, false, undefined, me.searchFormConverter.getHrdIds()));
                me.humanReadableSpecialFilter = me.searchFormUtils.searchFormToHumanReadableMarkup(resolveableFilters, true,
                    undefined, me.searchFormConverter.getHrdIds());

                me.cd.markForCheck();
            });
        } else {
            this.humanReadableSearchForm = this.sanitizer.bypassSecurityTrustHtml(
                this.searchFormUtils.searchFormToHumanReadableMarkup(filters, false, undefined, this.searchFormConverter.getHrdIds()));
            this.cd.markForCheck();
        }
    }

    protected updateAvailabilityFlags(sdocSearchSearchResult: S) {
        this.showDetailsAvailable = (this.optionsSelectWhat.length > 0);
        this.showMetaAvailable = (this.optionsSelectPlaylists.length > 0);
    }

    protected removeMoreIdFilters(): void {
        const values = this.searchFormGroup.getRawValue();
        this.searchFormGroup.patchValue({'moreFilter': undefined});
        this.search.emit(values);
    }

    protected updateFormState(state?: boolean): void {
        if (state !== undefined) {
            this.showForm = this.showDetails = this.showFulltext = this.showMeta = this.showSpecialFilter = this.showWhat = state;
        } else {
            this.showForm = this.showDetails || this.showFulltext || this.showMeta || this.showSpecialFilter || this.showWhat;
        }

        this.changedShowForm.emit(this.showForm);
    }

    protected beforeDoSearchPrepareValues(values: {}) {
    }

    protected doSearch() {
        const values = this.searchFormGroup.getRawValue();
        this.beforeDoSearchPrepareValues({values});
        this.search.emit(values);
        return false;
    }
}
