import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {SDocImageRecord} from '../../../../shared/sdoc-commons/model/records/sdocimage-record';
import {SDocRoutingService} from '../../services/sdoc-routing.service';
import {Layout} from '../sdoc-list/sdoc-list.component';

@Component({
    selector: 'app-sdoc-list-item',
    templateUrl: './sdoc-list-item.component.html',
    styleUrls: ['./sdoc-list-item.component.css']
})
export class SDocListItemComponent {
    private sanitizer: DomSanitizer;

    @Input()
    public record: SDocRecord;

    @Input()
    public adminMode = false;

    @Input()
    public backToSearchUrl: string;

    @Input()
    public layout: Layout;

    @Output()
    public show: EventEmitter<SDocRecord> = new EventEmitter();

    @Output()
    public edit: EventEmitter<SDocRecord> = new EventEmitter();

    @Output()
    public delete: EventEmitter<SDocRecord> = new EventEmitter();

    constructor(sanitizer: DomSanitizer, private sdocRoutingService: SDocRoutingService) {
        this.sanitizer = sanitizer;
    }

    submitShow(sdoc: SDocRecord) {
        this.show.emit(sdoc);
        return false;
    }

    submitEdit(sdoc: SDocRecord) {
        this.edit.emit(sdoc);
        return false;
    }

    submitDelete(sdoc: SDocRecord) {
        this.delete.emit(sdoc);
        return false;
    }

    getShowUrl(record: SDocRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(this.sdocRoutingService.getShowUrl(record, ''));
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
