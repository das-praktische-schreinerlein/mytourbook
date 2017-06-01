/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {TrackListComponent} from './track-list.component';
import {TrackRecord} from '../../../model/records/track-record';
import {TrackSearchResult} from '../../../model/container/track-searchresult';
import {TrackSearchForm} from '../../../model/forms/track-searchform';

describe('TrackListComponent', () => {
    let component: TrackListComponent;
    let fixture: ComponentFixture<TrackListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TrackListComponent],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TrackListComponent);
        component = fixture.componentInstance;
        component.trackSearchResult = new TrackSearchResult(
            new TrackSearchForm({}), 1, [ new TrackRecord({id: 1, name: 'Test'})]);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
