import {NgModule} from '@angular/core';
import {AppComponent} from './components/app/app.component';
import {AppRoutingModule} from './app.router';
import {AppCommonModule} from './app.common.module';
import {registerLocaleData} from '@angular/common';
import localeDe from '@angular/common/locales/de';
import {AngularMarkdownService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-markdown.service';
import {SpecificAngularMarkdownService} from './services/specific-angular-markdown.service';
import {AngularHtmlService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-html.service';
import {SpecificAngularHtmlService} from './services/specific-angular-html.service';
import {HtmlLocalLinkRenderer} from '@dps/mycms-frontend-commons/dist/angular-commons/htmlrenderer/html-locallink.renderer';
import {
    HtmlTogglerRenderer,
    SimpleHtmlTogglerRenderer
} from '@dps/mycms-frontend-commons/dist/angular-commons/htmlrenderer/html-toggler.renderer';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {AppService} from './services/app.service';

registerLocaleData(localeDe);

@NgModule({
    entryComponents: [
    ],
    imports: [
        AppCommonModule,
        AppRoutingModule
    ],
    providers: [
        {provide: GenericAppService, useClass: AppService},
        {provide: AngularMarkdownService, useClass: SpecificAngularMarkdownService},
        {provide: AngularHtmlService, useClass: SpecificAngularHtmlService},
        HtmlLocalLinkRenderer,
        {provide: HtmlTogglerRenderer, useClass: SimpleHtmlTogglerRenderer}
    ],
    // Since the bootstrapped component is not inherited from your
    // imported AppModule, it needs to be repeated here.
    bootstrap: [AppComponent]
})
export class AppReadOnlyModule {}
