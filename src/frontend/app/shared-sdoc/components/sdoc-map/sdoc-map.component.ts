import {Component, EventEmitter, Input, OnChanges, Output, SimpleChange} from '@angular/core';

import 'leaflet';
import 'leaflet.markercluster';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {GenericAppService} from '../../../../shared/search-commons/services/generic-app.service';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import {MapElement} from '../../../../shared/angular-maps/services/leaflet-geo.plugin';
import LatLng = L.LatLng;
@Component({
    selector: 'app-sdoc-map',
    templateUrl: './sdoc-map.component.html'
})
export class SDocMapComponent implements OnChanges {
    showLoadingSpinner = false;
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

    @Input()
    public showImageTrackAndGeoPos? = false;

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

    onMapElementsLoaded(mapElements: MapElement[]) {
        this.showLoadingSpinner = false;
    }

    renderMap() {
        this.mapElementsReverseMap.clear();
        if (!this.sdocs) {
            this.mapElements = [];
            return;
        }

        // TODO: move to Service
        for (let i = 0; i < this.sdocs.length; i++) {
            const record =  this.sdocs[i];
            const trackUrl = record.gpsTrackBasefile;

            const isImage = record.type === 'IMAGE';
            const showTrack = trackUrl !== undefined && trackUrl.length > 0 && (!isImage || this.showImageTrackAndGeoPos);
            const showGeoPos = record.geoLat && record.geoLon && (!showTrack || isImage);

            if (showTrack) {
                const mapElement: MapElement = {
                    id: record.id,
                    name: record.name,
                    trackUrl: this.appService.getAppConfig()['tracksBaseUrl'] + trackUrl + '.json',
                    trackSrc: this.sdocs[i].gpsTrack,
                    popupContent: '<b>' + record.type + ': ' + record.name + '</b>',
                    type: record.type
                };
                this.mapElementsReverseMap.set(mapElement, record);
            }
            if (showGeoPos) {
                const mapElement: MapElement = {
                    id: record.id,
                    name: record.name,
                    point: new LatLng(+record.geoLat, +record.geoLon),
                    popupContent: '<b>' + record.type + ': ' + record.name + '</b>',
                    type: record.type
                };
                this.mapElementsReverseMap.set(mapElement, record);
            }
        }
        this.mapElements = Array.from(this.mapElementsReverseMap.keys());
        this.showLoadingSpinner = true;
    }
}
