import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {PDocSearchForm} from '@dps/mycms-commons/dist/pdoc-commons/model/forms/pdoc-searchform';
import {PDocSearchResult} from '@dps/mycms-commons/dist/pdoc-commons/model/container/pdoc-searchresult';
import {Facets} from '@dps/mycms-commons/dist/search-commons/model/container/facets';
import {IMultiSelectOption, IMultiSelectTexts} from 'angular-2-dropdown-multiselect';
import {PDocSearchFormUtils} from '../../services/pdoc-searchform-utils.service';
import {DomSanitizer} from '@angular/platform-browser';
import {ToastrService} from 'ngx-toastr';
import {PDocDataCacheService} from '../../services/pdoc-datacache.service';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {PDocSearchFormConverter} from '../../services/pdoc-searchform-converter.service';
import {
    CommonDocSearchformComponent
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-searchform/cdoc-searchform.component';
import {PDocRecord} from '@dps/mycms-commons/dist/pdoc-commons/model/records/pdoc-record';
import {PDocDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.service';

@Component({
    selector: 'app-pdoc-searchform',
    templateUrl: './pdoc-searchform.component.html',
    styleUrls: ['./pdoc-searchform.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PDocSearchformComponent
    extends CommonDocSearchformComponent<PDocRecord, PDocSearchForm, PDocSearchResult, PDocDataService> {
    public optionsSelectKey: IMultiSelectOption[] = [];
    public optionsSelectLangkey: IMultiSelectOption[] = [];
    public optionsSelectSubType: IMultiSelectOption[] = [];
    public optionsSelectTheme: IMultiSelectOption[] = [];

    public settingsSelectKey = this.defaultSeLectSettings;
    public settingsSelectLangkey = this.defaultSeLectSettings;
    public settingsSelectSubType = this.defaultSeLectSettings;
    public settingsSelectTheme = this.defaultSeLectSettings;

    public textsSelectKey: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Key ausgewählt',
        checkedPlural: 'Key ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '',
        allSelected: 'alles'};
    public textsSelectLangkey: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Sprache ausgewählt',
        checkedPlural: 'Sprache ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '',
        allSelected: 'alles'};
    public textsSelectSubType: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Typ ausgewählt',
        checkedPlural: 'Typ ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '',
        allSelected: 'alles'};
    public textsSelectTheme: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Theme ausgewählt',
        checkedPlural: 'Theme ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '',
        allSelected: 'alles'};

    constructor(sanitizer: DomSanitizer, fb: FormBuilder, searchFormUtils: SearchFormUtils,
                private pdocSearchFormUtils: PDocSearchFormUtils, searchFormConverter: PDocSearchFormConverter,
                pdocDataCacheService: PDocDataCacheService, toastr: ToastrService, cd: ChangeDetectorRef) {
        super(sanitizer, fb, searchFormUtils, pdocSearchFormUtils, searchFormConverter, pdocDataCacheService, toastr, cd);
        this.defaultSeLectSettings.dynamicTitleMaxItems = 2;
    }

    protected createDefaultSearchResult(): PDocSearchResult {
        return new PDocSearchResult(new PDocSearchForm({}), 0, undefined, new Facets());
    }

    protected createDefaultFormGroup(): any {
        return this.fb.group({
            what: [],
            moreFilter: '',
            fulltext: '',
            subtype: [],
            type: [],

            key: [],
            langkey: [],
            theme: [],

            sort: '',
            perPage: 10,
            pageNum: 1
        });
    }


    protected updateFormGroup(pdocSearchSearchResult: PDocSearchResult): void {
        const values: PDocSearchForm = pdocSearchSearchResult.searchForm;
        this.searchFormGroup = this.fb.group({
            what: [(values.what ? values.what.split(/,/) : [])],
            fulltext: values.fulltext,
            moreFilter: values.moreFilter,
            subtype: [(values.subtype ? values.subtype.split(/,/) : [])],
            type: [(values.type ? values.type.split(/,/) : [])],

            key: [(values.key ? values.key.split(/,/) : [])],
            langkey: [(values.langkey ? values.langkey.split(/,/) : [])],
            theme: [(values.theme ? values.theme.split(/,/) : [])],
        });
    }

    protected updateSelectComponents(pdocSearchSearchResult: PDocSearchResult) {
        super.updateSelectComponents(pdocSearchSearchResult);
        const me = this;

        const rawValues = this.searchFormGroup.getRawValue();
        this.optionsSelectKey = this.searchFormUtils.moveSelectedToTop(
            this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                this.pdocSearchFormUtils.getKeyValues(pdocSearchSearchResult), true, [], true),
            rawValues['key']);
        this.optionsSelectLangkey = this.searchFormUtils.moveSelectedToTop(
            this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                this.pdocSearchFormUtils.getLangkeyValues(pdocSearchSearchResult), true, [], true),
            rawValues['langkey']);
        this.optionsSelectSubType = this.searchFormUtils.moveSelectedToTop(
            this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                this.pdocSearchFormUtils.getSubTypeValues(pdocSearchSearchResult), true, [], true)
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
        this.optionsSelectTheme = this.searchFormUtils.moveSelectedToTop(
            this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                this.pdocSearchFormUtils.getThemeValues(pdocSearchSearchResult), true, [], true),
            rawValues['theme']);
    }

    protected updateAvailabilityFlags(pdocSearchSearchResult: PDocSearchResult) {
    }

    protected beforeDoSearchPrepareValues(values: any) {
    }


    updateFormState(state?: boolean): void {
        if (state !== undefined) {
            this.showForm = this.showDetails = this.showFulltext = this.showMeta = this.showSpecialFilter = this.showWhat = state;
        } else {
            this.showForm = this.showDetails || this.showFulltext || this.showMeta || this.showSpecialFilter || this.showWhat;
        }

        this.changedShowForm.emit(this.showForm);
    }

}
