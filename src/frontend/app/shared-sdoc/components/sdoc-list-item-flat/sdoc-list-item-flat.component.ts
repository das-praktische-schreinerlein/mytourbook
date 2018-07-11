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
import {Layout} from '../sdoc-list/sdoc-list.component';
import {CommonDocContentUtils, CommonItemData} from '../../services/cdoc-contentutils.service';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import {ActionTagEvent} from '../sdoc-actiontags/sdoc-actiontags.component';
import {LayoutService, LayoutSize, LayoutSizeData} from '../../../../shared/angular-commons/services/layout.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {CommonDocRecord} from '../../../../shared/search-commons/model/records/cdoc-entity-record';

@Component({
    selector: 'app-sdoc-list-item-flat',
    templateUrl: './sdoc-list-item-flat.component.html',
    styleUrls: ['./sdoc-list-item-flat.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocListItemFlatComponent implements OnChanges, OnDestroy {
    private layoutSizeObservable: BehaviorSubject<LayoutSizeData>;
    public contentUtils: CommonDocContentUtils;
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

    constructor(contentUtils: CommonDocContentUtils, private cd: ChangeDetectorRef, private layoutService: LayoutService) {
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

    public onActionTagEvent(event: ActionTagEvent) {
        if (event.result !== undefined) {
            this.record = <CommonDocRecord>event.result;
            this.updateData();
        }

        return false;
    }

    private updateData() {
        this.contentUtils.updateItemData(this.listItem, this.record, 'flat');
        this.cd.markForCheck();
    }
}
