import {Injectable} from '@angular/core';
import {SDocRecord} from '../../../shared/sdoc-commons/model/records/sdoc-record';
import {CommonRoutingService} from '../../../shared/angular-commons/services/common-routing.service';

@Injectable()
export class SDocRoutingService {
    private lastSearchUrl = '/sdoc/search/';
    private lastBaseUrl = '/sdoc/';

    constructor(private commonRoutingService: CommonRoutingService) {
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
        const name = (sDoc.name ? sDoc.name : 'name')
            .replace(/[^-a-zA-Z0-9.+]+/g, ' ')
            .replace(/ +/g, ' ').replace(/ /g, '-').trim();
        return this.lastBaseUrl + 'show/' + name + '/' + sDoc.id; // + (from ? '?from=' + from : '');
    }

    navigateBackToSearch(suffix?: string): Promise<boolean> {
        return this.commonRoutingService.navigateByUrl(this.getLastSearchUrl() + (suffix ? suffix : ''));
    }

    navigateToShow(sDoc: SDocRecord, from: string): Promise<boolean> {
        return this.commonRoutingService.navigateByUrl(this.getShowUrl(sDoc, from));
    }
}
