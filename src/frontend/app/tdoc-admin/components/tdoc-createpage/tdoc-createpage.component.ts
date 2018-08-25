import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewContainerRef} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
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
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {BeanUtils} from '../../../../shared/commons/utils/bean.utils';
import {TourDocRoutingService} from '../../../../shared/tdoc-commons/services/tdoc-routing.service';
import {TourDocContentUtils} from '../../../shared-tdoc/services/tdoc-contentutils.service';
import {LayoutService} from '../../../../shared/angular-commons/services/layout.service';
import {environment} from '../../../../environments/environment';
import {TourDocSearchForm} from '../../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {
    CommonDocCreatepageComponent,
    CommonDocCreatepageComponentConfig
} from '../../../../shared/frontend-cdoc-commons/components/cdoc-createpage.component';

@Component({
    selector: 'app-tdoc-createpage',
    templateUrl: './tdoc-createpage.component.html',
    styleUrls: ['./tdoc-createpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocCreatepageComponent
    extends CommonDocCreatepageComponent<TourDocRecord, TourDocSearchForm, TourDocSearchResult, TourDocDataService> {
    tracks: TourDocRecord[] = [];

    constructor(protected route: ActivatedRoute, protected cdocRoutingService: TourDocRoutingService,
                protected toastr: ToastsManager, vcr: ViewContainerRef, contentUtils: TourDocContentUtils,
                protected errorResolver: ErrorResolver, protected pageUtils: PageUtils,
                protected commonRoutingService: CommonRoutingService, protected angularMarkdownService: AngularMarkdownService,
                protected angularHtmlService: AngularHtmlService, protected cd: ChangeDetectorRef,
                protected trackingProvider: GenericTrackingService, protected appService: GenericAppService,
                protected platformService: PlatformService, protected layoutService: LayoutService,
                protected tdocDataService: TourDocDataService) {
        super(route, cdocRoutingService, toastr, vcr, contentUtils, errorResolver, pageUtils, commonRoutingService, angularMarkdownService,
            angularHtmlService, cd, trackingProvider, appService, platformService, layoutService, environment, tdocDataService);
    }

    protected getComponentConfig(config: {}): CommonDocCreatepageComponentConfig {
        return {
            baseSearchUrl: ['tdoc'].join('/'),
            baseSearchUrlDefault: ['tdoc'].join('/'),
            editAllowed: (BeanUtils.getValue(config, 'permissions.tdocWritable') === true)
        };
    }
}
