import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {SDocSearchForm} from '../../../model/forms/sdoc-searchform';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {SDocSearchResult} from '../../../model/container/sdoc-searchresult';
import {Facets} from '../../../model/container/facets';
import {IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts} from 'angular-2-dropdown-multiselect';
import {SDocSearchFormUtils} from '../../../services/sdoc-searchform-utils.service';

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
        nearby: '',
        what: [],
        fulltext: '',
        type: [],
        sort: '',
        perPage: 10,
        pageNum: 1
    });

    constructor(public fb: FormBuilder, private searchFormUtils: SDocSearchFormUtils) {
    }

    ngOnInit() {
        this._searchResult.subscribe(
            sdocSearchSearchResult => {
                const values: SDocSearchForm = sdocSearchSearchResult.searchForm;
                this.searchFormGroup = this.fb.group({
                    when: [(values.when ? values.when.split(/,/) : [])],
                    what: [(values.what ? values.what.split(/,/) : [])],
                    where: [(values.where ? values.where.split(/,/) : [])],
                    nearby: values.nearby,
                    fulltext: values.fulltext,
                    type: [(values.type ? values.type.split(/,/) : [])]
                });
                this.optionsSelectWhen = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                    this.searchFormUtils.getWhenValues(sdocSearchSearchResult), true, [], true);
                this.optionsSelectWhere = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                    this.searchFormUtils.getWhereValues(sdocSearchSearchResult), true, [], false);
                this.optionsSelectWhat = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                    this.searchFormUtils.getWhatValues(sdocSearchSearchResult), true, ['kw_'], true);
                this.optionsSelectType = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                    this.searchFormUtils.getTypeValues(sdocSearchSearchResult), true, [], true);
            },
        );
    }


    public onSubmitSearch(event: any) {
        this.search.emit(this.searchFormGroup.getRawValue());
        return false;
    }

    public onChangeSelect() {
        this.search.emit(this.searchFormGroup.getRawValue());
        return false;
    }

}
