/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TourDocSearchpageComponent} from './tdoc-searchpage.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TourDocSearchFormConverter} from '../../../shared-tdoc/services/tdoc-searchform-converter.service';
import {ToastModule, ToastsManager} from 'ng2-toastr';
import {CommonDocRoutingService} from '../../../../shared/frontend-cdoc-commons/services/cdoc-routing.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ActivatedRouteStub} from '../../../../shared/testing/router-stubs';
import {TourDocDataServiceStub} from '../../../../testing/tdoc-dataservice-stubs';
import {SearchParameterUtils} from '../../../../shared/search-commons/services/searchparameter.utils';
import {ErrorResolver} from '../../../../shared/frontend-cdoc-commons/resolver/error.resolver';
import {PageUtils} from '../../../../shared/angular-commons/services/page.utils';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';
import {RouterStub} from '../../../../shared/angular-commons/testing/router-stubs';
import {Angulartics2} from 'angulartics2';
import {GenericTrackingService} from '../../../../shared/angular-commons/services/generic-tracking.service';
import {Angulartics2Stub} from '../../../../shared/angular-commons/testing/angulartics2-stubs';
import {PlatformService} from '../../../../shared/angular-commons/services/platform.service';
import {LayoutService} from '../../../../shared/angular-commons/services/layout.service';
import {SearchFormUtils} from '../../../../shared/angular-commons/services/searchform-utils.service';
import {TourDocRoutingService} from '../../../../shared/tdoc-commons/services/tdoc-routing.service';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {AppServiceStub} from '../../../../shared/angular-commons/testing/appservice-stubs';

describe('TourDocSearchpageComponent', () => {
    let component: TourDocSearchpageComponent;
    let fixture: ComponentFixture<TourDocSearchpageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TourDocSearchpageComponent],
            imports: [
                ToastModule.forRoot(),
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: TourDocDataService, useValue: new TourDocDataServiceStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: Router, useValue: new RouterStub() },
                CommonRoutingService,
                TourDocSearchFormConverter,
                SearchFormUtils,
                { provide: SearchParameterUtils, useValue: new SearchParameterUtils() },
                CommonDocRoutingService,
                TourDocRoutingService,
                ToastsManager,
                TranslateService,
                ErrorResolver,
                PageUtils,
                { provide: GenericAppService, useValue: new AppServiceStub() },
                PlatformService,
                GenericTrackingService,
                { provide: Angulartics2, useValue: new Angulartics2Stub() },
                LayoutService
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TourDocSearchpageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
