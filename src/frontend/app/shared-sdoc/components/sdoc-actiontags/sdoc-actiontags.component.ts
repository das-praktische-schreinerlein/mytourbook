import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, SimpleChange} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import {ItemData, SDocContentUtils} from '../../services/sdoc-contentutils.service';
import {BaseEntityRecord} from '../../../../shared/search-commons/model/records/base-entity-record';
import {AppState, GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {ActionTag, ActionTagConfig, ActionTagUtils} from '../../../../shared/commons/utils/actiontag.utils';
import {SDocAlbumService} from '../../services/sdoc-album.service';
import {BeanUtils} from '../../../../shared/commons/utils/bean.utils';

export interface ActionTagEvent {
    record: BaseEntityRecord;
    result: BaseEntityRecord;
    config: ActionTagConfig;
    set: boolean;
    processed: boolean;
    error: any;
}

@Component({
    selector: 'app-sdoc-actiontags',
    templateUrl: './sdoc-actiontags.component.html',
    styleUrls: ['./sdoc-actiontags.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocActionTagsComponent implements OnInit, OnChanges {
    item: ItemData = {
        currentRecord: undefined,
        styleClassFor: undefined,
        thumbnailUrl: undefined,
        previewUrl: undefined,
        fullUrl: undefined,
        image: undefined,
        video: undefined,
        urlShow: undefined
    };

    tagConfigs: ActionTagConfig[] = [];
    tags: ActionTag[] = [];
    styleClass = '';
    toggleClass = 'hideInactive';

    private config;

    @Input()
    public record: SDocRecord;

    @Input()
    public type?: string;

    @Input()
    public actionTagEvent: EventEmitter<ActionTagEvent>;

    constructor(private appService: GenericAppService, private contentUtils: SDocContentUtils, private sdocAlbumService: SDocAlbumService) {
    }

    ngOnInit() {
        this.appService.getAppState().subscribe(appState => {
            if (appState === AppState.Ready) {
                this.config = this.appService.getAppConfig();
                if (BeanUtils.getValue(this.config, 'components.sdoc-actions.actionTags')) {
                    this.tagConfigs = this.config['components']['sdoc-actions']['actionTags'];
                } else {
                    console.warn('no valid tagConfigs found');
                    this.tagConfigs = [];
                }

                this.updateData();
            }
        });
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            this.updateData();
        }
    }

    public setTag(tag: ActionTag): boolean {
        this.actionTagEvent.emit({ config: tag.config, set: true, record: this.record, processed: false, error: undefined,
            result: undefined });
        return false;
    }

    public unsetTag(tag: ActionTag): boolean {
        this.actionTagEvent.emit({ config: tag.config, set: false, record: this.record, processed: false, error: undefined,
            result: undefined });
        return false;
    }

    public hideInactive(): void {
        if (this.tags.length > 4) {
            this.toggleClass = 'hideInactive';
        } else {
            this.toggleClass = 'showInactive';
        }
    }

    public showInactive(): void {
        this.toggleClass = 'showInactive';
    }

    private updateData() {
        this.contentUtils.updateItemData(this.item, this.record, 'default');
        if (this.record === undefined) {
            this.tags = [];
        } else {
            this.sdocAlbumService.initAlbenForSDocId(this.item.currentRecord);
            this.tags = ActionTagUtils.generateTags(this.tagConfigs, this.item.currentRecord, this.config);
        }

        this.hideInactive();

        if (this.type === 'actionTagsBig') {
            this.styleClass = 'btn-navigation';
        } else {
            this.styleClass = '';
        }
    }
}
