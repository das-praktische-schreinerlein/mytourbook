import {ChangeDetectorRef, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {ToastsManager} from 'ng2-toastr';
import {CommonDocRoutingService} from '../services/cdoc-routing.service';
import {Layout} from '../../angular-commons/services/layout.service';
import {PDocRecord} from '../../pdoc-commons/model/records/pdoc-record';
import {ResolvedData} from '../../angular-commons/resolver/resolver.utils';
import {ErrorResolver} from '../resolver/error.resolver';
import {SectionsPDocRecordResolver} from '../resolver/sections-pdoc-details.resolver';
import {IdValidationRule, KeywordValidationRule} from '../../search-commons/model/forms/generic-validator.util';
import {GenericAppService} from '../../commons/services/generic-app.service';
import {PageUtils} from '../../angular-commons/services/page.utils';
import {AngularMarkdownService} from '../../angular-commons/services/angular-markdown.service';
import {AngularHtmlService} from '../../angular-commons/services/angular-html.service';
import {CommonRoutingService, RoutingState} from '../../angular-commons/services/common-routing.service';
import {GenericTrackingService} from '../../angular-commons/services/generic-tracking.service';
import {PlatformService} from '../../angular-commons/services/platform.service';
import {BeanUtils} from '../../commons/utils/bean.utils';
import {CommonDocSearchForm} from '../../search-commons/model/forms/cdoc-searchform';
import {CommonDocSearchResult} from '../../search-commons/model/container/cdoc-searchresult';
import {CommonDocDataService} from '../../search-commons/services/cdoc-data.service';
import {CommonDocRecord} from '../../search-commons/model/records/cdoc-entity-record';
import {CommonDocContentUtils} from '../services/cdoc-contentutils.service';
import {AbstractCommonDocRecordResolver} from '../resolver/abstract-cdoc-details.resolver';

export abstract class AbstractCommonDocShowpageComponent<R extends CommonDocRecord, F extends CommonDocSearchForm,
    S extends CommonDocSearchResult<R, F>, D extends CommonDocDataService<R, F, S>> implements OnInit, OnDestroy {
    private flgDescRendered = false;
    idValidationRule = new IdValidationRule(true);
    keywordsValidationRule = new KeywordValidationRule(true);
    public contentUtils: CommonDocContentUtils;
    public record: R;
    public Layout = Layout;
    pdoc: PDocRecord;
    baseSearchUrl: string;
    baseSearchUrlDefault: string;
    queryParamMap: ParamMap = undefined;

    constructor(protected route: ActivatedRoute, protected cdocRoutingService: CommonDocRoutingService,
                protected toastr: ToastsManager, vcr: ViewContainerRef, contentUtils: CommonDocContentUtils,
                protected errorResolver: ErrorResolver, protected pageUtils: PageUtils,
                protected commonRoutingService: CommonRoutingService, protected angularMarkdownService: AngularMarkdownService,
                protected angularHtmlService: AngularHtmlService, protected cd: ChangeDetectorRef,
                protected trackingProvider: GenericTrackingService, protected appService: GenericAppService,
                protected platformService: PlatformService) {
        this.contentUtils = contentUtils;
        this.toastr.setRootViewContainerRef(vcr);
        this.configureBaseSearchUrlDefault();
    }

    ngOnInit() {
        // Subscribe to route params
        const me = this;
        this.route.queryParamMap.subscribe(value => {
            me.queryParamMap = value;
        });
        this.route.data.subscribe(
            (data: { record: ResolvedData<R>, pdoc: ResolvedData<PDocRecord>, baseSearchUrl: ResolvedData<string> }) => {
                me.commonRoutingService.setRoutingState(RoutingState.DONE);

                const config = me.appService.getAppConfig();
                me.flgDescRendered = false;

                me.configureProcessingOfResolvedData({});
                if (me.processError(data)) {
                    return;
                }

                me.record = data.record.data;
                me.pdoc = (data.pdoc ? data.pdoc.data : undefined);
                me.baseSearchUrl = data.baseSearchUrl.data;

                me.doProcessAfterResolvedData({});

                me.setMetaTags(me.pdoc, me.record, config);
                me.pageUtils.setMetaLanguage();

                me.cd.markForCheck();
                me.pageUtils.scrollToTop();

                this.trackingProvider.trackPageView();
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

    onScrollToTop() {
        this.pageUtils.scrollToTop();
    }

    ngOnDestroy() {
    }

    submitBackToSearch() {
        this.cdocRoutingService.navigateBackToSearch('#' + this.record.id);
        return false;
    }

    getBackToSearchUrl(): string {
        return this.cdocRoutingService.getLastSearchUrl() + '#' + this.record.id;
    }

    protected abstract configureBaseSearchUrlDefault(): void;

    protected configureProcessingOfResolvedData(config: {}): void {
    }

    protected abstract getConfiguredIndexableTypes(config: {}): string[];

    protected doProcessAfterResolvedData(config: {}): void {
    }

    protected setMetaTags(pdoc: PDocRecord, record: CommonDocRecord, config: {}): void {
        const recordName = this.keywordsValidationRule.sanitize(record.name);
        if (pdoc) {
            this.pageUtils.setTranslatedTitle('meta.title.prefix.cdocSectionShowPage',
                {title: pdoc.heading, cdoc: recordName}, pdoc.heading + ' ' + recordName);
            this.pageUtils.setTranslatedDescription('meta.desc.prefix.cdocSectionShowPage',
                {title: pdoc.heading, teaser: pdoc.teaser, cdoc: recordName}, recordName);
            this.pageUtils.setRobots(false, false);

            const indexableTypes = this.getConfiguredIndexableTypes(config);
            if (pdoc.id === 'start' && indexableTypes.indexOf(record.type) >= 0) {
                this.pageUtils.setRobots(true, true);
            } else {
                this.pageUtils.setRobots(false, false);
            }
        } else {
            this.pageUtils.setGlobalStyle('', 'sectionStyle');
            this.pageUtils.setTranslatedTitle('meta.title.prefix.cdocShowPage',
                {cdoc: recordName}, recordName);
            this.pageUtils.setTranslatedDescription('meta.desc.prefix.cdocShowPage',
                {cdoc: recordName}, recordName);
            this.pageUtils.setRobots(false, false);
        }
    }

    protected processError(data: { record: ResolvedData<R>, pdoc: ResolvedData<PDocRecord>,
        baseSearchUrl: ResolvedData<string> }): boolean {
        const flgCDocError = ErrorResolver.isResolverError(data.record);
        const flgPDocError = ErrorResolver.isResolverError(data.pdoc);
        const flgBaseSearchUrlError = ErrorResolver.isResolverError(data.baseSearchUrl);

        if (!flgCDocError && !flgPDocError && !flgBaseSearchUrlError) {
            return false;
        }

        let newUrl, msg, code;
        let errorCode;
        if (flgCDocError) {
            errorCode = data.record.error.code;
        } else {
            errorCode = (flgPDocError ? data.pdoc.error.code : data.baseSearchUrl.error.code);
        }
        const sectionId = (flgPDocError ? data.pdoc.error.data : data.pdoc.data.id);
        const cdocId = (flgCDocError ? data.record.error.data : data.record.data.id);
        const cdocName = (flgCDocError ? 'name' : data.record.data.name);
        switch (errorCode) {
            case SectionsPDocRecordResolver.ERROR_INVALID_SECTION_ID:
            case AbstractCommonDocRecordResolver.ERROR_INVALID_DOC_ID:
                code = ErrorResolver.ERROR_INVALID_ID;
                if (sectionId && sectionId !== '') {
                    this.baseSearchUrl = ['sections', this.idValidationRule.sanitize(sectionId)].join('/');
                } else {
                    this.baseSearchUrl = this.baseSearchUrlDefault;
                }
                newUrl = [this.baseSearchUrl,
                    'show',
                    this.idValidationRule.sanitize(cdocName),
                    this.idValidationRule.sanitize(cdocId)].join('/');
                msg = undefined;
                break;
            case SectionsPDocRecordResolver.ERROR_UNKNOWN_SECTION_ID:
                code = ErrorResolver.ERROR_UNKNOWN_ID;
                this.baseSearchUrl = this.baseSearchUrlDefault;
                newUrl = [this.baseSearchUrl,
                    'show',
                    this.idValidationRule.sanitize(cdocName),
                    this.idValidationRule.sanitize(cdocId)].join('/');
                msg = undefined;
                break;
            case AbstractCommonDocRecordResolver.ERROR_UNKNOWN_DOC_ID:
                code = ErrorResolver.ERROR_UNKNOWN_ID;
                if (sectionId && sectionId !== '') {
                    this.baseSearchUrl = ['sections', this.idValidationRule.sanitize(sectionId)].join('/');
                } else {
                    this.baseSearchUrl = this.baseSearchUrlDefault;
                }
                newUrl = [this.baseSearchUrl].join('/');
                msg = undefined;
                break;
            case SectionsPDocRecordResolver.ERROR_READING_SECTION_ID:
            case AbstractCommonDocRecordResolver.ERROR_READING_DOC_ID:
                code = ErrorResolver.ERROR_WHILE_READING;
                this.baseSearchUrl = this.baseSearchUrlDefault;
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
                this.baseSearchUrl = this.baseSearchUrlDefault;
                newUrl = undefined;
                msg = undefined;
        }

        this.errorResolver.redirectAfterRouterError(code, newUrl, this.toastr, msg);
        this.cd.markForCheck();
        return true;
    }
}
