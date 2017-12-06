import {enableProdMode} from '@angular/core';
import {environment} from './environments/environment';

if (environment.production) {
    enableProdMode();
    // disable console
    console.debug = function () {};
}

export { AppServerModule } from './app/app.server.module';
