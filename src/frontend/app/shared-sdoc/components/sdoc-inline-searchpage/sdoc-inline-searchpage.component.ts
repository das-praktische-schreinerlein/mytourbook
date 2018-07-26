import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewContainerRef} from '@angular/core';
import {SDocDataService} from '../../../../shared/sdoc-commons/services/sdoc-data.service';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {SDocSearchForm} from '../../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {SDocSearchResult} from '../../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {SDocSearchFormConverter} from '../../services/sdoc-searchform-converter.service';
import {ToastsManager} from 'ng2-toastr';
import {CommonDocRoutingService} from '../../../../shared/frontend-cdoc-commons/services/cdoc-routing.service';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';
import {PageUtils} from '../../../../shared/angular-commons/services/page.utils';
import {CDocInlineSearchpageComponent} from '../../../../shared/frontend-cdoc-commons/components/cdoc-inline-searchpage/cdoc-inline-searchpage.component';

@Component({
    selector: 'app-sdoc-inline-searchpage',
    templateUrl: './sdoc-inline-searchpage.component.html',
    styleUrls: ['./sdoc-inline-searchpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocInlineSearchpageComponent extends
    CDocInlineSearchpageComponent<SDocRecord, SDocSearchForm, SDocSearchResult, SDocDataService> {
    constructor(appService: GenericAppService, commonRoutingService: CommonRoutingService,
                sdocDataService: SDocDataService, searchFormConverter: SDocSearchFormConverter,
                cdocRoutingService: CommonDocRoutingService, toastr: ToastsManager, vcr: ViewContainerRef,
                cd: ChangeDetectorRef, elRef: ElementRef, pageUtils: PageUtils) {
        super(appService, commonRoutingService, sdocDataService, searchFormConverter, cdocRoutingService,
            toastr, vcr, cd, elRef, pageUtils);
    }
}
