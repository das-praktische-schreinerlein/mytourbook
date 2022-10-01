import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import {TourDocRecord, TourDocRecordFactory} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {TrackStatistic, TrackStatisticService} from '@dps/mycms-frontend-commons/dist/angular-maps/services/track-statistic.service';
import {GeoGpxParser} from '@dps/mycms-frontend-commons/dist/angular-maps/services/geogpx.parser';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {FileSystemFileEntry, UploadEvent} from 'ngx-file-drop';
import {GpsTrackValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {StringUtils} from '@dps/mycms-commons/dist/commons/utils/string.utils';
import {DefaultTrackColors, TourDocContentUtils} from '../../services/tdoc-contentutils.service';
import {DOCUMENT} from '@angular/common';
import {GeoElementType, LatLngTime} from '@dps/mycms-frontend-commons/dist/angular-maps/services/geo.parser';
import {MapElement} from '@dps/mycms-frontend-commons/dist/angular-maps/services/leaflet-geo.plugin';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import * as L from 'leaflet';
import {LatLng} from 'leaflet';

@Component({
    selector: 'app-gpx-editarea',
    templateUrl: './gpx-editarea.component.html',
    styleUrls: ['./gpx-editarea.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GpxEditAreaComponent extends AbstractInlineComponent {
    public static readonly _DEFAULT_LAT = 51.9746413082;
    public static readonly _DEFAULT_LON = 13.8;
    public static readonly _DEFAULT_ALT = -99999;
    public static readonly _DEFAULT_TIMESTAMP = new Date(0);

    private trackStatisticService = new TrackStatisticService();
    private gpxParser = new GeoGpxParser();
    private lastGpx = '';
    private lastName = '';
    private geoMap: L.Map;

    trackColors = new DefaultTrackColors();
    trackRecords: TourDocRecord[] = [];
    editTrackRecords: TourDocRecord[] = [];
    renderedMapElements: MapElement[] = [];
    trackSegmentStatistics: TrackStatistic[] = [];

    public editGpxFormGroup: FormGroup = this.fb.group({
        gpxSrc: '',
        mergeNewTracks: false
    });

    @Input()
    public type: string;

    @Input()
    public gpxSrc: string;

    @Input()
    public mergeNewTracks ? = false;

    @Input()
    public defaultPosition ? = GpxEditAreaComponent.createDefaultPosition();

    @Output()
    public save: EventEmitter<string> = new EventEmitter();

    constructor(public fb: FormBuilder, protected toastr: ToastrService, protected cd: ChangeDetectorRef,
                protected appService: GenericAppService, protected tdocDataService: TourDocDataService,
                protected contentUtils: TourDocContentUtils, @Inject(DOCUMENT) private document) {
        super(cd);
    }

    gpxDropped(event: UploadEvent) {
        const me = this;
        for (const droppedFile of event.files) {
            if (droppedFile.fileEntry.isFile) {
                const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
                fileEntry.file((file: File) => {
                    const reader = new FileReader();
                    const maxLength = (<GpsTrackValidationRule>TourDocRecord.tdocFields.gpsTrackSrc.validator).getMaxLength();
                    if (file.size > maxLength) {
                        me.toastr.warning('Die GPX-Datei darf höchstes ' + maxLength / 1000000 + 'MB sein.', 'Oje!');
                        return;
                    }
                    if (!file.name.toLowerCase().endsWith('.gpx')) {
                        me.toastr.warning('Es dürfen nur .gpx Dateien geladen werden.', 'Oje!');
                        return;
                    }

                    reader.onload = (function(theFile) {
                        return function(e) {
                            let track = e.target.result;
                            if (me.editGpxFormGroup.getRawValue()['mergeNewTracks'] === true) {
                                track = GeoGpxParser.mergeGpx(me.getCurrentGpx(), track);
                            }
                            me.setCurrentGpx(GeoGpxParser.reformatXml(track));

                            return me.updateGpsTrack();
                        };
                    })(file);

                    // Read in the file as a data URL.
                    reader.readAsText(file);
                });

                return;
            }
        }
    }

    updateMap(): boolean {
        let track = this.getCurrentGpx();
        this.trackColors.setCurrent(0);
        if (track !== undefined && track !== null && track.length > 0) {
            track = track.replace(/[\r\n]/g, ' ').replace(/[ ]+/g, ' ');
            this.trackRecords = [TourDocRecordFactory.createSanitized({
                id: 'TMP' + (new Date()).getTime(),
                gpsTrackSrc: track,
                gpsTrackBaseFile: 'tmp.gpx',
                name: new Date().toISOString(),
                type: this.type,
                datestart: new Date().toISOString(),
                dateend: new Date().toISOString(),
                dateshow: new Date().toISOString()
            })];
            this.setCurrentGpx(GeoGpxParser.reformatXml(track));
        } else {
            this.trackRecords = [];
        }

        this.generateTrackSegments(track);
        this.renderedMapElements = [];
        this.cd.markForCheck();

        return false;
    }

    generateTrackSegments(track: string): void {
        if (track === undefined || track === null || track.length <= 0) {
            this.trackSegmentStatistics = [];
            this.editTrackRecords = [];
        }

        const geoElements = this.gpxParser.parse(track, {});
        if (geoElements !== undefined && geoElements.length > 0) {
            const trackStatistics = [];
            const editTrackRecords = [];
            for (const geoElement of geoElements) {
                let trackSrc = '';
                let type = 'TRACK';
                switch (geoElement.type) {
                    case GeoElementType.TRACK:
                        type = 'TRACK';
                        this.lastName = geoElement.name;
                        trackSrc = '<trk><trkseg>';
                        trackStatistics.push(this.trackStatisticService.trackStatisticsForGeoElement(geoElement));

                        trackSrc += geoElement.points.map(value => {
                            return '<trkpt lat="' + value.lat + '" lon="' + value.lng + '">' +
                                '<ele>' + value.alt + '</ele>' +
                                (value['time'] ? '<time>' + value['time'].toISOString() + '</time>' : '') +
                                '</trkpt>';
                        }).join('\n');
                        trackSrc += '</trkseg></trk>';

                        break;
                    case GeoElementType.ROUTE:
                        type = 'ROUTE';
                        this.lastName = geoElement.name;
                        trackSrc = '<rte>';
                        trackStatistics.push(this.trackStatisticService.trackStatisticsForGeoElement(geoElement));

                        trackSrc += geoElement.points.map(value => {
                            return '<rtept lat="' + value.lat + '" lon="' + value.lng + '"><ele>' + value.alt + '</ele></rtept>';
                        }).join('\n');

                        trackSrc += '</rte>';

                        break;
                    case GeoElementType.WAYPOINT:
                        type = 'LOCATION';
                        this.lastName = geoElement.name;
                        trackStatistics.push(this.trackStatisticService.trackStatisticsForGeoElement(geoElement));

                        trackSrc += geoElement.points.map(value => {
                            return '<wpt lat="' + value.lat + '" lon="' + value.lng + '"></wpt>';
                        }).join('\n');

                        break;
                }

                trackSrc = GeoGpxParser.fixXml(trackSrc);
                trackSrc = GeoGpxParser.fixXmlExtended(trackSrc);
                trackSrc = GeoGpxParser.reformatXml(trackSrc);
                editTrackRecords.push(TourDocRecordFactory.createSanitized({
                    id: 'TMP' + (new Date()).getTime(),
                    gpsTrackSrc: trackSrc,
                    gpsTrackBaseFile: 'tmp.gpx',
                    name: geoElement.name || new Date().toISOString(),
                    type: type,
                    datestart: new Date().toISOString(),
                    dateend: new Date().toISOString(),
                    dateshow: new Date().toISOString()
                }));
            }

            this.editTrackRecords = editTrackRecords;
            this.trackSegmentStatistics = trackStatistics;
        } else {
            this.trackSegmentStatistics = [];
            this.editTrackRecords = [];
        }
    }

    deleteTrackSegment(delSegIdx: number): boolean {
        this.setCurrentGpx(
            GeoGpxParser.deleteGpxTrackSegment(this.getCurrentGpx(), delSegIdx));

        return this.updateGpsTrack();
    }

    mergeTrackSegment(mergeSegIdx: number): boolean {
        this.setCurrentGpx(
            GeoGpxParser.mergeGpxTrackSegment(this.getCurrentGpx(), mergeSegIdx));

        return this.updateGpsTrack();
    }

    jumpToTrackSegment(delSegIdx: number): boolean {
        const track: string = this.getCurrentGpx();
        if (track !== undefined && track !== null && track.length > 0) {
            const lastPos = StringUtils.findNeedle(track, '<trkseg>', delSegIdx);
            if (lastPos >= 0) {
                const element = this.document.getElementById('gpxSrc');
                if (!element) {
                    return false;
                }

                element.focus();
                this.setSelectionRangeOnInput(element, lastPos, lastPos);
            }

        }

        return false;
    }

    fixMap(): boolean {
        let track = this.getCurrentGpx();
        if (track !== undefined && track !== null && track.length > 0) {
            track = GeoGpxParser.fixXml(track);
            track = GeoGpxParser.fixXmlExtended(track);
            track = GeoGpxParser.reformatXml(track);
            this.setCurrentGpx(track);
        }

        return this.updateGpsTrack();
    }

    setMapElementsRendered(mapElements: MapElement[]): void {
        this.renderedMapElements = [].concat(mapElements);
        this.cd.markForCheck();
    }

    updateGpsTrack(): boolean {
        if (this.lastGpx === this.getCurrentGpx()) {
            return false;
        }

        this.lastGpx = this.getCurrentGpx();
        const values = this.editGpxFormGroup.getRawValue();
        this.prepareSubmitValues(values);
        this.save.emit(values['gpxSrc']);

        return this.updateMap();
    }

    onGeoMapCreated(map: L.Map) {
        this.geoMap = map;
    }

    updateGpsTrackFromMap(): boolean {
        if (this.geoMap) {
            let newGpx = '';
            const segments = [];

            this.geoMap.eachLayer(layer => {
                let points: LatLng[] = [];
                if (layer['getLatLngs']) {
                    // @ts-ignore
                    points = layer.getLatLngs();
                } else if (layer['getPoints']) {
                    // @ts-ignore
                    const markers: L.Marker[] = layer.getPoints();
                    if (markers) {
                        markers.forEach(marker => {
                            points.push(marker.getLatLng());
                        });
                    }
                }

                if (points) {
                    if (this.type === 'TRACK') {
                        segments.push(
                            GpxEditAreaComponent.createGpxTrackSegment(points, this.defaultPosition));
                    } else {
                        newGpx += GpxEditAreaComponent.createGpxRoute(this.lastName, this.type, points, this.defaultPosition);
                    }
                }
            });

            if (this.type === 'TRACK') {
                newGpx += GpxEditAreaComponent.createGpxTrack(this.lastName, this.type, segments);
            }

            newGpx = GeoGpxParser.fixXml(newGpx);
            newGpx = GeoGpxParser.fixXmlExtended(newGpx);
            newGpx = GeoGpxParser.reformatXml(newGpx);

            this.setCurrentGpx(newGpx);
            this.fixMap();
            this.updateData();
        }

        return false;
    }

    createNewGpx(): boolean {
        const me = this;

        const points: LatLng[] = [];
        const lat = this.defaultPosition.lat;
        const lon = this.defaultPosition.lng;
        const factor = 0.01;
        points.push(new LatLngTime(lat - factor, lon - factor, this.defaultPosition.alt, this.defaultPosition.time),
            new LatLngTime(lat - factor, lon + factor, this.defaultPosition.alt, this.defaultPosition.time),
            new LatLngTime(lat + factor, lon - factor, this.defaultPosition.alt, this.defaultPosition.time));

        let track = '';
        if (this.type === 'TRACK') {
            track = GpxEditAreaComponent.createGpxTrack(this.lastName, this.type, [
                GpxEditAreaComponent.createGpxTrackSegment(points, this.defaultPosition)
            ]);
        } else {
            track = GpxEditAreaComponent.createGpxRoute(this.lastName, this.type, points, this.defaultPosition)
        }

        me.setCurrentGpx(GeoGpxParser.reformatXml(track));

        return me.fixMap();
    }


    protected prepareSubmitValues(values: {}): void {
        if (values['gpxSrc'] !== undefined && values['gpxSrc'] !== null) {
            values['gpxSrc'] = values['gpxSrc'].replace(/\n/g, ' ').replace(/[ ]+/g, ' ');
        }
    }

    protected updateFormComponents(): void {
        this.setCurrentGpx(this.gpxSrc);
        this.lastGpx = this.getCurrentGpx();
        this.updateMap();
    }

    protected setSelectionRangeOnInput(input: HTMLInputElement|HTMLTextAreaElement, selectionStart: number, selectionEnd: number) {
        if (input.setSelectionRange) {
            input.focus();
            input.setSelectionRange(selectionStart, selectionEnd);
        }
    }

    protected updateData(): void {
        this.updateFormComponents();
    }

    protected setCurrentGpx(value: any): void {
        const config = {};
        config['gpxSrc'] = value;
        this.editGpxFormGroup.patchValue(config);
    }

    protected getCurrentGpx(): string {
        return this.editGpxFormGroup.getRawValue()['gpxSrc'];
    }

    // TODO move to geogpx.parser
    public static createGpxTrack(name: string, type: string, segments: string[]): string {
        let newGpx = '<trk><type>' + type + '</type><name>' + name + '</name>';
        if (segments) {
            for (let i = 0; i < segments.length; i++) {
                const segment = segments[i];
                newGpx = newGpx + segment;
            }
        }

        newGpx = newGpx + '</trk>';

        return newGpx;
    }

    // TODO move to geogpx.parser
    public static createGpxTrackSegment(points: L.LatLng[], defaultPosition: LatLngTime): string {
        if (!points || points.length <= 0) {
            return '';
        }

        const defaultTime = defaultPosition.time
            ? typeof defaultPosition.time === 'string'
                ? defaultPosition.time
                : defaultPosition.time.toISOString()
            : undefined;
        let lastTime = undefined;
        let newGpx = '<trkseg>';
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            const time = point['time']
                ? typeof point['time'] === 'string'
                    ? point['time']
                    : point['time'].toISOString()
                : lastTime
                    ? lastTime
                    : defaultTime;
            newGpx = newGpx + '<trkpt lat="' + point.lat + '" lon="' + point.lng + '">' +
                '<ele>' + (point['alt'] ? point['alt'] : defaultPosition.alt) + '</ele>' +
                (time ? '<time>' + time + '</time>' : '') +
                '</trkpt>';

            lastTime = time;
        }

        newGpx = newGpx + '</trkseg>';

        return newGpx;
    }

    // TODO move to geogpx.parser
    public static createGpxRoute(name: string, type: string, points: L.LatLng[], defaultPosition: LatLngTime): string {
        if (!points || points.length <= 0) {
            return '';
        }

        const defaultTime = defaultPosition.time
            ? typeof defaultPosition.time === 'string'
                ? defaultPosition.time
                : defaultPosition.time.toISOString()
            : undefined;
        let lastTime = undefined;
        let newGpx = '<rte><type>' + type + '</type><name>' + name + '</name>';
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            const time = point['time']
                ? typeof point['time'] === 'string'
                    ? point['time']
                    : point['time'].toISOString()
                : lastTime
                    ? lastTime
                    : defaultTime;
            newGpx = newGpx + '<rtept lat="' + point.lat + '" lon="' + point.lng + '">' +
                '<ele>' + (point['alt'] ? point['alt'] : defaultPosition.alt) + '</ele>' +
                (time ? '<time>' + time + '</time>' : '') +
                '</rtept>';

            lastTime = time;
        }

        newGpx = newGpx + '</rte>';

        return newGpx;
    }

    // TODO move to geogpx.parser
    public static createDefaultPosition(): LatLngTime {
        return new LatLngTime(GpxEditAreaComponent._DEFAULT_LAT, GpxEditAreaComponent._DEFAULT_LON,
            GpxEditAreaComponent._DEFAULT_ALT, GpxEditAreaComponent._DEFAULT_TIMESTAMP);
    }
}
