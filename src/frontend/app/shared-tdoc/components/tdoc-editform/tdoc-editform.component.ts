import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject} from '@angular/core';
import {TourDocRecord, TourDocRecordFactory, TourDocRecordValidator} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {FormBuilder} from '@angular/forms';
import {TourDocRecordSchema} from '../../../../shared/tdoc-commons/model/schemas/tdoc-record-schema';
import {ToastrService} from 'ngx-toastr';
import {SchemaValidationError} from 'js-data';
import {IMultiSelectOption, IMultiSelectTexts} from 'angular-2-dropdown-multiselect';
import {TourDocSearchFormUtils} from '../../services/tdoc-searchform-utils.service';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {TourDocSearchForm} from '../../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TrackStatistic, TrackStatisticService} from '@dps/mycms-frontend-commons/dist/angular-maps/services/track-statistic.service';
import {GeoGpxParser} from '@dps/mycms-frontend-commons/dist/angular-maps/services/geogpx.parser';
import {
    KeywordsState,
    StructuredKeywordState
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-contentutils.service';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {DateUtils} from '@dps/mycms-commons/dist/commons/utils/date.utils';
import {TourDocSearchResult} from '../../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {isArray} from 'util';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {TourDocContentUtils} from '../../services/tdoc-contentutils.service';
import {
    CommonDocEditformComponent,
    CommonDocEditformComponentConfig
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-editform/cdoc-editform.component';
import {DOCUMENT} from '@angular/common';

@Component({
    selector: 'app-tdoc-editform',
    templateUrl: './tdoc-editform.component.html',
    styleUrls: ['./tdoc-editform.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocEditformComponent extends CommonDocEditformComponent<TourDocRecord, TourDocSearchForm, TourDocSearchResult, TourDocDataService> {
    private trackStatisticService = new TrackStatisticService();
    private gpxParser = new GeoGpxParser();
    private personsFound: StructuredKeywordState[] = [];

    public optionsSelect: {
        'tdocratepers.gesamt': IMultiSelectOption[];
        'tdocratepers.ausdauer': IMultiSelectOption[];
        'tdocratepers.bildung': IMultiSelectOption[];
        'tdocratepers.kraft': IMultiSelectOption[];
        'tdocratepers.mental': IMultiSelectOption[];
        'tdocratepers.motive': IMultiSelectOption[];
        'tdocratepers.schwierigkeit': IMultiSelectOption[];
        'tdocratepers.wichtigkeit': IMultiSelectOption[];
        'persons': IMultiSelectOption[];
        'playlists': IMultiSelectOption[];
        'locId': IMultiSelectOption[];
        'locIdParent': IMultiSelectOption[];
        'routeId': IMultiSelectOption[];
        'subType': IMultiSelectOption[];
        'subTypeActiontype': IMultiSelectOption[];
        'subTypeLocType': IMultiSelectOption[];
        'trackId': IMultiSelectOption[];
        'tripId': IMultiSelectOption[];
    };

    public settingsSelectWhere = this.defaultSelectSetting;
    public settingsSelectActionType = this.defaultSelectSetting;
    public settingsSelectPersRate = this.defaultSelectSetting;
    public settingsSelectRoute = this.defaultSelectSetting;
    public settingsSelectTrack = this.defaultSelectSetting;
    public settingsSelectTrip = this.defaultSelectSetting;

    public textsSelectWhere: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Region ausgewählt',
        checkedPlural: 'Regionen ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '--',
        allSelected: 'Überall'};
    public textsSelectActionType: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Action ausgewählt',
        checkedPlural: 'Aktion ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '--',
        allSelected: 'alles'};
    public textsSelectPersons: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Typ ausgewählt',
        checkedPlural: 'Typen ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '--',
        allSelected: 'Alle'};
    public textsSelectPersRate: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Bewertung ausgewählt',
        checkedPlural: 'Bewertung ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '--',
        allSelected: 'Alle'};
    public textsSelectRoute: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Route ausgewählt',
        checkedPlural: 'Route ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '--',
        allSelected: 'alles'};
    public textsSelectTrack: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Track ausgewählt',
        checkedPlural: 'Track ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '--',
        allSelected: 'alles'};
    public textsSelectTrip: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Trip ausgewählt',
        checkedPlural: 'Trip ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '--',
        allSelected: 'alles'};

    trackRecords: TourDocRecord[] = [];
    trackStatistic: TrackStatistic = this.trackStatisticService.emptyStatistic();
    personTagSuggestions: string[] = [];

    constructor(public fb: FormBuilder, protected toastr: ToastrService, protected cd: ChangeDetectorRef,
                protected appService: GenericAppService, protected tdocSearchFormUtils: TourDocSearchFormUtils,
                protected searchFormUtils: SearchFormUtils, protected tdocDataService: TourDocDataService,
                protected contentUtils: TourDocContentUtils, @Inject(DOCUMENT) private document) {
        super(fb, toastr, cd, appService, tdocSearchFormUtils, searchFormUtils, tdocDataService, contentUtils);
    }

    setPersonsFound(persons: StructuredKeywordState[]) {
        this.personsFound = persons;
    }

    recommendName(): void {
        let name = '';

        let actiontype = this.editFormGroup.getRawValue()['subtype'];
        if (this.editFormGroup.getRawValue()['subtype'] !== undefined) {
            if (!isArray(actiontype)) {
                actiontype = [actiontype];
            }
            const selectedActionTypes = this.searchFormUtils.extractSelected(this.optionsSelect.subTypeActiontype, actiontype);
            if (selectedActionTypes.length > 0) {
                name += selectedActionTypes[0].name;
            }
        }
        if (this.personsFound.length > 0) {
            const persons = [];
            this.personsFound.forEach(personGroup => {
                personGroup.keywords.forEach(person => {
                    if (person.state === KeywordsState.SET) {
                        persons.push(person.keyword);
                    }
                });
            });

            name += ' mit ' + persons.join(', ');
        }

        let locId = this.editFormGroup.getRawValue()['locId'];
        if (this.editFormGroup.getRawValue()['locId'] !== undefined) {
            if (!isArray(locId)) {
                locId = [locId];
            }
            const selectedLocIds = this.searchFormUtils.extractSelected(this.optionsSelect.locId, locId);
            if (selectedLocIds.length > 0) {
                name += ' bei ' + selectedLocIds[0].name.replace(/.* -> /g, '').replace(/ \(\d+\)/, '');
            }
        }

        if (this.editFormGroup.getRawValue()['datestart'] !== undefined && this.editFormGroup.getRawValue()['dateend'] !== undefined) {
            name += ' ' + DateUtils.formatDateRange((new Date(this.editFormGroup.getRawValue()['datestart'])),
                (new Date(this.editFormGroup.getRawValue()['dateend'])));
        }
        this.setValue('name', name);
    }

    updateGpsTrackSrc(gpsTrackSrc: string): void {
        this.setValue('gpsTrackSrc', gpsTrackSrc);
        this.updateMap();
    }

    updateMap(): boolean {
        let track = this.editFormGroup.getRawValue()['gpsTrackSrc'];
        if (track !== undefined && track !== null && track.length > 0) {
            track = track.replace(/[\r\n]/g, ' ').replace(/[ ]+/g, ' ');
            this.trackRecords = [TourDocRecordFactory.createSanitized({
                id: 'TMP' + (new Date()).getTime(),
                gpsTrackSrc: track,
                gpsTrackBaseFile: 'tmp.gpx',
                name: this.editFormGroup.getRawValue()['name'],
                type: this.record.type,
                datestart: new Date().toISOString(),
                dateend: new Date().toISOString(),
                dateshow: this.editFormGroup.getRawValue()['dateshow']
            })];
            this.editFormGroup.patchValue({gpsTrackSrc: GeoGpxParser.reformatXml(track) });
            const statTrack = track;
            const geoElements = this.gpxParser.parse(statTrack, {});
            if (geoElements !== undefined && geoElements.length > 0) {
                let trackStatistic = undefined;
                for (const geoElement of geoElements) {
                    trackStatistic = this.trackStatisticService.mergeStatistics(
                        trackStatistic, this.trackStatisticService.trackStatisticsForGeoElement(geoElement));
                }
                this.trackStatistic = trackStatistic;
            } else {
                this.trackStatistic = this.trackStatisticService.emptyStatistic();
            }
        } else {
            this.trackRecords = [];
            this.trackStatistic = this.trackStatisticService.emptyStatistic();
        }

        this.cd.markForCheck();

        return false;
    }

    protected validateSchema(record: TourDocRecord): SchemaValidationError[] {
        return TourDocRecordSchema.validate(record);
    }

    protected validateValues(record: TourDocRecord): string[] {
        return TourDocRecordValidator.instance.validateValues(record);
    }

    protected getComponentConfig(config: {}): CommonDocEditformComponentConfig {
        let prefix = '';
        let suggestionConfig = [];
        if (BeanUtils.getValue(config, 'components.tdoc-keywords.keywordSuggestions')) {
            suggestionConfig = BeanUtils.getValue(config, 'components.tdoc-keywords.keywordSuggestions');
            prefix = BeanUtils.getValue(config, 'components.tdoc-keywords.editPrefix');
        }

        return {
            suggestionConfigs: suggestionConfig,
            editPrefix: prefix,
            numBeanFieldConfig: {
                'tdocratepers.gesamt': { labelPrefix: 'label.tdocratepers.gesamt.', values: [0, 2, 5, 8, 11, 14]},
                'tdocratepers.gesamt_image': { labelPrefix: 'label.image.tdocratepers.gesamt.', values: [0, 2, 5, 6, 8, 9, 10, 11, 14]},
                'tdocratepers.ausdauer': { labelPrefix: 'label.tdocratepers.ausdauer.', values: [0, 2, 5, 8, 11, 14]},
                'tdocratepers.bildung': { labelPrefix: 'label.tdocratepers.bildung.', values: [0, 2, 8, 11]},
                'tdocratepers.kraft': { labelPrefix: 'label.tdocratepers.kraft.', values: [0, 2, 5, 8, 11, 14]},
                'tdocratepers.mental': { labelPrefix: 'label.tdocratepers.mental.', values: [0, 2, 5, 8, 11, 14]},
                'tdocratepers.motive': { labelPrefix: 'label.tdocratepers.motive.', values: [0, 2, 5, 8, 11, 14]},
                'tdocratepers.schwierigkeit': { labelPrefix: 'label.tdocratepers.schwierigkeit.', values: [0, 2, 5, 8, 11, 14]},
                'tdocratepers.wichtigkeit': { labelPrefix: 'label.tdocratepers.wichtigkeit.', values: [0, 2, 5, 8, 11, 14]},
                'locId': {},
                'locIdParent': {},
                'routeId': {},
                'tdocdatatech.altAsc': {},
                'tdocdatatech.altDesc': {},
                'tdocdatatech.altMin': {},
                'tdocdatatech.altMax': {},
                'tdocdatatech.dist': {},
                'tdocdatatech.dur': {},
                'trackId': {},
                'tripId': {}
            },
            stringBeanFieldConfig: {
                'subtype': {},
                'subTypeActiontype': {
                    labelPrefix: 'ac_',
                    values: [0, 1, 2, 3, 4, 5, 101, 102, 103, 104, 105, 106, 110, 111,
                        120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132]
                },
                'subTypeLocType': {labelPrefix: 'loc_', values: [1, 2, 3, 4, 5, 6]},
                'tdocdatainfo.baseloc': {},
                'tdocdatainfo.destloc': {},
                'tdocdatainfo.guides': {},
                'tdocdatainfo.region': {},
                'tdocratetech.bergtour': {},
                'tdocratetech.firn': {},
                'tdocratetech.gletscher': {},
                'tdocratetech.klettern': {},
                'tdocratetech.ks': {},
                'tdocratetech.overall': {},
                'tdocratetech.schneeschuh': {},
            },
            stringArrayBeanFieldConfig: {
                'persons': {},
                'playlists': {},
            },
            inputSuggestionValueConfig: {
                'tdocdatainfo.baseloc': {
                    'facetName': 'data_info_baseloc_s'
                },
                'tdocdatainfo.destloc': {
                    'facetName': 'data_info_destloc_s'
                },
                'tdocdatainfo.guides': {
                    'facetName': 'data_info_guides_s'
                },
                'tdocdatainfo.region': {
                    'facetName': 'data_info_region_s'
                },
                'tdocratetech.bergtour': {
                    'facetName': 'rate_tech_bergtour_ss'
                },
                'tdocratetech.firn': {
                    'facetName': 'rate_tech_firn_ss'
                },
                'tdocratetech.gletscher': {
                    'facetName': 'rate_tech_gletscher_ss'
                },
                'tdocratetech.klettern': {
                    'facetName': 'rate_tech_klettern_ss'
                },
                'tdocratetech.ks': {
                    'facetName': 'rate_tech_ks_ss'
                },
                'tdocratetech.overall': {
                    'facetName': 'rate_tech_overall_ss'
                },
                'tdocratetech.schneeschuh': {
                    'facetName': 'rate_tech_schneeschuh_ss'
                },
            },
            optionsSelect: {
                'tdocratepers.gesamt': [],
                'tdocratepers.ausdauer': [],
                'tdocratepers.bildung': [],
                'tdocratepers.kraft': [],
                'tdocratepers.mental': [],
                'tdocratepers.motive': [],
                'tdocratepers.schwierigkeit': [],
                'tdocratepers.wichtigkeit': [],
                'persons': [],
                'playlists': [],
                'locId': [],
                'locIdParent': [],
                'routeId': [],
                'subType': [],
                'subTypeActiontype': [],
                'subTypeLocType': [],
                'trackId': [],
                'tripId': []
            }
        };
    }

    protected prepareSubmitValues(values: {}): void {
        if (values['gpsTrackSrc'] !== undefined && values['gpsTrackSrc'] !== null) {
            values['gpsTrackSrc'] = values['gpsTrackSrc'].replace(/\n/g, ' ').replace(/[ ]+/g, ' ');
        }

        return super.prepareSubmitValues(values);
    }

    protected createDefaultFormValueConfig(record: TourDocRecord): {} {
        return {
            dateshow: [DateUtils.dateToLocalISOString(record.dateshow)],
            datestart: [DateUtils.dateToLocalISOString(record.datestart)],
            dateend: [DateUtils.dateToLocalISOString(record.dateend)],
            locIdParent: [record.locIdParent],
            gpsTrackSrc: [record.gpsTrackSrc]
        };
    }

    protected postProcessFormValueConfig(record: TourDocRecord, formValueConfig: {}): void {
        if (formValueConfig['subtype'] && formValueConfig['subtype'].length > 0 && formValueConfig['subtype'][0]) {
            formValueConfig['subtype'][0] = (formValueConfig['subtype'][0]  + '').replace(/ac_/g, '').replace(/loc_/g, '');
        }
    }

    protected updateFormComponents(): void {
        super.updateFormComponents();
        this.updateMap();
    }

    protected updateOptionValues(tdocSearchResult: TourDocSearchResult): boolean {
        super.updateOptionValues(tdocSearchResult);
        const me = this;

        if (tdocSearchResult !== undefined) {
            const rawValues = this.editFormGroup.getRawValue();
            // console.log('update searchResult', tdocSearchResult);
            const whereValues = me.searchFormUtils.prepareExtendedSelectValues(me.tdocSearchFormUtils.getWhereValues(tdocSearchResult));
            me.optionsSelect['locId'] = me.searchFormUtils.moveSelectedToTop(
                me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(whereValues, true, [],
                    false), rawValues['locId']);
            me.optionsSelect['locIdParent'] = me.searchFormUtils.moveSelectedToTop(
                me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(whereValues, true, [],
                    false), rawValues['locIdParent']);

            me.optionsSelect['playlists'] = me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                me.tdocSearchFormUtils.getPlaylistValues(tdocSearchResult), true, [], true);
            me.optionsSelect['persons'] = me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                me.tdocSearchFormUtils.getPersonValues(tdocSearchResult), true, [], true);

            const routeValues = me.searchFormUtils.prepareExtendedSelectValues(me.tdocSearchFormUtils.getRouteValues(tdocSearchResult));
            me.optionsSelect['routeId'] = me.searchFormUtils.moveSelectedToTop(
                me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(routeValues, true, [],
                    false), rawValues['routeId']);

            const trackValues = me.searchFormUtils.prepareExtendedSelectValues(me.tdocSearchFormUtils.getTrackValues(tdocSearchResult));
            me.optionsSelect['trackId'] = me.searchFormUtils.moveSelectedToTop(
                me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(trackValues, true, [],
                    false), rawValues['trackId']);
            const tripValues = me.searchFormUtils.prepareExtendedSelectValues(me.tdocSearchFormUtils.getTripValues(tdocSearchResult));
            me.optionsSelect['tripId'] = me.searchFormUtils.moveSelectedToTop(
                me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(tripValues, true, [],
                    false), rawValues['tripId']);
        } else {
            // console.log('empty searchResult', tdocSearchResult);
            me.optionsSelect['locId'] = me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList([], true, [], false);
            me.optionsSelect['locIdParent'] =
                me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList([], true, [], false);
            me.optionsSelect['playlists'] = me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList([], true, [], true);
            me.optionsSelect['persons'] = me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList([], true, [], true);
            me.optionsSelect['routeId'] = me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList([], true, [], false);
            me.optionsSelect['trackId'] = me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList([], true, [], false);
            me.optionsSelect['tripId'] = me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList([], true, [], false);
        }

        return true;
    }


    protected updateKeywordSuggestions(): boolean {
        super.updateKeywordSuggestions();

        if (BeanUtils.getValue(this.config, 'components.tdoc-persontags.keywordSuggestions')) {
            const suggestionConfig = BeanUtils.getValue(this.config, 'components.tdoc-persontags.keywordSuggestions');
            const prefix = BeanUtils.getValue(this.config, 'components.tdoc-persontags.editPrefix');
            this.personTagSuggestions = this.contentUtils.getSuggestedKeywords(suggestionConfig, prefix, this.editFormGroup.getRawValue());
            this.cd.markForCheck();
        } else {
            console.warn('no valid personTagSuggestions found');
            this.personTagSuggestions = [];
        }

        return true;
    }

    protected setSelectionRangeOnInput(input: HTMLInputElement|HTMLTextAreaElement, selectionStart: number, selectionEnd: number) {
        if (input.setSelectionRange) {
            input.focus();
            input.setSelectionRange(selectionStart, selectionEnd);
        }
    }

}
