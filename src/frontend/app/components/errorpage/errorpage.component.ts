import {ChangeDetectionStrategy, Component, Injectable, OnInit} from '@angular/core';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {CommonRoutingService, RoutingState} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';

@Component({
    selector: 'app-errorpage',
    templateUrl: './errorpage.component.html',
    styleUrls: ['./errorpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@Injectable()
export class ErrorPageComponent implements  OnInit {
    date: number;

    constructor(private pageUtils: PageUtils, private commonRoutingService: CommonRoutingService) {
    }

    ngOnInit() {
        this.pageUtils.setTranslatedTitle('meta.title.prefix.errorPage', {}, 'Error');
        this.pageUtils.setTranslatedDescription('meta.desc.prefix.errorPage', {}, 'Error');
        this.pageUtils.setRobots(false, false);
        this.pageUtils.setMetaLanguage();
        this.commonRoutingService.setRoutingState(RoutingState.DONE);
        this.date = (new Date()).getTime();
        return;
    }
}
