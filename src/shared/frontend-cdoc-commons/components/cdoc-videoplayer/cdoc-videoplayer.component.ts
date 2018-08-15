import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {CommonDocContentUtils, CommonItemData} from '../../services/cdoc-contentutils.service';
import {CommonDocRecord} from '../../../search-commons/model/records/cdoc-entity-record';
import {AbstractInlineComponent} from '../../../angular-commons/components/inline.component';

@Component({
    selector: 'app-cdoc-videoplayer',
    templateUrl: './cdoc-videoplayer.component.html',
    styleUrls: ['./cdoc-videoplayer.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CDocVideoplayerComponent extends AbstractInlineComponent {
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
    maxWidth = 600;
    maxHeight = 800;
    maxFullWidth = 1200;
    maxFullHeight = 1200;

    @ViewChild('videoPlayer') videoplayer: any;

    @Input()
    public record: CommonDocRecord;

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
    public show: EventEmitter<CommonDocRecord> = new EventEmitter();

    constructor(contentUtils: CommonDocContentUtils, protected cd: ChangeDetectorRef) {
        super(cd);
        this.contentUtils = contentUtils;
    }

    submitShow(cdoc: CommonDocRecord) {
        this.show.emit(cdoc);
        return false;
    }

    protected updateData(): void {
        if (window) {
            this.maxWidth = Math.min(600, window.innerWidth - 100);
            this.maxHeight = Math.min(800, window.innerHeight - 80);
            this.maxFullWidth = Math.min(1200, window.innerWidth - 50);
            this.maxFullHeight = Math.min(1200, window.innerHeight - 80);
        }
        this.contentUtils.updateItemData(this.listItem, this.record, 'default');
        this.cd.markForCheck();
    }
}
