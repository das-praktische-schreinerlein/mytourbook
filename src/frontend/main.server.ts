import {enableProdMode} from '@angular/core';
import {environment} from './environments/environment';

if (environment.production) {
    enableProdMode();
    // disable console
    console.debug = function () {};
}

export { AppServerModule } from './app/app.server.module';
// export angular-resources for serverside-rendering
export { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
export { ngExpressEngine } from '@nguniversal/express-engine';
