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
import {SDocModule} from './sdoc/sdoc.module';
import {SDocDataStore, SDocTeamFilterConfig} from '../shared/sdoc-commons/services/sdoc-data.store';
import {SearchFormUtils} from '../shared/angular-commons/services/searchform-utils.service';
import {GenericAppService} from '../shared/commons/services/generic-app.service';
import {SDocDataService} from '../shared/sdoc-commons/services/sdoc-data.service';
import {SearchParameterUtils} from '../shared/search-commons/services/searchparameter.utils';
import {SectionsModule} from './sections/sections.module';
import {PDocDataService} from '../shared/pdoc-commons/services/pdoc-data.service';
import {PDocDataStore} from '../shared/pdoc-commons/services/pdoc-data.store';
import {BrowserModule} from '@angular/platform-browser';
import {ErrorPageComponent} from './components/errorpage/errorpage.component';
import {AngularCommonsModule} from '../shared/angular-commons/angular-commons.module';
import {PageUtils} from '../shared/angular-commons/services/page.utils';
import {BackendHttpClient} from './services/backend-http-client';
import {MinimalHttpBackendClient} from '../shared/commons/services/minimal-http-backend-client';
import {AngularHtmlService} from '../shared/angular-commons/services/angular-html.service';
import {CommonRoutingService} from '../shared/angular-commons/services/common-routing.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {SDocDataCacheService} from './shared-sdoc/services/sdoc-datacache.service';
import {GenericTrackingService} from '../shared/angular-commons/services/generic-tracking.service';
import {TrackingService} from './services/tracking.service';
import {Angulartics2Module} from 'angulartics2';

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http, './assets/locales/locale-', '.json');
}

export function getAngulartics2Providers(): Object[] {
    return TrackingService.getTrackingProvider();
}

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        ErrorPageComponent
    ],
    imports: [
        HttpModule,
        HttpClientModule,
        NgbModule.forRoot(),
        BrowserModule.withServerTransition({appId: 'sdoc-app'}),
        ToastModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        Angulartics2Module.forRoot(getAngulartics2Providers()),
        AngularCommonsModule,
        SDocModule,
        SectionsModule,
        AppRoutingModule
    ],
    providers: [
        { provide: MinimalHttpBackendClient, useClass: BackendHttpClient },
        CommonRoutingService,
        { provide: GenericAppService, useClass: AppService },
        SDocTeamFilterConfig,
        SDocDataStore,
        SDocDataService,
        PDocDataStore,
        PDocDataService,
        SDocDataCacheService,
        SearchFormUtils,
        { provide: GenericTrackingService, useClass: TrackingService },
        AngularHtmlService,
        { provide: SearchParameterUtils, useClass: SearchParameterUtils },
        PageUtils
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
