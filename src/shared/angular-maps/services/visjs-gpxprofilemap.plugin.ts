import {GpxLoader} from './gpx.loader';
import {DataSet, Graph3d} from 'vis';

export class VisJsGPXProfileMapPoint {
    x: string;
    y: number;
    z: string;
    style: string;
    id: string;

    constructor(values) {
        this.x = values.x;
        this.y = values.y;
        this.z = values.z;
        this.style = values.style;
        this.id = values.index;
    }
}

export class VisJsGPXProfileMap {
    graph: Graph3d;
    constructor(private gpxLoader: GpxLoader, private gpx: string,  private element: any, private options: {}) {
        this._initialize();
    }

    _initialize() {
        if (this.gpx) {
            this._addGPX(this.gpx, this.element, this.options);
        }
    }

    _addGPX(url: string, element, options) {
        const me = this;

        this.gpxLoader.loadGpx(url, options).then(function onLoaded(geoElements) {
            const layers = me._convertGeoElementsToDataSet(geoElements, element, options);
            if (layers !== undefined) {
                me.graph = new Graph3d(element, layers, options);
            }
        }).catch(function onError(error) {
            console.error('failed to load gpx for VisJsGPXProfileMap:' + url, error);
        });
    }

    _convertGeoElementsToDataSet(geoElements, element, options): DataSet<any> {
        const data = new DataSet<any>();
        if (!geoElements) {
            return data;
        }

        let counter = 0;
        for (let i = 0; i < geoElements.length; i++) {
            const geoElement = geoElements[i];
            for (let p = 0; p < geoElement.points.length; p++) {
                const point = geoElement.points[p];
                if (point.lat && point.lng && point.alt !== undefined) {
                    data.add(new VisJsGPXProfileMapPoint({
                        id: counter++,
                        x: point.lat,
                        y: point.lng,
                        z: point.alt,
                        style: 50
                    }));
                }
            }
        }

        return data;
    }
}
