import {TranslateLoader} from '@ngx-translate/core';
import {FallbackHttpClient} from './fallback-http-client';
import {defer, from} from 'rxjs';

export class TranslateJsonPHttpLoader extends TranslateLoader {
    constructor(private http: FallbackHttpClient, private prefix = '/assets/i18n/', private suffix = '.js') {
        super();
    };

    getTranslation(lang) {
        console.log('get locale')
        return defer(() => from(
            this.http.loadJsonPData(`${this.prefix}${lang}${this.suffix}`, 'importStaticTranslationsJsonP', 'translations ')
                ));
    }
}
