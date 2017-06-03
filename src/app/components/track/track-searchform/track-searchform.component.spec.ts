/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TrackSearchformComponent} from './track-searchform.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {TrackSearchForm} from '../../../model/forms/track-searchform';

describe('TrackSearchformComponent', () => {
    let component: TrackSearchformComponent;
    let fixture: ComponentFixture<TrackSearchformComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TrackSearchformComponent],
            imports: [ReactiveFormsModule],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TrackSearchformComponent);
        component = fixture.componentInstance;
        component.trackSearchForm = new TrackSearchForm({fulltext: 'Test1'});
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
