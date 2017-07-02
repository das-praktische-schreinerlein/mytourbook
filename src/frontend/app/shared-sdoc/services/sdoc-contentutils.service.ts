import {Injectable} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {SDocImageRecord} from '../../../shared/sdoc-commons/model/records/sdocimage-record';
import {SDocRecord} from '../../../shared/sdoc-commons/model/records/sdoc-record';
import {GenericAppService} from '../../../shared/search-commons/services/generic-app.service';

@Injectable()
export class SDocContentUtils {

    constructor(private sanitizer: DomSanitizer, private appService: GenericAppService) {
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

    getLastElementLocationHierarchy(record: SDocRecord): string {
        if (record.locHirarchie === undefined) {
            return '';
        }

        const hierarchy = record.locHirarchie.split(' -> ');
        if (record.type === 'LOCATION' && hierarchy.length > 1) {
            return hierarchy[hierarchy.length - 2];
        }

        return hierarchy[hierarchy.length - 1];
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
            this.appService.getAppConfig()['picsBaseUrl'] + '/pics_x100/' + image.fileName);
    }

    getPreviewUrl(image: SDocImageRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(
            this.appService.getAppConfig()['picsBaseUrl'] + '/pics_x600/' + image.fileName);
    }

    getFullUrl(image: SDocImageRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(
            this.appService.getAppConfig()['picsBaseUrl'] + '/pics_x600/' + image.fileName);
    }
}
