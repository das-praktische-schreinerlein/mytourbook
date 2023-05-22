import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef} from '@angular/core';
import {PDocRecord} from '@dps/mycms-commons/dist/pdoc-commons/model/records/pdoc-record';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {LayoutService, LayoutSizeData} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {ErrorResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/error.resolver';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {PDocSearchResult} from '@dps/mycms-commons/dist/pdoc-commons/model/container/pdoc-searchresult';
import {AngularMarkdownService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-markdown.service';
import {AngularHtmlService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-html.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {GenericTrackingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/generic-tracking.service';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {PDocSearchForm} from '@dps/mycms-commons/dist/pdoc-commons/model/forms/pdoc-searchform';
import {Facets} from '@dps/mycms-commons/dist/search-commons/model/container/facets';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {isArray, isNumber} from 'util';
import {PDocDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.service';
import {
    CommonDocShowpageComponent,
    CommonDocShowpageComponentConfig
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-showpage.component';
import {environment} from '../../../../../environments/environment';
import {PDocRoutingService} from '../../../shared-pdoc/services/pdoc-routing.service';
import {PDocContentUtils} from '../../../shared-pdoc/services/pdoc-contentutils.service';
import {PDocSearchFormConverter} from '../../../shared-pdoc/services/pdoc-searchform-converter.service';

export interface PDocShowpageComponentAvailableTabs {
    ALL_ENTRIES?: boolean;
    PAGE?: boolean;
    ALL?: boolean;
}

@Component({
    selector: 'app-pdoc-showpage',
    templateUrl: './pdoc-showpage.component.html',
    styleUrls: ['./pdoc-showpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PDocShowpageComponent extends CommonDocShowpageComponent<PDocRecord, PDocSearchForm, PDocSearchResult,
    PDocDataService> {
    tagcloudSearchResult = new PDocSearchResult(new PDocSearchForm({}), 0, undefined, new Facets());
    showResultListTrigger: {
        ALL_ENTRIES?: boolean|number;
        PAGE?: boolean|number;
    } = {
        ALL_ENTRIES: true,
        PAGE: false
    };
    availableTabs: PDocShowpageComponentAvailableTabs = {
        ALL_ENTRIES: false,
        PAGE: true
    };
    private layoutSize: LayoutSizeData;

    constructor(route: ActivatedRoute, cdocRoutingService: PDocRoutingService,
                toastr: ToastrService, contentUtils: PDocContentUtils,
                errorResolver: ErrorResolver, pageUtils: PageUtils, commonRoutingService: CommonRoutingService,
                angularMarkdownService: AngularMarkdownService, angularHtmlService: AngularHtmlService,
                cd: ChangeDetectorRef, trackingProvider: GenericTrackingService, appService: GenericAppService,
                platformService: PlatformService, protected searchFormConverter: PDocSearchFormConverter,
                layoutService: LayoutService, protected elRef: ElementRef, router: Router) {
        super(route, cdocRoutingService, toastr, contentUtils, errorResolver, pageUtils, commonRoutingService,
            angularMarkdownService, angularHtmlService, cd, trackingProvider, appService, platformService, layoutService,
            environment, router);
    }

    getFiltersForType(record: PDocRecord, type: string): any {
        const minPerPage = isNumber(this.showResultListTrigger[type]) ? this.showResultListTrigger[type] : 0;

        const theme = this.pdoc ? this.pdoc.theme : undefined;
        const filters = (<PDocContentUtils>this.contentUtils).getPDocSubItemFiltersForType(record, type, theme, minPerPage);

        return filters;
    }

    renderDesc(): string {
        if (!this.record || this.record.descTxt === undefined || this.record.descTxt.toLowerCase() === 'tododesc') {
            return;
        }

        return super.renderDesc();
    }

    protected onResize(layoutSizeData: LayoutSizeData): void {
        super.onResize(layoutSizeData);
        this.layoutSize = layoutSizeData;
        this.cd.markForCheck();
    }

    protected getComponentConfig(config: {}): CommonDocShowpageComponentConfig {
        return {
            baseSearchUrl: ['pdoc'].join('/'),
            baseSearchUrlDefault: ['pdoc'].join('/'),
            modalOutletName: 'pdocmodalshow'
        };
    }

    protected configureProcessingOfResolvedData(): void {
        const me = this;
        const config = me.appService.getAppConfig();
        if (BeanUtils.getValue(config, 'components.pdoc-showpage.availableTabs') !== undefined) {
            me.availableTabs = BeanUtils.getValue(config, 'components.pdoc-showpage.availableTabs');
        }

        const allowedParams = BeanUtils.getValue(config, 'components.pdoc-showpage.allowedQueryParams');
        if (me.queryParamMap && isArray(allowedParams)) {
            for (const type in me.showResultListTrigger) {
                const paramName = 'show' + type;
                const param = me.queryParamMap.get(paramName);
                if (allowedParams.indexOf(paramName) >= 0 && param) {
                    me.showResultListTrigger[type] =
                        PDocSearchForm.genericFields.perPage.validator.sanitize(param);
                }
            }
        }

        if (environment.hideInternalDescLinks === true) {
            this.pageUtils.setGlobalStyle('.show-page #desc [href*="sections/"] { cursor: not-allowed; pointer-events: none; text-decoration: none; opacity: 0.5; color: currentColor; }'
                + ' .show-page #desc a[href*="sections/"]::before { content: \'\uD83D\uDEAB\'; font-size: smaller}',
                'pdocShowpageHideInternalDescLinks');
        } else {
            this.pageUtils.setGlobalStyle('', 'pdocShowpageHideInternalDescLinks');
        }

        if (environment.hideInternalImages === true) {
            this.pageUtils.setGlobalStyle('.show-page #desc img[src*="api/static/picturestore"] {display:none;}',
                'pdocShowpageHideInternalImages');
        } else {
            this.pageUtils.setGlobalStyle('', 'pdocShowpageHideInternalImages');
        }
    }

    protected getConfiguredIndexableTypes(config: {}): string[] {
        let indexableTypes = [];
        if (BeanUtils.getValue(config, 'services.seo.pdocIndexableTypes')) {
            indexableTypes = config['services']['seo']['pdocIndexableTypes'];
        }

        return indexableTypes;
    }

    protected doProcessAfterResolvedData(): void {
        const me = this;
        me.tagcloudSearchResult = new PDocSearchResult(new PDocSearchForm({}), 0, undefined, new Facets());
    }
}
