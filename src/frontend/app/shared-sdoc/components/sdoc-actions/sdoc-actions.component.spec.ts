/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ComponentFactoryResolver, NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocDataServiceStub} from '../../../../testing/sdoc-dataservice-stubs';
import {SDocActionsComponent} from './sdoc-actions.component';
import {SDocDynamicComponentService} from '../../services/sdoc-dynamic-components.service';
import {ActivatedRoute, Router} from '@angular/router';
import {RouterStub} from '../../../../../shared/angular-commons/testing/router-stubs';
import {SDocDataService} from '../../../../shared/sdoc-commons/services/sdoc-data.service';
import {TranslateModule} from '@ngx-translate/core';
import {GenericAppService} from '../../../../../shared/commons/services/generic-app.service';
import {ToastModule, ToastsManager} from 'ng2-toastr';
import {SDocContentUtils} from '../../services/sdoc-contentutils.service';
import {SDocRoutingService} from '../../services/sdoc-routing.service';
import {DatePipe} from '@angular/common';
import {PlatformService} from '../../../../../shared/angular-commons/services/platform.service';
import {AppServiceStub} from '../../../../../shared/angular-commons/testing/appservice-stubs';
import {ActivatedRouteStub} from '../../../../testing/router-stubs';
import {CommonRoutingService} from '../../../../../shared/angular-commons/services/common-routing.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MarkdownModule} from 'angular2-markdown';

describe('SDocActionsComponent', () => {
    let component: SDocActionsComponent;
    let fixture: ComponentFixture<SDocActionsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocActionsComponent],
            imports: [
                ToastModule.forRoot()
            ],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: SDocDataService, useValue: new SDocDataServiceStub() },
                ToastsManager,
                SDocDynamicComponentService,
                ComponentFactoryResolver
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocActionsComponent);
        component = fixture.componentInstance;
        component.record = SDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
