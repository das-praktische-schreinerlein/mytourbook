/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {TrackRecord} from '../../../model/records/track-record';
import {TrackSearchForm} from '../../../model/forms/track-searchform';
import {TrackSearchResult} from '../../../model/container/track-searchresult';
import {TrackListHeaderComponent} from './track-list-header.component';

describe('TrackListHeaderComponent', () => {
    let component: TrackListHeaderComponent;
    let fixture: ComponentFixture<TrackListHeaderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TrackListHeaderComponent],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TrackListHeaderComponent);
        component = fixture.componentInstance;
        component.trackSearchResult = new TrackSearchResult(
            new TrackSearchForm({}), 1, [ new TrackRecord({id: 1, name: 'Test'})]);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
