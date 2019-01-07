import {Pipe, PipeTransform} from '@angular/core';
import {TourDocRecord} from '../../../shared/tdoc-commons/model/records/tdoc-record';
import {StringUtils} from '@dps/mycms-commons/dist/commons/utils/string.utils';

@Pipe({
    name: 'tdocmapcode'
})
export class TourDocMapCodePipe implements PipeTransform {
    transform(value: TourDocRecord, ...args: any[]): string {
        if (value && (value.geoLat || value.gpsTrackSrc || value.gpsTrackBasefile) && args.length > 0) {
            const prefix = args.length > 1 && args[1] !== '' ? args[1] : '';
            return prefix + StringUtils.calcCharCodeForListIndex(args[0]);
        }

        return '';
    }
}
