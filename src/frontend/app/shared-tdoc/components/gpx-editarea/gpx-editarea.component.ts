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
import {GeoElementType} from '@dps/mycms-frontend-commons/dist/angular-maps/services/geo.parser';
import {MapElement} from '@dps/mycms-frontend-commons/dist/angular-maps/services/leaflet-geo.plugin';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';

@Component({
    selector: 'app-gpx-editarea',
    templateUrl: './gpx-editarea.component.html',
    styleUrls: ['./gpx-editarea.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GpxEditAreaComponent extends AbstractInlineComponent {
    private trackStatisticService = new TrackStatisticService();
    private gpxParser = new GeoGpxParser();
    private lastGpx = '';

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
    public mergeNewTracks? = false;

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
                        trackSrc = '<trk><trkseg>';
                        trackStatistics.push(this.trackStatisticService.trackStatisticsForGeoElement(geoElement));
                        trackSrc += geoElement.points.map(value => {
                            return '<trkpt lat="' + value.lat + '" lon="' + value.lng + '"><ele>' + value.alt + '</ele></trkpt>';
                        }).join('\n');
                        trackSrc += '</trkseg></trk>';
                        break;
                    case GeoElementType.ROUTE:
                        type = 'ROUTE';
                        trackSrc = '<rte>';
                        trackStatistics.push(this.trackStatisticService.trackStatisticsForGeoElement(geoElement));
                        trackSrc += geoElement.points.map(value => {
                            return '<rtept lat="' + value.lat + '" lon="' + value.lng + '"><ele>' + value.alt + '</ele></rtept>';
                        }).join('\n');
                        trackSrc += '</rte>';
                        break;
                    case GeoElementType.WAYPOINT:
                        type = 'LOCATION';
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
}
