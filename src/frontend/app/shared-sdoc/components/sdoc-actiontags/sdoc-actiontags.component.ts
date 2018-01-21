import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, SimpleChange} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import {ItemData, SDocContentUtils} from '../../services/sdoc-contentutils.service';
import {BaseEntityRecord} from '../../../../shared/search-commons/model/records/base-entity-record';
import {AppState, GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {ActionTag, ActionTagConfig, ActionTagUtils} from '../../../../shared/commons/utils/actiontag.utils';

export interface ActionTagEvent {
    config: ActionTagConfig;
    record: BaseEntityRecord;
    set: boolean;
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
        image: undefined,
        urlShow: undefined
    };

    tagConfigs: ActionTagConfig[] = [];
    tags: ActionTag[] = [];
    styleClass = '';

    private config;

    @Input()
    public record: SDocRecord;

    @Input()
    public type?: string;

    @Input()
    public actionTagEvent: EventEmitter<ActionTagEvent>;

    constructor(private appService: GenericAppService, private contentUtils: SDocContentUtils) {
    }

    ngOnInit() {
        this.appService.getAppState().subscribe(appState => {
            if (appState === AppState.Ready) {
                this.config = this.appService.getAppConfig();
                if (this.config['components']
                    && this.config['components']['sdoc-actions']
                    && this.config['components']['sdoc-actions']['actionTags']) {
                    this.tagConfigs = this.config['components']['sdoc-actions']['actionTags'];
                } else {
                    console.error('no valid tagConfigs found');
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
        this.actionTagEvent.emit({ config: tag.config, set: true, record: this.record });
        return false;
    }

    public unsetTag(tag: ActionTag): boolean {
        this.actionTagEvent.emit({ config: tag.config, set: false, record: this.record });
        return false;
    }

    private updateData() {
        this.contentUtils.updateItemData(this.item, this.record, 'default');
        if (this.record === undefined) {
            this.tags = [];
        } else {
            this.tags = ActionTagUtils.generateTags(this.tagConfigs, this.item.currentRecord, this.config);
        }
        if (this.type === 'actionTagsBig') {
            this.styleClass = 'btn-navigation';
        } else {
            this.styleClass = '';
        }
    }
}
