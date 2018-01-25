import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChange,
    ViewContainerRef
} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
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

@Component({
    selector: 'app-sdoc-editform',
    templateUrl: './sdoc-editform.component.html',
    styleUrls: ['./sdoc-editform.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocEditformComponent implements OnChanges {
    private numBeanFieldConfig = {
        'sdocratepers.gesamt': { values: [0, 2, 5, 8, 11, 14]},
        'sdocratepers.ausdauer': { values: [0, 2, 5, 8, 11, 14]},
        'sdocratepers.bildung': { values: [0, 2, 8, 11]},
        'sdocratepers.kraft': { values: [0, 2, 5, 8, 11, 14]},
        'sdocratepers.mental': { values: [0, 2, 5, 8, 11, 14]},
        'sdocratepers.motive': { values: [0, 2, 5, 8, 11, 14]},
        'sdocratepers.schwierigkeit': { values: [0, 2, 5, 8, 11, 14]},
        'sdocratepers.wichtigkeit': { values: [0, 2, 5, 8, 11, 14]},
        'locId': {},
    };
    private stringBeanFieldConfig = {
        'locHirarchie': {},
        'subtype': {}
    };

    public optionsSelectWhere: IMultiSelectOption[] = [];
    public optionsSelectPlaylists: IMultiSelectOption[] = [];
    public optionsSelectPersons: IMultiSelectOption[] = [];
    public optionsSelectActionType: IMultiSelectOption[] = [];
    public optionsSelectPersRate: {
        'sdocratepers.gesamt': IMultiSelectOption[];
        'sdocratepers.ausdauer': IMultiSelectOption[];
        'sdocratepers.bildung': IMultiSelectOption[];
        'sdocratepers.kraft': IMultiSelectOption[];
        'sdocratepers.mental': IMultiSelectOption[];
        'sdocratepers.motive': IMultiSelectOption[];
        'sdocratepers.schwierigkeit': IMultiSelectOption[];
        'sdocratepers.wichtigkeit': IMultiSelectOption[];
    } = {'sdocratepers.gesamt': [],
        'sdocratepers.ausdauer': [],
        'sdocratepers.bildung': [],
        'sdocratepers.kraft': [],
        'sdocratepers.mental': [],
        'sdocratepers.motive': [],
        'sdocratepers.schwierigkeit': [],
        'sdocratepers.wichtigkeit': []};

    public settingsSelectWhere: IMultiSelectSettings =
        {dynamicTitleMaxItems: 5,
            buttonClasses: 'btn btn-default btn-secondary text-right fullwidth btn-sm',
            containerClasses: 'dropdown-inline fullwidth',
            enableSearch: true,
            showUncheckAll: true,
            autoUnselect: true,
            selectionLimit: 1};
    public settingsSelectActionType: IMultiSelectSettings =
        {dynamicTitleMaxItems: 5,
            buttonClasses: 'btn btn-default btn-secondary text-right fullwidth btn-sm',
            containerClasses: 'dropdown-inline fullwidth',
            enableSearch: true,
            showUncheckAll: true,
            autoUnselect: true,
            selectionLimit: 1};
    public settingsSelectPersons: IMultiSelectSettings =
        {dynamicTitleMaxItems: 5,
            buttonClasses: 'btn btn-default btn-secondary text-right fullwidth btn-sm',
            containerClasses: 'dropdown-inline fullwidth',
            enableSearch: true,
            showUncheckAll: true,
            autoUnselect: true,
            selectionLimit: 1};
    public settingsSelectPlaylists: IMultiSelectSettings =
        {dynamicTitleMaxItems: 5,
            buttonClasses: 'btn btn-default btn-secondary text-right fullwidth btn-sm',
            containerClasses: 'dropdown-inline fullwidth',
            enableSearch: true,
            showUncheckAll: true,
            autoUnselect: true,
            selectionLimit: 1};
    public settingsSelectPersRate: IMultiSelectSettings =
        {dynamicTitleMaxItems: 5,
            buttonClasses: 'btn btn-default btn-secondary text-right fullwidth btn-sm',
            containerClasses: 'dropdown-inline fullwidth',
            enableSearch: true,
            showUncheckAll: true,
            autoUnselect: true,
            selectionLimit: 1};

    public textsSelectWhere: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Region ausgewählt',
        checkedPlural: 'Regionen ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: 'Regionen',
        allSelected: 'Überall'};
    public textsSelectActionType: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Action ausgewählt',
        checkedPlural: 'Aktion ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: 'Actions',
        allSelected: 'alles'};
    public textsSelectPlaylists: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Typ ausgewählt',
        checkedPlural: 'Typen ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: 'Typen',
        allSelected: 'Alle'};
    public textsSelectPersons: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Typ ausgewählt',
        checkedPlural: 'Typen ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: 'Typen',
        allSelected: 'Alle'};
    public textsSelectPersRate: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Bewertung ausgewählt',
        checkedPlural: 'Bewertung ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: 'Bewertung',
        allSelected: 'Alle'};

    // empty default
    public editFormGroup = this.fb.group({
        id: '',
        name: '',
        desc: ''
    });


    @Input()
    public record: SDocRecord;

    @Output()
    public save: EventEmitter<SDocRecord> = new EventEmitter();

    constructor(public fb: FormBuilder, private toastr: ToastsManager, vcr: ViewContainerRef, private cd: ChangeDetectorRef,
                private searchFormUtils: SDocSearchFormUtils, private sdocDataService: SDocDataService) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            this.updateData();
        }
    }

    private updateData() {
        if (this.record === undefined) {
            this.editFormGroup = this.fb.group({});
            return;
        }

        const config = {
            dateshow: [this.record.dateshow]
        };

        const fields = this.record.toJSON();
        for (const key in fields) {
            if (fields.hasOwnProperty(key) && !config.hasOwnProperty(key)) {
                config[key] = [fields[key]];
            }
        }
        for (const key in this.stringBeanFieldConfig) {
            config[key.replace('.', '_')] = [[BeanUtils.getValue(this.record, key) + '']];
        }

        for (const key in this.numBeanFieldConfig) {
            config[key.replace('.', '_')] = [[BeanUtils.getValue(this.record, key) + '']];
            const options = [];
            if (this.record.type === 'IMAGE' && key === 'sdocratepers.gesamt') {
                for (const optionValue of [0, 2, 5, 6, 8, 9, 10, 11, 14]) {
                    options.push(['label.image.' + key + '.', '' + optionValue, '', 0]);
                }
            } else if (this.numBeanFieldConfig[key]['values']) {
                for (const optionValue of this.numBeanFieldConfig[key]['values']) {
                    options.push(['label.' + key + '.', '' + optionValue, '', 0]);
                }
            }
            this.optionsSelectPersRate[key] =
                this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(options, false, [], true);
        }
        this.editFormGroup = this.fb.group(config);

        const me = this;
        const searchForm = new SDocSearchForm({type: this.record.type});
        const rawValues = this.editFormGroup.getRawValue();
        this.sdocDataService.search(searchForm,
            {
                showFacets: true, // []
                loadTrack: false,
                showForm: false
            }).then(function doneSearch(sdocSearchResult) {
            if (sdocSearchResult !== undefined) {
                console.log('update searchResult', sdocSearchResult);
                const whereValues = [];
                for (const whereValue of me.searchFormUtils.getWhereValues(sdocSearchResult)) {
                    // use value as label if not set
                    if (!whereValue[4]) {
                        whereValue[4] = whereValue[1];
                    }
                    // use id as value instead of name
                    if (whereValue[5]) {
                        whereValue[1] = whereValue[5];
                    }
                    whereValues.push(whereValue);
                }
                me.optionsSelectWhere = me.searchFormUtils.moveSelectedToTop(
                    me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(whereValues, true, [/^_+/, /_+$/], false),
                    rawValues['locId']);

                me.optionsSelectActionType = me.searchFormUtils.moveSelectedToTop(
                    me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                        me.searchFormUtils.getActionTypeValues(sdocSearchResult), true, [], true)
                        .sort(function (a, b) {
                            if (a['count'] < b['count']) {
                                return 1;
                            }
                            if (a['count'] > b['count']) {
                                return -1;
                            }
                            return a.name.localeCompare(b.name);
                        }),
                    rawValues['subtype']);
                me.optionsSelectPlaylists = me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                    me.searchFormUtils.getPlaylistValues(sdocSearchResult), true, [], true);
                me.optionsSelectPersons = me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                    me.searchFormUtils.getPersonValues(sdocSearchResult), true, [], true);
            } else {
                console.log('empty searchResult', sdocSearchResult);
                me.optionsSelectWhere = me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList([], true, [/^_+/, /_+$/], false);
                me.optionsSelectActionType = me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList([], true, [], true);
                me.optionsSelectPlaylists = me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList([], true, [], true);
                me.optionsSelectPersons = me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList([], true, [], true);
            }
            me.cd.markForCheck();
        }).catch(function errorSearch(reason) {
            me.toastr.error('Es gibt leider Probleme bei der Suche - am besten noch einmal probieren :-(', 'Oje!');
            console.error('doSearch failed:' + reason);
            me.cd.markForCheck();
        });
    }

    submitSave(event: Event) {
        const values = this.editFormGroup.getRawValue();

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

        const errors: SchemaValidationError[] = SDocRecordSchema.validate(values);
        if (errors !== undefined && errors.length > 0) {
            let msg = '';
            errors.map((value: SchemaValidationError, index, array) => {
                msg += '- ' + value.path + ':' + value.expected + '<br>';
            });
            this.toastr.warning('Leider passen nicht alle Eingaben - Fehler:' + msg, 'Oje!');
            return false;
        }

        this.save.emit(values);
        return false;
    }
}
