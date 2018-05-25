import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChange,
    ViewChild
} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {ItemData, SDocContentUtils} from '../../services/sdoc-contentutils.service';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';

@Component({
    selector: 'app-sdoc-videoplayer',
    templateUrl: './sdoc-videoplayer.component.html',
    styleUrls: ['./sdoc-videoplayer.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocVideoplayerComponent implements OnChanges {
    public contentUtils: SDocContentUtils;
    listItem: ItemData = {
        currentRecord: undefined,
        styleClassFor: undefined,
        thumbnailUrl: undefined,
        previewUrl: undefined,
        image: undefined,
        video: undefined,
        urlShow: undefined
    };
    maxWidth = 600;
    maxHeight = 800;
    maxFullWidth = 1200;
    maxFullHeight = 1200;

    @ViewChild('videoPlayer') videoplayer: any;

    @Input()
    public record: SDocRecord;

    @Input()
    public width: 300;

    @Input()
    public forceWidth = '';

    @Input()
    public styleClass: 'picture-small';

    @Input()
    public showFullScreenVideo = false;

    @Input()
    public showPreview = true;

    @Output()
    public show: EventEmitter<SDocRecord> = new EventEmitter();

    constructor(contentUtils: SDocContentUtils, private cd: ChangeDetectorRef) {
        this.contentUtils = contentUtils;
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            this.updateData();
        }
    }

    submitShow(sdoc: SDocRecord) {
        this.show.emit(sdoc);
        return false;
    }

    private updateData() {
        if (window) {
            this.maxWidth = Math.min(600, window.innerWidth - 100);
            this.maxHeight = Math.min(800, window.innerHeight - 80);
            this.maxFullWidth = Math.min(1200, window.innerWidth - 50);
            this.maxFullHeight = Math.min(1200, window.innerHeight - 80);
        }
        console.error("blimblam", this.forceWidth);
        this.contentUtils.updateItemData(this.listItem, this.record, 'default');
        this.cd.markForCheck();
    }
}