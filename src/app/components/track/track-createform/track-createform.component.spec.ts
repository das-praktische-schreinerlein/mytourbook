/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TrackCreateformComponent} from './track-createform.component';
import {TrackRecord} from '../../../model/records/track-record';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

describe('TrackCreateformComponent', () => {
    let component: TrackCreateformComponent;
    let fixture: ComponentFixture<TrackCreateformComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TrackCreateformComponent],
            imports: [ReactiveFormsModule],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TrackCreateformComponent);
        component = fixture.componentInstance;
        component.track = new TrackRecord({id: 1, name: 'Test'});
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
