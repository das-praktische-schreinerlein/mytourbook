import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {MapElement} from '@dps/mycms-frontend-commons/dist/angular-maps/services/leaflet-geo.plugin';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {StringUtils} from '@dps/mycms-commons/dist/commons/utils/string.utils';
import {LatLng} from 'leaflet';
import {MapContentUtils} from '../../services/map-contentutils.service';
import {TrackColors} from '@dps/mycms-commons/dist/geo-commons/model/track-colors';
import {MapDocRecord} from '@dps/mycms-commons/dist/geo-commons/model/map-element.types';

@Component({
    selector: 'app-tdoc-map',
    templateUrl: './tdoc-map.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocMapComponent extends AbstractInlineComponent {
    showLoadingSpinner = false;
    mapElements: MapElement[] = [];
    centerOnMapElements: MapElement[] = undefined;
    mapElementsReverseMap = new Map<MapElement, MapDocRecord>();

    @Input()
    public mapId: string;

    @Input()
    public height: string;

    @Input()
    public docRecords: MapDocRecord[];

    @Input()
    public currentDocId?: string;

    @Input()
    public mapCenterPos: LatLng;

    @Input()
    public mapZoom: number;

    @Input()
    public showImageTrackAndGeoPos ? = false;

    @Input()
    public trackColors?: TrackColors;

    @Input()
    public editable ? = false;

    @Output()
    public mapCreated: EventEmitter<L.Map> = new EventEmitter();

    @Output()
    public centerChanged: EventEmitter<LatLng> = new EventEmitter();

    @Output()
    public docClicked: EventEmitter<MapDocRecord> = new EventEmitter();

    @Output()
    public mapElementsFound: EventEmitter<MapElement[]> = new EventEmitter();

    constructor(private contentUtils: MapContentUtils, protected cd: ChangeDetectorRef,
                private platformService: PlatformService) {
        super(cd);
    }

    onTrackClicked(mapElement: MapElement) {
        this.docClicked.emit(this.mapElementsReverseMap.get(mapElement));
    }

    onMapElementsLoaded(mapElements: MapElement[]) {
        this.showLoadingSpinner = false;
        this.cd.detectChanges();
    }

    onMapCreated(map: L.Map) {
        this.mapCreated.emit(map);
    }

    renderMap() {
        this.mapElementsReverseMap.clear();
        this.centerOnMapElements = undefined;
        if (!this.docRecords) {
            this.mapElements = [];
            this.showLoadingSpinner = false;
            return;
        }

        this.showLoadingSpinner = (this.docRecords.length > 0);
        for (let i = 0; i < this.docRecords.length; i++) {
            const record =  this.docRecords[i];

            for (const mapElement of this.contentUtils.createMapElementForDocRecord(record,
                    StringUtils.calcCharCodeForListIndex(i + 1), this.showImageTrackAndGeoPos, this.trackColors)) {
                if (record.id === this.currentDocId) {
                    mapElement.color = 'red';
                    this.centerOnMapElements = [mapElement];
                }
                this.mapElementsReverseMap.set(mapElement, record);
            }
        }
        this.mapElements = Array.from(this.mapElementsReverseMap.keys());
        this.mapElementsFound.emit(this.mapElements);

        this.cd.markForCheck();
    }

    protected updateData(): void {
        if (this.platformService.isClient()) {
            this.renderMap();
        }
    }
}
