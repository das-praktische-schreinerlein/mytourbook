import {TruncatePipe} from './pipes/truncate.pipe';
import {NgModule} from '@angular/core';
import {SwitchOnOfflineComponent} from './components/switch-onoffline/switch-onoffline.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {ShowBrowserOnOfflineComponent} from './components/show-browseronoffline/show-browseronoffline.component';
@NgModule({
    declarations: [
        TruncatePipe,
        SwitchOnOfflineComponent,
        ShowBrowserOnOfflineComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        TruncatePipe,
        SwitchOnOfflineComponent,
        ShowBrowserOnOfflineComponent
    ]
})
export class AngularCommonsModule {
}
