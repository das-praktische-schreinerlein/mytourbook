import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewContainerRef} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {ActivatedRoute} from '@angular/router';
import {ToastsManager} from 'ng2-toastr';
import {ErrorResolver} from '../../../../shared/frontend-cdoc-commons/resolver/error.resolver';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {PageUtils} from '../../../../shared/angular-commons/services/page.utils';
import {AngularMarkdownService} from '../../../../shared/angular-commons/services/angular-markdown.service';
import {AngularHtmlService} from '../../../../shared/angular-commons/services/angular-html.service';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';
import {GenericTrackingService} from '../../../../shared/angular-commons/services/generic-tracking.service';
import {PlatformService} from '../../../../shared/angular-commons/services/platform.service';
import {SDocDataService} from '../../../../shared/sdoc-commons/services/sdoc-data.service';
import {BeanUtils} from '../../../../shared/commons/utils/bean.utils';
import {SDocRoutingService} from '../../../../shared/sdoc-commons/services/sdoc-routing.service';
import {SDocContentUtils} from '../../../shared-sdoc/services/sdoc-contentutils.service';
import {LayoutService} from '../../../../shared/angular-commons/services/layout.service';
import {environment} from '../../../../environments/environment';
import {SDocSearchForm} from '../../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {SDocSearchResult} from '../../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {
    CommonDocCreatepageComponent,
    CommonDocCreatepageComponentConfig
} from '../../../../shared/frontend-cdoc-commons/components/cdoc-createpage.component';

@Component({
    selector: 'app-sdoc-createpage',
    templateUrl: './sdoc-createpage.component.html',
    styleUrls: ['./sdoc-createpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocCreatepageComponent
    extends CommonDocCreatepageComponent<SDocRecord, SDocSearchForm, SDocSearchResult, SDocDataService> {
    tracks: SDocRecord[] = [];

    constructor(protected route: ActivatedRoute, protected cdocRoutingService: SDocRoutingService,
                protected toastr: ToastsManager, vcr: ViewContainerRef, contentUtils: SDocContentUtils,
                protected errorResolver: ErrorResolver, protected pageUtils: PageUtils,
                protected commonRoutingService: CommonRoutingService, protected angularMarkdownService: AngularMarkdownService,
                protected angularHtmlService: AngularHtmlService, protected cd: ChangeDetectorRef,
                protected trackingProvider: GenericTrackingService, protected appService: GenericAppService,
                protected platformService: PlatformService, protected layoutService: LayoutService,
                protected sdocDataService: SDocDataService) {
        super(route, cdocRoutingService, toastr, vcr, contentUtils, errorResolver, pageUtils, commonRoutingService, angularMarkdownService,
            angularHtmlService, cd, trackingProvider, appService, platformService, layoutService, environment, sdocDataService);
    }

    protected getComponentConfig(config: {}): CommonDocCreatepageComponentConfig {
        return {
            baseSearchUrl: ['sdoc'].join('/'),
            baseSearchUrlDefault: ['sdoc'].join('/'),
            editAllowed: (BeanUtils.getValue(config, 'permissions.sdocWritable') === true)
        };
    }
}
