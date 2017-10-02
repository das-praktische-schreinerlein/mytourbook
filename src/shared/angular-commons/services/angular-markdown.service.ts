import {MarkdownService} from 'angular2-markdown';
import {Injectable} from '@angular/core';
import {AngularHtmlService} from './angular-html.service';

@Injectable()
export class AngularMarkdownService {
    constructor(private htmlService: AngularHtmlService, private markdownService: MarkdownService) {
    }

    renderMarkdown(parentSelector: string, markdown: string, routeLocalLinkWithAngularRouter: boolean): boolean {
        let html = '';
        try {
            html = this.markdownService.compile(markdown);
        } finally {}

        return this.htmlService.renderHtml(parentSelector, html, routeLocalLinkWithAngularRouter);
    }
}
