/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {TrackListFooterComponent} from './track-list-footer.component';
import {TrackRecord} from '../../../model/records/track-record';
import {TrackSearchForm} from '../../../model/forms/track-searchform';
import {TrackSearchResult} from '../../../model/container/track-searchresult';

describe('TrackListFooterComponent', () => {
    let component: TrackListFooterComponent;
    let fixture: ComponentFixture<TrackListFooterComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TrackListFooterComponent],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TrackListFooterComponent);
        component = fixture.componentInstance;
        component.trackSearchResult = new TrackSearchResult(
            new TrackSearchForm({}), 1, [ new TrackRecord({id: 1, name: 'Test'})]);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
