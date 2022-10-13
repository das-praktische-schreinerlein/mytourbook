import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import {TourDocRecord, TourDocRecordFactory} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {GeoGpxParser} from '@dps/mycms-frontend-commons/dist/angular-maps/services/geogpx.parser';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {DOCUMENT} from '@angular/common';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import * as L from 'leaflet';
import {LatLng} from 'leaflet';
import {GeoLocationService} from '@dps/mycms-commons/dist/commons/services/geolocation.service';

@Component({
    selector: 'app-gpx-editloc',
    templateUrl: './gpx-editloc.component.html',
    styleUrls: ['./gpx-editloc.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GpxEditLocComponent extends AbstractInlineComponent {

    private geoLocationService = new GeoLocationService();
    private geoLocMap: L.Map;

    private lastGpx = '';
    private lastGeoLoc = '';
    private lastName = '';
    geoLocRecords: TourDocRecord[] = [];

    @Input()
    public name: string;

    @Input()
    public type: string;

    @Input()
    public subtype: string;

    @Input()
    public gpxSrc: string;

    @Input()
    public geoLoc: string;

    @Output()
    public saveTrackSrc: EventEmitter<string> = new EventEmitter();

    @Output()
    public saveGeoLoc: EventEmitter<string> = new EventEmitter();

    public editGpxLocFormGroup: FormGroup = this.fb.group({
        gpxSrc: this.gpxSrc,
        geoLoc: this.geoLoc,
        geoLocAddress: this.name
    });

    constructor(public fb: FormBuilder, protected toastr: ToastrService, protected cd: ChangeDetectorRef,
                protected appService: GenericAppService, protected tdocDataService: TourDocDataService,
                @Inject(DOCUMENT) private document) {
        super(cd);
    }

    doGeoLocationSearch(selector) {
        const me = this;
        this.geoLocationService.doLocationSearch(selector, this.editGpxLocFormGroup.getRawValue()['geoLocAddress']).then((event: any) => {
            me.editGpxLocFormGroup.patchValue({'geoLoc': event.detail.lat + ',' + event.detail.lon + ',' + 0});
            me.updateGeoData();
        }).catch(reason => {
            console.warn('locationsearch failed', reason);
        });

        return false;
    }

    onGeoLocMapCreated(map: L.Map) {
        this.geoLocMap = map;
    }

    createNewGeoLocArea(): boolean {
        const points = [];
        const geoLoc = this.editGpxLocFormGroup.getRawValue()['geoLoc'];
        if (geoLoc !== undefined && geoLoc !== null && geoLoc.length > 0) {
            const lst = geoLoc ? geoLoc.split(',') : [];
            if (lst.length > 1) {
                const lat = parseFloat(lst[0]);
                const lon = parseFloat(lst[1]);
                let factor;
                let type = this.subtype;
                if (Array.isArray(type) && type.length > 0) {
                    type = type[0];
                }
                switch (type ? type.toString() : '') {
                    case '1':
                        factor = 10;
                        break;
                    case '2':
                        factor = 3;
                        break;
                    case '3':
                        factor = 1;
                        break;
                    case '4':
                        factor = 0.2;
                        break;
                    default:
                        factor = 0.02;
                }

                points.push(new LatLng(lat - factor, lon - factor),
                    new LatLng(lat - factor, lon + factor),
                    new LatLng(lat + factor, lon + factor),
                    new LatLng(lat + factor, lon - factor),
                    new LatLng(lat - factor, lon - factor));
            }
        }

        let newGpx = GeoGpxParser.createNewRouteGpx(this.name, 'AREA', points);
        newGpx = GeoGpxParser.fixXml(newGpx);
        newGpx = GeoGpxParser.fixXmlExtended(newGpx);
        newGpx = GeoGpxParser.reformatXml(newGpx);
        this.setValue('gpxSrc', newGpx);
        this.updateGeoData();

        return false;
    }

    updateGeoLocArea(): boolean {
        if (this.geoLocMap) {
            let newGpx = '';
            this.geoLocMap.eachLayer(layer => {
                if (layer['getPoints']) {
                    const points: LatLng[] = [];
                    // @ts-ignore
                    const markers: L.Marker[] = layer.getPoints();
                    if (markers) {
                        markers.forEach(marker => {
                            points.push(marker.getLatLng());
                        });
                        newGpx += GeoGpxParser.createNewRouteGpx(this.name, 'AREA', points);
                    }
                }
            });

            newGpx = GeoGpxParser.fixXml(newGpx);
            newGpx = GeoGpxParser.fixXmlExtended(newGpx);
            newGpx = GeoGpxParser.reformatXml(newGpx);
            this.setValue('gpxSrc', newGpx);
            this.updateGeoData();
        }

        return false;
    }

    updateGeoLoc(): boolean {
        this.updateGeoData();

        return false;
    }

    updateMap(): boolean {
        const me = this;
        const geoRecords = [];

        let trackSrc = this.editGpxLocFormGroup.getRawValue()['gpxSrc'];
        if (trackSrc !== undefined && trackSrc !== null && trackSrc.length > 0) {
            trackSrc = GeoGpxParser.fixXml(trackSrc);
            trackSrc = GeoGpxParser.fixXmlExtended(trackSrc);
            trackSrc = GeoGpxParser.reformatXml(trackSrc);
            trackSrc = trackSrc.replace(/[\r\n]/g, ' ').replace(/[ ]+/g, ' ');
            geoRecords.push(TourDocRecordFactory.createSanitized({
                id: 'TMPLOC' + (new Date()).getTime(),
                gpsTrackSrc: trackSrc,
                gpsTrackBaseFile: 'tmp.gpx',
                name: this.editGpxLocFormGroup.getRawValue()['name'],
                type: this.type,
                datestart: new Date().toISOString(),
                dateend: new Date().toISOString(),
                dateshow: this.editGpxLocFormGroup.getRawValue()['dateshow']
            }));
        }

        const geoLoc = this.editGpxLocFormGroup.getRawValue()['geoLoc'];
        if (geoLoc !== undefined && geoLoc !== null && geoLoc.length > 0) {
            const lst = geoLoc ? geoLoc.split(',') : [];
            geoRecords.push(TourDocRecordFactory.createSanitized({
                id: 'TMPAREA' + (new Date()).getTime(),
                geoLoc: geoLoc,
                geoLat: lst.length > 1 ? lst[0] : undefined,
                geoLon: lst.length > 1 ? lst[1] : undefined,
                name: this.editGpxLocFormGroup.getRawValue()['name'],
                type: this.type,
                datestart: new Date().toISOString(),
                dateend: new Date().toISOString(),
                dateshow: this.editGpxLocFormGroup.getRawValue()['dateshow']
            }));
        }
        me.geoLocRecords = geoRecords;

        this.cd.markForCheck();

        return false;
    }

    setValue(field: string, value: any): void {
        const config = {};
        config[field] = value;
        this.editGpxLocFormGroup.patchValue(config);
    }

    updateGeoData(): boolean {
        if (this.lastGpx === this.getCurrentGpx() && this.lastGeoLoc === this.getCurrentGeoLoc()) {
            return false;
        }

        this.lastGpx = this.getCurrentGpx();
        this.lastGeoLoc = this.getCurrentGeoLoc();

        const values = this.editGpxLocFormGroup.getRawValue();
        this.prepareSubmitValues(values);
        this.saveTrackSrc.emit(values['gpxSrc']);
        this.saveGeoLoc.emit(values['geoLoc']);

        return this.updateMap();
    }

    protected prepareSubmitValues(values: {}): void {
        if (values['gpxSrc'] !== undefined && values['gpxSrc'] !== null) {
            values['gpxSrc'] = values['gpxSrc'].replace(/\n/g, ' ').replace(/[ ]+/g, ' ');
        }
    }

    protected updateFormComponents(): void {
        this.setCurrentGpx(this.gpxSrc);
        this.setCurrentGeoLoc(this.geoLoc);

        this.setCurrentGeoLocAddress(this.name);
        this.lastName = this.getCurrentGeoLocAddress();

        this.updateGeoData();
        this.cd.markForCheck();
    }

    protected updateData(): void {
        this.updateFormComponents();
    }

    protected setCurrentGpx(value: any): void {
        const config = {};
        config['gpxSrc'] = value;
        this.editGpxLocFormGroup.patchValue(config);
    }

    protected getCurrentGpx(): string {
        return this.editGpxLocFormGroup.getRawValue()['gpxSrc'];
    }

    protected setCurrentGeoLoc(value: any): void {
        const config = {};
        config['geoLoc'] = value;
        this.editGpxLocFormGroup.patchValue(config);
    }

    protected getCurrentGeoLoc(): string {
        return this.editGpxLocFormGroup.getRawValue()['geoLoc'];
    }

    protected setCurrentGeoLocAddress(value: any): void {
        const config = {};
        config['geoLocAddress'] = value;
        this.editGpxLocFormGroup.patchValue(config);
    }

    protected getCurrentGeoLocAddress(): string {
        return this.editGpxLocFormGroup.getRawValue()['geoLocAddress'];
    }
}
