import {ChangeDetectorRef, EventEmitter, Input, Output, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToastsManager} from 'ng2-toastr';
import {SchemaValidationError} from 'js-data';
import {IMultiSelectSettings, IMultiSelectTexts} from 'angular-2-dropdown-multiselect';
import {BeanUtils} from '../../../commons/utils/bean.utils';
import {AppState, GenericAppService} from '../../../commons/services/generic-app.service';
import {DateUtils} from '../../../commons/utils/date.utils';
import {SearchFormUtils} from '../../../angular-commons/services/searchform-utils.service';
import {CommonDocRecord} from '../../../search-commons/model/records/cdoc-entity-record';
import {CommonDocSearchForm} from '../../../search-commons/model/forms/cdoc-searchform';
import {CommonDocSearchResult} from '../../../search-commons/model/container/cdoc-searchresult';
import {CommonDocDataService} from '../../../search-commons/services/cdoc-data.service';
import {CommonDocContentUtils, KeywordSuggestion} from '../../services/cdoc-contentutils.service';
import {CommonDocSearchFormUtils} from '../../services/cdoc-searchform-utils.service';
import {AbstractInlineComponent} from '../../../angular-commons/components/inline.component';

export interface CommonDocEditformComponentConfig {
    numBeanFieldConfig: {};
    stringBeanFieldConfig: {};
    stringArrayBeanFieldConfig: {};
    inputSuggestionValueConfig: {};
    optionsSelect: {};
    suggestionConfigs: KeywordSuggestion[];
    editPrefix;
}

