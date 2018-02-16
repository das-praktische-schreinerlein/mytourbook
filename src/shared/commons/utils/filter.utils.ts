import {BeanUtils} from './bean.utils';

export enum SimpleFilterCommands {
    CSVIN = 'CSVIN',
    NUMIN = 'NUMIN',
    EQ = 'EQ',
    SEQ = 'SEQ',
    NEQ = 'NEQ',
    SNEQ = 'SNEQ',
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
    public static checkFilters(filters: SimpleFilter[], record: any): boolean {
        if (record === undefined) {
            return false;
        }

        for (const filter of filters) {
            if (!FilterUtils.checkFilter(filter, record)) {
                return false;
            }
        }

        return true;
    }

    public static checkFilter(filter: SimpleFilter, record: any): boolean {
        if (record === undefined) {
            return false;
        }

        const value = BeanUtils.getValue(record, filter.property);
        if (value === undefined) {
            return false;
        }

        let values = [];
        switch (filter.command) {
            case SimpleFilterCommands.CSVIN:
                values = (value + '').split(/[ ]*,[ ]*/);
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
            case SimpleFilterCommands.EQ:
                return value === filter.expectedValues[0];
            case SimpleFilterCommands.SEQ:
                return value + '' === filter.expectedValues[0] + '';
            case SimpleFilterCommands.NEQ:
                return value !== filter.expectedValues[0];
            case SimpleFilterCommands.SNEQ:
                return value + '' !== filter.expectedValues[0] + '';
        }

        for (const expected of filter.expectedValues) {
            if (values.indexOf(expected) >= 0) {
                return true;
            }
        }

        return false;
    }
}
