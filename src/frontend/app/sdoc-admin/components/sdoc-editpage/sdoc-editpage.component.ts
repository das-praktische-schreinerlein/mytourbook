import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {ActivatedRoute} from '@angular/router';
import {ToastsManager} from 'ng2-toastr';
import {CommonDocRoutingService} from '../../../../shared/frontend-commons/services/cdoc-routing.service';
import {Layout} from '../../../../shared/angular-commons/services/layout.service';
import {PDocRecord} from '../../../../shared/pdoc-commons/model/records/pdoc-record';
import {ResolvedData} from '../../../../shared/angular-commons/resolver/resolver.utils';
import {ErrorResolver} from '../../../sections/resolver/error.resolver';
import {IdValidationRule, KeywordValidationRule} from '../../../../shared/search-commons/model/forms/generic-validator.util';
import {SDocRecordResolver} from '../../../shared-sdoc/resolver/sdoc-details.resolver';
import {AppState, GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {PageUtils} from '../../../../shared/angular-commons/services/page.utils';
import {SDocSearchResult} from '../../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {AngularMarkdownService} from '../../../../shared/angular-commons/services/angular-markdown.service';
import {AngularHtmlService} from '../../../../shared/angular-commons/services/angular-html.service';
import {CommonRoutingService, RoutingState} from '../../../../shared/angular-commons/services/common-routing.service';
import {GenericTrackingService} from '../../../../shared/angular-commons/services/generic-tracking.service';
import {PlatformService} from '../../../../shared/angular-commons/services/platform.service';
import {SDocDataService} from '../../../../shared/sdoc-commons/services/sdoc-data.service';
import {BeanUtils} from '../../../../shared/commons/utils/bean.utils';
import {SDocContentUtils} from '../../../shared-sdoc/services/sdoc-contentutils.service';

@Component({
    selector: 'app-sdoc-editwpage',
    templateUrl: './sdoc-editpage.component.html',
    styleUrls: ['./sdoc-editpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocEditpageComponent implements OnInit, OnDestroy {
    private config;
    idValidationRule = new IdValidationRule(true);
    keywordsValidationRule = new KeywordValidationRule(true);
    public contentUtils: SDocContentUtils;
    public record: SDocRecord;
    public Layout = Layout;
    pdoc: PDocRecord;
    baseSearchUrl: string;
    tracks: SDocRecord[] = [];
    trackRouten: SDocRecord[] = [];

    constructor(private route: ActivatedRoute, private cdocRoutingService: CommonDocRoutingService,
                private toastr: ToastsManager, vcr: ViewContainerRef, contentUtils: SDocContentUtils,
                private errorResolver: ErrorResolver, private pageUtils: PageUtils, private commonRoutingService: CommonRoutingService,
                private angularMarkdownService: AngularMarkdownService, private angularHtmlService: AngularHtmlService,
                private cd: ChangeDetectorRef, private trackingProvider: GenericTrackingService, private appService: GenericAppService,
                private platformService: PlatformService, private sdocDataService: SDocDataService) {
        this.contentUtils = contentUtils;
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        // Subscribe to route params
        const me = this;
        this.appService.getAppState().subscribe(appState => {
            if (appState === AppState.Ready) {
                this.config = this.appService.getAppConfig();
                if (! (BeanUtils.getValue(this.config, 'permissions.sdocWritable') === true)) {
                    console.warn('sdoc not writable');
                    this.record = undefined;
                    this.pdoc = undefined;
                    this.tracks = [];
                    this.trackRouten = [];

                    this.errorResolver.redirectAfterRouterError(ErrorResolver.ERROR_READONLY, undefined, this.toastr, undefined);
                    me.cd.markForCheck();
                    return;
                }

                this.route.data.subscribe(
                (data: { record: ResolvedData<SDocRecord>, baseSearchUrl: ResolvedData<string> }) => {
                    me.commonRoutingService.setRoutingState(RoutingState.DONE);
                    me.trackRouten = [];

                    const flgSDocError = ErrorResolver.isResolverError(data.record);
                    const flgBaseSearchUrlError = ErrorResolver.isResolverError(data.baseSearchUrl);
                    if (!flgSDocError && !flgBaseSearchUrlError) {
                        me.record = data.record.data;
                        me.baseSearchUrl = data.baseSearchUrl.data;

                        if (me.record.gpsTrackBasefile || me.record.geoLoc !== undefined) {
                            me.tracks = [me.record];
                        } else {
                            me.tracks = [];
                        }

                        const recordName = me.keywordsValidationRule.sanitize(me.record.name);
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
                            this.pageUtils.setRobots(false, false);
                        }
                        this.pageUtils.setMetaLanguage();

                        me.cd.markForCheck();
                        me.pageUtils.scrollToTop();

                        this.trackingProvider.trackPageView();
                        return;
                    }

                    let newUrl, msg, code;
                    let errorCode;
                    if (flgSDocError) {
                        errorCode = data.record.error.code;
                    } else {
                        errorCode = data.baseSearchUrl.error.code;
                    }
                    const sdocId = (flgSDocError ? data.record.error.data : data.record.data.id);
                    const sdocName = (flgSDocError ? 'name' : data.record.data.name);
                    switch (errorCode) {
                        case SDocRecordResolver.ERROR_INVALID_SDOC_ID:
                            code = ErrorResolver.ERROR_INVALID_ID;
                            me.baseSearchUrl = ['sdoc'].join('/');
                            newUrl = [me.baseSearchUrl,
                                'show',
                                this.idValidationRule.sanitize(sdocName),
                                this.idValidationRule.sanitize(sdocId)].join('/');
                            msg = undefined;
                            break;
                        case SDocRecordResolver.ERROR_UNKNOWN_SDOC_ID:
                            code = ErrorResolver.ERROR_UNKNOWN_ID;
                            me.baseSearchUrl = ['sdoc'].join('/');
                            newUrl = [me.baseSearchUrl].join('/');
                            msg = undefined;
                            break;
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
                });
            }
        });
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

    onTrackRoutenFound(searchresult: SDocSearchResult) {
        const trackRouten = [];
        if (searchresult !== undefined && searchresult.currentRecords !== undefined) {
            for (const record of searchresult.currentRecords) {
                trackRouten.push(record);
            }
        }
        this.trackRouten = trackRouten;
    }

    ngOnDestroy() {
    }

    getFiltersForType(record: SDocRecord, type: string): any {
        return this.contentUtils.getSDocSubItemFiltersForType(record, type,
            (this.pdoc ? this.pdoc.theme : undefined));
    }

    submitSave(values: {}, backToSearch: boolean) {
        const me = this;

        this.sdocDataService.updateById(values['id'], values).then(function doneUpdateById(sdoc: SDocRecord) {
                if (backToSearch) {
                    me.cdocRoutingService.navigateBackToSearch('#' + me.record.id);
                } else {
                    me.cdocRoutingService.navigateToShow(sdoc, '');
                }
            },
            function errorCreate(reason: any) {
                console.error('edit updateById failed:', reason);
                me.toastr.error('Es gibt leider Probleme bei der Speichern - am besten noch einmal probieren :-(', 'Oje!');
            }
        );
        return false;
    }

    submitBackToShow() {
        this.cdocRoutingService.navigateToShow(this.record, '');
        return false;
    }

    submitBackToSearch() {
        this.cdocRoutingService.navigateBackToSearch('#' + this.record.id);
        return false;
    }

    getBackToSearchUrl(): string {
        return this.cdocRoutingService.getLastSearchUrl();
    }

    getBackToShowUrl(): string {
        return this.cdocRoutingService.getShowUrl(this.record, '');
    }
}
