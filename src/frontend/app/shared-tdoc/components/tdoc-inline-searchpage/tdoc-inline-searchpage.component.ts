import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, ViewContainerRef} from '@angular/core';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {TourDocSearchForm} from '../../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {TourDocSearchFormConverter} from '../../services/tdoc-searchform-converter.service';
import {ToastsManager} from 'ng2-toastr';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';
import {PageUtils} from '../../../../shared/angular-commons/services/page.utils';
import {CommonDocInlineSearchpageComponent} from '../../../../shared/frontend-cdoc-commons/components/cdoc-inline-searchpage/cdoc-inline-searchpage.component';
import {TourDocRoutingService} from '../../../../shared/tdoc-commons/services/tdoc-routing.service';

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
                cdocRoutingService: TourDocRoutingService, toastr: ToastsManager, vcr: ViewContainerRef,
                cd: ChangeDetectorRef, elRef: ElementRef, pageUtils: PageUtils) {
        super(appService, commonRoutingService, tdocDataService, searchFormConverter, cdocRoutingService,
            toastr, vcr, cd, elRef, pageUtils);
    }
}
