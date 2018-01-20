import {BaseEntityRecord} from '../model/records/base-entity-record';
import {BeanUtils} from './bean.utils';

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
        const value = BeanUtils.getValue(record, filter.property);
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
