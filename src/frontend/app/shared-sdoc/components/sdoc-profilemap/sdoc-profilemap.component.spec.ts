/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {SDocProfileMapComponent} from './sdoc-profilemap.component';
import {AppServiceStub} from '../../../../shared/angular-commons/testing/appservice-stubs';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {PlatformService} from '../../../../shared/angular-commons/services/platform.service';
import {SDocRoutingService} from '../../services/sdoc-routing.service';
import {SDocContentUtils} from '../../services/sdoc-contentutils.service';
import {RouterStub} from '../../../../shared/angular-commons/testing/router-stubs';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';
import {Router} from '@angular/router';

describe('SDocProfileMapComponent', () => {
    let component: SDocProfileMapComponent;
    let fixture: ComponentFixture<SDocProfileMapComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocProfileMapComponent],
            imports: [ReactiveFormsModule],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                PlatformService,
                CommonRoutingService,
                SDocRoutingService,
                SDocContentUtils,
                { provide: GenericAppService, useValue: new AppServiceStub() }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocProfileMapComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
