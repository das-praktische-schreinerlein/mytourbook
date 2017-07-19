import {Component, EventEmitter, Input, OnChanges, Output, SimpleChange} from '@angular/core';

import 'leaflet';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {GenericAppService} from '../../../../shared/search-commons/services/generic-app.service';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import LatLng = L.LatLng;
import {MapElement} from '../../../../../shared/angular-maps/services/leaflet-gpx.plugin';
@Component({
    selector: 'app-sdoc-map',
    templateUrl: './sdoc-map.component.html'
})
export class SDocMapComponent implements OnChanges {
    mapElements: MapElement[] = [];
    mapElementsReverseMap = new Map<MapElement, SDocRecord>();

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

    onTrackClicked(mapElement: MapElement) {
        this.sdocClicked.emit(this.mapElementsReverseMap.get(mapElement));
    }

    renderMap() {
        this.mapElementsReverseMap.clear();
        if (!this.sdocs) {
            this.mapElements = [];
            return;
        }

        for (let i = 0; i < this.sdocs.length; i++) {
            const record =  this.sdocs[i];
            const trackUrl = record.gpsTrackBasefile;
            if (trackUrl !== undefined && trackUrl.length > 0) {
                const mapElement: MapElement = {
                    id: record.id,
                    name: record.name,
                    trackUrl: this.appService.getAppConfig()['tracksBaseUrl'] + trackUrl + '.gpx',
                    popupContent: '<h2>' + record.type + ': ' + record.name + '</h2>'
                };
                this.mapElementsReverseMap.set(mapElement, record);
            } else if (record.geoLat && record.geoLon) {
                const mapElement: MapElement = {
                    id: record.id,
                    name: record.name,
                    point: new LatLng(+record.geoLat, +record.geoLon),
                    popupContent: '<h2>' + record.type + ': ' + record.name + '</h2>'
                };
                this.mapElementsReverseMap.set(mapElement, record);
            }
        }
        this.mapElements = Array.from(this.mapElementsReverseMap.keys());
    }
}
