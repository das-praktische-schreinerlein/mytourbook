import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SDocRecord} from '../../../model/records/sdoc-record';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {SDocImageRecord} from '../../../model/records/sdocimage-record';

@Component({
    selector: 'app-sdoc-list-item',
    templateUrl: './sdoc-list-item.component.html',
    styleUrls: ['./sdoc-list-item.component.css']
})
export class SDocListItemComponent {
    sanitizer: DomSanitizer;

    @Input()
    public record: SDocRecord;

    @Output()
    edit: EventEmitter<SDocRecord> = new EventEmitter();

    @Output()
    delete: EventEmitter<SDocRecord> = new EventEmitter();

    constructor(sanitizer: DomSanitizer) {
        this.sanitizer = sanitizer;
    }

    submitEdit(sdoc: SDocRecord) {
        this.edit.emit(sdoc);
    }

    submitDelete(sdoc: SDocRecord) {
        this.delete.emit(sdoc);
    }

    getMapUrl(record: SDocRecord): SafeUrl {
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
