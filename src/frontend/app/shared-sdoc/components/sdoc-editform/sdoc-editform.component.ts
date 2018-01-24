import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, ViewContainerRef} from '@angular/core';
import {SDocRecord, SDocRecordRelation} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {FormBuilder, Validators} from '@angular/forms';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {SDocRecordSchema} from '../../../../shared/sdoc-commons/model/schemas/sdoc-record-schema';
import {ToastsManager} from 'ng2-toastr';
import {SchemaValidationError} from 'js-data';
import {ComponentUtils} from '../../../../../shared/angular-commons/services/component.utils';
import {IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts} from 'angular-2-dropdown-multiselect';
import {SDocSearchFormUtils} from '../../services/sdoc-searchform-utils.service';
import {BeanUtils} from '../../../../shared/commons/utils/bean.utils';

@Component({
    selector: 'app-sdoc-editform',
    templateUrl: './sdoc-editform.component.html',
    styleUrls: ['./sdoc-editform.component.css']
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
        'sdocratepers.wichtigkeit': { values: [0, 2, 5, 8, 11, 14]}
    };

    public optionsSelectLocation: IMultiSelectOption[] = [];
    public optionsSelectType: IMultiSelectOption[] = [];
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

    public settingsSelectLocation: IMultiSelectSettings =
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
    public settingsSelectType: IMultiSelectSettings =
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

    public textsSelectLocation: IMultiSelectTexts = { checkAll: 'Alle auswählen',
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
    public textsSelectType: IMultiSelectTexts = { checkAll: 'Alle auswählen',
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

    constructor(public fb: FormBuilder, private toastr: ToastsManager, vcr: ViewContainerRef,
                private searchFormUtils: SDocSearchFormUtils) {
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
        for (const key in this.numBeanFieldConfig) {
            config[key.replace('.', '_')] = [[BeanUtils.getValue(this.record, key) + '']];
            const options = [];
            if (this.record.type === 'IMAGE' && key === 'sdocratepers.gesamt') {
                for (const optionValue of [0, 2, 5, 6, 8, 9, 10, 11, 14]) {
                    options.push(['label.image.' + key + '.', '' + optionValue, '', 0]);
                }
            } else {
                for (const optionValue of this.numBeanFieldConfig[key]['values']) {
                    options.push(['label.' + key + '.', '' + optionValue, '', 0]);
                }
            }
            this.optionsSelectPersRate[key] =
                this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(options, false, [], true);
        }


        this.editFormGroup = this.fb.group(config);
    }

    submitSave(event: Event) {
        const values = this.editFormGroup.getRawValue();

        // delete empty key
        for (const key in values) {
            if (values.hasOwnProperty(key) && values[key] === undefined || values[key] === null) {
                delete values[key];
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

        this.save.emit(values);
        return false;
    }
}
