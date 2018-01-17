/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocDataServiceStub} from '../../../../testing/sdoc-dataservice-stubs';
import {SDocActionsComponent} from './sdoc-actions.component';

describe('SDocActionsComponent', () => {
    let component: SDocActionsComponent;
    let fixture: ComponentFixture<SDocActionsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocActionsComponent],
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
