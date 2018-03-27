import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChange,
    ViewContainerRef
} from '@angular/core';
import {SDocRecord, SDocRecordFactory, SDocRecordValidator} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {FormBuilder} from '@angular/forms';
import {SDocRecordSchema} from '../../../../shared/sdoc-commons/model/schemas/sdoc-record-schema';
import {ToastsManager} from 'ng2-toastr';
import {SchemaValidationError} from 'js-data';
import {ComponentUtils} from '../../../../../shared/angular-commons/services/component.utils';
import {IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts} from 'angular-2-dropdown-multiselect';
import {SDocSearchFormUtils} from '../../services/sdoc-searchform-utils.service';
import {BeanUtils} from '../../../../shared/commons/utils/bean.utils';
import {SDocDataService} from '../../../../shared/sdoc-commons/services/sdoc-data.service';
import {SDocSearchForm} from '../../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {TrackStatistic, TrackStatisticService} from '../../../../shared/angular-maps/services/track-statistic.service';
import {GeoGpxParser} from '../../../../shared/angular-maps/services/geogpx.parser';
import {KeywordsState, SDocContentUtils, StructuredKeywordState} from '../../services/sdoc-contentutils.service';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {DateUtils} from '../../../../shared/commons/utils/date.utils';
import {SDocSearchResult} from '../../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {isArray} from 'util';

