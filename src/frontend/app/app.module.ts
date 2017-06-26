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
import {SDocDataStore} from '../shared/sdoc-commons/services/sdoc-data.store';
import {SearchFormUtils} from '../shared/angular-commons/services/searchform-utils.service';
import {GenericAppService} from '../shared/search-commons/services/generic-app.service';
import {SDocDataService} from '../shared/sdoc-commons/services/sdoc-data.service';
import {SearchParameterUtils} from '../shared/search-commons/services/searchparameter.utils';

// AoT requires an exported function for factories
export function createTranslateLoader(http: Http) {
    return new TranslateHttpLoader(http, './assets/locales/locale-', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent
    ],
    imports: [
        HttpModule,
        NgbModule.forRoot(),
        ToastModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [Http]
            }
        }),
        SDocModule,
        AppRoutingModule
    ],
    providers: [
        { provide: GenericAppService, useClass: AppService },
        SDocDataStore,
        SDocDataService,
        SearchFormUtils,
        { provide: SearchParameterUtils, useClass: SearchParameterUtils }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
