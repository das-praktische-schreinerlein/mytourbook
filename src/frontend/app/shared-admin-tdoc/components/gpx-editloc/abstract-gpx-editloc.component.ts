import {ChangeDetectorRef, EventEmitter, Inject, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {GeoGpxParser} from '@dps/mycms-frontend-commons/dist/angular-maps/services/geogpx.parser';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {DOCUMENT} from '@angular/common';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {LatLng, LeafletMouseEvent} from 'leaflet';
import {GeoLocationService} from '@dps/mycms-commons/dist/commons/services/geolocation.service';
import {FormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/form.utils';
import {AbstractGeoGpxParser} from '@dps/mycms-commons/dist/geo-commons/services/geogpx.parser';
import {MapDocRecord} from '@dps/mycms-commons/dist/geo-commons/model/map-element.types';

// TODO move to commons
export abstract class AbstractGpxEditLocComponent extends AbstractInlineComponent {

    private geoLocationService = new GeoLocationService();
    private geoLocMap: L.Map;

    private lastGpx = '';
    private lastGeoLoc = '';
    private lastName = '';
    geoLocRecords: MapDocRecord[] = [];

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

    @Input()
    public flgShowArea ? = true;

    @Output()
    public saveTrackSrc: EventEmitter<string> = new EventEmitter();

    @Output()
    public saveGeoLoc: EventEmitter<string> = new EventEmitter();

    @Output()
    public saveAdditionalFields: EventEmitter<{}> = new EventEmitter();

    public editGpxLocFormGroup: FormGroup = this.fb.group({
        gpxSrc: this.gpxSrc,
        geoLoc: this.geoLoc,
        geoLocAddress: this.name,
        geoLocUseMapClickPos: false,
        keywords: '',
        infos: ''
    });

    constructor(public fb: FormBuilder, protected toastr: ToastrService, protected cd: ChangeDetectorRef,
                protected appService: GenericAppService,
                @Inject(DOCUMENT) private document) {
        super(cd);
    }

    doGeoLocationSearch(selector) {
        const me = this;
        this.geoLocationService.doLocationSearch(selector, this.editGpxLocFormGroup.getRawValue()['geoLocAddress']).then((event: any) => {
            me.editGpxLocFormGroup.patchValue({
                'keywords': event.detail.raw
                    ? event.detail.raw.class + '_' +  event.detail.raw.type
                    : ''
            });
            me.editGpxLocFormGroup.patchValue({
                'infos': event.detail.raw
                    ? 'https://www.openstreetmap.org/' + event.detail.raw.osm_type + '/' +  event.detail.raw.osm_id
                    : ''
            });
            me.editGpxLocFormGroup.patchValue({'geoLoc': event.detail.lat + ',' + event.detail.lon + ',' + 0});
            me.updateGeoData();
        }).catch(reason => {
            console.warn('locationsearch failed', reason);
        });

        return false;
    }

    onGeoLocMapCreated(map: L.Map) {
        this.geoLocMap = map;
        const me = this;
        map.on('click', function (event: LeafletMouseEvent) {
            return me.onGeoLocMapClicked(event.latlng);
        });
    }

    onGeoLocMapClicked(position: LatLng) {
        if (position && FormUtils.getStringFormValue(this.editGpxLocFormGroup.getRawValue(), 'geoLocUseMapClickPos') === 'true') {
            this.editGpxLocFormGroup.patchValue({'geoLoc': position.lat + ',' + position.lng + ',' + 0});
            this.cd.markForCheck();
        }
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
                    const markers: Marker[] = layer.getPoints();
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

    updateMap(values: {}): boolean {
        const me = this;
        const geoRecords = [];

        let trackSrc = values['gpxSrc'];
        if (trackSrc !== undefined && trackSrc !== null && trackSrc.length > 0) {
            if (AbstractGeoGpxParser.isResponsibleForSrc(trackSrc)) {
                trackSrc = GeoGpxParser.fixXml(trackSrc);
                trackSrc = GeoGpxParser.fixXmlExtended(trackSrc);
                trackSrc = GeoGpxParser.reformatXml(trackSrc);
                trackSrc = trackSrc.replace(/[\r\n]/g, ' ').replace(/[ ]+/g, ' ');
            }

            geoRecords.push(this.createSanitized({
                id: 'TMPLOC' + (new Date()).getTime(),
                gpsTrackSrc: trackSrc,
                name: values['name'],
                type: this.type,
                datestart: new Date().toISOString(),
                dateend: new Date().toISOString(),
                dateshow: values['dateshow']
            }));
        }

        const geoLoc = values['geoLoc'];
        if (geoLoc !== undefined && geoLoc !== null && geoLoc.length > 0) {
            const lst = geoLoc ? geoLoc.split(',') : [];
            geoRecords.push(this.createSanitized({
                id: 'TMPAREA' + (new Date()).getTime(),
                geoLoc: geoLoc,
                geoLat: lst.length > 1 ? lst[0] : undefined,
                geoLon: lst.length > 1 ? lst[1] : undefined,
                name: values['name'],
                type: this.type,
                datestart: new Date().toISOString(),
                dateend: new Date().toISOString(),
                dateshow: values['dateshow']
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
        this.saveAdditionalFields.emit(values);

        return this.updateMap(this.editGpxLocFormGroup.getRawValue());
    }

    protected prepareSubmitValues(values: {}): void {
        if (values['gpxSrc'] !== undefined && values['gpxSrc'] !== null) {
            if (AbstractGeoGpxParser.isResponsibleForSrc(values['gpxSrc'])) {
                values['gpxSrc'] = GeoGpxParser.trimXml(values['gpxSrc']);
            }
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

    protected abstract createSanitized(values: {}): MapDocRecord;
}
