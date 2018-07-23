import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewContainerRef} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {ActivatedRoute} from '@angular/router';
import {ToastsManager} from 'ng2-toastr';
import {CommonDocRoutingService} from '../../../../shared/frontend-commons/services/cdoc-routing.service';
import {Layout, LayoutService} from '../../../../shared/angular-commons/services/layout.service';
import {ErrorResolver} from '../../../../shared/frontend-commons/resolver/error.resolver';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {PageUtils} from '../../../../shared/angular-commons/services/page.utils';
import {SDocSearchResult} from '../../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {AngularMarkdownService} from '../../../../shared/angular-commons/services/angular-markdown.service';
import {AngularHtmlService} from '../../../../shared/angular-commons/services/angular-html.service';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';
import {GenericTrackingService} from '../../../../shared/angular-commons/services/generic-tracking.service';
import {PlatformService} from '../../../../shared/angular-commons/services/platform.service';
import {ActionTagEvent} from '../../../shared-sdoc/components/sdoc-actiontags/sdoc-actiontags.component';
import {SDocSearchForm} from '../../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {Facets} from '../../../../shared/search-commons/model/container/facets';
import {SDocSearchFormConverter} from '../../../shared-sdoc/services/sdoc-searchform-converter.service';
import {BeanUtils} from '../../../../shared/commons/utils/bean.utils';
import {isArray, isNumber} from 'util';
import {SDocContentUtils} from '../../../shared-sdoc/services/sdoc-contentutils.service';
import {SDocDataService} from '../../../../shared/sdoc-commons/services/sdoc-data.service';
import {AbstractCommonDocShowpageComponent} from '../../../../shared/frontend-commons/components/cdoc-showpage.component';

@Component({
    selector: 'app-sdoc-showpage',
    templateUrl: './sdoc-showpage.component.html',
    styleUrls: ['./sdoc-showpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocShowpageComponent extends AbstractCommonDocShowpageComponent<SDocRecord, SDocSearchForm, SDocSearchResult,
    SDocDataService> {
    public contentUtils: SDocContentUtils;
    public record: SDocRecord;
    tracks: SDocRecord[] = [];
    tagcloudSearchResult = new SDocSearchResult(new SDocSearchForm({}), 0, undefined, new Facets());
    flgShowMap = false;
    flgShowProfileMap = false;
    flgShowTopImages = true;
    flgMapAvailable = false;
    flgProfileMapAvailable = false;
    flgTopImagesAvailable = false;
    defaultSubImageLayout = Layout.SMALL;
    showResultListTrigger: {
        IMAGE: boolean|number;
        VIDEO: boolean|number;
        LOCATION: boolean|number;
        NEWS: boolean|number;
        ROUTE: boolean|number;
        TOPIMAGE: boolean|number;
        TRACK: boolean|number;
        TRIP: boolean|number;
    } = {
        IMAGE: false,
        VIDEO: false,
        LOCATION: false,
        NEWS: false,
        ROUTE: false,
        TOPIMAGE: false,
        TRACK: false,
        TRIP: false
    };
    availableTabs = {
        'IMAGE': true,
        'ROUTE': true,
        'TRACK': true,
        'LOCATION': true,
        'TRIP': true,
        'VIDEO': true,
        'NEWS': true
    };

    constructor(route: ActivatedRoute, cdocRoutingService: CommonDocRoutingService,
                toastr: ToastsManager, vcr: ViewContainerRef, contentUtils: SDocContentUtils,
                errorResolver: ErrorResolver, pageUtils: PageUtils, commonRoutingService: CommonRoutingService,
                angularMarkdownService: AngularMarkdownService, angularHtmlService: AngularHtmlService,
                cd: ChangeDetectorRef, trackingProvider: GenericTrackingService, appService: GenericAppService,
                platformService: PlatformService, private layoutService: LayoutService,
                private searchFormConverter: SDocSearchFormConverter) {
        super(route, cdocRoutingService, toastr, vcr, contentUtils, errorResolver, pageUtils, commonRoutingService,
            angularMarkdownService, angularHtmlService, cd, trackingProvider, appService, platformService);
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

    getFiltersForType(record: SDocRecord, type: string): any {
        const minPerPage = isNumber(this.showResultListTrigger[type]) ? this.showResultListTrigger[type] : 0;

        return this.contentUtils.getSDocSubItemFiltersForType(record, type,
            (this.pdoc ? this.pdoc.theme : undefined), minPerPage);
    }

    protected configureProcessingOfResolvedData(): void {
        const me = this;
        const config = me.appService.getAppConfig();
        if (BeanUtils.getValue(config, 'components.sdoc-showpage.showBigImages') === true) {
            this.defaultSubImageLayout = Layout.BIG;
        }
        if (BeanUtils.getValue(config, 'components.sdoc-showpage.availableTabs') !== undefined) {
            me.availableTabs = BeanUtils.getValue(config, 'components.sdoc-showpage.availableTabs');
        }
        if (isArray(BeanUtils.getValue(config, 'components.sdoc-showpage.allowedQueryParams'))) {
            const allowedParams = BeanUtils.getValue(config, 'components.sdoc-showpage.allowedQueryParams');
            for (const type in me.showResultListTrigger) {
                const paramName = 'show' + type;
                if (allowedParams.indexOf(paramName) >= 0 && me.queryParamMap && me.queryParamMap.get(paramName)) {
                    me.showResultListTrigger[type] =
                        SDocSearchForm.genericFields.perPage.validator.sanitize(me.queryParamMap.get(paramName));
                }
            }
        }
    }

    protected doProcessAfterResolvedData(): void {
        const me = this;
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
