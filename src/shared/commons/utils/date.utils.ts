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
                return DateUtils.parseDateStringWithLocaltime(date);
            } else {
                return undefined;
            }
        }

        return date;
    }

    public static parseDateStringWithLocaltime(date: any): Date {
        if (date === undefined || date === null || (isString(date) && date.toString() === '') || !isString(date)) {
            return undefined;
        }

        // parse Date for locatime
        let dateParts  = date.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):{0,1}(\d{2}){0,1}$/);
        if (dateParts !== null ) {
            dateParts = dateParts.slice(1);
            dateParts[1] -= 1; // months are zero-based
            date = new Date();
            date.setFullYear(dateParts[0], dateParts[1], dateParts[2]);
            date.setHours(dateParts[3], dateParts[4], dateParts.length > 5 && dateParts[5] !== undefined ? dateParts[5] : 0);

            return date;
        }

        return new Date(Date.parse(<any>date));
    }

    public static dateToLocalISOString(src: any): String {
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

    public static formatDateRange(start: Date, end: Date): string {
        const formatOptionsShort = { day: '2-digit' };
        const formatOptionsLong = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const datestart = start.toLocaleString('de-DE', formatOptionsLong);
        const dateend = end.toLocaleString('de-DE', formatOptionsLong);
        if (datestart !== dateend) {
            return start.toLocaleString('de-DE', formatOptionsShort)
                + '-' + dateend;
        } else {
            return dateend;
        }
    }

    public static formatDateTime(start: Date): string {
        const formatOptionsLong = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
            second: '2-digit' };
        return start.toLocaleString('de-DE', formatOptionsLong);
    }
}
