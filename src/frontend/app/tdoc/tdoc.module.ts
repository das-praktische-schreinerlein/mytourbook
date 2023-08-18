import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {TourDocSearchpageComponent} from './components/tdoc-searchpage/tdoc-searchpage.component';
import {TourDocSearchFormConverter} from '../shared-tdoc/services/tdoc-searchform-converter.service';
import {TourDocShowpageComponent} from './components/tdoc-showpage/tdoc-showpage.component';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {TourDocSearchFormUtils} from '../shared-tdoc/services/tdoc-searchform-utils.service';
import {TourDocSearchFormResolver} from '../shared-tdoc/resolver/tdoc-searchform.resolver';
import {TourDocRecordResolver} from '../shared-tdoc/resolver/tdoc-details.resolver';
import {TourDocRoutingModule} from './tdoc-routing.module';
import {ToastrModule} from 'ngx-toastr';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {CommonDocContentUtils} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-contentutils.service';
import {SharedTourDocModule} from '../shared-tdoc/shared-tdoc.module';
import {BrowserModule} from '@angular/platform-browser';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {AngularCommonsModule} from '@dps/mycms-frontend-commons/dist/angular-commons/angular-commons.module';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ErrorResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/error.resolver';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {TourDocLightBoxService} from '../shared-tdoc/services/tdoc-lightbox.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {TourDocAlbumResolver} from '../shared-tdoc/resolver/tdoc-album.resolver';
import {TourDocAlbumpageComponent} from './components/tdoc-albumpage/tdoc-albumpage.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {TourDocDataService} from '../../shared/tdoc-commons/services/tdoc-data.service';
import {FileDropModule} from 'ngx-file-drop';
import {TourDocContentUtils} from '../shared-tdoc/services/tdoc-contentutils.service';
import {CommonDocSearchFormUtils} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-searchform-utils.service';
import {FrontendCommonDocCommonsModule} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/frontend-cdoc-commons.module';
import {TourDocRoutingService} from '../../shared/tdoc-commons/services/tdoc-routing.service';
import {TourDocModalShowpageComponent} from './components/tdoc-showpage/tdoc-modal-showpage.component';

@NgModule({
    declarations: [
        TourDocSearchpageComponent,
        TourDocShowpageComponent,
        TourDocAlbumpageComponent,
        TourDocModalShowpageComponent
    ],
    imports: [
        NgbPaginationModule,
        TranslateModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        ToastrModule,
        HttpClientModule,
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
        ErrorResolver,
        PageUtils,
        TourDocLightBoxService,
        TourDocAlbumResolver,
        LayoutService
    ],
    exports: [
        TourDocSearchpageComponent
    ]
})
export class TourDocModule {}
