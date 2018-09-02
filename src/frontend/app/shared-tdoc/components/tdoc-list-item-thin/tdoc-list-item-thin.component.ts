import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {TourDocListItemComponent} from '../tdoc-list-item/tdoc-list-item.component';
import {TourDocContentUtils} from '../../services/tdoc-contentutils.service';

@Component({
    selector: 'app-tdoc-list-item-thin',
    templateUrl: './tdoc-list-item-thin.component.html',
    styleUrls: ['./tdoc-list-item-thin.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocListItemThinComponent extends TourDocListItemComponent {
    constructor(contentUtils: TourDocContentUtils, cd: ChangeDetectorRef, layoutService: LayoutService) {
        super(contentUtils, cd, layoutService);
        this.listLayoutName = 'thin';
    }
}
