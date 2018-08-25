import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Layout} from '../../../angular-commons/services/layout.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AppState, GenericAppService} from '../../../commons/services/generic-app.service';
import {BeanUtils} from '../../../commons/utils/bean.utils';
import {CommonDocSearchResult} from '../../../search-commons/model/container/cdoc-searchresult';
import {CommonDocSearchForm} from '../../../search-commons/model/forms/cdoc-searchform';
import {CommonDocRecord} from '../../../search-commons/model/records/cdoc-entity-record';
import {AbstractInlineComponent} from '../../../angular-commons/components/inline.component';

@Component({
    selector: 'app-cdoc-list-header',
    templateUrl: './cdoc-list-header.component.html',
    styleUrls: ['./cdoc-list-header.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonDocListHeaderComponent extends AbstractInlineComponent implements OnInit {
    autoPlayAllowed = false;
    public Layout = Layout;

    @Input()
    public availableLayouts?: Layout[] = [Layout.THIN, Layout.FLAT, Layout.SMALL, Layout.BIG, Layout.PAGE];

    @Input()
    public availableSorts?: string[] = ['relevance', 'location', 'date', 'dateAsc', 'ratePers', 'distance',
        'dataTechDurDesc', 'dataTechAltDesc', 'dataTechMaxDesc', 'dataTechDistDesc',
        'dataTechDurAsc', 'dataTechAltAsc', 'dataTechMaxAsc', 'dataTechDistAsc'];

    @Input()
    public availablePerPage?: number[] = [1, 10, 20, 50];

    @Input()
    public searchResult: CommonDocSearchResult<CommonDocRecord, CommonDocSearchForm>;

    @Input()
    public perPage: number;

    @Input()
    public sort: string;

    @Input()
    public layout: Layout;

    @Input()
    public showAutoplay? = false;

    @Input()
    public pauseAutoplay? = false;

    @Output()
    public pageChange: EventEmitter<number> = new EventEmitter();

    @Output()
    public perPageChange: EventEmitter<number> = new EventEmitter();

    @Output()
    public sortChange: EventEmitter<string> = new EventEmitter();

    @Output()
    public layoutChange: EventEmitter<Layout> = new EventEmitter();

    public headerFormGroup: FormGroup = this.fb.group({
        sort: 'relevance',
        perPage: 10,
        layout: Layout.FLAT
    });

    constructor(public fb: FormBuilder, private appService: GenericAppService, protected cd: ChangeDetectorRef) {
        super(cd);
    }

    ngOnInit() {
        this.appService.getAppState().subscribe(appState => {
            if (appState === AppState.Ready) {
                const config = this.appService.getAppConfig();
                this.configureComponent(config);
            }
        });
        this.headerFormGroup = this.fb.group({
            sort: this.sort,
            perPage: this.perPage,
            layout: this.layout
        });
    }

    onShowIntervalNext(): boolean {
        if (this.pauseAutoplay) {
            return false;
        }

        let page = this.searchResult.searchForm.pageNum + 1;
        if (page < 1) {
            page = 1;
        }
        if (page >= this.searchResult.recordCount) {
            page = 1;
        }
        this.onPageChange(page);

        return false;
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

    protected configureComponent(config: {}): void {
        if (BeanUtils.getValue(config, 'permissions.allowAutoPlay') &&
            BeanUtils.getValue(config, 'components.cdoc-listheader.allowAutoplay') + '' === 'true') {
            this.autoPlayAllowed = this.showAutoplay;
        }
    }

    protected updateData(): void {
        const facets = this.searchResult.facets;
        if (facets !== undefined && facets.facets.get('sorts') !== undefined) {
            this.availableSorts = facets.facets.get('sorts').facet.map(facet => {
                return facet[0];
            });
            this.availableSorts.sort();
        }
    }
}
