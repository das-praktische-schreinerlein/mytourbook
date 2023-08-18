import {Injectable} from '@angular/core';
import {ExtendedAngularMarkdownService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/extended-angular-markdown.service';
import {AngularHtmlService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-html.service';

@Injectable()
export class SpecificAngularMarkdownService extends ExtendedAngularMarkdownService {
    constructor(angularHtmlService: AngularHtmlService) {
        super(angularHtmlService);
    }
}
