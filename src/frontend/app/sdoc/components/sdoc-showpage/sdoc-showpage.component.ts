import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
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
import {IdValidationRule, KeywordValidationRule} from '../../../../shared/search-commons/model/forms/generic-validator.util';
import {SDocRecordResolver} from '../../../shared-sdoc/resolver/sdoc-details.resolver';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {PageUtils} from '../../../../shared/angular-commons/services/page.utils';
import {SDocSearchResult} from '../../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {AngularMarkdownService} from '../../../../shared/angular-commons/services/angular-markdown.service';
import {AngularHtmlService} from '../../../../shared/angular-commons/services/angular-html.service';
import {CommonRoutingService, RoutingState} from '../../../../shared/angular-commons/services/common-routing.service';
import {GenericTrackingService} from '../../../../shared/angular-commons/services/generic-tracking.service';
import {PlatformService} from '../../../../shared/angular-commons/services/platform.service';
import {ActionTagEvent} from '../../../shared-sdoc/components/sdoc-actiontags/sdoc-actiontags.component';
import {LayoutService} from '../../../../shared/angular-commons/services/layout.service';
import {SDocSearchForm} from '../../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {Facets} from '../../../../../shared/search-commons/model/container/facets';
import {SDocSearchFormConverter} from '../../../shared-sdoc/services/sdoc-searchform-converter.service';
import {BeanUtils} from '../../../../shared/commons/utils/bean.utils';

