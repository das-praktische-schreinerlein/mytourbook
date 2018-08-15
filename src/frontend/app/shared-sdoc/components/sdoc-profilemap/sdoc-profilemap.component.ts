import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {PlatformService} from '../../../../shared/angular-commons/services/platform.service';
import {MapElement} from '../../../../shared/angular-maps/services/leaflet-geo.plugin';
import {SDocContentUtils} from '../../services/sdoc-contentutils.service';
import {AbstractInlineComponent} from '../../../../shared/angular-commons/components/inline.component';

@Component({
    selector: 'app-sdoc-profilemap',
    templateUrl: './sdoc-profilemap.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocProfileMapComponent extends AbstractInlineComponent {
    mapElements: MapElement[] = [];

    @Input()
    public mapId: string;

    @Input()
    public height: string;

    @Input()
    public sdocs: SDocRecord[];

    @Input()
    public showImageTrackAndGeoPos? = false;

    @Output()
    public mapElementsFound: EventEmitter<MapElement[]> = new EventEmitter();

    constructor(protected cd: ChangeDetectorRef, private contentUtils: SDocContentUtils, private appService: GenericAppService,
                private platformService: PlatformService) {
        super(cd);
    }

    renderMap() {
        if (!this.sdocs) {
            this.mapElements = [];
            return;
        }

        const tmpList: MapElement[] = [];
        for (let i = 0; i < this.sdocs.length; i++) {
            const record =  this.sdocs[i];
            for (const mapElement of this.contentUtils.createMapElementForSDoc(record, this.showImageTrackAndGeoPos)) {
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
