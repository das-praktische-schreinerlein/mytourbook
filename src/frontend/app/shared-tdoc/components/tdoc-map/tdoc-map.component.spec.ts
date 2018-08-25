/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {TourDocMapComponent} from './tdoc-map.component';
import {AppServiceStub} from '../../../../shared/angular-commons/testing/appservice-stubs';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {Router} from '@angular/router';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';
import {CommonDocRoutingService} from '../../../../shared/frontend-cdoc-commons/services/cdoc-routing.service';
import {RouterStub} from '../../../../shared/angular-commons/testing/router-stubs';
import {PlatformService} from '../../../../shared/angular-commons/services/platform.service';
import {TourDocContentUtils} from '../../services/tdoc-contentutils.service';

describe('TourDocMapComponent', () => {
    let component: TourDocMapComponent;
    let fixture: ComponentFixture<TourDocMapComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TourDocMapComponent],
            imports: [ReactiveFormsModule],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                PlatformService,
                CommonRoutingService,
                CommonDocRoutingService,
                TourDocContentUtils,
                { provide: GenericAppService, useValue: new AppServiceStub() }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TourDocMapComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
