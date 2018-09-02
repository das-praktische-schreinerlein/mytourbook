import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {CommonDocVideoplayerComponent} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-videoplayer/cdoc-videoplayer.component';
import {TourDocContentUtils} from '../../services/tdoc-contentutils.service';

@Component({
    selector: 'app-tdoc-videoplayer',
    templateUrl: './../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-videoplayer/cdoc-videoplayer.component.html',
    styleUrls: ['./../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-videoplayer/cdoc-videoplayer.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocVideoplayerComponent extends CommonDocVideoplayerComponent {
    constructor(contentUtils: TourDocContentUtils, protected cd: ChangeDetectorRef) {
        super(contentUtils, cd);
    }
}
