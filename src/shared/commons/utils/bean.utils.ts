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
                    break;
                }

                if (parent[element] !== undefined) {
                    parent = parent[element];
                } else if (typeof parent['get'] === 'function' && parent.get(element) !== undefined) {
                    parent = parent.get(element);
                } else {
                    parent = parent[element];
                }

                if (!parent) {
                    break;
                }

                const propName = hierarchy.slice(i + 1, hierarchy.length).join('.');
                if (parent && parent[propName]) {
                    value = parent[propName];
                    break;
                }
            }
        }

        return value;
    }
}
