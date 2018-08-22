import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {SearchParameterUtils} from '../../../search-commons/services/searchparameter.utils';
import {SearchFormUtils} from '../../../angular-commons/services/searchform-utils.service';
import {Facet, Facets} from '../../../search-commons/model/container/facets';
import {CommonDocSearchResult} from '../../../search-commons/model/container/cdoc-searchresult';
import {CommonDocSearchForm} from '../../../search-commons/model/forms/cdoc-searchform';
import {CommonDocRecord} from '../../../search-commons/model/records/cdoc-entity-record';
import {AbstractInlineComponent} from '../../../angular-commons/components/inline.component';

export interface TimetableColumn {
    width: string;
    label: string;
    key: string;
    value: string;
    class: string;
    active: boolean;
}
@Component({
    selector: 'app-cdoc-timetable',
    templateUrl: './cdoc-timetable.component.html',
    styleUrls: ['./cdoc-timetable.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonDocTimetableComponent extends AbstractInlineComponent {
    columns: TimetableColumn[] = [];

    @Input()
    public searchResult: CommonDocSearchResult<CommonDocRecord, CommonDocSearchForm>;

    @Output()
    public columnClicked: EventEmitter<string> = new EventEmitter();

    constructor(private searchParameterUtils: SearchParameterUtils, private searchFormUtils: SearchFormUtils,
                protected cd: ChangeDetectorRef) {
        super(cd);
    }

    onColumnClicked(key: any) {
        this.columnClicked.emit(key);
        return false;
    }

    protected updateData(): void {
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
