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

    getLocationHierarchy(record: SDocRecord, lastOnly: boolean): any[] {
        if (record.locHirarchie === undefined || record.locHirarchieIds === undefined) {
            return [];
        }

        const hierarchyTexts = record.locHirarchie.split(' -> ');
        const hierarchyIds = record.locHirarchieIds.split(',');
        if (hierarchyIds.length !== hierarchyTexts.length) {
            return [];
        }

        const hierarchy = [];
        let lastIndex = hierarchyTexts.length - 1;
        if (record.type === 'LOCATION' && hierarchy.length > 1) {
            lastIndex--;
        }

        for (let i = lastOnly ? lastIndex : 0; i < hierarchyTexts.length; i++) {
            if (hierarchyIds[i] !== undefined && hierarchyTexts[i] != undefined && hierarchyTexts[i].length > 0) {
                hierarchy.push(['LOCATION_' + hierarchyIds[i], hierarchyTexts[i]]);
            }
        }

        return hierarchy;
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

    getThumbnail(image: SDocImageRecord): string {
        return this.appService.getAppConfig()['picsBaseUrl'] + '/pics_x100/' + image.fileName;
    }

    getThumbnailUrl(image: SDocImageRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.getThumbnail(image));
    }

    getPreview(image: SDocImageRecord): string {
        return this.appService.getAppConfig()['picsBaseUrl'] + '/pics_x600/' + image.fileName;
    }

    getPreviewUrl(image: SDocImageRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.getPreview(image));
    }

    getFullUrl(image: SDocImageRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(
            this.appService.getAppConfig()['picsBaseUrl'] + '/pics_x600/' + image.fileName);
    }

    getStyleClassForRecord(record: SDocRecord, layout: string): string[] {
        const value = record['sdocratepers'] || {gesamt: 0};
        const rate = Math.round(((value['gesamt'] || 0) / 3) + 0.5);
        return ['list-item-persrate-' + rate, 'list-item-' + layout + '-persrate-' + rate];
    }
}
