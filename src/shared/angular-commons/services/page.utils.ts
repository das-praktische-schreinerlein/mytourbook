import {Meta, Title} from '@angular/platform-browser';
import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class PageUtils {
    public constructor(private titleService: Title, private metaService: Meta,
                       @Inject(LOCALE_ID) private locale: string, private translateService: TranslateService) { }

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

    public setMetaLanguage() {
        const selector = 'name="language"';
        this.metaService.removeTag(selector);
        this.metaService.addTag({ name: 'language', content: this.locale});
    }
}
