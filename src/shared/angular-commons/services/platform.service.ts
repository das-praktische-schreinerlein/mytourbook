import {Inject, Injectable, Optional, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

@Injectable()
export class PlatformService {
    constructor(@Optional() @Inject('baseUrl') private baseUrl: string,
                @Inject(PLATFORM_ID) protected platformId: Object) {
    }

    public getAssetsUrl(url: string): string {
        return this.baseUrl ? this.baseUrl + url : url;
    }

    public isClient() {
        return isPlatformBrowser(this.platformId);
    }
}
