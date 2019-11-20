import {ChangeDetectorRef, ElementRef, Input} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {CommonDocInlineSearchpageComponent} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-inline-searchpage/cdoc-inline-searchpage.component';
import {CommonDocMultiActionManager} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-multiaction.manager';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {CommonDocRecord} from '@dps/mycms-commons/dist/search-commons/model/records/cdoc-entity-record';
import {CommonDocSearchForm} from '@dps/mycms-commons/dist/search-commons/model/forms/cdoc-searchform';
import {CommonDocSearchResult} from '@dps/mycms-commons/dist/search-commons/model/container/cdoc-searchresult';
import {CommonDocDataService} from '@dps/mycms-commons/dist/search-commons/services/cdoc-data.service';
import {CommonDocActionTagService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-actiontag.service';
import {CommonDocSearchFormUtils} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-searchform-utils.service';
import {GenericSearchFormSearchFormConverter} from '@dps/mycms-commons/dist/search-commons/services/generic-searchform.converter';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';

export abstract class CommonDocDashboardSearchColumnComponent<R extends CommonDocRecord, F extends CommonDocSearchForm,
    S extends CommonDocSearchResult<R, F>, D extends CommonDocDataService<R, F, S>> extends
    CommonDocInlineSearchpageComponent<R, F, S, D> {

    @Input()
    public baseSearchUrl? = 'cdoc/';

    constructor(appService: GenericAppService, commonRoutingService: CommonRoutingService,
                cdocDataService: D, searchFormConverter: GenericSearchFormSearchFormConverter<F>,
                cdocRoutingService: CommonDocRoutingService, toastr: ToastrService,
                cd: ChangeDetectorRef, elRef: ElementRef, pageUtils: PageUtils, searchFormUtils: SearchFormUtils,
                cdocSearchFormUtils: CommonDocSearchFormUtils, protected actionService: CommonDocActionTagService<R, F, S, D>) {
        super(appService, commonRoutingService, cdocDataService, searchFormConverter, cdocRoutingService,
            toastr, cd, elRef, pageUtils, searchFormUtils, cdocSearchFormUtils,
            new CommonDocMultiActionManager(appService, actionService));
    }
}
