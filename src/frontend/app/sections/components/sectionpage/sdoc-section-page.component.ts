import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewContainerRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PDocRecord} from '../../../../shared/pdoc-commons/model/records/pdoc-record';
import {ToastsManager} from 'ng2-toastr';
import {SDocSearchFormConverter} from '../../../shared-sdoc/services/sdoc-searchform-converter.service';
import {LayoutService} from '../../../../shared/angular-commons/services/layout.service';
import {PDocDataService} from '../../../../shared/pdoc-commons/services/pdoc-data.service';
import {CommonDocRoutingService} from '../../../../shared/frontend-cdoc-commons/services/cdoc-routing.service';
import {ErrorResolver} from '../../../../shared/frontend-cdoc-commons/resolver/error.resolver';
import {SDocSearchForm, SDocSearchFormFactory} from '../../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {PageUtils} from '../../../../shared/angular-commons/services/page.utils';
import {SDocSearchResult} from '../../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {Facets} from '../../../../shared/search-commons/model/container/facets';
import {AngularMarkdownService} from '../../../../shared/angular-commons/services/angular-markdown.service';
import {AngularHtmlService} from '../../../../shared/angular-commons/services/angular-html.service';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';
import {GenericTrackingService} from '../../../../shared/angular-commons/services/generic-tracking.service';
import {PlatformService} from '../../../../shared/angular-commons/services/platform.service';
import {BeanUtils} from '../../../../shared/commons/utils/bean.utils';
import {environment} from '../../../../environments/environment';
import {SectionPageComponent} from '../../../../shared/frontend-pdoc-commons/components/sectionpage/section-page.component';

@Component({
    selector: 'app-sdoc-sectionpage',
    templateUrl: './sdoc-section-page.component.html',
    styleUrls: ['./sdoc-section-page.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocSectionPageComponent extends SectionPageComponent {
    sdocSearchForm: SDocSearchForm = new SDocSearchForm({});
    sdocSearchResult: SDocSearchResult = new SDocSearchResult(this.sdocSearchForm, 0, undefined, new Facets());
    routeSearchResult: SDocSearchResult = new SDocSearchResult(this.sdocSearchForm, 0, undefined, new Facets());
    availableTabs = {
        'IMAGE': true,
        'ROUTE': true,
        'TRACK': true,
        'LOCATION': true,
        'TRIP': true,
        'VIDEO': true,
        'ALL': true
    };

    constructor(route: ActivatedRoute, pdocDataService: PDocDataService,
                commonRoutingService: CommonRoutingService, private searchFormConverter: SDocSearchFormConverter,
                errorResolver: ErrorResolver, private sDocRoutingService: CommonDocRoutingService,
                toastr: ToastsManager, vcr: ViewContainerRef, pageUtils: PageUtils,
                angularMarkdownService: AngularMarkdownService, angularHtmlService: AngularHtmlService,
                cd: ChangeDetectorRef, trackingProvider: GenericTrackingService, platformService: PlatformService,
                layoutService: LayoutService, appService: GenericAppService) {
        super(route, pdocDataService, commonRoutingService, errorResolver, toastr, vcr,
            pageUtils, angularMarkdownService, angularHtmlService, cd, trackingProvider, platformService,
            layoutService, appService);
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
            if (sort === 'ratePers') {
                filters['moreFilter'] = 'personalRateOverall:8,9,10,11,12,13,14,15';
            }
        }

        if (type === 'NEWS') {
            filters['perPage'] = 2;
            return filters;
        }

        filters['when'] = this.sdocSearchForm.when.toString();  // stringify array
        filters['where'] = this.searchFormConverter.joinWhereParams(this.sdocSearchForm);
        filters['what'] = this.searchFormConverter.joinWhatParams(this.sdocSearchForm);
        filters['nearBy'] = this.sdocSearchForm.nearby;
        filters['nearbyAddress'] = this.sdocSearchForm.nearbyAddress;
        filters['fulltext'] = this.sdocSearchForm.fulltext;

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

    onTagcloudClicked(filterValue: any, filter: string) {
        this.sdocSearchForm.type = 'route';
        this.sdocSearchForm[filter] = filterValue;
        const url = this.searchFormConverter.searchFormToUrl(this.baseSearchUrl, SDocSearchFormFactory.createSanitized({
            theme: this.pdoc.theme,
            perPage: 10,
            type: 'route',
            actiontype: this.sdocSearchForm.actiontype.toString(),
            when: this.sdocSearchForm.when.toString(),
            what: this.sdocSearchForm.what.toString(),
            where: this.sdocSearchForm.where.toString(),
            nearBy: this.sdocSearchForm.nearby,
            personalRateDifficulty: this.sdocSearchForm.personalRateDifficulty,
            techRateOverall: this.sdocSearchForm.techRateOverall,
            nearbyAddress: this.sdocSearchForm.nearbyAddress,
            fulltext: this.sdocSearchForm.fulltext
        }));
        this.commonRoutingService.navigateByUrl(url);

        return false;
    }

    getToSearchUrl() {
        return this.searchFormConverter.searchFormToUrl(this.baseSearchUrl, SDocSearchFormFactory.createSanitized({
            theme: this.pdoc.theme,
            perPage: 10,
            type: environment.defaultSearchTypes,
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

    protected configureProcessingOfResolvedData(config: {}): void {
        if (BeanUtils.getValue(config, 'components.pdoc-sectionpage.availableTabs') !== undefined) {
            this.availableTabs = BeanUtils.getValue(config, 'components.pdoc-sectionpage.availableTabs');
        }
    }

    protected doProcessAfterResolvedData(config: {}): void {
        this.sDocRoutingService.setLastBaseUrl(this.baseSearchUrl);
        this.sDocRoutingService.setLastSearchUrl(this.getToSearchUrl());
    }

}
