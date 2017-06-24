import {NgModule} from '@angular/core';
import {Http, HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {AppService} from './shared/services/app.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NavbarComponent} from './components/navbar/navbar.component';
import {ToastModule} from 'ng2-toastr';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
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
        CommonsModule,
        SDocModule,
        AppRoutingModule
    ],
    providers: [
        AppService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
