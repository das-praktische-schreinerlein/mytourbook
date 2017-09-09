import {AfterViewChecked, Component, EventEmitter, Input, OnChanges, Output, SimpleChange} from '@angular/core';
import 'leaflet';
import 'leaflet.markercluster';
import {GeoParsedFeature, MapElement} from '../../services/leaflet-geo.plugin';
import {GeoLoader} from '../../services/geo.loader';
import {GeoJsonParser} from '../../services/geojson.parser';
import {GeoGpxParser} from '../../services/geogpx.parser';
import {Http} from '@angular/http';
import {ComponentUtils} from '../../../angular-commons/services/component.utils';
import LatLng = L.LatLng;
import Layer = L.Layer;
import MarkerClusterGroup = L.MarkerClusterGroup;

export interface LeafletMapOptions {
    flgGenerateNameFromGpx: boolean;
    showStartMarker: boolean;
    showEndMarker: boolean;
}

@Component({
    selector: 'app-leaflet-map',
    templateUrl: './leaflet-map.component.html'
})
export class LeafletMapComponent implements AfterViewChecked, OnChanges {
    // create the tile layer with correct attribution
    private osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    private osmAttrib = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
    private osm = new L.TileLayer(this.osmUrl, {
        minZoom: 1, maxZoom: 16,
        attribution: this.osmAttrib
    });
    private gpxLoader: GeoLoader;
    private jsonLoader: GeoLoader;

    initialized: boolean;
    map: L.Map;
    private featureGroup: L.MarkerClusterGroup;
    private loadedMapElements: MapElement[];

    @Input()
    public mapId: string;

    @Input()
    public height: string;

    @Input()
    public mapElements: MapElement[];

    @Input()
    public center: L.LatLng;

    @Input()
    public zoom: number;

    @Input()
    public options: LeafletMapOptions;

    @Output()
    public centerChanged: EventEmitter<L.LatLng> = new EventEmitter();

    @Output()
    public mapElementClicked: EventEmitter<MapElement> = new EventEmitter();

    @Output()
    public mapElementsLoaded: EventEmitter<MapElement[]> = new EventEmitter();

    constructor(private http: Http) {
        this.gpxLoader = new GeoLoader(http, new GeoGpxParser());
        this.jsonLoader = new GeoLoader(http, new GeoJsonParser());
    }

    ngAfterViewChecked() {
        if (this.initialized) {
            return;
        }

        this.initialized = true;
        this.renderMap();
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (this.initialized && ComponentUtils.hasNgChanged(changes)) {
            this.renderMap();
        }
    }

    private renderMap() {
        // TODO: move to Service
        if (!this.initialized || !this.mapId) {
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

        if (this.featureGroup) {
            this.featureGroup.clearLayers();
        }
        this.loadedMapElements = [];

        const center = this.center || new LatLng(43, 16);
        this.map.setView(center, this.zoom);
        const me = this;
        this.featureGroup = L.markerClusterGroup();
        this.featureGroup.addTo(this.map);
        for (let i = 0; i < this.mapElements.length; i++) {
            const mapElement = this.mapElements[i];

            if (mapElement.trackUrl) {
                let geoFeature: GeoParsedFeature;

                if (mapElement.trackUrl.endsWith('.gpx')) {
                    geoFeature = new GeoParsedFeature(this.gpxLoader, mapElement, {
                        async: true,
                        display_wpt: false,
                        generateName: this.options.flgGenerateNameFromGpx,
                        showStartMarker: this.options.showStartMarker,
                        showEndMarker: this.options.showEndMarker
                    });
                } else {
                    geoFeature = new GeoParsedFeature(this.jsonLoader, mapElement, {
                        async: true,
                        display_wpt: false,
                        generateName: this.options.flgGenerateNameFromGpx,
                        showStartMarker: this.options.showStartMarker,
                        showEndMarker: this.options.showEndMarker
                    });
                }
                geoFeature.on('loaded', function (e) {
                    const loadedTrackFeature = <Layer>e.target;
                    const loadedMapElement = <MapElement>e['mapElement'];
                    me.featureGroup.addLayer(loadedTrackFeature);
                    loadedTrackFeature.on('click', function () {
                        me.mapElementClicked.emit(loadedMapElement);
                    });

                    me.map.fitBounds(me.featureGroup.getBounds());
                    me.pushLoadedMapElement(loadedMapElement);
                });
            } else if (mapElement.point) {
                const pointFeature = new L.Marker(mapElement.point, {
                    clickable: true,
                    title: mapElement.name,
                    icon: new L.DivIcon({className: 'leaflet-div-icon-point', html: '&#128204;' + mapElement.name})
                });
                me.featureGroup.addLayer(pointFeature);
                pointFeature.on('click', function () {
                    me.mapElementClicked.emit(mapElement);
                });

                me.map.fitBounds(me.featureGroup.getBounds());
                me.pushLoadedMapElement(mapElement);
            }
        }
    }

    private pushLoadedMapElement(loadedMapElement: MapElement) {
        this.loadedMapElements.push(loadedMapElement);
        if (this.loadedMapElements.length === this.mapElements.length) {
            this.mapElementsLoaded.emit(this.loadedMapElements);
        }
    }
}
