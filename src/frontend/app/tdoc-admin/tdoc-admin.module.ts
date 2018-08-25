import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {TourDocSearchFormConverter} from '../shared-tdoc/services/tdoc-searchform-converter.service';
import {CommonDocRoutingService} from '../../shared/frontend-cdoc-commons/services/cdoc-routing.service';
import {TourDocSearchFormUtils} from '../shared-tdoc/services/tdoc-searchform-utils.service';
import {TourDocSearchFormResolver} from '../shared-tdoc/resolver/tdoc-searchform.resolver';
import {TourDocRecordResolver} from '../shared-tdoc/resolver/tdoc-details.resolver';
import {ToastModule} from 'ng2-toastr';
import {SearchParameterUtils} from '../../shared/search-commons/services/searchparameter.utils';
import {CommonDocContentUtils} from '../../shared/frontend-cdoc-commons/services/cdoc-contentutils.service';
import {SharedTourDocModule} from '../shared-tdoc/shared-tdoc.module';
import {BrowserModule} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AngularCommonsModule} from '../../shared/angular-commons/angular-commons.module';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ErrorResolver} from '../../shared/frontend-cdoc-commons/resolver/error.resolver';
import {PageUtils} from '../../../shared/angular-commons/services/page.utils';
import {TourDocLightBoxService} from '../shared-tdoc/services/tdoc-lightbox.service';
import {AngularHtmlService} from '../../shared/angular-commons/services/angular-html.service';
import {AngularMarkdownService} from '../../shared/angular-commons/services/angular-markdown.service';
import {CommonRoutingService} from '../../shared/angular-commons/services/common-routing.service';
import {TourDocEditpageComponent} from './components/tdoc-editpage/tdoc-editpage.component';
import {TourDocAdminRoutingModule} from './tdoc-admin-routing.module';
import {TourDocCreatepageComponent} from './components/tdoc-createpage/tdoc-createpage.component';
import {TourDocRecordCreateResolver} from '../shared-tdoc/resolver/tdoc-create.resolver';
import {TourDocContentUtils} from '../shared-tdoc/services/tdoc-contentutils.service';
import {CommonDocSearchFormUtils} from '../../shared/frontend-cdoc-commons/services/cdoc-searchform-utils.service';
import {FrontendCdocCommonsModule} from '../../shared/frontend-cdoc-commons/frontend-cdoc-commons.module';
import {TourDocRoutingService} from '../../shared/tdoc-commons/services/tdoc-routing.service';
import {LayoutService} from '../../shared/angular-commons/services/layout.service';

@NgModule({
    declarations: [
        TourDocEditpageComponent,
        TourDocCreatepageComponent
    ],
    imports: [
        TranslateModule,
        BrowserModule,
        NgbModule,
        ToastModule,
        HttpModule,
        AngularCommonsModule,
        SharedTourDocModule,
        TourDocAdminRoutingModule,
        FrontendCdocCommonsModule
    ],
    providers: [
        TranslateService,
        CommonRoutingService,
        TourDocSearchFormConverter,
        { provide: CommonDocRoutingService, useClass: TourDocRoutingService },
        TourDocRoutingService,
        { provide: CommonDocSearchFormUtils, useClass: TourDocSearchFormUtils },
        TourDocSearchFormUtils,
        SearchParameterUtils,
        { provide: CommonDocContentUtils, useClass: TourDocContentUtils },
        TourDocContentUtils,
        TourDocSearchFormResolver,
        TourDocRecordResolver,
        TourDocRecordCreateResolver,
        ErrorResolver,
        PageUtils,
        TourDocLightBoxService,
        AngularHtmlService,
        AngularMarkdownService,
        LayoutService
    ],
    exports: [
        TourDocEditpageComponent,
        TourDocCreatepageComponent
    ]
})
export class TourDocAdminModule {}
