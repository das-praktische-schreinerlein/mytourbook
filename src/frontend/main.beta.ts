import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';
import {environment} from './environments/environment';
import {AppReadOnlyModule} from './app/app.readonly.module';

window['global'] = window; // workaround to fix global not defined

if (environment.production) {
    enableProdMode();
    // disable console
    console.debug = function () {};
}

platformBrowserDynamic().bootstrapModule(AppReadOnlyModule);
