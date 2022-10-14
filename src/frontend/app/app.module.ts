import {NgModule} from '@angular/core';
import {AppComponent} from './components/app/app.component';
import {AppService} from './services/app.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NavbarComponent} from './components/navbar/navbar.component';
import {ToastrModule} from 'ngx-toastr';
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
import {TourDocPlaylistService} from './shared-tdoc/services/tdoc-playlist.service';
import {environment} from '../environments/environment';
import {
    TourDocObjectDetectionObjectKeyEditFormComponent
} from './shared-tdoc/components/tdoc-odobjectkeyeditform/tdoc-odobjectkeyeditform.component';
import {TourDocReplaceFormComponent} from './shared-tdoc/components/tdoc-replaceform/tdoc-replaceform.component';
import {TourDocAssignFormComponent} from './shared-tdoc/components/tdoc-assignform/tdoc-assignform.component';
import {TourDocKeywordTagFormComponent} from './shared-tdoc/components/tdoc-keywordtagform/tdoc-keywordtagform.component';
import {TourDocAssignJoinFormComponent} from './shared-tdoc/components/tdoc-assignjoinform/tdoc-assignjoinform.component';
import {TourDocNameSuggesterService} from './shared-tdoc/services/tdoc-name-suggester.service';
import {TourDocDescSuggesterService} from './shared-tdoc/services/tdoc-desc-suggester.service';
import {TourDocTripDescSuggesterService} from './shared-tdoc/services/tdoc-trip-desc-suggester.service';
import {TourDocLocationDescSuggesterService} from './shared-tdoc/services/tdoc-location-desc-suggester.service';
import {TourDocNewsDescSuggesterService} from './shared-tdoc/services/tdoc-news-desc-suggester.service';
import {TourDocRouteDescSuggesterService} from './shared-tdoc/services/tdoc-route-desc-suggester.service';
import {TourDocTrackDescSuggesterService} from './shared-tdoc/services/tdoc-track-desc-suggester.service';
import CustomUrlSerializer from './services/custom-url-serializer';
import {UrlSerializer} from '@angular/router';
import {TourDocAssignPlaylistFormComponent} from './shared-tdoc/components/tdoc-assignplaylistform/tdoc-assignplaylistform.component';
import {FallbackHttpClient} from './services/fallback-http-client';
import {TourDocMapStateService} from './shared-tdoc/services/tdoc-mapstate.service';

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

// seen on https://stackoverflow.com/questions/39541185/custom-encoding-for-urls-using-angular-2-router-using-a-sign-in-place-of-a-sp
const customUrlSerializer = new CustomUrlSerializer();
const customUrlSerializerProvider = {
    provide: UrlSerializer,
    useValue: customUrlSerializer
}

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        ErrorPageComponent
    ],
    entryComponents: [TourDocActionTagsComponent,
        TourDocObjectDetectionObjectKeyEditFormComponent,
        TourDocReplaceFormComponent,
        TourDocAssignFormComponent,
        TourDocAssignJoinFormComponent,
        TourDocAssignPlaylistFormComponent,
        TourDocKeywordTagFormComponent
    ],
    imports: [
        HttpClientModule,
        NgbModule,
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
        TourDocAdminModule,
        SectionsModule,
        AppRoutingModule,
        CookieLawModule
    ],
    providers: [
        { provide: MinimalHttpBackendClient, useClass: BackendHttpClient },
        // customUrlSerializerProvider, // activate this to get parenthes in parameters running, but then suburls dont run anymore
        CommonRoutingService,
        { provide: GenericAppService, useClass: AppService },
        FallbackHttpClient,
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
        TourDocActionTagService,
        TourDocPlaylistService,
        TourDocNameSuggesterService,
        TourDocDescSuggesterService,
        TourDocLocationDescSuggesterService,
        TourDocNewsDescSuggesterService,
        TourDocRouteDescSuggesterService,
        TourDocTrackDescSuggesterService,
        TourDocTripDescSuggesterService,
        TourDocMapStateService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
