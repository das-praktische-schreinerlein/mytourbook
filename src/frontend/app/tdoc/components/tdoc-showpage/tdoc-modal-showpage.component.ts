import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef} from '@angular/core';
import {TourDocShowpageComponent} from './tdoc-showpage.component';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TourDocRoutingService} from '../../../../shared/tdoc-commons/services/tdoc-routing.service';
import {ToastrService} from 'ngx-toastr';
import {TourDocContentUtils} from '../../../shared-tdoc/services/tdoc-contentutils.service';
import {ErrorResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/error.resolver';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {AngularMarkdownService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-markdown.service';
import {AngularHtmlService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-html.service';
import {GenericTrackingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/generic-tracking.service';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {TourDocSearchFormConverter} from '../../../shared-tdoc/services/tdoc-searchform-converter.service';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';

@Component({
    selector: 'app-tdoc-modal-showpage',
    templateUrl: './tdoc-showpage.component.html',
    styleUrls: ['./tdoc-showpage.component.css', '../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/styles/cdoc-modal-showpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocModalShowpageComponent extends TourDocShowpageComponent {
    constructor(route: ActivatedRoute, cdocRoutingService: TourDocRoutingService,
                toastr: ToastrService, contentUtils: TourDocContentUtils,
                errorResolver: ErrorResolver, pageUtils: PageUtils, commonRoutingService: CommonRoutingService,
                angularMarkdownService: AngularMarkdownService, angularHtmlService: AngularHtmlService,
                cd: ChangeDetectorRef, trackingProvider: GenericTrackingService, appService: GenericAppService,
                platformService: PlatformService, protected searchFormConverter: TourDocSearchFormConverter,
                layoutService: LayoutService, protected elRef: ElementRef, protected router: Router) {
        super(route, cdocRoutingService, toastr, contentUtils, errorResolver, pageUtils, commonRoutingService,
            angularMarkdownService, angularHtmlService, cd, trackingProvider, appService, platformService,
            searchFormConverter, layoutService, elRef, router);
        this.modal = true;
    }

    protected configureProcessingOfResolvedData(): void {
        const me = this;
        super.configureProcessingOfResolvedData();
        me.availableTabs = {};
        me.mapState.flgProfileMapAvailable = false;
        me.mapState.flgShowProfileMap = false;
    }

}
