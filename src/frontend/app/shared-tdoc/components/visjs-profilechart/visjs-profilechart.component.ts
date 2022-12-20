import {AfterViewChecked, ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChange} from '@angular/core';
import {MinimalHttpBackendClient} from '@dps/mycms-commons/dist/commons/services/minimal-http-backend-client';
import {GeoLoader} from '@dps/mycms-frontend-commons/dist/angular-maps/services/geo.loader';
import {GeoGpxParser} from '@dps/mycms-frontend-commons/dist/angular-maps/services/geogpx.parser';
import {GeoJsonParser} from '@dps/mycms-frontend-commons/dist/angular-maps/services/geojson.parser';
import {ComponentUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/component.utils';
import {MapElement} from '@dps/mycms-frontend-commons/dist/angular-maps/services/leaflet-geo.plugin';
import {
    VisJsGeoProfileMap,
    VisJsGeoProfileMapDataSource,
    VisJsGeoProfileMapPoint
} from '@dps/mycms-frontend-commons/dist/angular-maps/services/visjs-geoprofilemap.plugin';
import {GeoElement} from '@dps/mycms-frontend-commons/dist/angular-maps/services/geo.parser';
import {DataSet} from 'vis';
import {LatLng} from 'leaflet';


export interface ChartElement extends MapElement {
}

export class VisJsProfileDistanceChart extends VisJsGeoProfileMap {
    convertGeoElementsToDataSet(geoElements: GeoElement[], element, options): DataSet<any> {
        const data = new DataSet<any>();
        if (!geoElements) {
            return data;
        }

        let counter = 0;
        let style = 0;
        const names = {};
        let nameCount = 1;
        for (let i = 0; i < geoElements.length; i++) {
            const geoElement = geoElements[i];
            if (geoElement === undefined) {
                continue;
            }
            if (!names[geoElement.name]) {
                names[geoElement.name] = nameCount++;
            }
        }


        for (let i = 0; i < geoElements.length; i++) {
            const geoElement = geoElements[i];
            if (geoElement === undefined) {
                continue;
            }

            let lastPoint: LatLng = undefined;
            let dist = 0;
            for (let p = 0; p < geoElement.points.length; p++) {
                const point = geoElement.points[p];
                if (point.lat && point.lng && point.alt !== undefined) {
                    dist += lastPoint !== undefined
                        ? point.distanceTo(lastPoint)
                        : 0;
                    data.add(new VisJsGeoProfileMapPoint({
                        id: counter++,
                        x: names[geoElement.name],
                        y: dist / 1000,
                        z: point.alt,
                        style: style
                    }));
                    lastPoint = point;
                }
            }
            style = style + 1;
        }

        return data;
    }

}

export class VisJsProfileTimeChart extends VisJsGeoProfileMap {
    convertGeoElementsToDataSet(geoElements: GeoElement[], element, options): DataSet<any> {
        const data = new DataSet<any>();
        if (!geoElements) {
            return data;
        }

        let counter = 0;
        let style = 0;
        const names = {};
        const times = {};
        let nameCount = 1;
        let timeCount = 1;


        for (let i = 0; i < geoElements.length; i++) {
            const geoElement = geoElements[i];
            let lastPoint: LatLng = undefined;
            let dist = 0;
            for (let p = 0; p < geoElement.points.length; p++) {
                const point = geoElement.points[p];
                if (point.lat && point.lng && point.alt !== undefined) {
                    const geoElement = geoElements[i];
                    dist += lastPoint !== undefined
                        ? point.distanceTo(lastPoint)
                        : 0;

                    if (!names[geoElement.name]) {
                        names[geoElement.name] = nameCount++;
                    }
                    if (!times[point['time']]) {
                        times[point['time']] = timeCount++;
                    }
                    data.add(new VisJsGeoProfileMapPoint({
                        id: counter++,
                        x: names[geoElement.name],
                        y: times[point['time']],
                        z: point.alt,
                        style: style
                    }));
                    lastPoint = point;
                }
            }
            style = style + 1;
        }

        return data;
    }

}

@Component({
    selector: 'app-visjs-profilechart',
    templateUrl: './visjs-profilechart.component.html',
    styleUrls: ['./visjs-profilechart.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisJsProfileChartComponent implements AfterViewChecked, OnChanges {
    private readonly gpxLoader: GeoLoader;
    private readonly jsonLoader: GeoLoader;

    initialized: boolean;
    flgfullScreen = false;
    chartHeight = '';

    @Input()
    public chartId: string;

    @Input()
    public height: string;

    @Input()
    public chartElements: MapElement[];

    @Input()
    public flgGenerateNameFromGpx?: boolean;

    @Input()
    public flagTimeChart ? = false;

    constructor(private http: MinimalHttpBackendClient) {
        this.gpxLoader = new GeoLoader(http, new GeoGpxParser());
        this.jsonLoader = new GeoLoader(http, new GeoJsonParser());
    }

    ngAfterViewChecked() {
        if (this.initialized) {
            return;
        }

        this.initialized = true;
        this.renderChart();
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (this.initialized && ComponentUtils.hasNgChanged(changes)) {
            this.renderChart();
        }
    }

    toggleFullScreen() {
        this.flgfullScreen = !this.flgfullScreen;
        this.renderChart();
    }

    private renderChart() {
        if (!this.initialized || !this.chartId) {
            return;
        }

        this.chartHeight = this.flgfullScreen ? window.innerHeight + 'px' : this.height;
        const dataSources: VisJsGeoProfileMapDataSource[] = [];
        for (let i = 0; i < this.chartElements.length; i++) {
            let trackSrc = this.chartElements[i].trackSrc;
            const trackUrl = this.chartElements[i].trackUrl;
            const point = this.chartElements[i].point;
            // specify options
            let loader: GeoLoader;
            if ((trackSrc === undefined || trackSrc === null) && (trackUrl === undefined || trackUrl === null) && point !== undefined) {
                trackSrc = '{ "track": {' +
                    '"tId":"dummy",' +
                    '"tName":"' + this.chartElements[i].name.replace(/[^-a-zA-Z0-9+ .;,:]+/g, '') + '",' +
                    '"color":"Red",' +
                    '"colorIdx":"0",' +
                    '"type":"' + this.chartElements[i].type + '",' +
                    '"header":["lat","lon","ele"],' +
                    '"records":[[' + point.lat + ', ' + point.lng
                        + ', ' + (point.alt ? point.alt : 0) + ', ' + (point['time'] ? '"' + point['time'] + '"' : undefined) + ']]}}';
                loader = this.jsonLoader;
            } else if ((trackUrl !== undefined && trackUrl.endsWith('.gpx'))
                || (trackSrc !== undefined && trackSrc !== null
                    && (trackSrc.indexOf('<trkpt') >= 0 || trackSrc.indexOf('<rtept') >= 0))) {
                loader = this.gpxLoader;
            } else {
                loader = this.jsonLoader;
            }

            dataSources.push({ geoLoader: loader, url: trackUrl, src: trackSrc});
        }

        if (dataSources.length > 0) {
            const options = {
                generateName: this.flgGenerateNameFromGpx,
                width:  '100%',
                height: this.chartHeight,
                style: 'bar-size',
                showPerspective: true,
                showGrid: true,
                showShadow: false,
                keepAspectRatio: true,
                verticalRatio: 0.2,
                xBarWidth: 0.004,
                yBarWidth: 0.004,
                xLabel: 'Tour',
                yLabel: 'km',
                zLabel: 'm',
                cameraPosition: {
                    horizontal: 1.0,
                    vertical: 0.5,
                    distance: 2
                },
                tooltip: function (data) {
                    return 'Hoehe:' +  data.data.z;
                }
            };
            const container = document.getElementById(this.chartId);
            this.flagTimeChart   // NOSONAR do not remove !!!
                ? new VisJsProfileTimeChart(dataSources, container, options)
                : new VisJsProfileDistanceChart(dataSources, container, options);
        }
    }
}
