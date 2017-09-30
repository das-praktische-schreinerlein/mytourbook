import {NgModule} from '@angular/core';
import {Http, HttpModule} from '@angular/http';
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

// AoT requires an exported function for factories
export function createTranslateLoader(http: Http) {
    return new TranslateHttpLoader(http, './assets/locales/locale-', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        ErrorPageComponent
    ],
    imports: [
        HttpModule,
        NgbModule.forRoot(),
        BrowserModule,
        ToastModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [Http]
            }
        }),
        AngularCommonsModule,
        SDocModule,
        SectionsModule,
        AppRoutingModule
    ],
    providers: [
        { provide: MinimalHttpBackendClient, useClass: BackendHttpClient },
        { provide: GenericAppService, useClass: AppService },
        SDocTeamFilterConfig,
        SDocDataStore,
        SDocDataService,
        PDocDataStore,
        PDocDataService,
        SearchFormUtils,
        { provide: SearchParameterUtils, useClass: SearchParameterUtils },
        PageUtils
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
