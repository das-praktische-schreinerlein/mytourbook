import {Pipe, PipeTransform} from '@angular/core';
import {isDate, isNumber, isString} from 'util';

@Pipe({
    name: 'duration'
})
export class DurationPipe implements PipeTransform {
    transform(start: Date, end: Date, factor: number, prefix: string, suffix: string): string {
        start = this.transformDate(start, undefined);
        if (!start) {
            return '';
        }

        end = this.transformDate(end, new Date());

        return prefix + Math.round((end.getTime() - start.getTime()) / factor) + ' ' + suffix;
    }

    private transformDate(date: any, defaultValue: Date): Date {
        if (isDate(date)) {
            return date;
        }

        if (isNumber(date )) {
            return new Date(date);
        } else if (isString(date)) {
            return new Date(Date.parse(<any>date));
        }

        return defaultValue;
    }
}
