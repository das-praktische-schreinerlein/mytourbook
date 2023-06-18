import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject} from '@angular/core';
import {PDocRecord, PDocRecordValidator} from '@dps/mycms-commons/dist/pdoc-commons/model/records/pdoc-record';
import {FormBuilder} from '@angular/forms';
import {PDocRecordSchema} from '@dps/mycms-commons/dist/pdoc-commons/model/schemas/pdoc-record-schema';
import {ToastrService} from 'ngx-toastr';
import {SchemaValidationError} from 'js-data';
import {IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts} from 'angular-2-dropdown-multiselect';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {PDocDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.service';
import {PDocSearchForm} from '@dps/mycms-commons/dist/pdoc-commons/model/forms/pdoc-searchform';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {PDocSearchResult} from '@dps/mycms-commons/dist/pdoc-commons/model/container/pdoc-searchresult';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {PDocContentUtils} from '../../../shared-pdoc/services/pdoc-contentutils.service';
import {
    CommonDocEditformComponent,
    CommonDocEditformComponentConfig
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-editform/cdoc-editform.component';
import {DOCUMENT} from '@angular/common';
import {PDocNameSuggesterService} from '../../services/pdoc-name-suggester.service';
import {Router} from '@angular/router';
import {Layout} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {
    CommonDocEditorCommandComponentConfig
} from '@dps/mycms-frontend-commons/dist/angular-commons/components/text-editor/text-editor.component';
import {PDocDescSuggesterService} from '../../services/pdoc-desc-suggester.service';
import {PDocSearchFormUtils} from '../../../shared-pdoc/services/pdoc-searchform-utils.service';
import {ObjectUtils} from '@dps/mycms-commons/dist/commons/utils/object.utils';

export interface PageDocEditformComponentConfig extends CommonDocEditformComponentConfig {
    editorCommands: CommonDocEditorCommandComponentConfig;
}

@Component({
    selector: 'app-pdoc-editform',
    templateUrl: './pdoc-editform.component.html',
    styleUrls: ['./pdoc-editform.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PDocEditformComponent extends CommonDocEditformComponent<PDocRecord, PDocSearchForm, PDocSearchResult,
    PDocDataService> {
    public Layout = Layout;
    public optionsSelect: {
        'pageId': IMultiSelectOption[];
        'flags': IMultiSelectOption[];
        'subType': IMultiSelectOption[];
        'langkeys': IMultiSelectOption[];
        'profiles': IMultiSelectOption[];
        'subSectionIds': IMultiSelectOption[];
        'subTypePageType': IMultiSelectOption[];
    };

    public settingsSelectPageType = this.defaultSelectSetting;
    public settingsSelectFlags: IMultiSelectSettings = {... this.defaultSelectSetting, selectionLimit: 9999};
    public settingsSelectLangkeys: IMultiSelectSettings = {... this.defaultSelectSetting, selectionLimit: 9999};
    public settingsSelectProfiles: IMultiSelectSettings = {... this.defaultSelectSetting, selectionLimit: 9999};
    public settingsSelectSubSectionIds: IMultiSelectSettings = {... this.defaultSelectSetting, selectionLimit: 9999};

    public textsSelectPageType: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Action ausgewählt',
        checkedPlural: 'Aktion ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '--',
        allSelected: 'alles'};

    public textsSelectFlags: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Flag ausgewählt',
        checkedPlural: 'Flags ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '--',
        allSelected: 'alles'};
    public textsSelectLangkeys: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Sprache ausgewählt',
        checkedPlural: 'Sprachen ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '--',
        allSelected: 'alles'};
    public textsSelectProfiles: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Profil ausgewählt',
        checkedPlural: 'Profile ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '--',
        allSelected: 'alles'};
    public textsSelectSubSectionIds: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Unterseite ausgewählt',
        checkedPlural: 'Unterseiten ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '--',
        allSelected: 'alles'};

    editorCommands: CommonDocEditorCommandComponentConfig = {
        singleCommands: [],
        rangeCommands: []
    };

    descMdRecommended  = '';

    constructor(public fb: FormBuilder, protected toastr: ToastrService, protected cd: ChangeDetectorRef,
                protected appService: GenericAppService, protected pdocSearchFormUtils: PDocSearchFormUtils,
                protected searchFormUtils: SearchFormUtils, protected pdocDataService: PDocDataService,
                public contentUtils: PDocContentUtils, @Inject(DOCUMENT) private document,
                protected pdocNameSuggesterService: PDocNameSuggesterService,
                protected pdocDescSuggesterService: PDocDescSuggesterService,
                router: Router) {
        super(fb, toastr, cd, appService, pdocSearchFormUtils, searchFormUtils, pdocDataService, contentUtils, router);
    }

    onInputChanged(value: any, field: string): boolean {
        return false;
    }

    recommendName(): void {
        this.pdocNameSuggesterService.suggest(
            this.editFormGroup.getRawValue(), {
                optionsSelectPageId: this.optionsSelect.pageId,
                optionsSelectSubTypePageType: this.optionsSelect.subTypePageType
            }
        ).then(name => {
            this.setValue('name', name);
        });
    }

    recommendDesc(): void {
        this.pdocDescSuggesterService.suggest(
            this.editFormGroup.getRawValue(), {}
        ).then(desc => {
            this.descMdRecommended = desc;
            this.cd.markForCheck();
        }).catch(reason => {
            this.descMdRecommended = undefined;
            this.cd.markForCheck();
        });
    }

    protected validateSchema(record: PDocRecord): SchemaValidationError[] {
        return PDocRecordSchema.validate(record);
    }

    protected validateValues(record: PDocRecord): string[] {
        let errors = [];

        return errors.concat(PDocRecordValidator.instance.validateValues(record));
    }

    protected getComponentConfig(config: {}): PageDocEditformComponentConfig {
        let prefix = '';
        let suggestionConfig = [];
        if (BeanUtils.getValue(config, 'components.pdoc-keywords.keywordSuggestions')) {
            suggestionConfig = BeanUtils.getValue(config, 'components.pdoc-keywords.keywordSuggestions');
            prefix = BeanUtils.getValue(config, 'components.pdoc-keywords.editPrefix');
        }

        const editorCommands: CommonDocEditorCommandComponentConfig = {
            rangeCommands: [],
            singleCommands: []
        };
        if (BeanUtils.getValue(config, 'components.pdoc-editor-commands.singleCommands')) {
            editorCommands.singleCommands = BeanUtils.getValue(config, 'components.pdoc-editor-commands.singleCommands');
        }
        if (BeanUtils.getValue(config, 'components.pdoc-editor-commands.rangeCommands')) {
            editorCommands.rangeCommands = BeanUtils.getValue(config, 'components.pdoc-editor-commands.rangeCommands');
        }

        const defaultConfig: PageDocEditformComponentConfig = {
            editorCommands: editorCommands,
            suggestionConfigs: suggestionConfig,
            editPrefix: prefix,
            numBeanFieldConfig: {
            },
            stringBeanFieldConfig: {
                'css': {},
                'heading': {},
                'image': {},
                'key': {},
                'subtype': {},
                'subTypePageType': {
                    labelPrefix: '',
                    values: ['SectionOverviewPage', 'SimplePage', 'SectionPage']
                },
                'teaser': {},
                'theme': {}
            },
            stringArrayBeanFieldConfig: {
                'flags': {
                    labelPrefix: '',
                    values: ['flg_ShowSearch', 'flg_ShowNews', 'flg_ShowTopTen', 'flg_ShowAdminArea', 'flg_ShowDashboard', 'flg_ShowStatisticBoard']
                },
                'langkeys': {
                    labelPrefix: '',
                    values: ['lang_de', 'lang_en']
                },
                'profiles': {
                    labelPrefix: '',
                    values: ['profile_dev', 'profile_import', 'profile_beta', 'profile_prod', 'profile_viewer']
                },
                'subSectionIds': {
                    labelPrefix: '',
                    values: []
                },
            },
            inputSuggestionValueConfig: {
            },
            optionsSelect: {
                'pageId': [],
                'subType': [],
                'flags': [],
                'langkeys': [],
                'profiles': [],
                'subSectionIds': [],
                'subTypePageType': []
            },
            modalEditOutletName: 'pdocmodaledit',
            modalShowOutletName: 'pdocmodalshow'
        };

        return defaultConfig;
    }

    protected configureComponent(config: {}): void {
        super.configureComponent(config);

        const componentConfig = this.getComponentConfig(config);
        this.editorCommands = componentConfig.editorCommands;
    }

    protected prepareSubmitValues(values: {}): void {
        return super.prepareSubmitValues(values);
    }

    protected createDefaultFormValueConfig(record: PDocRecord): {} {
        const valueConfig = {
            descMdRecommended: []
        };

        return valueConfig;
    }

    protected postProcessFormValueConfig(record: PDocRecord, formValueConfig: {}): void {
        if (formValueConfig['subtype'] && formValueConfig['subtype'].length > 0 && formValueConfig['subtype'][0]) {
            formValueConfig['subtype'][0] =
                (formValueConfig['subtype'][0]  + '')
                    .replace(/p_/g, '');
        }

        if (record.flags) {
            formValueConfig['flags'] = [ObjectUtils.uniqueArray(record.flags.replace(/ /g, '').split(','))];
        }
        if (record.profiles) {
            formValueConfig['profiles'] = [ObjectUtils.uniqueArray(record.profiles.replace(/ /g, '').split(','))];
        }
        if (record.langkeys) {
            formValueConfig['langkeys'] = [ObjectUtils.uniqueArray(record.langkeys.replace(/ /g, '').split(','))];
        }
        if (record.subSectionIds) {
            formValueConfig['subSectionIds'] = [ObjectUtils.uniqueArray(record.subSectionIds.replace(/ /g, '').split(','))];
        }
    }

    protected updateFormComponents(): void {
        super.updateFormComponents();
    }

    protected updateOptionValues(pdocSearchResult: PDocSearchResult): boolean {
        super.updateOptionValues(pdocSearchResult);
        const me = this;

        if (pdocSearchResult !== undefined) {
            const rawValues = this.editFormGroup.getRawValue();
            me.optionsSelect['subSectionIds'] = me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                me.pdocSearchFormUtils.getKeyValues(pdocSearchResult), true, [], false);
            // console.log('update searchResult', pdocSearchResult);
        } else {
            // console.log('empty searchResult', pdocSearchResult);
        }

        return true;
    }

    protected updateKeywordSuggestions(): boolean {
        super.updateKeywordSuggestions();

        return true;
    }

}
