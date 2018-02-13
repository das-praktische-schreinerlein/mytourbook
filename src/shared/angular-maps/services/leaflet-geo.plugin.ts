/**
 * inspired by leaflet-plugins
 */
import {GeoLoader} from './geo.loader';
import {GeoElement, GeoElementType} from './geo.parser';

import * as L from 'leaflet';
import 'leaflet.markercluster';

export interface MapElement {
    id: string;
    name: string;
    popupContent: string;
    trackUrl?: string;
    trackSrc?: string;
    point?: L.LatLng;
    type?: string;
}

export class GeoParsedFeature extends L.FeatureGroup {
    options: any;
    _layers: {};
    layers: {};
    geoLoader: GeoLoader;

    constructor(geoLoader: GeoLoader, geoElement: MapElement, options: {}) {
        super([]);
        this.geoLoader = geoLoader;
        this.initialize(geoLoader, geoElement, options);
    }

    initialize(geoLoader: GeoLoader, geoElement: MapElement, options: {}) {
        this.geoLoader = geoLoader;
        L.Util.setOptions(this, options);
        this._layers = {};

        if (geoElement) {
            this.addGeoData(geoElement, options);
        }
    }

    addGeoData(geoElement: MapElement, options) {
        const me = this;

        let promise: Promise<GeoElement[]>;
        if (geoElement.trackSrc !== undefined && geoElement.trackSrc.length > 20) {
            promise = this.geoLoader.loadData(geoElement.trackSrc, options);
        } else {
            promise = this.geoLoader.loadDataFromUrl(geoElement.trackUrl, options);
        }
        promise.then(function onLoaded(geoElements) {
            const layers = me.convertGeoElementsToLayers(geoElement, geoElements, options);
            if (layers !== undefined) {
                me.addLayer(layers);
                me.fire('loaded', { mapElement: geoElement, layers: layers});
            }
        }).catch(function onError(error) {
            console.error('failed to load gpx for leafletmap', error);
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
                    const point = new L.Marker(geoElement.points[0], {
                        clickable: true,
                        title: gpxElement.type + ': ' + gpxElement.name,
                        icon: new L.DivIcon({className: 'leaflet-div-icon-point', html: '&#128204;' + gpxElement.name})
                    });
                    layers.push(point);
                    break;
                default:
                    if (geoElements.length > 1
                        && ((gpxElement.type === 'TRACK' && geoElement.type === GeoElementType.ROUTE)
                            || (gpxElement.type === 'ROUTE' && geoElement.type === GeoElementType.TRACK))) {
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
