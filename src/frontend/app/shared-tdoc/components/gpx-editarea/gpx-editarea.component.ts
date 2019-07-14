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

    trackColors = new DefaultTrackColors();
    trackRecords: TourDocRecord[] = [];
    editTrackRecords: TourDocRecord[] = [];
    trackStatistic: TrackStatistic = this.trackStatisticService.emptyStatistic();
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
                            // Render thumbnail.
                            let track = e.target.result;
                            // TODO: check checkbox to replace or merge gpx
                            if (me.editGpxFormGroup.getRawValue()['mergeNewTracks'] === true) {
                                track = me.mergeGpx(me.editGpxFormGroup.getRawValue()['gpxSrc'], track);
                            }
                            me.setValue('gpxSrc', GeoGpxParser.reformatXml(track));
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
        let track = this.editGpxFormGroup.getRawValue()['gpxSrc'];
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
            this.setValue('gpxSrc', GeoGpxParser.reformatXml(track));

            const statTrack = track.replace(/<\/trkseg>[ ]*<trkseg>/g, '').replace(/<\/rte>.*?<rtept /g, '<rtept ');
            const geoElements = this.gpxParser.parse(statTrack, {});
            if (geoElements !== undefined && geoElements.length > 0) {
                this.trackStatistic = this.trackStatisticService.trackStatisticsForGeoElement(geoElements[0]);
            } else {
                this.trackStatistic = this.trackStatisticService.emptyStatistic();
            }
        } else {
            this.trackRecords = [];
            this.trackStatistic = this.trackStatisticService.emptyStatistic();
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
        this.setValue('gpxSrc',
            this.deleteGpxTrackSegment(this.editGpxFormGroup.getRawValue()['gpxSrc'], delSegIdx));

        return this.updateGpsTrack();
    }

    mergeTrackSegment(mergeSegIdx: number): boolean {
        this.setValue('gpxSrc',
            this.mergeGpxTrackSegment(this.editGpxFormGroup.getRawValue()['gpxSrc'], mergeSegIdx));

        return this.updateGpsTrack();
    }

    jumpToTrackSegment(delSegIdx: number): boolean {
        const track: string = this.editGpxFormGroup.getRawValue()['gpxSrc'];
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
        let track = this.editGpxFormGroup.getRawValue()['gpxSrc'];
        if (track !== undefined && track !== null && track.length > 0) {
            track = GeoGpxParser.fixXml(track);
            track = GeoGpxParser.fixXmlExtended(track);
            track = GeoGpxParser.reformatXml(track);
            this.setValue('gpxSrc', track);
        }

        return this.updateGpsTrack();
    }

    setMapElementsRendered(mapElements: MapElement[]): void {
        this.renderedMapElements = [].concat(mapElements);
        this.cd.markForCheck();
    }

    updateGpsTrack(): boolean {
        const values = this.editGpxFormGroup.getRawValue();
        this.prepareSubmitValues(values);
        this.save.emit(values['gpxSrc']);

        return this.updateMap();
    }

    protected deleteGpxTrackSegment(track: string, delSegIdx: number): string {
        if (track === undefined || track === null || track.length <= 0 || delSegIdx < 0) {
            return track;
        }

        let newTrack = track;
        const lastPos = StringUtils.findNeedle(track, '<trkseg>', delSegIdx);
        if (lastPos >= 0) {
            newTrack = track.substring(0, lastPos - 1);
            const endPos = track.indexOf('</trkseg>', lastPos);
            if (endPos >= 0) {
                newTrack += track.substring(endPos + '</trkseg>'.length, track.length);
            }
        }

        return track;
    }

    protected mergeGpxTrackSegment(track: string, mergeSegIdx: number): string {
        if (track === undefined || track === null || track.length <= 0 || mergeSegIdx <= 0) {
            return track;
        }

        let newTrack = track;
        const lastPos = StringUtils.findNeedle(track, '</trkseg>', mergeSegIdx - 1);
        if (lastPos >= 0) {
            newTrack = track.substring(0, lastPos - 1);
            const endPos = track.indexOf('<trkseg>', lastPos);
            if (endPos >= 0) {
                newTrack += track.substring(endPos + '<trkseg>'.length, track.length);
            }
        }

        return newTrack;
    }

    protected mergeGpx(track1: string, track2: string): string {
        if (track1 === undefined || track1 === null) {
            return track2;
        }
        if (track2 === undefined || track2 === null) {
            return track1;
        }

        track1 = GeoGpxParser.fixXml(track1);
        track1 = GeoGpxParser.fixXmlExtended(track1);
        track2 = GeoGpxParser.fixXml(track2);
        track2 = GeoGpxParser.fixXmlExtended(track2);

        let newTrack = '   ';
        for (const track of [track1, track2]) {
            for (const element of [['<trk>', '</trk>'], ['<rte>', '</rte>'], ['<wpt', '>']]) {
                let lastPos = -1;
                let idx = -1;
                do {
                    idx++;
                    lastPos = StringUtils.findNeedle(track, element[0], idx);
                    if (lastPos >= 0) {
                        const endPos = track.indexOf(element[1], lastPos);
                        if (endPos >= 0) {
                            newTrack += track.substring(lastPos, endPos + element[1].length);
                        }
                    }
                } while (lastPos >= 0);
            }
        }

        if (!(newTrack.indexOf('<gpx ') >= 0) && !(newTrack.indexOf('<gpx>') >= 0)) {
            newTrack = '<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1"' +
                ' xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3"' +
                ' xmlns:wptx1="http://www.garmin.com/xmlschemas/WaypointExtension/v1"' +
                ' xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1"' +
                ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
                ' xsi:schemaLocation="http://www.topografix.com/GPX/1/1' +
                '     http://www.topografix.com/GPX/1/1/gpx.xsd' +
                '     http://www.garmin.com/xmlschemas/GpxExtensions/v3' +
                '     http://www8.garmin.com/xmlschemas/GpxExtensionsv3.xsd' +
                '     http://www.garmin.com/xmlschemas/WaypointExtension/v1' +
                '     http://www8.garmin.com/xmlschemas/WaypointExtensionv1.xsd' +
                '     http://www.garmin.com/xmlschemas/TrackPointExtension/v1' +
                '     http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd">' + newTrack;
        }
        if (!(newTrack.startsWith('<?xml'))) {
            newTrack = '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>' + newTrack;
        }
        newTrack = GeoGpxParser.fixXml(newTrack);
        newTrack = GeoGpxParser.fixXmlExtended(newTrack);

        return newTrack;
    }

    protected prepareSubmitValues(values: {}): void {
        if (values['gpxSrc'] !== undefined && values['gpxSrc'] !== null) {
            values['gpxSrc'] = values['gpxSrc'].replace(/\n/g, ' ').replace(/[ ]+/g, ' ');
        }
    }

    protected updateFormComponents(): void {
        this.setValue('gpxSrc', this.gpxSrc);
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

    protected setValue(field: string, value: any): void {
        const config = {};
        config[field] = value;
        this.editGpxFormGroup.patchValue(config);
    }
}
