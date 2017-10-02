import {Router} from '@angular/router';
import {Injectable} from '@angular/core';

@Injectable()
export class AngularHtmlService {
    constructor(private router: Router) {
    }

    renderHtml(parentSelector: string, html: string, routeLocalLinkWithAngularRouter: boolean): boolean {
        const inputEl = document.querySelector(parentSelector);
        if (!inputEl || inputEl === undefined || inputEl === null) {
            return false;
        }

        inputEl.innerHTML = html;

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
            link.removeEventListener('click');
            link.addEventListener('click', function (event) {
                event.preventDefault();
                me.router.navigateByUrl(url);
                return false;
            });
        }

        return true;
    }

}
