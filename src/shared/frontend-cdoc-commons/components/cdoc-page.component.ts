import {ChangeDetectorRef, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastsManager} from 'ng2-toastr';
import {CommonDocRecord} from '../../search-commons/model/records/cdoc-entity-record';
import {CommonDocSearchForm} from '../../search-commons/model/forms/cdoc-searchform';
import {CommonDocSearchResult} from '../../search-commons/model/container/cdoc-searchresult';
import {CommonDocDataService} from '../../search-commons/services/cdoc-data.service';
import {PageUtils} from '../../angular-commons/services/page.utils';
import {GenericTrackingService} from '../../angular-commons/services/generic-tracking.service';
import {AppState, GenericAppService} from '../../commons/services/generic-app.service';
import {LayoutService, LayoutSizeData} from '../../angular-commons/services/layout.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {PlatformService} from '../../angular-commons/services/platform.service';
import {CommonEnvironment} from '../common-environment';
import {PDocRecord} from '../../pdoc-commons/model/records/pdoc-record';

export abstract class AbstractCDocPageComponent <R extends CommonDocRecord, F extends CommonDocSearchForm,
    S extends CommonDocSearchResult<R, F>, D extends CommonDocDataService<R, F, S>> implements OnInit, OnDestroy {
    protected config;
    protected initialized = false;
    protected layoutSizeObservable: BehaviorSubject<LayoutSizeData>;

    showLoadingSpinner = false;
    baseSearchUrl: string;
    baseSearchUrlDefault: string;

    constructor(protected route: ActivatedRoute, protected toastr: ToastsManager, vcr: ViewContainerRef,
                protected pageUtils: PageUtils, protected cd: ChangeDetectorRef, protected trackingProvider: GenericTrackingService,
                protected appService: GenericAppService, protected platformService: PlatformService,
                protected layoutService: LayoutService, protected environment: CommonEnvironment) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        // reset initialized
        this.initialized = false;
        const me = this;

        this.layoutSizeObservable = this.layoutService.getLayoutSizeData();
        this.layoutSizeObservable.subscribe(layoutSizeData => {
            me.onResize(layoutSizeData);
        });

        this.appService.getAppState().subscribe(appState => {
            if (appState === AppState.Ready) {
                me.config = me.appService.getAppConfig();
                me.configureComponent(me.config);
                me.configureProcessing(me.config);
            }
        });
    }

    ngOnDestroy() {
    }

    onScrollToTop() {
        this.pageUtils.scrollToTop();
    }

    protected onResize(layoutSizeData: LayoutSizeData): void {
    }

    protected abstract configureComponent(config: {}): void;

    protected abstract configureProcessing(config: {}): void;

    protected abstract processError(data: any): boolean;

    protected abstract setMetaTags(config: {}, pdoc: PDocRecord, record: CommonDocRecord): void;

    protected abstract setPageLayoutAndStyles(): void;
}
