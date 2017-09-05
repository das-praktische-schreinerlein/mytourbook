import {DataSet, Graph3d} from 'vis';
import {GeoLoader} from './geo.loader';

export class VisJsGeoProfileMapPoint {
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

export class VisJsGeoProfileMap {
    graph: Graph3d;
    constructor(private geoLoader: GeoLoader, private src: string, private element: any, private options: {}) {
        this._initialize();
    }

    _initialize() {
        if (this.src) {
            this._addData(this.src, this.element, this.options);
        }
    }

    _addData(url: string, element, options) {
        const me = this;

        this.geoLoader.loadData(url, options).then(function onLoaded(geoElements) {
            const layers = me._convertGeoElementsToDataSet(geoElements, element, options);
            if (layers !== undefined) {
                me.graph = new Graph3d(element, layers, options);
            }
        }).catch(function onError(error) {
            console.error('failed to load gpx for VisJsGeoProfileMap:' + url, error);
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
                    data.add(new VisJsGeoProfileMapPoint({
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
