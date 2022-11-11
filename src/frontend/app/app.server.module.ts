import {LOCALE_ID, NgModule} from '@angular/core';
import {ServerModule} from '@angular/platform-server';
import {AppComponent} from './components/app/app.component';
import {ModuleMapLoaderModule} from '@nguniversal/module-map-ngfactory-loader';
import {AppReadOnlyModule} from './app.readonly.module';

@NgModule({
    imports: [
        // The AppServerModule should import your AppReadOnlyModule (we dont need to fasten admin-pages) followed
        // by the ServerModule from @angular/platform-server.
        AppReadOnlyModule,
        ServerModule,
        ModuleMapLoaderModule
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'de'}
    ],
    // Since the bootstrapped component is not inherited from your
    // imported AppModule, it needs to be repeated here.
    bootstrap: [AppComponent],
})
export class AppServerModule {}
