import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SDocSearchResult} from '../../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {Layout} from '../sdoc-list/sdoc-list.component';
import {FormBuilder} from '@angular/forms';

@Component({
    selector: 'app-sdoc-list-header',
    templateUrl: './sdoc-list-header.component.html',
    styleUrls: ['./sdoc-list-header.component.css']
})
export class SDocListHeaderComponent implements OnInit {

    public Layout = Layout;

    @Input()
    public availableLayouts?: Layout[] = [Layout.THIN, Layout.FLAT, Layout.SMALL, Layout.BIG, Layout.PAGE];

    @Input()
    public availableSorts?: string[] = ['relevance', 'location', 'date', 'ratePers', 'distance',
        'dataTechDurDesc', 'dataTechAltDesc', 'dataTechMaxDesc', 'dataTechDistDesc',
        'dataTechDurAsc', 'dataTechAltAsc', 'dataTechMaxAsc', 'dataTechDistAsc'];

    @Input()
    public availablePerPage?: number[] = [1, 10, 20, 50];

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

    ngOnInit() {
        this.headerFormGroup = this.fb.group({
            sort: this.sort,
            perPage: this.perPage,
            layout: this.layout
        });
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
