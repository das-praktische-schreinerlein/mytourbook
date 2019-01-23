import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {TourDocSearchForm} from '../../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {Facets} from '@dps/mycms-commons/dist/search-commons/model/container/facets';
import {IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts} from 'angular-2-dropdown-multiselect';
import {TourDocSearchFormUtils} from '../../services/tdoc-searchform-utils.service';
import {GeoLocationService} from '@dps/mycms-commons/dist/commons/services/geolocation.service';
import {DomSanitizer} from '@angular/platform-browser';
import {ToastrService} from 'ngx-toastr';
import {TourDocDataCacheService} from '../../services/tdoc-datacache.service';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {TourDocSearchFormConverter} from '../../services/tdoc-searchform-converter.service';
import {CommonDocSearchformComponent} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-searchform/cdoc-searchform.component';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';

@Component({
    selector: 'app-tdoc-searchform',
    templateUrl: './tdoc-searchform.component.html',
    styleUrls: ['./tdoc-searchform.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocSearchformComponent extends CommonDocSearchformComponent<TourDocRecord, TourDocSearchForm, TourDocSearchResult, TourDocDataService> {
    // initialize a private variable _searchForm, it's a BehaviorSubject
    private geoLocationService = new GeoLocationService();

    public optionsSelectWhen: IMultiSelectOption[] = [];
    public optionsSelectWhere: IMultiSelectOption[] = [];
    public optionsSelectActionType: IMultiSelectOption[] = [];
    public optionsSelectTechRateOverall: IMultiSelectOption[] = [];
    public optionsSelectTechDataDistance: IMultiSelectOption[] = [];
    public optionsSelectTechDataAscent: IMultiSelectOption[] = [];
    public optionsSelectTechDataAltitudeMax: IMultiSelectOption[] = [];
    public optionsSelectTechDataDuration: IMultiSelectOption[] = [];
    public optionsSelectPersonalRateOverall: IMultiSelectOption[] = [];
    public optionsSelectPersonalRateDifficulty: IMultiSelectOption[] = [];
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
    public settingsSelectActionType = this.defaultSeLectSettings;
    public settingsSelectTechRateOverall = this.defaultSeLectSettings;
    public settingsSelectTechDataDistance = this.defaultSeLectSettings;
    public settingsSelectTechDataAscent = this.defaultSeLectSettings;
    public settingsSelectTechDataAltitudeMax = this.defaultSeLectSettings;
    public settingsSelectTechDataDuration = this.defaultSeLectSettings;

    public settingsSelectPersonalRateOverall = this.defaultSeLectSettings;
    public settingsSelectPersonalRateDifficulty = this.defaultSeLectSettings;
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
    public textsSelectActionType: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Action ausgewählt',
        checkedPlural: 'Aktion ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '',
        allSelected: 'alles'};
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
    public textsSelectPersons: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Person ausgewählt',
        checkedPlural: 'Person ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '',
        allSelected: 'Alle'};

    public showWhereAvailable = true;
    public showWhenAvailable = true;

    @Input()
    public showWhere? = this.showForm;

    @Input()
    public showWhen? = this.showForm;

    constructor(sanitizer: DomSanitizer, fb: FormBuilder, searchFormUtils: SearchFormUtils,
                private tdocSearchFormUtils: TourDocSearchFormUtils, searchFormConverter: TourDocSearchFormConverter,
                tdocDataCacheService: TourDocDataCacheService, toastr: ToastrService, cd: ChangeDetectorRef) {
        super(sanitizer, fb, searchFormUtils, tdocSearchFormUtils, searchFormConverter, tdocDataCacheService, toastr, cd);
        this.defaultSeLectSettings.dynamicTitleMaxItems = 2;
    }

    protected createDefaultSearchResult(): TourDocSearchResult {
        return new TourDocSearchResult(new TourDocSearchForm({}), 0, undefined, new Facets());
    }

    protected createDefaultFormGroup(): any {
        return this.fb.group({
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
                    TourDocSearchForm.tdocFields.nearbyAddress.validator.sanitize(result.address)});
                me.doSearch();
            });
        });
    }

    protected updateFormGroup(tdocSearchSearchResult: TourDocSearchResult): void {
        const values: TourDocSearchForm = tdocSearchSearchResult.searchForm;
        let nearbyDistance = 10;
        if (values.nearby) {
            const arr = this.tdocSearchFormUtils.extractNearbyPos(values.nearby);
            if (arr.length === 3) {
                nearbyDistance = arr[2];
            }
        }
        this.searchFormGroup = this.fb.group({
            when: [(values.when ? values.when.split(/,/) : [])],
            what: [(values.what ? values.what.split(/,/) : [])],
            where: [(values.where ? values.where.split(/,/) : [])],
            nearbyAddress: values.nearbyAddress,
            nearbyDistance: nearbyDistance,
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
    }

    protected updateSelectComponents(tdocSearchSearchResult: TourDocSearchResult) {
        super.updateSelectComponents(tdocSearchSearchResult);
        const me = this;

        const rawValues = this.searchFormGroup.getRawValue();
        this.optionsSelectWhen = this.searchFormUtils.moveSelectedToTop(
            this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                this.tdocSearchFormUtils.getWhenValues(tdocSearchSearchResult), true, [], true),
            rawValues['when']);
        this.optionsSelectWhere = this.searchFormUtils.moveSelectedToTop(
            this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                this.tdocSearchFormUtils.getWhereValues(tdocSearchSearchResult), true, [/^_+/, /_+$/], false),
            rawValues['where']);
        this.optionsSelectActionType = this.searchFormUtils.moveSelectedToTop(
            this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                this.tdocSearchFormUtils.getActionTypeValues(tdocSearchSearchResult), true, [], true)
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

        this.optionsSelectTechRateOverall = this.searchFormUtils.moveSelectedToTop(
            this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                this.tdocSearchFormUtils.getTechRateOverallValues(tdocSearchSearchResult), true, [], true),
            rawValues['techRateOverall']);
        this.optionsSelectTechDataDistance = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            this.tdocSearchFormUtils.getTechDataDistanceValues(tdocSearchSearchResult), true, [], true);
        this.optionsSelectTechDataAscent = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            this.tdocSearchFormUtils.getTechDataAscentValues(tdocSearchSearchResult), true, [], true);
        this.optionsSelectTechDataAltitudeMax = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            this.tdocSearchFormUtils.getTechDataAltitudeMaxValues(tdocSearchSearchResult), true, [], true);
        this.optionsSelectTechDataDuration = this.searchFormUtils.moveSelectedToTop(
            this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                this.tdocSearchFormUtils.getTechDataDurationValues(tdocSearchSearchResult), true, [], true),
            rawValues['techDataDuration']);
        this.optionsSelectPersonalRateOverall = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            this.tdocSearchFormUtils.getPersonalRateOverallValues(tdocSearchSearchResult), true, [], true);
        this.optionsSelectPersonalRateDifficulty = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            this.tdocSearchFormUtils.getPersonalRateDifficultyValues(tdocSearchSearchResult), true, [], true);
        this.optionsSelectPersons = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            this.tdocSearchFormUtils.getPersonValues(tdocSearchSearchResult), true, [], true);

        const values: TourDocSearchForm = tdocSearchSearchResult.searchForm;
        const [lat, lon, dist] = this.tdocSearchFormUtils.extractNearbyPos(values.nearby);
        if (lat && lon && (values.nearbyAddress === undefined || values.nearbyAddress === '')) {
            this.geoLocationService.doReverseLookup(lat, lon).then(function (result: any) {
                me.searchFormGroup.patchValue({'nearbyAddress':
                        TourDocSearchForm.tdocFields.nearbyAddress.validator.sanitize(result.address)});
            });
        }
        if (dist) {
            this.searchFormGroup.patchValue({'nearbyDistance': dist});
        }
    }

    protected updateAvailabilityFlags(tdocSearchSearchResult: TourDocSearchResult) {
        this.showWhereAvailable = (this.optionsSelectWhere.length > 0);
        this.showWhenAvailable = (this.optionsSelectWhen.length > 0 || this.optionsSelectTechDataDuration.length > 0);
        this.showDetailsAvailable = (this.optionsSelectWhat.length > 0 || this.optionsSelectTechRateOverall.length > 0 ||
            this.optionsSelectTechDataDistance.length > 0 || this.optionsSelectTechDataAltitudeMax.length > 0 ||
            this.optionsSelectTechDataAscent.length > 0);
        this.showMetaAvailable = (this.optionsSelectPlaylists.length > 0 || this.optionsSelectPersons.length > 0 ||
            this.optionsSelectPersonalRateDifficulty.length > 0 || this.optionsSelectPersonalRateOverall.length > 0);
    }

    protected beforeDoSearchPrepareValues(values: any) {
        values.nearby = this.tdocSearchFormUtils.joinNearbyPos(values);
        this.searchFormGroup.patchValue({'nearby': values.nearby});
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
                    TourDocSearchForm.tdocFields.nearbyAddress.validator.sanitize(event.detail.formatted)});
            me.doSearch();
        }).catch(reason => {
            console.warn('locationsearch failed', reason);
        });

        return false;
    }
}
