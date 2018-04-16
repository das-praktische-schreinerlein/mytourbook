import {Meta, Title} from '@angular/platform-browser';
import {ElementRef, Inject, Injectable, LOCALE_ID} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DOCUMENT} from '@angular/common';

@Injectable()
export class PageUtils {
    public constructor(private titleService: Title, private metaService: Meta,
                       @Inject(LOCALE_ID) private locale: string, private translateService: TranslateService,
                       @Inject(DOCUMENT) private document) { }

    public setTranslatedTitle(key: string, values: any, defaultValue: string) {
        this.setTitle(this.translateService.instant(key, values) || defaultValue);
    }

    public setTranslatedDescription(key: string, values: any, defaultValue: string) {
        this.setMetaDescription(this.translateService.instant(key, values) || defaultValue);
    }

    public setTitle(newTitle: string) {
        this.titleService.setTitle( newTitle );
    }

    public setMetaDescription(newDesc: string) {
        const selector = 'name="description"';
        this.metaService.removeTag(selector);
        this.metaService.addTag({ name: 'description', content: newDesc, lang: this.locale});
    }

    public setMetaKeywords(newKeywords: string) {
        const selector = 'name="keywords"';
        this.metaService.removeTag(selector);
        this.metaService.addTag({ name: 'keywords', content: newKeywords, lang: this.locale});
    }

    public setRobots(flgIndex: boolean, flgFollow: boolean) {
        const selector = 'name="robots"';
        const flags = [
            flgIndex ? 'index' : 'noindex,nosnippet,noodp,noarchive,noimageindex',
            flgFollow ? 'follow' : 'nofollow'
        ].join(',');
        this.metaService.removeTag(selector);
        this.metaService.addTag({ name: 'robots', content: flags});

    }

    public setMetaLanguage() {
        const selector = 'name="language"';
        this.metaService.removeTag(selector);
        this.metaService.addTag({ name: 'language', content: this.locale});
    }


    public setGlobalStyle(style: string, id: string) {
        this.removeGlobalStyle(id);

        const element = this.document.createElement('style');
        element.setAttribute('id', id);
        element.setAttribute('type', 'text/css');
        element.innerHTML = style ? style : '';

        const body = this.document.getElementsByTagName('body')[0];
        body.appendChild(element);
        return element;
    }

    public removeGlobalStyle(id: string) {
        const element = this.document.getElementById(id);
        if (!element) {
            return;
        }
        // Chrome, Edge, Fiefox, ...
        if (Element.prototype.hasOwnProperty('remove')) {
            return element.remove();
        }
        if (element.parentNode !== null) {
            // IE
            return element.parentNode.removeChild(element);
        }
    }

    public scrollToTop() {
        if (window !== undefined && (typeof window.scrollTo === 'function')) {
            window.scrollTo(0, 0);
        }
    }

    public scrollToTopOfElement(el: ElementRef) {
        if (el.nativeElement !== undefined && (typeof el.nativeElement.scrollIntoView === 'function')) {
            el.nativeElement.scrollIntoView(true);
        }
    }

    public goToLinkAnchor(anchor: string): void {
        if (anchor !== undefined && anchor !== null && anchor.length > 1) {
            const me = this;
            setTimeout(function init() {
                const element: HTMLElement = me.document.querySelector('[name=' + anchor + ']');
                if (element) {
                    element.scrollIntoView(true);
                    element.style.width = '100%';
                    element.style.display = 'block';
                    element.innerHTML =  '&#128279;';
                }
            }, 500);
        }
    }

}
