import {MarkdownService} from 'angular2-markdown';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';

@Injectable()
export class AngularMarkdownService {
    constructor(private router: Router, private markdownService: MarkdownService) {
    }

    renderMarkdown(parentSelector: string, markdown: string, routeLocalLinkWithAngularRouter: boolean): boolean {
        const inputEl = document.querySelector(parentSelector);
        if (!inputEl || inputEl === undefined || inputEl === null) {
            return false;
        }

        inputEl.innerHTML = '';
        try {
            inputEl.innerHTML = this.markdownService.compile(markdown);
        } finally {}

        if (!routeLocalLinkWithAngularRouter) {
            return true;
        }

        const links = document.querySelectorAll(parentSelector + ' a');
        const me = this;
        for (let i = 0; i < links.length; i++) {
            const link = links[i];
            const url = link.getAttribute('href');
            if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto://')) {
                continue;
            }
            link.addEventListener('click', function (event) {
                me.router.navigateByUrl(url);
                event.preventDefault();
                return false;
            });
        }

        return true;
    }

}
