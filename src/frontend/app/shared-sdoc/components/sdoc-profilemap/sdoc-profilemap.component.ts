import {Component, Input, OnChanges, SimpleChange} from '@angular/core';

import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';

@Component({
    selector: 'app-sdoc-profilemap',
    templateUrl: './sdoc-profilemap.component.html'
})
export class SDocProfileMapComponent implements OnChanges {
    trackUrls: string[] = [];

    @Input()
    public mapId: string;

    @Input()
    public height: string;

    @Input()
    public sdocs: SDocRecord[];

    constructor(private appService: GenericAppService) {}

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            this.renderMap();
        }
    }

    renderMap() {
        this.trackUrls = [];
        if (!this.sdocs) {
            return;
        }

        for (let i = 0; i < this.sdocs.length; i++) {
            const record =  this.sdocs[i];
            const trackUrl = record.gpsTrackBasefile;
            if (trackUrl !== undefined && trackUrl.length > 0) {
                this.trackUrls.push(this.appService.getAppConfig()['tracksBaseUrl'] + trackUrl + '.json');
            }
        }
    }
}
