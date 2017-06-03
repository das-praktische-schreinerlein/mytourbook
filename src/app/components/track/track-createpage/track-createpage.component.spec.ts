/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TrackCreatepageComponent} from './track-createpage.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {TrackDataService} from '../../../services/track-data.service';
import {Router} from '@angular/router';
import {TrackDataStore} from '../../../services/track-data.store';
import {RouterTestingModule} from '@angular/router/testing';

describe('TrackCreatepageComponent', () => {
    let component: TrackCreatepageComponent;
    let fixture: ComponentFixture<TrackCreatepageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TrackCreatepageComponent],
            providers: [TrackDataStore,
                TrackDataService,
                {provide: Router, useClass: RouterTestingModule}
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TrackCreatepageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
