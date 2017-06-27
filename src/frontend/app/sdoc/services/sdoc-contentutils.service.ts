import {Injectable} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {SDocImageRecord} from '../../../shared/sdoc-commons/model/records/sdocimage-record';
import {SDocRecord} from '../../../shared/sdoc-commons/model/records/sdoc-record';

@Injectable()
export class SDocContentUtils {

    constructor(private sanitizer: DomSanitizer) {
    }

    public getMapUrl(record: SDocRecord): SafeUrl {
        switch (record.type) {
            case 'TRACK':
                return this.getMapUrlTrack(record);
            case 'ROUTE':
                return this.getMapUrlRoute(record);
            default:
                break;
        }

        return this.getMapUrlLocation(record);
    }

    getMapUrlTrack(record: SDocRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(
            'http://www.michas-ausflugstipps.de/gmap.php?' +
            'LAT=' + record.geoLat + '&' +
            'LONG=' + record.geoLon + '&' +
            'K_ID=' + record.trackId + '&' +
            'FORMAT=KATINLINE&FLAGCENTERTRACK=1');
    }

    getMapUrlRoute(record: SDocRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(
            'http://www.michas-ausflugstipps.de/gmap.php?' +
            'LAT=' + record.geoLat + '&' +
            'LONG=' + record.geoLon + '&' +
            'T_ID=' + record.routeId + '&' +
            'FORMAT=KATINLINE&FLAGCENTERTOUR=1');
    }

    getMapUrlLocation(record: SDocRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(
            'http://www.michas-ausflugstipps.de/gmap.php?' +
            'LAT=' + record.geoLat + '&' +
            'LONG=' + record.geoLon + '&' +
            'FORMAT=KATINLINE');
    }

    getThumbnails(record: SDocRecord): SDocImageRecord[] {
        return record['sdocimages'].filter((item, index) => index < 10);
    }

    getThumbnailUrl(image: SDocImageRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(
            'http://www.michas-ausflugstipps.de/digifotos/pics_x100/' + image.fileName);
    }
}
