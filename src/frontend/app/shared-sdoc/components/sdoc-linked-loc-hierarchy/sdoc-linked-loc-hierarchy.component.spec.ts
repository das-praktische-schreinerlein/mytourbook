/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocLinkedLocHierarchyComponent} from './sdoc-linked-loc-hierarchy.component';
import {DomSanitizer} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {SDocRoutingService} from '../../services/sdoc-routing.service';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateModule} from '@ngx-translate/core';
import {SDocDataServiceStub} from '../../../../testing/sdoc-dataservice-stubs';
import {SDocContentUtils} from '../../services/sdoc-contentutils.service';
import {AppServiceStub} from '../../../../testing/appservice-stubs';
import {GenericAppService} from '../../../../shared/search-commons/services/generic-app.service';

describe('SDocLinkedLocComponent', () => {
    let component: SDocLinkedLocHierarchyComponent;
    let fixture: ComponentFixture<SDocLinkedLocHierarchyComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocLinkedLocHierarchyComponent],
            providers: [
                DomSanitizer,
                { provide: Router, useClass: RouterTestingModule },
                SDocRoutingService,
                SDocContentUtils,
                { provide: GenericAppService, useValue: new AppServiceStub() }
            ],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [NgbModule.forRoot(),
                TranslateModule.forRoot()]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocLinkedLocHierarchyComponent);
        component = fixture.componentInstance;
        component.record = SDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
