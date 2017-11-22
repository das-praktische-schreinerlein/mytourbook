import {ChangeDetectionStrategy, Component, Inject, Input, OnChanges, PLATFORM_ID, SimpleChange} from '@angular/core';

import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import {isPlatformBrowser} from '@angular/common';

@Component({
    selector: 'app-sdoc-profilemap',
    templateUrl: './sdoc-profilemap.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocProfileMapComponent implements OnChanges {
    trackUrls: string[] = [];

    @Input()
    public mapId: string;

    @Input()
    public height: string;

    @Input()
    public sdocs: SDocRecord[];

    constructor(private appService: GenericAppService, @Inject(PLATFORM_ID) protected platformId: Object) {}

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (isPlatformBrowser(this.platformId) && ComponentUtils.hasNgChanged(changes)) {
            this.renderMap();
        }
    }

    renderMap() {
        if (!this.sdocs) {
            this.trackUrls = [];
            return;
        }

        const tmpList: string[] = [];
        for (let i = 0; i < this.sdocs.length; i++) {
            const record =  this.sdocs[i];
            const trackUrl = record.gpsTrackBasefile;
            if (trackUrl !== undefined && trackUrl.length > 0) {
                if (this.appService.getAppConfig()['useAssetStoreUrls'] === true) {
                    tmpList.push(this.appService.getAppConfig()['tracksBaseUrl'] + 'json/' + record.id);
                } else {
                    tmpList.push(this.appService.getAppConfig()['tracksBaseUrl'] + trackUrl + '.json');
                }
            }
        }
        this.trackUrls = tmpList;
    }
}
