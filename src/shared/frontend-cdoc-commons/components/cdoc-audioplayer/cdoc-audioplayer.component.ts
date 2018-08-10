import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChange,
    ViewChild
} from '@angular/core';
import {CommonDocContentUtils, CommonItemData} from '../../services/cdoc-contentutils.service';
import {ComponentUtils} from '../../../angular-commons/services/component.utils';
import {CommonDocRecord} from '../../../search-commons/model/records/cdoc-entity-record';

@Component({
    selector: 'app-cdoc-audioplayer',
    templateUrl: './cdoc-audioplayer.component.html',
    styleUrls: ['./cdoc-audioplayer.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CDocAudioplayerComponent implements OnChanges {
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
        this.contentUtils = contentUtils;
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            this.updateData();
        }
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

    private updateData() {
        this.contentUtils.updateItemData(this.listItem, this.record, 'default');
        this.cd.markForCheck();
    }
}
