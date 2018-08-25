/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {TourDocProfileMapComponent} from './tdoc-profilemap.component';
import {AppServiceStub} from '../../../../shared/angular-commons/testing/appservice-stubs';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {PlatformService} from '../../../../shared/angular-commons/services/platform.service';
import {CommonDocRoutingService} from '../../../../shared/frontend-cdoc-commons/services/cdoc-routing.service';
import {RouterStub} from '../../../../shared/angular-commons/testing/router-stubs';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';
import {Router} from '@angular/router';
import {TourDocContentUtils} from '../../services/tdoc-contentutils.service';

describe('TourDocProfileMapComponent', () => {
    let component: TourDocProfileMapComponent;
    let fixture: ComponentFixture<TourDocProfileMapComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TourDocProfileMapComponent],
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
        fixture = TestBed.createComponent(TourDocProfileMapComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
