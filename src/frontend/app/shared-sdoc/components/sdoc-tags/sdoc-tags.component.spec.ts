/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocTagsComponent} from './sdoc-tags.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {SDocContentUtils} from '../../services/sdoc-contentutils.service';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {AppServiceStub} from '../../../../shared/angular-commons/testing/appservice-stubs';
import {SDocRoutingService} from '../../services/sdoc-routing.service';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';
import {Router} from '@angular/router';
import {RouterStub} from '../../../../shared/angular-commons/testing/router-stubs';

describe('SDocTagsComponent', () => {
    let component: SDocTagsComponent;
    let fixture: ComponentFixture<SDocTagsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocTagsComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                CommonRoutingService,
                SDocRoutingService,
                SDocContentUtils,
                { provide: GenericAppService, useValue: new AppServiceStub() }
            ],
            imports: [NgbModule.forRoot(),
                TranslateModule.forRoot()]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocTagsComponent);
        component = fixture.componentInstance;
        component.tags = '';
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
