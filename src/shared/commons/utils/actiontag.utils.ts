import {FilterUtils, SimpleFilter} from './filter.utils';

export interface ActionTagConfig {
    key: string;
    name: string;
    shortName: string;
    showFilter: SimpleFilter[];
    type: string;
    payload?: {};
    recordAvailability: SimpleFilter[];
    configAvailability: SimpleFilter[];
}
export interface ActionTag {
    config: ActionTagConfig;
    active: boolean;
    available: boolean;
}

export interface ActionTagForm {
    key: string;
    type: string;
    recordId: string;
    payload: any;
}

export abstract class ActionTagUtils {
    public static generateTags(tagConfigs: ActionTagConfig[], record: {}, config: {}): ActionTag[] {
        const lTags: ActionTag[] = [];
        for (const tagConfig of tagConfigs) {
            const tag = ActionTagUtils.generateTag(tagConfig, record, config);
            if (tag.available) {
                lTags.push(tag);
            }
        }

        return lTags;
    }

    public static generateTag(tagConfig: ActionTagConfig, record: {}, config: {}): ActionTag {
        let available = FilterUtils.checkFilters(tagConfig.configAvailability, config);
        available = available && FilterUtils.checkFilters(tagConfig.recordAvailability, record);
        const active = available && FilterUtils.checkFilters(tagConfig.showFilter, record);

        return {
            config: tagConfig,
            active: active,
            available: available
        };
    }
}
