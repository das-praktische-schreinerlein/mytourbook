import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewContainerRef} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {ActivatedRoute} from '@angular/router';
import {ToastsManager} from 'ng2-toastr';
import {ErrorResolver} from '../../../../shared/frontend-cdoc-commons/resolver/error.resolver';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {PageUtils} from '../../../../shared/angular-commons/services/page.utils';
import {SDocSearchResult} from '../../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {AngularMarkdownService} from '../../../../shared/angular-commons/services/angular-markdown.service';
import {AngularHtmlService} from '../../../../shared/angular-commons/services/angular-html.service';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';
import {GenericTrackingService} from '../../../../shared/angular-commons/services/generic-tracking.service';
import {PlatformService} from '../../../../shared/angular-commons/services/platform.service';
import {SDocDataService} from '../../../../shared/sdoc-commons/services/sdoc-data.service';
import {BeanUtils} from '../../../../shared/commons/utils/bean.utils';
import {SDocContentUtils} from '../../../shared-sdoc/services/sdoc-contentutils.service';
import {SDocRoutingService} from '../../../../shared/sdoc-commons/services/sdoc-routing.service';
import {LayoutService} from '../../../../shared/angular-commons/services/layout.service';
import {environment} from '../../../../environments/environment';
import {
    AbstractCommonDocEditpageComponent,
    CommonDocEditpageComponentConfig
} from '../../../../shared/frontend-cdoc-commons/components/cdoc-editpage.component';
import {SDocSearchForm} from '../../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {Layout} from '../../../../../shared/angular-commons/services/layout.service';

@Component({
    selector: 'app-sdoc-editpage',
    templateUrl: './sdoc-editpage.component.html',
    styleUrls: ['./sdoc-editpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocEditpageComponent
    extends AbstractCommonDocEditpageComponent<SDocRecord, SDocSearchForm, SDocSearchResult, SDocDataService> {
    tracks: SDocRecord[] = [];
    trackRouten: SDocRecord[] = [];
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

    constructor(protected route: ActivatedRoute, protected cdocRoutingService: SDocRoutingService,
                protected toastr: ToastsManager, vcr: ViewContainerRef, contentUtils: SDocContentUtils,
                protected errorResolver: ErrorResolver, protected pageUtils: PageUtils,
                protected commonRoutingService: CommonRoutingService, protected angularMarkdownService: AngularMarkdownService,
                protected angularHtmlService: AngularHtmlService, protected cd: ChangeDetectorRef,
                protected trackingProvider: GenericTrackingService, protected appService: GenericAppService,
                protected platformService: PlatformService, protected layoutService: LayoutService,
                protected sdocDataService: SDocDataService) {
        super(route, cdocRoutingService, toastr, vcr, contentUtils, errorResolver, pageUtils, commonRoutingService, angularMarkdownService,
            angularHtmlService, cd, trackingProvider, appService, platformService, layoutService, environment, sdocDataService);
    }

    protected getComponentConfig(config: {}): CommonDocEditpageComponentConfig {
        return {
            baseSearchUrl: ['sdoc'].join('/'),
            baseSearchUrlDefault: ['sdoc'].join('/'),
            editAllowed: (BeanUtils.getValue(config, 'permissions.sdocWritable') === true)
        };
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

    getFiltersForType(record: SDocRecord, type: string): any {
        return (<SDocContentUtils>this.contentUtils).getSDocSubItemFiltersForType(record, type,
            (this.pdoc ? this.pdoc.theme : undefined));
    }

    protected doProcessAfterResolvedData(config: {}): void {
        this.trackRouten = [];
        if (this.record !== undefined && this.record.gpsTrackBasefile || this.record.geoLoc !== undefined) {
            this.tracks = [this.record];
        } else {
            this.tracks = [];
        }
    }
}
