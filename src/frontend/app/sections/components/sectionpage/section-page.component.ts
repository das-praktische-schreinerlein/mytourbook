import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PDocRecord} from '../../../../shared/pdoc-commons/model/records/pdoc-record';
import {ToastsManager} from 'ng2-toastr';
import {SDocSearchFormConverter} from '../../../shared-sdoc/services/sdoc-searchform-converter.service';
import {Layout} from '../../../shared-sdoc/components/sdoc-list/sdoc-list.component';
import {PDocDataService} from '../../../../shared/pdoc-commons/services/pdoc-data.service';
import {SDocRoutingService} from '../../../shared-sdoc/services/sdoc-routing.service';
import {ResolvedData} from '../../../../shared/angular-commons/resolver/resolver.utils';
import {ErrorResolver} from '../../resolver/error.resolver';
import {SectionsPDocRecordResolver} from '../../resolver/sections-pdoc-details.resolver';
import {IdValidationRule} from '../../../../shared/search-commons/model/forms/generic-validator.util';
import {SDocSearchForm, SDocSearchFormFactory} from '../../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {PageUtils} from '../../../../shared/angular-commons/services/page.utils';
import {SDocSearchResult} from '../../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {Facets} from '../../../../shared/search-commons/model/container/facets';
import {AngularMarkdownService} from '../../../../shared/angular-commons/services/angular-markdown.service';
import {AngularHtmlService} from '../../../../shared/angular-commons/services/angular-html.service';
import {CommonRoutingService, RoutingState} from '../../../../shared/angular-commons/services/common-routing.service';
import {GenericTrackingService} from '../../../../shared/angular-commons/services/generic-tracking.service';
import {PlatformService} from '../../../../shared/angular-commons/services/platform.service';
import {SearchFormLayout} from '../../../shared-sdoc/components/sdoc-searchform/sdoc-searchform.component';
import {LayoutService, LayoutSizeData} from '../../../../shared/angular-commons/services/layout.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {LayoutSize} from '../../../../../shared/angular-commons/services/layout.service';

