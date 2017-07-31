import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {SDocSearchForm} from '../../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {SDocSearchResult} from '../../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {Facets} from '../../../../shared/search-commons/model/container/facets';
import {IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts} from 'angular-2-dropdown-multiselect';
import {SDocSearchFormUtils} from '../../services/sdoc-searchform-utils.service';
import {GeoCoder} from 'geo-coder';

@Component({
    selector: 'app-sdoc-searchform',
    templateUrl: './sdoc-searchform.component.html',
    styleUrls: ['./sdoc-searchform.component.css']
})
export class SDocSearchformComponent implements OnInit {
    // initialize a private variable _searchForm, it's a BehaviorSubject
    private _searchResult = new BehaviorSubject<SDocSearchResult>(new SDocSearchResult(new SDocSearchForm({}), 0, undefined, new Facets()));
    private geoCoder = new GeoCoder({ provider: 'osm' });

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

    public settingsSelectWhen: IMultiSelectSettings =
        {dynamicTitleMaxItems: 5,
            buttonClasses: 'btn btn-default btn-secondary text-right fullwidth btn-sm',
            containerClasses: 'dropdown-inline fullwidth',
            enableSearch: true,
            showUncheckAll: true};
    public settingsSelectWhere: IMultiSelectSettings =
        {dynamicTitleMaxItems: 5,
            buttonClasses: 'btn btn-default btn-secondary text-right fullwidth btn-sm',
            containerClasses: 'dropdown-inline fullwidth',
            enableSearch: true,
            showUncheckAll: true};
    public settingsSelectWhat: IMultiSelectSettings =
        {dynamicTitleMaxItems: 5,
            buttonClasses: 'btn btn-default btn-secondary text-right fullwidth btn-sm',
            containerClasses: 'dropdown-inline fullwidth',
            enableSearch: true,
            showUncheckAll: true};
    public settingsSelectActionType: IMultiSelectSettings =
        {dynamicTitleMaxItems: 5,
            buttonClasses: 'btn btn-default btn-secondary text-right fullwidth btn-sm',
            containerClasses: 'dropdown-inline fullwidth',
            enableSearch: true,
            showUncheckAll: true};
    public settingsSelectType: IMultiSelectSettings =
        {dynamicTitleMaxItems: 5,
            buttonClasses: 'btn btn-default btn-secondary text-right fullwidth btn-sm',
            containerClasses: 'dropdown-inline fullwidth',
            enableSearch: false};
    public settingsSelectTechRateOverall: IMultiSelectSettings =
        {dynamicTitleMaxItems: 5,
            buttonClasses: 'btn btn-default btn-secondary text-right fullwidth btn-sm',
            containerClasses: 'dropdown-inline fullwidth',
            enableSearch: true,
            showUncheckAll: true};
    public settingsSelectTechDataDistance: IMultiSelectSettings =
        {dynamicTitleMaxItems: 5,
            buttonClasses: 'btn btn-default btn-secondary text-right fullwidth btn-sm',
            containerClasses: 'dropdown-inline fullwidth',
            enableSearch: true,
            showUncheckAll: true};
    public settingsSelectTechDataAscent: IMultiSelectSettings =
        {dynamicTitleMaxItems: 5,
            buttonClasses: 'btn btn-default btn-secondary text-right fullwidth btn-sm',
            containerClasses: 'dropdown-inline fullwidth',
            enableSearch: true,
            showUncheckAll: true};
    public settingsSelectTechDataAltitudeMax: IMultiSelectSettings =
        {dynamicTitleMaxItems: 5,
            buttonClasses: 'btn btn-default btn-secondary text-right fullwidth btn-sm',
            containerClasses: 'dropdown-inline fullwidth',
            enableSearch: true,
            showUncheckAll: true};
    public settingsSelectTechDataDuration: IMultiSelectSettings =
        {dynamicTitleMaxItems: 5,
            buttonClasses: 'btn btn-default btn-secondary text-right fullwidth btn-sm',
            containerClasses: 'dropdown-inline fullwidth',
            enableSearch: true,
            showUncheckAll: true};

