import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {LayoutService} from '../../../../shared/angular-commons/services/layout.service';
import {TourDocListItemComponent} from '../tdoc-list-item/tdoc-list-item.component';
import {TourDocContentUtils} from '../../services/tdoc-contentutils.service';

@Component({
    selector: 'app-tdoc-list-item-small',
    templateUrl: './tdoc-list-item-small.component.html',
    styleUrls: ['./tdoc-list-item-small.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocListItemSmallComponent extends TourDocListItemComponent {
    constructor(contentUtils: TourDocContentUtils, cd: ChangeDetectorRef, layoutService: LayoutService) {
        super(contentUtils, cd, layoutService);
        this.listLayoutName = 'small';
    }
}
