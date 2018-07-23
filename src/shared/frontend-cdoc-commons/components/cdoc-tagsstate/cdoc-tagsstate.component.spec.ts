/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {CDocTagsStateComponent} from './cdoc-tagsstate.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {CommonDocContentUtils} from '../../services/cdoc-contentutils.service';
import {GenericAppService} from '../../../commons/services/generic-app.service';
import {AppServiceStub} from '../../../angular-commons/testing/appservice-stubs';
import {CommonDocRoutingService} from '../../services/cdoc-routing.service';
import {CommonRoutingService} from '../../../angular-commons/services/common-routing.service';
import {Router} from '@angular/router';
import {RouterStub} from '../../../angular-commons/testing/router-stubs';

describe('CDocTagsStateComponent', () => {
    let component: CDocTagsStateComponent;
    let fixture: ComponentFixture<CDocTagsStateComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CDocTagsStateComponent],
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
        fixture = TestBed.createComponent(CDocTagsStateComponent);
        component = fixture.componentInstance;
        component.tags = '';
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
