import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {SDocSearchForm} from '../../../model/forms/sdoc-searchform';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {SDocSearchResult} from '../../../model/container/sdoc-searchresult';
import {Facets} from '../../../model/container/facets';
import {IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts} from 'angular-2-dropdown-multiselect';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-sdoc-searchform',
    templateUrl: './sdoc-searchform.component.html',
    styleUrls: ['./sdoc-searchform.component.css']
})
export class SDocSearchformComponent implements OnInit {
    // initialize a private variable _searchForm, it's a BehaviorSubject
    private _searchResult = new BehaviorSubject<SDocSearchResult>(new SDocSearchResult(new SDocSearchForm({}), 0, undefined, new Facets()));

    public optionsSelectWhen: IMultiSelectOption[] = [];
    public optionsSelectWhere: IMultiSelectOption[] = [];
    public optionsSelectWhat: IMultiSelectOption[] = [];
    public optionsSelectType: IMultiSelectOption[] = [];

    public settingsSelectWhen: IMultiSelectSettings =
        {dynamicTitleMaxItems: 5,
            enableSearch: true,
            showUncheckAll: true};
    public settingsSelectWhere: IMultiSelectSettings =
        {dynamicTitleMaxItems: 5,
            enableSearch: true,
            showUncheckAll: true};
    public settingsSelectWhat: IMultiSelectSettings =
        {dynamicTitleMaxItems: 5,
            enableSearch: true,
            showUncheckAll: true};
    public settingsSelectType: IMultiSelectSettings =
        {dynamicTitleMaxItems: 5,
            enableSearch: false};

    public textsSelectWhen: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Zeit ausgewählt',
        checkedPlural: 'Zeiten ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: 'Zeiten',
        allSelected: 'Jederzeit'};
    public textsSelectWhere: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Region ausgewählt',
        checkedPlural: 'Regionen ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: 'Regionen',
        allSelected: 'Überall'};
    public textsSelectWhat: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Eigenschaft ausgewählt',
        checkedPlural: 'Eigenschaften ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: 'Eigenschaften',
        allSelected: 'alles'};
    public textsSelectType: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Typ ausgewählt',
        checkedPlural: 'Typen ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: 'Typen',
        allSelected: 'Alle'};

    @Input()
    public set searchResult(value: SDocSearchResult) {
        // set the latest value for _data BehaviorSubject
        this._searchResult.next(value);
    };

    public get searchResult(): SDocSearchResult {
        // get the latest value from _data BehaviorSubject
        return this._searchResult.getValue();
    }

    @Output()
    public search: EventEmitter<SDocSearchForm> = new EventEmitter();

    // empty default
    public searchFormGroup = this.fb.group({
        when: [],
        where: [],
        what: [],
        fulltext: '',
        type: [],
        sort: '',
        perPage: 10,
        pageNum: 1
    });

    constructor(public fb: FormBuilder, private translateService: TranslateService) {
    }

    ngOnInit() {
        this._searchResult.subscribe(
            sdocSearchSearchResult => {
                const values: SDocSearchForm = sdocSearchSearchResult.searchForm;
                this.searchFormGroup = this.fb.group({
                    when: [(values.when ? values.when.split(/,/) : [])],
                    what: [(values.what ? values.what.split(/,/) : [])],
                    where: [(values.where ? values.where.split(/,/) : [])],
                    fulltext: values.fulltext,
                    type: [(values.type ? values.type.split(/,/) : [])]
                });
                this.optionsSelectWhen = this.getIMultiSelectOptionsFromExtractedFacetValuesList(
                    this.getWhenValues(sdocSearchSearchResult), true, [], true);
                this.optionsSelectWhere = this.getIMultiSelectOptionsFromExtractedFacetValuesList(
                    this.getWhereValues(sdocSearchSearchResult), true, [], false);
                this.optionsSelectWhat = this.getIMultiSelectOptionsFromExtractedFacetValuesList(
                    this.getWhatValues(sdocSearchSearchResult), true, ['kw_'], true);
                this.optionsSelectType = this.getIMultiSelectOptionsFromExtractedFacetValuesList(
                    this.getTypeValues(sdocSearchSearchResult), true, [], true);
            },
        );
    }

    public getWhenValues(searchResult: SDocSearchResult): any[] {
        if (searchResult === undefined || searchResult.facets === undefined || searchResult.facets.facets.size === 0) {
            return [];
        }

        const values = [].concat(
            this.extractFacetValues(searchResult, 'month_is', 'month', 'Monat'),
            this.extractFacetValues(searchResult, 'week_is', 'week', 'Woche'));

        return values;
    }

    public getWhereValues(searchResult: SDocSearchResult): any[] {
        if (searchResult === undefined || searchResult.facets === undefined || searchResult.facets.facets.size === 0) {
            return [];
        }

        const values = [].concat(
            this.extractFacetValues(searchResult, 'loc_lochirarchie_txt', '', ''));

        return values;
    }

    public getWhatValues(searchResult: SDocSearchResult): any[] {
        if (searchResult === undefined || searchResult.facets === undefined || searchResult.facets.facets.size === 0) {
            return [];
        }

        const values = [].concat(
            this.extractFacetValues(searchResult, 'keywords_txt', '', ''));

        return values;
    }

    public getTypeValues(searchResult: SDocSearchResult): any[] {
        if (searchResult === undefined || searchResult.facets === undefined || searchResult.facets.facets.size === 0) {
            return [];
        }

        const values = [].concat(
            this.extractFacetValues(searchResult, 'type_txt', '', ''));

        return values;
    }

    public getIMultiSelectOptionsFromExtractedFacetValuesList(values: any[][], withCount: boolean,
                                                              removements: string[], translate: boolean): IMultiSelectOption[] {
        const me = this;
        return values.map(function (value) {
            let name: string = value[1];
            if (translate) {
                name = me.translateService.instant(name) || name;
            }
            if (removements && (Array.isArray(removements))) {
                for (const replacement of removements) {
                    name = name.replace(replacement, '');
                }
            }
            if (translate) {
                name = me.translateService.instant(name) || name;
            }
            let label = value[0] + name;
            if (translate) {
                label = me.translateService.instant(label) || label;
            }

            const result = {id: value[2] + value[1], name: label};
            if (withCount && value[3] > 0) {
                result.name += ' (' + value[3] + ')';
            }
            return result;
        });
    }

    extractFacetValues(searchResult: SDocSearchResult, facetName: string, valuePrefix: string, labelPrefix: string): any[] {
        const values = [];
        const facet = searchResult.facets.facets.get(facetName);
        if (facet !== undefined &&
            facet.facet !== undefined) {
            for (const idx in searchResult.facets.facets.get(facetName).facet) {
                const facetValue = searchResult.facets.facets.get(facetName).facet[idx];
                values.push([labelPrefix, facetValue[0], valuePrefix, facetValue[1]]);
            }
        }

        return values;
    }

    public onSubmitSearch(event: any) {
        this.search.emit(this.searchFormGroup.getRawValue());
        return false;
    }

    public onChangeSelect() {
        this.search.emit(this.searchFormGroup.getRawValue());
        return false;
    }

    public getIMultiSelectSettings1(value: {}): IMultiSelectSettings {
        return <IMultiSelectSettings>value;
    }

}
