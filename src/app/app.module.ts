import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Http, HttpModule, JsonpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {SDocDataService} from './services/sdoc-data.service';
import {SDocListComponent} from './components/sdoc/sdoc-list/sdoc-list.component';
import {SDocListItemComponent} from './components/sdoc/sdoc-list-item/sdoc-list-item.component';
import {SDocListFooterComponent} from './components/sdoc/sdoc-list-footer/sdoc-list-footer.component';
import {SDocEditformComponent} from './components/sdoc/sdoc-editform/sdoc-editform.component';
import {SDocSearchformComponent} from './components/sdoc/sdoc-searchform/sdoc-searchform.component';
import {SDocSearchpageComponent} from './components/sdoc/sdoc-searchpage/sdoc-searchpage.component';
import {SDocEditpageComponent} from './components/sdoc/sdoc-editpage/sdoc-editpage.component';
import {AppService} from './services/app.service';
import {SDocDataStore} from './services/sdoc-data.store';
import {routing} from './app.router';
import {SDocCreateformComponent} from './components/sdoc/sdoc-createform/sdoc-createform.component';
import {SDocCreatepageComponent} from './components/sdoc/sdoc-createpage/sdoc-createpage.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SDocListHeaderComponent} from './components/sdoc/sdoc-list-header/sdoc-list-header.component';
import {TruncatePipe} from './pipes/truncate.pipe';
import {SDocSearchFormConverter} from './services/sdoc-searchform-converter.service';
import {ToastModule} from 'ng2-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SDocShowpageComponent} from './components/sdoc/sdoc-showpage/sdoc-showpage.component';
import {SDocRoutingService} from './services/sdoc-routing.service';
import {SDocInlineSearchpageComponent} from './components/sdoc/sdoc-inline-searchpage/sdoc-inline-searchpage.component';
import {SDocListItemSmallComponent} from './components/sdoc/sdoc-list-item-small/sdoc-list-item-small.component';
import {MultiselectDropdownModule} from 'angular-2-dropdown-multiselect';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {SDocSearchFormUtils} from './services/sdoc-searchform-utils.service';
import {SDocSearchFormResolver} from './resolver/sdoc-searchform.resolver';
import {SDocRecordResolver} from './resolver/sdoc-details.resolver';

// AoT requires an exported function for factories
export function createTranslateLoader(http: Http) {
    return new TranslateHttpLoader(http, './assets/locales/locale-', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        SDocListComponent,
        SDocListItemComponent,
        SDocListItemSmallComponent,
        SDocListHeaderComponent,
        SDocListFooterComponent,
        SDocEditformComponent,
        SDocCreateformComponent,
        SDocSearchformComponent,
        SDocSearchpageComponent,
        SDocCreatepageComponent,
        SDocEditpageComponent,
        SDocShowpageComponent,
        SDocInlineSearchpageComponent,
        TruncatePipe
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        JsonpModule,
        routing,
        NgbModule.forRoot(),
        ToastModule.forRoot(),
        MultiselectDropdownModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [Http]
            }
        })
    ],
    providers: [SDocDataStore, SDocDataService, AppService, SDocSearchFormConverter, SDocRoutingService,
        SDocSearchFormUtils, SDocSearchFormResolver, SDocRecordResolver],
    bootstrap: [AppComponent]
})
export class AppModule {
}
