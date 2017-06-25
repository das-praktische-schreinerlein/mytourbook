/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SDocEditformComponent} from './sdoc-editform.component';
import {SDocRecord} from '../../../sdocshared/model/records/sdoc-record';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {ToastModule, ToastsManager} from 'ng2-toastr';

describe('SDocEditformComponent', () => {
    let component: SDocEditformComponent;
    let fixture: ComponentFixture<SDocEditformComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocEditformComponent],
            imports: [ReactiveFormsModule, ToastModule.forRoot()],
            providers: [ToastsManager],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocEditformComponent);
        component = fixture.componentInstance;
        component.record = new SDocRecord({id: '1', name: 'Test'});
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
