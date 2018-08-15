import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {CommonDocContentUtils, CommonItemData} from '../../services/cdoc-contentutils.service';
import {CommonDocRecord} from '../../../search-commons/model/records/cdoc-entity-record';
import {AbstractInlineComponent} from '../../../angular-commons/components/inline.component';

@Component({
    selector: 'app-cdoc-audioplayer',
    templateUrl: './cdoc-audioplayer.component.html',
    styleUrls: ['./cdoc-audioplayer.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CDocAudioplayerComponent extends AbstractInlineComponent {
    public contentUtils: CommonDocContentUtils;
    listItem: CommonItemData = {
        currentRecord: undefined,
        styleClassFor: undefined,
        thumbnailUrl: undefined,
        previewUrl: undefined,
        fullUrl: undefined,
        audio: undefined,
        image: undefined,
        video: undefined,
        urlShow: undefined
    };

    @ViewChild('audioPlayer') audioplayer: any;

    @Input()
    public record: CommonDocRecord;

    @Input()
    public width: 150;

    @Input()
    public styleClass: 'picture-small';

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

    startPlaying() {
        const audios = document.querySelectorAll('audio');
        for (let i = 0; i < audios.length; i++) {
            const audio = audios[i];
            if (audio.getAttribute('mediaid') !== this.listItem.currentRecord.id) {
                audio.pause();
            }
        }
    }

    protected updateData(): void {
        this.contentUtils.updateItemData(this.listItem, this.record, 'default');
        this.cd.markForCheck();
    }
}
