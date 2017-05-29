/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TrackSearchpageComponent} from './track-searchpage.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {TrackDataService} from '../../../services/track-data.service';
import {Router, RouterModule} from '@angular/router';
import {GenericDataStore} from '../../../services/generic-data.store';

describe('TrackSearchpageComponent', () => {
    let component: TrackSearchpageComponent;
    let fixture: ComponentFixture<TrackSearchpageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TrackSearchpageComponent],
            providers: [GenericDataStore,
                TrackDataService,
                {provide: Router, useClass: RouterModule}
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TrackSearchpageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