@Component({
    selector: 'app-sdoc-editform',
    templateUrl: './sdoc-editform.component.html',
    styleUrls: ['./sdoc-editform.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocEditformComponent implements OnChanges {
    private trackStatisticService = new TrackStatisticService();
    private gpxParser = new GeoGpxParser();
    private defaultSelectSetting: IMultiSelectSettings =
        {dynamicTitleMaxItems: 5,
            buttonClasses: 'btn btn-default btn-secondary text-right fullwidth btn-sm',
            containerClasses: 'dropdown-inline fullwidth',
            enableSearch: true,
            showUncheckAll: false,
            autoUnselect: true,
            selectionLimit: 1};
    private personsFound: StructuredKeywordState[] = [];
    private numBeanFieldConfig = {
        'sdocratepers.gesamt': { labelPrefix: 'label.sdocratepers.gesamt.', values: [0, 2, 5, 8, 11, 14]},
        'sdocratepers.gesamt_image': { labelPrefix: 'label.image.sdocratepers.gesamt.', values: [0, 2, 5, 6, 8, 9, 10, 11, 14]},
        'sdocratepers.ausdauer': { labelPrefix: 'label.sdocratepers.ausdauer.', values: [0, 2, 5, 8, 11, 14]},
        'sdocratepers.bildung': { labelPrefix: 'label.sdocratepers.bildung.', values: [0, 2, 8, 11]},
        'sdocratepers.kraft': { labelPrefix: 'label.sdocratepers.kraft.', values: [0, 2, 5, 8, 11, 14]},
        'sdocratepers.mental': { labelPrefix: 'label.sdocratepers.mental.', values: [0, 2, 5, 8, 11, 14]},
        'sdocratepers.motive': { labelPrefix: 'label.sdocratepers.motive.', values: [0, 2, 5, 8, 11, 14]},
        'sdocratepers.schwierigkeit': { labelPrefix: 'label.sdocratepers.schwierigkeit.', values: [0, 2, 5, 8, 11, 14]},
        'sdocratepers.wichtigkeit': { labelPrefix: 'label.sdocratepers.wichtigkeit.', values: [0, 2, 5, 8, 11, 14]},
        'locId': {},
        'locIdParent': {},
        'routeId': {},
        'sdocdatatech.altAsc': {},
        'sdocdatatech.altDesc': {},
        'sdocdatatech.altMin': {},
        'sdocdatatech.altMax': {},
        'sdocdatatech.dist': {},
        'sdocdatatech.dur': {},
        'trackId': {},
        'tripId': {}
    };
    private stringBeanFieldConfig = {
        'subtype': {},
        'subTypeActiontype': {
            labelPrefix: 'ac_',
            values: [0, 1, 2, 3, 4, 5, 101, 102, 103, 104, 105, 106, 110, 111, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131,
                132]
        },
        'subTypeLocType': {labelPrefix: 'loc_', values: [1, 2, 3, 4, 5, 6]},
        'sdocdatainfo.baseloc': {},
        'sdocdatainfo.destloc': {},
        'sdocdatainfo.guides': {},
        'sdocdatainfo.region': {},
        'sdocratetech.bergtour': {},
        'sdocratetech.firn': {},
        'sdocratetech.gletscher': {},
        'sdocratetech.klettern': {},
        'sdocratetech.ks': {},
        'sdocratetech.overall': {},
        'sdocratetech.schneeschuh': {},
    };
    private stringArrayBeanFieldConfig = {
        'persons': {},
        'playlists': {},
    };
    private inputSuggestionValueConfig = {
        'sdocdatainfo.baseloc': {
            'facetName': 'data_info_baseloc_s'
        },
        'sdocdatainfo.destloc': {
            'facetName': 'data_info_destloc_s'
        },
        'sdocdatainfo.guides': {
            'facetName': 'data_info_guides_s'
        },
        'sdocdatainfo.region': {
            'facetName': 'data_info_region_s'
        },
        'sdocratetech.bergtour': {
            'facetName': 'rate_tech_bergtour_ss'
        },
        'sdocratetech.firn': {
            'facetName': 'rate_tech_firn_ss'
        },
        'sdocratetech.gletscher': {
            'facetName': 'rate_tech_gletscher_ss'
        },
        'sdocratetech.klettern': {
            'facetName': 'rate_tech_klettern_ss'
        },
        'sdocratetech.ks': {
            'facetName': 'rate_tech_ks_ss'
        },
        'sdocratetech.overall': {
            'facetName': 'rate_tech_overall_ss'
        },
        'sdocratetech.schneeschuh': {
            'facetName': 'rate_tech_schneeschuh_ss'
        },
    };

    public optionsSelect: {
        'sdocratepers.gesamt': IMultiSelectOption[];
        'sdocratepers.ausdauer': IMultiSelectOption[];
        'sdocratepers.bildung': IMultiSelectOption[];
        'sdocratepers.kraft': IMultiSelectOption[];
        'sdocratepers.mental': IMultiSelectOption[];
        'sdocratepers.motive': IMultiSelectOption[];
        'sdocratepers.schwierigkeit': IMultiSelectOption[];
        'sdocratepers.wichtigkeit': IMultiSelectOption[];
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
    } = {'sdocratepers.gesamt': [],
        'sdocratepers.ausdauer': [],
        'sdocratepers.bildung': [],
        'sdocratepers.kraft': [],
        'sdocratepers.mental': [],
        'sdocratepers.motive': [],
        'sdocratepers.schwierigkeit': [],
        'sdocratepers.wichtigkeit': [],
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
    };

    public inputSuggestionValues = {};

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
    public textsSelectPlaylists: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Typ ausgewählt',
        checkedPlural: 'Typen ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '--',
        allSelected: 'Alle'};
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

    // empty default
    public editFormGroup = this.fb.group({
        id: '',
        name: '',
        desc: '',
        keywords: ''
    });
    trackRecords: SDocRecord[] = [];
    trackStatistic: TrackStatistic = this.trackStatisticService.emptyStatistic();
    keywordSuggestions: string[] = [];
    personTagSuggestions: string[] = [];

    @Input()
    public record: SDocRecord;

    @Input()
    public backToSearch? = false;

    @Output()
    public save: EventEmitter<SDocRecord> = new EventEmitter();

    @Output()
    public saveAndSearch: EventEmitter<SDocRecord> = new EventEmitter();

    constructor(public fb: FormBuilder, private toastr: ToastsManager, vcr: ViewContainerRef, private cd: ChangeDetectorRef,
                private appService: GenericAppService, private searchFormUtils: SDocSearchFormUtils,
                private sdocDataService: SDocDataService, private contentUtils: SDocContentUtils) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            this.updateData();
        }
    }

    setKeyword(keyword: string): void {
        let keywords = this.editFormGroup.getRawValue()['keywords'];
        if (keywords.length > 0) {
            keywords = keywords + ', ' + keyword;
        } else {
            keywords = keyword;
        }

        this.editFormGroup.patchValue({ keywords: keywords});
    }

    unsetKeyword(keyword: string): void {
        let keywords = this.editFormGroup.getRawValue()['keywords'];
        if (keywords.length > 0) {
            keywords = keywords.replace(new RegExp(' ' + keyword + ','), '')
                .replace(new RegExp('^' + keyword + ', '), '')
                .replace(new RegExp(', ' + keyword + '$'), '')
                .replace(new RegExp('^' + keyword + '$'), '');
        }

        this.editFormGroup.patchValue({ keywords: keywords});
    }

    setValue(field: string, value: any): void {
        const config = {};
        config[field] = value;
        this.editFormGroup.patchValue(config);
    }

    formatInputDate(value: Date): String {
        return DateUtils.dateToInputString(value);
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

    updateMap(): boolean {
        if (this.editFormGroup.getRawValue()['gpsTrackSrc'] !== undefined && this.editFormGroup.getRawValue()['gpsTrackSrc'] !== null &&
            this.editFormGroup.getRawValue()['gpsTrackSrc'].length > 0) {
            let track = this.editFormGroup.getRawValue()['gpsTrackSrc'];
            track = track.replace(/[\r\n]/g, ' ').replace(/[ ]+/g, ' ');
            this.trackRecords = [SDocRecordFactory.createSanitized({
                id: 'TMP',
                gpsTrackSrc: track,
                gpsTrackBaseFile: 'tmp.gpx',
                name: this.editFormGroup.getRawValue()['name'],
                type: this.record.type
            })];
            this.editFormGroup.patchValue({gpsTrackSrc: GeoGpxParser.reformatXml(track) });

            const statTrack = track.replace(/<\/trkseg>[ ]*<trkseg>/g, '').replace(/<\/rte>.*?<rtept /g, '<rtept ');
            const geoElements = this.gpxParser.parse(statTrack, {});
            if (geoElements !== undefined && geoElements.length > 0) {
                this.trackStatistic = this.trackStatisticService.trackStatisticsForGeoElement(geoElements[0]);
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

    fixMap(): boolean {
        if (this.editFormGroup.getRawValue()['gpsTrackSrc'] !== undefined && this.editFormGroup.getRawValue()['gpsTrackSrc'] !== null &&
            this.editFormGroup.getRawValue()['gpsTrackSrc'].length > 0) {
            let track = this.editFormGroup.getRawValue()['gpsTrackSrc'];
            track = GeoGpxParser.fixXml(track);
            track = GeoGpxParser.fixXmlExtended(track);
            track = GeoGpxParser.reformatXml(track);
            this.editFormGroup.patchValue({gpsTrackSrc: track });
        }

        return this.updateMap();
    }

    submitSave(event: Event, backToSearch: boolean): boolean {
        const values = this.editFormGroup.getRawValue();

        if (values['gpsTrackSrc'] !== undefined && values['gpsTrackSrc'] !== null) {
            values['gpsTrackSrc'] = values['gpsTrackSrc'].replace(/\n/g, ' ').replace(/[ ]+/g, ' ');
        }

        // delete empty key
        for (const key in values) {
            if (values.hasOwnProperty(key) && values[key] === undefined || values[key] === null) {
                delete values[key];
            }
        }

        for (const key in this.numBeanFieldConfig) {
            const formKey = key.replace('.', '_');
            if (!values[formKey]) {
                continue;
            }

            if (Array.isArray(values[formKey])) {
                values[key] = Number(values[formKey][0]);
            } else {
                values[key] = Number(values[formKey]);
            }
        }

        for (const key in this.stringBeanFieldConfig) {
            const formKey = key.replace('.', '_');
            if (!values[formKey]) {
                continue;
            }
            if (Array.isArray(values[formKey])) {
                values[key] = values[formKey][0] + '';
            } else {
                values[key] = values[formKey] + '';
            }
        }

        for (const key in this.stringArrayBeanFieldConfig) {
            const formKey = key.replace('.', '_');
            if (!values[formKey]) {
                continue;
            }
            if (Array.isArray(values[formKey])) {
                values[key] = values[formKey].join(',');
            } else {
                values[key] = values[formKey] + '';
            }
        }

        const schemaErrors: SchemaValidationError[] = SDocRecordSchema.validate(values);
        if (schemaErrors !== undefined && schemaErrors.length > 0) {
            let msg = '';
            schemaErrors.map((value: SchemaValidationError, index, array) => {
                msg += '- ' + value.path + ':' + value.expected + '<br>';
            });
            console.warn('warning while schema-validating values' + msg, values);
            this.toastr.warning('Leider passen nicht alle Eingaben - Fehler:' + msg, 'Oje!');
            return false;
        }

        const errors: string[] = SDocRecordValidator.validateValues(values);
        if (errors !== undefined && errors.length > 0) {
            let msg = '';
            errors.map((value: string, index, array) => {
                msg += '- ' + value + '<br>';
            });
            console.warn('warning while validation values' + msg, values);
            this.toastr.warning('Leider passen nicht alle Eingaben - Fehler:' + msg, 'Oje!');
            return false;
        }

        if (backToSearch) {
            this.saveAndSearch.emit(values);
        } else {
            this.save.emit(values);
        }

        return false;
    }

    private updateData() {
        if (this.record === undefined) {
            this.editFormGroup = this.fb.group({});
            return;
        }

        const config = {
            dateshow: [DateUtils.dateToInputString(this.record.dateshow)],
            datestart: [DateUtils.dateToInputString(this.record.datestart)],
            dateend: [DateUtils.dateToInputString(this.record.dateend)],
            locIdParent: [this.record.locIdParent],
            gpsTrackSrc: [this.record.gpsTrackSrc]
        };

        const fields = this.record.toJSON();
        for (const key in fields) {
            if (fields.hasOwnProperty(key) && !config.hasOwnProperty(key)) {
                config[key] = [fields[key]];
            }
        }

        // static lists
        this.createSelectOptions(this.stringBeanFieldConfig, config, this.optionsSelect);
        this.createSelectOptions(this.numBeanFieldConfig, config, this.optionsSelect);
        this.createSelectOptions(this.stringArrayBeanFieldConfig, config, this.optionsSelect);

        if (config['subtype'] && config['subtype'].length > 0 && config['subtype'][0]) {
            config['subtype'][0] = (config['subtype'][0]  + '').replace(/ac_/g, '').replace(/loc_/g, '');
        }

        this.editFormGroup = this.fb.group(config);

        this.updateMap();
        this.updateKeywordSuggestions();

        const me = this;
        const searchForm = new SDocSearchForm({type: this.record.type});
        this.sdocDataService.search(searchForm,
            {
                showFacets: true, // []
                loadTrack: false,
                showForm: false
            }).then(function doneSearch(sdocSearchResult: SDocSearchResult) {
                me.updateOptionValues(sdocSearchResult);
                me.updateSuggestionValues(sdocSearchResult);
                me.cd.markForCheck();

                me.editFormGroup.valueChanges.subscribe((data) => {
                    me.updateKeywordSuggestions();
                });
            }).catch(function errorSearch(reason) {
                me.toastr.error('Es gibt leider Probleme bei der Suche - am besten noch einmal probieren :-(', 'Oje!');
                console.error('doSearch failed:', reason);
                me.cd.markForCheck();
            });
    }

    private updateOptionValues(sdocSearchResult: SDocSearchResult): boolean {
        const me = this;

        if (sdocSearchResult !== undefined) {
            const rawValues = this.editFormGroup.getRawValue();
            // console.log('update searchResult', sdocSearchResult);
            const whereValues = me.searchFormUtils.prepareExtendedSelectValues(me.searchFormUtils.getWhereValues(sdocSearchResult));
            me.optionsSelect['locId'] = me.searchFormUtils.moveSelectedToTop(
                me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(whereValues, true, [],
                    false), rawValues['locId']);
            me.optionsSelect['locIdParent'] = me.searchFormUtils.moveSelectedToTop(
                me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(whereValues, true, [],
                    false), rawValues['locIdParent']);

            me.optionsSelect['playlists'] = me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                me.searchFormUtils.getPlaylistValues(sdocSearchResult), true, [], true);
            me.optionsSelect['persons'] = me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                me.searchFormUtils.getPersonValues(sdocSearchResult), true, [], true);

            const routeValues = me.searchFormUtils.prepareExtendedSelectValues(me.searchFormUtils.getRouteValues(sdocSearchResult));
            me.optionsSelect['routeId'] = me.searchFormUtils.moveSelectedToTop(
                me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(routeValues, true, [],
                    false), rawValues['routeId']);

            const trackValues = me.searchFormUtils.prepareExtendedSelectValues(me.searchFormUtils.getTrackValues(sdocSearchResult));
            me.optionsSelect['trackId'] = me.searchFormUtils.moveSelectedToTop(
                me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(trackValues, true, [],
                    false), rawValues['trackId']);
            const tripValues = me.searchFormUtils.prepareExtendedSelectValues(me.searchFormUtils.getTripValues(sdocSearchResult));
            me.optionsSelect['tripId'] = me.searchFormUtils.moveSelectedToTop(
                me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(tripValues, true, [],
                    false), rawValues['tripId']);
        } else {
            // console.log('empty searchResult', sdocSearchResult);
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

    private updateSuggestionValues(sdocSearchResult: SDocSearchResult): boolean {
        for (const suggestionName in this.inputSuggestionValueConfig) {
            const suggestionConfig = this.inputSuggestionValueConfig[suggestionName];
            const values = [];
            if (suggestionConfig.facetName) {
                if (sdocSearchResult !== undefined && sdocSearchResult.facets !== undefined && sdocSearchResult.facets.facets.size > 0) {
                    const facets = this.searchFormUtils.getFacetValues(sdocSearchResult, suggestionConfig.facetName, '', '');
                    for (const value of facets) {
                        values.push(value[1]);
                    }
                }
            }

            this.inputSuggestionValues[suggestionName.replace('.', '_')] = values;
        }

        return true;
    }

    private updateKeywordSuggestions(): boolean {
        const config = this.appService.getAppConfig();
        if (BeanUtils.getValue(config, 'components.sdoc-keywords.keywordSuggestions')) {
            const suggestionConfig = BeanUtils.getValue(config, 'components.sdoc-keywords.keywordSuggestions');
            const prefix = BeanUtils.getValue(config, 'components.sdoc-keywords.editPrefix');
            this.keywordSuggestions = this.contentUtils.getSuggestedKeywords(suggestionConfig, prefix, this.editFormGroup.getRawValue());
            this.cd.markForCheck();
        } else {
            console.warn('no valid keywordSugestions found');
            this.keywordSuggestions = [];
        }
        if (BeanUtils.getValue(config, 'components.sdoc-persontags.keywordSuggestions')) {
            const suggestionConfig = BeanUtils.getValue(config, 'components.sdoc-persontags.keywordSuggestions');
            const prefix = BeanUtils.getValue(config, 'components.sdoc-persontags.editPrefix');
            this.personTagSuggestions = this.contentUtils.getSuggestedKeywords(suggestionConfig, prefix, this.editFormGroup.getRawValue());
            this.cd.markForCheck();
        } else {
            console.warn('no valid personTagSuggestions found');
            this.personTagSuggestions = [];
        }

        return true;
    }

    private createSelectOptions(definitions: {}, values: {}, optionsSelect: {}): void {
        for (const key in definitions) {
            const definition = definitions[key];
            let value = BeanUtils.getValue(this.record, key);
            if (value === null || value === 'null' || value === undefined || value === 'undefined') {
                value = undefined;
            } else {
                value = value + '';
            }
            values[key.replace('.', '_')] = [[value]];
            const options = [];
            if (definition['values']) {
                for (const optionValue of definition['values']) {
                    options.push([definition['labelPrefix'], '' + optionValue, '', 0]);
                }
            }
            optionsSelect[key] =
                this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(options, false, [], true);
        }
    }
}
