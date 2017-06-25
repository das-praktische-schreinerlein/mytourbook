/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SDocCreateformComponent} from './sdoc-createform.component';
import {SDocRecord} from '../../../sdocshared/model/records/sdoc-record';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

describe('SDocCreateformComponent', () => {
    let component: SDocCreateformComponent;
    let fixture: ComponentFixture<SDocCreateformComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocCreateformComponent],
            imports: [ReactiveFormsModule],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocCreateformComponent);
        component = fixture.componentInstance;
        component.record = new SDocRecord({id: '1', name: 'Test'});
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
