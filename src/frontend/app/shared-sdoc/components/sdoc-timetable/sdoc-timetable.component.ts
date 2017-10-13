import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChange} from '@angular/core';
import {SDocSearchResult} from '../../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {SearchParameterUtils} from '../../../../shared/search-commons/services/searchparameter.utils';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import {SearchFormUtils} from '../../../../shared/angular-commons/services/searchform-utils.service';

export interface TimetableColumn {
    width: string;
    label: string;
    key: string;
    value: string;
    class: string;
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

    constructor(private searchParameterUtils: SearchParameterUtils, private searchFormUtils: SearchFormUtils) {
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            this.renderTimetable();
        }
    }

    private renderTimetable() {
        const result = [];
        const values = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            this.searchParameterUtils.extractFacetValues(this.searchResult.facets, 'month_is', 'month', 'Monat'),
            false, [], true);
        for (const value of values) {
            const column = {
                width: values.length / 12 + '%',
                value: value['count'],
                label: value.name,
                key: value.id
            };
            result.push(column);
        }

        this.columns = result;
    }
}
