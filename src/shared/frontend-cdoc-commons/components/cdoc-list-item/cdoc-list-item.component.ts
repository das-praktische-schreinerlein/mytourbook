import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChange
} from '@angular/core';
import {Layout, LayoutService, LayoutSize, LayoutSizeData} from '../../../angular-commons/services/layout.service';
import {CommonDocContentUtils, CommonItemData} from '../../../frontend-cdoc-commons/services/cdoc-contentutils.service';
import {ComponentUtils} from '../../../angular-commons/services/component.utils';
import {CommonDocRecord} from '../../../search-commons/model/records/cdoc-entity-record';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Component({
    selector: 'app-cdoc-list-item',
    templateUrl: './cdoc-list-item.component.html',
    styleUrls: ['./cdoc-list-item.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CDocListItemComponent implements OnChanges, OnDestroy {
    private layoutSizeObservable: BehaviorSubject<LayoutSizeData>;
    listLayoutName = 'default';
    listItem: CommonItemData = {
        currentRecord: undefined,
        styleClassFor: undefined,
        thumbnailUrl: undefined,
        previewUrl: undefined,
        fullUrl: undefined,
        image: undefined,
        video: undefined,
        urlShow: undefined
    };
    LayoutSize = LayoutSize;
    layoutSize = LayoutSize.BIG;

    public contentUtils: CommonDocContentUtils;

    @Input()
    public record: CommonDocRecord;

    @Input()
    public backToSearchUrl: string;

    @Input()
    public layout: Layout;

    @Input()
    public short? = false;

    @Output()
    public show: EventEmitter<CommonDocRecord> = new EventEmitter();

    @Output()
    public showImage: EventEmitter<CommonDocRecord> = new EventEmitter();

    constructor(contentUtils: CommonDocContentUtils, protected cd: ChangeDetectorRef,
        protected layoutService: LayoutService) {
        this.contentUtils = contentUtils;
        this.layoutSizeObservable = this.layoutService.getLayoutSizeData();
        this.layoutSizeObservable.subscribe(layoutSizeData => {
            this.layoutSize = layoutSizeData.layoutSize;
            this.cd.markForCheck();
        });
    }

    ngOnDestroy() {
        // this.layoutSizeObservable.unsubscribe();
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            this.updateData();
        }
    }

    public submitShow(sdoc: CommonDocRecord) {
        this.show.emit(sdoc);
        return false;
    }

    public submitShowImage(sdoc: CommonDocRecord) {
        this.showImage.emit(sdoc);
        return false;
    }

    protected updateData() {
        this.contentUtils.updateItemData(this.listItem, this.record, this.listLayoutName);
        this.cd.markForCheck();
    }
}
