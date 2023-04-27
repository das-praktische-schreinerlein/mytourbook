/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ComponentFactoryResolver, NO_ERRORS_SCHEMA} from '@angular/core';
import {PDocDataServiceStub} from '@dps/mycms-frontend-commons/dist/testing/pdoc-dataservice-stubs';
import {PDocActionsComponent} from './pdoc-actions.component';
import {PDocDynamicComponentService} from '../../services/pdoc-dynamic-components.service';
import {Router} from '@angular/router';
import {RouterStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/router-stubs';
import {PDocDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.service';
import {ToastrService} from 'ngx-toastr';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {AppServiceStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/appservice-stubs';
import {DynamicComponentService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/dynamic-components.service';
import {PDocActionTagService} from '../../services/pdoc-actiontag.service';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {ToastrServiceStub} from '@dps/mycms-frontend-commons/dist/testing/toasts-stubs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PDocContentUtils} from '../../services/pdoc-contentutils.service';

describe('PDocActionsComponent', () => {
    let component: PDocActionsComponent;
    let fixture: ComponentFixture<PDocActionsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PDocActionsComponent],
            imports: [
            ],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: PDocDataService, useValue: new PDocDataServiceStub() },
                { provide: GenericAppService, useValue: new AppServiceStub() },
                { provide: ToastrService, useValue: new ToastrServiceStub() },
                NgbModal,
                PDocDynamicComponentService,
                DynamicComponentService,
                ComponentFactoryResolver,
                PDocActionTagService,
                PDocContentUtils,
                CommonDocRoutingService,
                CommonRoutingService
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PDocActionsComponent);
        component = fixture.componentInstance;
        component.record = PDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
