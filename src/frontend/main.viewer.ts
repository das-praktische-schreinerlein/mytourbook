import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';
import {environment} from './environments/environment';
import {AppViewerModule} from './app/app.viewer.module';

window['global'] = window; // workaround to fix global not defined

if (environment.production) {
    enableProdMode();
    // disable console
    console.debug = function () {};
}

platformBrowserDynamic().bootstrapModule(AppViewerModule);
