import {Inject, Injectable, Optional} from '@angular/core';

@Injectable()
export class AssetsService {
    constructor(@Optional() @Inject('baseUrl') private baseUrl: string) {
    }

    public getAssetsUrl(url: string): string {
        return this.baseUrl ? this.baseUrl + url : url;
    }
}
