import {AfterViewChecked, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';

import 'leaflet';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import LatLng = L.LatLng;
import {GenericAppService} from '../../../../shared/search-commons/services/generic-app.service';
@Component({
    selector: 'app-sdoc-leaflet-map',
    templateUrl: './sdoc-leaflet-map.component.html'
})
export class SDocLeafletMapComponent implements AfterViewChecked, OnChanges {
    initialized = false;
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

    ngAfterViewChecked() {
        if (this.initialized) {
            return;
        }

        this.initialized = true;
        this.renderMap();
    }

    ngOnChanges() {
        this.renderMap();
    }

    renderMap() {
        if (!this.initialized) {
            return;
        }

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