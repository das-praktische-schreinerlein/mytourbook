/**
 * inspired by leaflet-plugins
  */
import layers = L.control.layers;
import {GeoElementType} from './gpx.parser';
import {GpxLoader} from './gpx.loader';
export class GPX extends L.FeatureGroup {
    options: any;
    _layers: {};
    layers: {};
    gpxLoader: GpxLoader;

    constructor(gpxLoader: GpxLoader, gpx: string, options: {}) {
        super([]);
        this.gpxLoader = gpxLoader;
        this.initialize(gpxLoader, gpx, options);
    }

    initialize(gpxLoader: GpxLoader, gpx: string, options: {}) {
        this.gpxLoader = gpxLoader;
        L.Util.setOptions(this, options);
        this._layers = {};

        if (gpx) {
            this.addGPX(gpx, options);
        }
    }

    addGPX(url: string, options) {
        const me = this;

        this.gpxLoader.loadGpx(url, options).then(function onLoaded(geoElements) {
            const layers = me.convertGeoElementsToLayers(url, geoElements, options);
            if (layers !== undefined) {
                me.addLayer(layers);
                me.fire('loaded', { url: url, layers: layers});
            }
        }).catch(function onError(error) {
            console.error('failed to load gpx for leeafletmap:' + url, error);
        });
    }

    convertGeoElementsToLayers(url, geoElements, options) {
        if (!geoElements) {
            this.fire('error');
            return;
        }

        const layers = [];
        for (let i = 0; i < geoElements.length; i++) {
            const geoElement = geoElements[i];
            switch (geoElement.type) {
                case GeoElementType.WAYPOINT:
                    const point = new L.Marker(geoElement.points[0], options);
                    if (geoElement.name) {
                        point.bindPopup(geoElement.name);
                    }
                    layers.push(point);
                    this.fire('addpoint', { url: url, point: point});
                    break;
                default:
                    const line = new L.Polyline(geoElement.points, options);
                    if (geoElement.name) {
                        line.bindPopup(geoElement.name);
                    }
                    layers.push(line);
                    this.fire('addline', { url: url, line: [line]});
                    break;
            }
        }


        if (!layers.length) {
            return;
        }

        return  new L.FeatureGroup(layers);
    }
}
