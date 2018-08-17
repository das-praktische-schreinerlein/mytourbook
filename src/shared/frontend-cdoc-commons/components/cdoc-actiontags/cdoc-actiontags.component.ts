import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit} from '@angular/core';
import {BaseEntityRecord} from '../../../search-commons/model/records/base-entity-record';
import {AppState, GenericAppService} from '../../../commons/services/generic-app.service';
import {ActionTag, ActionTagConfig, ActionTagUtils} from '../../../commons/utils/actiontag.utils';
import {CommonDocAlbumService} from '../../services/cdoc-album.service';
import {BeanUtils} from '../../../commons/utils/bean.utils';
import {CommonDocContentUtils, CommonItemData} from '../../services/cdoc-contentutils.service';
import {AbstractInlineComponent} from '../../../angular-commons/components/inline.component';
import {CommonDocRecord} from '../../../search-commons/model/records/cdoc-entity-record';

export interface ActionTagEvent {
    record: BaseEntityRecord;
    result: BaseEntityRecord;
    config: ActionTagConfig;
    set: boolean;
    processed: boolean;
    error: any;
}

export interface CDocActionTagsComponentConfig {
    tagConfigs: ActionTagConfig[];
}

@Component({
    selector: 'app-cdoc-actiontags',
    templateUrl: './cdoc-actiontags.component.html',
    styleUrls: ['./cdoc-actiontags.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CDocActionTagsComponent extends AbstractInlineComponent implements OnInit {
    item: CommonItemData = {
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

    protected config;

    @Input()
    public record: CommonDocRecord;

    @Input()
    public type?: string;

    @Input()
    public actionTagEvent: EventEmitter<ActionTagEvent>;

    constructor(protected appService: GenericAppService, protected contentUtils: CommonDocContentUtils,
                protected cdocAlbumService: CommonDocAlbumService, protected cd: ChangeDetectorRef) {
        super(cd);
    }

    ngOnInit() {
        this.appService.getAppState().subscribe(appState => {
            if (appState === AppState.Ready) {
                this.config = this.appService.getAppConfig();
                this.configureComponent(this.config);
                this.updateData();
            }
        });
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

    protected getComponentConfig(config: {}): CDocActionTagsComponentConfig {
        if (BeanUtils.getValue(config, 'components.cdoc-actions.actionTags')) {
            return {
                tagConfigs: config['components']['cdoc-actions']['actionTags']
            };
        } else {
            console.warn('no valid tagConfigs found');
            return {
                tagConfigs: []
            };
        }
    }

    protected configureComponent(config: {}): void {
        const componentConfig = this.getComponentConfig(config);

        this.tagConfigs = componentConfig.tagConfigs;
    }

    protected updateData(): void {
        this.contentUtils.updateItemData(this.item, this.record, 'default');
        if (this.record === undefined) {
            this.tags = [];
        } else {
            this.cdocAlbumService.initAlbenForDocId(<CommonDocRecord>this.item.currentRecord);
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
