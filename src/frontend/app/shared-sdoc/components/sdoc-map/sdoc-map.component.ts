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
    trackUrlReverseMap = new Map<string, SDocRecord>();

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

    @Output()
    public sdocClicked: EventEmitter<SDocRecord> = new EventEmitter();

    constructor(private appService: GenericAppService) {}

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            this.renderMap();
        }
    }

    onTrackClicked(trackUrl: string) {
        this.sdocClicked.emit(this.trackUrlReverseMap.get(trackUrl));
    }

    renderMap() {
        this.trackUrlReverseMap.clear();
        if (!this.sdocs) {
            this.trackUrls = [];
            return;
        }

        for (let i = 0; i < this.sdocs.length; i++) {
            const record =  this.sdocs[i];
            const trackUrl = record.gpsTrackBasefile;
            if (trackUrl !== undefined && trackUrl.length > 0) {
                this.trackUrlReverseMap.set(this.appService.getAppConfig()['tracksBaseUrl'] + trackUrl + '.gpx', record);
            } else if (record.geoLat && record.geoLon) {
                this.mapCenterPos = new LatLng(+record.geoLat, +record.geoLon);
            }
        }
        this.trackUrls = Array.from(this.trackUrlReverseMap.keys());
    }
}
