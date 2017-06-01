import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule, JsonpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {TrackDataService} from './services/track-data.service';
import {TrackListComponent} from './components/track/track-list/track-list.component';
import {TrackListItemComponent} from './components/track/track-list-item/track-list-item.component';
import {TrackListFooterComponent} from './components/track/track-list-footer/track-list-footer.component';
import {TrackEditformComponent} from './components/track/track-editform/track-editform.component';
import {TrackSearchformComponent} from './components/track/track-searchform/track-searchform.component';
import {TrackSearchpageComponent} from './components/track/track-searchpage/track-searchpage.component';
import {TrackEditpageComponent} from './components/track/track-editpage/track-editpage.component';
import {AppService} from './services/app.service';
import {TrackDataStore} from './services/track-data.store';
import {routing} from './app.router';
import {TrackCreateformComponent} from './components/track/track-createform/track-createform.component';
import {TrackCreatepageComponent} from './components/track/track-createpage/track-createpage.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TrackListHeaderComponent} from './components/track/track-list-header/track-list-header.component';

@NgModule({
    declarations: [
        AppComponent,
        TrackListComponent,
        TrackListItemComponent,
        TrackListHeaderComponent,
        TrackListFooterComponent,
        TrackEditformComponent,
        TrackCreateformComponent,
        TrackSearchformComponent,
        TrackSearchpageComponent,
        TrackCreatepageComponent,
        TrackEditpageComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        JsonpModule,
        routing,
        NgbModule.forRoot()
    ],
    providers: [TrackDataStore, TrackDataService, AppService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
