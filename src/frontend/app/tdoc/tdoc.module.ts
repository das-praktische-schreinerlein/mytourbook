import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {TourDocSearchpageComponent} from './components/tdoc-searchpage/tdoc-searchpage.component';
import {TourDocSearchFormConverter} from '../shared-tdoc/services/tdoc-searchform-converter.service';
import {TourDocShowpageComponent} from './components/tdoc-showpage/tdoc-showpage.component';
import {CommonDocRoutingService} from '../../shared/frontend-cdoc-commons/services/cdoc-routing.service';
import {TourDocSearchFormUtils} from '../shared-tdoc/services/tdoc-searchform-utils.service';
import {TourDocSearchFormResolver} from '../shared-tdoc/resolver/tdoc-searchform.resolver';
import {TourDocRecordResolver} from '../shared-tdoc/resolver/tdoc-details.resolver';
import {TourDocRoutingModule} from './tdoc-routing.module';
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
import {TourDocAlbumResolver} from '../shared-tdoc/resolver/tdoc-album.resolver';
import {TourDocAlbumpageComponent} from './components/tdoc-albumpage/tdoc-albumpage.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LayoutService} from '../../shared/angular-commons/services/layout.service';
import {TourDocDataService} from '../../shared/tdoc-commons/services/tdoc-data.service';
import {FileDropModule} from 'ngx-file-drop';
import {TourDocContentUtils} from '../shared-tdoc/services/tdoc-contentutils.service';
import {CommonDocSearchFormUtils} from '../../shared/frontend-cdoc-commons/services/cdoc-searchform-utils.service';
import {FrontendCommonDocCommonsModule} from '../../shared/frontend-cdoc-commons/frontend-cdoc-commons.module';
import {TourDocRoutingService} from '../../../shared/tdoc-commons/services/tdoc-routing.service';

@NgModule({
    declarations: [
        TourDocSearchpageComponent,
        TourDocShowpageComponent,
        TourDocAlbumpageComponent
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
        SharedTourDocModule,
        TourDocRoutingModule,
        FileDropModule,
        FrontendCommonDocCommonsModule
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
        ErrorResolver,
        PageUtils,
        TourDocLightBoxService,
        TourDocDataService,
        AngularHtmlService,
        AngularMarkdownService,
        TourDocAlbumResolver,
        LayoutService
    ],
    exports: [
        TourDocSearchpageComponent
    ]
})
export class TourDocModule {}
