import {Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from '@angular/common';
import {isDate, isNumber, isString} from 'util';
import {TourDocRecord} from '../../../shared/tdoc-commons/model/records/tdoc-record';
import {environment} from '../../../environments/environment';

@Pipe({
    name: 'tdocdate'
})
export class TourDocDateFormatPipe implements PipeTransform {
    constructor(private datepipe: DatePipe) {
    }

    transform(tdoc: TourDocRecord): string {
        if (tdoc === undefined || tdoc === null) {
            return '';
        }

        let date = tdoc.dateshow;
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
            switch (tdoc.type) {
                case 'NEWS':
                    pattern = 'dd.MM.yyyy';
                    break;
                case 'IMAGE':
                case 'VIDEO':
                case 'TRACK':
                case 'TRIP':
                case 'LOCATION':
                case 'ROUTE':
                case 'DESTINATION':
                default:
                    if (environment.tourDocDateFormatPipePattern && environment.tourDocDateFormatPipePattern === 'LONG') {
                        pattern = 'dd.MM.yyyy';
                        break;
                    }

                    pattern = 'MMMM yyyy';
            }
        }

        return this.datepipe.transform(date, pattern);
    }
}
