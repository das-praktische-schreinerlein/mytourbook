import {AfterViewChecked, ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChange} from '@angular/core';
import {GeoLoader} from '../../services/geo.loader';
import {GeoJsonParser} from '../../services/geojson.parser';
import {GeoGpxParser} from '../../services/geogpx.parser';
import {VisJsGeoProfileMap} from '../../services/visjs-geoprofilemap.plugin';
import {ComponentUtils} from '../../../angular-commons/services/component.utils';
import {MinimalHttpBackendClient} from '../../../commons/services/minimal-http-backend-client';
import {MapElement} from '../../services/leaflet-geo.plugin';

@Component({
    selector: 'app-visjs-profilemap',
    templateUrl: './visjs-profilemap.component.html',
    styleUrls: ['./visjs-profilemap.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisJsProfileMapComponent implements AfterViewChecked, OnChanges {
    private gpxLoader: GeoLoader;
    private jsonLoader: GeoLoader;

    initialized: boolean;
    flgfullScreen = false;
    mapHeight = '';

    @Input()
    public mapId: string;

    @Input()
    public height: string;

    @Input()
    public mapElements: MapElement[];

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

    toggleFullScreen() {
        this.flgfullScreen = !this.flgfullScreen;
        this.renderMap();
    }

    private renderMap() {
        if (!this.initialized || !this.mapId) {
            return;
        }

        this.mapHeight = this.flgfullScreen ? window.innerHeight + 'px' : this.height;
        for (let i = 0; i < this.mapElements.length; i++) {
            const trackSrc = this.mapElements[i].trackSrc;
            const trackUrl = this.mapElements[i].trackUrl;
            // specify options
            const options = {
                // generateName: this.flgGenerateNameFromGpx,
                width:  '100%',
                height: this.mapHeight,
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
            if ((trackUrl !== undefined && trackUrl.endsWith('.gpx'))
                || (trackSrc !== undefined && trackSrc !== null && (trackSrc.indexOf('<trkpt') || trackSrc.indexOf('<rpt')))) {
                loader = this.gpxLoader;
            } else {
                loader = this.jsonLoader;
            }
            const mapProfileObj = new VisJsGeoProfileMap(loader, trackUrl, trackSrc, container, options);
        }
    }
}
