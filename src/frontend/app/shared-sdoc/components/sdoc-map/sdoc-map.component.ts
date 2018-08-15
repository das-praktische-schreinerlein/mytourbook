import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';

import 'leaflet';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {MapElement} from '../../../../shared/angular-maps/services/leaflet-geo.plugin';
import {PlatformService} from '../../../../shared/angular-commons/services/platform.service';
import {SDocContentUtils} from '../../services/sdoc-contentutils.service';
import {AbstractInlineComponent} from '../../../../shared/angular-commons/components/inline.component';

@Component({
    selector: 'app-sdoc-map',
    templateUrl: './sdoc-map.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocMapComponent extends AbstractInlineComponent {
    showLoadingSpinner = false;
    mapElements: MapElement[] = [];
    mapElementsReverseMap = new Map<MapElement, SDocRecord>();

    @Input()
    public mapId: string;

    @Input()
    public height: string;

    @Input()
    public sdocs: SDocRecord[];

    @Input()
    public mapCenterPos: L.LatLng;

    @Input()
    public mapZoom: number;

    @Input()
    public showImageTrackAndGeoPos? = false;

    @Output()
    public centerChanged: EventEmitter<L.LatLng> = new EventEmitter();

    @Output()
    public sdocClicked: EventEmitter<SDocRecord> = new EventEmitter();

    @Output()
    public mapElementsFound: EventEmitter<MapElement[]> = new EventEmitter();

    constructor(private contentUtils: SDocContentUtils, protected cd: ChangeDetectorRef,
                private platformService: PlatformService) {
        super(cd);
    }

    onTrackClicked(mapElement: MapElement) {
        this.sdocClicked.emit(this.mapElementsReverseMap.get(mapElement));
    }

    onMapElementsLoaded(mapElements: MapElement[]) {
        this.showLoadingSpinner = false;
        this.cd.detectChanges();
    }

    renderMap() {
        this.mapElementsReverseMap.clear();
        if (!this.sdocs) {
            this.mapElements = [];
            this.showLoadingSpinner = false;
            return;
        }

        this.showLoadingSpinner = (this.sdocs.length > 0 ? true : false);
        for (let i = 0; i < this.sdocs.length; i++) {
            const record =  this.sdocs[i];

            for (const mapElement of this.contentUtils.createMapElementForSDoc(record, this.showImageTrackAndGeoPos)) {
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
