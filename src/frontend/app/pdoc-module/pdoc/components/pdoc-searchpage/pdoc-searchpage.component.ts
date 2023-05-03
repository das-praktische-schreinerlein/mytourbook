import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef} from '@angular/core';
import {PDocDataService} from '@dps/mycms-commons/dist/pdoc-commons//services/pdoc-data.service';
import {PDocRecord} from '@dps/mycms-commons/dist/pdoc-commons/model/records/pdoc-record';
import {ActivatedRoute} from '@angular/router';
import {PDocSearchForm} from '@dps/mycms-commons/dist/pdoc-commons/model/forms/pdoc-searchform';
import {PDocSearchResult} from '@dps/mycms-commons/dist/pdoc-commons/model/container/pdoc-searchresult';
import {PDocSearchFormConverter} from '../../../shared-pdoc/services/pdoc-searchform-converter.service';
import {ToastrService} from 'ngx-toastr';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {ErrorResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/error.resolver';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {GenericTrackingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/generic-tracking.service';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {
    CommonDocSearchpageComponent,
    CommonDocSearchpageComponentConfig
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-searchpage.component';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {environment} from '../../../../../environments/environment';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {PDocActionTagService} from '../../../shared-pdoc/services/pdoc-actiontag.service';
import {PDocSearchFormUtils} from '../../../shared-pdoc/services/pdoc-searchform-utils.service';
import {CommonDocMultiActionManager} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-multiaction.manager';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {Location} from '@angular/common';
import {PDocRoutingService} from '../../../shared-pdoc/services/pdoc-routing.service';

export interface PDocSearchpageComponentConfig extends CommonDocSearchpageComponentConfig {
}

@Component({
    selector: 'app-pdoc-searchpage',
    templateUrl: './pdoc-searchpage.component.html',
    styleUrls: ['./pdoc-searchpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PDocSearchpageComponent extends CommonDocSearchpageComponent<PDocRecord, PDocSearchForm, PDocSearchResult,
    PDocDataService> {
    constructor(route: ActivatedRoute, commonRoutingService: CommonRoutingService, errorResolver: ErrorResolver,
                pdocDataService: PDocDataService, searchFormConverter: PDocSearchFormConverter,
                protected cdocRoutingService: PDocRoutingService, toastr: ToastrService, pageUtils: PageUtils,
                cd: ChangeDetectorRef, trackingProvider: GenericTrackingService, appService: GenericAppService,
                platformService: PlatformService, layoutService: LayoutService, searchFormUtils: SearchFormUtils,
                pdocSearchFormUtils: PDocSearchFormUtils, protected actionService: PDocActionTagService,
                protected elRef: ElementRef, location: Location) {
        super(route, commonRoutingService, errorResolver, pdocDataService, searchFormConverter, cdocRoutingService,
            toastr, pageUtils, cd, trackingProvider, appService, platformService, layoutService, searchFormUtils,
            pdocSearchFormUtils, new CommonDocMultiActionManager(appService, actionService), environment, location);
    }

    onCreateNewRecord(type: string) {
        this.cdocRoutingService.navigateToCreate(type, null, null);
        return false;
    }

    protected getComponentConfig(config: {}): PDocSearchpageComponentConfig {
        return {
            maxAllowedM3UExportItems: 0,
            baseSearchUrl: ['pdoc'].join('/'),
            baseSearchUrlDefault: ['pdoc'].join('/'),
            availableCreateActionTypes: BeanUtils.getValue(config, 'components.pdoc-searchpage.availableCreateActionTypes'),
            defaultLayoutPerType: BeanUtils.getValue(config, 'components.pdoc-searchpage.defaultLayoutPerType')
        };
    }

    protected configureComponent(config: {}): void {
        super.configureComponent(config);
        const componentConfig = this.getComponentConfig(config);
        this.defaultLayoutPerType = componentConfig.defaultLayoutPerType;
    }

    protected doPreChecksBeforeSearch(): boolean {
        if ((this.searchForm.type === undefined || this.searchForm.type === '')
            && environment.pdocEmptyDefaultSearchTypes !== undefined && environment.pdocEmptyDefaultSearchTypes !== '') {
            this.searchForm.type = environment.pdocEmptyDefaultSearchTypes;
            return this.redirectToSearch();
        }

        return super.doPreChecksBeforeSearch();
    }
}
