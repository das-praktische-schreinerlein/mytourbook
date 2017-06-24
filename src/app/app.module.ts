import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Http, HttpModule, JsonpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {SDocDataService} from './sdoc/services/sdoc-data.service';
import {SDocListComponent} from './sdoc/components/sdoc-list/sdoc-list.component';
import {SDocListItemComponent} from './sdoc/components/sdoc-list-item/sdoc-list-item.component';
import {SDocListFooterComponent} from './sdoc/components/sdoc-list-footer/sdoc-list-footer.component';
import {SDocEditformComponent} from './sdoc/components/sdoc-editform/sdoc-editform.component';
import {SDocSearchformComponent} from './sdoc/components/sdoc-searchform/sdoc-searchform.component';
import {SDocSearchpageComponent} from './sdoc/components/sdoc-searchpage/sdoc-searchpage.component';
import {SDocEditpageComponent} from './sdoc/components/sdoc-editpage/sdoc-editpage.component';
import {AppService} from './shared/services/app.service';
import {SDocDataStore} from './sdoc/services/sdoc-data.store';
import {routing} from './app.router';
import {SDocCreateformComponent} from './sdoc/components/sdoc-createform/sdoc-createform.component';
import {SDocCreatepageComponent} from './sdoc/components/sdoc-createpage/sdoc-createpage.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SDocListHeaderComponent} from './sdoc/components/sdoc-list-header/sdoc-list-header.component';
import {NavbarComponent} from './shared/components/navbar/navbar.component';
import {TruncatePipe} from '../commons/pipes/truncate.pipe';
import {SDocSearchFormConverter} from './sdoc/services/sdoc-searchform-converter.service';
import {ToastModule} from 'ng2-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SDocShowpageComponent} from './sdoc/components/sdoc-showpage/sdoc-showpage.component';
import {SDocRoutingService} from './sdoc/services/sdoc-routing.service';
import {SDocInlineSearchpageComponent} from './sdoc/components/sdoc-inline-searchpage/sdoc-inline-searchpage.component';
import {SDocListItemSmallComponent} from './sdoc/components/sdoc-list-item-small/sdoc-list-item-small.component';
import {MultiselectDropdownModule} from 'angular-2-dropdown-multiselect';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {SDocSearchFormUtils} from './sdoc/services/sdoc-searchform-utils.service';
import {SDocSearchFormResolver} from './sdoc/resolver/sdoc-searchform.resolver';
import {SDocRecordResolver} from './sdoc/resolver/sdoc-details.resolver';
import {SearchFormUtils} from '../commons/services/searchform-utils.service';

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
        NavbarComponent,
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
        SDocSearchFormUtils, SDocSearchFormResolver, SDocRecordResolver, SearchFormUtils],
    bootstrap: [AppComponent]
})
export class AppModule {
}
