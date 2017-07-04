import {AfterViewChecked, Component, Input, OnChanges, SimpleChange} from '@angular/core';
import {Http} from '@angular/http';
import {GpxLoader} from '../../services/gpx.loader';
import {GpxParser} from '../../services/gpx.parser';
import {VisJsGPXProfileMap} from '../../services/visjs-gpxprofilemap.plugin';
import LatLng = L.LatLng;
import {ComponentUtils} from '../../../angular-commons/services/component.utils';

@Component({
    selector: 'app-visjs-profilemap',
    templateUrl: './visjs-profilemap.component.html'
})
export class VisJsProfileMapComponent implements AfterViewChecked, OnChanges {
    private gpxLoader: GpxLoader;

    initialized: boolean;

    @Input()
    public mapId: string;

    @Input()
    public height: string;

    @Input()
    public trackUrls: string[];

    constructor(private http: Http) {
        this.gpxLoader = new GpxLoader(http, new GpxParser());
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
            const mapProfileObj = new VisJsGPXProfileMap(this.gpxLoader, trackUrl, container, options);
        }
    }
}
