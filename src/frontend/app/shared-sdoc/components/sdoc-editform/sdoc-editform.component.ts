import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewContainerRef} from '@angular/core';
import {SDocRecord, SDocRecordFactory, SDocRecordValidator} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {FormBuilder} from '@angular/forms';
import {SDocRecordSchema} from '../../../../shared/sdoc-commons/model/schemas/sdoc-record-schema';
import {ToastsManager} from 'ng2-toastr';
import {SchemaValidationError} from 'js-data';
import {IMultiSelectOption, IMultiSelectTexts} from 'angular-2-dropdown-multiselect';
import {SDocSearchFormUtils} from '../../services/sdoc-searchform-utils.service';
import {BeanUtils} from '../../../../shared/commons/utils/bean.utils';
import {SDocDataService} from '../../../../shared/sdoc-commons/services/sdoc-data.service';
import {SDocSearchForm} from '../../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {TrackStatistic, TrackStatisticService} from '../../../../shared/angular-maps/services/track-statistic.service';
import {GeoGpxParser} from '../../../../shared/angular-maps/services/geogpx.parser';
import {KeywordsState, StructuredKeywordState} from '../../../../shared/frontend-cdoc-commons/services/cdoc-contentutils.service';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {DateUtils} from '../../../../shared/commons/utils/date.utils';
import {SDocSearchResult} from '../../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {isArray} from 'util';
import {FileSystemFileEntry, UploadEvent} from 'ngx-file-drop';
import {GpsTrackValidationRule} from '../../../../shared/search-commons/model/forms/generic-validator.util';
import {SearchFormUtils} from '../../../../shared/angular-commons/services/searchform-utils.service';
import {SDocContentUtils} from '../../services/sdoc-contentutils.service';
import {
    CDocEditformComponent,
    CDocEditformComponentConfig
} from '../../../../shared/frontend-cdoc-commons/components/cdoc-editform/cdoc-editform.component';

