import {Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SDocSearchForm} from '../model/forms/sdoc-searchform';
import {SDocSearchFormConverter} from './sdoc-searchform-converter.service';
import {SDocRecord} from '../model/records/sdoc-record';

@Injectable()
export class SDocRoutingService {
    constructor(private router: Router, private searchFormConverter: SDocSearchFormConverter) {
    }

    getBackToFromUrl(route: ActivatedRoute): string {
        let redirectUrl = '/sdoc/list';
        const from = this.getFromRoute(route);
        if (from !== undefined && from !== null && from.startsWith('/sdocs/')) {
            redirectUrl = from;
        }
        return redirectUrl;
    }

    getEditUrl(sDocId: string, route: ActivatedRoute): string {
        const from = this.getFromRoute(route);
        return '/sdoc/edit/' + sDocId + (from ? '?from=' + from : '');
    }

    getShowUrl(sDoc: SDocRecord): string {
        const name = (sDoc.name ? sDoc.name : '')
            .replace(/[^-a-zA-Z0-9.+]+/g, ' ')
            .replace(/ +/g, ' ').replace(/ /g, '-').trim();
        return '/sdoc/show/' + name + '/' + sDoc.id;
    }

    getShowUrlFromSearch(sDoc: SDocRecord, searchForm: SDocSearchForm): string {
        const from = (searchForm ? this.searchFormConverter.searchFormToUrl('?from=/sdocs/', searchForm) : undefined);
        return this.getShowUrl(sDoc) + (from ? from : '');
    }

    getEditUrlFromSearch(sDocId: string, searchForm: SDocSearchForm): string {
        const from = (searchForm ? this.searchFormConverter.searchFormToUrl('?from=/sdocs/', searchForm) : undefined);
        return '/sdoc/edit/' + sDocId + (from ? from : '');
    }

    navigateBackToFrom(route: ActivatedRoute): Promise<boolean> {
        return this.router.navigateByUrl(this.getBackToFromUrl(route));
    }

    navigateToEdit(sDocId: string, route: ActivatedRoute): Promise<boolean> {
        return this.router.navigateByUrl(this.getEditUrl(sDocId, route));
    }

    navigateToShowFromSearch(sDoc: SDocRecord, searchForm: SDocSearchForm): Promise<boolean> {
        return this.router.navigateByUrl(this.getShowUrlFromSearch(sDoc, searchForm));
    }

    navigateToEditFromSearch(sDocId: string, searchForm: SDocSearchForm): Promise<boolean> {
        return this.router.navigateByUrl(this.getEditUrlFromSearch(sDocId, searchForm));
    }

    getFromRoute(route: ActivatedRoute): string {
        const from = route.snapshot.queryParamMap.get('from');
        if (from !== undefined && from !== null && from.startsWith('/sdocs/')) {
            return from;
        }

        return undefined;
    }
}
