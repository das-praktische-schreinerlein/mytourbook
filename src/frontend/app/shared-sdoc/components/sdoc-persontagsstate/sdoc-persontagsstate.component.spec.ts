/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {SDocPersontagsstateComponent} from './sdoc-persontagsstate.component';
import {RouterStub} from '../../../../shared/angular-commons/testing/router-stubs';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';
import {CommonDocRoutingService} from '../../../../shared/frontend-cdoc-commons/services/cdoc-routing.service';
import {CommonDocContentUtils} from '../../../../shared/frontend-cdoc-commons/services/cdoc-contentutils.service';
import {AppServiceStub} from '../../../../shared/angular-commons/testing/appservice-stubs';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';

describe('SDocPersonTagsStateComponent', () => {
    let component: SDocPersontagsstateComponent;
    let fixture: ComponentFixture<SDocPersontagsstateComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocPersontagsstateComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                CommonRoutingService,
                CommonDocRoutingService,
                CommonDocContentUtils,
                { provide: GenericAppService, useValue: new AppServiceStub() }
            ],
            imports: [NgbModule.forRoot(),
                TranslateModule.forRoot()]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocPersontagsstateComponent);
        component = fixture.componentInstance;
        component.keywords = '';
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
