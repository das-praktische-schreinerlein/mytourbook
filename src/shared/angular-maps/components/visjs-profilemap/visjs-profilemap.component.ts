import {AfterViewChecked, ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChange} from '@angular/core';
import {GeoLoader} from '../../services/geo.loader';
import {GeoJsonParser} from '../../services/geojson.parser';
import {GeoGpxParser} from '../../services/geogpx.parser';
import {VisJsGeoProfileMap} from '../../services/visjs-geoprofilemap.plugin';
import {ComponentUtils} from '../../../angular-commons/services/component.utils';
import {MinimalHttpBackendClient} from '../../../commons/services/minimal-http-backend-client';

@Component({
    selector: 'app-visjs-profilemap',
    templateUrl: './visjs-profilemap.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisJsProfileMapComponent implements AfterViewChecked, OnChanges {
    private gpxLoader: GeoLoader;
    private jsonLoader: GeoLoader;

    initialized: boolean;

    @Input()
    public mapId: string;

    @Input()
    public height: string;

    @Input()
    public trackUrls: string[];

    @Input()
    public flgGenerateNameFromGpx?: boolean;

    constructor(private http: MinimalHttpBackendClient) {
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
        if (!this.initialized || !this.mapId) {
            return;
        }

        for (let i = 0; i < this.trackUrls.length; i++) {
            const trackUrl = this.trackUrls[i];
            // specify options
            const options = {
                generateName: this.flgGenerateNameFromGpx,
                width:  '100%',
                height: this.height,
                style: 'bar-size',
                showPerspective: true,
                showGrid: true,
                showShadow: false,
                keepAspectRatio: true,
                verticalRatio: 0.2,
                xBarWidth: 0.004,
                yBarWidth: 0.004,
                xLabel: 'lat',
                yLabel: 'lon',
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
            const container = document.getElementById(this.mapId);
            let loader: GeoLoader;
            if (trackUrl.endsWith('.gpx')) {
                loader = this.gpxLoader;
            } else {
                loader = this.jsonLoader;
            }
            const mapProfileObj = new VisJsGeoProfileMap(loader, trackUrl, container, options);
        }
    }
}
