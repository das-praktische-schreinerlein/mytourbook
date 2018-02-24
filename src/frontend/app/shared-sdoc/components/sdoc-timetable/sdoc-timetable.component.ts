import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChange} from '@angular/core';
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
        const values = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            this.searchParameterUtils.extractFacetValues(this.searchResult.facets, 'month_is', 'month', 'Monat'),
            false, [], true);
        for (const value of values) {
            const column = {
                width: values.length / (values.length === 13 ? 13 : 12) + '%',
                value: value['count'],
                label: value.name,
                key: value.id
            };
            result.push(column);
        }

        this.columns = result;
    }
}
