/**
 * inspired by leaflet-plugins
 */
import layers = L.control.layers;
import {GeoElement, GeoElementType} from './gpx.parser';
import {GpxLoader} from './gpx.loader';

export interface MapElement {
    id: string;
    name: string;
    popupContent: string;
    trackUrl?: string;
    point?: L.LatLng;
    type?: string;
}

export class GPX extends L.FeatureGroup {
    options: any;
    _layers: {};
    layers: {};
    gpxLoader: GpxLoader;

    constructor(gpxLoader: GpxLoader, gpxElement: MapElement, options: {}) {
        super([]);
        this.gpxLoader = gpxLoader;
        this.initialize(gpxLoader, gpxElement, options);
    }

    initialize(gpxLoader: GpxLoader, gpxElement: MapElement, options: {}) {
        this.gpxLoader = gpxLoader;
        L.Util.setOptions(this, options);
        this._layers = {};

        if (gpxElement) {
            this.addGPX(gpxElement, options);
        }
    }

    addGPX(gpxElement: MapElement, options) {
        const me = this;

        this.gpxLoader.loadGpx(gpxElement.trackUrl, options).then(function onLoaded(geoElements) {
            const layers = me.convertGeoElementsToLayers(gpxElement, geoElements, options);
            if (layers !== undefined) {
                me.addLayer(layers);
                me.fire('loaded', { mapElement: gpxElement, layers: layers});
            }
        }).catch(function onError(error) {
            console.error('failed to load gpx for leeafletmap:' + gpxElement, error);
        });
    }

    convertGeoElementsToLayers(gpxElement: MapElement, geoElements: GeoElement[], options) {
        if (!geoElements) {
            this.fire('error');
            return;
        }

        const layers = [];
        for (let i = 0; i < geoElements.length; i++) {
            const geoElement = geoElements[i];
            switch (geoElement.type) {
                case GeoElementType.WAYPOINT:
                    const point = new L.Marker(geoElement.points[0], {});
                    layers.push(point);
                    break;
                default:
                    if ((gpxElement.type === 'TRACK' && geoElement.type === GeoElementType.ROUTE)
                    || (gpxElement.type === 'ROUTE' && geoElement.type === GeoElementType.TRACK)) {
                        break;
                    }

                    const line = new L.Polyline(geoElement.points, {});
                    if (gpxElement.popupContent) {
                        line.bindPopup(gpxElement.popupContent);
                    }
                    layers.push(line);
                    if (options['showStartMarker']) {
                        layers.push(new L.Marker(geoElement.points[0], {
                            clickable: true,
                            title: 'Start: ' + gpxElement.name,
                            icon: new L.DivIcon({className: 'leaflet-div-icon-start', html: '&#128204;S:' + gpxElement.name})
                        }));
                    }
                    if (options['showEndMarker']) {
                        layers.push(new L.Marker(geoElement.points[geoElement.points.length - 1], {
                            clickable: true,
                            title: 'End: ' + gpxElement.name,
                            icon: new L.DivIcon({className: 'leaflet-div-icon-end', html: '&#128205;E:' + gpxElement.name})
                        }));
                    }
                    break;
            }
        }


        if (!layers.length) {
            return;
        }

        return new L.FeatureGroup(layers);
    }
}
