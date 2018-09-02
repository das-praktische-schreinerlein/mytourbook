/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TourDocInlineSearchpageComponent} from './tdoc-inline-searchpage.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TourDocDataStore, TourDocTeamFilterConfig} from '../../../../shared/tdoc-commons/services/tdoc-data.store';
import {AppServiceStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/appservice-stubs';
import {TourDocSearchFormConverter} from '../../services/tdoc-searchform-converter.service';
import {ToastModule, ToastsManager} from 'ng2-toastr';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {TranslateModule} from '@ngx-translate/core';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {ActivatedRouteStub} from '@dps/mycms-frontend-commons/dist/testing/router-stubs';
import {TourDocDataServiceStub} from '../../../../testing/tdoc-dataservice-stubs';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {RouterStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/router-stubs';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {TourDocRoutingService} from '../../../../shared/tdoc-commons/services/tdoc-routing.service';

describe('TourDocInlineSearchpageComponent', () => {
    let component: TourDocInlineSearchpageComponent;
    let fixture: ComponentFixture<TourDocInlineSearchpageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TourDocInlineSearchpageComponent],
            imports: [ToastModule.forRoot(),
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: TourDocDataStore, useValue: new TourDocDataStore(new SearchParameterUtils(), new TourDocTeamFilterConfig()) },
                { provide: GenericAppService, useValue: new AppServiceStub() },
                { provide: TourDocDataService, useValue: new TourDocDataServiceStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: Router, useValue: new RouterStub() },
                CommonRoutingService,
                SearchFormUtils,
                TourDocSearchFormConverter,
                { provide: SearchParameterUtils, useValue: new SearchParameterUtils() },
                CommonDocRoutingService,
                TourDocRoutingService,
                ToastsManager,
                PageUtils
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TourDocInlineSearchpageComponent);
        component = fixture.componentInstance;
        component.params = {};
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
