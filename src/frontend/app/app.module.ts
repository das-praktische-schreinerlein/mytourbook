import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {AppComponent} from './components/app/app.component';
import {AppService} from './services/app.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NavbarComponent} from './components/navbar/navbar.component';
import {ToastModule} from 'ng2-toastr';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {AppRoutingModule} from './app.router';
import {TourDocModule} from './tdoc/tdoc.module';
import {TourDocDataStore, TourDocTeamFilterConfig} from '../shared/tdoc-commons/services/tdoc-data.store';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {TourDocDataService} from '../shared/tdoc-commons/services/tdoc-data.service';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {SectionsModule} from './sections/sections.module';
import {PDocDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.service';
import {PDocDataStore} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.store';
import {BrowserModule} from '@angular/platform-browser';
import {ErrorPageComponent} from './components/errorpage/errorpage.component';
import {AngularCommonsModule} from '@dps/mycms-frontend-commons/dist/angular-commons/angular-commons.module';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {BackendHttpClient} from './services/backend-http-client';
import {MinimalHttpBackendClient} from '@dps/mycms-commons/dist/commons/services/minimal-http-backend-client';
import {AngularHtmlService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-html.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TourDocDataCacheService} from './shared-tdoc/services/tdoc-datacache.service';
import {GenericTrackingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/generic-tracking.service';
import {TrackingService} from './services/tracking.service';
import {Angulartics2Module} from 'angulartics2';
import {registerLocaleData} from '@angular/common';
import localeDe from '@angular/common/locales/de';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {TourDocDynamicComponentService} from './shared-tdoc/services/tdoc-dynamic-components.service';
import {DynamicComponentService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/dynamic-components.service';
import {TourDocAdminModule} from './tdoc-admin/tdoc-admin.module';
import {TourDocActionTagsComponent} from './shared-tdoc/components/tdoc-actiontags/tdoc-actiontags.component';
import {TourDocAlbumService} from './shared-tdoc/services/tdoc-album.service';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {CookieLawModule} from 'angular2-cookie-law';
import {TourDocActionTagService} from './shared-tdoc/services/tdoc-actiontag.service';

registerLocaleData(localeDe);

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient, platformService: PlatformService): TranslateHttpLoader {
    const url = platformService.getAssetsUrl('./assets/locales/locale-');
    // console.log('use translate-baseul', url);
    return new TranslateHttpLoader(http, url, '.json');
}

export function getAngulartics2Providers(): any {
    return TrackingService.getTrackingProvider();
}

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        ErrorPageComponent
    ],
    entryComponents: [TourDocActionTagsComponent],
    imports: [
        HttpModule,
        HttpClientModule,
        NgbModule.forRoot(),
        BrowserModule.withServerTransition({appId: 'tdoc-app'}),
        ToastModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient, PlatformService]
            }
        }),
        Angulartics2Module.forRoot(getAngulartics2Providers()),
        AngularCommonsModule,
        TourDocModule,
        TourDocAdminModule,
        SectionsModule,
        AppRoutingModule,
        CookieLawModule
    ],
    providers: [
        { provide: MinimalHttpBackendClient, useClass: BackendHttpClient },
        CommonRoutingService,
        { provide: GenericAppService, useClass: AppService },
        DynamicComponentService,
        TourDocDynamicComponentService,
        TourDocTeamFilterConfig,
        TourDocDataStore,
        TourDocDataService,
        PDocDataStore,
        TourDocAlbumService,
        PDocDataService,
        TourDocDataCacheService,
        SearchFormUtils,
        { provide: GenericTrackingService, useClass: TrackingService },
        AngularHtmlService,
        { provide: SearchParameterUtils, useClass: SearchParameterUtils },
        PageUtils,
        { provide: PlatformService, useClass: PlatformService},
        LayoutService,
        TourDocActionTagService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
