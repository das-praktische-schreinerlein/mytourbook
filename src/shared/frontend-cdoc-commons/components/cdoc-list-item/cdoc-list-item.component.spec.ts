/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {CDocListItemComponent} from './cdoc-list-item.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {CommonDocRoutingService} from '../../../frontend-cdoc-commons/services/cdoc-routing.service';
import {TranslateModule} from '@ngx-translate/core';
import {CommonDocContentUtils} from '../../../frontend-cdoc-commons/services/cdoc-contentutils.service';
import {AppServiceStub} from '../../../angular-commons/testing/appservice-stubs';
import {GenericAppService} from '../../../commons/services/generic-app.service';
import {CommonRoutingService} from '../../../angular-commons/services/common-routing.service';
import {RouterStub} from '../../../angular-commons/testing/router-stubs';
import {DatePipe} from '@angular/common';
import {CommonDocDataServiceStub} from '../../../testing/cdoc-dataservice-stubs';
import {LayoutService} from '../../../angular-commons/services/layout.service';

describe('CDocListItemComponent', () => {
    let component: CDocListItemComponent;
    let fixture: ComponentFixture<CDocListItemComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CDocListItemComponent],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                CommonRoutingService,
                CommonDocRoutingService,
                CommonDocContentUtils,
                LayoutService,
                DatePipe,
                { provide: GenericAppService, useValue: new AppServiceStub() }
            ],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [NgbModule.forRoot(),
                TranslateModule.forRoot()]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CDocListItemComponent);
        component = fixture.componentInstance;
        component.record = CommonDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