@Component({
    selector: 'app-sectionpage',
    templateUrl: './section-page.component.html',
    styleUrls: ['./section-page.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionPageComponent implements OnInit {
    private flgDescRendered = false;
    private layoutSizeObservable: BehaviorSubject<LayoutSizeData>;
    idValidationRule = new IdValidationRule(true);
    pdoc: PDocRecord = new PDocRecord();
    baseSearchUrl = '';
    sections: PDocRecord[] = [];
    public Layout = Layout;
    sdocSearchForm: SDocSearchForm = new SDocSearchForm({});
    sdocSearchResult: SDocSearchResult = new SDocSearchResult(this.sdocSearchForm, 0, undefined, new Facets());
    routeSearchResult: SDocSearchResult = new SDocSearchResult(this.sdocSearchForm, 0, undefined, new Facets());
    SearchFormLayout = SearchFormLayout;
    searchFormLayout: SearchFormLayout = SearchFormLayout.GRID;

    constructor(private route: ActivatedRoute, private pdocDataService: PDocDataService,
                private commonRoutingService: CommonRoutingService, private searchFormConverter: SDocSearchFormConverter,
                private errorResolver: ErrorResolver, private sDocRoutingService: SDocRoutingService,
                private toastr: ToastsManager, vcr: ViewContainerRef, private pageUtils: PageUtils,
                private angularMarkdownService: AngularMarkdownService, private angularHtmlService: AngularHtmlService,
                private cd: ChangeDetectorRef, private trackingProvider: GenericTrackingService, private platformService: PlatformService,
                private layoutService: LayoutService) {
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

                const flgPDocError = ErrorResolver.isResolverError(data.pdoc);
                const flgBaseSearchUrlError = ErrorResolver.isResolverError(data.baseSearchUrl);
                if (!flgPDocError && !flgBaseSearchUrlError) {
                    me.pdoc = data.pdoc.data;
                    me.flgDescRendered = false;
                    me.baseSearchUrl = data.baseSearchUrl.data;
                    me.sections =  me.getSubSections(me.pdoc);
                    me.sDocRoutingService.setLastBaseUrl(me.baseSearchUrl);
                    me.sDocRoutingService.setLastSearchUrl(me.getToSearchUrl());
                    this.pageUtils.setTranslatedTitle('meta.title.prefix.sectionPage',
                        {title: me.pdoc.heading}, me.pdoc.heading);
                    this.pageUtils.setTranslatedDescription('meta.desc.prefix.sectionPage',
                        {title: me.pdoc.heading, teaser: me.pdoc.teaser}, me.pdoc.teaser);
                    this.pageUtils.setRobots(true, true);
                    this.pageUtils.setMetaLanguage();

                    me.cd.markForCheck();

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

    getFiltersForType(record: PDocRecord, type: string, sort?: string): any {
        const filters = {
            type: type
        };

        filters['theme'] = record.theme;
        if (type === 'IMAGE') {
            filters['perPage'] = 6;
        } else {
            filters['perPage'] = 5;
        }

        if (sort) {
            filters['sort'] = sort;
        }

        if (type === 'NEWS') {
            filters['perPage'] = 3;
            return filters;
        }

        filters['when'] = this.sdocSearchForm.when.toString();  // stringify array
        filters['where'] = this.searchFormConverter.joinWhereParams(this.sdocSearchForm);
        filters['what'] = this.searchFormConverter.joinWhatParams(this.sdocSearchForm);
        filters['nearBy'] = this.sdocSearchForm.nearby;
        filters['nearbyAddress'] = this.sdocSearchForm.nearbyAddress;

        return filters;
    }

    onSearchSDoc(sdocSearchForm: SDocSearchForm) {
        this.sdocSearchForm = sdocSearchForm;
        this.sDocRoutingService.setLastSearchUrl(this.getToSearchUrl());
        this.cd.markForCheck();
        return false;
    }

    onTopTenResultFound(sdocSearchResult: SDocSearchResult) {
        if (sdocSearchResult !== undefined && sdocSearchResult.searchForm !== undefined) {
            this.sdocSearchResult = sdocSearchResult;
        }
        this.cd.markForCheck();
        return false;
    }

    onTopTenRouteResultFound(sdocSearchResult: SDocSearchResult) {
        this.routeSearchResult = sdocSearchResult;
        this.onTopTenResultFound(sdocSearchResult);
    }

    onShow(record: PDocRecord) {
        this.commonRoutingService.navigateByUrl('sections/' + record.id);
        return false;
    }

    onTagcloudClicked(filterValue: any, filter: string) {
        this.sdocSearchForm.type = 'route';
        this.sdocSearchForm[filter] = filterValue;
        const url = this.searchFormConverter.searchFormToUrl(this.baseSearchUrl, SDocSearchFormFactory.createSanitized({
            theme: this.pdoc.theme,
            type: 'route',
            actiontype: this.sdocSearchForm.actiontype.toString(),
            when: this.sdocSearchForm.when.toString(),
            what: this.sdocSearchForm.what.toString(),
            where: this.sdocSearchForm.where.toString(),
            nearBy: this.sdocSearchForm.nearby,
            nearbyAddress: this.sdocSearchForm.nearbyAddress
        }));
        this.commonRoutingService.navigateByUrl(url);

        return false;
    }

    getToSearchUrl() {
        return this.searchFormConverter.searchFormToUrl(this.baseSearchUrl, SDocSearchFormFactory.createSanitized({
            theme: this.pdoc.theme,
            type: 'route,location,track,trip,news',
            actiontype: this.sdocSearchForm.actiontype.toString(),
            when: this.sdocSearchForm.when.toString(),
            what: this.sdocSearchForm.what.toString(),
            where: this.sdocSearchForm.where.toString(),
            nearBy: this.sdocSearchForm.nearby,
            nearbyAddress: this.sdocSearchForm.nearbyAddress
        }));
    }

    submitToSearch() {
        const url = this.getToSearchUrl();
        // console.log('submitToSearch: redirect to ', url);

        this.commonRoutingService.navigateByUrl(url);
        return false;
    }

    getSubSections(pdoc: PDocRecord): PDocRecord[] {
        return this.pdocDataService.getSubDocuments(pdoc);
    }

    private onResize(layoutSizeData: LayoutSizeData): void {
        if (this.platformService.isClient() && layoutSizeData.layoutSize >= LayoutSize.VERYBIG) {
            this.searchFormLayout = SearchFormLayout.STACKED;
        } else {
            this.searchFormLayout = SearchFormLayout.GRID;
        }

        this.cd.markForCheck();
    }
}
