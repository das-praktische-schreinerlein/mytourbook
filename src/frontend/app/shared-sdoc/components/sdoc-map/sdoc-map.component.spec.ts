/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {SDocMapComponent} from './sdoc-map.component';
import {AppServiceStub} from '../../../../shared/angular-commons/testing/appservice-stubs';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {SDocContentUtils} from '../../services/sdoc-contentutils.service';
import {DomSanitizer} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';
import {SDocRoutingService} from '../../services/sdoc-routing.service';
import {RouterStub} from '../../../../shared/angular-commons/testing/router-stubs';
import {PlatformService} from '../../../../shared/angular-commons/services/platform.service';

describe('SDocMapComponent', () => {
    let component: SDocMapComponent;
    let fixture: ComponentFixture<SDocMapComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocMapComponent],
            imports: [ReactiveFormsModule],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                DomSanitizer,
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
        fixture = TestBed.createComponent(SDocMapComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
