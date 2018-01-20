import {BaseEntityRecord} from '../model/records/base-entity-record';

export abstract class BeanUtils {
    public static getValue(record: BaseEntityRecord, property: string): any {
        let value = record[property];
        if (value === undefined) {
            const hierarchy = property.split('.');
            let parent = record;
            for (let i = 0; i < hierarchy.length; i++) {
                const element = hierarchy[i];
                if (parent instanceof BaseEntityRecord) {
                    parent = parent.get(element);
                } else if (parent) {
                    parent = parent[element];
                } else {
                    i = hierarchy.length + 1000;
                }

                const propName = hierarchy.slice(i + 1, hierarchy.length).join('.');
                if (parent && parent[propName]) {
                    value = parent[propName];
                    i = hierarchy.length + 1000;
                }
            }
        }
        return value;
    }
}
