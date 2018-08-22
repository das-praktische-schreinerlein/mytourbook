import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {CommonDocVideoplayerComponent} from '../../../../shared/frontend-cdoc-commons/components/cdoc-videoplayer/cdoc-videoplayer.component';
import {SDocContentUtils} from '../../services/sdoc-contentutils.service';

@Component({
    selector: 'app-sdoc-videoplayer',
    templateUrl: '../../../../shared/frontend-cdoc-commons/components/cdoc-videoplayer/cdoc-videoplayer.component.html',
    styleUrls: ['../../../../shared/frontend-cdoc-commons/components/cdoc-videoplayer/cdoc-videoplayer.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocVideoplayerComponent extends CommonDocVideoplayerComponent {
    constructor(contentUtils: SDocContentUtils, protected cd: ChangeDetectorRef) {
        super(contentUtils, cd);
    }
}
