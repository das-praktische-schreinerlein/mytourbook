import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {CommonDocContentUtils} from '../../../../shared/frontend-cdoc-commons/services/cdoc-contentutils.service';
import {LayoutService} from '../../../../shared/angular-commons/services/layout.service';
import {SDocListItemComponent} from '../sdoc-list-item/sdoc-list-item.component';

@Component({
    selector: 'app-sdoc-list-item-small',
    templateUrl: './sdoc-list-item-small.component.html',
    styleUrls: ['./sdoc-list-item-small.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocListItemSmallComponent extends SDocListItemComponent {
    constructor(contentUtils: CommonDocContentUtils, cd: ChangeDetectorRef, layoutService: LayoutService) {
        super(contentUtils, cd, layoutService);
        this.listLayoutName = 'small';
    }
}
