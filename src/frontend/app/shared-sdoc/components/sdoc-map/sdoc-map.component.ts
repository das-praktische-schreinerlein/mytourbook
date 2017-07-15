import {Component, EventEmitter, Input, OnChanges, Output, SimpleChange} from '@angular/core';

import 'leaflet';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {GenericAppService} from '../../../../shared/search-commons/services/generic-app.service';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import LatLng = L.LatLng;
@Component({
    selector: 'app-sdoc-map',
    templateUrl: './sdoc-map.component.html'
})
export class SDocMapComponent implements OnChanges {
    trackUrls: string[] = [];

    @Input()
    public mapId: string;

    @Input()
    public height: string;

    @Input()
    public sdocs: SDocRecord[];

    @Input()
    public mapCenterPos: L.LatLng;

    @Input()
    public mapZoom: number;

    @Output()
    public centerChanged: EventEmitter<L.LatLng> = new EventEmitter();

    constructor(private appService: GenericAppService) {}

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            this.renderMap();
        }
    }

    renderMap() {
        this.trackUrls = [];
        if (!this.sdocs) {
            return;
        }

        for (let i = 0; i < this.sdocs.length; i++) {
            const record =  this.sdocs[i];
            const trackUrl = record.gpsTrackBasefile;
            if (trackUrl !== undefined && trackUrl.length > 0) {
                this.trackUrls.push(this.appService.getAppConfig()['tracksBaseUrl'] + trackUrl + '.gpx');
            } else if (record.geoLat && record.geoLon) {
                this.mapCenterPos = new LatLng(+record.geoLat, +record.geoLon);
            }
        }
    }
}