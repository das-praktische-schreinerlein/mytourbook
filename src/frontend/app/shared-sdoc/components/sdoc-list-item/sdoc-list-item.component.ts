import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {LayoutService} from '../../../../shared/angular-commons/services/layout.service';
import {CDocListItemComponent} from '../../../../shared/frontend-cdoc-commons/components/cdoc-list-item/cdoc-list-item.component';
import {SDocContentUtils} from '../../services/sdoc-contentutils.service';

@Component({
    selector: 'app-sdoc-list-item',
    templateUrl: './sdoc-list-item.component.html',
    styleUrls: ['./sdoc-list-item.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocListItemComponent  extends CDocListItemComponent {
    constructor(contentUtils: SDocContentUtils, cd: ChangeDetectorRef, layoutService: LayoutService) {
        super(contentUtils, cd, layoutService);
        this.listLayoutName = 'default';
    }
}
