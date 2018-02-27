/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {IntervalControlComponent} from './interval-control.component';

describe('IntervalControlComponent', () => {
    let component: IntervalControlComponent;
    let fixture: ComponentFixture<IntervalControlComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IntervalControlComponent],
            imports: [],
            providers: [
                FormBuilder
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IntervalControlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
