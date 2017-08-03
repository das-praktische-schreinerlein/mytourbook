import {Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {ActivatedRoute} from '@angular/router';
import {ToastsManager} from 'ng2-toastr';
import {SDocRoutingService} from '../../../shared-sdoc/services/sdoc-routing.service';
import {Layout} from '../../../shared-sdoc/components/sdoc-list/sdoc-list.component';
import {SDocContentUtils} from '../../../shared-sdoc/services/sdoc-contentutils.service';
import {PDocRecord} from '../../../../shared/pdoc-commons/model/records/pdoc-record';
import {ResolvedData} from '../../../../shared/angular-commons/resolver/resolver.utils';
import {ErrorResolver} from '../../../sections/resolver/error.resolver';
import {SectionsPDocRecordResolver} from '../../../sections/resolver/sections-pdoc-details.resolver';
import {IdValidationRule} from '../../../../shared/search-commons/model/forms/generic-validator.util';
import {SDocRecordResolver} from '../../../shared-sdoc/resolver/sdoc-details.resolver';
import {GenericAppService} from '../../../../shared/search-commons/services/generic-app.service';
import {PageUtils} from '../../../../shared/angular-commons/services/page.utils';
import {SDocSearchResult} from '../../../../shared/sdoc-commons/model/container/sdoc-searchresult';

@Component({
    selector: 'app-sdoc-showpage',
    templateUrl: './sdoc-showpage.component.html',
    styleUrls: ['./sdoc-showpage.component.css']
})
export class SDocShowpageComponent implements OnInit, OnDestroy {
    idValidationRule = new IdValidationRule(true);
    public contentUtils: SDocContentUtils;
    public record: SDocRecord;
    public Layout = Layout;
    pdoc: PDocRecord;
    baseSearchUrl: string;
    tracks: SDocRecord[] = [];

    constructor(private route: ActivatedRoute, private sdocRoutingService: SDocRoutingService,
                private toastr: ToastsManager, vcr: ViewContainerRef, contentUtils: SDocContentUtils,
                private errorResolver: ErrorResolver, private pageUtils: PageUtils) {
        this.contentUtils = contentUtils;
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        // Subscribe to route params
        const me = this;
        this.route.data.subscribe(
            (data: { record: ResolvedData<SDocRecord>, pdoc: ResolvedData<PDocRecord>, baseSearchUrl: ResolvedData<string> }) => {
                const flgSDocError = ErrorResolver.isResolverError(data.record);
                const flgPDocError = ErrorResolver.isResolverError(data.pdoc);
                const flgBaseSearchUrlError = ErrorResolver.isResolverError(data.baseSearchUrl);
                if (!flgSDocError && !flgPDocError && !flgBaseSearchUrlError) {
                    me.record = data.record.data;
                    me.pdoc = (data.pdoc ? data.pdoc.data : undefined);
                    me.baseSearchUrl = data.baseSearchUrl.data;

                    if (me.record.gpsTrackBasefile || me.record.geoLoc !== undefined) {
                        me.tracks = [me.record];
                    } else {
                        me.tracks = [];
                    }

                    const recordName = me.idValidationRule.sanitize(me.record.name);
                    if (me.pdoc) {
                        this.pageUtils.setTranslatedTitle('meta.title.prefix.sdocSectionShowPage',
                            {title: me.pdoc.heading, sdoc: recordName}, me.pdoc.heading + ' ' + recordName);
                        this.pageUtils.setTranslatedDescription('meta.desc.prefix.sdocSectionShowPage',
                            {title: me.pdoc.heading, teaser: me.pdoc.teaser, sdoc: recordName}, recordName);
                        this.pageUtils.setRobots(false, false);
                    } else {
                        me.pageUtils.setGlobalStyle('', 'sectionStyle');
                        this.pageUtils.setTranslatedTitle('meta.title.prefix.sdocShowPage',
                            {sdoc: recordName}, recordName);
                        this.pageUtils.setTranslatedDescription('meta.desc.prefix.sdocShowPage',
                            {sdoc: recordName}, recordName);
                        this.pageUtils.setRobots(true, false);
                    }
                    this.pageUtils.setMetaLanguage();

                    return;
                }

                let newUrl, msg, code;
                let errorCode;
                if (flgSDocError) {
                    errorCode = data.record.error.code;
                } else {
                    errorCode = (flgPDocError ? data.pdoc.error.code : data.baseSearchUrl.error.code);
                }
                const sectionId = (flgPDocError ? data.pdoc.error.data : data.pdoc.data.id);
                const sdocId = (flgSDocError ? data.record.error.data : data.record.data.id);
                const sdocName = (flgSDocError ? 'name' : data.record.data.name);
                switch (errorCode) {
                    case SectionsPDocRecordResolver.ERROR_INVALID_SECTION_ID:
                    case SDocRecordResolver.ERROR_INVALID_SDOC_ID:
                        code = ErrorResolver.ERROR_INVALID_ID;
                        if (sectionId && sectionId !== '') {
                            me.baseSearchUrl = ['sections', this.idValidationRule.sanitize(sectionId)].join('/');
                        } else {
                            me.baseSearchUrl = ['sdoc'].join('/');
                        }
                        newUrl = [me.baseSearchUrl,
                            'show',
                            this.idValidationRule.sanitize(sdocName),
                            this.idValidationRule.sanitize(sdocId)].join('/');
                        msg = undefined;
                        break;
                    case SectionsPDocRecordResolver.ERROR_UNKNOWN_SECTION_ID:
                        code = ErrorResolver.ERROR_UNKNOWN_ID;
                        me.baseSearchUrl = ['sdoc'].join('/');
                        newUrl = [me.baseSearchUrl,
                            'show',
                            this.idValidationRule.sanitize(sdocName),
                            this.idValidationRule.sanitize(sdocId)].join('/');
                        msg = undefined;
                        break;
                    case SDocRecordResolver.ERROR_UNKNOWN_SDOC_ID:
                        code = ErrorResolver.ERROR_UNKNOWN_ID;
                        if (sectionId && sectionId !== '') {
                            me.baseSearchUrl = ['sections', this.idValidationRule.sanitize(sectionId)].join('/');
                        } else {
                            me.baseSearchUrl = ['sdoc'].join('/');
                        }
                        newUrl = [me.baseSearchUrl].join('/');
                        msg = undefined;
                        break;
                    case SectionsPDocRecordResolver.ERROR_READING_SECTION_ID:
                    case SDocRecordResolver.ERROR_READING_SDOC_ID:
                        code = ErrorResolver.ERROR_WHILE_READING;
                        me.baseSearchUrl = ['sdoc'].join('/');
                        newUrl = undefined;
                        msg = undefined;
                        break;
                    case GenericAppService.ERROR_APP_NOT_INITIALIZED:
                        code = ErrorResolver.ERROR_APP_NOT_INITIALIZED;
                        newUrl = undefined;
                        msg = undefined;
                        break;
                    default:
                        code = ErrorResolver.ERROR_OTHER;
                        me.baseSearchUrl = ['sdoc'].join('/');
                        newUrl = undefined;
                        msg = undefined;
                }

                this.errorResolver.redirectAfterRouterError(code, newUrl, this.toastr, msg);
                return;
            }
        );
    }

    onTracksFound(searchresult: SDocSearchResult) {
        const realTracks = [];
        if (searchresult !== undefined && searchresult.currentRecords !== undefined) {
            for (const record of searchresult.currentRecords) {
                if (record.gpsTrackBasefile || record.geoLoc !== undefined) {
                    realTracks.push(record);
                }
            }
        }
        this.tracks = realTracks;
    }

    ngOnDestroy() {
    }

    submitBackToSearch() {
        this.sdocRoutingService.navigateBackToSearch();
        return false;
    }

    getBackToSearchUrl(): string {
        return this.sdocRoutingService.getLastSearchUrl();
    }

    getFiltersForType(record: SDocRecord, type: string): any {
        // TODO: move to Service
        const filters = {
            type: type
        };

        // filter theme only for locations
        if (record.type === 'LOCATION' && this.pdoc !== undefined && this.pdoc.theme !== undefined) {
            filters['theme'] = this.pdoc.theme;
        }
        filters['sort'] = 'ratePers';

        if (record.type === 'TRACK') {
            if (type === 'IMAGE' && record.trackId) {
                filters['moreFilter'] = 'track_id_i:' + record.trackId;
                filters['sort'] = 'dateAsc';
                filters['perPage'] = 100;
            } else if (type === 'ROUTE' && record.routeId) {
                filters['moreFilter'] = 'route_id_is:' + record.routeId;
            } else if (type === 'TRIP' && record.tripId) {
                filters['moreFilter'] = 'trip_id_i:' + record.tripId;
            } else if (type === 'LOCATION' && record.locId) {
                filters['moreFilter'] = 'loc_id_i:' + record.locId;
            } else {
                filters['moreFilter'] = 'track_id_i:' + record.trackId;
            }
        } else if (record.type === 'ROUTE') {
            if (type === 'LOCATION' && record.locId) {
                filters['moreFilter'] = 'loc_id_i:' + record.locId;
            } else if (type === 'IMAGE') {
                filters['moreFilter'] = 'route_id_i:' + record.routeId;
                filters['perPage'] = 12;
            } else if (type === 'TRACK') {
                filters['moreFilter'] = 'route_id_is:' + record.routeId;
            } else if (type === 'TRIP' && record.routeId) {
                filters['moreFilter'] = 'route_id_is:' + record.routeId;
            } else {
                filters['moreFilter'] = 'route_id_i:' + record.routeId;
            }
        } else if (record.type === 'LOCATION') {
            if (type === 'LOCATION') {
                filters['moreFilter'] = 'loc_parent_id_i:' + record.locId;
                filters['sort'] = 'location';
            } else {
                filters['moreFilter'] = 'loc_lochirarchie_ids_txt:' + record.locId;
                if (type === 'IMAGE') {
                    filters['perPage'] = 12;
                }
            }
        } else if (record.type === 'IMAGE') {
            if (type === 'TRACK' && record.trackId) {
                filters['moreFilter'] = 'track_id_i:' + record.trackId;
            } else if (type === 'ROUTE' && record.routeId) {
                filters['moreFilter'] = 'route_id_i:' + record.routeId;
            } else if (type === 'LOCATION' && record.locId) {
                filters['moreFilter'] = 'loc_id_i:' + record.locId;
            } else if (type === 'TRIP' && record.tripId) {
                filters['moreFilter'] = 'trip_id_i:' + record.tripId;
            } else {
                filters['moreFilter'] = 'image_id_i:' + record.imageId;
            }
        } else if (record.type === 'TRIP') {
            if (type === 'LOCATION' && record.locId) {
                filters['moreFilter'] = 'loc_id_i:' + record.locId;
            } else if (type === 'IMAGE') {
                filters['moreFilter'] = 'trip_id_i:' + record.tripId;
                filters['perPage'] = 12;
            } else if (type === 'TRACK') {
                filters['moreFilter'] = 'trip_id_i:' + record.tripId;
                filters['perPage'] = 99;
                filters['sort'] = 'dateAsc';
            } else {
                filters['moreFilter'] = 'trip_id_is:' + record.tripId;
            }
        }

        return filters;
    }
}
