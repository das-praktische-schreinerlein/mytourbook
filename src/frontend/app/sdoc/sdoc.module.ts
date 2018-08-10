import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {SDocSearchpageComponent} from './components/sdoc-searchpage/sdoc-searchpage.component';
import {SDocSearchFormConverter} from '../shared-sdoc/services/sdoc-searchform-converter.service';
import {SDocShowpageComponent} from './components/sdoc-showpage/sdoc-showpage.component';
import {CommonDocRoutingService} from '../../shared/frontend-cdoc-commons/services/cdoc-routing.service';
import {SDocSearchFormUtils} from '../shared-sdoc/services/sdoc-searchform-utils.service';
import {SDocSearchFormResolver} from '../shared-sdoc/resolver/sdoc-searchform.resolver';
import {SDocRecordResolver} from '../shared-sdoc/resolver/sdoc-details.resolver';
import {SDocRoutingModule} from './sdoc-routing.module';
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
import {SDocAlbumResolver} from '../shared-sdoc/resolver/sdoc-album.resolver';
import {SDocAlbumpageComponent} from './components/sdoc-albumpage/sdoc-albumpage.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LayoutService} from '../../shared/angular-commons/services/layout.service';
import {SDocDataService} from '../../shared/sdoc-commons/services/sdoc-data.service';
import {FileDropModule} from 'ngx-file-drop';
import {SDocContentUtils} from '../shared-sdoc/services/sdoc-contentutils.service';
import {CommonDocSearchFormUtils} from '../../shared/frontend-cdoc-commons/services/cdoc-searchform-utils.service';
import {FrontendCdocCommonsModule} from '../../shared/frontend-cdoc-commons/frontend-cdoc-commons.module';
import {SDocRoutingService} from '../../../shared/sdoc-commons/services/sdoc-routing.service';

@NgModule({
    declarations: [
        SDocSearchpageComponent,
        SDocShowpageComponent,
        SDocAlbumpageComponent
    ],
    imports: [
        TranslateModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        ToastModule,
        HttpModule,
        AngularCommonsModule,
        SharedSDocModule,
        SDocRoutingModule,
        FileDropModule,
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
        ErrorResolver,
        PageUtils,
        SDocLightBoxService,
        SDocDataService,
        AngularHtmlService,
        AngularMarkdownService,
        SDocAlbumResolver,
        LayoutService
    ],
    exports: [
        SDocSearchpageComponent
    ]
})
export class SDocModule {}
