import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChange} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import {SDocRoutingService} from '../../services/sdoc-routing.service';
import {ItemData, SDocContentUtils} from '../../services/sdoc-contentutils.service';
import {BaseEntityRecord} from '../../../../../shared/search-commons/model/records/base-entity-record';

export enum ActionTagConfigFilterCommands {
    CSVIN, NUMIN, LT, LE, GT, GE
}
export interface ActionTagConfigFilter    {
    property: string;
    command: ActionTagConfigFilterCommands;
    expectedValues: any[];
}
export interface ActionTagConfig {
    key: string;
    name: string;
    shortName: string;
    showFilter: ActionTagConfigFilter[];
    availability: ActionTagConfigFilter[];
}
export interface ActionTag {
    config: ActionTagConfig;
    active: boolean;
    available: boolean;
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

    tagConfigs: ActionTagConfig[] = [
        {
            key: 'playlists_favorites',
            name: 'Favorite',
            shortName: 'F',
            showFilter: [
                {
                    property: 'playlists',
                    command: ActionTagConfigFilterCommands.CSVIN,
                    expectedValues: ['Favorites']
                }
            ],
            availability: [
                {
                    property: 'type',
                    command: ActionTagConfigFilterCommands.CSVIN,
                    expectedValues: ['IMAGE', 'image']
                }
            ]
        },
        {
            key: 'persRate_milestone',
            name: 'Personal Meilenstein',
            shortName: 'P*',
            showFilter: [
                {
                    property: 'sdocratepers.gesamt',
                    command: ActionTagConfigFilterCommands.GE,
                    expectedValues: [11]
                }
            ],
            availability: [
                {
                    property: 'type',
                    command: ActionTagConfigFilterCommands.CSVIN,
                    expectedValues: ['IMAGE', 'image']
                }
            ]
        },
        {
            key: 'persRate_phantastic',
            name: 'Personal Phantastic',
            shortName: 'P**',
            showFilter: [
                {
                    property: 'sdocratepers.gesamt',
                    command: ActionTagConfigFilterCommands.GE,
                    expectedValues: [14]
                }
            ],
            availability: [
                {
                    property: 'type',
                    command: ActionTagConfigFilterCommands.CSVIN,
                    expectedValues: ['IMAGE', 'image']
                }
            ]
        }
    ];
    tags: ActionTag[] = [];
    styleClass = '';

    @Input()
    public record: SDocRecord;

    @Input()
    public type?: string;

    constructor(private sanitizer: DomSanitizer, private commonRoutingService: CommonRoutingService,
                private sdocRoutingService: SDocRoutingService, private contentUtils: SDocContentUtils) {
    }

    ngOnInit() {
        this.updateData();
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
        return false;
    }

    public unsetTag(tag: ActionTag): boolean {
        return false;
    }

    private updateData() {
        this.contentUtils.updateItemData(this.item, this.record, 'default');
        this.tags = this.generateTags(this.tagConfigs, this.item.currentRecord);
        if (this.type === 'listActionsBig') {
            this.styleClass = 'btn-navigation';
        } else {
            this.styleClass = '';
        }
    }

    private getUrl(sdocToShow: any): string {
        return this.sdocRoutingService.getShowUrl(sdocToShow, '');
    }

    private generateTags(tagConfigs: ActionTagConfig[], record: BaseEntityRecord): ActionTag[] {
        const lTags: ActionTag[] = [];
        for (const config of tagConfigs) {
            const tag = this.generateTag(config, record);
            if (tag.available) {
                lTags.push(tag);
            }
        }

        return lTags;
    }

    private generateTag(tagConfig: ActionTagConfig, record: BaseEntityRecord): ActionTag {
        let available = true;
        for (const filter of tagConfig.availability) {
            if (!available) {
                continue;
            }
            available = available && this.checkFilter(filter, record);
        }
        let active = available;
        for (const filter of tagConfig.showFilter) {
            if (!active) {
                continue;
            }
            active = active && this.checkFilter(filter, record);
        }

        const tag: ActionTag = {
            config: tagConfig,
            active: active,
            available: available
        };

        return tag;
    }

    private checkFilter(filter: ActionTagConfigFilter, record: BaseEntityRecord): boolean {
        let value = record[filter.property];
        if (value === undefined) {
            const hierarchy = filter.property.split('.');
            let parent = record;
            for (let i = 0; i < hierarchy.length; i++) {
                const element = hierarchy[i];
                if (parent instanceof BaseEntityRecord) {
                    parent = parent.get(element);
                } else {
                    parent = parent[element];
                }

                const propName = hierarchy.slice(i + 1, hierarchy.length).join('.');
                if (parent[propName]) {
                    value = parent[propName];
                    i = hierarchy.length + 1000;
                }
            }
        }
        if (value === undefined) {
            return false;
        }

        let values = [];
        switch (filter.command) {
            case ActionTagConfigFilterCommands.CSVIN:
                values = value.split(',');
                break;
            case ActionTagConfigFilterCommands.NUMIN:
                values = [value];
                break;
            case ActionTagConfigFilterCommands.LT:
                return value < filter.expectedValues[0];
            case ActionTagConfigFilterCommands.LE:
                return value <= filter.expectedValues[0];
            case ActionTagConfigFilterCommands.GT:
                return value > filter.expectedValues[0];
            case ActionTagConfigFilterCommands.GE:
                return value >= filter.expectedValues[0];
        }

        for (const expected of filter.expectedValues) {
            if (values.indexOf(expected) >= 0) {
                return true;
            }
        }

        return false;
    }
}
