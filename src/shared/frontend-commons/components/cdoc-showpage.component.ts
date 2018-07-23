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
                const flgCDocError = ErrorResolver.isResolverError(data.record);
                const flgPDocError = ErrorResolver.isResolverError(data.pdoc);
                const flgBaseSearchUrlError = ErrorResolver.isResolverError(data.baseSearchUrl);
                me.flgDescRendered = false;

                me.configureProcessingOfResolvedData();

                if (!flgCDocError && !flgPDocError && !flgBaseSearchUrlError) {
                    me.record = data.record.data;
                    me.pdoc = (data.pdoc ? data.pdoc.data : undefined);
                    me.baseSearchUrl = data.baseSearchUrl.data;

                    me.doProcessAfterResolvedData();

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
                    me.pageUtils.scrollToTop();

                    this.trackingProvider.trackPageView();
                    return;
                }

                let newUrl, msg, code;
                let errorCode;
                if (flgCDocError) {
                    errorCode = data.record.error.code;
                } else {
                    errorCode = (flgPDocError ? data.pdoc.error.code : data.baseSearchUrl.error.code);
                }
                const sectionId = (flgPDocError ? data.pdoc.error.data : data.pdoc.data.id);
                const sdocId = (flgCDocError ? data.record.error.data : data.record.data.id);
                const sdocName = (flgCDocError ? 'name' : data.record.data.name);
                switch (errorCode) {
                    case SectionsPDocRecordResolver.ERROR_INVALID_SECTION_ID:
                    case AbstractCommonDocRecordResolver.ERROR_INVALID_DOC_ID:
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
                    case AbstractCommonDocRecordResolver.ERROR_UNKNOWN_DOC_ID:
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
                    case AbstractCommonDocRecordResolver.ERROR_READING_DOC_ID:
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

    protected configureProcessingOfResolvedData(): void {
    }

    protected doProcessAfterResolvedData(): void {
    }
}
