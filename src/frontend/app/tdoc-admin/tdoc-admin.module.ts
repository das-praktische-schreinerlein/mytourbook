import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {TourDocSearchFormConverter} from '../shared-tdoc/services/tdoc-searchform-converter.service';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {TourDocSearchFormUtils} from '../shared-tdoc/services/tdoc-searchform-utils.service';
import {TourDocSearchFormResolver} from '../shared-tdoc/resolver/tdoc-searchform.resolver';
import {TourDocRecordResolver} from '../shared-tdoc/resolver/tdoc-details.resolver';
import {ToastrModule} from 'ngx-toastr';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {CommonDocContentUtils} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-contentutils.service';
import {SharedTourDocModule} from '../shared-tdoc/shared-tdoc.module';
import {BrowserModule} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AngularCommonsModule} from '@dps/mycms-frontend-commons/dist/angular-commons/angular-commons.module';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ErrorResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/error.resolver';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {TourDocLightBoxService} from '../shared-tdoc/services/tdoc-lightbox.service';
import {AngularHtmlService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-html.service';
import {AngularMarkdownService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-markdown.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {TourDocEditpageComponent} from './components/tdoc-editpage/tdoc-editpage.component';
import {TourDocAdminRoutingModule} from './tdoc-admin-routing.module';
import {TourDocCreatepageComponent} from './components/tdoc-createpage/tdoc-createpage.component';
import {TourDocRecordCreateResolver} from '../shared-admin-tdoc/resolver/tdoc-create.resolver';
import {TourDocContentUtils} from '../shared-tdoc/services/tdoc-contentutils.service';
import {CommonDocSearchFormUtils} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-searchform-utils.service';
import {FrontendCommonDocCommonsModule} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/frontend-cdoc-commons.module';
import {TourDocRoutingService} from '../../shared/tdoc-commons/services/tdoc-routing.service';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {TourDocModalCreatepageComponent} from './components/tdoc-createpage/tdoc-modal-createpage.component';
import {SharedAdminTourDocModule} from '../shared-admin-tdoc/shared-admin-tdoc.module';
import {TourDocDataService} from '../../shared/tdoc-commons/services/tdoc-data.service';

@NgModule({
    declarations: [
        TourDocEditpageComponent,
        TourDocCreatepageComponent,
        TourDocModalCreatepageComponent
    ],
    imports: [
        TranslateModule,
        BrowserModule,
        NgbModule,
        ToastrModule,
        HttpClientModule,
        AngularCommonsModule,
        SharedTourDocModule,
        SharedAdminTourDocModule,
        TourDocAdminRoutingModule,
        FrontendCommonDocCommonsModule
    ],
    providers: [
        TranslateService,
        CommonRoutingService,
        TourDocSearchFormConverter,
        TourDocDataService,
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
        TourDocCreatepageComponent,
        TourDocModalCreatepageComponent
    ]
})
export class TourDocAdminModule {}
