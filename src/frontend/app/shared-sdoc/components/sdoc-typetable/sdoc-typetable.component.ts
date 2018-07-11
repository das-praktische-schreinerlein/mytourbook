import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChange} from '@angular/core';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import {TimetableColumn} from '../sdoc-timetable/sdoc-timetable.component';
import {SearchFormUtils} from '../../../../shared/angular-commons/services/searchform-utils.service';
import {CommonDocSearchFormUtils} from '../../services/cdoc-searchform-utils.service';
import {CommonDocRecord} from '../../../../shared/search-commons/model/records/cdoc-entity-record';
import {CommonDocSearchForm} from '../../../../shared/search-commons/model/forms/cdoc-searchform';
import {CommonDocSearchResult} from '../../../../shared/search-commons/model/container/cdoc-searchresult';

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
    public searchResult: CommonDocSearchResult<CommonDocRecord, CommonDocSearchForm>;

    @Output()
    public columnClicked: EventEmitter<string> = new EventEmitter();

    constructor(private searchFormUtils: SearchFormUtils, private cdocSearchFormUtils: CommonDocSearchFormUtils) {
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
            this.cdocSearchFormUtils.getTypeValues(this.searchResult), false, [], true)
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
