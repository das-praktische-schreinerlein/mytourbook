import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {CommonDocVideoplayerComponent} from '../../../../shared/frontend-cdoc-commons/components/cdoc-videoplayer/cdoc-videoplayer.component';
import {TourDocContentUtils} from '../../services/tdoc-contentutils.service';

@Component({
    selector: 'app-tdoc-videoplayer',
    templateUrl: '../../../../shared/frontend-cdoc-commons/components/cdoc-videoplayer/cdoc-videoplayer.component.html',
    styleUrls: ['../../../../shared/frontend-cdoc-commons/components/cdoc-videoplayer/cdoc-videoplayer.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocVideoplayerComponent extends CommonDocVideoplayerComponent {
    constructor(contentUtils: TourDocContentUtils, protected cd: ChangeDetectorRef) {
        super(contentUtils, cd);
    }
}
