import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {PDocRecord} from '@dps/mycms-commons/dist/pdoc-commons/model/records/pdoc-record';
import {PDocDynamicComponentService} from '../../services/pdoc-dynamic-components.service';
import {PDocDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.service';
import {ToastrService} from 'ngx-toastr';
import {
    CommonDocActionsComponent
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-actions/cdoc-actions.component';
import {PDocSearchForm} from '@dps/mycms-commons/dist/pdoc-commons/model/forms/pdoc-searchform';
import {PDocSearchResult} from '@dps/mycms-commons/dist/pdoc-commons/model/container/pdoc-searchresult';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {PDocActionTagService} from '../../services/pdoc-actiontag.service';

@Component({
    selector: 'app-pdoc-action',
    templateUrl: '../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-actions/cdoc-actions.component.html',
    styleUrls: ['../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-actions/cdoc-actions.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PDocActionsComponent extends CommonDocActionsComponent<PDocRecord, PDocSearchForm, PDocSearchResult, PDocDataService> {
    constructor(protected dynamicComponentService: PDocDynamicComponentService,
                protected toastr: ToastrService,
                protected cd: ChangeDetectorRef, protected appService: GenericAppService,
                protected actionTagService: PDocActionTagService) {
        super(dynamicComponentService, toastr, cd, appService, actionTagService);
    }

}
