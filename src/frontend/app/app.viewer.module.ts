import {NgModule} from '@angular/core';
import {AppComponent} from './components/app/app.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HashLocationStrategy, LocationStrategy, registerLocaleData} from '@angular/common';
import localeDe from '@angular/common/locales/de';
import {environment} from '../environments/environment';
import {AppModule} from './app.module';
import {TranslateJsonPHttpLoader} from './services/translate-jsonp-http-loader';
import {FallbackHttpClient} from './services/fallback-http-client';

registerLocaleData(localeDe);

// AoT requires an exported function for factories
export function createTranslateLoader(http: FallbackHttpClient): TranslateLoader {
    const url = 'assets/staticdata/static.mytbtranslations-'
    return new TranslateJsonPHttpLoader(http, url,  environment.assetsPathVersionSnippet + '.js' + environment.assetsPathVersionSuffix);
}

@NgModule({
    imports: [
        AppModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [FallbackHttpClient]
            }
        })
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ],
    // Since the bootstrapped component is not inherited from your
    // imported AppModule, it needs to be repeated here.
    bootstrap: [AppComponent],
})
export class AppViewerModule {}
