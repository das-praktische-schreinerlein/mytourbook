import {Component, EventEmitter, Input, OnChanges, Output, SimpleChange} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {Layout} from '../sdoc-list/sdoc-list.component';
import {ItemData, SDocContentUtils} from '../../services/sdoc-contentutils.service';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';

@Component({
    selector: 'app-sdoc-list-item',
    templateUrl: './sdoc-list-item.component.html',
    styleUrls: ['./sdoc-list-item.component.css']
})
export class SDocListItemComponent implements OnChanges {
    public contentUtils: SDocContentUtils;
    listItem: ItemData = {
        currentRecord: undefined,
        styleClassFor: undefined,
        thumbnailUrl: undefined,
        previewUrl: undefined,
        image: undefined,
        urlShow: undefined
    };


    @Input()
    public record: SDocRecord;

    @Input()
    public backToSearchUrl: string;

    @Input()
    public layout: Layout;

    @Output()
    public show: EventEmitter<SDocRecord> = new EventEmitter();

    @Output()
    public showImage: EventEmitter<SDocRecord> = new EventEmitter();

    constructor(contentUtils: SDocContentUtils) {
        this.contentUtils = contentUtils;
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            this.updateData();
        }
    }

    public submitShow(sdoc: SDocRecord) {
        this.show.emit(sdoc);
        return false;
    }

    public submitShowImage(sdoc: SDocRecord) {
        this.showImage.emit(sdoc);
        return false;
    }


    private updateData() {
        this.contentUtils.updateItemData(this.listItem, this.record, 'default');
    }
}
