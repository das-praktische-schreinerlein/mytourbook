import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange} from '@angular/core';
import {SDocSearchResult} from '../../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {Layout} from '../sdoc-list/sdoc-list.component';
import {FormBuilder} from '@angular/forms';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';

@Component({
    selector: 'app-sdoc-list-header',
    templateUrl: './sdoc-list-header.component.html',
    styleUrls: ['./sdoc-list-header.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocListHeaderComponent implements OnInit, OnChanges {

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

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            const facets = this.searchResult.facets;
            if (facets !== undefined && facets.facets.get('sorts') !== undefined) {
                this.availableSorts = facets.facets.get('sorts').facet.map(facet => {
                    return facet[0];
                });
            }
        }
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
