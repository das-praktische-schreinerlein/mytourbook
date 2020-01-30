import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {CommonDocObjectNavigationComponent} from '../cdoc-object-navigation/cdoc-object-navigation.component';

@Component({
    selector: 'app-tdoc-object-navigation',
    templateUrl: '../cdoc-object-navigation/cdoc-object-navigation.component.html',
    styleUrls: ['../cdoc-object-navigation/cdoc-object-navigation.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocObjectNavigationComponent extends CommonDocObjectNavigationComponent {

    @Input()
    public baseSearchUrl? = 'tdoc/';

    constructor(commonRoutingService: CommonRoutingService, cd: ChangeDetectorRef) {
        super(commonRoutingService, cd);
    }
}
