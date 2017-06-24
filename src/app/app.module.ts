import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Http, HttpModule, JsonpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {SDocDataService} from './sdoc/services/sdoc-data.service';
import {AppService} from './shared/services/app.service';
import {SDocDataStore} from './sdoc/services/sdoc-data.store';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NavbarComponent} from './components/navbar/navbar.component';
import {SDocSearchFormConverter} from './sdoc/services/sdoc-searchform-converter.service';
import {ToastModule} from 'ng2-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SDocRoutingService} from './sdoc/services/sdoc-routing.service';
import {MultiselectDropdownModule} from 'angular-2-dropdown-multiselect';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {SDocSearchFormUtils} from './sdoc/services/sdoc-searchform-utils.service';
import {SDocSearchFormResolver} from './sdoc/resolver/sdoc-searchform.resolver';
import {SDocRecordResolver} from './sdoc/resolver/sdoc-details.resolver';
import {SearchFormUtils} from '../commons/services/searchform-utils.service';
import {AppRoutingModule} from './app.router';
import {SDocModule} from './sdoc/sdoc.module';
import {CommonsModule} from '../commons/commons.module';

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
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        JsonpModule,
        NgbModule.forRoot(),
        ToastModule.forRoot(),
        MultiselectDropdownModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [Http]
            }
        }),
        CommonsModule,
        SDocModule,
        AppRoutingModule
    ],
    providers: [
        SDocDataStore,
        SDocDataService,
        AppService,
        SDocSearchFormConverter,
        SDocRoutingService,
        SDocSearchFormUtils,
        SDocSearchFormResolver,
        SDocRecordResolver,
        SearchFormUtils
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
