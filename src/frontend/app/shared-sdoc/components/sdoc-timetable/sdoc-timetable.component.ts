import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChange} from '@angular/core';
import {SDocSearchResult} from '../../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {SearchParameterUtils} from '../../../../shared/search-commons/services/searchparameter.utils';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import {SearchFormUtils} from '../../../../shared/angular-commons/services/searchform-utils.service';
import {Facet, Facets} from '../../../../shared/search-commons/model/container/facets';

export interface TimetableColumn {
    width: string;
    label: string;
    key: string;
    value: string;
    class: string;
    active: boolean;
}
@Component({
    selector: 'app-sdoc-timetable',
    templateUrl: './sdoc-timetable.component.html',
    styleUrls: ['./sdoc-timetable.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocTimetableComponent implements OnChanges {
    columns: TimetableColumn[] = [];

    @Input()
    public searchResult: SDocSearchResult;

    @Output()
    public columnClicked: EventEmitter<string> = new EventEmitter();

    constructor(private searchParameterUtils: SearchParameterUtils, private searchFormUtils: SearchFormUtils) {
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            this.renderTimetable();
        }
    }

    onColumnClicked(key: any) {
        this.columnClicked.emit(key);
        return false;
    }

    private renderTimetable() {
        const result = [];
        const facetName = 'month_is';
        const origFacet = this.searchResult.facets.facets.get(facetName);
        if (origFacet === undefined || origFacet.facet === undefined) {
            this.columns = [];
            return;
        }

        // copy facets
        const keys = {};
        for (const idx in origFacet.facet) {
            const facetValue = origFacet.facet[idx];
            if (facetValue[0] === undefined || facetValue[0].toString().length <= 0) {
                continue;
            }
            if (facetValue[0] === null || facetValue[0] === 'null') {
                facetValue[0] = 0;
            }
            keys[facetValue[0]] = facetValue;
        }

        // fill month
        for (let i = 1; i <= 12; i++) {
            const key = '' + i;
            if (keys[key] === undefined) {
                keys[key] = [key, 0];
            }
        }

        // sort
        const timeValues = [];
        for (const idx in keys) {
            timeValues.push(keys[idx]);
        }
        timeValues.sort((a, b) => {
            const nameA = parseInt(a[0], 10);
            const nameB = parseInt(b[0], 10);
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });

        // create new timefacet
        const timeFacets = new Facets();
        const timeFacet = new Facet();
        timeFacet.facet = timeValues;
        timeFacets.facets.set(facetName, timeFacet);

        const values = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            this.searchParameterUtils.extractFacetValues(timeFacets, facetName, 'month', 'Monat'),
            false, [], true);
        for (const value of values) {
            const column = {
                width: 100 / values.length + '%',
                value: value['count'],
                label: value.name,
                key: value.id
            };
            result.push(column);
        }

        this.columns = result;
    }
}
