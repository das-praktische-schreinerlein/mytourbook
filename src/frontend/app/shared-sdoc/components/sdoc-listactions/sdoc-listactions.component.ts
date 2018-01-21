import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, SimpleChange} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import {SDocRoutingService} from '../../services/sdoc-routing.service';
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
    selector: 'app-sdoc-listactions',
    templateUrl: './sdoc-listactions.component.html',
    styleUrls: ['./sdoc-listactions.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocListActionsComponent implements OnInit, OnChanges {
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

    constructor(private appService: GenericAppService, private sanitizer: DomSanitizer, private commonRoutingService: CommonRoutingService,
                private sdocRoutingService: SDocRoutingService, private contentUtils: SDocContentUtils) {
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

    public submitShow(): boolean {
        this.commonRoutingService.navigateByUrl(this.getUrl(this.item.currentRecord));
        return false;
    }

    public getShowUrl(): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(this.getUrl(this.item.currentRecord));
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
        this.tags = ActionTagUtils.generateTags(this.tagConfigs, this.item.currentRecord, this.config);
        if (this.type === 'listActionsBig') {
            this.styleClass = 'btn-navigation';
        } else {
            this.styleClass = '';
        }
    }

    private getUrl(sdocToShow: any): string {
        return this.sdocRoutingService.getShowUrl(sdocToShow, '');
    }

}