@Component({
    selector: 'app-sdoc-showpage',
    templateUrl: './sdoc-showpage.component.html',
    styleUrls: ['./sdoc-showpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocShowpageComponent implements OnInit, OnDestroy {
    private flgDescRendered = false;
    idValidationRule = new IdValidationRule(true);
    keywordsValidationRule = new KeywordValidationRule(true);
    public contentUtils: SDocContentUtils;
    public record: SDocRecord;
    public Layout = Layout;
    pdoc: PDocRecord;
    baseSearchUrl: string;
    tracks: SDocRecord[] = [];
    tagcloudSearchResult = new SDocSearchResult(new SDocSearchForm({}), 0, undefined, new Facets());
    flgShowMap = false;
    flgShowProfileMap = false;
    flgShowTopImages = true;
    flgMapAvailable = false;
    flgProfileMapAvailable = false;
    flgTopImagesAvailable = false;

    constructor(private route: ActivatedRoute, private sdocRoutingService: SDocRoutingService,
                private toastr: ToastsManager, vcr: ViewContainerRef, contentUtils: SDocContentUtils,
                private errorResolver: ErrorResolver, private pageUtils: PageUtils, private commonRoutingService: CommonRoutingService,
                private angularMarkdownService: AngularMarkdownService, private angularHtmlService: AngularHtmlService,
                private cd: ChangeDetectorRef, private trackingProvider: GenericTrackingService, private appService: GenericAppService,
                private platformService: PlatformService, private layoutService: LayoutService,
                private searchFormConverter: SDocSearchFormConverter) {
        this.contentUtils = contentUtils;
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        // Subscribe to route params
        const me = this;
        this.route.data.subscribe(
            (data: { record: ResolvedData<SDocRecord>, pdoc: ResolvedData<PDocRecord>, baseSearchUrl: ResolvedData<string> }) => {
                me.commonRoutingService.setRoutingState(RoutingState.DONE);

                const config = me.appService.getAppConfig();
                const flgSDocError = ErrorResolver.isResolverError(data.record);
                const flgPDocError = ErrorResolver.isResolverError(data.pdoc);
                const flgBaseSearchUrlError = ErrorResolver.isResolverError(data.baseSearchUrl);
                me.flgDescRendered = false;
                if (!flgSDocError && !flgPDocError && !flgBaseSearchUrlError) {
                    me.record = data.record.data;
                    me.pdoc = (data.pdoc ? data.pdoc.data : undefined);
                    me.baseSearchUrl = data.baseSearchUrl.data;
                    me.tagcloudSearchResult = new SDocSearchResult(new SDocSearchForm({}), 0, undefined, new Facets());

                    if (me.record.gpsTrackBasefile || me.record.geoLoc !== undefined
                        || (me.record.gpsTrackSrc !== undefined && me.record.gpsTrackSrc.length > 20)) {
                        me.tracks = [me.record];
                        me.flgMapAvailable = true;
                        me.flgProfileMapAvailable = (me.record.gpsTrackBasefile !== undefined
                            || (me.record.gpsTrackSrc !== undefined && me.record.gpsTrackSrc.length > 20));
                    } else {
                        me.tracks = [];
                        me.flgMapAvailable = false;
                        me.flgProfileMapAvailable = false;
                    }

                    me.flgShowMap = this.flgMapAvailable;
                    me.calcShowMaps();
                    me.flgTopImagesAvailable = true;
                    me.flgShowTopImages = true;

                    const recordName = me.keywordsValidationRule.sanitize(me.record.name);
                    if (me.pdoc) {
                        this.pageUtils.setTranslatedTitle('meta.title.prefix.sdocSectionShowPage',
                            {title: me.pdoc.heading, sdoc: recordName}, me.pdoc.heading + ' ' + recordName);
                        this.pageUtils.setTranslatedDescription('meta.desc.prefix.sdocSectionShowPage',
                            {title: me.pdoc.heading, teaser: me.pdoc.teaser, sdoc: recordName}, recordName);
                        this.pageUtils.setRobots(false, false);

                        let indexableTypes = [];
                        if (BeanUtils.getValue(config, 'services.seo.sdocIndexableTypes')) {
                            indexableTypes = config['services']['seo']['sdocIndexableTypes'];
                        }

                        if (me.pdoc.id === 'start' && indexableTypes.indexOf(me.record.type) >= 0) {
                            this.pageUtils.setRobots(true, true);
                        } else {
                            this.pageUtils.setRobots(false, false);
                        }
                    } else {
                        me.pageUtils.setGlobalStyle('', 'sectionStyle');
                        this.pageUtils.setTranslatedTitle('meta.title.prefix.sdocShowPage',
                            {sdoc: recordName}, recordName);
                        this.pageUtils.setTranslatedDescription('meta.desc.prefix.sdocShowPage',
                            {sdoc: recordName}, recordName);
                        this.pageUtils.setRobots(false, false);
                    }
                    this.pageUtils.setMetaLanguage();

                    me.cd.markForCheck();

                    this.trackingProvider.trackPageView();
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
                me.cd.markForCheck();
                return;
            }
        );
    }

    renderDesc(): string {
        if (this.flgDescRendered || !this.record) {
            return;
        }

        if (!this.platformService.isClient()) {
            return this.record.descTxt || '';
        }

        if (this.record.descHtml) {
            this.flgDescRendered = this.angularHtmlService.renderHtml('#desc', this.record.descHtml, true);
        } else {
            const desc = this.record.descMd ? this.record.descMd : '';
            this.flgDescRendered = this.angularMarkdownService.renderMarkdown('#desc', desc, true);
        }

        return '';
    }

    onRouteTracksFound(searchresult: SDocSearchResult) {
        this.onTackCloudRoutesFound(searchresult);
        this.onTracksFound(searchresult);
    }

    onTackCloudRoutesFound(searchresult: SDocSearchResult) {
        this.tagcloudSearchResult = searchresult;
    }

    onTracksFound(searchresult: SDocSearchResult) {
        const realTracks = [];
        if (searchresult !== undefined && searchresult.currentRecords !== undefined) {
            for (const record of searchresult.currentRecords) {
                if (record.gpsTrackBasefile || record.geoLoc !== undefined
                    || (record.gpsTrackSrc !== undefined && record.gpsTrackSrc.length > 20)) {
                    realTracks.push(record);
                    this.flgMapAvailable = true;
                    this.flgProfileMapAvailable = true;

                    this.flgShowMap = this.flgMapAvailable;
                    this.calcShowMaps();
                }
            }
        }
        this.tracks = realTracks;

        this.cd.markForCheck();
    }

    onTopImagesFound(searchResult: SDocSearchResult) {
        if (searchResult === undefined || searchResult.recordCount <= 3) {
            this.flgTopImagesAvailable = false;
        } else {
            this.flgTopImagesAvailable = true;
        }
        this.flgShowTopImages = this.flgTopImagesAvailable;
        if (!this.layoutService.isDesktop()) {
            this.flgShowTopImages = false;
        }
        this.cd.markForCheck();

        return false;
    }

    onTagcloudClicked(filterValue: any, filter: string) {
        const filters = this.getFiltersForType(this.record, 'ROUTE');
        filters[filter] = filterValue;
        const searchForm = new SDocSearchForm(filters);
        const url = this.searchFormConverter.searchFormToUrl(this.baseSearchUrl, searchForm);
        this.commonRoutingService.navigateByUrl(url);

        return false;
    }


    public onActionTagEvent(event: ActionTagEvent) {
        if (event.result !== undefined) {
            this.record = <SDocRecord>event.result;
            this.cd.markForCheck();
        }

        return false;
    }

    ngOnDestroy() {
    }

    submitBackToSearch() {
        this.sdocRoutingService.navigateBackToSearch('#' + this.record.id);
        return false;
    }

    getBackToSearchUrl(): string {
        return this.sdocRoutingService.getLastSearchUrl() + '#' + this.record.id;
    }

    getFiltersForType(record: SDocRecord, type: string): any {
        return this.contentUtils.getSDocSubItemFiltersForType(record, type,
            (this.pdoc ? this.pdoc.theme : undefined));
    }

    private calcShowMaps() {
        if (this.layoutService.isSpider() || this.layoutService.isServer()) {
            this.flgShowProfileMap = false;
            this.flgShowMap = false;
            return;
        }
        if (!this.flgProfileMapAvailable) {
            this.flgShowProfileMap = false;
            return;
        }
        if (!this.layoutService.isDesktop() &&
            (this.record.type === 'LOCATION' || this.record.type === 'TRIP' || this.record.type === 'NEWS')) {
            this.flgShowProfileMap = false;
            return;
        }

        this.flgShowProfileMap = true;
    }
}
