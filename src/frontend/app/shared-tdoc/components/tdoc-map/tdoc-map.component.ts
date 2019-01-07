import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';

import 'leaflet';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {MapElement} from '@dps/mycms-frontend-commons/dist/angular-maps/services/leaflet-geo.plugin';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {TourDocContentUtils} from '../../services/tdoc-contentutils.service';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {StringUtils} from '@dps/mycms-commons/dist/commons/utils/string.utils';

@Component({
    selector: 'app-tdoc-map',
    templateUrl: './tdoc-map.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocMapComponent extends AbstractInlineComponent {
    showLoadingSpinner = false;
    mapElements: MapElement[] = [];
    centerOnMapElements: MapElement[] = undefined;
    mapElementsReverseMap = new Map<MapElement, TourDocRecord>();

    @Input()
    public mapId: string;

    @Input()
    public height: string;

    @Input()
    public tdocs: TourDocRecord[];

    @Input()
    public currentTDocId?: string;

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
        this.centerOnMapElements = undefined;
        if (!this.tdocs) {
            this.mapElements = [];
            this.showLoadingSpinner = false;
            return;
        }

        this.showLoadingSpinner = (this.tdocs.length > 0 ? true : false);
        for (let i = 0; i < this.tdocs.length; i++) {
            const record =  this.tdocs[i];

            for (const mapElement of this.contentUtils.createMapElementForTourDoc(record, StringUtils.calcCharCodeForListIndex(i + 1), this.showImageTrackAndGeoPos)) {
                if (record.id === this.currentTDocId) {
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
