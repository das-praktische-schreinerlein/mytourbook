import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {LayoutService} from '../../../../shared/angular-commons/services/layout.service';
import {CommonDocListItemComponent} from '../../../../shared/frontend-cdoc-commons/components/cdoc-list-item/cdoc-list-item.component';
import {TourDocContentUtils} from '../../services/tdoc-contentutils.service';

@Component({
    selector: 'app-tdoc-list-item',
    templateUrl: './tdoc-list-item.component.html',
    styleUrls: ['./tdoc-list-item.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocListItemComponent  extends CommonDocListItemComponent {
    constructor(contentUtils: TourDocContentUtils, cd: ChangeDetectorRef, layoutService: LayoutService) {
        super(contentUtils, cd, layoutService);
        this.listLayoutName = 'default';
    }
}
