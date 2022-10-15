import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, Output} from '@angular/core';
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
import {StructuredKeywordState} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-contentutils.service';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {DateUtils} from '@dps/mycms-commons/dist/commons/utils/date.utils';
import {TourDocSearchResult} from '../../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {TourDocContentUtils} from '../../services/tdoc-contentutils.service';
import {
    CommonDocEditformComponent,
    CommonDocEditformComponentConfig
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-editform/cdoc-editform.component';
import {DOCUMENT} from '@angular/common';
import {TourDocAdapterResponseMapper} from '../../../../shared/tdoc-commons/services/tdoc-adapter-response.mapper';
import {TourDocNameSuggesterService} from '../../services/tdoc-name-suggester.service';
import {TourDocDescSuggesterService} from '../../services/tdoc-desc-suggester.service';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {AngularMarkdownService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-markdown.service';
import {Router} from '@angular/router';
import {LatLngTime} from '@dps/mycms-frontend-commons/dist/angular-maps/services/geo.parser';
import {GpxEditAreaComponent} from '../gpx-editarea/gpx-editarea.component';
import {Layout} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {CommonDocMultiActionManager} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-multiaction.manager';
import {TourDocActionTagService} from '../../services/tdoc-actiontag.service';
import {MultiActionTagConfig} from '@dps/mycms-commons/dist/commons/utils/actiontag.utils';
import {TourDocJoinUtils} from '../../services/tdoc-join.utils';

// TODO move to commons
export interface SingleEditorCommand {
    label: string,
    command: string
}

// TODO move to commons
export interface RangeEditorCommand {
    label: string,
    commandStart: string,
    commandEnd: string
}

// TODO move to commons
export interface CommonDocEditorCommandComponentConfig {
    singleCommands: SingleEditorCommand[];
    rangeCommands: RangeEditorCommand[];
}

export interface TurDocEditformComponentConfig extends CommonDocEditformComponentConfig {
    editorCommands: CommonDocEditorCommandComponentConfig;
}

@Component({
    selector: 'app-tdoc-editform',
    templateUrl: './tdoc-editform.component.html',
    styleUrls: ['./tdoc-editform.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocEditformComponent extends CommonDocEditformComponent<TourDocRecord, TourDocSearchForm, TourDocSearchResult,
    TourDocDataService> {
    private trackStatisticService = new TrackStatisticService();
    private gpxParser = new GeoGpxParser();
    private personsFound: StructuredKeywordState[] = [];
    private flgDescRendered = false;

    public Layout = Layout;
    public optionsSelect: {
        'gpsTrackState': IMultiSelectOption[];
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
        'infoId': IMultiSelectOption[];
        'poiJoinType': IMultiSelectOption[];
        'subType': IMultiSelectOption[];
        'subTypeActiontype': IMultiSelectOption[];
        'subTypeLocType': IMultiSelectOption[];
        'subTypeInfoType': IMultiSelectOption[];
        'trackId': IMultiSelectOption[];
        'tripId': IMultiSelectOption[];
    };

    public settingsSelectWhere = this.defaultSelectSetting;
    public settingsSelectActionType = this.defaultSelectSetting;
    public settingsSelectPersRate = this.defaultSelectSetting;
    public settingsSelectRoute = this.defaultSelectSetting;
    public settingsSelectTrack = this.defaultSelectSetting;
    public settingsSelectTrip = this.defaultSelectSetting;
    public settingsSelectInfo = this.defaultSelectSetting;
    public settingsSelectPoiJoinType = this.defaultSelectSetting;

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
    public textsSelectInfo: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Info ausgewählt',
        checkedPlural: 'Info ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '--',
        allSelected: 'alles'};
    public textsSelectPoiJoinType: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Typ ausgewählt',
        checkedPlural: 'Typ ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '--',
        allSelected: 'alles'};

    defaultPosition: LatLngTime = GpxEditAreaComponent.createDefaultPosition();
    trackRecords: TourDocRecord[] = [];
    poiGeoRecords: TourDocRecord[] = []
    trackStatistic: TrackStatistic = this.trackStatisticService.emptyStatistic();
    personTagSuggestions: string[] = [];
    joinIndexes: {[key: string]: any[]} = {};
    editorCommands: CommonDocEditorCommandComponentConfig = {
        singleCommands: [],
        rangeCommands: []
    };
    poiSelectFilter: {} = undefined;

    protected poiMultiActionManager = new CommonDocMultiActionManager(this.appService, this.actionService);

    // TODO add modal to commons
    @Input()
    public modal ? = false;

    // TODO add cancel to commons
    @Output()
    public cancel: EventEmitter<boolean> = new EventEmitter();

    constructor(public fb: FormBuilder, protected toastr: ToastrService, protected cd: ChangeDetectorRef,
                protected appService: GenericAppService, protected tdocSearchFormUtils: TourDocSearchFormUtils,
                protected searchFormUtils: SearchFormUtils, protected tdocDataService: TourDocDataService,
                protected contentUtils: TourDocContentUtils, @Inject(DOCUMENT) private document,
                protected platformService: PlatformService, protected actionService: TourDocActionTagService,
                protected angularMarkdownService: AngularMarkdownService,
                protected tourDocNameSuggesterService: TourDocNameSuggesterService,
                protected tourDocDescSuggesterService: TourDocDescSuggesterService,
                protected router: Router) {
        super(fb, toastr, cd, appService, tdocSearchFormUtils, searchFormUtils, tdocDataService, contentUtils);
    }

    setPersonsFound(persons: StructuredKeywordState[]) {
        this.personsFound = persons;
    }

    recommendName(): void {
        this.tourDocNameSuggesterService.suggest(
            this.editFormGroup.getRawValue(), {
                optionsSelectLocId: this.optionsSelect.locId,
                optionsSelectSubTypeActiontype: this.optionsSelect.subTypeActiontype,
                personsFound: this.personsFound
            }
        ).then(name => {
            this.setValue('name', name);
        });
    }

    recommendDesc(): void {
        this.tourDocDescSuggesterService.suggest(
            this.editFormGroup.getRawValue(), {}
        ).then(desc => {
            this.setValue('descTxtRecommended', desc);
        }).catch(reason => {
            this.setValue('descTxtRecommended', undefined);
        });
    }

    useRecommendedDesc(): void {
        this.setValue('descTxt', this.editFormGroup.getRawValue()['descTxtRecommended'] || '');
        this.setValue('descTxtRecommended', undefined);
        this.renderDesc(true);
    }

    // TODO move to separate component
    addSingleCommand(command: SingleEditorCommand): void {
        if (!this.platformService.isClient()) {
            return;
        }

        const textarea = <HTMLTextAreaElement> document.querySelector('#descTxt');
        if (!textarea || textarea === undefined || textarea === null) {
            return;
        }

        const oldString = textarea.value;
        const startPos = textarea.selectionStart || 0;

        const newString = oldString.substring(0, startPos)
            + command.command
            + oldString.substring(startPos, oldString.length);

        this.setValue('descTxt', newString);
        this.renderDesc(true);

        textarea.focus();
        textarea.selectionStart = startPos;
        textarea.selectionEnd = startPos;
    }

    // TODO move to separate component
    addRangeCommand(command: RangeEditorCommand): void {
        if (!this.platformService.isClient()) {
            return;
        }

        const textarea = <HTMLTextAreaElement> document.querySelector('#descTxt');
        if (!textarea || textarea === undefined || textarea === null) {
            return;
        }

        const oldString = textarea.value;
        const startPos = textarea.selectionStart || 0;
        const endPos = textarea.selectionEnd || 0;

        const newString = oldString.substring(0, startPos)
            + command.commandStart
            + oldString.substring(startPos, endPos)
            +  command.commandEnd
            + oldString.substring(endPos, oldString.length);

        this.setValue('descTxt', newString);
        this.renderDesc(true);

        textarea.focus();
        textarea.selectionStart = startPos;
        textarea.selectionEnd = startPos;
    }

    renderDesc(force: boolean): string {
        if ((this.flgDescRendered || !this.record) && !force) {
            return;
        }

        const desc = this.editFormGroup.getRawValue()['descTxt'] || '';
        if (!this.platformService.isClient()) {
            return desc;
        }

        this.flgDescRendered = this.angularMarkdownService.renderMarkdown('#renderedDesc', desc, true);

        return '';
    }

    updateGpxArea(): boolean {
        this.defaultPosition = GpxEditAreaComponent.createDefaultPosition();
        if (this.record) {
            if (this.record.geoLat && this.record.geoLon) {
                this.defaultPosition.lat = Number.parseFloat(this.record.geoLat);
                this.defaultPosition.lng = Number.parseFloat(this.record.geoLon);
            }

            if ('ROUTE' === this.record.type.toUpperCase()) {
                this.defaultPosition.time = undefined;
            } else if (this.record.datestart) {
                this.defaultPosition.time = Array.isArray(this.editFormGroup.getRawValue()['datestart'])
                    ? this.editFormGroup.getRawValue()['datestart'][0]
                    : this.editFormGroup.getRawValue()['datestart'];
            }

            if (this.editFormGroup.getRawValue()['tdocdatatech_altMax']) {
                this.defaultPosition.alt = Array.isArray(this.editFormGroup.getRawValue()['tdocdatatech_altMax'])
                ? this.editFormGroup.getRawValue()['tdocdatatech_altMax'][0]
                : this.editFormGroup.getRawValue()['tdocdatatech_altMax'];
            }
        }

        this.poiGeoRecords = TourDocJoinUtils.preparePoiMapValuesFromForm(this.editFormGroup.getRawValue(), this.joinIndexes);

        this.cd.markForCheck();

        return false;
    }

    joinElementChanged(formElement: any, joinName: string, idx: number, add: boolean) {
        const indexes = this.joinIndexes[joinName];
        if (add && indexes) {
            if (idx === indexes[indexes.length - 1]) {
                const newIdx = idx + 1;
                this.editFormGroup.registerControl(joinName + 'Id' + newIdx, this.fb.control(undefined, undefined));
                this.editFormGroup.registerControl(joinName + 'Full' + newIdx, this.fb.control(undefined, undefined));
                this.editFormGroup.registerControl(joinName + 'LinkedRouteAttr' + newIdx, this.fb.control(undefined, undefined));
                this.editFormGroup.registerControl(joinName + 'LinkedDetails' + newIdx, this.fb.control(undefined, undefined));
                indexes.push(newIdx);
            }
        }

        return false;
    }

    updateGpsTrackSrc(gpsTrackSrc: string): void {
        this.setValue('gpsTrackSrc', gpsTrackSrc);
        this.updateMap();
    }

    updateGeoLoc(geoLoc: string): void {
        this.setValue('geoLoc', geoLoc);
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

    // TODO add cancel to commons
    submitCancel(event: Event): boolean {
        this.cancel.emit(false);

        return false;
    }

    // TODO add modal to commons
    onCreateNewLink(key: string, id: string): boolean {
        const me = this;
        // open modal dialog
        me.router.navigate([{ outlets: { 'modaledit': ['modaledit', 'create', key, id] } }]).then(value => {
            // check for closing modal dialog and routechange -> update facets
            const subscription = me.router.events.subscribe((val) => {
                subscription.unsubscribe();
                me.fillFacets(me.record)
            });
        });


        return false;
    }

    // TODO add modal to commons
    onShowEntityLink(key: string, id: string): boolean {
        const me = this;
        // open modal dialog
        me.router.navigate([{ outlets: { 'modalshow': ['modalshow', 'show', key, key + '_' + id] } }]).then(value => {
            // check for closing modal dialog and routechange -> update facets
            const subscription = me.router.events.subscribe((val) => {
                subscription.unsubscribe();
                me.fillFacets(me.record)
            });
        });


        return false;
    }

    // TODO move to separate component
    getPoiFiltersForType(record: TourDocRecord): any {
        const filters = {};
        filters['type'] = 'POI';
        filters['sort'] = 'distance';
        filters['where'] = undefined;
        filters['moreFilter'] = 'id_notin_is:' + record.id;
        filters['where'] = this.createNearByFilter(record);

        return filters;
    }

    // TODO move to separate component
    onPoiClickedOnMap(tdoc: TourDocRecord): boolean {
        if (!this.poiMultiActionManager.isRecordOnMultiActionTag(tdoc)) {
            this.poiMultiActionManager.appendRecordToMultiActionTag(tdoc);
        } else {
            this.poiMultiActionManager.removeRecordFromMultiActionTag(tdoc);
        }

        return false;
    }

    onRemovePoiFromForm(idx: string): boolean {
        const joinName = 'linkedPois'
        this.editFormGroup.removeControl(joinName + 'Id' + idx);
        this.editFormGroup.removeControl(joinName + 'Name' + idx);
        this.editFormGroup.removeControl(joinName + 'Position' + idx);
        this.editFormGroup.removeControl(joinName + 'Poitype' + idx);
        this.editFormGroup.removeControl(joinName + 'GeoLoc' + idx);
        this.editFormGroup.removeControl(joinName + 'GeoEle' + idx);

        this.joinIndexes[joinName].splice(this.joinIndexes[joinName].indexOf(idx), 1);
        this.poiGeoRecords = TourDocJoinUtils.preparePoiMapValuesFromForm(this.editFormGroup.getRawValue(), this.joinIndexes);

        this.cd.markForCheck();

        return false;
    }

    onChangePoiSelectFilter(): boolean {
        this.poiSelectFilter = this.getPoiFiltersForType(this.record);
        return false;
    }

    // TODO move to separate component
    onAppendSelectedPois(): boolean {
        const selectedPois = this.poiMultiActionManager.getSelectedRecords();

        const joinName = 'linkedPois'
        const indexes = this.joinIndexes[joinName];
        let idx = 0;
        if (indexes && indexes.length > 0) {
            idx = indexes[indexes.length - 1];
        }

        for (const poi of selectedPois) {
            idx = idx + 1;
            this.editFormGroup.registerControl(joinName + 'Id' + idx, this.fb.control(undefined, undefined));
            this.setValue(joinName + 'Id' + idx, poi.id.replace('POI_', ''));
            this.editFormGroup.registerControl(joinName + 'Name' + idx, this.fb.control(undefined, undefined));
            this.setValue(joinName + 'Name' + idx, poi.name);
            this.editFormGroup.registerControl(joinName + 'Position' + idx, this.fb.control(undefined, undefined));
            this.setValue(joinName + 'Position' + idx, idx);
            this.editFormGroup.registerControl(joinName + 'Poitype' + idx, this.fb.control(undefined, undefined));
            this.setValue(joinName + 'Poitype' + idx, 60 + '');
            this.editFormGroup.registerControl(joinName + 'GeoLoc' + idx, this.fb.control(undefined, undefined));
            this.setValue(joinName + 'GeoLoc' + idx, poi.geoLoc);
            this.editFormGroup.registerControl(joinName + 'GeoEle' + idx, this.fb.control(undefined, undefined));
            indexes.push(idx);
        }

        this.joinIndexes[joinName] = indexes
        this.poiGeoRecords = TourDocJoinUtils.preparePoiMapValuesFromForm(this.editFormGroup.getRawValue(), this.joinIndexes);

        this.cd.markForCheck();

        return false;
    }

    // TODO move to separate component
    protected createNearByFilter(record: TourDocRecord): string {
        return record.geoLat !== undefined
            ? 'nearby:' + [record.geoLat, record.geoLon, 10].join('_') +
            '_,_nearbyAddress:' + record.locHirarchie.replace(/[^-a-zA-Z0-9_.äüöÄÜÖß]+/g, '')
            : 'blimblamblummichgibtesnicht';
    }

    protected validateSchema(record: TourDocRecord): SchemaValidationError[] {
        return TourDocRecordSchema.validate(record);
    }

    protected validateValues(record: TourDocRecord): string[] {
        return TourDocRecordValidator.instance.validateValues(record);
    }

    protected getComponentConfig(config: {}): TurDocEditformComponentConfig {
        let prefix = '';
        let suggestionConfig = [];
        if (BeanUtils.getValue(config, 'components.tdoc-keywords.keywordSuggestions')) {
            suggestionConfig = BeanUtils.getValue(config, 'components.tdoc-keywords.keywordSuggestions');
            prefix = BeanUtils.getValue(config, 'components.tdoc-keywords.editPrefix');
        }

        const editorCommands: CommonDocEditorCommandComponentConfig = {
            rangeCommands: [],
            singleCommands: []
        };
        if (BeanUtils.getValue(config, 'components.tdoc-editor-commands.singleCommands')) {
            editorCommands.singleCommands = BeanUtils.getValue(config, 'components.tdoc-editor-commands.singleCommands');
        }
        if (BeanUtils.getValue(config, 'components.tdoc-editor-commands.rangeCommands')) {
            editorCommands.rangeCommands = BeanUtils.getValue(config, 'components.tdoc-editor-commands.rangeCommands');
        }

        const defaultConfig: TurDocEditformComponentConfig = {
            editorCommands: editorCommands,
            suggestionConfigs: suggestionConfig,
            editPrefix: prefix,
            numBeanFieldConfig: {
                'gpsTrackState': { labelPrefix: 'label.gpstrack.state.', values: [-1, 0, 1, 2, 3]},
                'tdocratepers.gesamt': { labelPrefix: 'label.tdocratepers.gesamt.', values: [-1, 0, 2, 5, 8, 11, 14]},
                'tdocratepers.gesamt_image': { labelPrefix: 'label.image.tdocratepers.gesamt.', values: [-1, 0, 2, 5, 6, 8, 9, 10, 11, 14]},
                'tdocratepers.ausdauer': { labelPrefix: 'label.tdocratepers.ausdauer.', values: [0, 2, 5, 8, 11, 14]},
                'tdocratepers.bildung': { labelPrefix: 'label.tdocratepers.bildung.', values: [0, 2, 8, 11]},
                'tdocratepers.kraft': { labelPrefix: 'label.tdocratepers.kraft.', values: [0, 2, 5, 8, 11, 14]},
                'tdocratepers.mental': { labelPrefix: 'label.tdocratepers.mental.', values: [0, 2, 5, 8, 11, 14]},
                'tdocratepers.motive': { labelPrefix: 'label.tdocratepers.motive.', values: [-1, 0, 2, 5, 8, 11, 14]},
                'tdocratepers.schwierigkeit': { labelPrefix: 'label.tdocratepers.schwierigkeit.', values: [0, 2, 5, 8, 11, 14]},
                'tdocratepers.wichtigkeit': { labelPrefix: 'label.tdocratepers.wichtigkeit.', values: [-1, 0, 2, 5, 8, 11, 14]},
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
                'poiJoinType': {
                    labelPrefix: 'poijoin_',
                    values: [0, 10, 20, 30, 40, 50, 60, 99]
                },
                'subtype': {},
                'subTypeActiontype': {
                    labelPrefix: 'ac_',
                    values: [0, 1, 2, 3, 4, 5, 6, 101, 102, 103, 104, 105, 106, 110, 111,
                        120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136]
                },
                'subTypeLocType': {labelPrefix: 'loc_', values: [1, 2, 3, 4, 5, 6]},
                'subTypeInfoType': {labelPrefix: 'if_', values: [1, 2]},
                'tdocdatainfo.baseloc': {},
                'tdocdatainfo.destloc': {},
                'tdocdatainfo.guides': {},
                'tdocdatainfo.region': {},
                'tdocdatainfo.sectionDetails': {},
                'tdocinfo.name': {},
                'tdocinfo.desc': {},
                'tdocinfo.shortDesc': {},
                'tdocinfo.reference': {},
                'tdocinfo.publisher': {},
                'tdocinfo.type': {},
                'tdocratetech.bergtour': {},
                'tdocratetech.firn': {},
                'tdocratetech.gletscher': {},
                'tdocratetech.klettern': {},
                'tdocratetech.ks': {},
                'tdocratetech.overall': {},
                'tdocratetech.schneeschuh': {}
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
                'linkedRouteAttr': {
                    'facetName': 'route_attr_ss'
                },
                'linkedRoutesLinkedRouteAttr0': {
                    'facetName': 'route_attr_ss'
                },
                'linkedRoutesLinkedRouteAttr1': {
                    'facetName': 'route_attr_ss'
                },
                'linkedRoutesLinkedRouteAttr2': {
                    'facetName': 'route_attr_ss'
                },
                'linkedRoutesLinkedRouteAttr3': {
                    'facetName': 'route_attr_ss'
                },
                'linkedRoutesLinkedRouteAttr4': {
                    'facetName': 'route_attr_ss'
                },
                'linkedRoutesLinkedRouteAttr5': {
                    'facetName': 'route_attr_ss'
                },
                'linkedRoutesLinkedRouteAttr6': {
                    'facetName': 'route_attr_ss'
                },
                'linkedRoutesLinkedRouteAttr7': {
                    'facetName': 'route_attr_ss'
                }
            },
            optionsSelect: {
                'gpsTrackState': [],
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
                'infoId': [],
                'poiJoinType': [],
                'subType': [],
                'subTypeActiontype': [],
                'subTypeLocType': [],
                'subTypeInfoType': [],
                'trackId': [],
                'tripId': []
            }
        };

        return defaultConfig;
    }

    protected configureComponent(config: {}): void {
        super.configureComponent(config);

        const componentConfig = this.getComponentConfig(config);
        this.editorCommands = componentConfig.editorCommands;

        const actionTag: MultiActionTagConfig =  {
            configAvailability: [],
            flgUseInput: false,
            flgUseSelect: false,
            recordAvailability: [],
            shortName: '',
            showFilter: [],
            name: 'noo',
            key: 'noop',
            type: 'noop',
            multiRecordTag: true
        };
        actionTag['active'] = true;
        actionTag['available'] = true;

        this.poiMultiActionManager.setSelectedMultiActionTags(
            [
                actionTag
            ]);
    }

    protected prepareSubmitValues(values: {}): void {
        if (values['gpsTrackSrc'] !== undefined && values['gpsTrackSrc'] !== null) {
            values['gpsTrackSrc'] = values['gpsTrackSrc'].replace(/\n/g, ' ').replace(/[ ]+/g, ' ');
        }

        if (values['geoLoc']) {
            const lst = values['geoLoc'].split(',');
            values['geoLat'] = lst.length > 1 ? lst[0] : undefined;
            values['geoLon'] = lst.length > 1 ? lst[1] : undefined;
        } else {
            values['geoLat'] = undefined;
            values['geoLon'] = undefined;
        }

        values['tdoclinkedroutes'] = TourDocJoinUtils.prepareLinkedRoutesSubmitValues(this.record, values, 'linkedRoutes', this.joinIndexes['linkedRoutes']);
        values['tdoclinkedinfos'] = TourDocJoinUtils.prepareLinkedInfosSubmitValues(this.record, values, 'linkedInfos', this.joinIndexes['linkedInfos']);
        values['tdoclinkedpois'] = TourDocJoinUtils.prepareLinkedPoiSubmitValues(this.record, values, 'linkedPois', this.joinIndexes['linkedPois']);

        return super.prepareSubmitValues(values);
    }

    // TODO move to separate component
    protected createDefaultFormValueConfig(record: TourDocRecord): {} {
        const valueConfig = {
            descTxtRecommended: [],
            dateshow: [DateUtils.dateToLocalISOString(record.dateshow)],
            datestart: [DateUtils.dateToLocalISOString(record.datestart)],
            dateend: [DateUtils.dateToLocalISOString(record.dateend)],
            locIdParent: [record.locIdParent],
            gpsTrackSrc: [record.gpsTrackSrc],
            geoLocAddress: [record.name]
        };

        this.joinIndexes['linkedRoutes'] = TourDocJoinUtils.appendLinkedRoutesToDefaultFormValueConfig(record, valueConfig, 'linkedRoutes');
        this.joinIndexes['linkedInfos'] = TourDocJoinUtils.appendLinkedInfosToDefaultFormValueConfig(record, valueConfig, 'linkedInfos');
        this.joinIndexes['linkedPois'] = TourDocJoinUtils.appendLinkedPoisToDefaultFormValueConfig(record, valueConfig, 'linkedPois');

        return valueConfig;
    }

    protected postProcessFormValueConfig(record: TourDocRecord, formValueConfig: {}): void {
        if (formValueConfig['subtype'] && formValueConfig['subtype'].length > 0 && formValueConfig['subtype'][0]) {
            formValueConfig['subtype'][0] =
                (formValueConfig['subtype'][0]  + '')
                    .replace(/ac_/g, '')
                    .replace(/loc_/g, '')
                    .replace(/if_/g, '');
        }
    }

    protected updateFormComponents(): void {
        this.flgDescRendered = false;
        super.updateFormComponents();
        this.updateGpxArea();
        this.updateMap();
    }

    protected updateOptionValues(tdocSearchResult: TourDocSearchResult): boolean {
        super.updateOptionValues(tdocSearchResult);
        const me = this;

        if (tdocSearchResult !== undefined) {
            const rawValues = this.editFormGroup.getRawValue();
            const location = this.record.locHirarchie
                ? TourDocAdapterResponseMapper.generateDoubletteValue(this.record.locHirarchie.replace(/.*-> /, ''))
                : '';

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

            const selectableRouteValues = me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                me.searchFormUtils.prepareExtendedSelectValues(me.tdocSearchFormUtils.getRouteValues(tdocSearchResult)),
                true, [], false);
            let ordinaryRoutes: IMultiSelectOption[] = [];
            const suggestedRoutes: IMultiSelectOption[] = [];
            if (location && location.length > 0) {
                selectableRouteValues.forEach(value => {
                    if (TourDocAdapterResponseMapper.generateDoubletteValue(value.name).includes(location)) {
                        const copy: IMultiSelectOption = { ...value};
                        copy.name = '\uD83D\uDCA1 ' + copy.name;
                        suggestedRoutes.push(copy);
                    } else {
                        ordinaryRoutes.push(value);
                    }
                });
            } else {
                ordinaryRoutes = selectableRouteValues;
            }
            const sortedRoutes: IMultiSelectOption[] = [].concat(suggestedRoutes).concat(ordinaryRoutes);
            me.optionsSelect['routeId'] = me.searchFormUtils.moveSelectedToTop(sortedRoutes, rawValues['routeId']);

            const selectableInfoValues = me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                me.searchFormUtils.prepareExtendedSelectValues(me.tdocSearchFormUtils.getInfoValues(tdocSearchResult)),
                true, [], false);
            let ordinaryInfos: IMultiSelectOption[] = [];
            const suggestedInfos: IMultiSelectOption[] = [];
            if (location && location.length > 0) {
                selectableInfoValues.forEach(value => {
                    if (TourDocAdapterResponseMapper.generateDoubletteValue(value.name).includes(location)) {
                        const copy: IMultiSelectOption = { ...value};
                        copy.name = '\uD83D\uDCA1 ' + copy.name;
                        suggestedInfos.push(copy);
                    } else {
                        ordinaryInfos.push(value);
                    }
                });
            } else {
                ordinaryInfos = selectableInfoValues;
            }
            const sortedInfos: IMultiSelectOption[] = [].concat(suggestedInfos).concat(ordinaryInfos);
            me.optionsSelect['infoId'] = me.searchFormUtils.moveSelectedToTop(sortedInfos, rawValues['infoId']);

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
            me.optionsSelect['infoId'] = me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList([], true, [], false);
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

}