export abstract class CommonDocEditformComponent<R extends CommonDocRecord, F extends CommonDocSearchForm,
    S extends CommonDocSearchResult<R, F>, D extends CommonDocDataService<R, F, S>> extends AbstractInlineComponent {
    protected config: {};
    suggestionConfigs: KeywordSuggestion[] = [];
    editPrefix = '';
    protected defaultSelectSetting: IMultiSelectSettings =
        {dynamicTitleMaxItems: 5,
            buttonClasses: 'btn btn-default btn-secondary text-right fullwidth btn-sm',
            containerClasses: 'dropdown-inline fullwidth',
            enableSearch: true,
            showUncheckAll: false,
            autoUnselect: true,
            selectionLimit: 1};
    protected numBeanFieldConfig = {};
    protected stringBeanFieldConfig = {};
    protected stringArrayBeanFieldConfig = {};
    protected inputSuggestionValueConfig = {};
    public optionsSelect = {};

    public inputSuggestionValues = {};

    public textsSelectPlaylists: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Typ ausgewählt',
        checkedPlural: 'Typen ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '--',
        allSelected: 'Alle'};

    // empty default
    public editFormGroup: FormGroup = this.fb.group({
        id: '',
        name: '',
        desc: '',
        keywords: ''
    });
    keywordSuggestions: string[] = [];

    @Input()
    public record: R;

    @Input()
    public backToSearch? = false;

    @Output()
    public save: EventEmitter<R> = new EventEmitter();

    @Output()
    public saveAndSearch: EventEmitter<R> = new EventEmitter();

    constructor(public fb: FormBuilder, protected toastr: ToastsManager, vcr: ViewContainerRef, protected cd: ChangeDetectorRef,
                protected appService: GenericAppService, protected cdocSearchFormUtils: CommonDocSearchFormUtils,
                protected searchFormUtils: SearchFormUtils, protected cdocDataService: D,
                protected contentUtils: CommonDocContentUtils) {
        super(cd);
        this.toastr.setRootViewContainerRef(vcr);
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
        return DateUtils.dateToLocalISOString(value);
    }

    recommendName(): void {
        let name = '';

        this.setValue('name', name);
    }

    submitSave(event: Event, backToSearch: boolean): boolean {
        const values = this.editFormGroup.getRawValue();

        this.prepareSubmitValues(values);
        if (!this.validateSubmitValues(values)) {
            return false;
        }

        if (backToSearch) {
            this.saveAndSearch.emit(values);
        } else {
            this.save.emit(values);
        }

        return false;
    }

    protected getComponentConfig(config: {}): CommonDocEditformComponentConfig {
        let prefix = '';
        let suggestionConfig = [];
        if (BeanUtils.getValue(config, 'components.cdoc-keywords.keywordSuggestions')) {
            suggestionConfig = BeanUtils.getValue(config, 'components.cdoc-keywords.keywordSuggestions');
            prefix = BeanUtils.getValue(config, 'components.cdoc-keywords.editPrefix');
        }

        return {
            suggestionConfigs: suggestionConfig,
            editPrefix: prefix,
            numBeanFieldConfig: {
            },
            stringBeanFieldConfig: {
                'subtype': {},
            },
            stringArrayBeanFieldConfig: {
                'playlists': {},
            },
            inputSuggestionValueConfig: {
            },
            optionsSelect: {'playlists': [],
                'subType': []
            }
        };
    }

    protected configureComponent(config: {}): void {
        const componentConfig = this.getComponentConfig(config);

        this.suggestionConfigs = componentConfig.suggestionConfigs;
        this.editPrefix = componentConfig.editPrefix;
        this.numBeanFieldConfig = componentConfig.numBeanFieldConfig;
        this.stringBeanFieldConfig = componentConfig.stringBeanFieldConfig;
        this.stringArrayBeanFieldConfig = componentConfig.stringArrayBeanFieldConfig;
        this.inputSuggestionValueConfig = componentConfig.inputSuggestionValueConfig;
        this.optionsSelect = componentConfig.optionsSelect;
    }

    protected prepareSubmitValues(values: {}): void {
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
    }

    protected validateSubmitValues(values: R): boolean {
        const schemaErrors: SchemaValidationError[] = this.validateSchema(values);
        if (schemaErrors !== undefined && schemaErrors.length > 0) {
            let msg = '';
            schemaErrors.map((value: SchemaValidationError, index, array) => {
                msg += '- ' + value.path + ':' + value.expected + '<br>';
            });
            console.warn('warning while schema-validating values' + msg, values);
            this.toastr.warning('Leider passen nicht alle Eingaben - Fehler:' + msg, 'Oje!');
            return false;
        }

        const errors: string[] = this.validateValues(values);
        if (errors !== undefined && errors.length > 0) {
            let msg = '';
            errors.map((value: string, index, array) => {
                msg += '- ' + value + '<br>';
            });
            console.warn('warning while validation values' + msg, values);
            this.toastr.warning('Leider passen nicht alle Eingaben - Fehler:' + msg, 'Oje!');
            return false;
        }

        return true;
    }

    protected abstract validateSchema(record: R): SchemaValidationError[];

    protected abstract validateValues(record: R): string[];

    protected updateData(): void {
        if (this.record === undefined) {
            return;
        }

        this.config = this.appService.getAppConfig();
        this.configureComponent(this.config);

        const formValueConfig = this.createDefaultFormValueConfig(this.record);
        const fields = this.record.toJSON();
        for (const key in fields) {
            if (fields.hasOwnProperty(key) && !formValueConfig.hasOwnProperty(key)) {
                formValueConfig[key] = [fields[key]];
            }
        }

        this.createSelectOptions(this.stringBeanFieldConfig, formValueConfig, this.optionsSelect);
        this.createSelectOptions(this.numBeanFieldConfig, formValueConfig, this.optionsSelect);
        this.createSelectOptions(this.stringArrayBeanFieldConfig, formValueConfig, this.optionsSelect);
        this.postProcessFormValueConfig(this.record, formValueConfig);

        this.editFormGroup = this.fb.group(formValueConfig);

        this.updateFormComponents();

        this.fillFacets(this.record);
    }

    protected createDefaultFormValueConfig(record: R): {} {
        return {
            dateshow: [DateUtils.dateToLocalISOString(record.dateshow)],
        };
    }

    protected postProcessFormValueConfig(record: R, formValueConfig: {}): void {
    }

    protected updateFormComponents(): void {
        this.updateKeywordSuggestions();
    }

    protected fillFacets(record: R): void {
        const me = this;
        const searchForm = this.cdocDataService.newSearchForm({type: record.type});
        this.cdocDataService.search(searchForm,
            {
                showFacets: true, // []
                loadTrack: false,
                showForm: false
            }).then(function doneSearch(cdocSearchResult: S) {
            me.updateOptionValues(cdocSearchResult);
            me.updateSuggestionValues(cdocSearchResult);
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

    protected updateOptionValues(cdocSearchResult: S): boolean {
        const me = this;

        if (cdocSearchResult !== undefined) {
            const rawValues = this.editFormGroup.getRawValue();
            // console.log('update searchResult', cdocSearchResult);
            me.optionsSelect['playlists'] = me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                me.cdocSearchFormUtils.getPlaylistValues(cdocSearchResult), true, [], true);
        } else {
            // console.log('empty searchResult', cdocSearchResult);
            me.optionsSelect['playlists'] = me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList([], true, [], true);
        }

        return true;
    }

    protected updateSuggestionValues(cdocSearchResult: S): boolean {
        for (const suggestionName in this.inputSuggestionValueConfig) {
            const suggestionConfig = this.inputSuggestionValueConfig[suggestionName];
            const values = [];
            if (suggestionConfig.facetName) {
                if (cdocSearchResult !== undefined && cdocSearchResult.facets !== undefined && cdocSearchResult.facets.facets.size > 0) {
                    const facets = this.searchFormUtils.getFacetValues(cdocSearchResult, suggestionConfig.facetName, '', '');
                    for (const value of facets) {
                        values.push(value[1]);
                    }
                }
            }

            this.inputSuggestionValues[suggestionName.replace('.', '_')] = values;
        }

        return true;
    }

    protected updateKeywordSuggestions(): boolean {
        if (this.suggestionConfigs.length > 0) {
            this.keywordSuggestions = this.contentUtils.getSuggestedKeywords(this.suggestionConfigs, this.editPrefix,
                this.editFormGroup.getRawValue());
            this.cd.markForCheck();
        } else {
            console.warn('no valid keywordSuggestions found');
            this.keywordSuggestions = [];
        }

        return true;
    }

    protected createSelectOptions(definitions: {}, values: {}, optionsSelect: {}): void {
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
