import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChange} from '@angular/core';
import {SDocSearchResult} from '../../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import {TimetableColumn} from '../sdoc-timetable/sdoc-timetable.component';
import {SDocSearchFormUtils} from '../../services/sdoc-searchform-utils.service';

export interface TypetableColumn extends TimetableColumn {}

@Component({
    selector: 'app-sdoc-typetable',
    templateUrl: './sdoc-typetable.component.html',
    styleUrls: ['./sdoc-typetable.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocTypetableComponent implements OnChanges {
    columns: TypetableColumn[] = [];

    @Input()
    public searchResult: SDocSearchResult;

    @Output()
    public columnClicked: EventEmitter<string> = new EventEmitter();

    constructor(private searchFormUtils: SDocSearchFormUtils) {
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            this.renderTypetable();
        }
    }

    onColumnClicked(key: any) {
        this.columnClicked.emit(key);
        return false;
    }

    private renderTypetable() {
        const result = [];
        const values = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            this.searchFormUtils.getTypeValues(this.searchResult), false, [], true)
            .sort(function (a, b) {
                return a.name.localeCompare(b.name);
            });

        const formValue = (this.searchResult.searchForm ? this.searchResult.searchForm.type : '');
        for (const value of values) {
            const column = {
                width: 100 / values.length + '%',
                value: value['count'],
                label: value.name,
                key: value.id,
                active: formValue && formValue.indexOf(value.id) >= 0
            };
            result.push(column);
        }

        this.columns = result;
    }
}