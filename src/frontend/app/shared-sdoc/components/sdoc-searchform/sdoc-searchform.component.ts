import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewContainerRef} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {SDocSearchForm} from '../../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {SDocSearchResult} from '../../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {Facets} from '../../../../shared/search-commons/model/container/facets';
import {IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts} from 'angular-2-dropdown-multiselect';
import {SDocSearchFormUtils} from '../../services/sdoc-searchform-utils.service';
import {GeoLocationService} from '../../../../shared/commons/services/geolocation.service';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {ToastsManager} from 'ng2-toastr';
import {SDocDataCacheService} from '../../services/sdoc-datacache.service';
import {HumanReadableFilter, SearchFormUtils} from '../../../../shared/angular-commons/services/searchform-utils.service';
import {SearchFormLayout} from '../../../../shared/angular-commons/services/layout.service';
import {SDocSearchFormConverter} from '../../services/sdoc-searchform-converter.service';

@Component({
    selector: 'app-sdoc-searchform',
    templateUrl: './sdoc-searchform.component.html',
    styleUrls: ['./sdoc-searchform.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocSearchformComponent implements OnInit {
    // initialize a private variable _searchForm, it's a BehaviorSubject
    private _searchResult = new BehaviorSubject<SDocSearchResult>(new SDocSearchResult(new SDocSearchForm({}), 0, undefined, new Facets()));
    private geoLocationService = new GeoLocationService();
    private defaultSeLectSettings: IMultiSelectSettings =
        {dynamicTitleMaxItems: 5,
            buttonClasses: 'btn btn-default btn-secondary text-right fullwidth btn-sm multiselect-highlight-value',
            containerClasses: 'dropdown-inline fullwidth',
            enableSearch: true,
            showUncheckAll: true};

    public optionsSelectWhen: IMultiSelectOption[] = [];
    public optionsSelectWhere: IMultiSelectOption[] = [];
    public optionsSelectWhat: IMultiSelectOption[] = [];
    public optionsSelectType: IMultiSelectOption[] = [];
    public optionsSelectActionType: IMultiSelectOption[] = [];
    public optionsSelectTechRateOverall: IMultiSelectOption[] = [];
    public optionsSelectTechDataDistance: IMultiSelectOption[] = [];
    public optionsSelectTechDataAscent: IMultiSelectOption[] = [];
    public optionsSelectTechDataAltitudeMax: IMultiSelectOption[] = [];
    public optionsSelectTechDataDuration: IMultiSelectOption[] = [];
    public optionsSelectPersonalRateOverall: IMultiSelectOption[] = [];
    public optionsSelectPersonalRateDifficulty: IMultiSelectOption[] = [];
    public optionsSelectPlaylists: IMultiSelectOption[] = [];
    public optionsSelectPersons: IMultiSelectOption[] = [];

    public settingsSelectWhen = this.defaultSeLectSettings;
    public settingsSelectWhere: IMultiSelectSettings =
        {dynamicTitleMaxItems: 5,
            buttonClasses: 'btn btn-default btn-secondary text-right fullwidth btn-sm multiselect-highlight-value',
            containerClasses: 'dropdown-inline fullwidth',
            enableSearch: true,
            showUncheckAll: true,
            autoUnselect: true,
            selectionLimit: 1};
    public settingsSelectWhat = this.defaultSeLectSettings;
    public settingsSelectActionType = this.defaultSeLectSettings;
    public settingsSelectType: IMultiSelectSettings =
        {dynamicTitleMaxItems: 5,
            buttonClasses: 'btn btn-default btn-secondary text-right fullwidth btn-sm multiselect-highlight-value',
            containerClasses: 'dropdown-inline fullwidth',
            enableSearch: false};
    public settingsSelectTechRateOverall = this.defaultSeLectSettings;
    public settingsSelectTechDataDistance = this.defaultSeLectSettings;
    public settingsSelectTechDataAscent = this.defaultSeLectSettings;
    public settingsSelectTechDataAltitudeMax = this.defaultSeLectSettings;
    public settingsSelectTechDataDuration = this.defaultSeLectSettings;

    public settingsSelectPersonalRateOverall = this.defaultSeLectSettings;
    public settingsSelectPersonalRateDifficulty = this.defaultSeLectSettings;
    public settingsSelectPlaylists = this.defaultSeLectSettings;
    public settingsSelectPersons = this.defaultSeLectSettings;

    public textsSelectWhen: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Zeit ausgewählt',
        checkedPlural: 'Zeiten ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '',
        allSelected: 'Jederzeit'};
    public textsSelectWhere: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Region ausgewählt',
        checkedPlural: 'Regionen ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '',
        allSelected: 'Überall'};
    public textsSelectWhat: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Eigenschaft ausgewählt',
        checkedPlural: 'Eigenschaften ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '',
        allSelected: 'alles'};
    public textsSelectActionType: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Action ausgewählt',
        checkedPlural: 'Aktion ausgewählt',
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
    public textsSelectTechRateOverall: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Bewertung ausgewählt',
        checkedPlural: 'Bewertung ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '',
        allSelected: 'Alle'};
    public textsSelectTechDataDistance: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Strecke ausgewählt',
        checkedPlural: 'Strecke ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '',
        allSelected: 'Alle'};
    public textsSelectTechDataAscent: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Aufstieg ausgewählt',
        checkedPlural: 'Aufstieg ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '',
        allSelected: 'Alle'};
    public textsSelectTechDataAltitudeMax: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Hähe ausgewählt',
        checkedPlural: 'Höhen ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '',
        allSelected: 'Alle'};
    public textsSelectTechDataDuration: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Dauer ausgewählt',
        checkedPlural: 'Dauer ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '',
        allSelected: 'Alle'};

    public textsSelectPersonalRateOverall: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Bewertung ausgewählt',
        checkedPlural: 'Bewertung ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '',
        allSelected: 'Alle'};
    public textsSelectPersonalRateDifficulty: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Bewertung ausgewählt',
        checkedPlural: 'Bewertung ausgewählt',
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
    public textsSelectPersons: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Person ausgewählt',
        checkedPlural: 'Person ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '',
        allSelected: 'Alle'};

    public humanReadableSearchForm: SafeHtml = '';
    public humanReadableSpecialFilter = '';

    public showWhereAvailable = true;
    public showWhenAvailable = true;
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
    public showWhere? = this.showForm;

    @Input()
    public showWhat? = this.showForm;

    @Input()
    public showWhen? = this.showForm;

    @Input()
    public showFulltext? = this.showForm;

    @Input()
    public showDetails? = this.showForm;

    @Input()
    public showMeta? = this.showForm;

    @Input()
    public showSpecialFilter? = this.showForm;

    @Input()
    public set searchResult(value: SDocSearchResult) {
        // set the latest value for _data BehaviorSubject
        this._searchResult.next(value);
    };

    public get searchResult(): SDocSearchResult {
        // get the latest value from _data BehaviorSubject
        return this._searchResult.getValue();
    }

    @Output()
    public search: EventEmitter<SDocSearchForm> = new EventEmitter();

    @Output()
    public changedShowForm: EventEmitter<boolean> = new EventEmitter();

    // empty default
    public searchFormGroup = this.fb.group({
        when: [],
        where: [],
        nearby: '',
        nearbyAddress: '',
        nearbyDistance: '10',
        what: [],
        moreFilter: '',
        fulltext: '',
        techDataAscent: [],
        techDataAltitudeMax: [],
        techDataDistance: [],
        techDataDuration: [],
        techRateOverall: [],
        personalRateOverall: [],
        personalRateDifficulty: [],
        playlists: [],
        persons: [],
        actionType: [],
        type: [],
        sort: '',
        perPage: 10,
        pageNum: 1
    });

    constructor(private sanitizer: DomSanitizer, public fb: FormBuilder, private searchFormUtils: SearchFormUtils,
                private sdocSearchFormUtils: SDocSearchFormUtils, private searchFormConverter: SDocSearchFormConverter,
                private sdocDataCacheService: SDocDataCacheService, private toastr: ToastsManager, vcr: ViewContainerRef,
                private cd: ChangeDetectorRef) {
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

    public clearNearBy() {
        const me = this;
        const values = this.searchFormGroup.getRawValue();
        me.searchFormGroup.patchValue({'nearby': undefined});
        me.searchFormGroup.patchValue({'nearbyAddress': ''});
        me.doSearch();
    }

    public useBrowserGeoLocation() {
        const me = this;
        const values = this.searchFormGroup.getRawValue();
        this.geoLocationService.getCurrentPosition().toPromise().then(position => {
            const pos: Position = position;
            me.searchFormGroup.patchValue({'nearby': [pos.coords.latitude, pos.coords.longitude, values.nearbyDistance].join('_')});
            me.geoLocationService.doReverseLookup(pos.coords.latitude, pos.coords.longitude).then(function (result: any) {
                me.searchFormGroup.patchValue({'nearbyAddress':
                    SDocSearchForm.sdocFields.nearbyAddress.validator.sanitize(result.address)});
                me.doSearch();
            });
        });
    }

    private updateSearchForm(sdocSearchSearchResult: SDocSearchResult): void {
        const me = this;
        const values: SDocSearchForm = sdocSearchSearchResult.searchForm;

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

        this.searchFormGroup = this.fb.group({
            when: [(values.when ? values.when.split(/,/) : [])],
            what: [(values.what ? values.what.split(/,/) : [])],
            where: [(values.where ? values.where.split(/,/) : [])],
            nearbyAddress: values.nearbyAddress,
            nearbyDistance: '10',
            nearby: values.nearby,
            fulltext: values.fulltext,
            moreFilter: values.moreFilter,
            actiontype: [(values.actiontype ? values.actiontype.split(/,/) : [])],
            techDataAscent: [(values.techDataAscent ? values.techDataAscent.split(/,/) : [])],
            techDataAltitudeMax: [(values.techDataAltitudeMax ? values.techDataAltitudeMax.split(/,/) : [])],
            techDataDistance: [(values.techDataDistance ? values.techDataDistance.split(/,/) : [])],
            techDataDuration: [(values.techDataDuration ? values.techDataDuration.split(/,/) : [])],
            techRateOverall: [(values.techRateOverall ? values.techRateOverall.split(/,/) : [])],
            personalRateOverall: [(values.personalRateOverall ? values.personalRateOverall.split(/,/) : [])],
            personalRateDifficulty: [(values.personalRateDifficulty ? values.personalRateDifficulty.split(/,/) : [])],
            persons: [(values.persons ? values.persons.split(/,/) : [])],
            playlists: [(values.playlists ? values.playlists.split(/,/) : [])],
            type: [(values.type ? values.type.split(/,/) : [])]
        });

        const rawValues = this.searchFormGroup.getRawValue();

        this.optionsSelectWhen = this.searchFormUtils.moveSelectedToTop(
            this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                this.sdocSearchFormUtils.getWhenValues(sdocSearchSearchResult), true, [], true),
            rawValues['when']);
        this.optionsSelectWhere = this.searchFormUtils.moveSelectedToTop(
            this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                this.sdocSearchFormUtils.getWhereValues(sdocSearchSearchResult), true, [/^_+/, /_+$/], false),
            rawValues['where']);
        this.optionsSelectWhat = this.searchFormUtils.moveSelectedToTop(
            this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                this.sdocSearchFormUtils.getWhatValues(sdocSearchSearchResult), true, [/^kw_/gi], true),
            rawValues['what']);
        this.optionsSelectActionType = this.searchFormUtils.moveSelectedToTop(
            this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                this.sdocSearchFormUtils.getActionTypeValues(sdocSearchSearchResult), true, [], true)
                .sort(function (a, b) {
                    if (a['count'] < b['count']) {
                        return 1;
                    }
                    if (a['count'] > b['count']) {
                        return -1;
                    }
                    return a.name.localeCompare(b.name);
                }),
            rawValues['actiontype']);
        this.optionsSelectType = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                this.sdocSearchFormUtils.getTypeValues(sdocSearchSearchResult), true, [], true)
                .sort(function (a, b) {
                    return a.name.localeCompare(b.name);
                });
        if (this.sdocSearchFormUtils.getTypeLimit(sdocSearchSearchResult) > 0) {
            this.settingsSelectType.selectionLimit = this.sdocSearchFormUtils.getTypeLimit(sdocSearchSearchResult);
        } else {
            this.settingsSelectType.selectionLimit = 0;
        }
        this.settingsSelectType.autoUnselect = this.settingsSelectType.selectionLimit + '' === '1';

        this.optionsSelectTechRateOverall = this.searchFormUtils.moveSelectedToTop(
            this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                this.sdocSearchFormUtils.getTechRateOverallValues(sdocSearchSearchResult), true, [], true),
            rawValues['techRateOverall']);
        this.optionsSelectTechDataDistance = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            this.sdocSearchFormUtils.getTechDataDistanceValues(sdocSearchSearchResult), true, [], true);
        this.optionsSelectTechDataAscent = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            this.sdocSearchFormUtils.getTechDataAscentValues(sdocSearchSearchResult), true, [], true);
        this.optionsSelectTechDataAltitudeMax = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            this.sdocSearchFormUtils.getTechDataAltitudeMaxValues(sdocSearchSearchResult), true, [], true);
        this.optionsSelectTechDataDuration = this.searchFormUtils.moveSelectedToTop(
            this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                this.sdocSearchFormUtils.getTechDataDurationValues(sdocSearchSearchResult), true, [], true),
            rawValues['techDataDuration']);
        this.optionsSelectPersonalRateOverall = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            this.sdocSearchFormUtils.getPersonalRateOverallValues(sdocSearchSearchResult), true, [], true);
        this.optionsSelectPersonalRateDifficulty = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            this.sdocSearchFormUtils.getPersonalRateDifficultyValues(sdocSearchSearchResult), true, [], true);

        this.optionsSelectPlaylists = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            this.sdocSearchFormUtils.getPlaylistValues(sdocSearchSearchResult), true, [], true);
        this.optionsSelectPersons = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            this.sdocSearchFormUtils.getPersonValues(sdocSearchSearchResult), true, [], true);

        const [lat, lon, dist] = this.sdocSearchFormUtils.extractNearbyPos(values.nearby);
        if (lat && lon && (values.nearbyAddress === undefined || values.nearbyAddress === '')) {
            this.geoLocationService.doReverseLookup(lat, lon).then(function (result: any) {
                me.searchFormGroup.patchValue({'nearbyAddress':
                    SDocSearchForm.sdocFields.nearbyAddress.validator.sanitize(result.address)});
            });
        }
        if (dist) {
            me.searchFormGroup.patchValue({'nearbyDistance': dist});
        }

        this.showWhereAvailable = (this.optionsSelectWhere.length > 0);
        this.showWhenAvailable = (this.optionsSelectWhen.length > 0 || this.optionsSelectTechDataDuration.length > 0);
        this.showDetailsAvailable = (this.optionsSelectWhat.length > 0 || this.optionsSelectTechRateOverall.length > 0 ||
            this.optionsSelectTechDataDistance.length > 0 || this.optionsSelectTechDataAltitudeMax.length > 0 ||
            this.optionsSelectTechDataAscent.length > 0);
        this.showMetaAvailable = (this.optionsSelectPlaylists.length > 0 || this.optionsSelectPersons.length > 0 ||
            this.optionsSelectPersonalRateDifficulty.length > 0 || this.optionsSelectPersonalRateOverall.length > 0);

        me.humanReadableSpecialFilter = '';
        this.humanReadableSearchForm = '';
        const filters: HumanReadableFilter[] = this.searchFormConverter.searchFormToHumanReadableFilter(sdocSearchSearchResult.searchForm);
        const resolveableFilters = this.searchFormUtils.extractResolvableFilters(filters, this.searchFormConverter.getHrdIds());
        if (resolveableFilters.length > 0) {
            const resolveableIds = this.searchFormUtils.extractResolvableIds(resolveableFilters, this.searchFormConverter.getHrdIds());
            this.sdocDataCacheService.resolveNamesForIds(Array.from(resolveableIds.keys())).then(nameCache => {
                me.humanReadableSearchForm = me.sanitizer.bypassSecurityTrustHtml(
                    me.searchFormUtils.searchFormToHumanReadableMarkup(filters, false, nameCache, me.searchFormConverter.getHrdIds()));
                me.humanReadableSpecialFilter = me.searchFormUtils.searchFormToHumanReadableMarkup(resolveableFilters, true,
                    nameCache, me.searchFormConverter.getHrdIds());

                me.cd.markForCheck();
            }).catch(function onRejected(reason) {
                me.toastr.error('Es gibt leider Probleme bei der Suche - am besten noch einmal probieren :-(', 'Oje!');
                console.error('resolve moreFilterIds failed:', reason);
                me.humanReadableSearchForm = me.sanitizer.bypassSecurityTrustHtml(
                    me.searchFormUtils.searchFormToHumanReadableMarkup(filters, false, undefined, me.searchFormConverter.getHrdIds()));
                me.humanReadableSpecialFilter = me.searchFormUtils.searchFormToHumanReadableMarkup(
                    resolveableFilters, true, undefined, me.searchFormConverter.getHrdIds());

                me.cd.markForCheck();
            });
        } else {
            this.humanReadableSearchForm = this.sanitizer.bypassSecurityTrustHtml(
                this.searchFormUtils.searchFormToHumanReadableMarkup(filters, false, undefined, this.searchFormConverter.getHrdIds()));
            me.cd.markForCheck();
        }
    }

    removeMoreIdFilters(): void {
        const values = this.searchFormGroup.getRawValue();
        this.searchFormGroup.patchValue({'moreFilter': undefined});
        this.search.emit(values);
    }

    updateFormState(state?: boolean): void {
        if (state !== undefined) {
            this.showForm = this.showDetails = this.showFulltext = this.showMeta = this.showSpecialFilter = this.showWhat = this.showWhen
                = this.showWhere = state;
        } else {
            this.showForm = this.showDetails || this.showFulltext || this.showMeta || this.showSpecialFilter || this.showWhat
                || this.showWhen || this.showWhere;
        }

        this.changedShowForm.emit(this.showForm);
    }

    doLocationSearch(selector) {
        const me = this;
        this.geoLocationService.doLocationSearch(selector, this.searchFormGroup.getRawValue()['nearbyAddress']).then((event: any) => {
            const distance = me.searchFormGroup.getRawValue()['nearbyDistance'] || 10;
            me.searchFormGroup.patchValue({'nearby': event.detail.lat + '_' + event.detail.lon + '_' + distance});
            me.searchFormGroup.patchValue({'nearbyAddress':
                    SDocSearchForm.sdocFields.nearbyAddress.validator.sanitize(event.detail.formatted)});
            me.doSearch();
        }).catch(reason => {
            console.warn('locationsearch failed', reason);
        });

        return false;
    }

    private doSearch() {
        const values = this.searchFormGroup.getRawValue();
        values.nearby = this.sdocSearchFormUtils.joinNearbyPos(values);
        this.searchFormGroup.patchValue({'nearby': values.nearby});
        this.search.emit(values);
        return false;
    }
}
