import {BaseEntityRecord} from '../../search-commons/model/records/base-entity-record';

export enum SimpleFilterCommands {
    CSVIN = 'CSVIN',
    NUMIN = 'NUMIN',
    LT = 'LT',
    LE = 'LE',
    GT = 'GT',
    GE = 'GE'
}
export interface SimpleFilter {
    property: string;
    command: string;
    expectedValues: any[];
}

export abstract class FilterUtils {
    public static checkFilters(filters: SimpleFilter[], record: BaseEntityRecord): boolean {
        for (const filter of filters) {
            if (!FilterUtils.checkFilter(filter, record)) {
                return false;
            }
        }

        return true;
    }

    public static checkFilter(filter: SimpleFilter, record: BaseEntityRecord): boolean {
        let value = record[filter.property];
        if (value === undefined) {
            const hierarchy = filter.property.split('.');
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
        if (value === undefined) {
            return false;
        }

        let values = [];
        switch (filter.command) {
            case SimpleFilterCommands.CSVIN:
                values = value.split(',');
                break;
            case SimpleFilterCommands.NUMIN:
                values = [value];
                break;
            case SimpleFilterCommands.LT:
                return value < filter.expectedValues[0];
            case SimpleFilterCommands.LE:
                return value <= filter.expectedValues[0];
            case SimpleFilterCommands.GT:
                return value > filter.expectedValues[0];
            case SimpleFilterCommands.GE:
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
