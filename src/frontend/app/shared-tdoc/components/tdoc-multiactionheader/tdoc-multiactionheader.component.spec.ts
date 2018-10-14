/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {TourDocDataServiceStub} from '../../../../testing/tdoc-dataservice-stubs';
import {TourDocMultiActionHeaderComponent} from './tdoc-multiactionheader.component';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {AppServiceStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/appservice-stubs';
import {TourDocContentUtils} from '../../services/tdoc-contentutils.service';
import {TourDocActionTagService} from '../../services/tdoc-actiontag.service';
import {TourDocRoutingService} from '../../../../shared/tdoc-commons/services/tdoc-routing.service';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {Router} from '@angular/router';
import {RouterStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/router-stubs';

describe('TourDocMultiActionHeaderComponent', () => {
    let component: TourDocMultiActionHeaderComponent;
    let fixture: ComponentFixture<TourDocMultiActionHeaderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TourDocMultiActionHeaderComponent],
            imports: [
            ],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: TourDocDataService, useValue: new TourDocDataServiceStub() },
                { provide: GenericAppService, useValue: new AppServiceStub() },
                TourDocRoutingService,
                TourDocActionTagService,
                TourDocContentUtils,
                CommonDocRoutingService,
                CommonRoutingService
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TourDocMultiActionHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
