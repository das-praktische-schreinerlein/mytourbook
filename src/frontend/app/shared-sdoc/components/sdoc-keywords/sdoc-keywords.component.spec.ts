/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocKeywordsComponent} from './sdoc-keywords.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {SDocDataServiceStub} from '../../../../testing/sdoc-dataservice-stubs';
import {CDocContentUtils} from '../../services/cdoc-contentutils.service';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {AppServiceStub} from '../../../../shared/angular-commons/testing/appservice-stubs';
import {CommonDocRoutingService} from '../../services/cdoc-routing.service';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';
import {Router} from '@angular/router';
import {RouterStub} from '../../../../shared/angular-commons/testing/router-stubs';

describe('SDocKeywordsComponent', () => {
    let component: SDocKeywordsComponent;
    let fixture: ComponentFixture<SDocKeywordsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocKeywordsComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                CommonRoutingService,
                CommonDocRoutingService,
                CDocContentUtils,
                { provide: GenericAppService, useValue: new AppServiceStub() }
            ],
            imports: [NgbModule.forRoot(),
                TranslateModule.forRoot()]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocKeywordsComponent);
        component = fixture.componentInstance;
        component.record = SDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
