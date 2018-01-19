/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocDataServiceStub} from '../../../../testing/sdoc-dataservice-stubs';
import {SDocListActionsComponent} from './sdoc-listactions.component';

describe('SDocListActionsComponent', () => {
    let component: SDocListActionsComponent;
    let fixture: ComponentFixture<SDocListActionsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocListActionsComponent],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocListActionsComponent);
        component = fixture.componentInstance;
        component.record = SDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
