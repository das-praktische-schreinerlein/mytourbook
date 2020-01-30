import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {TourDocRoutingService} from '../../../../shared/tdoc-commons/services/tdoc-routing.service';
import {CommonDocSimpleSearchNavigationComponent} from '../cdoc-simple-search-navigation/cdoc-simple-search-navigation.component';

@Component({
    selector: 'app-tdoc-simple-search-navigation',
    templateUrl: '../cdoc-simple-search-navigation/cdoc-simple-search-navigation.component.html',
    styleUrls: ['../cdoc-simple-search-navigation/cdoc-simple-search-navigation.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocSimpleSearchNavigationComponent extends CommonDocSimpleSearchNavigationComponent {

    @Input()
    public baseSearchUrl? = 'tdoc/';

    constructor(cdocRoutingService: TourDocRoutingService, cd: ChangeDetectorRef) {
        super(cdocRoutingService, cd);
    }
}
