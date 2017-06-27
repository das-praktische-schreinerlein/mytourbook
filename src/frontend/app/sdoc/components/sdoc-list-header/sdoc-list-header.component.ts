import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SDocSearchResult} from '../../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {Layout} from '../sdoc-list/sdoc-list.component';
import {FormBuilder} from '@angular/forms';

@Component({
    selector: 'app-sdoc-list-header',
    templateUrl: './sdoc-list-header.component.html',
    styleUrls: ['./sdoc-list-header.component.css']
})
export class SDocListHeaderComponent {

    public Layout = Layout;

    @Input()
    public searchResult: SDocSearchResult;

    @Input()
    public perPage: number;

    @Input()
    public sort: string;

    @Input()
    public layout: Layout;

    @Output()
    public pageChange: EventEmitter<number> = new EventEmitter();

    @Output()
    public perPageChange: EventEmitter<number> = new EventEmitter();

    @Output()
    public sortChange: EventEmitter<string> = new EventEmitter();

    @Output()
    public layoutChange: EventEmitter<Layout> = new EventEmitter();

    public headerFormGroup = this.fb.group({
        sort: 'relevance',
        perPage: 10,
        layout: Layout.FLAT
    });

    constructor(public fb: FormBuilder) {
    }

    onPageChange(page: number) {
        this.pageChange.emit(page);
    }

    onPerPageChange() {
        this.perPageChange.emit(this.headerFormGroup.getRawValue()['perPage']);
    }

    onSortChange() {
        this.sortChange.emit(this.headerFormGroup.getRawValue()['sort']);
    }

    onLayoutChange() {
        this.layoutChange.emit(this.headerFormGroup.getRawValue()['layout']);
    }
}
