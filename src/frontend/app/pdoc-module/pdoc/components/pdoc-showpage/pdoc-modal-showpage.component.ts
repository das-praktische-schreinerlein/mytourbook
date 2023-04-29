import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef} from '@angular/core';
import {PDocShowpageComponent} from './pdoc-showpage.component';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PDocRoutingService} from '../../../shared-pdoc/services/pdoc-routing.service';
import {ToastrService} from 'ngx-toastr';
import {PDocContentUtils} from '../../../shared-pdoc/services/pdoc-contentutils.service';
import {ErrorResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/error.resolver';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {AngularMarkdownService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-markdown.service';
import {AngularHtmlService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-html.service';
import {GenericTrackingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/generic-tracking.service';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {PDocSearchFormConverter} from '../../../shared-pdoc/services/pdoc-searchform-converter.service';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';

@Component({
    selector: 'app-pdoc-modal-showpage',
    templateUrl: './pdoc-showpage.component.html',
    styleUrls: ['./pdoc-showpage.component.css', './pdoc-modal-showpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PDocModalShowpageComponent extends PDocShowpageComponent {
    constructor(route: ActivatedRoute, cdocRoutingService: PDocRoutingService,
                toastr: ToastrService, contentUtils: PDocContentUtils,
                errorResolver: ErrorResolver, pageUtils: PageUtils, commonRoutingService: CommonRoutingService,
                angularMarkdownService: AngularMarkdownService, angularHtmlService: AngularHtmlService,
                cd: ChangeDetectorRef, trackingProvider: GenericTrackingService, appService: GenericAppService,
                platformService: PlatformService, protected searchFormConverter: PDocSearchFormConverter,
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
    }

}
