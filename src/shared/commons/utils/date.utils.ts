import {isDate, isNumber, isString} from 'util';

export class DateUtils {
    public static parseDate(date: any): Date {
        if (date === undefined || date === null || (isString(date) && date.toString() === '')) {
            return undefined;
        }
        if (!isDate(date)) {
            if (isNumber(date )) {
                date = new Date(date);
            } else if (isString(date)) {
                date = new Date(Date.parse(<any>date));
            } else {
                return undefined;
            }
        }

        return date;
    }

    public static dateToInputString(src: any): String {
        const date = DateUtils.parseDate(src);
        if (date === undefined || date === null || !isDate(date)) {
            return undefined;
        }
        const ten = function (i) {
                return (i < 10 ? '0' : '') + i;
            },
            YYYY = date.getFullYear(),
            MM = ten(date.getMonth() + 1),
            DD = ten(date.getDate()),
            HH = ten(date.getHours()),
            II = ten(date.getMinutes()),
            SS = ten(date.getSeconds())
        ;

        return YYYY + '-' + MM + '-' + DD + 'T' +
            HH + ':' + II + ':' + SS;
    }
}
