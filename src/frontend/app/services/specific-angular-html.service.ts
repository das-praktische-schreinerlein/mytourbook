import {Injectable} from '@angular/core';
import {AngularHtmlService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-html.service';
import {HtmlLocalLinkRenderer} from '@dps/mycms-frontend-commons/dist/angular-commons/htmlrenderer/html-locallink.renderer';
import {HtmlTogglerRenderer} from '@dps/mycms-frontend-commons/dist/angular-commons/htmlrenderer/html-toggler.renderer';

@Injectable()
export class SpecificAngularHtmlService extends AngularHtmlService {
    constructor(protected htmlLocalLinkRenderer: HtmlLocalLinkRenderer,
                protected htmlTogglerRenderer: HtmlTogglerRenderer) {
        super([htmlLocalLinkRenderer, htmlTogglerRenderer]);
    }
}
