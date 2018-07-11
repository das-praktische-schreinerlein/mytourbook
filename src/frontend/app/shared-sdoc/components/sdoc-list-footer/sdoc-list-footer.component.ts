import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonDocSearchResult} from '../../../../shared/search-commons/model/container/cdoc-searchresult';
import {CommonDocSearchForm} from '../../../../shared/search-commons/model/forms/cdoc-searchform';
import {CommonDocRecord} from '../../../../shared/search-commons/model/records/cdoc-entity-record';

@Component({
    selector: 'app-sdoc-list-footer',
    templateUrl: './sdoc-list-footer.component.html',
    styleUrls: ['./sdoc-list-footer.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocListFooterComponent {

    @Input()
    public searchResult: CommonDocSearchResult<CommonDocRecord, CommonDocSearchForm>;

    @Output()
    public pageChange: EventEmitter<number> = new EventEmitter();

    constructor() {
    }

    onPageChange(page: number) {
        this.pageChange.emit(page);
    }
}
