import {LOCALE_ID, NgModule} from '@angular/core';
import {ServerModule} from '@angular/platform-server';
import {AppModule} from './app.module';
import {AppComponent} from './components/app/app.component';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import {APP_BASE_HREF} from '@angular/common';

@NgModule({
    imports: [
        // The AppServerModule should import your AppModule followed
        // by the ServerModule from @angular/platform-server.
        AppModule,
        ServerModule,
        ModuleMapLoaderModule
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'de'},
        { provide: APP_BASE_HREF, useValue: 'http://localhost:4000/mytbdev/de/'}
    ],
    // Since the bootstrapped component is not inherited from your
    // imported AppModule, it needs to be repeated here.
    bootstrap: [AppComponent],
})
export class AppServerModule {}
