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
import {CommonDocInlineSearchpageComponent} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-inline-searchpage/cdoc-inline-searchpage.component';
import {TourDocRoutingService} from '../../../../shared/tdoc-commons/services/tdoc-routing.service';
import {CommonDocMultiActionManager} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-multiaction.manager';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {TourDocSearchFormUtils} from '../../services/tdoc-searchform-utils.service';
import {TourDocActionTagService} from '../../services/tdoc-actiontag.service';

@Component({
    selector: 'app-tdoc-inline-searchpage',
    templateUrl: './tdoc-inline-searchpage.component.html',
    styleUrls: ['./tdoc-inline-searchpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocInlineSearchpageComponent extends
    CommonDocInlineSearchpageComponent<TourDocRecord, TourDocSearchForm, TourDocSearchResult, TourDocDataService> {

    @Input()
    public baseSearchUrl? = 'tdoc/';

    constructor(appService: GenericAppService, commonRoutingService: CommonRoutingService,
                tdocDataService: TourDocDataService, searchFormConverter: TourDocSearchFormConverter,
                cdocRoutingService: TourDocRoutingService, toastr: ToastrService,
                cd: ChangeDetectorRef, elRef: ElementRef, pageUtils: PageUtils, searchFormUtils: SearchFormUtils,
                tdocSearchFormUtils: TourDocSearchFormUtils, protected actionService: TourDocActionTagService) {
        super(appService, commonRoutingService, tdocDataService, searchFormConverter, cdocRoutingService,
            toastr, cd, elRef, pageUtils, searchFormUtils, tdocSearchFormUtils,
            new CommonDocMultiActionManager(appService, actionService));
    }
}
