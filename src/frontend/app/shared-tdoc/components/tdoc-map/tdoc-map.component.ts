import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';

import 'leaflet';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {MapElement} from '../../../../shared/angular-maps/services/leaflet-geo.plugin';
import {PlatformService} from '../../../../shared/angular-commons/services/platform.service';
import {TourDocContentUtils} from '../../services/tdoc-contentutils.service';
import {AbstractInlineComponent} from '../../../../shared/angular-commons/components/inline.component';

@Component({
    selector: 'app-tdoc-map',
    templateUrl: './tdoc-map.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocMapComponent extends AbstractInlineComponent {
    showLoadingSpinner = false;
    mapElements: MapElement[] = [];
    mapElementsReverseMap = new Map<MapElement, TourDocRecord>();

    @Input()
    public mapId: string;

    @Input()
    public height: string;

    @Input()
    public tdocs: TourDocRecord[];

    @Input()
    public mapCenterPos: L.LatLng;

    @Input()
    public mapZoom: number;

    @Input()
    public showImageTrackAndGeoPos? = false;

    @Output()
    public centerChanged: EventEmitter<L.LatLng> = new EventEmitter();

    @Output()
    public tdocClicked: EventEmitter<TourDocRecord> = new EventEmitter();

    @Output()
    public mapElementsFound: EventEmitter<MapElement[]> = new EventEmitter();

    constructor(private contentUtils: TourDocContentUtils, protected cd: ChangeDetectorRef,
                private platformService: PlatformService) {
        super(cd);
    }

    onTrackClicked(mapElement: MapElement) {
        this.tdocClicked.emit(this.mapElementsReverseMap.get(mapElement));
    }

    onMapElementsLoaded(mapElements: MapElement[]) {
        this.showLoadingSpinner = false;
        this.cd.detectChanges();
    }

    renderMap() {
        this.mapElementsReverseMap.clear();
        if (!this.tdocs) {
            this.mapElements = [];
            this.showLoadingSpinner = false;
            return;
        }

        this.showLoadingSpinner = (this.tdocs.length > 0 ? true : false);
        for (let i = 0; i < this.tdocs.length; i++) {
            const record =  this.tdocs[i];

            for (const mapElement of this.contentUtils.createMapElementForTourDoc(record, this.showImageTrackAndGeoPos)) {
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
