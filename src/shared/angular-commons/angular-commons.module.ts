import {TruncatePipe} from './pipes/truncate.pipe';
import {NgModule} from '@angular/core';
import {SwitchOnOfflineComponent} from './components/switch-onoffline/switch-onoffline.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {ShowBrowserOnOfflineComponent} from './components/show-browseronoffline/show-browseronoffline.component';
import {DynamicComponentHostDirective} from './components/directives/dynamic-component-host.directive';
import {IntervalControlComponent} from './components/interval-control/interval-control.component';

@NgModule({
    declarations: [
        TruncatePipe,
        DynamicComponentHostDirective,
        SwitchOnOfflineComponent,
        ShowBrowserOnOfflineComponent,
        IntervalControlComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        TruncatePipe,
        DynamicComponentHostDirective,
        SwitchOnOfflineComponent,
        ShowBrowserOnOfflineComponent,
        IntervalControlComponent
    ]
})
export class AngularCommonsModule {
}
