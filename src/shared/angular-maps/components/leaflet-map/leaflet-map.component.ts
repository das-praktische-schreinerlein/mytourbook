import {AfterViewChecked, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';

import 'leaflet';
import {GPX} from '../../services/leaflet-gpx.plugin';
import {Http} from '@angular/http';
import LatLng = L.LatLng;

@Component({
    selector: 'app-leaflet-map',
    templateUrl: './leaflet-map.component.html'
})
export class LeafletMapComponent implements AfterViewChecked, OnChanges {
    // create the tile layer with correct attribution
    private osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    private osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    private osm = new L.TileLayer(this.osmUrl, {
        minZoom: 1, maxZoom: 16,
        attribution: this.osmAttrib
    });

    initialzed: boolean;
    map: L.Map;

    @Input()
    public mapId: string;

    @Input()
    public height: string;

    @Input()
    public trackUrls: string[];

    @Input()
    public center: L.LatLng;

    @Input()
    public zoom: number;

    @Output()
    public centerChanged: EventEmitter<L.LatLng> = new EventEmitter();

    constructor(private http: Http) {

    }

    ngAfterViewChecked() {
        if (this.initialzed) {
            return;
        }

        this.initialzed = true;
        this.renderMap();
    }

    ngOnChanges() {
        this.renderMap();
    }

    private renderMap() {
        if (!this.initialzed || !this.mapId) {
            return;
        }
        if (!this.map) {
            // set up the map
            this.map = new L.Map(this.mapId);
            this.map.addLayer(this.osm);
        }

        if (!this.map) {
            return;
        }

        const center = this.center || new LatLng(43, 16);
        this.map.setView(center, this.zoom);
        const me = this;
        const featureGroup = L.featureGroup([]);
        const gpxObjs = [];
        for (let i = 0; i < this.trackUrls.length; i++) {
            const trackUrl = this.trackUrls[i];
            const gpxObj = new GPX(this.http, trackUrl, {async: true, display_wpt: false});
            gpxObjs.push(gpxObj);
            gpxObj.addTo(this.map);
            gpxObj.on('loaded', function (e) {
                featureGroup.addLayer(e.target);
                me.map.fitBounds(featureGroup.getBounds());
            });
        }
    }
}
