import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, ViewContainerRef} from '@angular/core';
import {SDocDataService} from '../../../../shared/sdoc-commons/services/sdoc-data.service';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {SDocSearchForm} from '../../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {SDocSearchResult} from '../../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {SDocSearchFormConverter} from '../../services/sdoc-searchform-converter.service';
import {ToastsManager} from 'ng2-toastr';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';
import {PageUtils} from '../../../../shared/angular-commons/services/page.utils';
import {CommonDocInlineSearchpageComponent} from '../../../../shared/frontend-cdoc-commons/components/cdoc-inline-searchpage/cdoc-inline-searchpage.component';
import {SDocRoutingService} from '../../../../shared/sdoc-commons/services/sdoc-routing.service';

@Component({
    selector: 'app-sdoc-inline-searchpage',
    templateUrl: './sdoc-inline-searchpage.component.html',
    styleUrls: ['./sdoc-inline-searchpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocInlineSearchpageComponent extends
    CommonDocInlineSearchpageComponent<SDocRecord, SDocSearchForm, SDocSearchResult, SDocDataService> {

    @Input()
    public baseSearchUrl? = 'sdoc/';

    constructor(appService: GenericAppService, commonRoutingService: CommonRoutingService,
                sdocDataService: SDocDataService, searchFormConverter: SDocSearchFormConverter,
                cdocRoutingService: SDocRoutingService, toastr: ToastsManager, vcr: ViewContainerRef,
                cd: ChangeDetectorRef, elRef: ElementRef, pageUtils: PageUtils) {
        super(appService, commonRoutingService, sdocDataService, searchFormConverter, cdocRoutingService,
            toastr, vcr, cd, elRef, pageUtils);
    }
}
