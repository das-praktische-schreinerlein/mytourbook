import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {PDocContentUtils} from '../../services/pdoc-contentutils.service';
import {PDocListItemComponent} from '../pdoc-list-item/pdoc-list-item.component';
import {PDocRoutingService} from '../../services/pdoc-routing.service';

@Component({
    selector: 'app-pdoc-list-item-flat',
    templateUrl: './pdoc-list-item-flat.component.html',
    styleUrls: ['./pdoc-list-item-flat.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PDocListItemFlatComponent extends PDocListItemComponent {
    constructor(contentUtils: PDocContentUtils, cd: ChangeDetectorRef, layoutService: LayoutService,
                sanitizer: DomSanitizer, cdocRoutingService: PDocRoutingService) {
        super(contentUtils, cd, layoutService, sanitizer, cdocRoutingService)
        this.listLayoutName = 'flat';

    }
}
