import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {ErrorResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/error.resolver';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {TourDocSearchResult} from '../../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {AngularMarkdownService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-markdown.service';
import {AngularHtmlService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-html.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {GenericTrackingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/generic-tracking.service';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {TourDocContentUtils} from '../../../shared-tdoc/services/tdoc-contentutils.service';
import {TourDocRoutingService} from '../../../../shared/tdoc-commons/services/tdoc-routing.service';
import {Layout, LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {environment} from '../../../../environments/environment';
import {
    CommonDocEditpageComponent,
    CommonDocEditpageComponentConfig
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-editpage.component';
import {TourDocSearchForm} from '../../../../shared/tdoc-commons/model/forms/tdoc-searchform';

@Component({
    selector: 'app-tdoc-editpage',
    templateUrl: './tdoc-editpage.component.html',
    styleUrls: ['./tdoc-editpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocEditpageComponent
    extends CommonDocEditpageComponent<TourDocRecord, TourDocSearchForm, TourDocSearchResult, TourDocDataService> {
    tracks: TourDocRecord[] = [];
    trackRouten: TourDocRecord[] = [];
    defaultSubImageLayout = Layout.SMALL;
    showResultListTrigger: {
        IMAGE: boolean|number;
        INFO: boolean|number;
        VIDEO: boolean|number;
        LOCATION: boolean|number;
        NEWS: boolean|number;
        ROUTE: boolean|number;
        TOPIMAGE: boolean|number;
        TRACK: boolean|number;
        TRIP: boolean|number;
    } = {
        IMAGE: false,
        INFO: false,
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
        'INFO': true,
        'ROUTE': true,
        'TRACK': true,
        'LOCATION': true,
        'TRIP': true,
        'VIDEO': true,
        'NEWS': true
    };

    constructor(protected route: ActivatedRoute, protected cdocRoutingService: TourDocRoutingService,
                protected toastr: ToastrService, contentUtils: TourDocContentUtils,
                protected errorResolver: ErrorResolver, protected pageUtils: PageUtils,
                protected commonRoutingService: CommonRoutingService, protected angularMarkdownService: AngularMarkdownService,
                protected angularHtmlService: AngularHtmlService, protected cd: ChangeDetectorRef,
                protected trackingProvider: GenericTrackingService, protected appService: GenericAppService,
                protected platformService: PlatformService, protected layoutService: LayoutService,
                protected tdocDataService: TourDocDataService) {
        super(route, cdocRoutingService, toastr, contentUtils, errorResolver, pageUtils, commonRoutingService, angularMarkdownService,
            angularHtmlService, cd, trackingProvider, appService, platformService, layoutService, environment, tdocDataService);
    }

    protected getComponentConfig(config: {}): CommonDocEditpageComponentConfig {
        return {
            baseSearchUrl: ['tdoc'].join('/'),
            baseSearchUrlDefault: ['tdoc'].join('/'),
            editAllowed: (BeanUtils.getValue(config, 'permissions.tdocWritable') === true)
        };
    }

    onTracksFound(searchresult: TourDocSearchResult) {
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

    onTrackRoutenFound(searchresult: TourDocSearchResult) {
        const trackRouten = [];
        if (searchresult !== undefined && searchresult.currentRecords !== undefined) {
            for (const record of searchresult.currentRecords) {
                trackRouten.push(record);
            }
        }
        this.trackRouten = trackRouten;
    }

    getFiltersForType(record: TourDocRecord, type: string): any {
        return (<TourDocContentUtils>this.contentUtils).getTourDocSubItemFiltersForType(record, type,
            (this.pdoc ? this.pdoc.theme : undefined));
    }

    protected doProcessAfterResolvedData(config: {}): void {
        this.trackRouten = [];
        if (this.record !== undefined && (this.record.gpsTrackBasefile || this.record.geoLoc !== undefined)) {
            this.tracks = [this.record];
        } else {
            this.tracks = [];
        }
    }
}
