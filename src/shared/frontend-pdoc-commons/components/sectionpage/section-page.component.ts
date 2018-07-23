import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PDocRecord} from '../../../pdoc-commons/model/records/pdoc-record';
import {ToastsManager} from 'ng2-toastr';
import {Layout, LayoutService, LayoutSize, LayoutSizeData, SearchFormLayout} from '../../../angular-commons/services/layout.service';
import {PDocDataService} from '../../../pdoc-commons/services/pdoc-data.service';
import {ResolvedData} from '../../../angular-commons/resolver/resolver.utils';
import {ErrorResolver} from '../../../frontend-cdoc-commons/resolver/error.resolver';
import {SectionsPDocRecordResolver} from '../../../frontend-cdoc-commons/resolver/sections-pdoc-details.resolver';
import {IdValidationRule} from '../../../search-commons/model/forms/generic-validator.util';
import {GenericAppService} from '../../../commons/services/generic-app.service';
import {PageUtils} from '../../../angular-commons/services/page.utils';
import {AngularMarkdownService} from '../../../angular-commons/services/angular-markdown.service';
import {AngularHtmlService} from '../../../angular-commons/services/angular-html.service';
import {CommonRoutingService, RoutingState} from '../../../angular-commons/services/common-routing.service';
import {GenericTrackingService} from '../../../angular-commons/services/generic-tracking.service';
import {PlatformService} from '../../../angular-commons/services/platform.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Component({
    selector: 'app-sectionpage',
    templateUrl: './section-page.component.html',
    styleUrls: ['./section-page.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionPageComponent implements OnInit {
    protected flgDescRendered = false;
    protected layoutSizeObservable: BehaviorSubject<LayoutSizeData>;
    idValidationRule = new IdValidationRule(true);
    pdoc: PDocRecord = new PDocRecord();
    baseSearchUrl = '';
    sections: PDocRecord[] = [];
    public Layout = Layout;
    SearchFormLayout = SearchFormLayout;
    searchFormLayout: SearchFormLayout = SearchFormLayout.GRID;

    constructor(protected route: ActivatedRoute, protected pdocDataService: PDocDataService,
                protected commonRoutingService: CommonRoutingService, protected errorResolver: ErrorResolver,
                protected toastr: ToastsManager, vcr: ViewContainerRef, protected pageUtils: PageUtils,
                protected angularMarkdownService: AngularMarkdownService, protected angularHtmlService: AngularHtmlService,
                protected cd: ChangeDetectorRef, protected trackingProvider: GenericTrackingService,
                protected platformService: PlatformService, protected layoutService: LayoutService,
                protected appService: GenericAppService) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        // Subscribe to route params
        const me = this;
        this.layoutSizeObservable = this.layoutService.getLayoutSizeData();
        this.layoutSizeObservable.subscribe(layoutSizeData => {
            me.onResize(layoutSizeData);
        });

        this.route.data.subscribe(
            (data: { pdoc: ResolvedData<PDocRecord>, baseSearchUrl: ResolvedData<string> }) => {
                me.commonRoutingService.setRoutingState(RoutingState.DONE);

                const config = me.appService.getAppConfig();
                me.configureProcessingOfResolvedData(config);

                const flgPDocError = ErrorResolver.isResolverError(data.pdoc);
                const flgBaseSearchUrlError = ErrorResolver.isResolverError(data.baseSearchUrl);
                if (!flgPDocError && !flgBaseSearchUrlError) {
                    me.pdoc = data.pdoc.data;
                    me.flgDescRendered = false;
                    me.baseSearchUrl = data.baseSearchUrl.data;
                    me.sections =  me.getSubSections(me.pdoc);

                    me.doProcessAfterResolvedData(config);

                    this.pageUtils.setTranslatedTitle('meta.title.prefix.sectionPage',
                        {title: me.pdoc.heading}, me.pdoc.heading);
                    this.pageUtils.setTranslatedDescription('meta.desc.prefix.sectionPage',
                        {title: me.pdoc.heading, teaser: me.pdoc.teaser}, me.pdoc.teaser);
                    this.pageUtils.setRobots(true, true);
                    this.pageUtils.setMetaLanguage();

                    me.cd.markForCheck();
                    me.pageUtils.scrollToTop();

                    this.trackingProvider.trackPageView();
                    return;
                }

                me.pdoc = undefined;
                let newUrl, msg, code;
                const errorCode = (flgPDocError ? data.pdoc.error.code : data.baseSearchUrl.error.code);
                const sectionId = (flgPDocError ? data.pdoc.error.data : data.baseSearchUrl.error.data);
                switch (errorCode) {
                    case SectionsPDocRecordResolver.ERROR_INVALID_SECTION_ID:
                        code = ErrorResolver.ERROR_INVALID_ID;
                        me.baseSearchUrl = ['sections', this.idValidationRule.sanitize(sectionId)].join('/');
                        newUrl = [me.baseSearchUrl].join('/');
                        msg = undefined;
                        break;
                    case SectionsPDocRecordResolver.ERROR_UNKNOWN_SECTION_ID:
                        code = ErrorResolver.ERROR_UNKNOWN_ID;
                        me.baseSearchUrl = ['sections', 'start'].join('/');
                        if (data.pdoc.state.url === me.baseSearchUrl) {
                            newUrl = 'errorpage';
                            msg = 'Es ist leider ein unglaublich schwerwiegender Fehler aufgetreten. ' +
                                'Bitte probieren Sie es später noch einmal :-(';
                        } else {
                            newUrl = [me.baseSearchUrl].join('/');
                            msg = undefined;
                        }
                        break;
                    case SectionsPDocRecordResolver.ERROR_READING_SECTION_ID:
                        code = ErrorResolver.ERROR_WHILE_READING;
                        me.baseSearchUrl = ['sections', 'start'].join('/');
                        if (data.pdoc.state.url === me.baseSearchUrl) {
                            newUrl = 'errorpage';
                            msg = 'Es ist leider ein unglaublich schwerwiegender Fehler aufgetreten. ' +
                                'Bitte probieren Sie es später noch einmal :-(';
                        } else {
                            newUrl = undefined;
                            msg = undefined;
                        }
                        break;
                    case GenericAppService.ERROR_APP_NOT_INITIALIZED:
                        code = ErrorResolver.ERROR_APP_NOT_INITIALIZED;
                        newUrl = undefined;
                        msg = undefined;
                        break;
                    default:
                        code = ErrorResolver.ERROR_OTHER;
                        me.baseSearchUrl = ['sections', 'start'].join('/');
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
        if (this.flgDescRendered) {
            return;
        }

        if (!this.pdoc) {
            this.flgDescRendered = true;
            return;
        }

        if (!this.platformService.isClient()) {
            return this.pdoc.descTxt || '';
        }

        if (this.pdoc.descHtml) {
            this.flgDescRendered = this.angularHtmlService.renderHtml('#desc', this.pdoc.descHtml, true);
        } else {
            const desc = this.pdoc.descMd ? this.pdoc.descMd : '';
            this.flgDescRendered = this.angularMarkdownService.renderMarkdown('#desc', desc, true);
        }

        return '';
    }

    onShow(record: PDocRecord) {
        this.commonRoutingService.navigateByUrl('sections/' + record.id);
        return false;
    }

    onScrollToTop() {
        this.pageUtils.scrollToTop();
    }

    getSubSections(pdoc: PDocRecord): PDocRecord[] {
        return this.pdocDataService.getSubDocuments(pdoc);
    }

    protected configureProcessingOfResolvedData(config: {}): void {
    }

    protected doProcessAfterResolvedData(config: {}): void {
    }

    protected onResize(layoutSizeData: LayoutSizeData): void {
        if (this.platformService.isClient() && layoutSizeData.layoutSize >= LayoutSize.VERYBIG && !this.layoutService.isPrintMode()) {
            this.searchFormLayout = SearchFormLayout.STACKED;
        } else {
            this.searchFormLayout = SearchFormLayout.GRID;
        }

        this.cd.markForCheck();
    }
}
