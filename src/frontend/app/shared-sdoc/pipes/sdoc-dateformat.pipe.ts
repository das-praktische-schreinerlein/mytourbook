import {Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from '@angular/common';
import {isDate, isNumber, isString} from 'util';
import {SDocRecord} from '../../../shared/sdoc-commons/model/records/sdoc-record';

@Pipe({
    name: 'sdocdate'
})
export class SDocDateFormatPipe implements PipeTransform {
    constructor(private datepipe: DatePipe) {
    }

    transform(sdoc: SDocRecord): string {
        if (sdoc === undefined || sdoc === null) {
            return '';
        }

        let date = sdoc.dateshow;
        if (date === undefined || date === null || (isString(date) && date.toString() === '')) {
            return '';
        }
        if (!isDate(date)) {
            if (isNumber(date )) {
                date = new Date(date);
            } else if (isString(date)) {
                date = new Date(Date.parse(<any>date));
            } else {
                return '';
            }
        }

        const year = date.getFullYear();
        if (year >= 2170) {
            return '' + (year - 200);
        }
        if (year >= 2070) {
            return this.datepipe.transform(date, 'MMMM') + ' ' + (year - 100);
        }

        let pattern: string;
        if (year === 2042) {
            pattern = 'dd.MMMM';
        } else if (year === 2043) {
            pattern = 'MMMM';
        } else {
            switch (sdoc.type) {
                case 'IMAGE':
                case 'VIDEO':
                case 'TRACK':
                case 'TRIP':
                case 'LOCATION':
                case 'TOUR':
                    pattern = 'MMMM yyyy';
                    break;
                default:
                    pattern = 'dd.MM.yyyy';
            }
        }

        return this.datepipe.transform(date, pattern);
    }
}
