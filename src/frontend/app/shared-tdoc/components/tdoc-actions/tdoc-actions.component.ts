import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewContainerRef} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {TourDocDynamicComponentService} from '../../services/tdoc-dynamic-components.service';
import {Router} from '@angular/router';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {ToastsManager} from 'ng2-toastr';
import {TourDocAlbumService} from '../../services/tdoc-album.service';
import {
    CommonDocActionsComponent,
    CommonDocActionsComponentConfig
} from '../../../../shared/frontend-cdoc-commons/components/cdoc-actions/cdoc-actions.component';
import {TourDocSearchForm} from '../../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';

@Component({
    selector: 'app-tdoc-action',
    templateUrl: '../../../../shared/frontend-cdoc-commons/components/cdoc-actions/cdoc-actions.component.html',
    styleUrls: ['../../../../shared/frontend-cdoc-commons/components/cdoc-actions/cdoc-actions.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocActionsComponent extends CommonDocActionsComponent<TourDocRecord, TourDocSearchForm, TourDocSearchResult, TourDocDataService> {
    constructor(protected dynamicComponentService: TourDocDynamicComponentService, protected router: Router,
                protected tdocDataService: TourDocDataService, protected toastr: ToastsManager, vcr: ViewContainerRef,
                protected tdocAlbumService: TourDocAlbumService, protected cd: ChangeDetectorRef, protected appService: GenericAppService) {
        super(dynamicComponentService, router, tdocDataService, toastr, vcr, tdocAlbumService, cd, appService);
    }

    protected getComponentConfig(config: {}): CommonDocActionsComponentConfig {
        return {
            baseEditPath: 'tdocadmin'
        };
    }

}
