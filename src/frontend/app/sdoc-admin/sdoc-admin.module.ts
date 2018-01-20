import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {SDocSearchFormConverter} from '../shared-sdoc/services/sdoc-searchform-converter.service';
import {SDocRoutingService} from '../shared-sdoc/services/sdoc-routing.service';
import {SDocSearchFormUtils} from '../shared-sdoc/services/sdoc-searchform-utils.service';
import {SDocSearchFormResolver} from '../shared-sdoc/resolver/sdoc-searchform.resolver';
import {SDocRecordResolver} from '../shared-sdoc/resolver/sdoc-details.resolver';
import {ToastModule} from 'ng2-toastr';
import {SearchParameterUtils} from '../../shared/search-commons/services/searchparameter.utils';
import {SDocContentUtils} from '../shared-sdoc/services/sdoc-contentutils.service';
import {SharedSDocModule} from '../shared-sdoc/shared-sdoc.module';
import {BrowserModule} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AngularCommonsModule} from '../../shared/angular-commons/angular-commons.module';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ErrorResolver} from '../sections/resolver/error.resolver';
import {PageUtils} from '../../../shared/angular-commons/services/page.utils';
import {SDocLightBox} from '../shared-sdoc/services/sdoc-lightbox.service';
import {AngularHtmlService} from '../../shared/angular-commons/services/angular-html.service';
import {AngularMarkdownService} from '../../shared/angular-commons/services/angular-markdown.service';
import {CommonRoutingService} from '../../shared/angular-commons/services/common-routing.service';
import {SDocEditpageComponent} from './components/sdoc-editpage/sdoc-editpage.component';
import {SDocAdminRoutingModule} from './sdoc-admin-routing.module';

@NgModule({
    declarations: [
        SDocEditpageComponent,
    ],
    imports: [
        TranslateModule,
        BrowserModule,
        NgbModule,
        ToastModule,
        HttpModule,
        AngularCommonsModule,
        SharedSDocModule,
        SDocAdminRoutingModule
    ],
    providers: [
        TranslateService,
        CommonRoutingService,
        SDocSearchFormConverter,
        SDocRoutingService,
        SDocSearchFormUtils,
        SearchParameterUtils,
        SDocContentUtils,
        SDocSearchFormResolver,
        SDocRecordResolver,
        ErrorResolver,
        PageUtils,
        SDocLightBox,
        AngularHtmlService,
        AngularMarkdownService
    ],
    exports: [
        SDocEditpageComponent
    ]
})
export class SDocAdminModule {}
