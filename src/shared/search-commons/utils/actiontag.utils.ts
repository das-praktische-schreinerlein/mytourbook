import {BaseEntityRecord} from '../model/records/base-entity-record';
import {FilterUtils, SimpleFilter} from './filter.utils';

export interface ActionTagConfig {
    key: string;
    name: string;
    shortName: string;
    showFilter: SimpleFilter[];
    availability: SimpleFilter[];
}
export interface ActionTag {
    config: ActionTagConfig;
    active: boolean;
    available: boolean;
}

export abstract class ActionTagUtils {
    public static generateTags(tagConfigs: ActionTagConfig[], record: BaseEntityRecord): ActionTag[] {
        const lTags: ActionTag[] = [];
        for (const config of tagConfigs) {
            const tag = ActionTagUtils.generateTag(config, record);
            if (tag.available) {
                lTags.push(tag);
            }
        }

        return lTags;
    }

    public static generateTag(tagConfig: ActionTagConfig, record: BaseEntityRecord): ActionTag {
        const available = FilterUtils.checkFilters(tagConfig.availability, record);
        const active = available && FilterUtils.checkFilters(tagConfig.showFilter, record);

        return {
            config: tagConfig,
            active: active,
            available: available
        };
    }
}
