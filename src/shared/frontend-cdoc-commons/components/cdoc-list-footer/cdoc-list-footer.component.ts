import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonDocSearchResult} from '../../../search-commons/model/container/cdoc-searchresult';
import {CommonDocSearchForm} from '../../../search-commons/model/forms/cdoc-searchform';
import {CommonDocRecord} from '../../../search-commons/model/records/cdoc-entity-record';

@Component({
    selector: 'app-cdoc-list-footer',
    templateUrl: './cdoc-list-footer.component.html',
    styleUrls: ['./cdoc-list-footer.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CDocListFooterComponent {

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
