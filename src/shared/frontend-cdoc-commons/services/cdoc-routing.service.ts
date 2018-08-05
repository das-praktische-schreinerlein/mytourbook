import {Injectable} from '@angular/core';
import {CommonRoutingService} from '../../angular-commons/services/common-routing.service';
import {CommonDocRecord} from '../../search-commons/model/records/cdoc-entity-record';

@Injectable()
export class CommonDocRoutingService {
    protected lastSearchUrl = '/sdoc/search/';
    protected lastBaseUrl = '/sdoc/';

    constructor(protected commonRoutingService: CommonRoutingService) {
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

    getShowUrl(sDoc: CommonDocRecord, from: string): string {
        const name = (sDoc.name ? sDoc.name : 'name')
            .replace(/[^-a-zA-Z0-9.+]+/g, ' ')
            .replace(/ +/g, ' ').replace(/ /g, '-').trim();
        return this.lastBaseUrl + 'show/' + name + '/' + sDoc.id; // + (from ? '?from=' + from : '');
    }

    navigateBackToSearch(suffix?: string): Promise<boolean> {
        return this.commonRoutingService.navigateByUrl(this.getLastSearchUrl() + (suffix ? suffix : ''));
    }

    navigateToShow(sDoc: CommonDocRecord, from: string): Promise<boolean> {
        return this.commonRoutingService.navigateByUrl(this.getShowUrl(sDoc, from));
    }
}
