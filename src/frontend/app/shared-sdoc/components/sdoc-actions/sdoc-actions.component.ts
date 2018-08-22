import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewContainerRef} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {SDocDynamicComponentService} from '../../services/sdoc-dynamic-components.service';
import {Router} from '@angular/router';
import {SDocDataService} from '../../../../shared/sdoc-commons/services/sdoc-data.service';
import {ToastsManager} from 'ng2-toastr';
import {SDocAlbumService} from '../../services/sdoc-album.service';
import {
    CommonDocActionsComponent,
    CommonDocActionsComponentConfig
} from '../../../../shared/frontend-cdoc-commons/components/cdoc-actions/cdoc-actions.component';
import {SDocSearchForm} from '../../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {SDocSearchResult} from '../../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';

@Component({
    selector: 'app-sdoc-action',
    templateUrl: '../../../../shared/frontend-cdoc-commons/components/cdoc-actions/cdoc-actions.component.html',
    styleUrls: ['../../../../shared/frontend-cdoc-commons/components/cdoc-actions/cdoc-actions.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocActionsComponent extends CommonDocActionsComponent<SDocRecord, SDocSearchForm, SDocSearchResult, SDocDataService> {
    constructor(protected dynamicComponentService: SDocDynamicComponentService, protected router: Router,
                protected sdocDataService: SDocDataService, protected toastr: ToastsManager, vcr: ViewContainerRef,
                protected sdocAlbumService: SDocAlbumService, protected cd: ChangeDetectorRef, protected appService: GenericAppService) {
        super(dynamicComponentService, router, sdocDataService, toastr, vcr, sdocAlbumService, cd, appService);
    }

    protected getComponentConfig(config: {}): CommonDocActionsComponentConfig {
        return {
            baseEditPath: 'sdocadmin'
        };
    }

}
