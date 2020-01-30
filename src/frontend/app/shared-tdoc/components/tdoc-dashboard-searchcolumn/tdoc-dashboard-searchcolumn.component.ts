import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input} from '@angular/core';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {TourDocSearchForm} from '../../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {TourDocSearchFormConverter} from '../../services/tdoc-searchform-converter.service';
import {ToastrService} from 'ngx-toastr';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {TourDocRoutingService} from '../../../../shared/tdoc-commons/services/tdoc-routing.service';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {TourDocSearchFormUtils} from '../../services/tdoc-searchform-utils.service';
import {TourDocActionTagService} from '../../services/tdoc-actiontag.service';
import {CommonDocDashboardSearchColumnComponent} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-dashboard-searchcolumn/cdoc-dashboard-searchcolumn.component';

@Component({
    selector: 'app-tdoc-dashboard-searchcolumn',
    templateUrl: './../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-dashboard-searchcolumn/cdoc-dashboard-searchcolumn.component.html',
    styleUrls: ['./../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-dashboard-searchcolumn/cdoc-dashboard-searchcolumn.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocDashboardSearchColumnComponent extends
    CommonDocDashboardSearchColumnComponent<TourDocRecord, TourDocSearchForm, TourDocSearchResult, TourDocDataService> {

    @Input()
    public baseSearchUrl? = 'tdoc/';

    constructor(appService: GenericAppService, commonRoutingService: CommonRoutingService,
                tdocDataService: TourDocDataService, searchFormConverter: TourDocSearchFormConverter,
                cdocRoutingService: TourDocRoutingService, toastr: ToastrService,
                cd: ChangeDetectorRef, elRef: ElementRef, pageUtils: PageUtils, searchFormUtils: SearchFormUtils,
                tdocSearchFormUtils: TourDocSearchFormUtils, protected actionService: TourDocActionTagService) {
        super(appService, commonRoutingService, tdocDataService, searchFormConverter, cdocRoutingService,
            toastr, cd, elRef, pageUtils, searchFormUtils, tdocSearchFormUtils, actionService);
    }
}
