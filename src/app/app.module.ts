import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {TrackDataService} from './services/track-data.service';
import {TrackListComponent} from './components/track/track-list/track-list.component';
import {TrackListItemComponent} from './components/track/track-list-item/track-list-item.component';
import {TrackListFooterComponent} from './components/track/track-list-footer/track-list-footer.component';
import {TrackEditformComponent} from './components/track/track-editform/track-editform.component';
import {TrackSearchpageComponent} from './components/track/track-searchpage/track-searchpage.component';
import {routing} from './app.router';
import {TrackEditpageComponent} from './components/track/track-editpage/track-editpage.component';

@NgModule({
  declarations: [
    AppComponent,
    TrackListComponent,
    TrackListItemComponent,
    TrackListFooterComponent,
    TrackEditformComponent,
    TrackSearchpageComponent,
    TrackEditpageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing
  ],
  providers: [TrackDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
