import {Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SDocRecord} from '../../../shared/sdoc-commons/model/records/sdoc-record';

@Injectable()
export class SDocRoutingService {
    private lastSearchUrl = '/sdoc/search/';

    constructor(private router: Router) {
    }

    setLastSearchUrl(lastSearchUrl: string): void {
        this.lastSearchUrl = lastSearchUrl;
    }

    getLastSearchUrl(): string {
        return this.lastSearchUrl;
    }

    getBackToFromUrl(route: ActivatedRoute): string {
        let redirectUrl = this.getLastSearchUrl();
        const from = this.getFromRoute(route);
        if (from !== undefined && from !== null && !from.startsWith('http://')) {
            redirectUrl = from;
        }
        return redirectUrl;
    }

    getShowUrl(sDoc: SDocRecord, from: string): string {
        const name = (sDoc.name ? sDoc.name : '')
            .replace(/[^-a-zA-Z0-9.+]+/g, ' ')
            .replace(/ +/g, ' ').replace(/ /g, '-').trim();
        return '/sdoc/show/' + name + '/' + sDoc.id + (from ? '?from=' + from : '');
    }

    navigateBackToFrom(route: ActivatedRoute): Promise<boolean> {
        return this.router.navigateByUrl(this.getBackToFromUrl(route));
    }

    navigateBackToSearch(): Promise<boolean> {
        return this.router.navigateByUrl(this.getLastSearchUrl());
    }

    navigateToShow(sDoc: SDocRecord, from: string): Promise<boolean> {
        return this.router.navigateByUrl(this.getShowUrl(sDoc, from));
    }

    getFromRoute(route: ActivatedRoute): string {
        const from = route.snapshot.queryParamMap.get('from');
        if (from !== undefined && from !== null && !from.startsWith('http://')) {
            return from;
        }

        return undefined;
    }
}
