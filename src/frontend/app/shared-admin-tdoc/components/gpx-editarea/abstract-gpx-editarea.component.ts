import {ChangeDetectorRef, EventEmitter, Inject, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {TrackStatistic, TrackStatisticService} from '@dps/mycms-frontend-commons/dist/angular-maps/services/track-statistic.service';
import {GeoGpxParser} from '@dps/mycms-frontend-commons/dist/angular-maps/services/geogpx.parser';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {FileSystemFileEntry, UploadEvent} from 'ngx-file-drop';
import {StringUtils} from '@dps/mycms-commons/dist/commons/utils/string.utils';
import {DOCUMENT} from '@angular/common';
import {GeoElementType, LatLngTime} from '@dps/mycms-frontend-commons/dist/angular-maps/services/geo.parser';
import {MapElement} from '@dps/mycms-frontend-commons/dist/angular-maps/services/leaflet-geo.plugin';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {LatLng} from 'leaflet';
import {AbstractGeoGpxParser} from '@dps/mycms-commons/dist/geo-commons/services/geogpx.parser';
import {GeoParserDeterminer} from '@dps/mycms-frontend-commons/dist/angular-maps/services/geo-parser.determiner';
import {DefaultTrackColors, TrackColors} from '@dps/mycms-commons/dist/geo-commons/model/track-colors';
import {CommonDocRecord} from '@dps/mycms-commons/dist/search-commons/model/records/cdoc-entity-record';

// TODO move to commons
export abstract class AbstractGpxEditAreaComponent extends AbstractInlineComponent {
    public static readonly _DEFAULT_LAT = 51.9746413082;
    public static readonly _DEFAULT_LON = 13.8;

    private trackStatisticService = new TrackStatisticService();
    private lastGpx = '';
    private lastName = '';
    private geoMap: L.Map;

    trackColors: TrackColors = new DefaultTrackColors();
    editTrackRecords: CommonDocRecord[] = [];
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
    public defaultPosition ? = AbstractGpxEditAreaComponent.createDefaultPosition();

    @Output()
    public save: EventEmitter<string> = new EventEmitter();

    public static createDefaultPosition(): LatLngTime {
        return new LatLngTime(AbstractGpxEditAreaComponent._DEFAULT_LAT, AbstractGpxEditAreaComponent._DEFAULT_LON, undefined, undefined);
    }

    constructor(public fb: FormBuilder, protected toastr: ToastrService, protected cd: ChangeDetectorRef,
                protected appService: GenericAppService, protected geoParserService: GeoParserDeterminer, protected gpxParser: GeoGpxParser,
                @Inject(DOCUMENT) private document, protected maxGpxFileLength: number) {
        super(cd);
    }

    gpxDropped(event: UploadEvent) {
        const me = this;
        for (const droppedFile of event.files) {
            if (droppedFile.fileEntry.isFile) {
                const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
                fileEntry.file((file: File) => {
                    const reader = new FileReader();
                    const maxLength = this.maxGpxFileLength;
                    if (file.size > maxLength) {
                        me.toastr.warning('Die GPX-Datei darf höchstes ' + maxLength / 1000000 + 'MB groß sein.', 'Oje!');
                        return;
                    }
                    if (!file.name.toLowerCase().endsWith('.gpx')) {
                        me.toastr.warning('Es dürfen nur .gpx Dateien geladen werden.', 'Oje!');
                        return;
                    }

                    reader.onload = (function(theFile) {
                        return function(e) {
                            let track = e.target.result;
                            if (AbstractGeoGpxParser.isResponsibleForSrc(track)) {
                                if (me.editGpxFormGroup.getRawValue()['mergeNewTracks'] === true) {
                                    track = GeoGpxParser.mergeGpx(me.getCurrentGpx(), track);
                                }

                                track = GeoGpxParser.reformatXml(track);
                            }

                            me.setCurrentGpx(track);

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
            if (AbstractGeoGpxParser.isResponsibleForSrc(track)) {
                track = track
                    .replace(/[\r\n]/g, ' ')
                    .replace(/[ ]+/g, ' ');
                track = GeoGpxParser.reformatXml(track);
            }

            this.setCurrentGpx(track);
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
            return;
        }

        const geoParser = this.geoParserService.determineParser(undefined, track);
        if (!geoParser) {
            this.trackSegmentStatistics = [];
            this.editTrackRecords = [];
            return;
        }

        const geoElements = geoParser.parse(track, {});
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
                        const trackStatistic = this.trackStatisticService.trackStatisticsForGeoElement(geoElement);
                        trackStatistic['type'] = type;
                        trackStatistics.push(trackStatistic);

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
                        const routeStatistic = this.trackStatisticService.trackStatisticsForGeoElement(geoElement);
                        routeStatistic['type'] = type;
                        trackStatistics.push(routeStatistic);

                        trackSrc += geoElement.points.map(value => {
                            return '<rtept lat="' + value.lat + '" lon="' + value.lng + '"><ele>' + value.alt + '</ele></rtept>';
                        }).join('\n');

                        trackSrc += '</rte>';

                        break;
                    case GeoElementType.WAYPOINT:
                        type = 'LOCATION';
                        this.lastName = geoElement.name;
                        const locStatistic = this.trackStatisticService.trackStatisticsForGeoElement(geoElement);
                        locStatistic['type'] = type;
                        trackStatistics.push(locStatistic);

                        trackSrc += geoElement.points.map(value => {
                            return '<wpt lat="' + value.lat + '" lon="' + value.lng + '"></wpt>';
                        }).join('\n');

                        break;
                }

                trackSrc = GeoGpxParser.fixXml(trackSrc);
                trackSrc = GeoGpxParser.fixXmlExtended(trackSrc);
                trackSrc = GeoGpxParser.reformatXml(trackSrc);
                editTrackRecords.push(this.createSanitized({
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
            if (AbstractGeoGpxParser.isResponsibleForSrc(track)) {
                track = GeoGpxParser.fixXml(track);
                track = GeoGpxParser.fixXmlExtended(track);
                track = GeoGpxParser.reformatXml(track);
            }

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
                    const markers: Marker[] = layer.getPoints();
                    if (markers) {
                        markers.forEach(marker => {
                            points.push(marker.getLatLng());
                        });
                    }
                }

                if (points) {
                    if (this.type === 'TRACK') {
                        segments.push(
                            this.gpxParser.createGpxTrackSegment(points, undefined));
                    } else {
                        newGpx += this.gpxParser.createGpxRoute(this.lastName, this.type, points, undefined);
                    }
                }
            });

            if (this.type === 'TRACK') {
                newGpx += this.gpxParser.createGpxTrack(this.lastName, this.type, segments);
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
            track = this.gpxParser.createGpxTrack(this.lastName, this.type, [
                this.gpxParser.createGpxTrackSegment(points, this.defaultPosition)
            ]);
        } else {
            track = this.gpxParser.createGpxRoute(this.lastName, this.type, points, this.defaultPosition)
        }

        me.setCurrentGpx(GeoGpxParser.reformatXml(track));

        return me.fixMap();
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


    protected abstract createSanitized(values: {}): CommonDocRecord;

}