@Component({
    selector: 'app-sdoc-editform',
    templateUrl: './sdoc-editform.component.html',
    styleUrls: ['./sdoc-editform.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocEditformComponent extends CDocEditformComponent<SDocRecord, SDocSearchForm, SDocSearchResult, SDocDataService> {
    private trackStatisticService = new TrackStatisticService();
    private gpxParser = new GeoGpxParser();
    private personsFound: StructuredKeywordState[] = [];

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

    trackRecords: SDocRecord[] = [];
    trackStatistic: TrackStatistic = this.trackStatisticService.emptyStatistic();
    personTagSuggestions: string[] = [];

    constructor(public fb: FormBuilder, protected toastr: ToastsManager, vcr: ViewContainerRef, protected cd: ChangeDetectorRef,
                protected appService: GenericAppService, protected sdocSearchFormUtils: SDocSearchFormUtils,
                protected searchFormUtils: SearchFormUtils, protected sdocDataService: SDocDataService,
                protected contentUtils: SDocContentUtils) {
        super(fb, toastr, vcr, cd, appService, sdocSearchFormUtils, searchFormUtils, sdocDataService, contentUtils);
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

    gpxDropped(event: UploadEvent) {
        const me = this;
        for (const droppedFile of event.files) {
            if (droppedFile.fileEntry.isFile) {
                const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
                fileEntry.file((file: File) => {
                    const reader = new FileReader();
                    const maxLength = (<GpsTrackValidationRule>SDocRecord.sdocFields.gpsTrackSrc.validator).getMaxLength();
                    if (file.size > maxLength) {
                        me.toastr.warning('Die GPX-Datei darf höchstes ' + maxLength / 1000000 + 'MB sein.', 'Oje!');
                        return;
                    }
                    if (!file.name.toLowerCase().endsWith('.gpx')) {
                        me.toastr.warning('Es dürfen nur .gpx Dateien geladen werden.', 'Oje!');
                        return;
                    }

                    reader.onload = (function(theFile) {
                        return function(e) {
                            // Render thumbnail.
                            const track = e.target.result;
                            me.editFormGroup.patchValue({gpsTrackSrc: GeoGpxParser.reformatXml(track) });
                            return me.updateMap();
                        };
                    })(file);

                    // Read in the file as a data URL.
                    reader.readAsText(file);
                });

                return;
            }
        }
    }


    updateMap(): boolean {
        if (this.editFormGroup.getRawValue()['gpsTrackSrc'] !== undefined && this.editFormGroup.getRawValue()['gpsTrackSrc'] !== null &&
            this.editFormGroup.getRawValue()['gpsTrackSrc'].length > 0) {
            let track = this.editFormGroup.getRawValue()['gpsTrackSrc'];
            track = track.replace(/[\r\n]/g, ' ').replace(/[ ]+/g, ' ');
            this.trackRecords = [SDocRecordFactory.createSanitized({
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

    protected validateSchema(record: SDocRecord): SchemaValidationError[] {
        return SDocRecordSchema.validate(record);
    }

    protected validateValues(record: SDocRecord): string[] {
        return SDocRecordValidator.validateValues(record);
    }

    protected getComponentConfig(config: {}): CDocEditformComponentConfig {
        let prefix = '';
        let suggestionConfig = [];
        if (BeanUtils.getValue(config, 'components.sdoc-keywords.keywordSuggestions')) {
            suggestionConfig = BeanUtils.getValue(config, 'components.sdoc-keywords.keywordSuggestions');
            prefix = BeanUtils.getValue(config, 'components.sdoc-keywords.editPrefix');
        }

        return {
            suggestionConfigs: suggestionConfig,
            editPrefix: prefix,
            numBeanFieldConfig: {
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
            },
            stringBeanFieldConfig: {
                'subtype': {},
                'subTypeActiontype': {
                    labelPrefix: 'ac_',
                    values: [0, 1, 2, 3, 4, 5, 101, 102, 103, 104, 105, 106, 110, 111,
                        120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132]
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
            },
            stringArrayBeanFieldConfig: {
                'persons': {},
                'playlists': {},
            },
            inputSuggestionValueConfig: {
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
            },
            optionsSelect: {
                'sdocratepers.gesamt': [],
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
            }
        };
    }

    protected prepareSubmitValues(values: {}): void {
        if (values['gpsTrackSrc'] !== undefined && values['gpsTrackSrc'] !== null) {
            values['gpsTrackSrc'] = values['gpsTrackSrc'].replace(/\n/g, ' ').replace(/[ ]+/g, ' ');
        }

        return super.prepareSubmitValues(values);
    }

    protected createDefaultFormValueConfig(record: SDocRecord): {} {
            return {
                dateshow: [DateUtils.dateToLocalISOString(record.dateshow)],
                datestart: [DateUtils.dateToLocalISOString(record.datestart)],
                dateend: [DateUtils.dateToLocalISOString(record.dateend)],
                locIdParent: [record.locIdParent],
                gpsTrackSrc: [record.gpsTrackSrc]
            };
        }

    protected postProcessFormValueConfig(record: SDocRecord, formValueConfig: {}): void {
        if (formValueConfig['subtype'] && formValueConfig['subtype'].length > 0 && formValueConfig['subtype'][0]) {
            formValueConfig['subtype'][0] = (formValueConfig['subtype'][0]  + '').replace(/ac_/g, '').replace(/loc_/g, '');
        }
    }

    protected updateFormComponents(): void {
        super.updateFormComponents();
        this.updateMap();
    }

    protected updateOptionValues(sdocSearchResult: SDocSearchResult): boolean {
        super.updateOptionValues(sdocSearchResult);
        const me = this;

        if (sdocSearchResult !== undefined) {
            const rawValues = this.editFormGroup.getRawValue();
            // console.log('update searchResult', sdocSearchResult);
            const whereValues = me.searchFormUtils.prepareExtendedSelectValues(me.sdocSearchFormUtils.getWhereValues(sdocSearchResult));
            me.optionsSelect['locId'] = me.searchFormUtils.moveSelectedToTop(
                me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(whereValues, true, [],
                    false), rawValues['locId']);
            me.optionsSelect['locIdParent'] = me.searchFormUtils.moveSelectedToTop(
                me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(whereValues, true, [],
                    false), rawValues['locIdParent']);

            me.optionsSelect['playlists'] = me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                me.sdocSearchFormUtils.getPlaylistValues(sdocSearchResult), true, [], true);
            me.optionsSelect['persons'] = me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                me.sdocSearchFormUtils.getPersonValues(sdocSearchResult), true, [], true);

            const routeValues = me.searchFormUtils.prepareExtendedSelectValues(me.sdocSearchFormUtils.getRouteValues(sdocSearchResult));
            me.optionsSelect['routeId'] = me.searchFormUtils.moveSelectedToTop(
                me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(routeValues, true, [],
                    false), rawValues['routeId']);

            const trackValues = me.searchFormUtils.prepareExtendedSelectValues(me.sdocSearchFormUtils.getTrackValues(sdocSearchResult));
            me.optionsSelect['trackId'] = me.searchFormUtils.moveSelectedToTop(
                me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(trackValues, true, [],
                    false), rawValues['trackId']);
            const tripValues = me.searchFormUtils.prepareExtendedSelectValues(me.sdocSearchFormUtils.getTripValues(sdocSearchResult));
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


    protected updateKeywordSuggestions(): boolean {
        super.updateKeywordSuggestions();

        if (BeanUtils.getValue(this.config, 'components.sdoc-persontags.keywordSuggestions')) {
            const suggestionConfig = BeanUtils.getValue(this.config, 'components.sdoc-persontags.keywordSuggestions');
            const prefix = BeanUtils.getValue(this.config, 'components.sdoc-persontags.editPrefix');
            this.personTagSuggestions = this.contentUtils.getSuggestedKeywords(suggestionConfig, prefix, this.editFormGroup.getRawValue());
            this.cd.markForCheck();
        } else {
            console.warn('no valid personTagSuggestions found');
            this.personTagSuggestions = [];
        }

        return true;
    }
}
