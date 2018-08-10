import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {SDocSearchFormConverter} from '../shared-sdoc/services/sdoc-searchform-converter.service';
import {CommonDocRoutingService} from '../../shared/frontend-cdoc-commons/services/cdoc-routing.service';
import {SDocSearchFormUtils} from '../shared-sdoc/services/sdoc-searchform-utils.service';
import {SDocSearchFormResolver} from '../shared-sdoc/resolver/sdoc-searchform.resolver';
import {SDocRecordResolver} from '../shared-sdoc/resolver/sdoc-details.resolver';
import {ToastModule} from 'ng2-toastr';
import {SearchParameterUtils} from '../../shared/search-commons/services/searchparameter.utils';
import {CommonDocContentUtils} from '../../shared/frontend-cdoc-commons/services/cdoc-contentutils.service';
import {SharedSDocModule} from '../shared-sdoc/shared-sdoc.module';
import {BrowserModule} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AngularCommonsModule} from '../../shared/angular-commons/angular-commons.module';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ErrorResolver} from '../../shared/frontend-cdoc-commons/resolver/error.resolver';
import {PageUtils} from '../../../shared/angular-commons/services/page.utils';
import {SDocLightBoxService} from '../shared-sdoc/services/sdoc-lightbox.service';
import {AngularHtmlService} from '../../shared/angular-commons/services/angular-html.service';
import {AngularMarkdownService} from '../../shared/angular-commons/services/angular-markdown.service';
import {CommonRoutingService} from '../../shared/angular-commons/services/common-routing.service';
import {SDocEditpageComponent} from './components/sdoc-editpage/sdoc-editpage.component';
import {SDocAdminRoutingModule} from './sdoc-admin-routing.module';
import {SDocCreatepageComponent} from './components/sdoc-createpage/sdoc-createpage.component';
import {SDocRecordCreateResolver} from '../shared-sdoc/resolver/sdoc-create.resolver';
import {SDocContentUtils} from '../shared-sdoc/services/sdoc-contentutils.service';
import {CommonDocSearchFormUtils} from '../../shared/frontend-cdoc-commons/services/cdoc-searchform-utils.service';
import {FrontendCdocCommonsModule} from '../../shared/frontend-cdoc-commons/frontend-cdoc-commons.module';
import {SDocRoutingService} from '../../shared/sdoc-commons/services/sdoc-routing.service';

@NgModule({
    declarations: [
        SDocEditpageComponent,
        SDocCreatepageComponent
    ],
    imports: [
        TranslateModule,
        BrowserModule,
        NgbModule,
        ToastModule,
        HttpModule,
        AngularCommonsModule,
        SharedSDocModule,
        SDocAdminRoutingModule,
        FrontendCdocCommonsModule
    ],
    providers: [
        TranslateService,
        CommonRoutingService,
        SDocSearchFormConverter,
        { provide: CommonDocRoutingService, useClass: SDocRoutingService },
        SDocRoutingService,
        { provide: CommonDocSearchFormUtils, useClass: SDocSearchFormUtils },
        SDocSearchFormUtils,
        SearchParameterUtils,
        { provide: CommonDocContentUtils, useClass: SDocContentUtils },
        SDocContentUtils,
        SDocSearchFormResolver,
        SDocRecordResolver,
        SDocRecordCreateResolver,
        ErrorResolver,
        PageUtils,
        SDocLightBoxService,
        AngularHtmlService,
        AngularMarkdownService
    ],
    exports: [
        SDocEditpageComponent,
        SDocCreatepageComponent
    ]
})
export class SDocAdminModule {}
