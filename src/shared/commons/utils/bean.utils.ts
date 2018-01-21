export abstract class BeanUtils {
    public static getValue(record: any, property: string): any {
        if (record === undefined) {
            return undefined;
        }

        let value = record[property];
        if (value === undefined) {
            const hierarchy = property.split('.');
            let parent = record;
            for (let i = 0; i < hierarchy.length; i++) {
                const element = hierarchy[i];
                if (!parent) {
                    i = hierarchy.length + 1000;
                    continue;
                }

                if (typeof parent['get'] === 'function') {
                    parent = parent.get(element);
                } else {
                    parent = parent[element];
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
