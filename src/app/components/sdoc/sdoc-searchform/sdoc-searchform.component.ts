import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {SDocSearchForm} from '../../../model/forms/sdoc-searchform';
import {BehaviorSubject} from 'rxjs';
import {SDocSearchResult} from '../../../model/container/sdoc-searchresult';
import {Facets} from '../../../model/container/facets';

@Component({
    selector: 'app-sdoc-searchform',
    templateUrl: './sdoc-searchform.component.html',
    styleUrls: ['./sdoc-searchform.component.css']
})
export class SDocSearchformComponent implements OnInit {
    // initialize a private variable _searchForm, it's a BehaviorSubject
    private _searchResult = new BehaviorSubject<SDocSearchResult>(new SDocSearchResult(new SDocSearchForm({}), 0, undefined, new Facets()));

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
    search: EventEmitter<SDocSearchForm> = new EventEmitter();

    // empty default
    searchFormGroup = this.fb.group({
        when: '',
        where: '',
        what: '',
        fulltext: '',
        type: [],
        sort: '',
        perPage: 10,
        pageNum: 1
    });

    constructor(public fb: FormBuilder) {
    }

    ngOnInit() {
        this._searchResult.subscribe(
            sdocSearchSearchResult => {
                const values: SDocSearchForm = sdocSearchSearchResult.searchForm;
                this.searchFormGroup = this.fb.group({
                    when: values.when,
                    what: values.what,
                    where: values.where,
                    fulltext: values.fulltext,
                    type: [(values.type ? values.type.split(/,/) : [])]
                });
            },
        );
    }

    getWhenValues(searchResult: SDocSearchResult): any[] {
        if (searchResult === undefined || searchResult.facets === undefined || searchResult.facets.facets.size === 0) {
            return [];
        }

        const values = [].concat(
            this.extractFacetValues(searchResult, 'month_is', 'month', 'Monat'),
            this.extractFacetValues(searchResult, 'week_is', 'week', 'Woche'));

        return values;
    }

    getWhereValues(searchResult: SDocSearchResult): any[] {
        if (searchResult === undefined || searchResult.facets === undefined || searchResult.facets.facets.size === 0) {
            return [];
        }

        const values = [].concat(
            this.extractFacetValues(searchResult, 'loc_lochirarchie_txt', '', ''));

        return values;
    }

    getWhatValues(searchResult: SDocSearchResult): any[] {
        if (searchResult === undefined || searchResult.facets === undefined || searchResult.facets.facets.size === 0) {
            return [];
        }

        const values = [].concat(
            this.extractFacetValues(searchResult, 'keywords_txt', '', ''));

        return values;
    }

    getTypeValues(searchResult: SDocSearchResult): any[] {
        if (searchResult === undefined || searchResult.facets === undefined || searchResult.facets.facets.size === 0) {
            return [];
        }

        const values = [].concat(
            this.extractFacetValues(searchResult, 'type_txt', '', ''));

        return values;
    }

    getSelectValuesFromExtractedFacetValuesList(values: any): string[] {
        return values.map(function (value) { return value[2] + value[1]; });
    }

    getSelectTextsFromExtractedFacetValuesList(values: any): string[] {
        return values.map(function (value) { return value[0] + value[1]; });
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

    submitSearch() {
        this.search.emit(this.searchFormGroup.getRawValue());
        return false;
    }
}
