/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {TourDocListItemThinComponent} from './tdoc-list-item-thin.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {CommonDocRoutingService} from '../../../../shared/frontend-cdoc-commons/services/cdoc-routing.service';
import {TranslateModule} from '@ngx-translate/core';
import {CommonDocContentUtils} from '../../../../shared/frontend-cdoc-commons/services/cdoc-contentutils.service';
import {AppServiceStub} from '../../../../shared/angular-commons/testing/appservice-stubs';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';
import {RouterStub} from '../../../../shared/angular-commons/testing/router-stubs';
import {LayoutService} from '../../../../shared/angular-commons/services/layout.service';
import {CommonDocDataServiceStub} from '../../../../shared/testing/cdoc-dataservice-stubs';
import {TourDocContentUtils} from '../../services/tdoc-contentutils.service';

describe('TourDocListItemThinComponent', () => {
    let component: TourDocListItemThinComponent;
    let fixture: ComponentFixture<TourDocListItemThinComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TourDocListItemThinComponent],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                CommonRoutingService,
                CommonDocRoutingService,
                CommonDocContentUtils,
                TourDocContentUtils,
                { provide: GenericAppService, useValue: new AppServiceStub() },
                LayoutService
            ],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [NgbModule.forRoot(),
                TranslateModule.forRoot()]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TourDocListItemThinComponent);
        component = fixture.componentInstance;
        component.record = CommonDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
