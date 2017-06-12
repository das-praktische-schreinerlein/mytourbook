import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule, JsonpModule} from '@angular/http';
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

@NgModule({
    declarations: [
        AppComponent,
        SDocListComponent,
        SDocListItemComponent,
        SDocListHeaderComponent,
        SDocListFooterComponent,
        SDocEditformComponent,
        SDocCreateformComponent,
        SDocSearchformComponent,
        SDocSearchpageComponent,
        SDocCreatepageComponent,
        SDocEditpageComponent,
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
        ToastModule.forRoot()
    ],
    providers: [SDocDataStore, SDocDataService, AppService, SDocSearchFormConverter],
    bootstrap: [AppComponent]
})
export class AppModule {
}
