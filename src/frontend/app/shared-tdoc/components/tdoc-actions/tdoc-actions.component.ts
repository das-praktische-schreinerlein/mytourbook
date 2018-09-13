import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewContainerRef} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {TourDocDynamicComponentService} from '../../services/tdoc-dynamic-components.service';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {ToastsManager} from 'ng2-toastr';
import {
    CommonDocActionsComponent,
    CommonDocActionsComponentConfig
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-actions/cdoc-actions.component';
import {TourDocSearchForm} from '../../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {TourDocActionTagService} from '../../services/tdoc-actiontag.service';

@Component({
    selector: 'app-tdoc-action',
    templateUrl: './../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-actions/cdoc-actions.component.html',
    styleUrls: ['./../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-actions/cdoc-actions.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocActionsComponent extends CommonDocActionsComponent<TourDocRecord, TourDocSearchForm, TourDocSearchResult, TourDocDataService> {
    constructor(protected dynamicComponentService: TourDocDynamicComponentService,
                protected toastr: ToastsManager, vcr: ViewContainerRef,
                protected cd: ChangeDetectorRef, protected appService: GenericAppService,
                protected actionTagService: TourDocActionTagService) {
        super(dynamicComponentService, toastr, vcr, cd, appService, actionTagService);
    }

    protected getComponentConfig(config: {}): CommonDocActionsComponentConfig {
        return {
            baseEditPath: 'tdocadmin'
        };
    }

}
