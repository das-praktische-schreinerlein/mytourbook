import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChange} from '@angular/core';

import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import {PlatformService} from '../../../../shared/angular-commons/services/platform.service';
import {MapElement} from '../../../../shared/angular-maps/services/leaflet-geo.plugin';
import {SDocContentUtils} from '../../services/sdoc-contentutils.service';

@Component({
    selector: 'app-sdoc-profilemap',
    templateUrl: './sdoc-profilemap.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocProfileMapComponent implements OnChanges {
    mapElements: MapElement[] = [];

    @Input()
    public mapId: string;

    @Input()
    public height: string;

    @Input()
    public sdocs: SDocRecord[];

    constructor(private contentUtils: SDocContentUtils, private appService: GenericAppService, private platformService: PlatformService) {}

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (this.platformService.isClient() && ComponentUtils.hasNgChanged(changes)) {
            this.renderMap();
        }
    }

    renderMap() {
        if (!this.sdocs) {
            this.mapElements = [];
            return;
        }

        const tmpList: MapElement[] = [];
        for (let i = 0; i < this.sdocs.length; i++) {
            const record =  this.sdocs[i];
            for (const mapElement of this.contentUtils.createMapElementForSDoc(record, false)) {
                tmpList.push(mapElement);
            }
        }
        this.mapElements = tmpList;
    }
}
