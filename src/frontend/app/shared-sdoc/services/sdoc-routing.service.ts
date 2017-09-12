import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {SDocRecord} from '../../../shared/sdoc-commons/model/records/sdoc-record';

@Injectable()
export class SDocRoutingService {
    private lastSearchUrl = '/sdoc/search/';
    private lastBaseUrl = '/sdoc/';

    constructor(private router: Router) {
    }

    setLastSearchUrl(lastSearchUrl: string): void {
        this.lastSearchUrl = lastSearchUrl;
    }

    getLastSearchUrl(): string {
        return this.lastSearchUrl;
    }

    setLastBaseUrl(lastBaseUrl: string): void {
        this.lastBaseUrl = lastBaseUrl;
    }

    getLastBaseUrl(): string {
        return this.lastBaseUrl;
    }

    getShowUrl(sDoc: SDocRecord, from: string): string {
        const name = (sDoc.name ? sDoc.name : '')
            .replace(/[^-a-zA-Z0-9.+]+/g, ' ')
            .replace(/ +/g, ' ').replace(/ /g, '-').trim();
        return this.lastBaseUrl + 'show/' + name + '/' + sDoc.id; // + (from ? '?from=' + from : '');
    }

    navigateBackToSearch(): Promise<boolean> {
        return this.router.navigateByUrl(this.getLastSearchUrl());
    }

    navigateToShow(sDoc: SDocRecord, from: string): Promise<boolean> {
        return this.router.navigateByUrl(this.getShowUrl(sDoc, from));
    }
}
