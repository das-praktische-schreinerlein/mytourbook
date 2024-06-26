import {AppComponent} from './components/app/app.component';
import {AppService} from './services/app.service';
import {NgbCollapseModule, NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {NavbarComponent} from './components/navbar/navbar.component';
import {ToastrModule} from 'ngx-toastr';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TourDocModule} from './tdoc/tdoc.module';
import {TourDocDataStore, TourDocTeamFilterConfig} from '../shared/tdoc-commons/services/tdoc-data.store';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {TourDocDataService} from '../shared/tdoc-commons/services/tdoc-data.service';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {SectionsModule} from './sections/sections.module';
import {StaticPagesDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/staticpages-data.service';
import {StaticPagesDataStore} from '@dps/mycms-commons/dist/pdoc-commons/services/staticpages-data.store';
import {BrowserModule} from '@angular/platform-browser';
import {ErrorPageComponent} from './components/errorpage/errorpage.component';
import {AngularCommonsModule} from '@dps/mycms-frontend-commons/dist/angular-commons/angular-commons.module';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {BackendHttpClient} from './services/backend-http-client';
import {MinimalHttpBackendClient} from '@dps/mycms-commons/dist/commons/services/minimal-http-backend-client';
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
import {TourDocActionTagsComponent} from './shared-tdoc/components/tdoc-actiontags/tdoc-actiontags.component';
import {TourDocAlbumService} from './shared-tdoc/services/tdoc-album.service';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {CookieLawModule} from 'angular2-cookie-law';
import {TourDocActionTagService} from './shared-tdoc/services/tdoc-actiontag.service';
import {TourDocPlaylistService} from './shared-tdoc/services/tdoc-playlist.service';
import {environment} from '../environments/environment';
import {TourDocKeywordTagFormComponent} from './shared-tdoc/components/tdoc-keywordtagform/tdoc-keywordtagform.component';
import {FallbackHttpClient} from './services/fallback-http-client';
import {TourDocMapStateService} from './shared-tdoc/services/tdoc-mapstate.service';
import {NgModule} from '@angular/core';
import {AppCommonRoutingModule} from './app.common.router';
import {PDocDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.service';
import {PDocDataStore} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.store';
import {PrintService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/print.service';
import {SimplePrintService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/simple-print.service';
import {PdfPrintService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/pdf-print.service';
import {SimplePdfPrintService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/simple-pdf-print.service';

registerLocaleData(localeDe);

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient, platformService: PlatformService): TranslateHttpLoader {
    const url = platformService.getAssetsUrl('./assets/locales/locale-');
    // console.log('use translate-baseul', url);
    return new TranslateHttpLoader(http, url,  environment.assetsPathVersionSnippet + '.json' + environment.assetsPathVersionSuffix);
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
    entryComponents: [
        TourDocActionTagsComponent,
        TourDocKeywordTagFormComponent
    ],
    imports: [
        HttpClientModule,
        NgbCollapseModule, NgbDropdownModule, NgbTooltipModule,
        BrowserModule.withServerTransition({appId: 'tdoc-app'}),
        ToastrModule.forRoot(),
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
        SectionsModule,
        CookieLawModule,
        AppCommonRoutingModule
    ],
    providers: [
        {provide: MinimalHttpBackendClient, useClass: BackendHttpClient},
        // customUrlSerializerProvider, // activate this to get parenthes in parameters running, but then suburls dont run anymore
        CommonRoutingService,
        {provide: GenericAppService, useClass: AppService},
        FallbackHttpClient,
        DynamicComponentService,
        TourDocDynamicComponentService,
        TourDocTeamFilterConfig,
        TourDocDataStore,
        TourDocDataService,
        PDocDataStore,
        PDocDataService,
        StaticPagesDataStore,
        TourDocAlbumService,
        StaticPagesDataService,
        TourDocDataCacheService,
        SearchFormUtils,
        {provide: GenericTrackingService, useClass: TrackingService},
        {provide: SearchParameterUtils, useClass: SearchParameterUtils},
        PageUtils,
        {provide: PlatformService, useClass: PlatformService},
        LayoutService,
        {provide: PrintService, useClass: SimplePrintService},
        {provide: PdfPrintService, useClass: SimplePdfPrintService},
        TourDocActionTagService,
        TourDocPlaylistService,
        TourDocMapStateService
    ],
    bootstrap: [AppComponent]
})
export class AppCommonModule {}
