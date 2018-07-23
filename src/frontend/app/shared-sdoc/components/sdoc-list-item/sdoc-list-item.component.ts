import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {CommonDocContentUtils} from '../../../../shared/frontend-cdoc-commons/services/cdoc-contentutils.service';
import {ActionTagEvent} from '../sdoc-actiontags/sdoc-actiontags.component';
import {CommonDocRecord} from '../../../../shared/search-commons/model/records/cdoc-entity-record';
import {LayoutService} from '../../../../shared/angular-commons/services/layout.service';
import {CDocListItemComponent} from '../../../../shared/frontend-cdoc-commons/components/cdoc-list-item/cdoc-list-item.component';

@Component({
    selector: 'app-sdoc-list-item',
    templateUrl: './sdoc-list-item.component.html',
    styleUrls: ['./sdoc-list-item.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocListItemComponent  extends CDocListItemComponent {
    constructor(contentUtils: CommonDocContentUtils, cd: ChangeDetectorRef, layoutService: LayoutService) {
        super(contentUtils, cd, layoutService);
        this.listLayoutName = 'default';
    }

    public onActionTagEvent(event: ActionTagEvent) {
        if (event.result !== undefined) {
            this.record = <CommonDocRecord>event.result;
            this.updateData();
        }

        return false;
    }
}
