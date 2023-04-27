import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {ToastrModule} from 'ngx-toastr';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {CommonDocContentUtils} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-contentutils.service';
import {BrowserModule} from '@angular/platform-browser';
import {AngularCommonsModule} from '@dps/mycms-frontend-commons/dist/angular-commons/angular-commons.module';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ErrorResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/error.resolver';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {AngularHtmlService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-html.service';
import {AngularMarkdownService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-markdown.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {PDocEditpageComponent} from './components/pdoc-editpage/pdoc-editpage.component';
import {PDocAdminRoutingModule} from './pdoc-admin-routing.module';
import {PDocCreatepageComponent} from './components/pdoc-createpage/pdoc-createpage.component';
import {PDocRecordCreateResolver} from '../shared-admin-pdoc/resolver/pdoc-create.resolver';
import {CommonDocSearchFormUtils} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-searchform-utils.service';
import {FrontendCommonDocCommonsModule} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/frontend-cdoc-commons.module';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {PDocModalCreatepageComponent} from './components/pdoc-createpage/pdoc-modal-createpage.component';
import {PDocDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.service';
import {SharedPDocModule} from '../shared-pdoc/shared-pdoc.module';
import {SharedAdminPDocModule} from '../shared-admin-pdoc/shared-admin-pdoc.module';
import {PDocSearchFormConverter} from '../shared-pdoc/services/pdoc-searchform-converter.service';
import {PDocSearchFormUtils} from '../shared-pdoc/services/pdoc-searchform-utils.service';
import {PDocContentUtils} from '../shared-pdoc/services/pdoc-contentutils.service';
import {PDocSearchFormResolver} from '../shared-pdoc/resolver/pdoc-searchform.resolver';
import {PDocRecordResolver} from '../shared-pdoc/resolver/pdoc-details.resolver';
import {PDocRoutingService} from '../shared-pdoc/services/pdoc-routing.service';
import {PDocDataStore} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.store';
import {PDocModule} from '../pdoc/pdoc.module';

@NgModule({
    declarations: [
        PDocEditpageComponent,
        PDocCreatepageComponent,
        PDocModalCreatepageComponent
    ],
    imports: [
        TranslateModule,
        BrowserModule,
        ToastrModule,
        HttpClientModule,
        AngularCommonsModule,
        PDocModule,
        SharedPDocModule,
        SharedAdminPDocModule,
        PDocAdminRoutingModule,
        FrontendCommonDocCommonsModule
    ],
    providers: [
        TranslateService,
        CommonRoutingService,
        PDocSearchFormConverter,
        PDocDataStore,
        PDocDataService,
        { provide: CommonDocRoutingService, useClass: PDocRoutingService },
        PDocRoutingService,
        { provide: CommonDocSearchFormUtils, useClass: PDocSearchFormUtils },
        PDocSearchFormUtils,
        SearchParameterUtils,
        { provide: CommonDocContentUtils, useClass: PDocContentUtils },
        PDocContentUtils,
        PDocSearchFormResolver,
        PDocRecordResolver,
        PDocRecordCreateResolver,
        ErrorResolver,
        PageUtils,
        AngularHtmlService,
        AngularMarkdownService,
        LayoutService
    ],
    exports: [
        PDocEditpageComponent,
        PDocCreatepageComponent,
        PDocModalCreatepageComponent
    ]
})
export class PDocAdminModule {}