    public textsSelectWhen: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Zeit ausgewählt',
        checkedPlural: 'Zeiten ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: 'Zeiten',
        allSelected: 'Jederzeit'};
    public textsSelectWhere: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Region ausgewählt',
        checkedPlural: 'Regionen ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: 'Regionen',
        allSelected: 'Überall'};
    public textsSelectWhat: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Eigenschaft ausgewählt',
        checkedPlural: 'Eigenschaften ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: 'Eigenschaften',
        allSelected: 'alles'};
    public textsSelectActionType: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Action ausgewählt',
        checkedPlural: 'Ation ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: 'Actions',
        allSelected: 'alles'};
    public textsSelectType: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Typ ausgewählt',
        checkedPlural: 'Typen ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: 'Typen',
        allSelected: 'Alle'};
    public textsSelectTechRateOverall: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Bewertung ausgewählt',
        checkedPlural: 'Bewertung ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: 'Bewertung',
        allSelected: 'Alle'};
    public textsSelectTechDataDistance: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Strecke ausgewählt',
        checkedPlural: 'Strecke ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: 'Strecke',
        allSelected: 'Alle'};
    public textsSelectTechDataAscent: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Aufstieg ausgewählt',
        checkedPlural: 'Aufstieg ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: 'Aufstieg',
        allSelected: 'Alle'};
    public textsSelectTechDataAltitudeMax: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Hähe ausgewählt',
        checkedPlural: 'Höhen ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: 'Höhen',
        allSelected: 'Alle'};
    public textsSelectTechDataDuration: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Dauer ausgewählt',
        checkedPlural: 'Dauer ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: 'Dauer',
        allSelected: 'Alle'};

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

    // empty default
    public searchFormGroup = this.fb.group({
        when: [],
        where: [],
        nearby: '',
        nearbyAddress: '',
        nearbyDistance: '10',
        what: [],
        fulltext: '',
        techDataAscent: [],
        techDataAltitudeMax: [],
        techDataDistance: [],
        techDataDuration: [],
        techRateOverall: [],
        actionType: [],
        type: [],
        sort: '',
        perPage: 10,
        pageNum: 1
    });

    constructor(public fb: FormBuilder, private searchFormUtils: SDocSearchFormUtils) {
    }

    ngOnInit() {
        this._searchResult.subscribe(
            sdocSearchSearchResult => {
                this.updateSearchForm(sdocSearchSearchResult);
            },
        );

        this.initGeoCodeAutoComplete();
    }

    public onSubmitSearch(event: any) {
        this.doSearch();
        return false;
    }

    public onChangeSelect() {
        this.doSearch();
        return false;
    }

    private updateSearchForm(sdocSearchSearchResult: SDocSearchResult): void {
        const me = this;
        const values: SDocSearchForm = sdocSearchSearchResult.searchForm;

        this.searchFormGroup = this.fb.group({
            when: [(values.when ? values.when.split(/,/) : [])],
            what: [(values.what ? values.what.split(/,/) : [])],
            where: [(values.where ? values.where.split(/,/) : [])],
            nearbyAddress: values.nearbyAddress,
            nearbyDistance: '10',
            nearby: values.nearby,
            fulltext: values.fulltext,
            actiontype: [(values.actiontype ? values.actiontype.split(/,/) : [])],
            techDataAscent: [(values.techDataAscent ? values.techDataAscent.split(/,/) : [])],
            techDataAltitudeMax: [(values.techDataAltitudeMax ? values.techDataAltitudeMax.split(/,/) : [])],
            techDataDistance: [(values.techDataDistance ? values.techDataDistance.split(/,/) : [])],
            techDataDuration: [(values.techDataDuration ? values.techDataDuration.split(/,/) : [])],
            techRateOverall: [(values.techRateOverall ? values.techRateOverall.split(/,/) : [])],
            type: [(values.type ? values.type.split(/,/) : [])]
        });

        this.optionsSelectWhen = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            this.searchFormUtils.getWhenValues(sdocSearchSearchResult), true, [], true);
        this.optionsSelectWhere = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            this.searchFormUtils.getWhereValues(sdocSearchSearchResult), true, [], false);
        this.optionsSelectWhat = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            this.searchFormUtils.getWhatValues(sdocSearchSearchResult), true, ['kw_'], true);
        this.optionsSelectActionType = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            this.searchFormUtils.getActionTypeValues(sdocSearchSearchResult), true, [], true)
            .sort(function (a, b) {
                if (a['count'] < b['count']) {
                    return 1;
                }
                if (a['count'] > b['count']) {
                    return -1;
                }
                return a.name.localeCompare(b.name);
            });
        this.optionsSelectType = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            this.searchFormUtils.getTypeValues(sdocSearchSearchResult), true, [], true)
            .sort(function (a, b) {
                return a.name.localeCompare(b.name);
            });
        this.optionsSelectTechRateOverall = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            this.searchFormUtils.getTechRateOverallValues(sdocSearchSearchResult), true, [], true);
        this.optionsSelectTechDataDistance = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            this.searchFormUtils.getTechDataDistanceValues(sdocSearchSearchResult), true, [], true);
        this.optionsSelectTechDataAscent = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            this.searchFormUtils.getTechDataAscentValues(sdocSearchSearchResult), true, [], true);
        this.optionsSelectTechDataAltitudeMax = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            this.searchFormUtils.getTechDataAltitudeMaxValues(sdocSearchSearchResult), true, [], true);
        this.optionsSelectTechDataDuration = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            this.searchFormUtils.getTechDataDurationValues(sdocSearchSearchResult), true, [], true);

        const [lat, lon, dist] = this.extractNearbyPos(values.nearby);
        if (lat && lon && (values.nearbyAddress === undefined || values.nearbyAddress === '')) {
            this.doReverseLookUpForNearBy(lat, lon).then(function (result: any) {
                me.searchFormGroup.patchValue({'nearbyAddress':
                    SDocSearchForm.sdocFields.nearbyAddress.validator.sanitize(result.address)});
            });
        }
        if (dist) {
            me.searchFormGroup.patchValue({'nearbyDistance': dist});
        }
    }

    private doReverseLookUpForNearBy(lat: any, lon: any): Promise<string> {
        if (! (lat && lon)) {
            return Promise.reject('no coordinates - lat:' + lat + ' lon:' + lon);
        }

        return this.geoCoder.reverse(lat, lon).then(result => {
            return Promise.resolve(result);
        });
    }

    private initGeoCodeAutoComplete(): void {
        const inputEl = document.querySelector('.nearbyAddressAutocomplete');
        this.geoCoder.autocomplete(inputEl);
        inputEl.addEventListener('place_changed', (event: any) => {
            const distance = this.searchFormGroup.getRawValue()['nearbyDistance'] || 10;
            this.searchFormGroup.patchValue({'nearby': event.detail.lat + '_' + event.detail.lon + '_' + distance});
            this.searchFormGroup.patchValue({'nearbyAddress':
                SDocSearchForm.sdocFields.nearbyAddress.validator.sanitize(event.detail.formatted)});
            this.doSearch();
            return false;
        });
    }

    private doSearch() {
        const values = this.searchFormGroup.getRawValue();
        const [lat, lon, dist] = this.extractNearbyPos(values.nearby);
        values.nearby = '';
        if (lat && lon && dist && values.nearbyAddress) {
            values.nearby = [lat, lon, values.nearbyDistance].join('_');
        }

        this.searchFormGroup.patchValue({'nearby': values.nearby});
        this.search.emit(values);
        return false;
    }

    private extractNearbyPos(nearby: string): any[] {
        if (!nearby || nearby.length <= 0) {
            return [];
        }

        const [lat, lon, dist] = nearby.split('_');
        if (! (lat && lon && dist)) {
            return [];
        }

        return [lat, lon, dist];
    }
}
