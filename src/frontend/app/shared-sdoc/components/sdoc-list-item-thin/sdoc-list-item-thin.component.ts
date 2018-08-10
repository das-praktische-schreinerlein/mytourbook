import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {LayoutService} from '../../../../shared/angular-commons/services/layout.service';
import {SDocListItemComponent} from '../sdoc-list-item/sdoc-list-item.component';
import {SDocContentUtils} from '../../services/sdoc-contentutils.service';

@Component({
    selector: 'app-sdoc-list-item-thin',
    templateUrl: './sdoc-list-item-thin.component.html',
    styleUrls: ['./sdoc-list-item-thin.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocListItemThinComponent extends SDocListItemComponent {
    constructor(contentUtils: SDocContentUtils, cd: ChangeDetectorRef, layoutService: LayoutService) {
        super(contentUtils, cd, layoutService);
        this.listLayoutName = 'thin';
    }
}
