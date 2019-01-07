import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {MapElement} from '@dps/mycms-frontend-commons/dist/angular-maps/services/leaflet-geo.plugin';
import {TourDocContentUtils} from '../../services/tdoc-contentutils.service';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {StringUtils} from '@dps/mycms-commons/dist/commons/utils/string.utils';

@Component({
    selector: 'app-tdoc-profilemap',
    templateUrl: './tdoc-profilemap.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocProfileMapComponent extends AbstractInlineComponent {
    mapElements: MapElement[] = [];

    @Input()
    public mapId: string;

    @Input()
    public height: string;

    @Input()
    public tdocs: TourDocRecord[];

    @Input()
    public showImageTrackAndGeoPos? = false;

    @Output()
    public mapElementsFound: EventEmitter<MapElement[]> = new EventEmitter();

    constructor(protected cd: ChangeDetectorRef, private contentUtils: TourDocContentUtils, private appService: GenericAppService,
                private platformService: PlatformService) {
        super(cd);
    }

    renderMap() {
        if (!this.tdocs) {
            this.mapElements = [];
            return;
        }

        const tmpList: MapElement[] = [];
        for (let i = 0; i < this.tdocs.length; i++) {
            const record =  this.tdocs[i];
            for (const mapElement of this.contentUtils.createMapElementForTourDoc(record, StringUtils.calcCharCodeForListIndex(i + 1), this.showImageTrackAndGeoPos)) {
                tmpList.push(mapElement);
            }
        }
        this.mapElements = tmpList;
        this.mapElementsFound.emit(this.mapElements);

        this.cd.markForCheck();
    }

    protected updateData(): void {
        if (this.platformService.isClient()) {
            this.renderMap();
        }
    }
}
