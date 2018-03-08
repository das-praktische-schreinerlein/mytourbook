import {DataSet, Graph3d} from 'vis';
import {GeoLoader} from './geo.loader';
import {GeoElement} from './geo.parser';

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

export interface VisJsGeoProfileMapDataSource {
    geoLoader: GeoLoader;
    url?: string;
    src?: string;
}

export class VisJsGeoProfileMapStyles {
    public static styles = [
        {
            fill: '#7DC1FF',
            stroke: '#3267D2',
            border: '#3267D2'
        },
        {
            fill: '#ff7726',
            stroke: '#ff1521',
            border: '#ff1521'
        }];
}

Object.defineProperty(Graph3d.prototype, '_redrawBarSizeGraphPoint', { value: function (ctx, point) {
        // calculate size for the bar
        const fraction = (point.point.value - this.valueRange.min) / this.valueRange.range();
        const xWidth = this.xBarWidth / 2 * (fraction * 0.8 + 0.2);
        const yWidth = this.yBarWidth / 2 * (fraction * 0.8 + 0.2);
        let colors;
        const style = point.point.data.style;
        if (style && style < VisJsGeoProfileMapStyles.styles.length) {
            colors = VisJsGeoProfileMapStyles.styles[style];
        } else {
            colors = this._getColorsSize();
        }

        this._redrawBar(ctx, point, xWidth, yWidth, colors.fill, colors.border);
    }
});


export class VisJsGeoProfileMap {
    graph: Graph3d;
    constructor(private dataSources: VisJsGeoProfileMapDataSource[], private element: any, private options: {}) {
        this._initialize();
    }

    _initialize() {
        if (this.dataSources) {
            this._addData(this.dataSources, this.element, this.options);
        }
    }

    _addData(dataSources: VisJsGeoProfileMapDataSource[], element, options) {
        const me = this;
        const promises: Promise<GeoElement[]>[] = [];
        for (const dataSource of dataSources) {
            let promise: Promise<GeoElement[]>;
            if (dataSource.src !== undefined && dataSource.src.length > 20) {
                promise = dataSource.geoLoader.loadData(dataSource.src, options);
            } else {
                promise = dataSource.geoLoader.loadDataFromUrl(dataSource.url, options);
            }
            promises.push(promise);
        }
        Promise.all(promises).then(function onLoaded(arrGeoElements: GeoElement[][]) {
            let allGeoElements: GeoElement[] = [];
            for (const geoElements of arrGeoElements) {
                allGeoElements = allGeoElements.concat(geoElements);
            }
            if (allGeoElements.length <= 0) {
                return;
            }

            const layers = me._convertGeoElementsToDataSet(allGeoElements, element, options);
            if (layers !== undefined) {
                me.graph = new Graph3d(element, layers, options);
            }
        }).catch(function onError(error) {
            console.error('failed to load gpx for VisJsGeoProfileMap:', error);
        });
    }

    _convertGeoElementsToDataSet(geoElements: GeoElement[], element, options): DataSet<any> {
        const data = new DataSet<any>();
        if (!geoElements) {
            return data;
        }

        let counter = 0;
        let style = 0;
        for (let i = 0; i < geoElements.length; i++) {
            const geoElement = geoElements[i];
            for (let p = 0; p < geoElement.points.length; p++) {
                const point = geoElement.points[p];
                if (point.lat && point.lng && point.alt !== undefined) {
                    data.add(new VisJsGeoProfileMapPoint({
                        id: counter++,
                        x: point.lng,
                        y: point.lat,
                        z: point.alt,
                        style: style
                    }));
                }
            }
            style = style + 1;
        }

        return data;
    }
}
